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
      
      // Add the current theme class
      root.classList.add(theme);
      
      // Save to localStorage
      localStorage.setItem("theme", theme);
      
      // Apply theme-specific colors
      if (theme === "light") {
        root.style.setProperty("--bg-primary", "#ffffff");
        root.style.setProperty("--bg-secondary", "#f5f5f5");
        root.style.setProperty("--text-primary", "#0a0a0a");
        root.style.setProperty("--text-secondary", "#666666");
        root.style.setProperty("--border-color", "#e5e5e5");
        root.style.setProperty("--accent-primary", "#00d9ff");
        root.style.setProperty("--accent-secondary", "#0099ff");
        root.style.setProperty("--card-bg", "#ffffff");
        root.style.setProperty("--card-border", "#e5e5e5");
        root.style.setProperty("--hover-bg", "#f8f8f8");
      } else {
        root.style.setProperty("--bg-primary", "#0a0a0a");
        root.style.setProperty("--bg-secondary", "#1a1a1a");
        root.style.setProperty("--text-primary", "#ffffff");
        root.style.setProperty("--text-secondary", "#a0a0a0");
        root.style.setProperty("--border-color", "#2a2a2a");
        root.style.setProperty("--accent-primary", "#00d9ff");
        root.style.setProperty("--accent-secondary", "#0099ff");
        root.style.setProperty("--card-bg", "#0f0f0f");
        root.style.setProperty("--card-border", "#2a2a2a");
        root.style.setProperty("--hover-bg", "#1f1f1f");
      }
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