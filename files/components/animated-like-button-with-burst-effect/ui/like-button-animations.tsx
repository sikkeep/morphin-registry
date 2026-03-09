"use client";

import * as React from "react";
import { motion } from "framer-motion";

const CIRCLE_RADIUS = 20;
const BURST_RADIUS = 32;
const START_RADIUS = 4;
const PATH_SCALE_FACTOR = 0.8;

const colorPairs = [
  { from: "#9EC9F5", to: "#9ED8C6" },
  { from: "#91D3F7", to: "#9AE4CF" },
  { from: "#DC93CF", to: "#E3D36B" },
  { from: "#CF8EEF", to: "#CBEB98" },
  { from: "#87E9C6", to: "#1FCC93" },
  { from: "#A7ECD0", to: "#9AE4CF" },
  { from: "#87E9C6", to: "#A635D9" },
  { from: "#D58EB3", to: "#E0B6F5" },
  { from: "#F48BA2", to: "#CF8EEF" },
  { from: "#91D3F7", to: "#A635D9" },
  { from: "#CF8EEF", to: "#CBEB98" },
  { from: "#87E9C6", to: "#A635D9" },
  { from: "#9EC9F5", to: "#9ED8C6" },
  { from: "#91D3F7", to: "#9AE4CF" },
];

export function CircleAnimation() {
  return (
    <svg
      className="pointer-events-none absolute -top-3 -left-3"
      style={{ width: CIRCLE_RADIUS * 2, height: CIRCLE_RADIUS * 2 }}
    >
      <motion.circle
        cx={CIRCLE_RADIUS}
        cy={CIRCLE_RADIUS}
        r={CIRCLE_RADIUS - 2}
        fill="none"
        initial={{
          scale: 0,
          stroke: "#E5214A",
          strokeWidth: CIRCLE_RADIUS * 2,
        }}
        animate={{ scale: 1, stroke: "#CC8EF5", strokeWidth: 0 }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      />
    </svg>
  );
}

function Particle({
  fromColor,
  toColor,
  index,
  totalParticles,
}: {
  fromColor: string;
  toColor: string;
  index: number;
  totalParticles: number;
}) {
  const angle = (index / totalParticles) * 360 + 45;
  const radians = (angle * Math.PI) / 180;
  const degreeShift = (13 * Math.PI) / 180;

  const randomFactor = React.useMemo(() => 0.85 + Math.random() * 0.3, []);
  const duration = React.useMemo(() => 500 + Math.random() * 200, []);
  const burstDistance = BURST_RADIUS * randomFactor;

  return (
    <motion.div
      className="pointer-events-none absolute size-1.5 rounded-full"
      style={{ backgroundColor: fromColor, opacity: 0 }}
      initial={{
        opacity: 0,
        scale: 1,
        x: Math.cos(radians) * START_RADIUS * PATH_SCALE_FACTOR,
        y: Math.sin(radians) * START_RADIUS * PATH_SCALE_FACTOR,
        backgroundColor: fromColor,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: Math.cos(radians + degreeShift) * burstDistance * PATH_SCALE_FACTOR,
        y: Math.sin(radians + degreeShift) * burstDistance * PATH_SCALE_FACTOR,
        scale: 0,
        backgroundColor: toColor,
      }}
      transition={{
        opacity: {
          times: [0, 0.01, 0.99, 1],
          duration: duration / 1000,
          delay: 0.4,
        },
        x: { duration: duration / 1000, ease: [0.23, 1, 0.32, 1], delay: 0.3 },
        y: { duration: duration / 1000, ease: [0.23, 1, 0.32, 1], delay: 0.3 },
        scale: {
          duration: duration / 1000,
          ease: [0.55, 0.085, 0.68, 0.53],
          delay: 0.3,
        },
        backgroundColor: { duration: duration / 1000, delay: 0.3 },
      }}
    />
  );
}

export function BurstAnimation() {
  return (
    <div className="pointer-events-none absolute -top-3 -left-3 grid size-10 place-items-center">
      {colorPairs.map((colors, index) => (
        <Particle
          key={index}
          fromColor={colors.from}
          toColor={colors.to}
          index={index}
          totalParticles={colorPairs.length}
        />
      ))}
    </div>
  );
}
