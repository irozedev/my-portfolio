import { ThemeProvider } from "./contexts/theme-context";
import { LanguageProvider } from "./contexts/language-context";
import { AvailabilityProvider } from "./contexts/availability-context";
import { AuthProvider } from "./contexts/auth-context";
import { CartProvider } from "./contexts/cart-context";
import { ViewModeProvider } from "./contexts/view-mode-context";
import { MainPage } from "./components/main-page";
import { LegalPage } from "./components/legal-pages";
import { AdminPage } from "./components/admin-page";
import { Dashboard } from "./components/dashboard";
import { UserProfilePage } from "./components/user-profile-page";
import { BetaBanner } from "./components/beta-banner";
import { ViewModeToggle } from "./components/view-mode-toggle";
import { ScrollToTopButton } from "./components/scroll-to-top-button";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";


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
          <AvailabilityProvider>
            <AdminPage />
          </AvailabilityProvider>
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
              <Dashboard />
              <Toaster position="top-right" richColors />
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
            <UserProfilePage />
            <Toaster position="top-right" richColors />
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
            <CartProvider>
              <ViewModeProvider>
                <AnimatePresence mode="wait">
                  {currentPage === "home" ? (
                    <MainPage key="main" />
                  ) : currentPage === "privacy" || currentPage === "terms" || currentPage === "imprint" ? (
                    <LegalPage 
                      key={currentPage}
                      page={currentPage}
                      onClose={handleCloseLegal}
                    />
                  ) : null}
                </AnimatePresence>
                <BetaBanner />
                <ViewModeToggle />
                <Toaster position="top-right" richColors />
                <ScrollToTopButton />
              </ViewModeProvider>
            </CartProvider>
          </AvailabilityProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}