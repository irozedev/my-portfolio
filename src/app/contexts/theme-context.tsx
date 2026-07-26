import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return (saved as Theme) || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;

      // Remove both classes first
      root.classList.remove("light", "dark");

      // Add the current theme class (Tailwind's `dark:` variant hooks onto this)
      root.classList.add(theme);

      // The full palettes live in src/styles/theme.css under `:root` (dark) and
      // `[data-theme="light"]`. Drive them from this attribute instead of
      // setting a handful of inline vars here — inline styles on <html> beat
      // every stylesheet rule, so a partial inline palette used to leave the
      // remaining vars (--bg-tertiary, --text-muted, --glass-*, --glow-*,
      // --shadow-color, --availability-*) stuck on their dark values in light
      // mode. That's what made the light theme look broken.
      root.setAttribute("data-theme", theme);

      // Keep the browser chrome (mobile address bar) in sync with the theme
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", theme === "light" ? "#ffffff" : "#0a0a0a");
      }

      // Let the UA style native widgets (scrollbars, form controls) correctly
      root.style.colorScheme = theme;

      // Save to localStorage
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default values instead of throwing during development
    console.warn("useTheme used outside ThemeProvider, returning defaults");
    return {
      theme: "dark" as Theme,
      toggleTheme: () => {},
      setTheme: () => {}
    };
  }
  return context;
}