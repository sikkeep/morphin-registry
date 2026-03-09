import { motion } from "framer-motion";

const GRID_SIZE = 4;
const PIXEL_SIZE = 2;
const GAP = 2;
const CENTER = (GRID_SIZE - 1) / 2;
const WAVE_STEP = 0.12;

const pixels = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);

const COLOR = "#fff";

function PixelLoader() {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${PIXEL_SIZE}px)`,
        gap: `${GAP}px`,
      }}
    >
      {pixels.map((i) => {
        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;
        const distanceFromCenter = Math.hypot(row - CENTER, col - CENTER);

        return (
          <motion.div
            key={i}
            style={{
              width: PIXEL_SIZE,
              height: PIXEL_SIZE,
              backgroundColor: COLOR,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.7, 1, 0.7],
              boxShadow: [
                "0 0 0px rgba(255, 255, 255, 0)",
                "0 0 24px rgba(255, 255, 255, 0.8)",
                "0 0 0px rgba(255, 255, 255, 0)",
              ],
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: distanceFromCenter * WAVE_STEP,
            }}
          />
        );
      })}
    </div>
  );
}

export default PixelLoader;
