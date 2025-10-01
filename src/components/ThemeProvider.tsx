"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeTheme, setActiveTheme] = useState<Theme>("light");

  useEffect(() => {
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setActiveTheme(savedTheme);
    } else {
      // Check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setActiveTheme(systemTheme);
    }
  }, []);

  useEffect(() => {
    // Update document class and localStorage when theme changes
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(activeTheme);
    localStorage.setItem("theme", activeTheme);
  }, [activeTheme]);

  const toggleTheme = () => {
    setActiveTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  const setTheme = (theme: Theme) => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setActiveTheme(systemTheme);
    } else {
      setActiveTheme(theme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme: activeTheme, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
