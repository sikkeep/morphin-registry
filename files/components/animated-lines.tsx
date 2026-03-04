"use client";

import { motion } from "framer-motion";

const stripes = [
  { width: 88, baseHeight: 55, color: "rgba(180, 20, 40, 0.7)" },
  { width: 92, baseHeight: 65, color: "rgba(160, 15, 35, 0.75)" },
  { width: 88, baseHeight: 80, color: "rgba(140, 12, 30, 0.8)" },
  { width: 92, baseHeight: 90, color: "rgba(120, 10, 25, 0.85)" },
  { width: 88, baseHeight: 100, color: "rgba(100, 8, 22, 0.9)" },
  { width: 92, baseHeight: 95, color: "rgba(110, 10, 28, 0.85)" },
  { width: 88, baseHeight: 85, color: "rgba(130, 12, 32, 0.8)" },
  { width: 92, baseHeight: 70, color: "rgba(150, 15, 35, 0.75)" },
  { width: 88, baseHeight: 60, color: "rgba(170, 18, 38, 0.7)" },
];

export function AnimatedLines() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-hidden">
      {stripes.map((stripe, i) => {
        const minH = stripe.baseHeight * 0.35;
        const maxH = stripe.baseHeight;
        const duration = 1.2 + Math.random() * 1.4;
        const delay = i * 0.15;

        return (
          <motion.div
            key={i}
            className="origin-bottom rounded-t-sm"
            style={{
              width: stripe.width,
              background: `linear-gradient(to top, ${stripe.color}, rgba(200, 30, 50, 0))`,
            }}
            initial={{ height: `${minH}%` }}
            animate={{
              height: [
                `${minH}%`,
                `${maxH}%`,
                `${minH + (maxH - minH) * 0.4}%`,
                `${maxH * 0.85}%`,
                `${minH}%`,
              ],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
