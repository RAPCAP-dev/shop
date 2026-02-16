"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import en from "./lang/en";
import ru from "./lang/ru";

type Locale = "en" | "ru";
type Translations = typeof en;

const TRANSLATIONS: Record<Locale, Translations> = {
  en,
  ru,
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (k: keyof Translations) => string;
} | null>(null);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState<Locale>("en");
  const value = useMemo(() => {
    const t = (k: keyof Translations) => TRANSLATIONS[locale][k] ?? String(k);
    return { locale, setLocale, t };
  }, [locale]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

const i18n = { LocaleProvider, useLocale };

export default i18n;
