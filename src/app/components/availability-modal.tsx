import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Calendar, Globe, Sparkles, ArrowRight } from "lucide-react";
import { useAvailability } from "../contexts/availability-context";

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookCall?: () => void;
}

export function AvailabilityModal({ isOpen, onClose, onBookCall }: AvailabilityModalProps) {
  const { isAvailable, statusText, statusEmoji, nextAvailable } = useAvailability();

  // Get current time in CET
  const now = new Date();
  const cetTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Brussels" }));
  const currentTime = cetTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Brussels",
  });

  const workingHours = [
    { day: "Monday", hours: "06:00 - 12:00 CET", isToday: cetTime.getDay() === 1 },
    { day: "Tuesday", hours: "06:00 - 12:00 CET", isToday: cetTime.getDay() === 2 },
    { day: "Wednesday", hours: "06:00 - 12:00 CET", isToday: cetTime.getDay() === 3 },
    { day: "Thursday", hours: "06:00 - 12:00 CET", isToday: cetTime.getDay() === 4 },
    { day: "Friday", hours: "06:00 - 12:00 CET", isToday: cetTime.getDay() === 5 },
    { day: "Saturday", hours: "06:00 - 12:00 CET", isToday: cetTime.getDay() === 6 },
    { day: "Sunday", hours: "06:00 - 12:00 CET", isToday: cetTime.getDay() === 0 },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100000] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto pt-20 sm:pt-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg my-8"
          >
            {/* Glow Effects */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${
              isAvailable 
                ? "from-green-500 via-[#00d9ff] to-green-500" 
                : "from-orange-500 via-purple-500 to-pink-500"
            } rounded-3xl blur-2xl opacity-20 animate-pulse`} />
            
            {/* Modal Content */}
            <div className="relative bg-[var(--bg-primary)] border-2 border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden">
              {/* Animated Background Orbs */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className={`absolute -top-20 -right-20 w-40 h-40 ${
                    isAvailable ? "bg-green-500/10" : "bg-orange-500/10"
                  } rounded-full blur-3xl`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                />
                <motion.div
                  className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                  }}
                />
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] rounded-full transition-colors group"
              >
                <X className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" />
              </button>

              {/* Header with Status */}
              <div className="relative p-8 pb-6">
                <div className="flex items-center gap-4 mb-6">
                  {/* Status Indicator */}
                  <div className="relative">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                        isAvailable
                          ? "bg-gradient-to-br from-green-500/20 to-[#00d9ff]/20"
                          : "bg-gradient-to-br from-orange-500/20 to-purple-500/20"
                      }`}
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      {statusEmoji}
                    </motion.div>
                    {/* Pulsing Dot */}
                    <div className="absolute -top-1 -right-1">
                      <div className={`w-4 h-4 ${
                        isAvailable ? "bg-green-500" : "bg-orange-500"
                      } rounded-full animate-pulse`} />
                      <div className={`absolute inset-0 w-4 h-4 ${
                        isAvailable ? "bg-green-500" : "bg-orange-500"
                      } rounded-full animate-ping`} />
                    </div>
                  </div>

                  {/* Status Text */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                      {statusText}
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm">
                      {isAvailable ? (
                        <>Ready to collaborate on your project!</>
                      ) : (
                        <>Taking a break, but I'll be back soon!</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Current Time in CET */}
                <div className="flex items-center gap-3 p-4 bg-[var(--bg-secondary)]/50 rounded-xl border border-[var(--border-color)]">
                  <Globe className="w-5 h-5 text-[#00d9ff]" />
                  <div className="flex-1">
                    <p className="text-xs text-[var(--text-muted)] mb-0.5">Current Time (CET/Brussels)</p>
                    <p className="text-lg font-bold text-[var(--text-primary)]">{currentTime}</p>
                  </div>
                </div>
              </div>

              {/* Next Available */}
              {!isAvailable && (
                <div className="relative px-8 pb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-xl border border-orange-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-xs text-[var(--text-muted)] mb-0.5">Next Available</p>
                        <p className="text-base font-semibold text-orange-400">{nextAvailable}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Working Hours */}
              <div className="relative px-8 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-[var(--text-primary)]" />
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    Regular Working Hours
                  </h3>
                </div>

                <div className="space-y-2">
                  {workingHours.map((schedule, index) => (
                    <motion.div
                      key={schedule.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        schedule.isToday
                          ? "bg-[#00d9ff]/10 border border-[#00d9ff]/30"
                          : "bg-[var(--bg-secondary)]/30 border border-transparent hover:border-[var(--border-color)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {schedule.isToday && (
                          <Sparkles className="w-4 h-4 text-[#00d9ff]" />
                        )}
                        <span className={`text-sm font-medium ${
                          schedule.isToday
                            ? "text-[#00d9ff]"
                            : "text-[var(--text-secondary)]"
                        }`}>
                          {schedule.day}
                        </span>
                      </div>
                      <span className={`text-sm ${
                        schedule.isToday
                          ? "text-[#00d9ff] font-semibold"
                          : "text-[var(--text-muted)]"
                      }`}>
                        {schedule.hours}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Timezone Note */}
              <div className="relative px-8 pb-6">
                <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                  <p className="text-xs text-[var(--text-muted)] text-center">
                    🌍 Based in Belgium (CET/CEST timezone) • Europe
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="relative p-8 pt-0">
                <motion.button
                  onClick={() => {
                    onBookCall?.();
                    onClose();
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-bold rounded-xl shadow-lg shadow-[#00d9ff]/30 hover:shadow-[#00d9ff]/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule a Call
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <p className="text-xs text-[var(--text-muted)] text-center mt-3">
                  {isAvailable ? (
                    <>✨ I'm available now! Let's chat about your project</>
                  ) : (
                    <>📅 Book a time that works for both of us</>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}