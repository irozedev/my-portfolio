import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, CheckCircle, Zap, Award } from "lucide-react";
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
  const { language } = useLanguage();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

  const translations = {
    title: {
      en: "My Availability",
      uk: "Моя Доступність",
      nl: "Mijn Beschikbaarheid",
      ar: "التوفر الخاص بي",
      es: "Mi Disponibilidad",
    },
    subtitle: {
      en: "Belgium Time (CET/CEST)",
      uk: "Час Бельгії (CET/CEST)",
      nl: "België Tijd (CET/CEST)",
      ar: "توقيت بلجيكا",
      es: "Hora de Bélgica",
    },
    workingHours: {
      en: "Working Hours",
      uk: "Робочі Години",
      nl: "Werkuren",
      ar: "ساعات العمل",
      es: "Horario",
    },
    hours: {
      en: "6:00 AM - 12:00 PM",
      uk: "6:00 - 12:00",
      nl: "6:00 - 12:00",
      ar: "6:00 صباحًا - 12:00 ظهرًا",
      es: "6:00 - 12:00",
    },
    bookCallButton: {
      en: "Book a Call",
      uk: "Забронювати Дзвінок",
      nl: "Boek een Gesprek",
      ar: "احجز مكالمة",
      es: "Reservar Llamada",
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
    available: {
      en: "Available",
      uk: "Доступний",
      nl: "Beschikbaar",
      ar: "متاح",
      es: "Disponible",
    },
    note: {
      en: "💡 Need another time? Use the Book a Call button to schedule a custom meeting!",
      uk: "💡 Потрібен інший час? Використайте кнопку щоб забронювати зручну зустріч!",
      nl: "💡 Andere tijd nodig? Gebruik de knop om een aangepast gesprek te plannen!",
      ar: "💡 تحتاج وقتًا آخر؟ استخدم الزر لجدولة اجتماع مخصص!",
      es: "💡 ¿Necesitas otro horario? ¡Usa el botón para programar una reunión personalizada!",
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
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Container */}
            <motion.div
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] rounded-3xl border-2 border-[var(--accent-primary)]/30 shadow-[0_0_80px_rgba(0,217,255,0.3)]"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0, 217, 255, 0.5) rgba(0, 0, 0, 0.2)'
              }}
            >
              {/* Animated Background Orbs */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <motion.div
                  className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary)]/20 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                  animate={{
                    scale: [1.3, 1, 1.3],
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
              </div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--bg-secondary)]/90 hover:bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all shadow-lg backdrop-blur-sm"
                aria-label="Close"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Content */}
              <div className="relative px-8 py-10 md:px-12 md:py-14">
                
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-10"
                >
                  {/* Icon */}
                  <motion.div
                    className="inline-flex items-center justify-center mb-6"
                    animate={{
                      boxShadow: [
                        "0 0 30px rgba(0, 217, 255, 0.4)",
                        "0 0 60px rgba(0, 217, 255, 0.6)",
                        "0 0 30px rgba(0, 217, 255, 0.4)",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="p-5 bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 rounded-2xl">
                      <Calendar className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>
                  
                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 font-mono">
                    {getTranslation("title")}
                  </h1>
                  
                  {/* Subtitle */}
                  <p className="text-sm text-[var(--text-muted)] mb-6">
                    {getTranslation("subtitle")}
                  </p>

                  {/* Working Hours Banner */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex flex-col items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--accent-primary)]/10 via-purple-500/10 to-[var(--accent-primary)]/10 border-2 border-[var(--accent-primary)]/30 rounded-2xl backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[var(--accent-primary)]" />
                      <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                        {getTranslation("workingHours")}
                      </span>
                    </div>
                    <span className="text-2xl font-black text-[var(--accent-primary)] font-mono" dir="ltr">
                      {getTranslation("hours")}
                    </span>
                  </motion.div>
                </motion.div>

                {/* Schedule Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
                >
                  {scheduleData.map((item, index) => (
                    <motion.div
                      key={item.day}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{ scale: 1.03, y: -3 }}
                      className="relative group"
                    >
                      <div className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all backdrop-blur-sm ${
                        item.available
                          ? "bg-green-500/10 border-green-500/40 hover:border-green-400/60 hover:bg-green-500/15"
                          : "bg-orange-500/10 border-orange-500/40 hover:border-orange-400/60 hover:bg-orange-500/15"
                      }`}>
                        <div className="flex items-center gap-3">
                          {item.available ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <Clock className="w-6 h-6 text-orange-400" />
                          )}
                          <span className="text-base font-bold text-[var(--text-primary)] font-mono">
                            {getDay(item.day)}
                          </span>
                        </div>
                        <span 
                          className={`text-sm font-black font-mono ${
                            item.available ? "text-green-400" : "text-orange-400"
                          }`}
                          dir="ltr"
                        >
                          {item.hours}
                        </span>
                      </div>
                      
                      {/* Glow on hover */}
                      <div className={`absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity ${
                        item.available ? "bg-green-500/20" : "bg-orange-500/20"
                      }`} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Book a Call Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8"
                >
                  <motion.button
                    onClick={() => {
                      onClose();
                      onBookCall?.();
                      setIsBookCallOpen(true);
                    }}
                    className="relative w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-[var(--accent-primary)] via-cyan-400 to-[var(--accent-primary)] text-black font-black text-lg rounded-2xl transition-all overflow-hidden group font-mono uppercase tracking-wider"
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Animated Shine */}
                    <motion.div
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
                      }}
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 0.5
                      }}
                    />
                    
                    <Zap className="w-6 h-6" />
                    {getTranslation("bookCallButton")}
                    <Award className="w-6 h-6" />
                  </motion.button>

                  {/* Shadow */}
                  <motion.div
                    className="absolute inset-0 bg-[var(--accent-primary)] blur-2xl opacity-40 -z-10"
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                      scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Note */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="p-5 bg-gradient-to-r from-[var(--accent-primary)]/10 via-purple-500/10 to-pink-500/10 border border-[var(--accent-primary)]/20 rounded-2xl backdrop-blur-sm"
                >
                  <p className="text-sm text-center text-[var(--text-secondary)] leading-relaxed">
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
