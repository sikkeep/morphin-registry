import { cn } from "@/lib/utils";
import { useResizeMode } from "@/providers/resize";

export default function Lines({
  className,
  rows = 4,
  rowLines = [1, 3],
}: {
  className?: string;
  rows?: number;
  rowLines?: number[];
}) {
  const { resizeMode } = useResizeMode();

  const columns = resizeMode === "sm" ? 2 : resizeMode === "md" ? 4 : 8;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 grid", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index} className="relative h-full">
          <span className="absolute inset-y-0 left-0 w-px bg-neutral-900" />
          {index === columns - 1 ? (
            <span className="absolute inset-y-0 right-0 w-px bg-neutral-900" />
          ) : null}
        </div>
      ))}

      {rowLines.map((row) => (
        <span
          key={row}
          className="absolute left-0 right-0 h-px bg-neutral-900"
          style={{ top: `${(row / rows) * 100}%` }}
        />
      ))}
    </div>
  );
}
