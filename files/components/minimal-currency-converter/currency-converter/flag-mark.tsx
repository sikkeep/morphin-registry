import { cn } from "@/lib/utils";
import type { CurrencyCode } from "./types";

export function FlagMark({ code }: { code: CurrencyCode }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-7 shrink-0 overflow-hidden rounded-full border border-border",
        code === "EUR" && "bg-blue-800",
        code === "GBP" && "bg-blue-950",
        code === "JPY" && "bg-card",
      )}
    >
      {code === "USD" && (
        <>
          <span className="absolute inset-0 grid grid-rows-6">
            <span className="bg-red-700" />
            <span className="bg-card" />
            <span className="bg-red-700" />
            <span className="bg-card" />
            <span className="bg-red-700" />
            <span className="bg-card" />
          </span>
          <span className="absolute left-0 top-0 size-3 rounded-br-sm bg-blue-900" />
        </>
      )}
      {code === "EUR" && (
        <span className="m-auto size-3 rounded-full bg-amber-400 shadow-sm" />
      )}
      {code === "GBP" && (
        <>
          <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-card" />
          <span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-card" />
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-red-700" />
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-red-700" />
        </>
      )}
      {code === "JPY" && (
        <span className="m-auto size-3 rounded-full bg-red-600" />
      )}
    </span>
  );
}
