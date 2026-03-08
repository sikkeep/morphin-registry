"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { AiSendMessageIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const PHASE_DURATIONS = [900, 1200, 2200, 400];
const TOTAL_PHASES = 4;

const SUMMARY_ITEMS = [
  "Customer asks about refund",
  "Order #4548",
  "Waiting for confirmation",
];

export default function CardAnimation04({ className }: { className?: string }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setTimeout(
      () => setPhase((p) => (p + 1) % TOTAL_PHASES),
      PHASE_DURATIONS[phase],
    );
    return () => clearTimeout(t);
  }, [phase]);

  const isBlank = phase === 3;
  const leftTyping = phase === 0;
  const rightTyping = phase === 0 || phase === 1;

  return (
    <div className="w-full h-full overflow-hidden">
      <div
        className={cn(
          "w-full h-full flex items-center justify-center",
          className,
        )}
      >
        <motion.div
          className="relative w-100 h-full"
          initial={false}
          animate={{ opacity: isBlank ? 0 : 1 }}
          transition={{ duration: 0.35 }}
        >
          <div className="w-80 h-40 absolute top-0 left-0 z-1 bg-white rounded-2xl border border-gray-100 p-4 before:content-[''] before:shadow-lg before:absolute before:inset-0 before:rounded-2xl before:opacity-10">
            <Bubble side="left" typing={leftTyping} variant="purple" />
            <Bubble side="right" typing={rightTyping} variant="gray" />
          </div>

          <div className="w-80 absolute z-2 right-0 bottom-0 bg-white rounded-2xl border border-gray-100 p-4 before:content-[''] before:shadow-lg before:absolute before:inset-0 before:rounded-2xl before:opacity-15">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="size-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <AiSendMessageIcon className="size-5 text-white" />
              </div>
              <p className="text-base font-bold text-gray-900">AI Summary</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-2 flex flex-col gap-1">
              {SUMMARY_ITEMS.map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <motion.div
                    className="size-2 rounded-full bg-purple-500 flex-shrink-0"
                    animate={{ scale: [0.9, 1, 0.9], opacity: [0.7, 1, 0.7] }}
                    transition={{
                      duration: 0.65,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  />
                  <p className="text-xs text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Bubble({
  side,
  typing,
  variant,
}: {
  side: "left" | "right";
  typing: boolean;
  variant: "purple" | "gray";
}) {
  const isLeft = side === "left";
  const bgClass = variant === "purple" ? "bg-purple-100" : "bg-gray-100";

  return (
    <div
      className={`absolute ${bgClass} rounded-2xl px-3 py-2.5`}
      style={{
        top: isLeft ? 14 : 82,
        left: isLeft ? 14 : undefined,
        right: isLeft ? undefined : 14,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {typing ? (
          <motion.div
            key="dots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TypingDots variant={variant} />
          </motion.div>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TextLines variant={variant} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypingDots({ variant }: { variant: "purple" | "gray" }) {
  const dotClass = variant === "purple" ? "bg-purple-400" : "bg-gray-400";

  return (
    <div className="flex items-center gap-1 h-4 px-0.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`size-1.5 rounded-full ${dotClass}`}
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.65,
            repeat: Infinity,
            repeatType: "loop",
            delay: i * 0.14,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function TextLines({ variant }: { variant: "purple" | "gray" }) {
  const from = variant === "purple" ? "from-purple-300" : "from-gray-300";
  const to = variant === "purple" ? "to-purple-100" : "to-gray-100";

  return (
    <div className="flex flex-col gap-0.5 py-0.5">
      <div
        className={`w-50 h-[6px] rounded-full bg-gradient-to-r ${from} ${to}`}
      />
      <div
        className={`w-30 h-[6px] rounded-full bg-gradient-to-r ${from} ${to}`}
      />
    </div>
  );
}
