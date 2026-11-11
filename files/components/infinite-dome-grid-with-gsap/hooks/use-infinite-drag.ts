import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

export interface DragState {
  /** Smoothed offset that is rendered. */
  x: number;
  y: number;
  /** Where the offset is heading (pointer, wheel, keyboard and throw write here). */
  targetX: number;
  targetY: number;
  dragging: boolean;
  /** True once the current gesture travelled far enough to count as a drag. */
  moved: boolean;
}

interface Options {
  enabled: boolean;
  /** How far a release keeps travelling, in ms of release velocity. */
  throwMs?: number;
  /** Follow stiffness of the offset toward its target (higher = snappier). */
  stiffness?: number;
  wheelSpeed?: number;
}

const DRAG_THRESHOLD = 6;

/**
 * Pointer + wheel panning for an infinite surface. It never re-renders: it
 * mutates a ref and exposes `step(dt)` to be called from a single ticker.
 */
export function useInfiniteDrag(
  ref: RefObject<HTMLElement | null>,
  { enabled, throwMs = 380, stiffness = 9, wheelSpeed = 0.7 }: Options,
) {
  const state = useRef<DragState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    dragging: false,
    moved: false,
  });
  const enabledRef = useRef(enabled);
  const reducedRef = useRef(prefersReducedMotion());

  // Layout effect: freezes in the same commit as the click, before any frame
  // can move the grid under the opening modal.
  useLayoutEffect(() => {
    enabledRef.current = enabled;
    // Freeze in place when disabled so nothing drifts behind an overlay.
    if (!enabled) {
      const s = state.current;
      s.targetX = s.x;
      s.targetY = s.y;
    }
  }, [enabled]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = state.current;

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let vx = 0;
    let vy = 0;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      // Exponentially smoothed velocity in px/ms.
      vx = vx * 0.7 + (dx / dt) * 0.3;
      vy = vy * 0.7 + (dy / dt) * 0.3;
      s.targetX += dx;
      s.targetY += dy;

      if (!s.moved && Math.hypot(e.clientX - startX, e.clientY - startY) > DRAG_THRESHOLD) {
        s.moved = true;
        el.dataset.dragging = '';
      }
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
    };

    const onUp = () => {
      s.dragging = false;
      delete el.dataset.dragging;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);

      // A pause before release means the user stopped — no throw.
      if (reducedRef.current || performance.now() - lastT > 90) return;
      s.targetX += vx * throwMs;
      s.targetY += vy * throwMs;
    };

    // Listeners go on window (not pointer capture) so the click still reaches
    // the tile button under the cursor.
    const onDown = (e: PointerEvent) => {
      if (!enabledRef.current || e.button !== 0) return;
      s.dragging = true;
      s.moved = false;
      startX = lastX = e.clientX;
      startY = lastY = e.clientY;
      lastT = performance.now();
      vx = vy = 0;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!enabledRef.current) return;
      const unit = e.deltaMode === 1 ? 32 : 1;
      // Shift + wheel pans horizontally on mice without a horizontal axis.
      const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
      const dy = e.shiftKey && !e.deltaX ? 0 : e.deltaY;
      s.targetX -= dx * unit * wheelSpeed;
      s.targetY -= dy * unit * wheelSpeed;
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('wheel', onWheel);
      onUp();
    };
  }, [ref, throwMs, wheelSpeed]);

  /** Advances the smoothed offset; call once per frame with seconds elapsed. */
  const step = useCallback(
    (dt: number) => {
      const s = state.current;
      const t = reducedRef.current ? 1 : 1 - Math.exp(-stiffness * dt);
      s.x += (s.targetX - s.x) * t;
      s.y += (s.targetY - s.y) * t;
    },
    [stiffness],
  );

  return useMemo(() => ({ state, step }), [step]);
}
