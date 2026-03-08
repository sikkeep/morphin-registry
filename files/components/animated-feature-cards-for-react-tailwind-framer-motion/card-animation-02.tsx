"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { AiSendMessageIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export default function CardAnimation02({ className }: { className?: string }) {
  return (
    <div className="w-full h-full overflow-hidden">
      <div
        className={cn(
          "w-full h-full flex items-center justify-center",
          className,
        )}
      >
        <PhaseCard />
      </div>
    </div>
  );
}

const PHASES = 8;
const HOLD_MS = 750;

const SPRING = {
  type: "spring" as const,
  stiffness: 200,
  damping: 22,
  mass: 1,
};

function PhaseCard() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPhase((p) => (p + 1) % PHASES), HOLD_MS);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="relative w-[280px] h-[150px] bg-white rounded-xl border border-gray-100 p-3.5">
      <div className="w-full h-full flex flex-col justify-between before:content-[''] before:shadow-md before:absolute before:inset-0 before:rounded-xl before:opacity-20">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-white shadow-sm border border-gray-100 flex-shrink-0 flex items-center justify-center">
            <AiSendMessageIcon className="size-5 text-purple-500" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 leading-snug">
              AI Working in Real Time
            </p>
            <p className="text-[10px] text-gray-400 leading-tight">
              Instant Processing
            </p>
          </div>
        </div>

        <div className="flex flex-grow items-center gap-0.5 mt-3.5">
          {Array.from({ length: PHASES }).map((_, i) => {
            const isCompleted = i < phase;
            const isActive = i === phase;

            return (
              <div
                key={i}
                className="relative w-12 h-full rounded-lg bg-white border border-gray-100 overflow-hidden inset-shadow-sm"
              >
                <motion.div
                  className="absolute inset-0 w-full h-full bg-purple-500 inset-shadow-lg inset-shadow-white"
                  initial={false}
                  animate={{
                    width: isCompleted || isActive ? "100%" : "0%",
                    opacity: isActive ? 1 : isCompleted ? 0.7 : 0,
                  }}
                  transition={SPRING}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
