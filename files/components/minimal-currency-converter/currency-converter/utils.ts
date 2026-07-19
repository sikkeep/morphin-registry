import { currencyByCode } from "./constants";
import type { CurrencyCode } from "./types";

export function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
) {
  return (amount / currencyByCode[from].perUsd) * currencyByCode[to].perUsd;
}

export function formatRate(from: CurrencyCode, to: CurrencyCode) {
  return convertAmount(1, from, to).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}
