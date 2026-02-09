import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Calendar, CheckCircle, Phone } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100000] bg-[var(--bg-primary)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ paddingTop: '80px' }} // Space for header on all devices
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
          
          {/* Animated Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity }}
          />

          {/* Close Button - Fixed top right */}
          <motion.button
            onClick={onClose}
            className="fixed top-24 right-4 md:right-8 z-10 p-3 bg-[var(--bg-secondary)]/80 hover:bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)] rounded-full text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all shadow-lg"
            aria-label="Close"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Content - Scrollable */}
          <div className="h-full overflow-y-auto">
            <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
              
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 md:mb-12"
              >
                <div className="inline-flex items-center justify-center gap-3 mb-4">
                  <motion.div
                    className="p-4 bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 rounded-2xl"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(0, 217, 255, 0.3)",
                        "0 0 40px rgba(0, 217, 255, 0.5)",
                        "0 0 20px rgba(0, 217, 255, 0.3)",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Calendar className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </motion.div>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  {getTranslation("title")}
                </h1>
                
                {/* Working Hours Banner */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--accent-primary)]/20 border-2 border-[var(--accent-primary)]/50 rounded-2xl mb-3"
                >
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent-primary)]" />
                  <span className="text-base md:text-lg font-bold text-[var(--accent-primary)]" dir="ltr">
                    {getTranslation("workingHours")}
                  </span>
                </motion.div>
                
                <p className="text-sm md:text-base text-[var(--text-muted)]">
                  {getTranslation("subtitle")}
                </p>
              </motion.div>

              {/* Schedule Grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid gap-3 md:gap-4 mb-8 md:mb-12 max-w-2xl mx-auto"
              >
                {scheduleData.map((item, index) => (
                  <motion.div
                    key={item.day}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                      item.available
                        ? "bg-green-500/10 border-green-500/40 hover:border-green-500/60"
                        : "bg-orange-500/10 border-orange-500/40 hover:border-orange-500/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      {item.available ? (
                        <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-green-400" />
                      ) : (
                        <Clock className="w-6 h-6 md:w-7 md:h-7 text-orange-400" />
                      )}
                      <span className="text-base md:text-lg font-bold text-[var(--text-primary)]">
                        {getDay(item.day)}
                      </span>
                    </div>
                    <span 
                      className={`text-sm md:text-base font-bold ${
                        item.available ? "text-green-400" : "text-orange-400"
                      }`}
                      dir="ltr"
                    >
                      {item.available ? item.hours : getTranslation("busyMode")}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Book a Call Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-md mx-auto mb-6"
              >
                <motion.button
                  onClick={() => {
                    onClose();
                    onBookCall?.();
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 hover:from-[var(--accent-primary)]/90 hover:to-cyan-300 text-black font-black text-lg rounded-2xl transition-all shadow-[0_0_40px_rgba(0,217,255,0.3)] hover:shadow-[0_0_60px_rgba(0,217,255,0.5)] relative overflow-hidden group"
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
                  
                  <Phone className="w-6 h-6" />
                  {getTranslation("bookCallButton")}
                </motion.button>
              </motion.div>

              {/* Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="max-w-2xl mx-auto p-4 md:p-5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-2xl"
              >
                <p className="text-sm md:text-base text-center text-[var(--text-secondary)]">
                  {getTranslation("note")}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
