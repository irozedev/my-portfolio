import { useLayoutEffect, useRef, useState } from "react";
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
};

export function ViewModeToggle({ className = "", size = "full" }: Props) {
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

  /* The pill used to be two `motion.div`s sharing a layoutId, which is a
     shared-element animation: motion measured both and tweened between them.
     One pill positioned from the active button's own box does the same thing
     with a CSS transition, and it is the last thing keeping the 42 kB motion
     chunk in the header's import graph.

     Measured rather than assumed to be half the track: the two labels differ
     in length in every language, so the buttons are not the same width, and
     hard-coding 50% would have made the pill overhang one of them. */
  const trackRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<HTMLButtonElement>(null);
  const cvRef = useRef<HTMLButtonElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const active = isClientMode ? clientRef.current : cvRef.current;
    if (!active) return;

    const measure = () => setPill({ left: active.offsetLeft, width: active.offsetWidth });
    measure();

    // Labels reflow when the language changes and when a webfont finally
    // arrives; without this the pill keeps the width it was first measured at.
    const ro = new ResizeObserver(measure);
    ro.observe(active);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [isClientMode, size, language]);

  return (
    <div
      ref={trackRef}
      className={`relative inline-flex items-center gap-0.5 p-0.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)]/60 ${className}`}
      role="group"
      aria-label="View mode"
    >
      {pill && (
        <span
          aria-hidden
          className={`absolute top-0.5 bottom-0.5 rounded-full motion-safe:transition-[left,width] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isClientMode
              ? "bg-gradient-to-r from-[#00d9ff] to-cyan-400"
              : "bg-[var(--text-primary)]"
          }`}
          style={{ left: pill.left, width: pill.width }}
        />
      )}

      <button
        ref={clientRef}
        type="button"
        onClick={() => setViewMode("client")}
        title={t.client}
        aria-pressed={isClientMode}
        className={`${base} ${isClientMode ? "text-black" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
      >
        <Briefcase className={size === "compact" ? "w-4 h-4 relative z-10" : "w-3.5 h-3.5 relative z-10"} />
        {size === "full" && <span className="relative z-10">{t.clientShort}</span>}
      </button>

      <button
        ref={cvRef}
        type="button"
        onClick={() => setViewMode("cv")}
        title={t.cv}
        aria-pressed={!isClientMode}
        className={`${base} ${!isClientMode ? "text-[var(--bg-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
      >
        <FileText className={size === "compact" ? "w-4 h-4 relative z-10" : "w-3.5 h-3.5 relative z-10"} />
        {size === "full" && <span className="relative z-10">{t.cvShort}</span>}
      </button>
    </div>
  );
}
