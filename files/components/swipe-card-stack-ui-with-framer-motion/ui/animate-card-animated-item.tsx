"use client";

import { motion } from "framer-motion";
import type { Card } from "./animate-card-animation-constants";
import {
  positionStyles,
  enterAnimation,
  getExitAnimation,
  SWIPE_THRESHOLD,
  VELOCITY_THRESHOLD,
} from "./animate-card-animation-constants";
import { CardContent } from "./animate-card-item-content";

interface AnimatedCardProps {
  card: Card;
  index: number;
  isAnimating: boolean;
  onSwipeDown: () => void;
}

export function AnimatedCard({
  card,
  index,
  isAnimating,
  onSwipeDown,
}: AnimatedCardProps) {
  const { scale, y } = positionStyles[index] ?? positionStyles[2];
  const zIndex = index === 0 && isAnimating ? 10 : 3 - index;
  const isTopCard = index === 0;

  const exitAnim = index === 0 ? getExitAnimation() : undefined;
  const initialAnim = index === 2 ? enterAnimation : undefined;

  return (
    <motion.div
      key={card.id}
      initial={initialAnim}
      animate={{ y, scale }}
      exit={exitAnim}
      transition={{
        type: "spring",
        duration: 1,
        bounce: 0,
      }}
      drag={isTopCard ? "y" : false}
      dragConstraints={{ top: 0, bottom: 300 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (!isTopCard) return;
        const { offset, velocity } = info;
        if (offset.y > SWIPE_THRESHOLD || velocity.y > VELOCITY_THRESHOLD) {
          onSwipeDown();
        }
      }}
      style={{
        zIndex,
        left: "50%",
        x: "-50%",
        bottom: 0,
      }}
      className="absolute flex h-[280px] w-[324px] cursor-grab active:cursor-grabbing items-center justify-center overflow-hidden rounded-xl border-x border-t border-border bg-card p-1 shadow-lg will-change-transform sm:w-[512px]"
    >
      <CardContent contentType={card.contentType} />
    </motion.div>
  );
}
