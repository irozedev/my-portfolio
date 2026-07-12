import { useLanguage } from "../contexts/language-context";
import { useAvailability } from "../contexts/availability-context";
import { useViewMode } from "../contexts/view-mode-context";
import { useState } from "react";
import { BookCallModal } from "./book-call-fixed";
import { DownloadCVButton } from "./download-cv-button";
import { StatsAirport } from "./stats-airport";
import { Github, Linkedin, Briefcase, Mail, Rocket, Code2, ArrowRight } from "lucide-react";

interface HeroUltraModernProps {
  onViewWork: () => void;
}

const socialLinks = [
  { icon: Github, href: "https://github.com/irozedev", label: "GitHub", color: "#00d9ff" },
  { icon: Linkedin, href: "https://linkedin.com/in/rozestepan", label: "LinkedIn", color: "#0077b5" },
  { icon: Briefcase, href: "https://www.upwork.com/freelancers/rozestepan", label: "Upwork", color: "#6fda44" },
  { icon: Mail, href: "mailto:rozedev095@gmail.com", label: "Email", color: "#00d9ff" },
];

// Emoji-free tech list — rendered as monospace pills
const techStack = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue.js",
  "Node.js", "Knockout.js", "Magento", "Tailwind", "Git",
];

export function HeroUltraModern({ onViewWork }: HeroUltraModernProps) {
  const { t, language } = useLanguage();
  const { statusText, isAvailable } = useAvailability();
  const { viewMode } = useViewMode();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

  const isClient = viewMode === "client";

  // Localized terminal values for company/CV mode
  const term = {
    whoami: language === "uk" ? "хто я" : language === "nl" ? "wie ben ik" : language === "ar" ? "من أنا" : language === "es" ? "quién soy" : "whoami",
    roleLabel: language === "uk" ? "роль" : language === "nl" ? "rol" : language === "ar" ? "الدور" : language === "es" ? "rol" : "role",
    expLabel: language === "uk" ? "досвід" : language === "nl" ? "ervaring" : language === "ar" ? "الخبرة" : language === "es" ? "experiencia" : "experience",
    locLabel: language === "uk" ? "локація" : language === "nl" ? "locatie" : language === "ar" ? "الموقع" : language === "es" ? "ubicación" : "location",
    expValue: language === "uk" ? "8+ років · e-commerce та enterprise" : language === "nl" ? "8+ jaar · e-commerce & enterprise" : language === "ar" ? "+8 سنوات · التجارة الإلكترونية والمؤسسات" : language === "es" ? "8+ años · e-commerce y enterprise" : "8+ years · e-commerce & enterprise",
    locValue: language === "uk" ? "Ломмель, Бельгія · відкритий до роботи" : language === "nl" ? "Lommel, België · open voor werk" : language === "ar" ? "لوميل، بلجيكا · منفتح للعمل" : language === "es" ? "Lommel, Bélgica · abierto a trabajar" : "Lommel, Belgium · open to work",
  };

  const viewWorkLabel = t("hero.viewWork");
  const roleTitle =
    language === "uk" ? "Front-End / JavaScript розробник" :
    language === "nl" ? "Front-End / JavaScript Developer" :
    language === "ar" ? "مطور Front-End / JavaScript" :
    language === "es" ? "Desarrollador Front-End / JavaScript" :
    "Front-End / JavaScript Developer";

  // Tiny localization helper
  const L = (en: string, uk: string, nl: string, ar: string, es: string) =>
    language === "uk" ? uk : language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  // Outcome/proof tiles for the client (agency) hero
  const clientProof = [
    { value: "8+", label: L("years of experience", "років досвіду", "jaar ervaring", "سنوات خبرة", "años de experiencia") },
    { value: "E-com", label: L("e-commerce & enterprise", "e-commerce та enterprise", "e-commerce & enterprise", "تجارة إلكترونية ومؤسسات", "e-commerce y enterprise") },
    { value: "Next 14", label: L("latest launch · 2026", "останній запуск · 2026", "laatste launch · 2026", "أحدث إطلاق · 2026", "último lanzamiento · 2026") },
    { value: "AI", label: L("assisted workflow · since 2022", "робочий процес · з 2022", "workflow · sinds 2022", "سير عمل · منذ 2022", "flujo · desde 2022") },
  ];

  // Availability pill — shared, emoji-free
  const availabilityBadge = (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-secondary)]/80 border border-[var(--border-color)] rounded-full">
      <span className="relative flex h-2.5 w-2.5">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${isAvailable ? "bg-green-500" : "bg-orange-500"}`} />
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isAvailable ? "bg-green-500" : "bg-orange-500"}`} />
      </span>
      <span className="text-xs font-mono text-[var(--text-secondary)]">{statusText}</span>
    </span>
  );

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-36 md:pt-44 pb-12 scroll-mt-40 md:scroll-mt-44"
      >
        {/* Lightweight Background Grid — pure CSS */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00d9ff08_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />

        {/* Static gradient orbs — no JS animation, GPU-friendly */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[var(--accent-primary)] rounded-full mix-blend-multiply filter blur-[128px] opacity-15" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-15" />

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* ============ CLIENT MODE — split / agency ============ */}
          {isClient ? (
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-10 sm:mb-12">
              {/* Left: message + CTAs */}
              <div className="text-center lg:text-left">
                {/* Availability + role kicker */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-5">
                  {availabilityBadge}
                  <span className="text-xs sm:text-sm font-mono tracking-wider text-[var(--accent-primary)] uppercase">
                    Stepan Roze — {roleTitle}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-[var(--text-primary)] mb-5">
                  {t("hero.role")}
                </h1>

                <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 mb-8">
                  {t("hero.description")}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
                  <button
                    onClick={() => setIsBookCallOpen(true)}
                    className="group relative px-8 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black font-bold rounded-xl overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] active:scale-95"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Rocket className="w-5 h-5" />
                      {t("hero.bookCall")}
                    </span>
                  </button>
                  <button
                    onClick={onViewWork}
                    className="group px-8 py-4 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold rounded-xl border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all active:scale-95"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {viewWorkLabel}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Right: outcome bento */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {clientProof.map((p) => (
                  <div
                    key={p.label}
                    className="bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-5 sm:p-6 hover:border-[var(--accent-primary)]/50 transition-colors"
                  >
                    <div className="text-2xl sm:text-3xl font-black text-[var(--accent-primary)] mb-1.5">{p.value}</div>
                    <div className="text-xs sm:text-sm text-[var(--text-secondary)] leading-snug">{p.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ============ COMPANY / CV MODE — terminal ============ */
            <div className="mb-10 sm:mb-12">
              <div className="flex justify-center mb-6">{availabilityBadge}</div>
              <div className="max-w-2xl mx-auto bg-[var(--bg-secondary)]/70 backdrop-blur-md border border-[var(--border-color)] rounded-xl overflow-hidden shadow-2xl">
                {/* Terminal title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/40">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs font-mono text-[var(--text-muted)]">stepan@roze: ~</span>
                </div>

                {/* Terminal body */}
                <div className="p-5 sm:p-7 font-mono text-sm sm:text-base text-left space-y-2.5">
                  <p className="text-[var(--text-muted)]">
                    <span className="text-[var(--accent-primary)]">$</span> {term.whoami}
                  </p>
                  <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-[var(--accent-primary)] via-cyan-300 to-[var(--accent-primary)] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    Stepan Roze
                  </h1>
                  <p className="text-[var(--text-muted)] pt-2">
                    <span className="text-[var(--accent-primary)]">$</span> {term.roleLabel}
                  </p>
                  <p className="text-[var(--text-primary)] font-semibold">{roleTitle}</p>
                  <p className="text-[var(--text-muted)] pt-2">
                    <span className="text-[var(--accent-primary)]">$</span> {term.expLabel}
                  </p>
                  <p className="text-[var(--text-secondary)]">{term.expValue}</p>
                  <p className="text-[var(--text-muted)] pt-2">
                    <span className="text-[var(--accent-primary)]">$</span> {term.locLabel}
                  </p>
                  <p className="text-[var(--text-secondary)]">{term.locValue}</p>
                  <p className="text-[var(--text-primary)] pt-2 flex items-center">
                    <span className="text-[var(--accent-primary)]">$</span>
                    <span className="ml-2 w-2.5 h-5 bg-[var(--accent-primary)] animate-blink" />
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-8 px-2 sm:px-0">
                <button
                  onClick={onViewWork}
                  className="group px-8 py-4 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold rounded-xl border-2 border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)] transition-all active:scale-95"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Code2 className="w-5 h-5" />
                    {viewWorkLabel}
                  </span>
                </button>
                <DownloadCVButton />
              </div>
            </div>
          )}

          {/* Tech Stack Marquee — emoji-free monospace pills */}
          <div className="relative overflow-hidden py-5 mb-10 bg-[var(--bg-secondary)]/30 rounded-xl border border-[var(--border-color)] [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
            <div className={`flex gap-3 ${language === "ar" ? "animate-marquee-rtl" : "animate-marquee"} will-change-transform`}>
              {[...Array(3)].map((_, setIndex) =>
                techStack.map((tech, i) => (
                  <div
                    key={`tech-${setIndex}-${i}`}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg whitespace-nowrap flex-shrink-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                    <span className="text-sm font-mono text-[var(--text-primary)]">{tech}</span>
                  </div>
                ))
              )}
            </div>
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
