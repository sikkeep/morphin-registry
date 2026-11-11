import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

export interface FocusState {
  /** Smoothed focus point in screen px, relative to the viewport centre. */
  x: number;
  y: number;
  strength: number;
  targetX: number;
  targetY: number;
  targetStrength: number;
}

interface Options {
  enabled: boolean;
  /** Lens strength while no pointer hovers (touch, pointer left the window). */
  idleStrength?: number;
  /** Follow stiffness — lower trails the cursor more. */
  stiffness?: number;
}

/**
 * Tracks where the "lens" and spotlight sit. Follows a hovering mouse/pen,
 * and drifts back to the centre when the pointer leaves or a touch ends.
 * Like the drag hook it never re-renders; call `step(dt)` from the ticker.
 */
export function usePointerFocus(
  ref: RefObject<HTMLElement | null>,
  { enabled, idleStrength = 0.55, stiffness = 6 }: Options,
) {
  const state = useRef<FocusState>({
    x: 0,
    y: 0,
    strength: 0,
    targetX: 0,
    targetY: 0,
    targetStrength: idleStrength,
  });
  const enabledRef = useRef(enabled);
  const reducedRef = useRef(prefersReducedMotion());

  // Layout effect: freezes in the same commit as the click, before any frame
  // can move the grid under the opening modal.
  useLayoutEffect(() => {
    enabledRef.current = enabled;
    // Freeze under an overlay so the source card stays put for the close morph.
    if (!enabled) {
      const s = state.current;
      s.targetX = s.x;
      s.targetY = s.y;
      s.targetStrength = s.strength;
    }
  }, [enabled]);

  const recenter = useCallback(() => {
    const s = state.current;
    s.targetX = 0;
    s.targetY = 0;
    s.targetStrength = idleStrength;
  }, [idleStrength]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = state.current;

    const onMove = (e: PointerEvent) => {
      if (!enabledRef.current) return;
      const rect = el.getBoundingClientRect();
      s.targetX = e.clientX - rect.left - rect.width / 2;
      s.targetY = e.clientY - rect.top - rect.height / 2;
      s.targetStrength = 1;
    };
    const onLeave = () => enabledRef.current && recenter();
    const onUp = (e: PointerEvent) => e.pointerType !== 'mouse' && onLeave();

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerup', onUp);
    };
  }, [ref, recenter]);

  const step = useCallback(
    (dt: number) => {
      const s = state.current;
      const t = reducedRef.current ? 1 : 1 - Math.exp(-stiffness * dt);
      s.x += (s.targetX - s.x) * t;
      s.y += (s.targetY - s.y) * t;
      s.strength += (s.targetStrength - s.strength) * t;
    },
    [stiffness],
  );

  return useMemo(() => ({ state, step, recenter }), [step, recenter]);
}
