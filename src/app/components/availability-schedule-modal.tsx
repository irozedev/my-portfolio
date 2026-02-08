import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Calendar, CheckCircle } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

interface AvailabilityScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function AvailabilityScheduleModal({ isOpen, onClose }: AvailabilityScheduleModalProps) {
  const { language } = useLanguage();

  const translations = {
    title: {
      en: "My Availability Schedule",
      uk: "Мій Графік Доступності",
      nl: "Mijn Beschikbaarheidsschema",
      ar: "جدول التوفر الخاص بي",
      es: "Mi Horario de Disponibilidad",
    },
    subtitle: {
      en: "Belgium Time (CET/CEST)",
      uk: "Час Бельгії (CET/CEST)",
      nl: "België Tijd (CET/CEST)",
      ar: "توقيت بلجيكا (CET/CEST)",
      es: "Hora de Bélgica (CET/CEST)",
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
      en: "💡 Outside these hours? Book a call and we'll find a time that works!",
      uk: "💡 Поза цими годинами? Забронюйте дзвінок і ми знайдемо зручний час!",
      nl: "💡 Buiten deze uren? Boek een gesprek en we vinden een passend moment!",
      ar: "💡 خارج هذه الساعات؟ احجز مكالمة وسنجد وقتًا مناسبًا!",
      es: "💡 ¿Fuera de estos horarios? ¡Reserva una llamada y encontraremos un momento!",
    },
  };

  const t = (key: keyof typeof translations) => {
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
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
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

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)]/30 rounded-3xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25 }}
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-[var(--bg-primary)]/80 hover:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="relative p-8 md:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Calendar className="w-8 h-8 text-[var(--accent-primary)]" />
                  <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 bg-clip-text text-transparent">
                    {t("title")}
                  </h2>
                </div>
                <p className="text-sm text-[var(--text-secondary)] flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t("subtitle")}
                </p>
              </div>

              {/* Schedule Grid */}
              <div className="space-y-3 mb-6">
                {scheduleData.map((item, index) => (
                  <motion.div
                    key={item.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      item.available
                        ? "bg-green-500/10 border-green-500/30 hover:border-green-500/50"
                        : "bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.available ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-400" />
                      )}
                      <span className="font-bold text-[var(--text-primary)]">
                        {getDay(item.day)}
                      </span>
                    </div>
                    <span 
                      className={`text-sm font-medium ${
                        item.available ? "text-green-400" : "text-orange-400"
                      }`}
                      dir="ltr"
                    >
                      {item.available ? item.hours : t("busyMode")}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-xl"
              >
                <p className="text-sm text-center text-[var(--text-secondary)]">
                  {t("note")}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}