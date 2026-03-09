import { motion } from "framer-motion";

const GRID_SIZE = 3;
const PIXEL_SIZE = 16;
const GAP = 0;

const pixels = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);

const COLOR = "#a855f7";

function PixelWaveLoader() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
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

          return (
            <motion.div
              key={i}
              style={{
                width: PIXEL_SIZE,
                height: PIXEL_SIZE,
                backgroundColor: COLOR,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.7, 1, 0.7],
                boxShadow: [
                  "0 0 0px rgba(168,85,247,0)",
                  "0 0 24px rgba(168,85,247,0.8)",
                  "0 0 0px rgba(168,85,247,0)",
                ],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (row + col) * 0.15,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default PixelWaveLoader;
