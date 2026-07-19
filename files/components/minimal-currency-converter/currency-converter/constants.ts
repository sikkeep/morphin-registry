import type { Currency, CurrencyCode } from "./types";

export const currencies: Currency[] = [
  { code: "USD", label: "United States Dollar", symbol: "$", perUsd: 1 },
  { code: "EUR", label: "Euro", symbol: "€", perUsd: 0.92 },
  { code: "GBP", label: "British Pound", symbol: "£", perUsd: 0.78 },
  { code: "JPY", label: "Japanese Yen", symbol: "¥", perUsd: 157.43 },
];

export const currencyByCode = Object.fromEntries(
  currencies.map((currency) => [currency.code, currency]),
) as Record<CurrencyCode, Currency>;

export const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 620,
  damping: 38,
  mass: 0.8,
};

export const SPRING_BOUNCE = {
  type: "spring" as const,
  stiffness: 500,
  damping: 22,
  mass: 0.6,
};

export const SPRING_ROTATE = {
  type: "spring" as const,
  stiffness: 320,
  damping: 24,
  mass: 1.0,
};

export const EXIT_QUICK = { duration: 0.1, ease: [0.4, 0, 1, 1] as const };
