"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AppUsage {
  icon: React.ReactNode;
  name: string;
  duration: string;
  color?: string;
}

interface ScreenTimeCardProps {
  totalHours: number;
  totalMinutes: number;
  barData: number[];
  timeLabels?: string[];
  topApps: AppUsage[];
  className?: string;
}

export const ScreenTimeCard = ({
  totalHours,
  totalMinutes,
  barData,
  timeLabels = ["5 AM", "11 AM", "5 PM"],
  topApps,
  className,
}: ScreenTimeCardProps) => {
  const maxValue = Math.max(...barData, 1);
  const normalizedData = barData.map((value) => value / maxValue);

  const barVariants = {
    hidden: { scaleY: 0 },
    visible: (i: number) => ({
      scaleY: 1,
      transition: {
        delay: i * 0.02,
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.08)]",
        className,
      )}
    >
      <div className="flex gap-10">
        <div className="flex-1">
          <div className="mb-3 text-3xl font-semibold">
            {totalHours}h {totalMinutes}m
          </div>

          <div className="relative">
            <div className="absolute -right-11 top-0 flex h-32 flex-col justify-between text-xs text-slate-500">
              <span>2h</span>
              <span>1h</span>
              <span>0</span>
            </div>

            <div className="pointer-events-none absolute inset-0 flex h-32 flex-col justify-between">
              <div className="h-px border-t border-dashed border-slate-200" />
              <div className="h-px border-t border-dashed border-slate-200" />
              <div className="h-px border-t border-dashed border-slate-200" />
            </div>

            <div className="relative z-10 mb-1.5 flex h-32 items-end gap-[3px]">
              {normalizedData.map((height, index) => {
                const isHighlighted = height > 0.6;
                const barColor = isHighlighted
                  ? "bg-gradient-to-t from-sky-500 to-indigo-500"
                  : "bg-slate-200";

                return (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={barVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                      "origin-bottom flex-1 rounded-t-sm",
                      barColor,
                    )}
                    style={{ height: `${height * 100}%` }}
                  />
                );
              })}
            </div>

            <div className="flex justify-between text-xs text-slate-500">
              {timeLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
              <span>0</span>
            </div>
          </div>
        </div>

        <div className="relative left-5 w-px self-stretch bg-slate-200" />

        <div className="flex flex-col justify-center gap-3.5">
          {topApps.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-6 w-6 items-center justify-center text-slate-700">
                {app.icon}
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-medium text-slate-600">
                  {app.name}
                </span>
                <span className="whitespace-nowrap text-sm text-slate-900">
                  {app.duration}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
