import { memo, useEffect, useState, type MouseEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

import {
  CHART_DATA,
  COLUMN_COUNT,
  DEFAULT_COLUMN,
  formatDate,
  formatMetricValue,
  formatShortDate,
  getMetric,
  MONTH_LABELS,
  ROW_COUNT,
  clampChartValue,
} from "./chart-data"
import type { ChartColumn, MetricKey } from "./types"

type ChartGridProps = {
  columns: ChartColumn[]
}

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.03,
      staggerChildren: 0.011,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
}

const columnVariants = {
  hidden: { opacity: 0, y: 6, scaleY: 0.82 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.16, ease: "easeOut" as const },
  },
}

const ChartGrid = memo(function ChartGrid({ columns }: ChartGridProps) {
  return (
    <motion.div
      className="grid h-full grid-cols-[repeat(60,minmax(0,1fr))] gap-[clamp(2px,0.22vw,4px)]"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {columns.map((column, columnIndex) => (
        <motion.div
          className="grid min-w-0 grid-rows-[repeat(14,minmax(0,1fr))] gap-[clamp(2px,0.22vw,4px)]"
          key={columnIndex}
          variants={columnVariants}
          style={{ transformOrigin: "bottom" }}
        >
          {Array.from({ length: ROW_COUNT }, (_, rowIndex) => {
            const active = rowIndex >= ROW_COUNT - column.height
            const secondary = rowIndex >= ROW_COUNT - column.secondaryHeight

            return (
              <div
                className={cn(
                  "min-h-0 rounded-[2px]",
                  active
                    ? "bg-chart-accent"
                    : secondary
                      ? "bg-chart-cell-strong"
                      : "bg-chart-cell"
                )}
                key={rowIndex}
              />
            )
          })}
        </motion.div>
      ))}
    </motion.div>
  )
})

type PerformanceChartProps = {
  metricKey: MetricKey
}

export function PerformanceChart({ metricKey }: PerformanceChartProps) {
  const metric = getMetric(metricKey)
  const columns = CHART_DATA[metricKey]
  const [activeColumn, setActiveColumn] = useState(DEFAULT_COLUMN)
  const selected = columns[activeColumn]
  const selectedX = ((activeColumn + 0.5) / COLUMN_COUNT) * 100
  const selectedY = ((ROW_COUNT - selected.height + 0.5) / ROW_COUNT) * 100
  const tooltipY = clampChartValue(selectedY - 10, 14, 51)

  useEffect(() => {
    setActiveColumn(DEFAULT_COLUMN)
  }, [metricKey])

  function handlePointerMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const pointerX = clampChartValue(event.clientX - bounds.left, 0, bounds.width - 1)
    const nextColumn = Math.floor((pointerX / bounds.width) * COLUMN_COUNT)
    setActiveColumn((currentColumn) =>
      currentColumn === nextColumn ? currentColumn : nextColumn
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3">
        <div className="flex h-[clamp(11rem,20vw,15rem)] flex-col justify-between py-0.5 text-right font-mono text-xs text-muted-foreground">
          {metric.ticks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        <div
          className="relative h-[clamp(11rem,20vw,15rem)] cursor-crosshair touch-pan-y"
          onMouseMove={handlePointerMove}
          onMouseLeave={() => setActiveColumn(DEFAULT_COLUMN)}
          role="img"
          aria-label={`Animated yearly ${metric.label.toLowerCase()} chart. Hover across the chart to inspect dates.`}
        >
          <AnimatePresence mode="wait">
            <ChartGrid key={metricKey} columns={columns} />
          </AnimatePresence>

          <motion.div
            className="pointer-events-none absolute inset-y-0 border-l border-dashed border-foreground/70"
            animate={{ left: `${selectedX}%` }}
            transition={{ type: "spring", stiffness: 480, damping: 42 }}
          />

          <motion.div
            className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-chart-accent bg-card shadow-xs"
            animate={{ left: `${selectedX}%`, top: `${selectedY}%` }}
            transition={{ type: "spring", stiffness: 480, damping: 42 }}
          />

          <motion.div
            className={cn(
              "pointer-events-none absolute w-36",
              activeColumn > COLUMN_COUNT - 12
                ? "-translate-x-[calc(100%+0.5rem)]"
                : "translate-x-2"
            )}
            animate={{ left: `${selectedX}%`, top: `${tooltipY}%` }}
            transition={{ type: "spring", stiffness: 480, damping: 42 }}
          >
            <Card size="sm" className="gap-1 py-2 shadow-md ring-foreground/15">
              <CardHeader className="gap-0.5 px-3">
                <CardDescription className="text-xs">
                  {formatDate(activeColumn)}
                </CardDescription>
                <CardTitle className="font-mono text-base font-semibold">
                  {formatMetricValue(metric, selected.value)}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute -bottom-9 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-[11px] font-medium whitespace-nowrap text-background shadow-xs"
            animate={{ left: `${selectedX}%` }}
            transition={{ type: "spring", stiffness: 480, damping: 42 }}
          >
            {formatShortDate(activeColumn)}
          </motion.div>
        </div>
      </div>

      <div className="ml-[3.25rem] grid grid-cols-12 pt-5">
        {MONTH_LABELS.map((month) => (
          <span className="text-center text-[11px] text-muted-foreground" key={month}>
            {month}
          </span>
        ))}
      </div>
    </div>
  )
}
