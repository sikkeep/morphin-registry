import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NODES = [
  { label: "v0 Mini", y: 95, color: "#22c55e" },
  { label: "v0 Pro", y: 150, color: "#60a5fa" },
  { label: "v0 Max", y: 205, color: "#a855f7" },
];

const PATHS = [
  { id: "source", d: `M 125 150 H 340`, activeFor: 1 },
  {
    id: "top",
    d: `M 125 150 H 225 M 225 150 V 126 M 225 126 C 225 95 227 95 255 95 M 255 95 H 340`,
    activeFor: 0,
  },
  {
    id: "bottom",
    d: `M 125 150 H 225 M 225 150 V 186 M 225 186 C 225 207 227 206 255 206 M 255 206 H 340`,
    activeFor: 2,
  },
];

const SRC_CX = 50;
const ICON_CX = 380;

function NodeIcon({
  cx,
  cy,
  color,
  active,
  index,
}: {
  cx: number;
  cy: number;
  color: string;
  active: boolean;
  index?: number;
}) {
  const c = active ? color : "#3a3a3a";
  return (
    <g>
      <motion.rect
        x={cx - 14}
        y={cy - 14}
        width={28}
        height={28}
        rx={9}
        fill="none"
        stroke={c}
        strokeWidth={2}
        animate={{ opacity: index === 0 || index === 1 ? 0.4 : 1 }}
        transition={{ duration: 0.5 }}
        style={{ transition: "stroke 0.5s ease" }}
      />
      <motion.rect
        x={cx - 8}
        y={cy - 8}
        width={16}
        height={16}
        rx={5}
        fill="none"
        stroke={c}
        strokeWidth={2}
        animate={{ opacity: index === 0 ? 0.4 : 1 }}
        transition={{ duration: 0.5 }}
        style={{ transition: "stroke 0.5s ease" }}
      />
      <rect
        x={cx - 3}
        y={cy - 3}
        width={6}
        height={6}
        rx={2}
        fill={c}
        style={{ transition: "fill 0.5s ease" }}
      />
    </g>
  );
}

export default function SvgBranches({
  width = 600,
  height = 300,
}: {
  width?: string | number;
  height?: string | number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % 3), 2000);
    return () => clearInterval(id);
  }, []);

  const activeColor = NODES[active].color;

  return (
    <svg width={width} height={height} viewBox="0 0 600 300">
      <defs>
        <filter
          id="glow"
          x="0"
          y="0"
          width="600"
          height="300"
          filterUnits="userSpaceOnUse"
        >
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(55 0)">
        {PATHS.slice()
          .sort(
            (a, b) =>
              (a.activeFor === active ? 1 : 0) -
              (b.activeFor === active ? 1 : 0),
          )
          .map((path) => {
            const isActive = path.activeFor === active;
            return (
              <motion.path
                key={path.id}
                d={path.d}
                stroke="#252525"
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                filter={isActive ? "url(#glow)" : undefined}
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  stroke: isActive ? activeColor : "#252525",
                }}
                transition={{ duration: 0.5 }}
              />
            );
          })}

        <g>
          <NodeIcon cx={20} cy={150} color="#fff" active={true} />
          <text
            x={SRC_CX}
            y={150 + 6}
            fill="#fff"
            fontSize={18}
            fontWeight={600}
            fontFamily="Inter, system-ui, sans-serif"
          >
            v0 Auto
          </text>
        </g>

        {NODES.map((n, i) => (
          <motion.g
            key={i}
            animate={{ opacity: i === active ? 1 : 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <NodeIcon
              cx={ICON_CX}
              cy={n.y}
              color={n.color}
              active={i === active}
              index={i}
            />
            <text
              x={ICON_CX + 26}
              y={n.y + 6}
              fontSize={18}
              fontWeight={600}
              fontFamily="Inter, system-ui, sans-serif"
              fill={i === active ? "#fff" : "#555"}
              style={{ transition: "fill 0.5s ease" }}
            >
              {n.label}
            </text>
          </motion.g>
        ))}
      </g>
    </svg>
  );
}
