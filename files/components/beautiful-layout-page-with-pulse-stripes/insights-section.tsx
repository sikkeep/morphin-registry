"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const LABEL = "SMARTER INSIGHTS";
const TEXT_WHITE =
  "With predictive analytics, automated workflows, and beautifully simple dashboards, ";
const TEXT_GREY =
  "FluxMetric helps you uncover patterns, optimize performance, and make decisions with confidence.";
const FULL_TEXT = TEXT_WHITE + TEXT_GREY;

export function InsightsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.4"],
  });

  const chars = FULL_TEXT.split("");

  return (
    <section ref={containerRef} className="px-6 py-20 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <motion.span
          className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {LABEL}
        </motion.span>

        <p className="mt-8 text-2xl font-medium leading-snug tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
          {chars.map((char, i) => (
            <CharReveal
              key={i}
              char={char}
              index={i}
              total={chars.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </p>
      </div>
    </section>
  );
}

function CharReveal({
  char,
  index,
  total,
  scrollYProgress,
}: {
  char: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = index / total;
  const end = start + 1 / total;

  const color = useTransform(
    scrollYProgress,
    [start, end],
    ["rgb(64 64 64)", "rgb(250 250 250)"],
  );

  if (char === " ") {
    return <span> </span>;
  }

  return (
    <motion.span style={{ color }} className="inline">
      {char}
    </motion.span>
  );
}
