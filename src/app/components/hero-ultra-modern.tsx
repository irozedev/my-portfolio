import { useLanguage } from "../contexts/language-context";
import { useAvailability } from "../contexts/availability-context";
import { useViewMode } from "../contexts/view-mode-context";
import { useState } from "react";
import { BookCallModal } from "./book-call-fixed";
import { DownloadCVButton } from "./download-cv-button";
import { getFormattedStats } from "../../utils/stats-calculator";
import { StatsAirport } from "./stats-airport";
import { Github, Linkedin, Briefcase, Mail, Rocket, Code2 } from "lucide-react";

interface HeroUltraModernProps {
  onViewWork: () => void;
}

const socialLinks = [
  { icon: Github, href: "https://github.com/irozedev", label: "GitHub", color: "#00d9ff" },
  { icon: Linkedin, href: "https://linkedin.com/in/rozestepan", label: "LinkedIn", color: "#0077b5" },
  { icon: Briefcase, href: "https://www.upwork.com/freelancers/rozestepan", label: "Upwork", color: "#6fda44" },
  { icon: Mail, href: "mailto:hello@roze.live", label: "Email", color: "#00d9ff" },
];

const techStack = [
  { name: "React", icon: "⚛️" },
  { name: "TypeScript", icon: "📘" },
  { name: "Node.js", icon: "🟢" },
  { name: "Next.js", icon: "▲" },
  { name: "Python", icon: "🐍" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Docker", icon: "🐳" },
  { name: "AWS", icon: "☁️" },
  { name: "GraphQL", icon: "◆" },
  { name: "Tailwind", icon: "🎨" },
];

export function HeroUltraModern({ onViewWork }: HeroUltraModernProps) {
  const { t, language } = useLanguage();
  const { statusText, statusEmoji } = useAvailability();
  const { viewMode } = useViewMode();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

  return (
    <>
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-40 md:pt-44 pb-12 scroll-mt-40 md:scroll-mt-44">
        {/* Lightweight Background Grid — pure CSS */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00d9ff08_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />
        
        {/* Static gradient orbs — no JS animation, GPU-friendly */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[var(--accent-primary)] rounded-full mix-blend-multiply filter blur-[128px] opacity-15" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-15" />

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/80 border border-[var(--accent-primary)]/30 rounded-full mb-6">
              <span className="text-lg">{statusEmoji}</span>
              <span className="text-sm font-mono text-[var(--text-secondary)]">{statusText}</span>
            </div>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-[var(--accent-primary)] via-cyan-300 to-[var(--accent-primary)] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                STEPAN ROZE
              </span>
            </h1>

            {/* Role */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-secondary)] mb-4">
              {t('hero.role')}
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mx-auto px-4">
              {t('hero.description')}
            </p>
          </div>

          {/* Tech Stack Marquee - FIXED */}
          <div className="relative overflow-hidden py-6 mb-10 bg-[var(--bg-secondary)]/30 rounded-xl border border-[var(--border-color)]">
            <div className={`flex gap-4 ${language === 'ar' ? 'animate-marquee-rtl' : 'animate-marquee'} will-change-transform`}>
              {/* Triple repetition for seamless loop */}
              {[...Array(3)].map((_, setIndex) => (
                techStack.map((tech, i) => (
                  <div
                    key={`tech-${setIndex}-${i}`}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg whitespace-nowrap flex-shrink-0"
                  >
                    <span className="text-xl">{tech.icon}</span>
                    <span className="text-sm font-mono text-[var(--text-primary)]">{tech.name}</span>
                  </div>
                ))
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-12 px-2 sm:px-0">
            {/* Show Book Call button ONLY in CLIENT MODE */}
            {viewMode === 'client' && (
              <button
                onClick={() => setIsBookCallOpen(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black font-bold rounded-lg overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Rocket className="w-5 h-5" />
                  {t('hero.bookCall')}
                </span>
              </button>
            )}

            <button
              onClick={onViewWork}
              className="px-8 py-4 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold rounded-lg border-2 border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)] transition-all active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <Code2 className="w-5 h-5" />
                {t('hero.viewWork')}
              </span>
            </button>

            {/* Show Download CV button ONLY in CV MODE */}
            {viewMode === 'cv' && <DownloadCVButton />}
          </div>

          {/* Stats */}
          <StatsAirport />

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg hover:border-[var(--accent-primary)] transition-all hover:scale-110"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5 text-[var(--accent-primary)]" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      {isBookCallOpen && (
        <BookCallModal isOpen={isBookCallOpen} onClose={() => setIsBookCallOpen(false)} />
      )}
    </>
  );
}