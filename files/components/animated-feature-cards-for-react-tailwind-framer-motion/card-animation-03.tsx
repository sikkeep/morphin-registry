"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  TickCircleIcon,
  UserSquareIcon,
  MessageQuestionIcon,
  ReceiptItemIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const CARDS = [
  { icon: UserSquareIcon, name: "Customer Care", subtitle: "Account help" },
  {
    icon: MessageQuestionIcon,
    name: "Sales Team",
    subtitle: "Product questions",
  },
  {
    icon: ReceiptItemIcon,
    name: "Support Team",
    subtitle: "Billing inquiries",
  },
];

const CARD_H = 88;
const GAP = 10;
const STEP = CARD_H + GAP;

const TOTAL_PHASES = 5;
const HOLD_MS = 1100;

const SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 26,
  mass: 1,
};

function getCardAnimate(cardIndex: number, phase: number) {
  if (phase === 4) {
    return { y: 0, opacity: 0, scale: 0.92, zIndex: 0 };
  }

  if (phase === 3) {
    if (cardIndex === 1) return { y: 0, opacity: 1, scale: 1.12, zIndex: 3 };
    return { y: 0, opacity: 0, scale: 0.92, zIndex: 1 };
  }

  const visibleCount = Math.min(phase + 1, 3);

  if (cardIndex >= visibleCount) {
    return { y: STEP * 2, opacity: 0, scale: 0.92, zIndex: 0 };
  }

  const listCenter = (visibleCount - 1) / 2;
  const relPos = cardIndex - listCenter;
  const zIndex = visibleCount - cardIndex;

  return { y: relPos * STEP, opacity: 1, scale: 1, zIndex };
}

function isChecked(cardIndex: number, phase: number) {
  return phase >= Math.min(cardIndex + 1, 2);
}

export default function CardAnimation03({ className }: { className?: string }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setTimeout(
      () => setPhase((p) => (p + 1) % TOTAL_PHASES),
      HOLD_MS,
    );
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="w-full h-full overflow-hidden">
      <div
        className={cn(
          "w-full h-full flex items-center justify-center",
          className,
        )}
      >
        <div className="relative" style={{ width: 280, height: CARD_H }}>
          {CARDS.map((card, i) => {
            const { zIndex, ...anim } = getCardAnimate(i, phase);
            const checked = isChecked(i, phase);

            return (
              <motion.div
                key={i}
                className="absolute inset-0"
                style={{ zIndex }}
                initial={false}
                animate={anim}
                transition={SPRING}
              >
                <TeamCard card={card} checked={checked} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TeamCard({
  card,
  checked,
}: {
  card: (typeof CARDS)[0];
  checked: boolean;
}) {
  const Icon = card.icon;

  return (
    <div className="w-full h-full bg-white rounded-xl border border-gray-100 p-3.5 flex flex-col justify-between before:content-[''] before:shadow-md before:absolute before:inset-0 before:rounded-xl before:opacity-20">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-white shadow-sm border border-gray-100 flex-shrink-0 flex items-center justify-center">
            <Icon className="size-5 text-purple-500" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 leading-snug">
              {card.name}
            </p>
            <p className="text-[10px] text-gray-400 leading-tight">
              {card.subtitle}
            </p>
          </div>
        </div>

        <motion.div
          className="size-7 rounded-full flex-shrink-0 flex items-center justify-center"
          initial={false}
          animate={{
            backgroundColor: checked ? "#7c3aed" : "#ede9fe",
          }}
          transition={{ duration: 0.25 }}
        >
          <TickCircleIcon className="size-5 text-white" />
        </motion.div>
      </div>

      <div className="flex flex-col gap-1 mt-1">
        {[100, 78].map((pct, j) => (
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
