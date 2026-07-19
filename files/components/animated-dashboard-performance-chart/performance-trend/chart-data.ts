import {
  BadgeCheckIcon,
  BadgeXIcon,
  ChartNoAxesColumnIncreasingIcon,
  PercentIcon,
} from "lucide-react"

import type { ChartColumn, MetricConfig, MetricKey } from "./types"

export const COLUMN_COUNT = 60
export const ROW_COUNT = 14
export const DEFAULT_COLUMN = 20

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export const METRICS: MetricConfig[] = [
  {
    key: "prod-executions",
    label: "Prod. executions",
    selectLabel: "Executions",
    summaryValue: "320",
    change: "+5%",
    icon: BadgeCheckIcon,
    seed: 0,
    scale: 1,
    ticks: [400, 300, 200, 100],
    precision: 0,
    suffix: "",
    selectedValue: 320,
  },
  {
    key: "failed-executions",
    label: "Failed executions",
    selectLabel: "Failed executions",
    summaryValue: "28",
    change: "-4.8%",
    icon: BadgeXIcon,
    seed: 1.45,
    scale: 0.74,
    ticks: [100, 75, 50, 25],
    precision: 0,
    suffix: "",
    selectedValue: 28,
  },
  {
    key: "failure-rate",
    label: "Failure rate",
    selectLabel: "Failure rate",
    summaryValue: "2.4%",
    change: "+0.3%",
    icon: PercentIcon,
    seed: 2.6,
    scale: 0.65,
    ticks: [20, 15, 10, 5],
    precision: 2,
    suffix: "%",
    selectedValue: 2.4,
  },
  {
    key: "time-saved",
    label: "Time saved",
    selectLabel: "Time saved",
    summaryValue: "18.4 hrs",
    change: "-1.1%",
    icon: ChartNoAxesColumnIncreasingIcon,
    seed: 3.85,
    scale: 0.88,
    ticks: [24, 18, 12, 6],
    precision: 1,
    suffix: " hrs",
    selectedValue: 18.4,
  },
]

export const METRIC_ITEMS = METRICS.map((metric) => ({
  label: metric.selectLabel,
  value: metric.key,
}))

const metricMap = new Map(METRICS.map((metric) => [metric.key, metric]))

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function createColumns(metric: MetricConfig): ChartColumn[] {
  const peaks = [4, 11, 17, 24, 30, 36, 41, 47, 53, 58]

  return Array.from({ length: COLUMN_COUNT }, (_, index) => {
    const baseline =
      2.2 +
      Math.sin(index * 0.58 + metric.seed) * 0.68 +
      Math.sin(index * 1.24 + metric.seed * 0.75) * 0.44
    const peakHeight = peaks.reduce((total, peak, peakIndex) => {
      const width = 1.05 + ((peakIndex + Math.round(metric.seed)) % 3) * 0.22
      const amplitude = 3.2 + ((peakIndex * 3 + Math.round(metric.seed * 3)) % 4)
      return total + amplitude * Math.exp(-((index - peak) ** 2) / (2 * width ** 2))
    }, 0)
    const height = clamp(Math.round((baseline + peakHeight) * metric.scale), 2, 10)
    const secondaryHeight = clamp(
      height + 2 + Math.round((Math.sin(index * 0.37 + metric.seed) + 1) * 1.5),
      height + 1,
      ROW_COUNT
    )
    const wave = Math.sin(index * 0.41 + metric.seed)

    let value: number
    if (metric.key === "prod-executions") value = 95 + height * 24 + wave * 9
    else if (metric.key === "failed-executions") value = 8 + height * 5.4 + wave * 2
    else if (metric.key === "failure-rate") value = 0.8 + height * 0.72 + wave * 0.35
    else value = 2.5 + height * 1.55 + wave * 0.65

    return {
      height,
      secondaryHeight,
      value:
        index === DEFAULT_COLUMN
          ? metric.selectedValue
          : Number(value.toFixed(metric.precision)),
    }
  })
}

export const CHART_DATA = Object.fromEntries(
  METRICS.map((metric) => [metric.key, createColumns(metric)])
) as Record<MetricKey, ChartColumn[]>

export function getMetric(key: MetricKey) {
  return metricMap.get(key) ?? METRICS[0]
}

export function formatMetricValue(metric: MetricConfig, value: number) {
  return `${value.toFixed(metric.precision)}${metric.suffix}`
}

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
})

function getColumnDate(index: number) {
  if (index === DEFAULT_COLUMN) return new Date(2026, 3, 30)

  const date = new Date(2026, 0, 1)
  date.setDate(1 + Math.round((index / (COLUMN_COUNT - 1)) * 364))
  return date
}

export function formatDate(index: number) {
  return longDateFormatter.format(getColumnDate(index))
}

export function formatShortDate(index: number) {
  return shortDateFormatter.format(getColumnDate(index))
}

export function clampChartValue(value: number, min: number, max: number) {
  return clamp(value, min, max)
}
