"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

import itMessages from "../../messages/it";
import enMessages from "../../messages/en";
import deMessages from "../../messages/de";

export type Locale = "it" | "en" | "de";

type Messages = Record<string, unknown>;

interface I18nContextType {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const baseMessages: Record<Locale, Messages> = {
  it: itMessages as Messages,
  en: enMessages as Messages,
  de: deMessages as Messages,
};

function deepMerge(target: Messages, source: Messages): Messages {
  const result: Messages = { ...target };
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object"
    ) {
      result[key] = deepMerge(target[key] as Messages, source[key] as Messages);
    } else if (source[key] !== undefined && source[key] !== "") {
      result[key] = source[key];
    }
  }
  return result;
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && current !== null) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("it");
  const [overrides, setOverrides] = useState<Record<Locale, Messages>>({ it: {}, en: {}, de: {} });

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("locale") as Locale : null;
    if (saved && ["it", "en", "de"].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setOverrides(data as Record<Locale, Messages>);
        }
      })
      .catch(() => {});
  }, []);

  const setLocale = useCallback((loc: Locale) => {
    setLocaleState(loc);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", loc);
      document.documentElement.lang = loc;
    }
  }, []);

  const messages = deepMerge(baseMessages[locale], overrides[locale] || {});

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(messages, key);
    },
    [messages]
  );

  return (
    <I18nContext.Provider value={{ locale, messages, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, locale, setLocale, messages } = useI18n();
  return { t, locale, setLocale, messages };
}
