import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { currencyByCode, EXIT_QUICK, SPRING_BOUNCE } from "./constants";
import type { CurrencyCode } from "./types";

export function AnimatedAmount({
  value,
  currency,
}: {
  value: number;
  currency: CurrencyCode;
}) {
  const reducedMotion = useReducedMotion();
  const fractionDigits = currency === "JPY" ? 0 : 2;
  const symbol = currencyByCode[currency].symbol;

  return (
    <div className="flex items-baseline justify-end gap-1 tabular-nums">
      {reducedMotion ? (
        <span
          className="text-xl font-black text-muted-foreground/60"
          aria-hidden="true"
        >
          {symbol}
        </span>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currency}
            aria-hidden="true"
            className="text-4xl font-bold text-muted-foreground/60"
            initial={{ opacity: 0, scale: 0.75, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: SPRING_BOUNCE }}
            exit={{ opacity: 0, scale: 0.75, y: -5, transition: EXIT_QUICK }}
          >
            {symbol}
          </motion.span>
        </AnimatePresence>
      )}

      <NumberFlow
        value={value}
        format={{
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
        }}
        transformTiming={{
          duration: 750,
          easing:
            "linear(0, 0.0018, 0.0069 1.15%, 0.026 2.3%, 0.0637, 0.1135 5.18%, 0.2229 7.78%, 0.5977 15.84%, 0.7014, 0.7904, 0.8641, 0.9228, 0.9676 28.8%, 1.0032 31.68%, 1.0225, 1.0352 36.29%, 1.0431 38.88%, 1.046 42.05%, 1.0448 44.35%, 1.0407 47.23%, 1.0118 61.63%, 1.0025 69.41%, 0.9981 80.35%, 0.9992 99.94%)",
        }}
        spinTiming={{
          duration: 750,
          easing:
            "linear(0, 0.0018, 0.0069 1.15%, 0.026 2.3%, 0.0637, 0.1135 5.18%, 0.2229 7.78%, 0.5977 15.84%, 0.7014, 0.7904, 0.8641, 0.9228, 0.9676 28.8%, 1.0032 31.68%, 1.0225, 1.0352 36.29%, 1.0431 38.88%, 1.046 42.05%, 1.0448 44.35%, 1.0407 47.23%, 1.0118 61.63%, 1.0025 69.41%, 0.9981 80.35%, 0.9992 99.94%)",
        }}
        opacityTiming={{ duration: 350, easing: "ease-out" }}
        className="text-4xl font-bold leading-none tracking-tight text-foreground"
      />
    </div>
  );
}
