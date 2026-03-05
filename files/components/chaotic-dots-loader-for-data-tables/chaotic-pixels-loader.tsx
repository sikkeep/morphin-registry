import { motion } from "framer-motion";

import { usePixelColumns } from "@/hooks/use-pixel-columns";

type ChaoticPixelsLoaderProps = {
  reducedMotion: boolean;
};

type PixelConfig = {
  id: number;
  delay: number;
  duration: number;
  opacity: number;
  lightness: number;
};

const PIXEL_ROWS = 2;
const MAX_PIXEL_COLUMNS = 140;

const PIXEL_POOL: PixelConfig[] = Array.from(
  { length: MAX_PIXEL_COLUMNS * PIXEL_ROWS },
  (_, id) => ({
    id,
    delay: Math.floor(Math.random() * 700),
    duration: 1.2 + Math.random() * 1.5,
    opacity: 0.38 + Math.random() * 0.62,
    lightness: 60 + Math.floor(Math.random() * 28),
  }),
);

export function ChaoticPixelsLoader({
  reducedMotion,
}: ChaoticPixelsLoaderProps) {
  const pixelColumns = usePixelColumns();
  const pixels = PIXEL_POOL.slice(0, pixelColumns * PIXEL_ROWS);

  return (
    <div
      role="status"
      aria-live="polite"
      className="grid w-full grid-rows-2 gap-0.5 px-2"
      style={{ gridTemplateColumns: `repeat(${pixelColumns}, minmax(0, 1fr))` }}
      aria-label="Loading users"
    >
      {pixels.map((pixel) => (
        <motion.span
          key={pixel.id}
          className="block aspect-square rounded-full"
          initial={reducedMotion ? false : { opacity: pixel.opacity * 0.45 }}
          animate={
            reducedMotion
              ? { opacity: pixel.opacity }
              : {
                  opacity: [
                    pixel.opacity * 0.42,
                    pixel.opacity,
                    pixel.opacity * 0,
                    pixel.opacity * 0.9,
                  ],
                }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  delay: pixel.delay / 1000,
                  duration: pixel.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
          }
          style={{ backgroundColor: `hsl(212 88% ${pixel.lightness}%)` }}
        />
      ))}
    </div>
  );
}
