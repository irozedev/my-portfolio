import { ThemeProvider } from "./contexts/theme-context";
import { LanguageProvider } from "./contexts/language-context";
import { AvailabilityProvider } from "./contexts/availability-context";
import { ViewModeProvider } from "./contexts/view-mode-context";
import { MainPage } from "./components/main-page";
import { Toaster } from "sonner";
import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "./components/analytics";

// Secondary routes. None of these are on the path to first paint — the home
// page is what people (and crawlers) land on — so they ship as separate chunks
// fetched only when their hash route is opened.
const LegalPage = lazy(() =>
  import("./components/legal-pages").then((m) => ({ default: m.LegalPage })),
);
const AdminRoute = lazy(() =>
  import("./components/admin-page").then((m) => ({ default: m.AdminRoute })),
);
const CVPrint = lazy(() =>
  import("./components/cv-print").then((m) => ({ default: m.CVPrint })),
);
// /dashboard and /profile are gone with the rest of the account surface. They
// were two full pages behind a sign-in that only ever had one user.

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div
        className="w-10 h-10 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}


export default function App() {
 
  const [currentPage, setCurrentPage] = useState<"home" | "privacy" | "terms" | "imprint" | "admin" | "cv">(() => {
    // Safe window check for SSR
    if (typeof window === 'undefined') return "home";

    const hash = window.location.hash.slice(1);

    if (["privacy", "terms", "imprint", "admin", "cv"].includes(hash)) {
      return hash as any;
    }
    return "home";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (["privacy", "terms", "imprint", "admin", "cv"].includes(hash)) {
        setCurrentPage(hash as any);
      } else {
        setCurrentPage("home");
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const closeToHome = () => {
    // Clear the hash without scrolling
    window.history.replaceState(null, '', window.location.pathname);
    setCurrentPage("home");
  };

  // The CV renders on its own, outside every provider except language: it is a
  // document, not a page of the site, and it must not inherit the dark theme.
  if (currentPage === "cv") {
    return (
      <LanguageProvider>
        <Suspense fallback={<RouteFallback />}>
          <CVPrint onClose={closeToHome} />
        </Suspense>
        <Analytics />
      </LanguageProvider>
    );
  }

  const handleCloseLegal = () => {
    // Clear the hash without scrolling
    window.history.replaceState(null, '', window.location.pathname);
    setCurrentPage("home");
  };

  if (currentPage === "admin") {
    return (
      <ThemeProvider>
        <LanguageProvider>
          {/* AdminRoute brings its own AuthProvider, so `@supabase/supabase-js`
              stays inside the lazily-loaded admin chunk instead of the entry
              bundle every visitor downloads. */}
          <AvailabilityProvider>
            <Suspense fallback={<RouteFallback />}>
              <AdminRoute />
            </Suspense>
            <Toaster position="top-right" richColors />
            <SpeedInsights />
            <Analytics />
          </AvailabilityProvider>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        {/* No AuthProvider on the public site any more. The only page that
            authenticates is #admin, which wraps itself above. */}
        <AvailabilityProvider>
          <ViewModeProvider>
            {/*
              `reducedMotion="user"` makes every Motion animation on the site
              honour the OS "reduce motion" setting — it strips transforms and
              keeps opacity, so entrances become clean fades.

              This was a real gap, not a nicety. The CSS in index.css and
              theme.css already had `@media (prefers-reduced-motion: reduce)`
              blocks, but those only reach CSS animations and transitions.
              Motion drives its animations from JavaScript through inline
              styles, so all ~380 of them ignored the setting entirely — the
              one group of animations big enough to actually make someone ill.
            */}
            <MotionConfig reducedMotion="user">
            <AnimatePresence mode="wait">
              {currentPage === "home" ? (
                <MainPage key="main" />
              ) : currentPage === "privacy" || currentPage === "terms" || currentPage === "imprint" ? (
                <Suspense key={currentPage} fallback={<RouteFallback />}>
                  <LegalPage page={currentPage} onClose={handleCloseLegal} />
                </Suspense>
              ) : null}
            </AnimatePresence>
            {/* Beta banner removed: the one piece of work a visitor judges
                the author by should not announce that it is unfinished.

                ViewModeToggle moved into Navigation — it is no longer a
                floating panel, so it is rendered where the rest of the
                navigation lives. */}
            <Toaster position="top-right" richColors />
            <SpeedInsights />
            <Analytics />
            </MotionConfig>
          </ViewModeProvider>
        </AvailabilityProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
