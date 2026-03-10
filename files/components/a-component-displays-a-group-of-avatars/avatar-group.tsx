"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface AvatarGroupProps {
  avatars: { src: string; alt?: string; label?: string }[];
  maxVisible?: number;
  size?: number;
  overlap?: number;
}

const AvatarGroup = ({
  avatars,
  maxVisible = 5,
  size = 40,
  overlap = 14,
}: AvatarGroupProps) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const visibleAvatars = avatars.slice(0, maxVisible);
  const extraCount = avatars.length - maxVisible;

  return (
    <div className="flex items-center">
      <div className="flex">
        {visibleAvatars.map((avatar, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              className="border-4 border-neutral-300 rounded-full bg-background relative"
              style={{
                width: size,
                height: size,
                zIndex: isHovered ? 100 : visibleAvatars.length - idx,
                marginLeft: -overlap,
                transition:
                  "margin-left 0.3s cubic-bezier(0.4,0,0.2,1), z-index 0s, box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                transform: isHovered ? "translateY(-10px)" : "translateY(0)",
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <img
                src={avatar.src}
                alt={avatar.alt || `Avatar ${idx + 1}`}
                width={size}
                height={size}
                className="rounded-full object-cover"
                draggable={false}
              />
              <AnimatePresence>
                {isHovered && avatar.label && (
                  <motion.div
                    key="tooltip"
                    initial={{
                      x: "-50%",
                      y: 10,
                      opacity: 0,
                      scale: 0.7,
                    }}
                    animate={{
                      x: "-50%",
                      y: 0,
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      x: "-50%",
                      y: 10,
                      opacity: 0,
                      scale: 0.7,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 24,
                    }}
                    className="absolute z-50 px-2 py-1 bg-primary text-primary-foreground text-xs rounded shadow-lg whitespace-nowrap pointer-events-none font-semibold"
                    style={{
                      top: -size * 0.7,
                      left: "50%",
                    }}
                  >
                    {avatar.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {extraCount > 0 && (
          <div
            className="flex items-center justify-center bg-primary text-primary-foreground font-semibold border-4 border-background rounded-full"
            style={{
              width: size,
              height: size,
              marginLeft: -overlap,
              zIndex: 0,
              fontSize: size * 0.32,
              transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            +{extraCount}
          </div>
        )}
      </div>
    </div>
  );
};

export { AvatarGroup };
