import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "@/utils/translations";

export type Language = "en" | "nl" | "ar" | "es";

/**
 * The languages the site offers. Single source of truth: the switcher, ?lang=,
 * the saved choice and browser auto-detection all validate against this list
 * and nothing else.
 *
 * Ukrainian used to be here and was removed outright — not just hidden. The
 * site targets employers in Belgium, the Netherlands and the rest of Europe,
 * so the translations were dead weight shipped in every bundle. The strings
 * are gone from the components too; `L()` now takes (en, nl, ar, es).
 */
const OFFERED: readonly string[] = ["en", "nl", "ar", "es"];

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
      // 1. ?lang= in the URL wins. index.html, sitemap.xml and seo-head.tsx all
      //    publish hreflang alternates like https://roze.live/?lang=nl — without
      //    honouring the param those URLs served identical English content, so
      //    the whole hreflang cluster read as duplicate pages to crawlers.
      const urlLang = new URLSearchParams(window.location.search).get("lang");
      if (urlLang) {
        const normalized = urlLang.toLowerCase().split("-")[0];
        if (OFFERED.includes(normalized)) {
          return normalized as Language;
        }
      }

      // Check if the user has previously selected a language. A removed
      // language is rejected here too: a visitor who once picked Ukrainian
      // still has it in localStorage and would otherwise keep seeing it.
      const saved = localStorage.getItem("language");
      if (saved && OFFERED.includes(saved)) {
        return saved as Language;
      }
      // Clear invalid value
      localStorage.removeItem("language");
      
      // Auto-detect from the visitor's locale.
      //
      // navigator.languages is the full ordered preference list; navigator.language
      // is only the first entry. Reading just the first meant a browser set to
      // [fr-BE, nl-BE, en] fell through to English even though the visitor reads
      // Dutch — in Belgium that ordering is completely ordinary.
      const preferred: string[] = [
        ...(navigator.languages ?? []),
        navigator.language,
      ].filter(Boolean) as string[];
      
      // Dutch is now detected like every other offered language.
      //
      // It used to be excluded on purpose: the copy has never been proof-read
      // by a native speaker, and weak Dutch is spotted instantly in Benelux,
      // where English is normal in IT anyway. That trade was made deliberately.
      //
      // It has been reversed deliberately too. The site sells to Flanders and
      // the Netherlands now, and a Dutch-speaking buyer landing on English
      // reads as "not really local here" — which costs more, on the commercial
      // side, than an imperfect sentence does. The risk did not go away: the
      // copy still wants a native pass, and that is now the highest-value
      // proof-reading job on the site rather than an optional one.
      for (const tag of preferred) {
        const code = tag.toLowerCase().split("-")[0];
        if (OFFERED.includes(code)) {
          return code as Language;
        }
      }
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

  // Arabic webfonts are ~200 KB and useless to the other four locales, so they
  // are not in index.html. Inject them the first time someone picks Arabic;
  // the <link> is idempotent and stays for the rest of the session.
  useEffect(() => {
    if (typeof document === "undefined" || language !== "ar") return;
    const id = "arabic-fonts";
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800" +
      "&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, [language]);

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

      // Keep the URL in sync with the published hreflang alternates so a shared
      // or crawled link reproduces the same language. replaceState keeps the
      // hash (section anchors) and adds no history entry.
      try {
        const url = new URL(window.location.href);
        if (lang === "en") {
          url.searchParams.delete("lang"); // English is the x-default at /
        } else {
          url.searchParams.set("lang", lang);
        }
        window.history.replaceState(null, "", url.toString());
      } catch {
        /* non-fatal — language still switches */
      }
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