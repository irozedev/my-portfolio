import { useLanguage } from "../contexts/language-context";
import { useAvailability } from "../contexts/availability-context";
import { useViewMode } from "../contexts/view-mode-context";
import { useState } from "react";
import { BookCallModal } from "./book-call-fixed";
import { DownloadCVButton } from "./download-cv-button";
import { StatsAirport } from "./stats-airport";
import { Github, Linkedin, Briefcase, Mail, Rocket, Code2, ArrowRight, Building2, ShieldCheck } from "lucide-react";

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
  "JavaScript", "Dynamics 365", "TypeScript", "React", "Next.js", "Vue.js",
  "Node.js", "Knockout.js", "Magento", "Tailwind", "Git",
];

export function HeroUltraModern({ onViewWork }: HeroUltraModernProps) {
  const { t, language } = useLanguage();
  const { statusText, isAvailable } = useAvailability();
  const { viewMode } = useViewMode();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

  const isClient = viewMode === "client";

  const viewWorkLabel = t("hero.viewWork");
  // "Front-End / JavaScript Developer" described the work accurately and sold
  // nothing: in Flanders that phrase puts the reader in a stack of two hundred
  // React CVs. Dynamics 365 goes in the title because it is the scarce half of
  // the profile — Microsoft partners here hire for exactly "JS + D365" and
  // rarely find it. Front-end stays first, because it is still the longer
  // experience and it is what a direct client is shopping for.
  const roleTitle =
    language === "nl" ? "Front-End & Dynamics 365 Developer" :
    language === "ar" ? "مطور Front-End و Dynamics 365" :
    language === "es" ? "Desarrollador Front-End y Dynamics 365" :
    "Front-End & Dynamics 365 Developer";

  // Tiny localization helper
  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  // Outcome/proof tiles for the client (agency) hero
  const clientProof = [
    { value: "8+", label: L("years of experience", "jaar ervaring", "سنوات خبرة", "años de experiencia") },
    { value: "E-com", label: L("e-commerce & enterprise", "e-commerce & enterprise", "تجارة إلكترونية ومؤسسات", "e-commerce y enterprise") },
    { value: "Next 14", label: L("latest launch · 2026", "laatste launch · 2026", "أحدث إطلاق · 2026", "último lanzamiento · 2026") },
    { value: "AI", label: L("assisted workflow · since 2022", "workflow · sinds 2022", "سير عمل · منذ 2022", "flujo · desde 2022") },
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
        /* Top padding and scroll-margin both shrink by the ticker's old height
           (40px / 48px). They used to clear ticker + header; only the 80px
           header remains. */
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-28 md:pt-32 pb-12 scroll-mt-28 md:scroll-mt-32"
      >
        {isClient ? (
          /* A gradient mesh instead of a grid of lines. The ruled grid read as
             a technical drawing, which is the one thing this hero should not
             look like; three overlapping radial washes give the ground depth
             without a single extra request. No blur filter here on purpose —
             a blurred orb promotes the whole section to its own compositing
             layer, and on a phone that is the most expensive thing in view. */
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(820px_520px_at_12%_-10%,var(--glow-primary),transparent_62%),radial-gradient(680px_620px_at_88%_8%,var(--glow-secondary),transparent_66%)]"
          />
        ) : (
          <>
            {/* Lightweight Background Grid — pure CSS */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00d9ff08_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />

            {/* Static gradient orbs — no JS animation, GPU-friendly */}
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[var(--accent-primary)] rounded-full mix-blend-multiply filter blur-[128px] opacity-15" />
            <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-15" />
          </>
        )}

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* ============ CLIENT MODE — split / agency ============ */}
          {isClient ? (
            /* Deliberately asymmetric: the type column is wider than the card
               column, and the card is tipped and overlapped rather than sitting
               in its own tidy half. Two equal halves of equal weight is what
               made the old hero read as a wireframe. */
            <div className="grid lg:grid-cols-[1fr_minmax(0,380px)] gap-8 lg:gap-10 items-start mb-10 sm:mb-12">
              {/* Left: message + CTAs */}
              <div className="text-center lg:text-left lg:pr-6">
                {/* Availability + role kicker */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6 sm:mb-8">
                  {availabilityBadge}
                  <span className="text-xs sm:text-sm font-mono tracking-wider text-[var(--accent-primary)] uppercase">
                    Stepan Roze — {roleTitle}
                  </span>
                </div>

                {/* The headline is the graphic. Nothing else in the hero is
                    allowed to compete with it, which is why the stat tiles that
                    used to sit opposite are now one quiet card. */}
                <h1 className="font-display text-[2.6rem] leading-[0.92] sm:text-6xl sm:leading-[0.9] lg:text-7xl xl:text-[5.5rem] xl:leading-[0.86] font-black tracking-[-0.04em] uppercase text-[var(--text-primary)] mb-6 sm:mb-7">
                  {t("hero.role")}
                </h1>

                <p className="text-base sm:text-xl leading-relaxed text-[var(--text-secondary)] max-w-[52ch] mx-auto lg:mx-0 mb-8 sm:mb-10">
                  {t("hero.description")}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
                  <button
                    onClick={() => setIsBookCallOpen(true)}
                    className="group relative px-8 py-4 bg-[var(--accent-primary)] text-black font-semibold rounded-full transition-all hover:brightness-110 active:scale-95 shadow-[var(--shadow-accent)]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Rocket className="w-5 h-5" />
                      {t("hero.bookCall")}
                    </span>
                  </button>
                  <button aria-label="View my work"
                    onClick={onViewWork}
                    className="group px-8 py-4 bg-white/[0.03] text-[var(--text-primary)] font-semibold rounded-full border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all active:scale-95"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {viewWorkLabel}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Right: the same four proof points, but as one card that floats
                  over the composition instead of four tiles sitting flat beside
                  it. The tilt and the glow are what give the hero a foreground;
                  both are dropped below lg, where there is no room to overlap
                  anything and a tilted card just looks broken. */}
              <div className="relative mx-auto w-full max-w-sm lg:mt-16 lg:-ml-4 lg:rotate-[-1.6deg]">
                <div
                  aria-hidden
                  className="hidden lg:block absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,var(--glow-primary),transparent)]"
                />
                <div className="relative rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)]/90 p-6 shadow-[var(--shadow-panel)]">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      {L("in short", "kort gezegd", "باختصار", "en resumen")}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--accent-primary)]">2015 &ndash; 2026</span>
                  </div>

                  <div className="grid gap-2.5">
                    {clientProof.map((p) => (
                      <div
                        key={p.label}
                        className="flex items-baseline justify-between gap-4 rounded-2xl bg-white/[0.035] px-4 py-3"
                      >
                        <span className="font-display text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                          {p.value}
                        </span>
                        <span className="text-right text-[13px] leading-snug text-[var(--text-secondary)]">
                          {p.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ============ COMPANY / CV MODE — professional profile ============ */
            <div className="mb-10 sm:mb-12">
              <div className="flex justify-center mb-6">{availabilityBadge}</div>

              {/* Identity */}
              <div className="text-center max-w-3xl mx-auto mb-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3">
                  <span className="bg-gradient-to-r from-[var(--accent-primary)] via-cyan-300 to-[var(--accent-primary)] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    Stepan Roze
                  </span>
                </h1>
                <p className="text-lg sm:text-2xl font-bold text-[var(--text-primary)] mb-4">{roleTitle}</p>
                <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-6">
                  {L(
                    "8+ years of commercial experience building e-commerce and enterprise web applications — from luxury retail platforms to banking systems.",
                    "8+ jaar commerciële ervaring in e-commerce en enterprise webapps — van luxe retail tot banksystemen.",
                    "أكثر من 8 سنوات خبرة تجارية في بناء تطبيقات التجارة الإلكترونية والمؤسسات — من التجزئة الفاخرة إلى الأنظمة المصرفية.",
                    "8+ años de experiencia comercial en e-commerce y enterprise — desde retail de lujo hasta sistemas bancarios."
                  )}
                </p>

                {/* Credential chips */}
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {[
                    L("8+ years", "8+ jaar", "+8 سنوات", "8+ años"),
                    "React · TypeScript · Vue · Next.js",
                    L("E-commerce & enterprise", "E-commerce & enterprise", "تجارة إلكترونية ومؤسسات", "E-commerce y enterprise"),
                    L("Belgium · remote", "België · remote", "بلجيكا · عن بُعد", "Bélgica · remoto"),
                  ].map((c) => (
                    <span key={c} className="px-3.5 py-1.5 bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-full text-xs sm:text-sm font-mono text-[var(--text-secondary)]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career highlights */}
              <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-8">
                {[
                  { icon: Building2, k: L("Luxury retail", "Luxe retail", "تجزئة فاخرة", "Retail de lujo"), v: "childrensalon · vogacloset" },
                  { icon: ShieldCheck, k: L("Banking systems", "Banksystemen", "أنظمة مصرفية", "Sistemas bancarios"), v: "أحد البنوك الوطنية CRM" },
                  { icon: Rocket, k: L("Shipped 2026", "Gelanceerd 2026", "إطلاق 2026", "Lanzado 2026"), v: "Next.js 14 · marinek.store" },
                ].map((h) => {
                  const Icon = h.icon;
                  return (
                    <div key={h.v} className="bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] rounded-2xl p-5 text-left hover:border-[var(--accent-primary)]/50 transition-colors">
                      <Icon className="w-5 h-5 text-[var(--accent-primary)] mb-2" />
                      <div className="text-sm font-bold text-[var(--text-primary)]">{h.k}</div>
                      <div className="text-xs text-[var(--text-muted)] font-mono mt-0.5 truncate">{h.v}</div>
                    </div>
                  );
                })}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0">
                <button aria-label="View my work"
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
