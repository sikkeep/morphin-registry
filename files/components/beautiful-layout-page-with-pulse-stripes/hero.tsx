"use client";

import { motion } from "framer-motion";
import NumberFlow, { continuous } from "@number-flow/react";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedLines } from "./animated-lines";

const stats = [
  { value: 100, suffix: "%", label: "Uptime" },
  { value: 3, suffix: "x", label: "Faster Insights" },
  { value: 92, suffix: "%", label: "Less Manual Work" },
  { value: 40, suffix: "+", label: "Integrations" },
];

export function Hero() {
  const [hasAnimatedStats, setHasAnimatedStats] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setHasAnimatedStats(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section className="relative px-4 pt-28 pb-0 sm:px-6 md:pt-32">
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-b from-pink-500 via-red-600 to-red-700 px-6 py-20 sm:px-10 md:py-20">
        <AnimatedLines />

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.h1
            className="max-w-xl lg:max-w-2xl text-4xl font-medium leading-10 md:leading-14 lg:leading-18 tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            Turn your data into instant insights
          </motion.h1>

          <motion.p
            className="mt-5 max-w-xl text-base text-neutral-200 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
          >
            FluxMetric helps teams analyze performance, automate reporting, and
            uncover growth opportunities
          </motion.p>

          <motion.a
            href="#"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-50 px-6 py-3 text-sm font-semibold text-neutral-950"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              opacity: { duration: 0.3, delay: 0.3, ease: "easeOut" },
              y: { duration: 0.3, delay: 0.3, ease: "easeOut" },
              scale: { duration: 0.2, delay: 0, ease: "easeOut" },
            }}
          >
            Get Started
            <span className="flex size-6 items-center justify-center rounded-full bg-neutral-950 text-neutral-50">
              <ArrowUpRight className="size-3.5" />
            </span>
          </motion.a>
        </div>

        <motion.div
          className="relative z-10 mt-16 grid grid-cols-2 gap-6 sm:mt-20 md:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                <NumberFlow
                  value={hasAnimatedStats ? stat.value : 0}
                  suffix={stat.suffix}
                  plugins={[continuous]}
                />
              </p>
              <p className="mt-1 text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
