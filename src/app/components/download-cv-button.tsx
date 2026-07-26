import { motion } from "motion/react";
import { Download } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

const labels = {
  en: "Download CV",
  uk: "Завантажити CV",
  nl: "CV Downloaden",
  ar: "تحميل السيرة الذاتية",
  es: "Descargar CV",
};

// The real, up-to-date résumé lives as a static file in /public.
const CV_URL = "/Stepan_Roze_CV.pdf";

export function DownloadCVButton() {
  const { language } = useLanguage();
  const label = labels[language as keyof typeof labels] || labels.en;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = CV_URL;
    link.download = "Stepan_Roze_CV.pdf";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.button aria-label="Download CV"
      onClick={handleDownload}
      className="relative px-6 py-3 rounded-xl font-bold text-sm transition-all overflow-hidden group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      />

      <span className="relative z-10 flex items-center gap-2 text-white">
        <Download className="w-5 h-5" />
        {label}
      </span>
    </motion.button>
  );
}
