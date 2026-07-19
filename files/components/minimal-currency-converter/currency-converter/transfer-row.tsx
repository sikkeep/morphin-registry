import { AnimatedAmount } from "./animated-amount";
import { CurrencySelect } from "./currency-select";
import type { CurrencyCode } from "./types";

export function TransferRow({
  label,
  currency,
  onCurrencyChange,
  amount,
}: {
  label: string;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  amount: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-muted px-5 py-4">
      <div className="flex min-h-[4.5rem] flex-row items-center justify-between gap-4">
        <CurrencySelect value={currency} onValueChange={onCurrencyChange} />
        <div className="grid min-w-0 flex-1 justify-items-end gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">
            {label}
          </span>
          <AnimatedAmount value={amount} currency={currency} />
        </div>
      </div>
    </div>
  );
}
