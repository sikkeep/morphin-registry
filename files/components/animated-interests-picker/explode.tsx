import React from "react";

import { motion } from "framer-motion";

export default function Explode({ emojis }: { emojis: string[] }) {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  return (
    <div className="absolute inset-0">
      {emojis.map((e, i) => {
        const dx = rand(-120, 120);
        const topY = rand(-160, -260);
        const rot = rand(-25, 25);

        return (
          <motion.span
            key={`${i}-${e}-${dx.toFixed(1)}`}
            className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-5xl"
            initial={{ x: 0, y: 0, scale: 0.5, opacity: 0, rotate: 0 }}
            animate={{
              x: dx,
              y: topY,
              rotate: rot,
              scale: [0.5, 1, 1, 0.95],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              type: "tween",
              ease: "easeOut",
              duration: 0.7,
            }}
          >
            {e}
          </motion.span>
        );
      })}
    </div>
  );
}
