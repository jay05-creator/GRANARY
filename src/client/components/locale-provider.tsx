import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/client/i18n";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({ locale: "en", setLocale: () => {} });

const STORAGE_KEY = "granary-locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && VALID_LOCALES.includes(stored)) {
      setLocaleState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

const VALID_LOCALES: Locale[] = ["en", "hi", "mr", "bn", "ta", "te", "kn"];
