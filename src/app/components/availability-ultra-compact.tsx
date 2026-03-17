import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Clock, MapPin, X, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { availabilityConfig, getCurrentAvailability, dayTranslations } from "../config/availability";
import { useLanguage } from "../contexts/language-context";

export function AvailabilityUltraCompact({ inline = false }: { inline?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(getCurrentAvailability());
  const { t, language } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus(getCurrentAvailability());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (currentStatus.available) {
      return currentStatus.limited ? 'bg-amber-500' : 'bg-green-500';
    }
    return 'bg-gray-500';
  };

  const getGlowColor = () => {
    if (currentStatus.available) {
      return currentStatus.limited 
        ? 'shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
        : 'shadow-[0_0_20px_rgba(34,197,94,0.5)]';
    }
    return 'shadow-[0_0_15px_rgba(107,114,128,0.3)]';
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

  // Inline mode
  if (inline) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <div className={`w-2 h-2 ${getStatusColor()} rounded-full ${getGlowColor()}`} />
          <div className={`absolute w-2 h-2 ${getStatusColor()} rounded-full animate-ping opacity-75`} />
        </div>
        <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
          {getStatusText()}
        </span>
      </div>
    );
  }

  return (
    <>
      {/* 🔥 ULTRA COMPACT BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-lg hover:border-[var(--accent-primary)]/60 transition-all group"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="relative">
          <div className={`w-2 h-2 ${getStatusColor()} rounded-full ${getGlowColor()}`} />
          <div className={`absolute inset-0 ${getStatusColor()} rounded-full animate-ping opacity-75`} />
        </div>
        <span className="text-[11px] font-mono font-bold text-[var(--text-primary)] uppercase">
          {getStatusText()}
        </span>
      </motion.button>

      {/* 🔥 ULTRA COMPACT POPUP - 280px width */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99999]"
              onClick={() => setIsOpen(false)}
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/40 rounded-xl shadow-[0_20px_50px_rgba(0,217,255,0.3)] z-[100000] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ambient gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 via-transparent to-purple-500/5 pointer-events-none" />

              {/* Header - Ultra compact */}
              <div className="relative flex items-center justify-between px-3 py-2 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span className="text-[11px] font-mono font-bold text-[var(--text-primary)] uppercase tracking-wide">
                    {t('availability.schedule')}
                  </span>
                </div>
                <motion.button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-red-400" />
                </motion.button>
              </div>

              {/* Content - Max compact */}
              <div className="relative p-3 space-y-2.5">
                {/* Status Card */}
                <div className="relative p-2.5 bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/5 border border-[var(--accent-primary)]/30 rounded-lg">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--accent-primary)]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--accent-primary)]" />

                  <div className="flex items-start gap-2">
                    <div className="relative mt-0.5">
                      <div className={`w-2.5 h-2.5 ${getStatusColor()} rounded-full ${getGlowColor()}`} />
                      <div className={`absolute inset-0 ${getStatusColor()} rounded-full animate-ping opacity-75`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-mono font-bold text-[var(--text-primary)] leading-tight mb-1">
                        {currentStatus.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] text-[var(--text-muted)] font-mono">
                        <MapPin className="w-2.5 h-2.5 text-[var(--accent-primary)] flex-shrink-0" />
                        <span className="truncate">{availabilityConfig.timezone}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!currentStatus.available && currentStatus.nextAvailable && (
                    <div className="mt-2 pt-2 border-t border-[var(--glass-border)]">
                      <p className="text-[9px] text-[var(--text-muted)] font-mono">
                        Next: <span className="text-[var(--accent-primary)] font-bold">{currentStatus.nextAvailable}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Special Notice - compact */}
                {availabilityConfig.specialNotice && (
                  <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-start gap-1.5">
                      <Calendar className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-mono font-bold text-amber-400 mb-0.5">
                          Until {availabilityConfig.specialNotice.until}
                        </p>
                        <p className="text-[9px] text-[var(--text-secondary)] font-mono leading-tight">
                          {availabilityConfig.specialNotice.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weekly Schedule - Ultra compact */}
                <div className="space-y-1">
                  <h4 className="text-[9px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    {t('availability.regularHours')}
                  </h4>
                  
                  {availabilityConfig.regularHours.map((day, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between px-2 py-1.5 rounded text-[10px] font-mono transition-all ${
                        day.available
                          ? 'bg-green-500/10 border border-green-500/20 hover:border-green-500/40'
                          : 'bg-[var(--bg-tertiary)]/20 border border-[var(--glass-border)]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {day.available ? (
                          <CheckCircle2 className="w-2.5 h-2.5 text-green-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-2.5 h-2.5 text-[var(--text-muted)] flex-shrink-0" />
                        )}
                        <span className={`font-bold ${day.available ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                          {getDayTranslation(day.day).substring(0, 3)}
                        </span>
                      </div>
                      <span className={`font-bold tabular-nums ${day.available ? 'text-green-400' : 'text-[var(--text-muted)]'}`}>
                        {day.hours === 'Off' ? t('availability.off') : day.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer - minimal */}
              <div className="relative border-t border-[var(--glass-border)] px-3 py-2 bg-[var(--bg-secondary)]/30">
                <p className="text-[9px] text-center text-[var(--text-muted)] font-mono leading-tight">
                  {t('availability.footer')}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}