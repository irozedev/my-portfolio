import { motion } from "motion/react";
import { Briefcase, FileText } from "lucide-react";
import { useViewMode } from "../contexts/view-mode-context";
import { useLanguage } from "../contexts/language-context";

/**
 * Client / CV switch, rendered inline inside the header.
 *
 * It used to be three fixed-position variants — a vertical bar pinned to the
 * middle of the right edge on desktop, a floating box on tablet and a pill
 * stuck to the bottom centre on mobile. All three sat on top of the content:
 * the desktop bar covered the About text, the mobile pill covered the timeline
 * cards and collided with the scroll-to-top button in the same corner.
 *
 * A mode switch is navigation, so it belongs with the other navigation. Living
 * in the header also means it scrolls and hides with everything else instead of
 * following the reader down the page.
 */

const translations = {
  en: { client: "For Clients", cv: "For Companies", clientShort: "Client", cvShort: "Company" },
  nl: { client: "Voor Klanten", cv: "Voor Bedrijven", clientShort: "Klant", cvShort: "Bedrijf" },
  ar: { client: "للعملاء", cv: "للشركات", clientShort: "عميل", cvShort: "شركة" },
  es: { client: "Para Clientes", cv: "Para Empresas", clientShort: "Cliente", cvShort: "Empresa" },
};

type Props = {
  /** Extra classes from the header, e.g. to hide it at a given breakpoint. */
  className?: string;
  /** `full` shows the labels; `compact` is icon-only for narrow headers. */
  size?: "full" | "compact";
  /** Unique per instance — two mounts sharing a layoutId fight over the pill. */
  layoutGroup?: string;
};

export function ViewModeToggle({ className = "", size = "full", layoutGroup = "header" }: Props) {
  const { setViewMode, isClientMode } = useViewMode();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  // Labels stay visible: this is the site's primary control, and two unlabelled
  // icons do not tell anyone what they switch. The header room it needs was
  // taken from the sign-in button instead, which is icon-only below 2xl.
  const base =
    size === "compact"
      ? "relative flex items-center justify-center w-9 h-9 rounded-full z-10 transition-colors"
      : "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold z-10 transition-colors";

  return (
    <div
      className={`inline-flex items-center gap-0.5 p-0.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 ${className}`}
      role="group"
      aria-label="View mode"
    >
      <button
        type="button"
        onClick={() => setViewMode("client")}
        title={t.client}
        aria-pressed={isClientMode}
        className={`${base} ${isClientMode ? "text-black" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
      >
        {isClientMode && (
          <motion.div
            layoutId={`view-mode-pill-${layoutGroup}`}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00d9ff] to-cyan-400"
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          />
        )}
        <Briefcase className={size === "compact" ? "w-4 h-4 relative z-10" : "w-3.5 h-3.5 relative z-10"} />
        {size === "full" && <span className="relative z-10">{t.clientShort}</span>}
      </button>

      <button
        type="button"
        onClick={() => setViewMode("cv")}
        title={t.cv}
        aria-pressed={!isClientMode}
        className={`${base} ${!isClientMode ? "text-black" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
      >
        {!isClientMode && (
          <motion.div
            layoutId={`view-mode-pill-${layoutGroup}`}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          />
        )}
        <FileText className={size === "compact" ? "w-4 h-4 relative z-10" : "w-3.5 h-3.5 relative z-10"} />
        {size === "full" && <span className="relative z-10">{t.cvShort}</span>}
      </button>
    </div>
  );
}
