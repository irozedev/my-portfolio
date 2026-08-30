import { motion } from "motion/react";
import { Download } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

const labels = {
  en: "Download CV",
  nl: "CV Downloaden",
  ar: "تحميل السيرة الذاتية",
  es: "Descargar CV",
};

// Opens the CV page rather than downloading a static file.
//
// It used to pull `/Stepan_Roze_CV.pdf` straight out of /public, a document
// maintained by hand that had drifted from the site: wrong E-Consulting end
// date, no Albron entry. The page at #cv is generated from `data/experience.ts`
// — the same module the timeline renders — and offers "Save as PDF" through the
// browser's own print dialog, so there is no second copy of the facts to keep
// in sync and no PDF library in the bundle.
export function DownloadCVButton() {
  const { language } = useLanguage();
  const label = labels[language as keyof typeof labels] || labels.en;

  const handleOpen = () => {
    window.location.hash = "cv";
  };

  return (
    <motion.button aria-label="Download CV"
      onClick={handleOpen}
      className="relative px-6 py-3 rounded-xl font-bold text-sm transition-all overflow-hidden group bg-[var(--accent-primary)] text-black hover:brightness-110 shadow-[var(--shadow-accent)]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      />

      <span className="relative z-10 flex items-center gap-2 text-black">
        <Download className="w-5 h-5" />
        {label}
      </span>
    </motion.button>
  );
}
