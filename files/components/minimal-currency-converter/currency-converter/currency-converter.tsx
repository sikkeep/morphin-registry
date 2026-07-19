import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownUp, Moon, Sun } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { EXIT_QUICK, SPRING_ROTATE, SPRING_SNAPPY } from "./constants";
import { DarkContext } from "./dark-context";
import { TransferRow } from "./transfer-row";
import type { CurrencyCode } from "./types";
import { convertAmount, formatRate } from "./utils";
import { Button } from "@/components/ui/button";

export function CurrencyConverter() {
  const [sendCurrency, setSendCurrency] = useState<CurrencyCode>("USD");
  const [receiveCurrency, setReceiveCurrency] = useState<CurrencyCode>("EUR");
  const [sendAmount, setSendAmount] = useState(6.39);
  const [isDark, setIsDark] = useState(false);
  const [swapAngle, setSwapAngle] = useState(0);
  const reducedMotion = useReducedMotion();

  const receiveAmount = useMemo(
    () => convertAmount(sendAmount, sendCurrency, receiveCurrency),
    [receiveCurrency, sendAmount, sendCurrency],
  );

  const rate = useMemo(
    () => formatRate(sendCurrency, receiveCurrency),
    [receiveCurrency, sendCurrency],
  );

  const updateSendCurrency = useCallback(
    (next: CurrencyCode) => {
      if (next === sendCurrency) return;

      if (next === receiveCurrency) {
        setReceiveCurrency(sendCurrency);
      }

      setSendCurrency(next);
    },
    [receiveCurrency, sendCurrency],
  );

  const updateReceiveCurrency = useCallback(
    (next: CurrencyCode) => {
      if (next === receiveCurrency) return;

      if (next === sendCurrency) {
        setSendCurrency(receiveCurrency);
      }

      setReceiveCurrency(next);
    },
    [receiveCurrency, sendCurrency],
  );

  const swapCurrencies = useCallback(() => {
    if (!reducedMotion) {
      setSwapAngle((angle) => angle + 180);
    }

    setSendCurrency(receiveCurrency);
    setReceiveCurrency(sendCurrency);
    setSendAmount(Math.max(0.01, Math.round(receiveAmount * 100) / 100));
  }, [receiveAmount, receiveCurrency, reducedMotion, sendCurrency]);

  return (
    <DarkContext.Provider value={isDark}>
      <div className={cn("font-sans", isDark && "dark")}>
        <main className="min-h-screen bg-background px-4 py-6 font-sans text-foreground transition-colors duration-300 sm:px-6">
          <section className="mx-auto flex min-h-screen max-w-lg items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[34rem]"
            >
              <div className="rounded-4xl border border-border bg-secondary p-5 shadow-lg backdrop-blur-2xl transition-colors duration-300">
                <header className="mb-5 flex flex-row items-center justify-between gap-3 px-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl font-bold leading-none tracking-tight text-foreground">
                      Convert
                    </h1>

                    <div className="overflow-hidden rounded-full bg-neutral-50 dark:bg-neutral-900 px-3 py-1.5 shadow-sm">
                      {reducedMotion ? (
                        <span className="text-xs font-semibold text-muted-foreground">
                          1 {sendCurrency} = {rate} {receiveCurrency}
                        </span>
                      ) : (
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={`${sendCurrency}-${receiveCurrency}`}
                            className="block whitespace-nowrap text-xs font-semibold text-muted-foreground"
                            initial={{ opacity: 0, y: 8, scale: 0.88 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: SPRING_SNAPPY,
                            }}
                            exit={{
                              opacity: 0,
                              y: -8,
                              scale: 0.88,
                              transition: EXIT_QUICK,
                            }}
                          >
                            1 {sendCurrency} = {rate} {receiveCurrency}
                          </motion.span>
                        </AnimatePresence>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
                    aria-pressed={isDark}
                    onClick={() => setIsDark((current) => !current)}
                    className="hidden md:flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {isDark ? (
                      <Sun className="size-3.5" aria-hidden="true" />
                    ) : (
                      <Moon className="size-3.5" aria-hidden="true" />
                    )}
                    <span>{isDark ? "Light" : "Dark"}</span>
                  </button>
                </header>

                <div className="rounded-3xl bg-card p-4">
                  <div className="relative grid gap-3">
                    <TransferRow
                      label="You send"
                      currency={sendCurrency}
                      onCurrencyChange={updateSendCurrency}
                      amount={sendAmount}
                    />

                    <motion.button
                      type="button"
                      aria-label="Swap currencies"
                      animate={{ rotate: swapAngle }}
                      transition={SPRING_ROTATE}
                      whileTap={{ scale: 0.86 }}
                      whileHover={{ scale: 1.08 }}
                      onClick={swapCurrencies}
                      className="place-items-center size-10 rounded-full grid absolute border border-border bg-card left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <ArrowDownUp className="size-3.5" />
                    </motion.button>

                    <TransferRow
                      label="They get"
                      currency={receiveCurrency}
                      onCurrencyChange={updateReceiveCurrency}
                      amount={receiveAmount}
                    />
                  </div>

                  <div className="mt-4 border-t border-dashed border-border pt-3.5">
                    <div className="flex flex-row items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Fee
                      </span>
                      <span className="text-sm font-semibold">
                        <span className="text-foreground">$0.00</span>
                        <span className="px-1.5 text-muted-foreground/60">
                          ·
                        </span>
                        <span className="text-muted-foreground">
                          No hidden fees
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="default"
                    className="h-12 w-full rounded-full"
                    size="lg"
                  >
                    Connect Wallet
                  </Button>
                </div>
              </div>
            </motion.div>
          </section>
        </main>
      </div>
    </DarkContext.Provider>
  );
}
