import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Card ⇄ panel morph. A short wind-up and a long, soft landing: it responds
 * immediately (no "stuck" start like expo.inOut) and settles into place
 * without a visible final crawl.
 */
export const MORPH_EASE = CustomEase.create('dome-morph', '0.55, 0, 0.1, 1');
