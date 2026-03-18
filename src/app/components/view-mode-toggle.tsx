import { motion } from "motion/react";
import { Briefcase, FileText } from "lucide-react";
import { useViewMode } from "../contexts/view-mode-context";
import { useLanguage } from "../contexts/language-context";
import { useState } from "react";

const translations = {
  en: {
    client: "For Clients",
    cv: "For Companies",
    clientShort: "Client",
    cvShort: "CV",
  },
  uk: {
    client: "Для Клієнтів",
    cv: "Для Компаній",
    clientShort: "Клієнт",
    cvShort: "CV",
  },
  nl: {
    client: "Voor Klanten",
    cv: "Voor Bedrijven",
    clientShort: "Klant",
    cvShort: "CV",
  },
  ar: {
    client: "للعملاء",
    cv: "للشركات",
    clientShort: "عميل",
    cvShort: "سيرة",
  },
  es: {
    client: "Para Clientes",
    cv: "Para Empresas",
    clientShort: "Cliente",
    cvShort: "CV",
  },
};

export function ViewModeToggle() {
  const { viewMode, setViewMode, isClientMode } = useViewMode();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* DESKTOP: Vertical Sidebar (right side) */}
      <motion.div 
        className="hidden lg:flex fixed top-1/2 -translate-y-1/2 right-6 z-[9995] flex-col gap-3"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="relative flex flex-col gap-3 p-3 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-2 border-[var(--border-color)] rounded-2xl shadow-[0_0_40px_rgba(0,217,255,0.2)]">
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#00d9ff]/10 via-purple-500/10 to-pink-500/10 opacity-50"
            animate={{
              backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "100% 200%" }}
          />

          {/* CLIENT MODE */}
          <motion.button
            onClick={() => setViewMode('client')}
            className={`relative w-14 h-14 rounded-xl font-bold transition-all flex items-center justify-center z-10 group ${
              isClientMode
                ? 'text-black'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            whileHover={{ scale: 1.12, x: -5 }}
            whileTap={{ scale: 0.88 }}
            title={t.client}
          >
            {isClientMode && (
              <motion.div
                layoutId="active-mode-desktop"
                className="absolute inset-0 bg-gradient-to-br from-[#00d9ff] to-cyan-400 rounded-xl shadow-[0_0_25px_rgba(0,217,255,0.7)]"
                transition={{ type: "spring", bounce: 0.25, duration: 0.7 }}
              />
            )}
            <Briefcase className="w-6 h-6 relative z-10" strokeWidth={2.5} />
            {isClientMode && (
              <motion.div
                className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white shadow-lg"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>

          {/* Separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mx-2" />

          {/* CV MODE */}
          <motion.button
            onClick={() => setViewMode('cv')}
            className={`relative w-14 h-14 rounded-xl font-bold transition-all flex items-center justify-center z-10 group ${
              !isClientMode
                ? 'text-black'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            whileHover={{ scale: 1.12, x: -5 }}
            whileTap={{ scale: 0.88 }}
            title={t.cv}
          >
            {!isClientMode && (
              <motion.div
                layoutId="active-mode-desktop"
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.7)]"
                transition={{ type: "spring", bounce: 0.25, duration: 0.7 }}
              />
            )}
            <FileText className="w-6 h-6 relative z-10" strokeWidth={2.5} />
            {!isClientMode && (
              <motion.div
                className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-purple-400 rounded-full border-2 border-white shadow-lg"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>

          {/* Expand tooltip on hover */}
          <motion.div
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[var(--bg-primary)] border-2 border-[var(--border-color)] rounded-lg px-4 py-2 shadow-lg pointer-events-none"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-xs font-mono text-[var(--text-secondary)] mb-1">VIEW MODE</div>
            <div className={`text-sm font-bold ${isClientMode ? 'text-[#00d9ff]' : 'text-purple-400'}`}>
              {isClientMode ? t.client : t.cv}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* TABLET: Top-right corner compact */}
      <motion.div 
        className="hidden md:flex lg:hidden fixed top-[calc(64px+72px+16px)] right-6 z-[9995] gap-2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex gap-2 p-2 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-2 border-[var(--border-color)] rounded-xl shadow-[0_0_30px_rgba(0,217,255,0.2)]">
          {/* CLIENT */}
          <motion.button
            onClick={() => setViewMode('client')}
            className={`relative px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 z-10 ${
              isClientMode ? 'text-black' : 'text-[var(--text-secondary)]'
            }`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            {isClientMode && (
              <motion.div
                layoutId="active-mode-tablet"
                className="absolute inset-0 bg-gradient-to-r from-[#00d9ff] to-cyan-400 rounded-lg shadow-[0_0_20px_rgba(0,217,255,0.6)]"
                transition={{ type: "spring", bounce: 0.25, duration: 0.7 }}
              />
            )}
            <Briefcase className="w-4 h-4 relative z-10" />
            <span className="relative z-10 font-black">{t.clientShort}</span>
          </motion.button>

          {/* CV */}
          <motion.button
            onClick={() => setViewMode('cv')}
            className={`relative px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 z-10 ${
              !isClientMode ? 'text-black' : 'text-[var(--text-secondary)]'
            }`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            {!isClientMode && (
              <motion.div
                layoutId="active-mode-tablet"
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                transition={{ type: "spring", bounce: 0.25, duration: 0.7 }}
              />
            )}
            <FileText className="w-4 h-4 relative z-10" />
            <span className="relative z-10 font-black">{t.cvShort}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* MOBILE: Bottom center (above scroll-to-top) */}
      <motion.div 
        className="flex md:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-[9995] gap-2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex gap-2 p-2 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-2 border-[var(--border-color)] rounded-full shadow-[0_0_30px_rgba(0,217,255,0.3)]">
          {/* CLIENT */}
          <motion.button
            onClick={() => setViewMode('client')}
            className={`relative px-5 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 z-10 ${
              isClientMode ? 'text-black' : 'text-[var(--text-secondary)]'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {isClientMode && (
              <motion.div
                layoutId="active-mode-mobile"
                className="absolute inset-0 bg-gradient-to-r from-[#00d9ff] to-cyan-400 rounded-full shadow-[0_0_20px_rgba(0,217,255,0.6)]"
                transition={{ type: "spring", bounce: 0.25, duration: 0.7 }}
              />
            )}
            <Briefcase className="w-5 h-5 relative z-10" strokeWidth={2.5} />
            <span className="relative z-10 font-black tracking-tight">{t.clientShort}</span>
          </motion.button>

          {/* CV */}
          <motion.button
            onClick={() => setViewMode('cv')}
            className={`relative px-5 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 z-10 ${
              !isClientMode ? 'text-black' : 'text-[var(--text-secondary)]'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {!isClientMode && (
              <motion.div
                layoutId="active-mode-mobile"
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                transition={{ type: "spring", bounce: 0.25, duration: 0.7 }}
              />
            )}
            <FileText className="w-5 h-5 relative z-10" strokeWidth={2.5} />
            <span className="relative z-10 font-black tracking-tight">{t.cvShort}</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}