import * as THREE from "three";
import { IMAGE_FILES } from "./projects";

// Cell aspect matches the plane's 1.5 : 1 so nothing is distorted.
const CELL_W = 512;
const CELL_H = Math.round(CELL_W / 1.5);

const load = (src, priority) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    // Must be set before src or the request is already away.
    if (priority) img.fetchPriority = priority;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load ${src}`));
    img.src = src;
  });

/**
 * Packs every image into one texture. A single atlas rather than one texture
 * per plane because ESSL 1.00 cannot index an array of samplers with a
 * non-constant index.
 *
 * Returns synchronously with the sheet blank and filling in as images arrive:
 * the caller needs something to bind on frame one, and the entry shows cell 0
 * while the rest are still coming.
 *
 * `first` settles once cell 0 is on the texture, `ready` once all of them are.
 * Neither rejects — a missing file leaves its cell blank and still counts as
 * settled, so one bad path cannot strand the entry.
 */
export function buildAtlas(files = IMAGE_FILES, onProgress) {
  const cols = Math.ceil(Math.sqrt(files.length));
  const rows = Math.ceil(files.length / cols);

  const canvas = document.createElement("canvas");
  canvas.width = cols * CELL_W;
  canvas.height = rows * CELL_H;
  const ctx = canvas.getContext("2d");

  const texture = new THREE.CanvasTexture(canvas);
  // The shader flips each cell itself, so leave the sheet as drawn.
  texture.flipY = false;
  // NoColorSpace deliberately: this shader writes straight to the framebuffer
  // with no encoding step, and decoding on read without encoding on write is
  // what washes everything out.
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  const paint = (img, i) => {
    const x = (i % cols) * CELL_W;
    const y = Math.floor(i / cols) * CELL_H;

    // Cover fit: fill the cell, crop the overflow, never squash.
    const scale = Math.max(CELL_W / img.width, CELL_H / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, CELL_W, CELL_H); // clip, or an oversized image bleeds
    ctx.clip();
    ctx.drawImage(img, x + (CELL_W - dw) / 2, y + (CELL_H - dh) / 2, dw, dh);
    ctx.restore();
  };

  let settled = 0;
  const tick = () => onProgress?.(settled / files.length);

  const fetchInto = (i, priority) =>
    load(`${import.meta.env.BASE_URL}${files[i]}`, priority)
      .then((img) => paint(img, i))
      .catch((err) => console.warn("[atlas]", err.message))
      .finally(() => {
        settled++;
        tick();
      });

  // Cell 0 is the seed's art, the only thing on screen during the hold, so it
  // is asked for ahead of the rest and uploaded the moment it lands.
  const first = fetchInto(0, "high").then(() => {
    texture.needsUpdate = true;
  });

  // One upload at the end for everything else. Marking dirty per image would
  // re-send the whole sheet eighteen times for cells nobody is looking at yet.
  const ready = Promise.all([
    first,
    ...files.slice(1).map((_, k) => fetchInto(k + 1, "low")),
  ]).then(() => {
    texture.needsUpdate = true;
  });

  tick();
  return { texture, grid: [cols, rows], count: files.length, first, ready };
}
