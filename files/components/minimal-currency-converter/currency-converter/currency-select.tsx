import * as Select from "@radix-ui/react-select";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useContext } from "react";
import { cn } from "@/lib/utils";
import {
  currencyByCode,
  currencies,
  EXIT_QUICK,
  SPRING_BOUNCE,
} from "./constants";
import { DarkContext } from "./dark-context";
import { FlagMark } from "./flag-mark";
import type { CurrencyCode } from "./types";

export function CurrencySelect({
  value,
  onValueChange,
}: {
  value: CurrencyCode;
  onValueChange: (value: CurrencyCode) => void;
}) {
  const reducedMotion = useReducedMotion();
  const isDark = useContext(DarkContext);

  return (
    <Select.Root
      value={value}
      onValueChange={(next) => onValueChange(next as CurrencyCode)}
    >
      <Select.Trigger
        aria-label={`Select currency, currently ${currencyByCode[value].label}`}
        className="group inline-flex h-11 min-w-[7.5rem] shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-2 text-left outline-none transition-[border-color,box-shadow] duration-150 hover:border-muted-foreground/40 focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:border-ring"
      >
        <span className="inline-flex min-w-0 flex-1 items-center overflow-hidden">
          {reducedMotion ? (
            <span className="inline-flex items-center gap-2">
              <FlagMark code={value} />
              <span className="text-base font-black tracking-normal text-foreground">
                {value}
              </span>
            </span>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={value}
                className="inline-flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.72, y: 7 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: SPRING_BOUNCE,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.72,
                  y: -7,
                  transition: EXIT_QUICK,
                }}
              >
                <FlagMark code={value} />
                <span className="text-base font-black tracking-normal text-foreground">
                  {value}
                </span>
              </motion.span>
            </AnimatePresence>
          )}
        </span>

        <Select.Icon asChild>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className={cn(
            "z-50 min-w-56 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground",
            isDark && "dark",
          )}
        >
          <Select.Viewport>
            {currencies.map((currency) => (
              <Select.Item
                key={currency.code}
                value={currency.code}
                className="relative flex cursor-default select-none items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors data-[highlighted]:bg-accent"
              >
                <FlagMark code={currency.code} />
                <Select.ItemText>
                  <span className="grid gap-0.5">
                    <span className="text-sm font-bold leading-none text-foreground">
                      {currency.code}
                    </span>
                    <span className="text-xs leading-none text-muted-foreground">
                      {currency.label}
                    </span>
                  </span>
                </Select.ItemText>
                <Select.ItemIndicator className="ml-auto text-primary">
                  <Check className="size-3.5" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
