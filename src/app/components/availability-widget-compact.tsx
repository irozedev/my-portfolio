import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Clock, MapPin, X, CheckCircle2, XCircle, Zap, Calendar } from "lucide-react";
import { availabilityConfig, getCurrentAvailability, dayTranslations } from "../config/availability";
import { useLanguage } from "../contexts/language-context";

export function AvailabilityWidgetCompact({ inline = false }: { inline?: boolean }) {
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
      return currentStatus.limited ? 'shadow-[0_0_30px_rgba(245,158,11,0.6)]' : 'shadow-[0_0_30px_rgba(34,197,94,0.6)]';
    }
    return 'shadow-[0_0_20px_rgba(107,114,128,0.4)]';
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
      <div className="flex items-center gap-2">
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
      {/* 🔥 COMPACT STATUS BADGE */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-3 py-2 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-lg hover:border-[var(--accent-primary)]/60 transition-all group overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative flex items-center gap-2">
          {/* Animated Status Dot */}
          <div className="relative">
            <div className={`w-2.5 h-2.5 ${getStatusColor()} rounded-full ${getGlowColor()}`} />
            <div className={`absolute inset-0 ${getStatusColor()} rounded-full animate-ping opacity-75`} />
          </div>
          
          {/* Status Text */}
          <div className="flex flex-col items-start">
            <span className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wide">
              {getStatusText()}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              {availabilityConfig.timezone}
            </span>
          </div>
        </div>

        {/* Hover Icon */}
        <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>

      {/* 🔥 FUTURISTIC MODAL */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[99999]"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-[420px] bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/40 rounded-2xl shadow-[0_20px_60px_rgba(0,217,255,0.4)] z-[100000] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ambient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 via-transparent to-purple-500/10 pointer-events-none" />

              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="h-full w-full" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--accent-primary) 2px, var(--accent-primary) 4px)'
                }} />
              </div>

              {/* Header */}
              <div className="relative flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Zap className="w-5 h-5 text-[var(--accent-primary)]" />
                    <div className="absolute inset-0 blur-md bg-[var(--accent-primary)]/30" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wide">
                      {t('availability.schedule')}
                    </h3>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono">
                      Real-time availability
                    </p>
                  </div>
                </div>
                <motion.button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-[var(--text-muted)] group-hover:text-red-400 transition-colors" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="relative max-h-[65vh] overflow-y-auto p-4 space-y-3">
                {/* Current Status Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative p-4 bg-gradient-to-br from-[var(--accent-primary)]/15 to-purple-500/10 border border-[var(--accent-primary)]/30 rounded-xl overflow-hidden"
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--accent-primary)]" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--accent-primary)]" />

                  <div className="flex items-start gap-3">
                    <div className="relative mt-1">
                      <div className={`w-4 h-4 ${getStatusColor()} rounded-full ${getGlowColor()}`} />
                      <div className={`absolute inset-0 ${getStatusColor()} rounded-full animate-ping opacity-75`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-mono font-bold text-[var(--text-primary)] mb-2">
                        {currentStatus.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
                        <MapPin className="w-3 h-3 text-[var(--accent-primary)]" />
                        <span>{availabilityConfig.timezone}</span>
                        <span className="text-[var(--accent-primary)]">•</span>
                        <span>{new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!currentStatus.available && currentStatus.nextAvailable && (
                    <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                      <p className="text-xs text-[var(--text-muted)] font-mono">
                        Next available: <span className="text-[var(--accent-primary)] font-bold">{currentStatus.nextAvailable}</span>
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Special Notice */}
                {availabilityConfig.specialNotice && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl"
                  >
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-amber-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-mono font-bold text-amber-400 mb-1">
                          Until {availabilityConfig.specialNotice.until}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] font-mono">
                          {availabilityConfig.specialNotice.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Weekly Schedule - Compact Grid */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <h4 className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    {t('availability.regularHours')}
                  </h4>
                  
                  <div className="space-y-1">
                    {availabilityConfig.regularHours.map((day, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + index * 0.03 }}
                        className={`relative flex items-center justify-between p-2.5 rounded-lg text-xs font-mono transition-all overflow-hidden group ${
                          day.available
                            ? 'bg-green-500/10 border border-green-500/30 hover:border-green-500/50'
                            : 'bg-[var(--bg-tertiary)]/20 border border-[var(--glass-border)] hover:border-[var(--glass-border)]'
                        }`}
                      >
                        {/* Hover effect */}
                        {day.available && (
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-[var(--accent-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                        
                        <div className="relative flex items-center gap-2">
                          {day.available ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                          )}
                          <span className={`font-bold ${day.available ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                            {getDayTranslation(day.day)}
                          </span>
                        </div>
                        <span className={`relative font-bold ${day.available ? 'text-green-400' : 'text-[var(--text-muted)]'}`}>
                          {day.hours === 'Off' ? t('availability.off') : day.hours}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="relative border-t border-[var(--glass-border)] p-3 bg-[var(--bg-secondary)]/30">
                <p className="text-[10px] text-center text-[var(--text-muted)] font-mono">
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
