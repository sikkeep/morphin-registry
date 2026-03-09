"use client";

import * as React from "react";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";

import {
  BurstAnimation,
  CircleAnimation,
} from "@/components/ui/like-button-animations";
import { Button } from "@/components/ui/button";
import { LikeButtonHeartIcon } from "@/components/ui/like-button-heart-icon";
import { cn } from "@/lib/utils";

export interface LikeButtonProps {
  className?: string;
  initialCount?: number;
  defaultLiked?: boolean;
}

export function LikeButton({
  className,
  initialCount = 0,
  defaultLiked = false,
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = React.useState(initialCount);
  const [isLiked, setIsLiked] = React.useState(defaultLiked);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const toggleLike = () => {
    if (isLiked) {
      setLikeCount((count) => Math.max(0, count - 1));
      setIsLiked(false);
      return;
    }

    setLikeCount((count) => count + 1);
    setIsLiked(true);
    setIsAnimating(true);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "relative h-8 cursor-pointer gap-1.5 rounded-lg px-2",
        className,
      )}
      onClick={toggleLike}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <div className="relative">
        {isAnimating && <CircleAnimation />}
        {isAnimating && <BurstAnimation />}
        {isAnimating ? (
          <motion.div
            key="animating-heart"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
              delay: 0.3,
            }}
            onAnimationComplete={() => setIsAnimating(false)}
          >
            <LikeButtonHeartIcon className="text-red-500" />
          </motion.div>
        ) : (
          <LikeButtonHeartIcon
            className={isLiked ? "text-red-500" : "text-inherit"}
          />
        )}
      </div>

      <span className="min-w-[0.75rem]">
        <NumberFlow value={likeCount} />
        <span className="sr-only"> likes</span>
      </span>
    </Button>
  );
}
