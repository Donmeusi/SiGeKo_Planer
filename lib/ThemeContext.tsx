"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "dark" | "light" | "slate" | "sand" | "blueprint";

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  shortName: string;
  description: string;
  previewBg: string;
  previewAccent: string;
  isDark: boolean;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "dark",
    name: "Industrial Dark",
    shortName: "Dunkel",
    description: "Sicherheits-Amber & Navy (Standard)",
    previewBg: "#090d16",
    previewAccent: "#f59e0b",
    isDark: true,
  },
  {
    id: "light",
    name: "Architektur Hell",
    shortName: "Hell",
    description: "Klares Papierweiß & Schiefer (Tageslicht)",
    previewBg: "#f8fafc",
    previewAccent: "#ea580c",
    isDark: false,
  },
  {
    id: "slate",
    name: "Baustellen Slate",
    shortName: "Slate",
    description: "Graphit & Zinkgrau (Augenschonend)",
    previewBg: "#18181b",
    previewAccent: "#10b981",
    isDark: true,
  },
  {
    id: "sand",
    name: "Warm Sandstein",
    shortName: "Sandstein",
    description: "Warme Naturstein- & Erdtöne (Sepia)",
    previewBg: "#f7f4ed",
    previewAccent: "#c2410c",
    isDark: false,
  },
  {
    id: "blueprint",
    name: "Ingenieur Blueprint",
    shortName: "Blueprint",
    description: "Technisches Marine- & Stahlblau",
    previewBg: "#0b1528",
    previewAccent: "#38bdf8",
    isDark: true,
  },
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  isDark: true,
});

const STORAGE_KEY = "sigeko_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read stored theme or system preference
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored && THEME_OPTIONS.some((t) => t.id === stored)) {
      setThemeState(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      const initial = prefersLight ? "light" : "dark";
      setThemeState(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch (err) {
      console.error("Failed to save theme to localStorage", err);
    }
  };

  const currentOption = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark: currentOption.isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
