export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY";

export type Currency = {
  code: CurrencyCode;
  label: string;
  symbol: string;
  perUsd: number;
};
