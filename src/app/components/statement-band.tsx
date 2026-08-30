import { useLanguage } from "../contexts/language-context";
import { VIEWPORT, DURATION, EASE } from "../lib/motion";
import { motion } from "motion/react";

/**
 * One held sentence, edge to edge, with nothing else on the screen.
 *
 * The client page ran seven screens of cards on two tones. Somewhere in the
 * middle the reader needs a place where nothing happens — a change of ground,
 * a change of rhythm, and one thing to read. That is all this is.
 *
 * The claim is not new copy: "1–2 projects at a time / your project isn't in a
 * queue" already sits in the availability list in how-i-work.tsx. It is only
 * being said louder, where it does some work.
 */
export function StatementBand() {
  const { language } = useLanguage();

  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  return (
    <section
      className="relative overflow-hidden bg-[var(--bg-band-deep)] py-20 md:py-28 px-4 sm:px-6 md:px-8"
      /* --bg-band-deep is only defined for client mode; the CV never renders
         this section, but the fallback keeps it from painting transparent if
         it ever does. */
      style={{ backgroundColor: "var(--bg-band-deep, var(--bg-secondary))" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(700px_340px_at_50%_0%,var(--glow-primary),transparent)]"
      />

      <motion.div
        className="relative container mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: DURATION, ease: EASE }}
      >
        <p className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.08] tracking-[-0.03em] text-[var(--text-primary)]">
          {L("One or two projects at a time.", "Eén of twee projecten tegelijk.", "مشروع أو مشروعان في الوقت نفسه.", "Uno o dos proyectos a la vez.")}
          <br />
          <span className="text-[var(--accent-primary)]">
            {L("Yours is not in a queue.", "Het jouwe staat niet in de rij.", "مشروعك ليس في طابور.", "El tuyo no hace cola.")}
          </span>
        </p>

        <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[var(--text-muted)] mt-8">
          {L(
            "mornings, CET · replies within the day · fixed price before we start",
            "ochtenden, CET · reactie binnen de dag · vaste prijs vooraf",
            "الصباح بتوقيت CET · رد خلال اليوم · سعر ثابت قبل البدء",
            "mañanas, CET · respuesta el mismo día · precio fijo antes de empezar",
          )}
        </p>
      </motion.div>
    </section>
  );
}
