"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";

import { cn } from "@/lib/utils";
import { ALL_INTERESTS, ROWS } from "@/lib/config";

import Burst from "./burst";
import Explode from "./explode";

import { TrashIcon } from "@heroicons/react/24/outline";

export type Interest = { id: string; label: string; emoji: string };

const estimateWidth = (it: Interest) => {
  const charW = 8.2;
  const pad = 32 + 24;
  return Math.round(it.label.length * charW + pad);
};

function packIntoRows(items: Interest[], rows = ROWS) {
  const lanes: { items: Interest[]; w: number }[] = Array.from(
    { length: rows },
    () => ({
      items: [],
      w: 0,
    }),
  );
  for (const it of items) {
    let idx = 0;
    for (let i = 1; i < lanes.length; i++)
      if (lanes[i].w < lanes[idx].w) idx = i;
    const width = estimateWidth(it);
    lanes[idx].items.push(it);
    lanes[idx].w += width + 12;
  }
  return lanes.map((l) => l.items);
}

export default function InterestsPicker() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [burst, setBurst] = useState<{
    id: string;
    emoji: string;
    seed: number;
  } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const selectedCount = selected.size;

  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [maxDrag, setMaxDrag] = useState(0);
  const x = useMotionValue(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const rows = useMemo(() => packIntoRows(ALL_INTERESTS, ROWS), []);

  useLayoutEffect(() => {
    const el = frameRef.current!;
    const content = contentRef.current!;
    const ro = new ResizeObserver(() => {
      const md = Math.max(0, content.scrollWidth - el.clientWidth);
      setMaxDrag(md);
      setConstraints({ left: -md, right: 0 });
    });
    ro.observe(el);
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(x, "change", (v) => {
    const EPS = 6; // tolerance in px for "at edge"
    setAtStart(v >= -EPS);
    setAtEnd(v <= -maxDrag + EPS);
  });

  const toggle = (it: Interest) => {
    if (isDragging) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(it.id) ? next.delete(it.id) : next.add(it.id);
      return next;
    });

    if (!selected.has(it.id)) {
      setBurst({ id: it.id, emoji: it.emoji, seed: Date.now() });
    } else {
      setBurst(null);
    }
  };

  const [shakeCounter, setShakeCounter] = useState(false);
  const [explosion, setExplosion] = useState<{
    seed: number;
    emojis: string[];
  } | null>(null);

  const collectSelectedEmojis = () =>
    ALL_INTERESTS.filter((it) => selected.has(it.id)).map((it) => it.emoji);

  const SHAKE_MS = 420; // how long the counter shakes
  const BOOM_MS = 700; // how long the explosion runs

  const handleTrashClick = () => {
    if (selected.size === 0) return;

    // 1) shake whole counter
    setShakeCounter(true);
    setTimeout(() => setShakeCounter(false), SHAKE_MS);

    // 2) after shake finishes → explode immediately
    const emojis = collectSelectedEmojis();
    setTimeout(() => {
      setExplosion({ seed: Date.now(), emojis });
      setBurst(null);
      setSelected(new Set());

      // 3) clear after explosion
      setTimeout(() => {
        setExplosion(null);
      }, BOOM_MS);
    }, SHAKE_MS);
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-5 p-6">
        <h2 className="text-3xl font-semibold tracking-tight">Interests</h2>
        <div className="relative">
          <div
            className={cn(
              "invisible absolute bottom-0 left-0 z-5 h-full w-full bg-radial-[at_50%_85%] from-white to-white/0 opacity-0 transition-all duration-300",
              {
                ["visible opacity-100"]: !!burst,
              },
            )}
          />

          <div
            ref={frameRef}
            className={cn(
              "overflow-hidden rounded-xl py-2 transition-all",
              "before:absolute before:top-0 before:left-0 before:z-10 before:h-full before:w-10 before:bg-gradient-to-r before:from-white before:to-white/0 before:opacity-100 before:transition-all",
              "after:absolute after:top-0 after:right-0 after:z-10 after:h-full after:w-10 after:bg-gradient-to-l after:from-white after:to-white/0 after:opacity-100 after:transition-all",
              {
                ["before:opacity-0"]: atStart,
                ["after:opacity-0"]: atEnd,
              },
            )}
          >
            <motion.div
              ref={contentRef}
              drag="x"
              style={{ x }}
              dragConstraints={constraints}
              dragElastic={0.18}
              dragMomentum
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
              className="flex flex-wrap gap-2 pr-4"
            >
              {rows.map((row, rIdx) => (
                <div
                  key={rIdx}
                  className="col-start-auto row-start-auto contents"
                >
                  <div className="row-span-1 flex flex-nowrap gap-2">
                    {row.map((it) => {
                      const isActive = selected.has(it.id);
                      return (
                        <motion.button
                          key={it.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggle(it)}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
                            {
                              ["bg-white text-gray-900 ring-1 ring-neutral-200"]:
                                isActive,
                              ["bg-gray-100/80 text-gray-800 hover:bg-neutral-200"]:
                                !isActive,
                            },
                          )}
                        >
                          <span className="text-lg">{it.emoji}</span>
                          <span className="text-nowrap">{it.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        <motion.div
          key={selectedCount}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: shakeCounter ? [0, -6, 6, -6, 6, 0] : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 18,
            x: { duration: 0.42 },
          }}
          className="relative z-8 mx-auto flex w-max items-center gap-2 rounded-full bg-white px-6 py-3 shadow-xl ring-1 ring-black/10"
        >
          <span className="font-medium">{selectedCount}</span>{" "}
          <span className="text-gray-500">Interests</span>
          <button
            onClick={handleTrashClick}
            className={cn(
              "rounded-full p-2 transition-colors",
              selectedCount === 0
                ? "cursor-not-allowed opacity-40"
                : "hover:bg-neutral-100 active:scale-95",
            )}
            aria-label="Clear selected interests"
          >
            <TrashIcon className="size-5" />
          </button>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <AnimatePresence>
              {burst && (
                <Burst
                  key={burst.seed}
                  emoji={burst.emoji}
                  onDone={() => setBurst(null)}
                />
              )}
            </AnimatePresence>
          </div>
          {/* multi-emoji explosion on trash */}
          <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
            <AnimatePresence>
              {explosion && (
                <Explode key={explosion.seed} emojis={explosion.emojis} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
