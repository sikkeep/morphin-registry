import type { LucideIcon } from "lucide-react"

export type MetricKey =
  | "prod-executions"
  | "failed-executions"
  | "failure-rate"
  | "time-saved"

export type ChartColumn = {
  height: number
  secondaryHeight: number
  value: number
}

export type MetricConfig = {
  key: MetricKey
  label: string
  selectLabel: string
  summaryValue: string
  change: string
  icon: LucideIcon
  seed: number
  scale: number
  ticks: [number, number, number, number]
  precision: number
  suffix: string
  selectedValue: number
}
