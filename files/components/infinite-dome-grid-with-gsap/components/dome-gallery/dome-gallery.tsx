import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import type { Project } from '@/data/projects';
import {
  getDomeLayout,
  isOffscreen,
  itemIndexAt,
  lightFalloff,
  poseTransform,
  sampleSurface,
  screenToPlanar,
  wrapCentered,
  writePose,
  type Focus,
} from '@/lib/dome';
import { prefersReducedMotion } from '@/lib/motion';
import { useInfiniteDrag } from '@/hooks/use-infinite-drag';
import { usePointerFocus } from '@/hooks/use-pointer-focus';
import { useViewport } from '@/hooks/use-viewport';
import { DomeTile, type DomeTileHandle, type TileSnapshot } from './dome-tile';
import { ProjectModal } from './project-modal';

interface DomeGalleryProps {
  projects: Project[];
}

interface ActiveProject {
  project: Project;
  tile: DomeTileHandle;
}

export function DomeGallery({ projects }: DomeGalleryProps) {
  const viewport = useViewport();
  const layout = useMemo(() => getDomeLayout(viewport.width, viewport.height), [viewport]);
  const tileCount = layout.cols * layout.rows;

  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<(DomeTileHandle | null)[]>([]);
  /** Last planar centre per tile — used to find the tile nearest the centre. */
  const planarRef = useRef<Float32Array>(new Float32Array(0));
  const layoutRef = useRef(layout);

  const [active, setActive] = useState<ActiveProject | null>(null);
  const drag = useInfiniteDrag(stageRef, { enabled: active === null });
  const focus = usePointerFocus(stageRef, { enabled: active === null });

  // Keep the visual position stable when cell size changes on resize.
  useLayoutEffect(() => {
    const prev = layoutRef.current;
    if (prev !== layout) {
      const s = drag.state.current;
      const rx = layout.cellWidth / prev.cellWidth;
      const ry = layout.cellHeight / prev.cellHeight;
      s.x *= rx;
      s.targetX *= rx;
      s.y *= ry;
      s.targetY *= ry;
    }
    layoutRef.current = layout;
    tilesRef.current.length = tileCount;
    planarRef.current = new Float32Array(tileCount * 2);
  }, [layout, tileCount, drag.state]);

  // Single render loop: lift every recycled tile onto the bowl + cursor lens.
  useEffect(() => {
    const lens: Focus = { x: 0, y: 0, strength: 0 };

    const render = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 64) / 1000;
      drag.step(dt);
      focus.step(dt);

      const L = layoutRef.current;
      const { cols, rows, cellWidth, cellHeight } = L;
      const { x: ox, y: oy } = drag.state.current;
      const f = focus.state.current;
      const totalW = cols * cellWidth;
      const totalH = rows * cellHeight;
      const planar = planarRef.current;
      const count = projects.length;

      // Cursor is in screen space; place the lens where it lands on the plane.
      const p = screenToPlanar(f.x, f.y, f.strength, L);
      lens.x = p.x;
      lens.y = p.y;
      lens.strength = f.strength;

      for (let i = 0; i < tilesRef.current.length; i++) {
        const tile = tilesRef.current[i];
        const el = tile?.root;
        if (!tile || !el) continue;

        const c = i % cols;
        const r = (i / cols) | 0;
        const x = wrapCentered(c * cellWidth + ox, totalW);
        const y = wrapCentered(r * cellHeight + oy, totalH);
        planar[i * 2] = x;
        planar[i * 2 + 1] = y;

        const surface = sampleSurface(x, y, lens, L);
        const culled = isOffscreen(x, y, surface.z, L);
        el.style.visibility = culled ? 'hidden' : '';
        if (culled) continue;

        // World cell of this tile, so content follows the plane, not the pool.
        const worldCol = Math.round((x - ox) / cellWidth);
        const worldRow = Math.round((y - oy) / cellHeight);
        const index = itemIndexAt(worldCol, worldRow, count);
        if (tile.index !== index) tile.setProject(projects[index], index);

        // The pose is kept on the handle so the modal can clone it exactly.
        el.style.transform = poseTransform(writePose(tile.pose, x, y, surface));
        // Cards raised by the lens can overlap neighbours — nearer ones on top.
        el.style.zIndex = String(Math.round(surface.z) + 1000);
        tile.setFalloff(lightFalloff(x, y, lens, L));
      }
    };

    gsap.ticker.add(render);
    return () => gsap.ticker.remove(render);
  }, [drag, focus, projects]);

  // Intro: the dome settles in from a slight zoom. (Perspective lives on the
  // scene itself, so animating its opacity never flattens the 3D tiles.)
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      sceneRef.current,
      { opacity: 0, scale: 1.25 },
      { opacity: 1, scale: 1, duration: 1.8, ease: 'expo.out', delay: 0.1 },
    );
    return () => {
      tween.kill();
    };
  }, []);

  // Warm the cache so recycled tiles never flash empty.
  useEffect(() => {
    projects.forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });
  }, [projects]);

  const open = useCallback((tile: DomeTileHandle) => {
    if (!tile.project) return;
    setActive({ project: tile.project, tile });
  }, []);

  const handleSelect = useCallback(
    (tile: DomeTileHandle, event: React.MouseEvent) => {
      // Mouse clicks that ended a drag are not selections (keyboard clicks have detail 0).
      if (event.detail !== 0 && drag.state.current.moved) return;
      open(tile);
    },
    [drag.state, open],
  );

  const handleClosed = useCallback(() => {
    setActive(null);
    stageRef.current?.focus({ preventScroll: true });
  }, []);

  const handleStandIn = useCallback((on: boolean) => active?.tile.setStandIn(on), [active]);

  const getOrigin = useCallback((): TileSnapshot | null => {
    const tile = active?.tile;
    if (!tile?.root) return null;
    const { cardWidth, cardHeight, cardRadius } = layoutRef.current;
    return {
      pose: { ...tile.pose },
      width: cardWidth,
      height: cardHeight,
      radius: cardRadius,
      shade: tile.shade,
      caption: tile.caption,
    };
  }, [active]);

  // Arrow keys step one card at a time; Enter opens the card nearest the centre.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (active) return;
    const s = drag.state.current;
    const { cellWidth, cellHeight } = layoutRef.current;
    const snap = (v: number, cell: number) => Math.round(v / cell) * cell;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [cellWidth, 0],
      ArrowRight: [-cellWidth, 0],
      ArrowUp: [0, cellHeight],
      ArrowDown: [0, -cellHeight],
    };

    if (e.key in moves) {
      e.preventDefault();
      // Keyboard users look at the centre — bring the lens there.
      focus.recenter();
      const [dx, dy] = moves[e.key];
      s.targetX = snap(s.targetX, cellWidth) + dx;
      s.targetY = snap(s.targetY, cellHeight) + dy;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const planar = planarRef.current;
      let best = -1;
      let bestDist = Infinity;
      tilesRef.current.forEach((_, i) => {
        const d = Math.hypot(planar[i * 2], planar[i * 2 + 1]);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      const tile = tilesRef.current[best];
      if (tile) open(tile);
    }
  };

  return (
    <section className="relative h-full w-full overflow-hidden bg-black">
      <div
        ref={stageRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Project gallery. Drag, scroll or use the arrow keys to explore; press Enter to open the centred project."
        onKeyDown={handleKeyDown}
        className="absolute inset-0 cursor-grab touch-none outline-none select-none data-dragging:cursor-grabbing"
      >
        <div ref={sceneRef} className="absolute inset-0" style={{ perspective: layout.perspective }}>
          {Array.from({ length: tileCount }, (_, i) => (
            <DomeTile
              key={i}
              ref={(handle) => {
                tilesRef.current[i] = handle;
              }}
              width={layout.cardWidth}
              height={layout.cardHeight}
              radius={layout.cardRadius}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {active && (
        <ProjectModal
          key={active.project.id}
          project={active.project}
          index={projects.indexOf(active.project)}
          total={projects.length}
          perspective={layout.perspective}
          getOrigin={getOrigin}
          onStandIn={handleStandIn}
          onClosed={handleClosed}
        />
      )}
    </section>
  );
}
