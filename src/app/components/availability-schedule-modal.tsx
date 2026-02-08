import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Calendar, CheckCircle, CalendarCheck } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useState } from "react";

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
  const [showBookCall, setShowBookCall] = useState(false);

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
    bookButton: {
      en: "📅 Book a Time Slot",
      uk: "📅 Забронювати Час",
      nl: "📅 Boek een Tijdslot",
      ar: "📅 احجز وقتًا",
      es: "📅 Reservar Hora",
    },
    days: {
      Monday: { en: "Mon", uk: "Пн", nl: "Ma", ar: "الاثنين", es: "Lun" },
      Tuesday: { en: "Tue", uk: "Вт", nl: "Di", ar: "الثلاثاء", es: "Mar" },
      Wednesday: { en: "Wed", uk: "Ср", nl: "Wo", ar: "الأربعاء", es: "Mié" },
      Thursday: { en: "Thu", uk: "Чт", nl: "Do", ar: "الخميس", es: "Jue" },
      Friday: { en: "Fri", uk: "Пт", nl: "Vr", ar: "الجمعة", es: "Vie" },
      Saturday: { en: "Sat", uk: "Сб", nl: "Za", ar: "السبت", es: "Sáb" },
      Sunday: { en: "Sun", uk: "Нд", nl: "Zo", ar: "الأحد", es: "Dom" },
    },
    busyMode: {
      en: "Busy / Focus Mode",
      uk: "Зайнятий / Фокус Режим",
      nl: "Druk / Focusmodus",
      ar: "مشغول / وضع التركيز",
      es: "Ocupado / Modo Enfoque",
    },
    note: {
      en: "💡 Need another time? Use the booking button!",
      uk: "💡 Потрібен інший час? Використайте кнопку букінгу!",
      nl: "💡 Andere tijd nodig? Gebruik de boekingsknop!",
      ar: "💡 تحتاج وقتًا آخر؟ استخدم زر الحجز!",
      es: "💡 ¿Necesitas otro horario? ¡Usa el botón de reserva!",
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

          {/* Modal - SMALLER */}
          <motion.div
            className="relative w-full max-w-md bg-[var(--bg-secondary)] border-2 border-[var(--accent-primary)]/30 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]"
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
              className="absolute top-3 right-3 z-10 p-1.5 bg-[var(--bg-primary)]/80 hover:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="relative p-6">
              {/* Header - COMPACT */}
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="w-6 h-6 text-[var(--accent-primary)]" />
                  <h2 className="text-2xl font-black bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 bg-clip-text text-transparent">
                    {t("title")}
                  </h2>
                </div>
                
                {/* Working Hours Banner */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-lg mb-2">
                  <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span className="text-sm font-bold text-[var(--accent-primary)]" dir="ltr">
                    {t("workingHours")}
                  </span>
                </div>
                
                <p className="text-xs text-[var(--text-muted)]">
                  {t("subtitle")}
                </p>
              </div>

              {/* Schedule Grid - COMPACT */}
              <div className="space-y-2 mb-4">
                {scheduleData.map((item, index) => (
                  <motion.div
                    key={item.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                      item.available
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-orange-500/10 border-orange-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.available ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-400" />
                      )}
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        {getDay(item.day)}
                      </span>
                    </div>
                    <span 
                      className={`text-xs font-medium ${
                        item.available ? "text-green-400" : "text-orange-400"
                      }`}
                      dir="ltr"
                    >
                      {item.available ? item.hours : t("busyMode")}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Book Button */}
              <motion.a
                href="https://calendly.com/rozestepan/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-3 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 hover:from-[var(--accent-primary)]/90 hover:to-cyan-300 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CalendarCheck className="w-5 h-5" />
                {t("bookButton")}
              </motion.a>

              {/* Note - COMPACT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-3 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-lg"
              >
                <p className="text-xs text-center text-[var(--text-secondary)]">
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