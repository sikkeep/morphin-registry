"use client";

import { type PointerEvent, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const DOT_TRANSITION = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.45,
} as const;

export interface DotChartDataPoint {
  value: number;
  label?: string;
}

export interface DotChartActivePoint<
  TData extends DotChartDataPoint = DotChartDataPoint,
> {
  dataPoint: TData;
  dataIndex: number;
  columnIndex: number;
  height: number;
  x: number;
}

export interface DotChartProps<
  TData extends DotChartDataPoint = DotChartDataPoint,
> {
  data: readonly TData[];
  rows?: number;
  dotSize?: number;
  gap?: number;
  activeColor?: string;
  filledColor?: string;
  idleColor?: string;
  hoverColor?: string;
  topDotColor?: string;
  activeColumnSpread?: number;
  className?: string;
  defaultActiveIndex?: number;
  onActivePointChange?: (point: DotChartActivePoint<TData>) => void;
  onPointerLeave?: () => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function DotChart<TData extends DotChartDataPoint = DotChartDataPoint>({
  data,
  rows = 11,
  dotSize = 4,
  gap = 5,
  activeColor = "#34d399",
  filledColor = "rgba(255,255,255,0.35)",
  idleColor = "rgba(255,255,255,0.12)",
  hoverColor = "rgba(255,255,255,0.08)",
  topDotColor = "#ffffff",
  activeColumnSpread = 4,
  className,
  defaultActiveIndex,
  onActivePointChange,
  onPointerLeave,
}: DotChartProps<TData>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeColumn, setActiveColumn] = useState<number | null>(null);
  const resolvedRows = Math.max(1, Math.round(rows));
  const resolvedDotSize = Math.max(1, dotSize);
  const resolvedGap = Math.max(0, gap);
  const resolvedActiveColumnSpread = Math.max(
    0,
    Math.round(activeColumnSpread),
  );

  useLayoutEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const cellSize = resolvedDotSize + resolvedGap;
  const columnCount =
    containerWidth > 0 ? Math.max(1, Math.floor(containerWidth / cellSize)) : 0;
  const svgWidth = Math.max(columnCount * cellSize, resolvedDotSize);
  const svgHeight = Math.max(resolvedRows * cellSize, resolvedDotSize);
  const hasData = data.length > 0;
  const maxValue = data.reduce(
    (largest, point) => Math.max(largest, point.value),
    0,
  );
  const normalizedValues = data.map((point) =>
    maxValue === 0 ? 0 : Math.round((point.value / maxValue) * resolvedRows),
  );

  const resolveColumnIndex = (dataIndex: number) => {
    if (columnCount <= 1 || data.length <= 1) {
      return 0;
    }

    return Math.round(
      (clamp(dataIndex, 0, data.length - 1) / (data.length - 1)) *
        (columnCount - 1),
    );
  };

  const resolveDataIndex = (columnIndex: number) => {
    if (columnCount <= 1 || data.length <= 1) {
      return 0;
    }

    return Math.round(
      (clamp(columnIndex, 0, columnCount - 1) / (columnCount - 1)) *
        (data.length - 1),
    );
  };

  const getColumnHeight = (columnIndex: number) => {
    if (!hasData) {
      return 0;
    }

    if (columnCount <= 1 || data.length <= 1) {
      return normalizedValues[0] ?? 0;
    }

    const rawIndex = (columnIndex / (columnCount - 1)) * (data.length - 1);
    const lowerIndex = Math.floor(rawIndex);
    const upperIndex = Math.min(data.length - 1, Math.ceil(rawIndex));
    const interpolation = rawIndex - lowerIndex;

    return Math.round(
      (normalizedValues[lowerIndex] ?? 0) * (1 - interpolation) +
        (normalizedValues[upperIndex] ?? 0) * interpolation,
    );
  };

  const getActiveInfluence = (columnIndex: number) => {
    if (activeColumn === null) {
      return 0;
    }

    const distance = Math.abs(activeColumn - columnIndex);

    if (distance > resolvedActiveColumnSpread) {
      return 0;
    }

    return 1 - distance / (resolvedActiveColumnSpread + 1);
  };

  useLayoutEffect(() => {
    if (!hasData || columnCount === 0) {
      return;
    }

    setActiveColumn((currentColumn) => {
      if (currentColumn !== null) {
        return clamp(currentColumn, 0, columnCount - 1);
      }

      return resolveColumnIndex(defaultActiveIndex ?? data.length - 1);
    });
  }, [columnCount, defaultActiveIndex, hasData, data.length]);

  useLayoutEffect(() => {
    if (
      !hasData ||
      columnCount === 0 ||
      activeColumn === null ||
      !onActivePointChange
    ) {
      return;
    }

    const dataIndex = resolveDataIndex(activeColumn);
    const dataPoint = data[dataIndex];

    if (!dataPoint) {
      return;
    }

    onActivePointChange({
      dataPoint,
      dataIndex,
      columnIndex: activeColumn,
      height: getColumnHeight(activeColumn),
      x: activeColumn * cellSize + cellSize / 2,
    });
  }, [activeColumn, cellSize, columnCount, data, hasData, onActivePointChange]);

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!hasData || columnCount === 0) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const nextColumn = clamp(
      Math.floor((event.clientX - bounds.left) / cellSize),
      0,
      columnCount - 1,
    );

    setActiveColumn(nextColumn);
  };

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      {hasData && columnCount > 0 ? (
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          onPointerMove={handlePointerMove}
          onPointerLeave={onPointerLeave}
          style={{ cursor: "crosshair", display: "block", width: "100%" }}
        >
          {Array.from({ length: columnCount }, (_, columnIndex) => {
            const columnHeight = getColumnHeight(columnIndex);
            const isActiveColumn = activeColumn === columnIndex;
            const activeInfluence = getActiveInfluence(columnIndex);

            return (
              <g key={columnIndex}>
                {Array.from({ length: resolvedRows }, (_, rowIndex) => {
                  const dotRow = resolvedRows - 1 - rowIndex;
                  const isFilled = dotRow < columnHeight;
                  const isTopDot =
                    isActiveColumn &&
                    isFilled &&
                    dotRow === Math.max(columnHeight - 1, 0);
                  const useActiveColor = isFilled && activeInfluence > 0;

                  return (
                    <motion.circle
                      key={`${columnIndex}-${rowIndex}`}
                      cx={columnIndex * cellSize + resolvedDotSize / 2}
                      cy={rowIndex * cellSize + resolvedDotSize / 2}
                      r={resolvedDotSize / 2}
                      initial={false}
                      animate={{
                        fill: isTopDot
                          ? topDotColor
                          : useActiveColor
                            ? activeColor
                            : isActiveColumn
                              ? hoverColor
                              : isFilled
                                ? filledColor
                                : idleColor,
                        opacity: isTopDot
                          ? 1
                          : useActiveColor
                            ? 0.2 + activeInfluence * 0.8
                            : isActiveColumn
                              ? isFilled
                                ? 1
                                : 0.45
                              : 1,
                        scale: isTopDot ? 1.45 : 1,
                      }}
                      transition={DOT_TRANSITION}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      ) : null}
    </div>
  );
}
