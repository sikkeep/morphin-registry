import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';
import type { Project } from '@/data/projects';
import { getDetailLayout, type DetailLayout } from '@/lib/detail-layout';
import { MORPH_EASE, prefersReducedMotion } from '@/lib/motion';
import { CardCaption, formatMeta } from './card-caption';
import { ProjectModalContent } from './project-modal-content';
import type { TileSnapshot } from './dome-tile';

interface ProjectModalProps {
  project: Project;
  index: number;
  total: number;
  /** Must equal the grid scene's perspective so the clone matches the tile. */
  perspective: number;
  /** Live snapshot of the source tile — read at open and again at close. */
  getOrigin: () => TileSnapshot | null;
  /** Hide (true) / show (false) the source tile. Called in the same frame as the swap. */
  onStandIn: (active: boolean) => void;
  onClosed: () => void;
}

type Phase = 'loading' | 'opening' | 'open' | 'closing';

const SHADOW_ON = '0px 50px 120px -30px rgba(0,0,0,0.75)';
const SHADOW_OFF = '0px 50px 120px -30px rgba(0,0,0,0)';

/** Panel centre relative to the viewport centre — the "pose" of the open state. */
const openPose = (l: DetailLayout) => ({
  x: 0,
  y: 0,
  z: 0,
  rotationX: 0,
  rotationY: 0,
  width: l.width,
  height: l.height,
  borderRadius: l.radius,
});

/**
 * Seamless card ⇄ panel morph.
 *
 * The panel lives in a layer with the *same perspective* as the grid and starts
 * as an exact clone of the tile: same 3D pose (x/y/z/rotationX/rotationY),
 * size, radius, shade and caption. Only after its image is decoded is the tile
 * hidden — in the same frame — so the swap is invisible. Closing reverses into
 * the tile's live pose and shows the tile again before the panel unmounts.
 */
