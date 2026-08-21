import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CurrencyCode = "USD" | "GBP" | "EUR";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD (1.0)
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", rate: 1.0, label: "USD ($)" },
  GBP: { code: "GBP", symbol: "£", rate: 0.79, label: "GBP (£)" },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, label: "EUR (€)" },
};

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "USD",
      setCurrency: (currency) => set({ currency }),
      formatPrice: (amountInUSD) => {
        const config = CURRENCIES[get().currency] || CURRENCIES.USD;
        const converted = amountInUSD * config.rate;
        return `${config.symbol}${converted.toFixed(2)}`;
      },
    }),
    {
      name: "ecommerce_currency_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
