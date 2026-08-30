import { Suspense, lazy } from "react";
import { CookieBanner } from "./cookie-banner";
import { SEOHead } from "./seo-head";
import { Navigation } from "./navigation";
import { HeroUltraModern } from "./hero-ultra-modern";
import { useViewMode } from "../contexts/view-mode-context";
import { useLanguage } from "../contexts/language-context";

/**
 * Everything below the first screen is split out.
 *
 * Not for the sake of fewer bytes overall - the same code still downloads.
 * It is about what has to arrive BEFORE the hero can paint. 26 components
 * import `motion` (42 kB gzipped), and while they were all statically imported
 * here, that chunk sat in the initial graph even though the header, the hero
 * and the stat row do not use it. Those three were moved off the library
 * first; splitting the rest is what actually takes it off the critical path.
 *
 * `lazy` still starts fetching as soon as these render, so nothing is delayed
 * by a scroll listener - the request simply stops blocking first paint.
 */
const AboutSection = lazy(() => import("./about-section").then(m => ({ default: m.AboutSection })));
const ContactSection = lazy(() => import("./contact-section").then(m => ({ default: m.ContactSection })));
const ExperienceTimelinePremium = lazy(() => import("./experience-timeline-premium").then(m => ({ default: m.ExperienceTimelinePremium })));
const Footer = lazy(() => import("./footer").then(m => ({ default: m.Footer })));
const GitHubShowcase = lazy(() => import("./github-showcase").then(m => ({ default: m.GitHubShowcase })));
const HowIWork = lazy(() => import("./how-i-work").then(m => ({ default: m.HowIWork })));
const PortfolioCreativeSlider = lazy(() => import("./portfolio-creative-slider").then(m => ({ default: m.PortfolioCreativeSlider })));
const PricingTable = lazy(() => import("./pricing-table").then(m => ({ default: m.PricingTable })));
const ServicesCreativeSlider = lazy(() => import("./services-creative-slider").then(m => ({ default: m.ServicesCreativeSlider })));
const StatementBand = lazy(() => import("./statement-band").then(m => ({ default: m.StatementBand })));
/* The floating widgets carry the whole chat assistant - 869 lines and the
   last eager importer of `motion`. The scroll-to-top button only appears
   once the reader has scrolled anyway. */
const ScrollToTopButton = lazy(() => import("./scroll-to-top-button").then(m => ({ default: m.ScrollToTopButton })));
const TrackRecord = lazy(() => import("./track-record").then(m => ({ default: m.TrackRecord })));

/* One boundary per mode rather than per section: a Suspense fallback swaps the
   whole subtree, and eleven separate spinners popping in at different moments
   is worse than the page arriving a beat later in one piece. The reserved
   height keeps the scrollbar from jumping while it resolves. */
const BelowFold = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="min-h-screen" aria-hidden />}>{children}</Suspense>
);

export function MainPage() {
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
      <Navigation />

      {/* CLIENT MODE: Hero → Services → Projects → Why me → Contact */}
      {isClientMode && (
        <>
          {/* Hero Section - ULTRA MODERN BENTO GRID */}
          <HeroUltraModern onViewWork={handleViewWork} />

          <BelowFold>
          
          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
          
          {/* Services FIRST for clients */}
          <ServicesCreativeSlider />

          {/* Prices with lead times. Straight after the services, because the
              question a card leaves you with is "how long and what is in it". */}
          <PricingTable />

          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />

          {/* How I work — process + honest timelines */}
          <HowIWork />

          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />

          {/* Projects */}
          <PortfolioCreativeSlider />

          {/* Who else trusted him. The employment history lives in the CV
              timeline, which client mode never renders, so the client page had
              nowhere to say it. */}
          <TrackRecord />

          {/* A place where nothing happens. Cards for seven screens on two
              tones is what made this page read as one long stripe. No spacer
              around it on purpose — the band runs edge to edge and brings its
              own air. Client only: the CV was left out of the redesign. */}
          <StatementBand />

          {/* GitHub Showcase */}
          <GitHubShowcase />
          
          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
          
          {/* Why me / About */}
          <AboutSection />
          
          <div className="h-4 sm:h-6 md:h-8 lg:h-10" />
          
          {/* Contact */}
          <ContactSection />
          </BelowFold>
        </>
      )}

      {/* CV MODE: Hero → Experience → Skills → Projects → Contact */}
      {isCVMode && (
        <>
          {/* Hero Section - simplified */}
          <HeroUltraModern onViewWork={handleViewWork} />

          <BelowFold>
          
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
          </BelowFold>
        </>
      )}
      
      <BelowFold>
        <Footer />
      </BelowFold>
      
      <CookieBanner />

      {/* PersonalCabinet removed along with the rest of the account surface —
          favourites, saved projects and profile settings for a visitor who has
          no reason to have an account here. */}

      {/* SiteTour is gone, file and all. Its launcher was a fixed button in the
          bottom-left corner sitting on top of the About cards, a guided tour is
          the wrong affordance for a page a recruiter reads in a minute, and
          once unmounted it rotted: its first step pointed at the maintenance
          banner, which no longer exists. */}

      {/* Unified Scroll-to-Top + ChatBot */}
      <Suspense fallback={null}>
        <ScrollToTopButton />
      </Suspense>

      {/* ViewModeToggle is NOT rendered here. App.tsx mounts it once for every
          route, including the legal pages; mounting it here as well put two
          identical fixed panels at the same coordinates — invisible as a double
          image, but the second one still ate clicks and doubled the listeners. */}
    </main>
  );
}