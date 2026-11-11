/**
 * Geometry for the infinite dome grid.
 *
 * The grid lives on a flat, endlessly repeating plane. Every frame each tile's
 * planar position (relative to the viewport centre) is wrapped into the pool
 * bounds and lifted onto a height field:
 *
 *   z(x, y) = bowl(x, y) + lens(x, y)
 *
 * - bowl: a concave dish — the rim comes toward the viewer, so we look *into*
 *   the dome and edge cards grow and turn inward.
 * - lens: a gaussian bump under the cursor that pulls that area of the grid
 *   toward the viewer, like pressing the surface from behind.
 *
 * Each card is placed at (x, y, z) and tilted to the local slope of the field.
 */

export interface DomeLayout {
  viewportWidth: number;
  viewportHeight: number;
  cardWidth: number;
  cardHeight: number;
  cardRadius: number;
  cellWidth: number;
  cellHeight: number;
  /** Tiles in the recycled pool. */
  cols: number;
  rows: number;
  perspective: number;
  /** Bowl depth (px toward the viewer) at `bowlReach` from the centre. */
  bowlDepth: number;
  bowlReach: number;
  /** Peak height of the cursor lens and its gaussian spread. */
  lensHeight: number;
  lensSpread: number;
}

export interface SurfacePoint {
  z: number;
  /** Partial derivatives — the local slope used to tilt the card. */
  dzdx: number;
  dzdy: number;
}

export interface Focus {
  x: number;
  y: number;
  /** 0‒1 multiplier of the lens height (eased in/out on hover). */
  strength: number;
}

export const clamp = (min: number, max: number, v: number) => Math.min(max, Math.max(min, v));

export function getDomeLayout(vw: number, vh: number): DomeLayout {
  const cardWidth = Math.round(clamp(170, 360, vw * 0.21));
  const cardHeight = Math.round(cardWidth * 1.14);
  const gap = Math.round(cardWidth * 0.08);
  const cellWidth = cardWidth + gap;
  const cellHeight = cardHeight + gap;
  const base = Math.max(vw, vh * 1.4);

  return {
    viewportWidth: vw,
    viewportHeight: vh,
    cardWidth,
    cardHeight,
    cardRadius: Math.round(cardWidth * 0.045),
    cellWidth,
    cellHeight,
    // The concave bowl pushes edge tiles outward, so ~1.4× the viewport is enough.
    cols: Math.ceil((vw * 1.4) / cellWidth) + 2,
    rows: Math.ceil((vh * 1.4) / cellHeight) + 2,
    perspective: base * 1.1,
    bowlDepth: base * 0.16,
    bowlReach: base * 0.5,
    lensHeight: base * 0.12,
    lensSpread: cellWidth * 1.15,
  };
}

/** Height and slope of the surface at planar (x, y) for a lens at `focus`. */
export function sampleSurface(x: number, y: number, focus: Focus, layout: DomeLayout): SurfacePoint {
  // Bowl: paraboloid, z = k·r²  →  ∂z/∂x = 2k·x
  const k = layout.bowlDepth / (layout.bowlReach * layout.bowlReach);
  let z = k * (x * x + y * y);
  let dzdx = 2 * k * x;
  let dzdy = 2 * k * y;

  // Lens: A·exp(-d² / 2σ²)  →  ∂z/∂x = -z_lens · dx / σ²
  if (focus.strength > 0.001) {
    const dx = x - focus.x;
    const dy = y - focus.y;
    const s2 = layout.lensSpread * layout.lensSpread;
    const lens = layout.lensHeight * focus.strength * Math.exp(-(dx * dx + dy * dy) / (2 * s2));
    z += lens;
    dzdx -= (lens * dx) / s2;
    dzdy -= (lens * dy) / s2;
  }

  return { z, dzdx, dzdy };
}

/** Screen-space scale of a point at depth z under the scene perspective. */
export const depthScale = (z: number, perspective: number) => perspective / (perspective - z);

/**
 * The cursor is in screen space, the lens in planar space. Undo the
 * perspective scale at the cursor so the bump sits right under the pointer.
 */
export function screenToPlanar(sx: number, sy: number, strength: number, layout: DomeLayout) {
  let px = sx;
  let py = sy;
  for (let i = 0; i < 2; i++) {
    const { z } = sampleSurface(px, py, { x: px, y: py, strength }, layout);
    const s = depthScale(z, layout.perspective);
    px = sx / s;
    py = sy / s;
  }
  return { x: px, y: py };
}

const RAD_TO_DEG = 180 / Math.PI;

/** A card's full 3D placement — shared by grid tiles and the modal morph. */
export interface TilePose {
  x: number;
  y: number;
  z: number;
  /** Degrees, in the same convention as GSAP's rotationX / rotationY. */
  rotationX: number;
  rotationY: number;
}

/**
 * Tilt that lays a card flat on the surface. Surface rising to the right
 * (dzdx > 0) means the card's right edge comes toward us → negative rotateY;
 * rising downward means the bottom edge comes toward us → positive rotateX.
 */
export function writePose(pose: TilePose, x: number, y: number, p: SurfacePoint) {
  pose.x = x;
  pose.y = y;
  pose.z = p.z;
  pose.rotationY = -Math.atan(p.dzdx) * RAD_TO_DEG;
  pose.rotationX = Math.atan(p.dzdy) * RAD_TO_DEG;
  return pose;
}

/**
 * CSS transform for a pose. Same order GSAP composes x/y/z + rotationY +
 * rotationX in, so a GSAP-driven element given this pose renders identically.
 */
export const poseTransform = (p: TilePose) =>
  `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateY(${p.rotationY}deg) rotateX(${p.rotationX}deg)`;

/** True when a tile at (x, y, z) projects fully outside the viewport. */
export function isOffscreen(x: number, y: number, z: number, layout: DomeLayout) {
  const { perspective, cardWidth, cardHeight, viewportWidth, viewportHeight } = layout;
  if (z > perspective * 0.7) return true;
  const s = depthScale(z, perspective);
  const margin = 40;
  return (
    Math.abs(x * s) - (cardWidth * s) / 2 > viewportWidth / 2 + margin ||
    Math.abs(y * s) - (cardHeight * s) / 2 > viewportHeight / 2 + margin
  );
}

/** Wraps `value` into [-size / 2, size / 2). */
export const wrapCentered = (value: number, size: number) =>
  ((((value + size / 2) % size) + size) % size) - size / 2;

/** Always-positive modulo for negative world indices. */
export const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * Picks the project shown at a world cell. Each row is shifted so that
 * horizontal, vertical and diagonal neighbours never repeat the same item.
 */
export function itemIndexAt(col: number, row: number, count: number) {
  const rowShift = Math.max(1, Math.round(count * 0.4));
  return mod(col + row * rowShift, count);
}

/** 0 under the spotlight → 1 in the dark; drives dimming and caption fade. */
export function lightFalloff(x: number, y: number, focus: Focus, layout: DomeLayout) {
  const d = Math.hypot(x - focus.x, y - focus.y);
  const inner = layout.cellWidth * 0.35;
  const range = layout.cellWidth * 2.1;
  return clamp(0, 1, (d - inner) / range);
}
