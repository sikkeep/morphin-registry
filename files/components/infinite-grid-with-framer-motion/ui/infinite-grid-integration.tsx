"use client";

import { useState, useRef, useEffect, FC } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { Moon, Settings2, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

const GridPattern = ({
  offsetX,
  offsetY,
  size,
}: {
  offsetX: number | import("framer-motion").MotionValue<number>;
  offsetY: number | import("framer-motion").MotionValue<number>;
  size: number;
}) => {
  return (
    <svg className="h-full w-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
};

const InfiniteGrid = () => {
  const [gridSize, setGridSize] = useState(40);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5;
  const speedY = 0.5;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - left);
    mouseY.set(event.clientY - top);
  };

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();

    gridOffsetX.set((currentX + speedX) % gridSize);
    gridOffsetY.set((currentY + speedY) % gridSize);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background",
      )}
    >
      <div className="absolute inset-0 z-0 opacity-[0.05]">
        <GridPattern
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          size={gridSize}
        />
      </div>

      <motion.div
        className="absolute inset-0 z-0 opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          size={gridSize}
        />
      </motion.div>

      <div className="pointer-events-auto absolute right-10 bottom-10 z-30">
        <div className="min-w-[200px] space-y-3 rounded-xl border border-border bg-background/80 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Settings2 className="h-4 w-4" />
            Grid Density
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={gridSize}
            onChange={(event) => setGridSize(Number(event.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
          />
          <div className="flex justify-between font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            <span>Dense</span>
            <span>Sparse ({gridSize}px)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfiniteGridIntegration: FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="relative w-full min-h-screen">
      <button
        onClick={() => setIsDark((value) => !value)}
        className="group fixed top-4 right-4 z-50 flex items-center justify-center rounded-full border border-border bg-background/50 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-yellow-500 transition-transform group-hover:rotate-45" />
        ) : (
          <Moon className="h-5 w-5 text-indigo-500 transition-transform group-hover:-rotate-12" />
        )}
      </button>
      <main>
        <InfiniteGrid />
      </main>
    </div>
  );
};

export default InfiniteGridIntegration;