export function ProjectModal({ project, index, total, perspective, getOrigin, onStandIn, onClosed }: ProjectModalProps) {
  const [layout, setLayout] = useState(() => getDetailLayout(window.innerWidth, window.innerHeight));

  const backdropRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  const phase = useRef<Phase>('loading');
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const drift = useRef<gsap.core.Tween | null>(null);
  const reduced = useRef(prefersReducedMotion()).current;
  const d = (s: number) => (reduced ? 0.001 : s);

  const titleId = `project-${project.id}-title`;

  const textTargets = () => {
    const root = contentRef.current;
    return {
      reveal: root ? Array.from(root.querySelectorAll('[data-reveal]')) : [],
      title: root?.querySelector('[data-title]') ?? null,
      chrome: [closeRef.current, hintRef.current],
    };
  };

  /** Place the panel exactly on top of the tile. */
  const applySnapshot = (o: TileSnapshot) => {
    gsap.set(shellRef.current, {
      xPercent: -50,
      yPercent: -50,
      ...o.pose,
      width: o.width,
      height: o.height,
      borderRadius: o.radius,
      boxShadow: SHADOW_OFF,
    });
    gsap.set(mediaRef.current, { left: 0, top: 0, width: o.width, height: o.height, borderRadius: o.radius });
    gsap.set(shadeRef.current, { opacity: o.shade });
    gsap.set(captionRef.current, { opacity: o.caption });
    gsap.set(sheetRef.current, { opacity: 0 });
  };

  const applyOpen = (l: DetailLayout) => {
    gsap.set(shellRef.current, { xPercent: -50, yPercent: -50, ...openPose(l), boxShadow: SHADOW_ON });
    gsap.set(mediaRef.current, { left: l.media.x, top: l.media.y, width: l.media.width, height: l.media.height, borderRadius: l.mediaRadius });
  };

  // ── Open ────────────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const origin = getOrigin();
    const final = getDetailLayout(window.innerWidth, window.innerHeight);
    const { reveal, title, chrome } = textTargets();

    gsap.set(shellRef.current, { autoAlpha: 0 });
    gsap.set(backdropRef.current, { opacity: 0 });
    gsap.set(reveal, { opacity: 0, y: 24 });
    gsap.set(title, { yPercent: 110 });
    gsap.set(chrome, { opacity: 0, scale: 0.85 });
    if (origin) applySnapshot(origin);
    else applyOpen(final);

    let cancelled = false;
    const start = () => {
      if (cancelled || phase.current !== 'loading') return;
      phase.current = 'opening';

      // Swap: show the clone and hide the tile in the same frame.
      gsap.set(shellRef.current, { autoAlpha: 1 });
      onStandIn(true);

      const m = final.media;
      const tl = gsap.timeline({
        defaults: { ease: MORPH_EASE, duration: d(1.05) },
        onComplete: () => {
          phase.current = 'open';
          if (!reduced) drift.current = gsap.to(imageRef.current, { scale: 1.06, duration: 12, ease: 'none' });
        },
      });
      tl.to(backdropRef.current, { opacity: 1, duration: d(0.9), ease: 'power2.out' }, 0)
        .to(shadeRef.current, { opacity: 0, duration: d(0.55), ease: 'power2.out' }, 0)
        .to(captionRef.current, { opacity: 0, duration: d(0.3), ease: 'power1.out' }, 0)
        // Covered by the photo at t=0, so it can switch on instantly — a slow
        // fade would show a grey strip as the panel slides out.
        .to(sheetRef.current, { opacity: 1, duration: d(0.06), ease: 'none' }, 0)
        .to(shellRef.current, { ...openPose(final), boxShadow: SHADOW_ON }, 0)
        .to(mediaRef.current, { left: m.x, top: m.y, width: m.width, height: m.height, borderRadius: final.mediaRadius }, 0)
        .to(title, { yPercent: 0, duration: d(1), ease: 'expo.out' }, d(0.55))
        .to(reveal, { opacity: 1, y: 0, duration: d(0.8), stagger: 0.07, ease: 'power3.out' }, d(0.6))
        .to(chrome, { opacity: 1, scale: 1, duration: d(0.5), stagger: 0.08, ease: 'back.out(2)' }, d(0.75));
      timeline.current = tl;
      closeRef.current?.focus({ preventScroll: true });
    };

    // A not-yet-decoded <img> would flash empty for a frame at the swap.
    const img = imageRef.current;
    if (img) img.decode().then(start, start);
    else start();

    return () => {
      cancelled = true;
      timeline.current?.kill();
      drift.current?.kill();
    };
    // Runs once per opened project; the origin is read when it mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Close ───────────────────────────────────────────────────────────────
  const close = useCallback(() => {
    if (phase.current === 'closing' || phase.current === 'loading') return;
    phase.current = 'closing';
    timeline.current?.kill();
    drift.current?.kill();

    const origin = getOrigin();
    const { reveal, title, chrome } = textTargets();

    const finish = () => {
      // Tile first, then unmount — never a frame with neither on screen.
      onStandIn(false);
      onClosed();
    };

    const tl = gsap.timeline({ defaults: { ease: MORPH_EASE }, onComplete: finish });
    tl.to([...chrome, ...reveal], { opacity: 0, y: -6, duration: d(0.22), stagger: 0.015, ease: 'power2.in' }, 0)
      .to(title, { yPercent: -110, duration: d(0.35), ease: 'power3.in' }, 0)
      .to(imageRef.current, { scale: 1, duration: d(0.7), ease: 'power3.inOut' }, 0)
      .to(backdropRef.current, { opacity: 0, duration: d(0.85), ease: 'power2.inOut' }, d(0.2));

    if (origin) {
      const t = d(0.12);
      const dur = d(0.95);
      tl.to(shellRef.current, { ...origin.pose, width: origin.width, height: origin.height, borderRadius: origin.radius, boxShadow: SHADOW_OFF, duration: dur }, t)
        .to(mediaRef.current, { left: 0, top: 0, width: origin.width, height: origin.height, borderRadius: origin.radius, duration: dur }, t)
        // Keep the panel solid white while it retracts behind the photo, and
        // drop it only once covered so no white rim shows at the corners.
        .to(sheetRef.current, { opacity: 0, duration: dur * 0.1, ease: 'none' }, t + dur * 0.88)
        // Land with the tile's exact light so nothing pops at the swap.
        .to(shadeRef.current, { opacity: origin.shade, duration: dur * 0.7, ease: 'power1.inOut' }, t + dur * 0.3)
        .to(captionRef.current, { opacity: origin.caption, duration: dur * 0.45, ease: 'power1.inOut' }, t + dur * 0.55);
    } else {
      tl.to(shellRef.current, { autoAlpha: 0, scale: 0.92, duration: d(0.45), ease: 'power2.in' }, d(0.1));
    }
    timeline.current = tl;
  // `d` only depends on the constant reduced-motion flag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOrigin, onClosed, onStandIn]);

  // Escape closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  // Keep the open panel centred and sized on resize.
  useEffect(() => {
    const onResize = () => {
      const next = getDetailLayout(window.innerWidth, window.innerHeight);
      setLayout(next);
      if (phase.current === 'open') applyOpen(next);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { content } = layout;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50"
      style={{ perspective }}
    >
      <div
        ref={backdropRef}
        onClick={close}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.5),rgb(0_0_0/0.82))]"
      />

      <div ref={shellRef} className="invisible absolute top-1/2 left-1/2 overflow-hidden backface-hidden will-change-transform">
        <div ref={sheetRef} aria-hidden className="absolute inset-0 bg-white" />

        <div ref={mediaRef} className="absolute overflow-hidden bg-neutral-900" onClick={close}>
          <img
            ref={imageRef}
            src={project.image}
            alt={project.alt}
            draggable={false}
            className="size-full origin-center cursor-zoom-out object-cover select-none"
          />
          <CardCaption ref={captionRef} title={project.title} meta={formatMeta(project.category, project.year)} />
          <div ref={shadeRef} aria-hidden className="pointer-events-none absolute inset-0 bg-black opacity-0" />
        </div>

        <ProjectModalContent
          ref={contentRef}
          project={project}
          index={index}
          total={total}
          titleId={titleId}
          style={{ left: content.x, top: content.y, width: content.width, height: content.height }}
        />

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close project"
          className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-sm ring-1 ring-black/5 backdrop-blur transition-colors outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-neutral-900 md:top-5 md:right-5"
        >
          <X className="size-[18px]" strokeWidth={1.75} />
        </button>
      </div>

      <p
        ref={hintRef}
        className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs text-white/45 md:flex"
      >
        <kbd className="rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-white/70">Esc</kbd>
        or click outside to close
      </p>
    </div>
  );
}
