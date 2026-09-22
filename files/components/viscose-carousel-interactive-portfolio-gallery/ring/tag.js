import * as THREE from "three";
import gsap from "gsap";

// Shared between the canvas that rasterises the label and the uniform that
// tells the shader how big it is.
export const TAG_W = 104;
export const TAG_H = 40;

/**
 * The "View" tag that rides the cursor over a card. Drawn in the ring's own
 * shader pass rather than as an element over the canvas — that is what lets
 * its label invert against whatever pixels it lands on, and lets its glass
 * refract the ring the same way the lip does.
 *
 * Only the alpha of this texture is used; the shader decides the ink colour
 * per pixel, so nothing about it is baked in here.
 *
 * `box` is the live scale the layout loop feeds the shader. Scale 0 is how the
 * tag is absent, so there is no separate visibility flag to keep in step.
 */
export function createTag(params, uniforms) {
  const box = { sx: 0.5, sy: 0 };
  const arrow = new Image();
  let arrowReady = false;
  let tex = null;

  const build = () => {
    // Above display resolution: small type over busy artwork.
    const dpr = Math.min(window.devicePixelRatio, 2) * 2;
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(TAG_W * dpr);
    canvas.height = Math.ceil(TAG_H * dpr);

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.font = `${params.tagWeight} ${params.tagSize}px "${params.textFont}", ui-sans-serif, system-ui, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";

    const w = ctx.measureText(params.tagText).width;
    const run = params.tagArrow + params.tagGap + w;
    const x0 = (TAG_W - run) * 0.5;

    ctx.fillText(
      params.tagText,
      x0 + params.tagArrow + params.tagGap,
      TAG_H * 0.5,
    );
    if (arrowReady) {
      const y = (TAG_H - params.tagArrow) * 0.5;
      ctx.drawImage(arrow, x0, y, params.tagArrow, params.tagArrow);
    }

    tex?.dispose();
    tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.NoColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    uniforms.uTagTex.value = tex;
  };

  const show = (on) => {
    gsap.killTweensOf(box);
    if (on) {
      // Two axes on separate springs, so it wobbles as it forms rather than
      // scaling up as one rigid piece.
      gsap.to(box, { sx: 1, duration: 0.62, ease: "elastic.out(1, 0.5)" });
      gsap.to(box, { sy: 1, duration: 0.74, ease: "elastic.out(1, 0.42)" });
    } else {
      // Flattens rather than shrinking evenly — a bead drawn back in.
      gsap.to(box, { sx: 0.5, sy: 0, duration: 0.28, ease: "power3.in" });
    }
  };

  const load = (onReady) => {
    arrow.onload = () => {
      arrowReady = true;
      onReady?.();
    };
    arrow.src = `${import.meta.env.BASE_URL}arrow-up-right.svg`;
  };

  const dispose = () => {
    gsap.killTweensOf(box);
    tex?.dispose();
  };

  return { box, build, show, load, dispose };
}
