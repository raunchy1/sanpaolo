"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Locale = "it" | "en" | "de";

type Messages = Record<string, unknown>;

interface I18nContextType {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const messageCache: Record<Locale, Messages> = {
  it: {},
  en: {},
  de: {},
};

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
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("locale") as Locale : null;
    if (saved && ["it", "en", "de"].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const loadMessages = useCallback(async (loc: Locale) => {
    if (Object.keys(messageCache[loc]).length > 0) {
      setMessages(messageCache[loc]);
      return;
    }
    try {
      const mod = await import(`../../messages/${loc}.json`);
      messageCache[loc] = mod.default || mod;
      setMessages(messageCache[loc]);
    } catch (e) {
      console.error(`Failed to load messages for ${loc}:`, e);
    }
  }, []);

  useEffect(() => {
    loadMessages(locale);
  }, [locale, loadMessages]);

  const setLocale = useCallback((loc: Locale) => {
    setLocaleState(loc);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", loc);
      document.documentElement.lang = loc;
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(messages as Record<string, unknown>, key);
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
