"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, EcomTranslations, ECOM_DICTIONARIES } from "./i18nDict";

export * from "./i18nDict";

interface EcomI18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: EcomTranslations;
  dir: "ltr" | "rtl";
}

const STORAGE_KEY = "ecommerce_locale_v2";

const EcomI18nContext = createContext<EcomI18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: ECOM_DICTIONARIES.en,
  dir: "ltr",
});

export function EcomI18nProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // Keep html attributes in sync
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    } catch {
      // fallback
    }
  };

  const value: EcomI18nContextType = {
    locale,
    setLocale,
    t: ECOM_DICTIONARIES[locale] || ECOM_DICTIONARIES.en,
    dir: locale === "ar" ? "rtl" : "ltr",
  };

  return <EcomI18nContext.Provider value={value}>{children}</EcomI18nContext.Provider>;
}

export function useEcomI18n() {
  return useContext(EcomI18nContext);
}
