import React from "react";
import { motion } from "framer-motion";

export default function Burst({
  emoji,
  onDone,
}: {
  emoji: string;
  onDone?: () => void;
}) {
  const offsets = [-45, 0, 45];
  return (
    <motion.div
      initial="hidden"
      animate="show"
      onAnimationComplete={onDone}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
      className="relative"
    >
      {offsets.map((x, i) => (
        <motion.span
          key={`${i}-${emoji}`}
          className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          variants={{
            hidden: { opacity: 0, scale: 0.6, x: 0, y: 0, rotate: 0 },
            show: {
              x: [0, x, x, 0],
              y: [0, i === 1 ? -200 : -180, i === 1 ? -200 : -180, 0],
              opacity: [0, 0.8, 1, 1, 0.8, 0],
              scale: [0.6, 1, 1, 0.6],
              rotate: [
                0,
                i === 1 ? 10 : -10,
                i === 1 ? -10 : 10,
                i === 1 ? 10 : -10,
                0,
              ],
              transition: { duration: 1.2, ease: [0.2, 0, 0.57, 0] },
            },
          }}
        >
          <span className="text-6xl leading-none">{emoji}</span>
        </motion.span>
      ))}
    </motion.div>
  );
}
