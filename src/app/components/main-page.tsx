import { HeroUltraModern } from "./hero-ultra-modern";
import { ServicesCreativeSlider } from "./services-creative-slider";
import { AboutSection } from "./about-section";
import { ExperienceTimelinePremium } from "./experience-timeline-premium";
import { PortfolioCreativeSlider } from "./portfolio-creative-slider";
import { ContactSection } from "./contact-section";
import { Footer } from "./footer";
import { CookieBanner } from "./cookie-banner";
import { AIAssistantSimple } from "./ai-assistant-simple";
import { CartButton } from "./cart-button";
import { SEOHead } from "./seo-head";
import { PersonalCabinet } from "./personal-cabinet";
import { Navigation } from "./navigation";
import { BetaBanner } from "./beta-banner";
import { SiteTour } from "./site-tour";
import { useState } from "react";

export function MainPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Scroll to projects section
  const handleViewWork = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden">
      <SEOHead />
      
      {/* Navigation */}
      <Navigation onOpenProfile={() => setIsProfileOpen(true)} />

      {/* Hero Section - ULTRA MODERN BENTO GRID */}
      <HeroUltraModern onViewWork={handleViewWork} />
      
      {/* Spacing between sections */}
      <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
      
      <AboutSection />
      
      <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
      
      <ExperienceTimelinePremium />
      
      <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
      
      <PortfolioCreativeSlider />
      
      <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
      
      <ServicesCreativeSlider />
      
      <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
      
      <ContactSection />
      
      <Footer />
      
      <CookieBanner />
      
      <AIAssistantSimple />
      
      <CartButton />
      
      <PersonalCabinet isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      <BetaBanner />
      
      <SiteTour />
    </div>
  );
}