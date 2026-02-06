import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, MapPin, X } from "lucide-react";
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
      {/* Compact Badge */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-color)] rounded-full hover:border-[var(--accent-primary)]/50 transition-all group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated Status Dot */}
        <div className="relative flex items-center gap-2">
          <div className={`w-2.5 h-2.5 ${getStatusColor()} rounded-full`} />
          <div className={`absolute left-0 w-2.5 h-2.5 ${getStatusColor()} rounded-full animate-ping opacity-75`} />
          <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors ml-2">
            {getStatusText()}
          </span>
        </div>
        
        <Calendar className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
      </motion.button>

      {/* Calendar Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 w-[calc(100vw-2rem)] sm:w-96 max-w-md bg-[var(--bg-secondary)]/95 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-2xl shadow-[var(--accent-primary)]/10 p-4 sm:p-5 z-[100000]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  {t('availability.schedule')}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>

            {/* Current Status */}
            <div className="mb-4 p-3 bg-gradient-to-r from-[var(--accent-primary)]/10 to-purple-500/10 border border-[var(--accent-primary)]/20 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 ${getStatusColor()} rounded-full animate-pulse`} />
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {currentStatus.message}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <MapPin className="w-3 h-3" />
                <span>{availabilityConfig.timezone}</span>
              </div>
            </div>

            {/* Special Notice */}
            {availabilityConfig.specialNotice && (
              <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <span className="text-base">⏰</span>
                  <div>
                    <p className="text-xs font-medium text-amber-400 mb-1">
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
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">
                {t('availability.regularHours')}
              </h4>
              {availabilityConfig.regularHours.map((day, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    day.available
                      ? 'bg-green-500/5 border border-green-500/10'
                      : 'bg-[var(--bg-tertiary)] border border-transparent'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    day.available ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                  }`}>
                    {getDayTranslation(day.day)}
                  </span>
                  <span className={`text-xs ${
                    day.available ? 'text-green-400' : 'text-[var(--text-muted)]'
                  }`}>
                    {day.hours === 'Off' ? t('availability.off') : day.hours}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Note */}
            <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
              <p className="text-xs text-center text-[var(--text-muted)]">
                {t('availability.footer')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}