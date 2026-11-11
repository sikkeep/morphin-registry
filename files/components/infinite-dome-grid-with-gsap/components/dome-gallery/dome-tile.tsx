import { useImperativeHandle, useRef, type Ref } from 'react';
import type { Project } from '@/data/projects';
import type { TilePose } from '@/lib/dome';
import { CardCaption, formatMeta } from './card-caption';

/** Everything needed to redraw a tile pixel-for-pixel somewhere else. */
export interface TileSnapshot {
  pose: TilePose;
  width: number;
  height: number;
  radius: number;
  /** Opacity of the black shade over the card. */
  shade: number;
  /** Opacity of the title/meta caption. */
  caption: number;
}

/**
 * Imperative surface the gallery ticker drives every frame. Tiles are recycled
 * as they wrap around the dome, so their content is swapped through this
 * handle instead of React state — no re-render while dragging.
 */
export interface DomeTileHandle {
  root: HTMLButtonElement | null;
  /** Index of the project currently shown, -1 before the first frame. */
  index: number;
  project: Project | null;
  /** Live pose, written by the ticker every frame. */
  pose: TilePose;
  shade: number;
  caption: number;
  setProject(project: Project, index: number): void;
  /** 0 = under the cursor spotlight, 1 = fully in the dark. */
  setFalloff(falloff: number): void;
  /** Hides the tile while the modal stands in for it (synchronous, no ticker). */
  setStandIn(active: boolean): void;
}

/** Spotlight falloff → shade / caption opacity. Single source of truth. */
export const shadeFor = (falloff: number) => Math.pow(falloff, 0.9) * 0.8;
export const captionFor = (falloff: number) => Math.max(0.12, 1 - falloff * 1.5);

interface DomeTileProps {
  width: number;
  height: number;
  radius: number;
  onSelect: (handle: DomeTileHandle, event: React.MouseEvent) => void;
  ref?: Ref<DomeTileHandle>;
}

export function DomeTile({ width, height, radius, onSelect, ref }: DomeTileProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLSpanElement>(null);
  const handleRef = useRef<DomeTileHandle>(null);

  useImperativeHandle(ref, () => {
    const handle: DomeTileHandle = {
      get root() {
        return rootRef.current;
      },
      index: -1,
      project: null,
      pose: { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0 },
      shade: 0,
      caption: 1,
      setProject(project, index) {
        handle.index = index;
        handle.project = project;
        if (imageRef.current) {
          imageRef.current.src = project.image;
          imageRef.current.alt = project.alt;
        }
        if (titleRef.current) titleRef.current.textContent = project.title;
        if (metaRef.current) metaRef.current.textContent = formatMeta(project.category, project.year);
        rootRef.current?.setAttribute('aria-label', `Open ${project.title}`);
      },
      setFalloff(falloff) {
        handle.shade = shadeFor(falloff);
        handle.caption = captionFor(falloff);
        if (shadeRef.current) shadeRef.current.style.opacity = String(handle.shade);
        if (captionRef.current) captionRef.current.style.opacity = String(handle.caption);
      },
      setStandIn(active) {
        if (rootRef.current) rootRef.current.style.opacity = active ? '0' : '';
      },
    };
    handleRef.current = handle;
    return handle;
  }, []);

  return (
    <button
      ref={rootRef}
      type="button"
      tabIndex={-1}
      onClick={(event) => handleRef.current && onSelect(handleRef.current, event)}
      className="absolute top-1/2 left-1/2 block overflow-hidden bg-neutral-900 backface-hidden will-change-transform outline-none select-none"
      style={{ width, height, marginLeft: -width / 2, marginTop: -height / 2, borderRadius: radius }}
    >
      <img
        ref={imageRef}
        alt=""
        draggable={false}
        decoding="async"
        className="pointer-events-none size-full object-cover"
      />
      <CardCaption ref={captionRef} titleRef={titleRef} metaRef={metaRef} />
      <div ref={shadeRef} aria-hidden className="pointer-events-none absolute inset-0 bg-black opacity-0" />
    </button>
  );
}
