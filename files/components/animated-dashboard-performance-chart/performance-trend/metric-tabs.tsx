import { Fragment } from "react";

import { Separator } from "@/components/ui/separator";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { METRICS } from "./chart-data";
import type { MetricKey } from "./types";

type MetricTabsProps = {
  value: MetricKey;
};

export function MetricTabs({ value }: MetricTabsProps) {
  return (
    <div className="w-full overflow-x-auto">
      <TabsList
        variant="line"
        className="h-auto min-w-[46rem] w-full gap-0 p-0 group-data-horizontal/tabs:h-auto"
        aria-label="Performance chart series"
      >
        {METRICS.map((metric, index) => {
          const Icon = metric.icon;
          const active = value === metric.key;

          return (
            <Fragment key={metric.key}>
              {index > 0 && <Separator orientation="vertical" />}
              <TabsTrigger
                value={metric.key}
                className="h-auto min-w-0 flex-col items-start gap-2 rounded-none px-5 py-4 text-left after:top-[-1px] after:bottom-auto"
              >
                <span className="flex w-full items-center gap-2 text-xs font-normal">
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-md border",
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="truncate">{metric.label}</span>
                </span>
                <span className="flex items-baseline flex-col gap-2">
                  <span className="font-mono text-2xl font-medium tracking-tight">
                    {metric.summaryValue}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    <span className="font-mono text-foreground">
                      {metric.change}
                    </span>{" "}
                    vs last month
                  </span>
                </span>
              </TabsTrigger>
            </Fragment>
          );
        })}
      </TabsList>
    </div>
  );
}
