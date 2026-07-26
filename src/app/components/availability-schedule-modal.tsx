import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, CheckCircle, Zap } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useState } from "react";
import { BookCallModal } from "./book-call-fixed";
import { useModalA11y } from "../hooks/use-modal-a11y";

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

  // The `days` entry is a nested record, the rest are flat {en,uk,nl,ar,es}
  // maps. Indexing the union directly gave TS no common signature, so narrow
  // to a plain per-language record at the point of lookup.
  type Localized = Record<string, string>;

  const getTranslation = (key: Exclude<keyof typeof translations, "days">) => {
    const entry = translations[key] as Localized;
    return entry[language] || entry.en;
  };

  const getDay = (day: string) => {
    const days = translations.days as Record<string, Localized>;
    const entry = days[day];
    if (!entry) return day;
    return entry[language] || entry.en || day;
  };

  const dialogRef = useModalA11y({ isOpen, onClose });

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99999]"
              onClick={onClose}
            />

            {/* 🔥 LARGER MODAL - 400px width for better readability */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="availability-modal-title"
              tabIndex={-1}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-[420px] md:w-[480px] lg:w-[540px] xl:w-[600px] bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/40 rounded-xl shadow-[0_20px_50px_rgba(0,217,255,0.3)] z-[100000] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ambient gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 via-transparent to-purple-500/5 pointer-events-none" />

              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="h-full w-full" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--accent-primary) 2px, var(--accent-primary) 4px)'
                }} />
              </div>

              {/* Header - Slightly larger */}
              <div className="relative flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Clock className="w-6 h-6 text-[var(--accent-primary)]" />
                    <div className="absolute inset-0 blur-sm bg-[var(--accent-primary)]/30" />
                  </div>
                  <div>
                    <span
                      id="availability-modal-title"
                      className="text-base font-mono font-bold text-[var(--text-primary)] uppercase tracking-wide block"
                    >
                      {getTranslation('title')}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)] block">
                      {getTranslation('subtitle')}
                    </span>
                  </div>
                </div>
                <motion.button aria-label="Close" 
                  onClick={onClose} 
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-[var(--text-muted)] group-hover:text-red-400 transition-colors" />
                </motion.button>
              </div>

              {/* Content - Larger padding */}
              <div className="relative p-4 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--accent-primary)]/30 scrollbar-track-transparent">
                
                {/* Working Hours Badge */}
                <div className="relative p-3 bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/5 border border-[var(--accent-primary)]/30 rounded-lg overflow-hidden">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[var(--accent-primary)]" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[var(--accent-primary)]" />
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-[var(--accent-primary)]" />
                    <span className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase">
                      {getTranslation('workingHours')}
                    </span>
                  </div>
                  <p className="text-xl font-mono font-bold text-[var(--accent-primary)]">
                    {getTranslation('hours')}
                  </p>
                </div>

                {/* Weekly Schedule - Larger text */}
                <div className="space-y-2">
                  {scheduleData.map((schedule, index) => (
                    <motion.div
                      key={schedule.day}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-mono transition-all ${
                        schedule.available
                          ? 'bg-green-500/10 border border-green-500/20 hover:border-green-500/40'
                          : 'bg-[var(--bg-tertiary)]/20 border border-[var(--glass-border)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {schedule.available ? (
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                        )}
                        <span className={`font-bold ${schedule.available ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                          {getDay(schedule.day).substring(0, 3)}
                        </span>
                      </div>
                      <span className={`font-bold tabular-nums ${schedule.available ? 'text-green-400' : 'text-[var(--text-muted)]'}`}>
                        {schedule.hours}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Note */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
                    {getTranslation('note')}
                  </p>
                </div>

                {/* Book Call Button - Larger */}
                <motion.button
                  onClick={() => {
                    setIsBookCallOpen(true);
                    onBookCall?.();
                  }}
                  className="w-full relative p-3 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 text-black font-mono font-bold text-sm rounded-lg shadow-[0_4px_20px_rgba(0,217,255,0.4)] hover:shadow-[0_6px_30px_rgba(0,217,255,0.6)] transition-all overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Scanline effect */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="h-full w-full" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
                    }} />
                  </div>
                  
                  <div className="relative flex items-center justify-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="uppercase tracking-wide">{getTranslation('bookCallButton')}</span>
                  </div>
                </motion.button>
              </div>

              {/* Footer stats - Larger */}
              <div className="relative border-t border-[var(--glass-border)] px-4 py-2.5 bg-[var(--bg-secondary)]/30 flex items-center justify-around">
                <div className="text-center">
                  <p className="text-sm font-mono font-bold text-[var(--accent-primary)]">7</p>
                  <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Days</p>
                </div>
                <div className="h-7 w-px bg-[var(--glass-border)]" />
                <div className="text-center">
                  <p className="text-sm font-mono font-bold text-green-400">42h</p>
                  <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Week</p>
                </div>
                <div className="h-7 w-px bg-[var(--glass-border)]" />
                <div className="text-center">
                  <p className="text-sm font-mono font-bold text-purple-400">CET</p>
                  <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Zone</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Book Call Modal */}
      <BookCallModal
        isOpen={isBookCallOpen}
        onClose={() => setIsBookCallOpen(false)}
      />
    </>
  );
}