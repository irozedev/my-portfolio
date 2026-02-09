import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, CheckCircle, Phone } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useState } from "react";
import { BookCallModal } from "./book-call-fixed";

interface AvailabilityScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookCall?: () => void;
}

const scheduleData = [
  { day: "Monday", hours: "6:00 - 12:00", available: true },
  { day: "Tuesday", hours: "6:00 - 12:00", available: true },
  { day: "Wednesday", hours: "6:00 - 12:00", available: true },
  { day: "Thursday", hours: "6:00 - 12:00", available: true },
  { day: "Friday", hours: "6:00 - 12:00", available: true },
  { day: "Saturday", hours: "6:00 - 12:00", available: true },
  { day: "Sunday", hours: "6:00 - 12:00", available: true },
];

export function AvailabilityScheduleModal({ isOpen, onClose, onBookCall }: AvailabilityScheduleModalProps) {
  const { language, t } = useLanguage();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

  const translations = {
    title: {
      en: "My Availability",
      uk: "Моя Доступність",
      nl: "Mijn Beschikbaarheid",
      ar: "التوفر الخاص بي",
      es: "Mi Disponibilidad",
    },
    workingHours: {
      en: "Working Hours: 6:00 AM - 12:00 PM",
      uk: "Робочі Години: 6:00 - 12:00",
      nl: "Werkuren: 6:00 - 12:00",
      ar: "ساعات العمل: 6:00 صباحًا - 12:00 ظهرًا",
      es: "Horario: 6:00 - 12:00",
    },
    subtitle: {
      en: "Belgium Time (CET/CEST)",
      uk: "Час Бельгії (CET/CEST)",
      nl: "België Tijd (CET/CEST)",
      ar: "توقيت بلجيكا",
      es: "Hora de Bélgica",
    },
    bookCallButton: {
      en: "📞 Book a Call",
      uk: "📞 Забронювати Дзвінок",
      nl: "📞 Boek een Gesprek",
      ar: "📞 احجز مكالمة",
      es: "📞 Reservar Llamada",
    },
    days: {
      Monday: { en: "Monday", uk: "Понеділок", nl: "Maandag", ar: "الاثنين", es: "Lunes" },
      Tuesday: { en: "Tuesday", uk: "Вівторок", nl: "Dinsdag", ar: "الثلاثاء", es: "Martes" },
      Wednesday: { en: "Wednesday", uk: "Середа", nl: "Woensdag", ar: "الأربعاء", es: "Miércoles" },
      Thursday: { en: "Thursday", uk: "Четвер", nl: "Donderdag", ar: "الخميس", es: "Jueves" },
      Friday: { en: "Friday", uk: "П'ятниця", nl: "Vrijdag", ar: "الجمعة", es: "Viernes" },
      Saturday: { en: "Saturday", uk: "Субота", nl: "Zaterdag", ar: "السبت", es: "Sábado" },
      Sunday: { en: "Sunday", uk: "Неділя", nl: "Zondag", ar: "الأحد", es: "Domingo" },
    },
    busyMode: {
      en: "Busy / Focus Mode",
      uk: "Зайнятий / Фокус Режим",
      nl: "Druk / Focusmodus",
      ar: "مشغول / وضع التركيز",
      es: "Ocupado / Modo Enfoque",
    },
    note: {
      en: "💡 Need another time? Use the Book a Call button!",
      uk: "💡 Потрібен інший час? Використайте кнопку Book a Call!",
      nl: "💡 Andere tijd nodig? Gebruik de Book a Call knop!",
      ar: "💡 تحتاج وقتًا آخر؟ استخدم زر حجز المكالمة!",
      es: "💡 ¿Necesitas otro horario? ¡Usa el botón Book a Call!",
    },
  };

  const getTranslation = (key: keyof typeof translations) => {
    return translations[key][language as keyof typeof translations[typeof key]] || translations[key].en;
  };

  const getDay = (day: string) => {
    return translations.days[day as keyof typeof translations.days][language as keyof typeof translations.days[typeof day]] || day;
  };

  if (!isOpen) return null;

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Container - Compact on Desktop */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)]"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 via-purple-500/10 to-pink-500/10 pointer-events-none rounded-3xl" />
            
            {/* Animated Orbs - Contained */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--accent-primary)]/20 rounded-full blur-3xl pointer-events-none"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 30, 0],
                y: [0, 20, 0],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -30, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 12, repeat: Infinity }}
            />

            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 md:p-3 bg-[var(--bg-secondary)]/80 hover:bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)] rounded-full text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all shadow-lg"
              aria-label="Close"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>

            {/* Content */}
            <div className="relative px-5 md:px-8 py-6 md:py-8">
              
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-5 md:mb-6"
              >
                <div className="inline-flex items-center justify-center gap-2 mb-2">
                  <motion.div
                    className="p-2 bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 rounded-xl"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(0, 217, 255, 0.3)",
                        "0 0 40px rgba(0, 217, 255, 0.5)",
                        "0 0 20px rgba(0, 217, 255, 0.3)",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </motion.div>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {getTranslation("title")}
                </h1>
                
                {/* Working Hours Banner */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/50 rounded-lg mb-1.5"
                >
                  <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span className="text-xs md:text-sm font-bold text-[var(--accent-primary)]" dir="ltr">
                    {getTranslation("workingHours")}
                  </span>
                </motion.div>
                
                <p className="text-xs text-[var(--text-muted)]">
                  {getTranslation("subtitle")}
                </p>
              </motion.div>

              {/* Schedule Grid - Compact 2 columns on desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-2 gap-2 mb-5 md:mb-6"
              >
                {scheduleData.map((item, index) => (
                  <motion.div
                    key={item.day}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.03 }}
                    className={`flex items-center justify-between p-2.5 md:p-3 rounded-lg border transition-all hover:scale-[1.02] ${
                      item.available
                        ? "bg-green-500/10 border-green-500/40 hover:border-green-500/60"
                        : "bg-orange-500/10 border-orange-500/40 hover:border-orange-500/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.available ? (
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                      )}
                      <span className="text-xs md:text-sm font-bold text-[var(--text-primary)]">
                        {getDay(item.day)}
                      </span>
                    </div>
                    <span 
                      className={`text-xs font-bold ${
                        item.available ? "text-green-400" : "text-orange-400"
                      }`}
                      dir="ltr"
                    >
                      {item.available ? item.hours : getTranslation("busyMode")}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Book a Call Button - NO PHONE ICON */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-3 md:mb-4"
              >
                <motion.button
                  onClick={() => {
                    onClose();
                    onBookCall?.();
                    setIsBookCallOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 hover:from-[var(--accent-primary)]/90 hover:to-cyan-300 text-black font-black text-sm md:text-base rounded-xl transition-all shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.5)] relative overflow-hidden group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)"
                    }}
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  />
                  
                  {getTranslation("bookCallButton")}
                </motion.button>
              </motion.div>

              {/* Note */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-2.5 md:p-3 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-lg"
              >
                <p className="text-xs text-center text-[var(--text-secondary)]">
                  {getTranslation("note")}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    
    {/* Book Call Modal with Date/Time Selection */}
    <BookCallModal isOpen={isBookCallOpen} onClose={() => setIsBookCallOpen(false)} />
    </>
  );
}