import { ThemeProvider } from "./contexts/theme-context";
import { LanguageProvider } from "./contexts/language-context";
import { AvailabilityProvider } from "./contexts/availability-context";
import { ViewModeProvider } from "./contexts/view-mode-context";
import { MainPage } from "./components/main-page";
import { Toaster } from "sonner";
import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "motion/react";
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
 
  const [currentPage, setCurrentPage] = useState<"home" | "privacy" | "terms" | "imprint" | "admin">(() => {
    // Safe window check for SSR
    if (typeof window === 'undefined') return "home";

    const hash = window.location.hash.slice(1);

    if (["privacy", "terms", "imprint", "admin"].includes(hash)) {
      return hash as any;
    }
    return "home";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (["privacy", "terms", "imprint", "admin"].includes(hash)) {
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
          </ViewModeProvider>
        </AvailabilityProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
