"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { AiSendMessageIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const CARDS = [
  { count: 5, time: "2 minutes ago" },
  { count: 9, time: "32 minutes ago" },
  { count: 3, time: "25 minutes ago" },
];

const W = 280;
const H = 98;
const STEP = H + 8;

type CardState = {
  x: number;
  y: number;
  rotate: number;
  opacity: number;
  scale: number;
  zIndex: number;
};

const PHASES: CardState[][] = [
  [
    { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.82, zIndex: 0 },
    { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.82, zIndex: 0 },
    { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1, zIndex: 2 },
  ],
  [
    { x: -65, y: -80, rotate: 0, opacity: 1, scale: 1, zIndex: 1 },
    { x: 65, y: 0, rotate: 0, opacity: 1, scale: 1, zIndex: 2 },
    { x: -65, y: 80, rotate: 0, opacity: 1, scale: 1, zIndex: 3 },
  ],
  [
    { x: 0, y: -STEP, rotate: 0, opacity: 1, scale: 1, zIndex: 3 },
    { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1, zIndex: 2 },
    { x: 0, y: STEP, rotate: 0, opacity: 1, scale: 1, zIndex: 1 },
  ],
  [
    { x: 0, y: -STEP + 35, rotate: 5, opacity: 1, scale: 1, zIndex: 1 },
    { x: 0, y: 0, rotate: -5, opacity: 1, scale: 1, zIndex: 2 },
    { x: 0, y: STEP - 35, rotate: 5, opacity: 1, scale: 1, zIndex: 3 },
  ],
];

const SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 22,
  mass: 1,
};

const HOLD_MS = 1000;

export default function CardAnimation01({ className }: { className?: string }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setTimeout(
      () => setPhase((p) => (p + 1) % PHASES.length),
      HOLD_MS,
    );
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center">
      <div className={cn("relative w-0 h-0", className)}>
        {CARDS.map((card, i) => {
          const pos = PHASES[phase][i];
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: W,
                height: H,
                top: -H / 2,
                left: -W / 2,
                zIndex: pos.zIndex,
              }}
              animate={{
                x: pos.x,
                y: pos.y,
                rotate: pos.rotate,
                opacity: pos.opacity,
                scale: pos.scale,
              }}
              transition={SPRING}
            >
              <NotificationCard count={card.count} time={card.time} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function NotificationCard({ count, time }: { count: number; time: string }) {
  return (
    <div className="w-full h-full bg-white rounded-xl border border-gray-100 p-3.5 flex flex-col justify-between before:content-[''] before:shadow-md before:absolute before:inset-0 before:rounded-xl before:opacity-20">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-white shadow-sm border border-gray-100 flex-shrink-0 flex items-center justify-center">
          <AiSendMessageIcon className="size-5 text-purple-500" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-900 leading-snug">
            New Message
            <span className="text-gray-400 font-semibold">({count})</span>
          </p>
          <p className="text-[10px] text-gray-400 leading-tight">{time}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-1">
        {[100, 78, 58].map((pct, j) => (
          <div
            key={j}
            className="h-[6px] rounded-full bg-gradient-to-r from-purple-100 to-purple-200/20"
            style={{
              width: `${pct}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
