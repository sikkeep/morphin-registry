"use client";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  {
    id: "msg",
    app: "Messages",
    title: "Sarah Chen",
    body: "Hey! Are you free for a call later?",
    time: "now",
    bg: "bg-green-500",
    initials: "SC",
  },
  {
    id: "fig",
    app: "Figma",
    title: "New comment",
    body: "Alex left a comment on your frame.",
    time: "2m",
    bg: "bg-violet-500",
    initials: "Fi",
  },
  {
    id: "cal",
    app: "Calendar",
    title: "Standup soon",
    body: "Weekly meeting starts in 15 minutes.",
    time: "15m",
    bg: "bg-blue-500",
    initials: "Ca",
  },
  {
    id: "gh",
    app: "GitHub",
    title: "PR #142 approved",
    body: "Your pull request is ready to merge.",
    time: "5m",
    bg: "bg-zinc-800",
    initials: "GH",
  },
  {
    id: "sl",
    app: "Slack",
    title: "Design channel",
    body: "Jake shared the updated component specs.",
    time: "8m",
    bg: "bg-rose-500",
    initials: "Sl",
  },
];

const SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 20,
  mass: 1,
} as const;

const SLOTS = [
  { y: 145, opacity: 1, scale: 1, zIndex: 10 },
  { y: 80, opacity: 0.6, scale: 0.95, zIndex: 9 },
  { y: 20, opacity: 0.25, scale: 0.9, zIndex: 8 },
] as const;

const ENTER_Y = -50;
const MOBILE_QUERY = "(max-width: 640px)";

type Card = (typeof NOTIFICATIONS)[number] & { uid: string };

export default function NotificationAnimation({
  className,
}: {
  className?: string;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [cards, setCards] = useState<Card[]>(() =>
    NOTIFICATIONS.slice(0, 3).map((n) => ({ ...n, uid: `${n.id}:0` })),
  );
  const counter = useRef(3);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mediaQuery.matches);

    onChange();
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const id = setInterval(() => {
      setCards((prev) => {
        const [, ...rest] = prev;
        const c = counter.current;
        const src = NOTIFICATIONS[c % NOTIFICATIONS.length];
        counter.current = c + 1;
        return [...rest, { ...src, uid: `${src.id}:${c}` }];
      });
    }, 2400);
    return () => clearInterval(id);
  }, [isMobile]);

  return (
    <div className={cn("relative w-full h-full", className)}>
      <AnimatePresence initial={false}>
        {(isMobile ? cards.slice(0, 1) : cards).map((card, idx) => (
          <motion.div
            key={card.uid}
            className="absolute inset-x-0 -top-5 sm:top-auto px-6"
            initial={
              isMobile
                ? { y: SLOTS[0].y, opacity: 1, scale: 1 }
                : { y: ENTER_Y, opacity: 0, scale: 0.88 }
            }
            animate={{
              y: isMobile ? SLOTS[0].y : SLOTS[idx].y,
              opacity: isMobile ? 1 : SLOTS[idx].opacity,
              scale: isMobile ? 1 : SLOTS[idx].scale,
            }}
            exit={isMobile ? undefined : { y: 200, opacity: 0, scale: 1.04 }}
            transition={isMobile ? { duration: 0 } : SPRING}
            style={{ zIndex: isMobile ? SLOTS[0].zIndex : SLOTS[idx].zIndex }}
          >
            <NotificationCard card={card} active />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationCard({ card, active }: { card: Card; active: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl p-3",
        "bg-white border border-zinc-100",
        active ? "shadow-lg" : "shadow-sm",
      )}
    >
      <div
        className={cn(
          "shrink-0 size-12 rounded-full flex items-center justify-center",
          "text-xs font-bold text-white tracking-wide",
          card.bg,
        )}
      >
        {card.initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-zinc-400">
            {card.app}
          </span>
          <span className="flex items-center gap-2 text-xs text-zinc-300 shrink-0">
            {card.time}
            {active && (
              <div className="shrink-0 size-2 rounded-full bg-blue-500 self-start mt-1 mr-0.5" />
            )}
          </span>
        </div>
        <p className="text-sm font-semibold text-zinc-900 truncate leading-tight mt-0.5">
          {card.title}
        </p>
        <p className="text-xs text-zinc-400 truncate mt-0.5">{card.body}</p>
      </div>
    </div>
  );
}
