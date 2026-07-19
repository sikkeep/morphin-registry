import { useState } from "react"
import { motion } from "framer-motion"
import { InfoIcon } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { MetricSelect } from "./metric-select"
import { MetricTabs } from "./metric-tabs"
import { PerformanceChart } from "./performance-chart"
import type { MetricKey } from "./types"

export function PerformanceTrend() {
  const [metric, setMetric] = useState<MetricKey>("prod-executions")

  return (
    <Tabs
      value={metric}
      onValueChange={(value) => setMetric(value as MetricKey)}
      className="w-full max-w-6xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <Card className="gap-0 py-0 shadow-sm ring-foreground/10">
          <CardHeader className="px-5 py-4">
            <div className="flex items-center gap-1.5">
              <CardTitle>Performance trend</CardTitle>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      className="grid size-6 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="About performance trend"
                    />
                  }
                >
                  <InfoIcon className="size-3.5" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>Daily production activity across 2026</TooltipContent>
              </Tooltip>
            </div>
            <CardAction>
              <MetricSelect value={metric} onValueChange={setMetric} />
            </CardAction>
          </CardHeader>

          <CardContent className="overflow-hidden px-5 pt-3 pb-10">
            <PerformanceChart metricKey={metric} />
          </CardContent>

          <CardFooter className="bg-card p-0">
            <MetricTabs value={metric} />
          </CardFooter>
        </Card>
      </motion.div>
    </Tabs>
  )
}
