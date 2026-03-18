import { ContactSection } from "./contact-section";
import { Footer } from "./footer";
import { CookieBanner } from "./cookie-banner";
import { CartButton } from "./cart-button";
import { SEOHead } from "./seo-head";
import { PersonalCabinet } from "./personal-cabinet";
import { Navigation } from "./navigation";
import { BetaBanner } from "./beta-banner";
import { SiteTour } from "./site-tour";
import { ChatBot } from "./chat-bot";
import { HeroUltraModern } from "./hero-ultra-modern";
import { AboutSection } from "./about-section";
import { ExperienceTimelinePremium } from "./experience-timeline-premium";
import { PortfolioCreativeSlider } from "./portfolio-creative-slider";
import { ServicesCreativeSlider } from "./services-creative-slider";
import { useViewMode } from "../contexts/view-mode-context";
import { useState } from "react";

export function MainPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isClientMode, isCVMode } = useViewMode();

  // Scroll to projects section
  const handleViewWork = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <SEOHead />
      
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
          
          {/* Projects */}
          <PortfolioCreativeSlider />
          
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
          
          {/* Contact (no chat bot) */}
          <ContactSection />
        </>
      )}
      
      <Footer />
      
      <CookieBanner />
      
      {/* Cart only in CLIENT mode */}
      {isClientMode && <CartButton />}
      
      <PersonalCabinet isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      <BetaBanner />
      
      <SiteTour />
      
      {/* ChatBot only in CLIENT mode */}
      {isClientMode && <ChatBot />}
    </div>
  );
}