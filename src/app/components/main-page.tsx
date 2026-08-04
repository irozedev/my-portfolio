import { ContactSection } from "./contact-section";
import { Footer } from "./footer";
import { CookieBanner } from "./cookie-banner";
import { SEOHead } from "./seo-head";
import { PersonalCabinet } from "./personal-cabinet";
import { Navigation } from "./navigation";
import { HeroUltraModern } from "./hero-ultra-modern";
import { AboutSection } from "./about-section";
import { ExperienceTimelinePremium } from "./experience-timeline-premium";
import { PortfolioCreativeSlider } from "./portfolio-creative-slider";
import { ServicesCreativeSlider } from "./services-creative-slider";
import { HowIWork } from "./how-i-work";
import { GitHubShowcase } from "./github-showcase";
import { ScrollToTopButton } from "./scroll-to-top-button";
import { useViewMode } from "../contexts/view-mode-context";
import { useLanguage } from "../contexts/language-context";
import { useState } from "react";

export function MainPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isClientMode, isCVMode } = useViewMode();
  const { t } = useLanguage();

  // Scroll to projects section
  const handleViewWork = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <SEOHead />

      {/* First tab stop: lets keyboard users jump past the banner and the ~20
          navigation controls straight to the content. */}
      <a href="#hero" className="skip-link">
        {t("nav.skipToContent")}
      </a>

      {/* Navigation */}
      <Navigation onOpenProfile={() => setIsProfileOpen(true)} />

      {/* CLIENT MODE: Hero → Services → Projects → Why me → Contact */}
      {isClientMode && (
        <>
          {/* Hero Section - ULTRA MODERN BENTO GRID */}
          <HeroUltraModern onViewWork={handleViewWork} />
          
          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
          
          {/* Services FIRST for clients */}
          <ServicesCreativeSlider />

          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />

          {/* How I work — process + honest timelines */}
          <HowIWork />

          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />

          {/* Projects */}
          <PortfolioCreativeSlider />
          
          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
          
          {/* GitHub Showcase */}
          <GitHubShowcase />
          
          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
          
          {/* Why me / About */}
          <AboutSection />
          
          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
          
          {/* Contact */}
          <ContactSection />
        </>
      )}

      {/* CV MODE: Hero → Experience → Skills → Projects → Contact */}
      {isCVMode && (
        <>
          {/* Hero Section - simplified */}
          <HeroUltraModern onViewWork={handleViewWork} />
          
          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
          
          {/* Experience FIRST for CV */}
          <ExperienceTimelinePremium />
          
          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
          
          {/* About = Skills section */}
          <AboutSection />
          
          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
          
          {/* Projects */}
          <PortfolioCreativeSlider />
          
          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
          
          {/* GitHub Showcase */}
          <GitHubShowcase />

          {/* HowIWork is client-only. Its content is a sales funnel — "Intro —
              free", "You tell me what you need", "Quote & timeline" — which is
              1500px of nothing for a recruiter, and worse: it reads as "looking
              for gigs" to someone considering an employment offer. */}

          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />

          {/* Contact (no chat bot) */}
          <ContactSection />
        </>
      )}
      
      <Footer />
      
      <CookieBanner />
      
      
      <PersonalCabinet isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* SiteTour removed. Its launcher was a fixed button in the bottom-left
          corner that sat on top of the About cards, and a guided tour is the
          wrong affordance here: a recruiter reads the page for a minute and
          leaves. The component is still in the tree if it is ever wanted. */}

      {/* Unified Scroll-to-Top + ChatBot */}
      <ScrollToTopButton />

      {/* ViewModeToggle is NOT rendered here. App.tsx mounts it once for every
          route, including the legal pages; mounting it here as well put two
          identical fixed panels at the same coordinates — invisible as a double
          image, but the second one still ate clicks and doubled the listeners. */}
    </main>
  );
}