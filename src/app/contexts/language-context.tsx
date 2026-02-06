import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "@/utils/translations";

export type Language = "en" | "uk" | "nl" | "ar" | "es";

// Validate translations on import
if (!translations || typeof translations !== 'object') {
  console.error('Translations object is invalid or not loaded');
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      // Check if user has previously selected a language
      const saved = localStorage.getItem("language");
      // Validate saved language
      if (saved && (saved === "en" || saved === "uk" || saved === "nl" || saved === "ar" || saved === "es")) {
        return saved as Language;
      }
      // Clear invalid value
      localStorage.removeItem("language");
      
      // Auto-detect browser language
      const browserLang = navigator.language || navigator.languages?.[0] || "en";
      const langCode = browserLang.toLowerCase().split('-')[0]; // Get just 'en' from 'en-US'
      
      // Map browser language to our supported languages
      const languageMap: Record<string, Language> = {
        'en': 'en',
        'uk': 'uk',
        'ua': 'uk', // Ukrainian can be 'ua' or 'uk'
        'nl': 'nl',
        'ar': 'ar',
        'es': 'es',
      };
      
      const detectedLang = languageMap[langCode];
      
      if (detectedLang) {
        console.log(`🌍 Auto-detected browser language: ${browserLang} → ${detectedLang}`);
        return detectedLang;
      }
      
      // Fallback to English
      console.log(`🌍 Browser language '${browserLang}' not supported, using English`);
    }
    return "en";
  });

  const isRTL = language === "ar";

  // Set lang attribute and direction on mount and when language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      // Add/remove RTL class for additional styling
      if (isRTL) {
        document.documentElement.classList.add("rtl");
      } else {
        document.documentElement.classList.remove("rtl");
      }
    }
  }, [language, isRTL]);

  const t = (key: string): string => {
    // Navigate through nested object using dot notation
    const keys = key.split('.');
    let value: any = translations[language];
    
    // Debug log only if translations is completely missing
    if (!value && import.meta.env.DEV) {
      console.error(`Translations object is undefined for language: ${language}`);
      return key;
    }
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Only warn in development and if it's not a known issue
        if (import.meta.env.DEV && value !== undefined) {
          console.warn(`Translation key not found: ${key} for language: ${language}`);
        }
        return key; // Return key if path doesn't exist
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Silently return defaults - this can happen during initial render in StrictMode
    // and is not an actual error
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (key: string) => key,
      isRTL: false
    };
  }
  return context;
}