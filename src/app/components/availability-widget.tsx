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
      {/* ULTRA COMPACT BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-md hover:border-[var(--accent-primary)]/50 transition-all font-mono text-xs"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative">
          <div className={`w-1.5 h-1.5 ${getStatusColor()} rounded-full`} />
          <div className={`absolute w-1.5 h-1.5 ${getStatusColor()} rounded-full animate-ping opacity-75`} />
        </div>
        <span className="font-bold text-[var(--text-primary)]">{getStatusText()}</span>
      </motion.button>

      {/* ULTRA COMPACT MODAL */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99999]"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-[360px] bg-[var(--bg-primary)] border border-[var(--accent-primary)]/40 rounded-xl shadow-[0_20px_50px_rgba(0,217,255,0.3)] z-[100000]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)] font-mono">
                    {t('availability.schedule')}
                  </h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-[var(--glass-bg)] rounded transition-colors">
                  <X className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
                {/* Status */}
                <div className="p-3 bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/5 border border-[var(--accent-primary)]/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="relative mt-0.5">
                      <div className={`w-3 h-3 ${getStatusColor()} rounded-full`} />
                      <div className={`absolute inset-0 ${getStatusColor()} rounded-full animate-ping opacity-75`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[var(--text-primary)] font-mono mb-1">
                        {currentStatus.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                        <MapPin className="w-3 h-3 text-[var(--accent-primary)]" />
                        <span>{availabilityConfig.timezone}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!currentStatus.available && currentStatus.nextAvailable && (
                    <div className="mt-2 pt-2 border-t border-[var(--glass-border)]">
                      <p className="text-xs text-[var(--text-muted)]">
                        Next: <span className="text-[var(--accent-primary)] font-bold">{currentStatus.nextAvailable}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Special Notice */}
                {availabilityConfig.specialNotice && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">⏰</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-amber-400 mb-0.5">
                          Until {availabilityConfig.specialNotice.until}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {availabilityConfig.specialNotice.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weekly Schedule */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">
                    {t('availability.regularHours')}
                  </h4>
                  
                  {availabilityConfig.regularHours.map((day, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-mono transition-colors ${
                        day.available
                          ? 'bg-green-500/10 border border-green-500/20 hover:border-green-500/30'
                          : 'bg-[var(--bg-tertiary)]/30 border border-[var(--glass-border)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {day.available ? (
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        ) : (
                          <XCircle className="w-3 h-3 text-[var(--text-muted)]" />
                        )}
                        <span className={day.available ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'}>
                          {getDayTranslation(day.day)}
                        </span>
                      </div>
                      <span className={`font-bold ${day.available ? 'text-green-400' : 'text-[var(--text-muted)]'}`}>
                        {day.hours === 'Off' ? t('availability.off') : day.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[var(--glass-border)] p-3">
                <p className="text-xs text-center text-[var(--text-muted)]">{t('availability.footer')}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}