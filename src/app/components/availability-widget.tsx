import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, MapPin, X, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { availabilityConfig, getCurrentAvailability, dayTranslations } from "../config/availability";
import { useLanguage } from "../contexts/language-context";

export function AvailabilityWidget({ inline = false }: { inline?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(getCurrentAvailability());
  const widgetRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  // Update status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus(getCurrentAvailability());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getStatusColor = () => {
    if (currentStatus.available) {
      return currentStatus.limited ? 'bg-amber-500' : 'bg-green-500';
    }
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (availabilityConfig.status === 'available') return t('availability.available');
    if (availabilityConfig.status === 'limited') return t('availability.limited');
    return t('availability.busy');
  };

  const getDayTranslation = (dayKey: string): string => {
    const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(dayKey);
    if (dayIndex === -1) return dayKey;
    return dayTranslations[language as keyof typeof dayTranslations][dayIndex];
  };

  // Inline mode - just show status text without button
  if (inline) {
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 ${getStatusColor()} rounded-full`} />
        <div className={`absolute w-2 h-2 ${getStatusColor()} rounded-full animate-ping opacity-75`} />
        <span className="text-xs font-medium text-[var(--text-secondary)] ml-2">
          {getStatusText()}
        </span>
      </div>
    );
  }

  return (
    <div ref={widgetRef} className="relative">
      {/* 🔥 PREMIUM BUTTON - GLASSMORPHISM */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-xl hover:border-[var(--accent-primary)]/50 transition-all font-mono text-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,217,255,0.4)] overflow-hidden"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Background Gradient Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Animated Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Animated Status Dot */}
        <div className="relative flex items-center gap-2 z-10">
          <div className={`w-3 h-3 ${getStatusColor()} rounded-full shadow-lg`} />
          <div className={`absolute left-0 w-3 h-3 ${getStatusColor()} rounded-full animate-ping opacity-75`} />
          <span className="font-black text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors ml-3">
            {getStatusText()}
          </span>
        </div>
        
        <Sparkles className="relative z-10 w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:rotate-12 transition-all" />
      </motion.button>

      {/* 🔥 PREMIUM MODAL - CENTERED GLASSMORPHISM */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="availability-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[99999]"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Container */}
            <motion.div
              key="availability-modal"
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-[520px] max-w-xl bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/40 rounded-3xl shadow-[0_20px_80px_rgba(0,217,255,0.5)] z-[100000] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ambient Gradient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/15 via-transparent to-purple-500/15 pointer-events-none" />

              {/* Animated Background Particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/10 blur-3xl"
                  animate={{
                    x: [0, 50, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  style={{
                    left: `${i * 20}%`,
                    top: `${i * 15}%`,
                  }}
                />
              ))}

              {/* 🔥 HEADER - PREMIUM GLASSMORPHISM */}
              <div className="relative border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-2xl">
                <div className="flex items-center justify-between p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    {/* Icon Box with Gradient */}
                    <motion.div
                      className="p-3 bg-gradient-to-br from-[var(--accent-primary)]/20 to-purple-500/20 rounded-xl border border-[var(--accent-primary)]/30 shadow-[0_4px_20px_rgba(0,217,255,0.3)]"
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    >
                      <Clock className="w-6 h-6 text-[var(--accent-primary)]" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] font-mono">
                        {t('availability.schedule')}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 ${getStatusColor()} rounded-full animate-pulse`} />
                        <p className="text-xs text-[var(--text-muted)] font-mono">
                          Live Status
                        </p>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-2.5 hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors group"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-[var(--text-muted)] group-hover:text-red-400 transition-colors" />
                  </motion.button>
                </div>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="relative max-h-[70vh] overflow-y-auto p-5 sm:p-6 scrollbar-thin scrollbar-thumb-[var(--accent-primary)]/30 scrollbar-track-transparent">
                
                {/* 🔥 CURRENT STATUS - HERO CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-5 bg-gradient-to-br from-[var(--accent-primary)]/10 via-transparent to-purple-500/10 border border-[var(--accent-primary)]/30 rounded-2xl shadow-[0_8px_32px_rgba(0,217,255,0.25)]"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="relative mt-1">
                      <div className={`w-4 h-4 ${getStatusColor()} rounded-full shadow-lg`} />
                      <div className={`absolute inset-0 w-4 h-4 ${getStatusColor()} rounded-full animate-ping opacity-75`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-base sm:text-lg font-black text-[var(--text-primary)] mb-2 font-mono">
                        {currentStatus.message}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-mono">
                        <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span>{availabilityConfig.timezone}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Next Available */}
                  {!currentStatus.available && currentStatus.nextAvailable && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-[var(--glass-border)]"
                    >
                      <p className="text-xs text-[var(--text-muted)] font-mono">
                        Next available: <span className="text-[var(--accent-primary)] font-bold">{currentStatus.nextAvailable}</span>
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Special Notice */}
                {availabilityConfig.specialNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl"
                  >
                    <div className="flex items-start gap-3">
                      <motion.span
                        className="text-2xl"
                        animate={{
                          rotate: [0, -10, 10, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        ⏰
                      </motion.span>
                      <div className="flex-1">
                        <p className="text-xs font-black text-amber-400 mb-1 font-mono">
                          Until {availabilityConfig.specialNotice.until}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {availabilityConfig.specialNotice.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 🔥 WEEKLY SCHEDULE - PREMIUM CARDS */}
                <div>
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--glass-border)]" />
                    <h4 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest font-mono">
                      {t('availability.regularHours')}
                    </h4>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--glass-border)]" />
                  </div>
                  
                  {/* Days Grid */}
                  <div className="space-y-2.5">
                    {availabilityConfig.regularHours.map((day, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className={`group relative flex items-center justify-between p-3.5 rounded-xl font-mono text-sm transition-all duration-300 overflow-hidden ${
                          day.available
                            ? 'bg-gradient-to-r from-green-500/15 via-green-500/5 to-transparent border border-green-500/30 hover:border-green-500/50 hover:shadow-[0_4px_20px_rgba(16,185,129,0.2)]'
                            : 'bg-[var(--bg-tertiary)]/50 border border-[var(--glass-border)] hover:border-[var(--glass-border)]'
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        {/* Hover Gradient */}
                        {day.available && (
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                        
                        <div className="relative z-10 flex items-center gap-3">
                          {day.available ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-[var(--text-muted)]" />
                          )}
                          <span className={`font-bold ${
                            day.available ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                          }`}>
                            {getDayTranslation(day.day)}
                          </span>
                        </div>
                        <span className={`relative z-10 font-mono font-bold ${
                          day.available ? 'text-green-400' : 'text-[var(--text-muted)]'
                        }`}>
                          {day.hours === 'Off' ? t('availability.off') : day.hours}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 🔥 FOOTER - GLASSMORPHISM */}
              <div className="relative border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-2xl p-4 sm:p-5">
                <p className="text-xs text-center text-[var(--text-muted)] font-mono leading-relaxed">
                  {t('availability.footer')}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
