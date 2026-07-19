import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { METRIC_ITEMS } from "./chart-data"
import type { MetricKey } from "./types"

type MetricSelectProps = {
  value: MetricKey
  onValueChange: (value: MetricKey) => void
}

export function MetricSelect({ value, onValueChange }: MetricSelectProps) {
  return (
    <Select
      items={METRIC_ITEMS}
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as MetricKey)}
    >
      <SelectTrigger className="min-w-36 shadow-xs" size="sm" aria-label="Chart metric">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="end">
        <SelectGroup>
          {METRIC_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
