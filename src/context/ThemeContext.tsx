"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LEGACY_THEME_KEYS, THEME_KEY } from "@/lib/config";
import type { Language } from "@/lib/types";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  uiLocale: Language;
  setUiLocale: (locale: Language) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readLegacyTheme(): Theme | null {
  for (const key of LEGACY_THEME_KEYS) {
    const value = localStorage.getItem(key) as Theme | null;
    if (value === "light" || value === "dark") return value;
  }
  return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [uiLocale, setUiLocaleState] = useState<Language>("id");

  useEffect(() => {
    const saved =
      (localStorage.getItem(THEME_KEY) as Theme | null) ?? readLegacyTheme();
    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
    for (const key of LEGACY_THEME_KEYS) {
      if (localStorage.getItem(key)) localStorage.removeItem(key);
    }
    if (!localStorage.getItem(THEME_KEY)) {
      localStorage.setItem(THEME_KEY, saved ?? "light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  const setUiLocale = useCallback((locale: Language) => {
    setUiLocaleState(locale);
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, uiLocale, setUiLocale }),
    [theme, toggleTheme, uiLocale, setUiLocale],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}