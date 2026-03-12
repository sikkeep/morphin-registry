"use client";

import NumberFlow from "@number-flow/react";
import {
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { BarChart2, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DotChart,
  type DotChartActivePoint,
  type DotChartDataPoint,
  type DotChartProps,
} from "@/components/dot-chart";

const VALUE_FORMAT = {
  maximumFractionDigits: 0,
} satisfies Intl.NumberFormatOptions;

const TOOLTIP_SPRING = { stiffness: 420, damping: 32, mass: 0.52 };
const LINE_SPRING = { stiffness: 360, damping: 30, mass: 0.68 };
const TOOLTIP_ENTER_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 26,
  mass: 0.5,
} as const;

type ChartProps<TData extends DotChartDataPoint> = Omit<
  Partial<DotChartProps<TData>>,
  "data" | "defaultActiveIndex" | "onActivePointChange"
>;

export interface SalesGrowthCardProps<
  TData extends DotChartDataPoint = DotChartDataPoint,
> {
  data: readonly TData[];
  title?: ReactNode;
  value?: ReactNode;
  trendValue?: ReactNode;
  trendLabel?: ReactNode;
  defaultActiveIndex?: number;
  tooltipPrefix?: string;
  className?: string;
  icon?: ReactNode;
  getTooltipValue?: (point: TData) => number;
  getTooltipLabel?: (point: TData) => ReactNode;
  chartProps?: ChartProps<TData>;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function SalesGrowthCard<TData extends DotChartDataPoint>({
  data,
  title = "Sales Growth",
  value = "$101,820",
  trendValue = "84",
  trendLabel = "from the last month",
  defaultActiveIndex,
  tooltipPrefix = "+$",
  className,
  icon,
  getTooltipValue = (point) => point.value,
  getTooltipLabel = (point) => point.label,
  chartProps,
}: SalesGrowthCardProps<TData>) {
  const chartRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [tooltipWidth, setTooltipWidth] = useState(0);
  const [isHovering, setIsHovering] = useState(true);
  const [activePoint, setActivePoint] =
    useState<DotChartActivePoint<TData> | null>(null);

  const handleActivePointChange = useCallback(
    (point: DotChartActivePoint<TData>) => {
      setIsHovering(true);
      setActivePoint(point);
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const resolvedDotSize = Math.max(1, chartProps?.dotSize ?? 4);
  const resolvedGap = Math.max(0, chartProps?.gap ?? 5);
  const defaultIndex = clamp(
    defaultActiveIndex ?? Math.max(data.length - 2, 0),
    0,
    Math.max(data.length - 1, 0),
  );

  const visibleDataPoint = activePoint?.dataPoint ?? data[defaultIndex] ?? null;
  const tooltipValue = visibleDataPoint ? getTooltipValue(visibleDataPoint) : 0;
  const tooltipLabel = visibleDataPoint
    ? getTooltipLabel?.(visibleDataPoint)
    : null;

  const anchorX = useMotionValue(0);
  const tooltipX = useSpring(anchorX, TOOLTIP_SPRING);
  const lineX = useSpring(anchorX, LINE_SPRING);
  const clampedTooltipX = useTransform(tooltipX, (x) => {
    const half = tooltipWidth / 2;
    return clamp(x, half, Math.max(chartWidth - half, half));
  });

  useLayoutEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) =>
      setChartWidth(entry.contentRect.width),
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = tooltipRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) =>
      setTooltipWidth(entry.contentRect.width),
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (activePoint) {
      anchorX.set(activePoint.x);
      return;
    }
    if (chartWidth === 0 || data.length === 0) return;

    const cellSize = resolvedDotSize + resolvedGap;
    const cols = Math.max(1, Math.floor(chartWidth / cellSize));
    const col =
      cols <= 1 || data.length <= 1
        ? 0
        : Math.round((defaultIndex / (data.length - 1)) * (cols - 1));

    anchorX.set(col * cellSize + cellSize / 2);
  }, [
    activePoint,
    anchorX,
    chartWidth,
    data.length,
    defaultIndex,
    resolvedDotSize,
    resolvedGap,
  ]);

  return (
    <div
      className={cn(
        "relative w-full max-w-[480px] select-none overflow-hidden rounded-2xl bg-zinc-900 p-2 md:p-5 shadow-2xl",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-15 -right-15 z-0 size-30 bg-emerald-500 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-yellow-100">
            {icon ?? (
              <BarChart2 className="h-5 w-5 text-zinc-800" strokeWidth={1.8} />
            )}
          </div>
          <span className="text-base md:text-lg font-light tracking-tight text-white truncate">
            {title}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span className="text-2xl font-bold leading-none text-white">
            {value}
          </span>
          <div className="flex items-center items-end flex-col-reverse md:flex-row md:items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5">
              <TrendingUp
                className="h-3 w-3 text-emerald-400"
                strokeWidth={2.5}
              />
              <span className="text-xs font-semibold text-emerald-400">
                {trendValue}
              </span>
            </div>
            <span className="text-xs text-zinc-400 truncate">{trendLabel}</span>
          </div>
        </div>
      </div>

      <div ref={chartRef} className="relative">
        <motion.div
          className="pointer-events-none absolute inset-y-0 z-0 w-px border-l border-dashed border-white/25"
          style={{ left: lineX }}
        />

        <motion.div
          className="pointer-events-none absolute -top-4 z-10"
          style={{ left: clampedTooltipX, x: "-50%" }}
          animate={{ y: isHovering ? -12 : 0 }}
        >
          <motion.div
            key="tooltip"
            initial={{ y: 10, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 6, scale: 0.94, opacity: 0 }}
            transition={TOOLTIP_ENTER_SPRING}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                ref={tooltipRef}
                layout
                transition={{
                  layout: {
                    type: "spring",
                    stiffness: 420,
                    damping: 30,
                    mass: 0.52,
                  },
                }}
                className="flex flex-col gap-0.5 rounded-xl bg-white px-3 py-1.5 shadow-lg shadow-black/30"
              >
                {isHovering && tooltipLabel != null && (
                  <motion.span
                    key={activePoint?.dataIndex ?? defaultIndex}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={TOOLTIP_ENTER_SPRING}
                    className="text-[10px] font-medium uppercase tracking-tight text-zinc-400"
                  >
                    {tooltipLabel}
                  </motion.span>
                )}

                <NumberFlow
                  className="text-sm font-bold text-zinc-900"
                  format={VALUE_FORMAT}
                  locales="en-US"
                  prefix={tooltipPrefix}
                  value={tooltipValue}
                  willChange
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <div className="relative z-[1] pt-8">
          <DotChart
            data={data}
            defaultActiveIndex={defaultIndex}
            onActivePointChange={handleActivePointChange}
            onPointerLeave={handlePointerLeave}
            {...chartProps}
          />
        </div>
      </div>
    </div>
  );
}
