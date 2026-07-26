import { ThemeProvider } from "./contexts/theme-context";
import { LanguageProvider } from "./contexts/language-context";
import { AvailabilityProvider } from "./contexts/availability-context";
import { AuthProvider } from "./contexts/auth-context";
import { ViewModeProvider } from "./contexts/view-mode-context";
import { MainPage } from "./components/main-page";
import { BetaBanner } from "./components/beta-banner";
import { ViewModeToggle } from "./components/view-mode-toggle";
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
const AdminPage = lazy(() =>
  import("./components/admin-page").then((m) => ({ default: m.AdminPage })),
);
const Dashboard = lazy(() =>
  import("./components/dashboard").then((m) => ({ default: m.Dashboard })),
);
const UserProfilePage = lazy(() =>
  import("./components/user-profile-page").then((m) => ({ default: m.UserProfilePage })),
);

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
 
  const [currentPage, setCurrentPage] = useState<"home" | "privacy" | "terms" | "imprint" | "admin" | "dashboard" | "profile">(() => {
    // Safe window check for SSR
    if (typeof window === 'undefined') return "home";
    
    const hash = window.location.hash.slice(1);
    const path = window.location.pathname;
    
    if (path === "/dashboard") {
      return "dashboard";
    }
    if (path === "/profile") {
      return "profile";
    }
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

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/dashboard") {
        setCurrentPage("dashboard");
      } else if (path === "/profile") {
        setCurrentPage("profile");
      } else {
        handleHashChange();
      }
    };

    handleHashChange();
    
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handlePopState);
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
          {/* AuthProvider is required: AdminPage gates on the owner account via
              useAuth(). Without it the hook falls back to a logged-out stub and
              the panel can never be opened. */}
          <AuthProvider>
            <AvailabilityProvider>
              <Suspense fallback={<RouteFallback />}>
                <AdminPage />
              </Suspense>
              <Toaster position="top-right" richColors />
              <SpeedInsights />
              <Analytics />
            </AvailabilityProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  if (currentPage === "dashboard") {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AvailabilityProvider>
              <Suspense fallback={<RouteFallback />}>
                <Dashboard />
              </Suspense>
              <Toaster position="top-right" richColors />
              <SpeedInsights />
              <Analytics />
            </AvailabilityProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  if (currentPage === "profile") {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Suspense fallback={<RouteFallback />}>
              <UserProfilePage />
            </Suspense>
            <Toaster position="top-right" richColors />
            <SpeedInsights />
            <Analytics />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
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
              <BetaBanner />
              <ViewModeToggle />
              <Toaster position="top-right" richColors />
              <SpeedInsights />
              <Analytics />
            </ViewModeProvider>
          </AvailabilityProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
