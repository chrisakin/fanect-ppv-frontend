import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Theme type - light or dark mode
 * @typedef {"light" | "dark"} Theme
 */
export type Theme = "light" | "dark";

/**
 * Theme context value type
 * @interface ThemeContextType
 * @property {Theme} theme - Current theme
 * @property {Function} setTheme - Function to update theme
 */
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/**
 * React context for theme management
 * @type {React.Context<ThemeContextType | undefined>}
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider Component - Provides theme context to child components
 * 
 * Features:
 * - Persists theme selection in localStorage
 * - Respects system color scheme preference on first load
 * - Updates DOM root class (light/dark) when theme changes
 * - SSR-safe (checks for typeof window)
 * 
 * @param {Object} props - Provider props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider wrapper
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /**
   * Initialize theme from localStorage or system preference
   * @type {[Theme, Function]}
   */
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as Theme;
      if (stored) return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  /**
   * Update DOM and localStorage when theme changes
   * Adds/removes light/dark class on document root
   */
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook - Access theme context
 * 
 * Throws error if used outside ThemeProvider
 * 
 * @returns {ThemeContextType} Theme context with current theme and setter
 * @throws {Error} If used outside ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}