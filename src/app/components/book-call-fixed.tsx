import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Video, Phone, X, ChevronLeft, Loader2, ArrowRight, CheckCircle, Mail, User as UserIcon, MessageSquare, Zap } from "lucide-react";
import { format, addDays, startOfDay, isWeekend } from "date-fns";
import { useLanguage } from "../contexts/language-context";
import { projectId, publicAnonKey } from "@/utils/supabase/info";
import { useModalA11y } from "../hooks/use-modal-a11y";

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const translations = {
  en: {
    title: "Book a Call",
    subtitle: "Schedule a free consultation",
    step1: "Pick a Date",
    step2: "Choose Time",
    step3: "Your Details",
    step4: "Confirmed!",
    weekdaysOnly: "Available Mon-Fri",
    timezone: "Europe/Brussels (CET)",
    changeDate: "Change",
    callType: "Call Type",
    videoCall: "Video Call",
    phoneCall: "Phone Call",
    name: "Your Name",
    email: "Your Email",
    purpose: "What's your project about?",
    purposePlaceholder: "Brief description of your project...",
    back: "Back",
    confirm: "Confirm Booking",
    booking: "Booking...",
    confirmed: "Request Sent!",
    confirmMsg: "Stepan will confirm your call by email at",
    reschedule: "Need to reschedule? Email rozedev095@gmail.com",
    morning: "Morning",
    afternoon: "Afternoon",
    free: "30 min • Free",
  },
  nl: {
    title: "Gesprek Boeken",
    subtitle: "Gratis consultatie plannen",
    step1: "Kies een Datum",
    step2: "Kies een Tijd",
    step3: "Uw Gegevens",
    step4: "Bevestigd!",
    weekdaysOnly: "Ma-Vr beschikbaar",
    timezone: "Europa/Brussel (CET)",
    changeDate: "Wijzigen",
    callType: "Gesprekstype",
    videoCall: "Videogesprek",
    phoneCall: "Telefoongesprek",
    name: "Uw Naam",
    email: "Uw Email",
    purpose: "Waar gaat uw project over?",
    purposePlaceholder: "Korte beschrijving van uw project...",
    back: "Terug",
    confirm: "Bevestigen",
    booking: "Bezig met boeken...",
    confirmed: "Aanvraag verzonden!",
    confirmMsg: "Stepan bevestigt je gesprek per e-mail op",
    reschedule: "Verplaatsen? Mail rozedev095@gmail.com",
    morning: "Ochtend",
    afternoon: "Middag",
    free: "30 min • Gratis",
  },
  ar: {
    title: "احجز مكالمة",
    subtitle: "استشارة مجانية",
    step1: "اختر تاريخ",
    step2: "اختر وقت",
    step3: "بياناتك",
    step4: "تم التأكيد!",
    weekdaysOnly: "الاثنين - الجمعة",
    timezone: "أوروبا/بروكسل (CET)",
    changeDate: "تغيير",
    callType: "نوع المكالمة",
    videoCall: "مكالمة فيديو",
    phoneCall: "مكالمة هاتفية",
    name: "اسمك",
    email: "بريدك الإلكتروني",
    purpose: "ما هو مشروعك؟",
    purposePlaceholder: "وصف مختصر لمشروعك...",
    back: "رجوع",
    confirm: "تأكيد الحجز",
    booking: "جاري الحجز...",
    confirmed: "تم إرسال الطلب!",
    confirmMsg: "سيؤكد ستيبان المكالمة عبر البريد على",
    reschedule: "تحتاج إعادة جدولة؟ rozedev095@gmail.com",
    morning: "صباحاً",
    afternoon: "بعد الظهر",
    free: "30 دقيقة • مجاناً",
  },
  es: {
    title: "Reservar Llamada",
    subtitle: "Consulta gratuita",
    step1: "Elige una Fecha",
    step2: "Elige una Hora",
    step3: "Tus Datos",
    step4: "¡Confirmado!",
    weekdaysOnly: "Lun-Vie disponible",
    timezone: "Europa/Bruselas (CET)",
    changeDate: "Cambiar",
    callType: "Tipo de Llamada",
    videoCall: "Videollamada",
    phoneCall: "Llamada telefónica",
    name: "Tu Nombre",
    email: "Tu Email",
    purpose: "¿De qué trata tu proyecto?",
    purposePlaceholder: "Breve descripción de tu proyecto...",
    back: "Atrás",
    confirm: "Confirmar Reserva",
    booking: "Reservando...",
    confirmed: "¡Solicitud enviada!",
    confirmMsg: "Stepan confirmará tu llamada por email a",
    reschedule: "¿Necesitas reprogramar? rozedev095@gmail.com",
    morning: "Mañana",
    afternoon: "Tarde",
    free: "30 min • Gratis",
  },
};

// Stepan is only free before his main job — mornings, 06:00–12:00 CET, weekdays.
// (Weekend afternoon slots 13:00–18:00 can be added later once days-off are set.)
const morningSlots = ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
const afternoonSlots: string[] = [];

export function BookCallModal({ isOpen, onClose }: BookCallModalProps) {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const dialogRef = useModalA11y({ isOpen, onClose });

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [callType, setCallType] = useState<"video" | "phone">("video");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate next 14 weekdays
  const availableDates = useCallback(() => {
    const dates: Date[] = [];
    let current = addDays(startOfDay(new Date()), 1);
    while (dates.length < 14) {
      if (!isWeekend(current)) dates.push(current);
      current = addDays(current, 1);
    }
    return dates;
  }, []);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setSelectedDate(undefined);
        setSelectedTime("");
        setPurpose("");
        setError("");
      }, 300);
    }
  }, [isOpen]);

  // Name and email used to be prefilled from the signed-in account. With
  // sign-in gone the visitor always types them, which is what almost everyone
  // did anyway.

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !email) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Submit through the /contact endpoint — it saves the request AND emails
      // Stepan via Resend. (The /book-call endpoint only stored to KV and never
      // sent any notification, so bookings silently went nowhere.)
      const dateStr = format(selectedDate, "EEE, MMM d yyyy");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            name: name || "Guest",
            email,
            service: `Call booking — ${callType === "video" ? "Video" : "Phone"}`,
            message:
              `New call booking request\n\n` +
              `• Date: ${dateStr}\n` +
              `• Time: ${selectedTime} CET (Europe/Brussels)\n` +
              `• Type: ${callType}\n` +
              `• Name: ${name || "—"}\n` +
              `• Email: ${email}\n` +
              `• About: ${purpose || "—"}`,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      setStep(4);
      setTimeout(onClose, 5000);
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isRTL = language === "ar";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100000] flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-call-title"
            tabIndex={-1}
            /* Width grows with the screen instead of sitting at a fixed 512px.
               `sm:max-w-lg` alone meant the dialog was 512px from a 768px
               tablet all the way up to a 2560px display, where it covered 20%
               of the screen while its own content — a 14-date grid and a
               12-slot time grid — had to scroll. The `calc` keeps a margin so
               the sheet never touches the edges once it is a floating card. */
            className="bg-[var(--bg-primary)] border-t-2 sm:border-2 border-[#00d9ff]/30 rounded-t-3xl sm:rounded-2xl w-full sm:w-[calc(100%-3rem)] sm:max-w-xl md:max-w-2xl xl:max-w-3xl max-h-[90dvh] overflow-hidden shadow-[0_0_24px_rgba(0,217,255,0.15)] flex flex-col"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Drag handle mobile */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 bg-[var(--text-muted)]/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00d9ff] to-cyan-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,217,255,0.18)]">
                  <Calendar className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 id="book-call-title" className="text-lg font-black text-[var(--text-primary)] font-mono tracking-tight">{t.title}</h2>
                  <p className="text-xs text-[var(--text-muted)] font-mono">{t.free}</p>
                </div>
              </div>
              <button aria-label="Close" onClick={onClose} className="p-2.5 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors active:scale-90">
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="px-5 py-3 flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-1.5">
                  <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    s <= step ? "bg-gradient-to-r from-[#00d9ff] to-cyan-400" : "bg-[var(--bg-secondary)]"
                  }`} />
                </div>
              ))}
              <span className="text-[10px] font-mono text-[var(--text-muted)] ml-1">{step}/4</span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              <AnimatePresence mode="wait">
                {/* STEP 1: Date */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[var(--text-primary)] font-mono">{t.step1}</h3>
                      <span className="text-xs text-[var(--text-muted)] font-mono">{t.weekdaysOnly}</span>
                    </div>

                    {/* 14 dates. Two columns is seven rows and guaranteed
                        scrolling; the extra width above buys real columns. */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {availableDates().map((date) => {
                        const isSelected = selectedDate?.getTime() === date.getTime();
                        const dayName = format(date, "EEE");
                        const dayNum = format(date, "d");
                        const monthName = format(date, "MMM");

                        return (
                          <motion.button
                            key={date.toISOString()}
                            onClick={() => {
                              setSelectedDate(date);
                              setStep(2);
                            }}
                            className={`relative p-3.5 rounded-xl border-2 transition-all text-left active:scale-95 ${
                              isSelected
                                ? "border-[#00d9ff] bg-[#00d9ff]/10 shadow-[0_0_20px_rgba(0,217,255,0.15)]"
                                : "border-[var(--border-color)] hover:border-[#00d9ff]/40 bg-[var(--bg-secondary)]/30"
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="flex items-baseline gap-2">
                              <span className={`text-2xl font-black font-mono ${isSelected ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]"}`}>
                                {dayNum}
                              </span>
                              <div>
                                <span className={`text-xs font-bold uppercase block ${isSelected ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]"}`}>
                                  {dayName}
                                </span>
                                <span className="text-[10px] text-[var(--text-muted)]">{monthName}</span>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Time */}
                {step === 2 && selectedDate && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[var(--text-primary)] font-mono">{t.step2}</h3>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                          {format(selectedDate, "EEEE, MMM d")} • {t.timezone}
                        </p>
                      </div>
                      <button
                        onClick={() => setStep(1)}
                        className="text-xs text-[var(--accent-primary)] font-mono font-bold hover:underline active:scale-95"
                      >
                        {t.changeDate}
                      </button>
                    </div>

                    {/* Morning */}
                    <div>
                      <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">
                        {t.morning}
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {morningSlots.map((time) => (
                          <motion.button
                            key={time}
                            onClick={() => { setSelectedTime(time); setStep(3); }}
                            className={`py-3 px-2 rounded-xl border-2 font-mono font-bold text-sm transition-all active:scale-90 ${
                              selectedTime === time
                                ? "border-[#00d9ff] bg-[#00d9ff]/10 text-[var(--accent-primary)]"
                                : "border-[var(--border-color)] hover:border-[#00d9ff]/40 text-[var(--text-primary)] bg-[var(--bg-secondary)]/20"
                            }`}
                            whileTap={{ scale: 0.9 }}
                          >
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Afternoon (hidden until weekend slots are enabled) */}
                    {afternoonSlots.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">
                        {t.afternoon}
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {afternoonSlots.map((time) => (
                          <motion.button
                            key={time}
                            onClick={() => { setSelectedTime(time); setStep(3); }}
                            className={`py-3 px-2 rounded-xl border-2 font-mono font-bold text-sm transition-all active:scale-90 ${
                              selectedTime === time
                                ? "border-[#00d9ff] bg-[#00d9ff]/10 text-[var(--accent-primary)]"
                                : "border-[var(--border-color)] hover:border-[#00d9ff]/40 text-[var(--text-primary)] bg-[var(--bg-secondary)]/20"
                            }`}
                            whileTap={{ scale: 0.9 }}
                          >
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    )}

                    {/* Back */}
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] font-mono active:scale-95 mt-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> {t.back}
                    </button>
                  </motion.div>
                )}

                {/* STEP 3: Details */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-4 pt-2"
                  >
                    {/* Summary chip */}
                    <div className="flex items-center gap-2 p-3 bg-[#00d9ff]/8 border border-[#00d9ff]/20 rounded-xl">
                      <Calendar className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                      <span className="text-sm font-mono text-[var(--text-primary)]">
                        {selectedDate && format(selectedDate, "EEE, MMM d")} • {selectedTime} CET
                      </span>
                      <button onClick={() => setStep(1)} className="ml-auto text-[10px] text-[var(--accent-primary)] font-mono hover:underline">{t.changeDate}</button>
                    </div>

                    {/* Call Type */}
                    <div>
                      <label className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-2">{t.callType}</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {([
                          { type: "video" as const, icon: Video, label: t.videoCall },
                          { type: "phone" as const, icon: Phone, label: t.phoneCall },
                        ]).map(({ type, icon: Icon, label }) => (
                          <motion.button
                            key={type}
                            onClick={() => setCallType(type)}
                            className={`p-3.5 rounded-xl border-2 flex items-center gap-3 transition-all active:scale-95 ${
                              callType === type
                                ? "border-[#00d9ff] bg-[#00d9ff]/10"
                                : "border-[var(--border-color)] hover:border-[#00d9ff]/30"
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon className={`w-5 h-5 ${callType === type ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}`} />
                            <span className={`text-sm font-bold ${callType === type ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]"}`}>{label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">{t.name}</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)]/50 border-2 border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#00d9ff]/50 focus:ring-0 text-sm font-mono"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">{t.email} *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)]/50 border-2 border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#00d9ff]/50 focus:ring-0 text-sm font-mono"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    {/* Purpose */}
                    <div>
                      <label className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1.5">{t.purpose}</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[var(--text-muted)]" />
                        <textarea
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)]/50 border-2 border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#00d9ff]/50 focus:ring-0 text-sm font-mono resize-none"
                          rows={3}
                          placeholder={t.purposePlaceholder}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
                        {error}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2.5 pt-2 pb-2">
                      <button
                        onClick={() => setStep(2)}
                        className="px-5 py-3.5 bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] text-sm font-mono font-bold active:scale-95"
                      >
                        {t.back}
                      </button>
                      <motion.button
                        onClick={handleSubmit}
                        disabled={loading || !email}
                        className="flex-1 py-3.5 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-black rounded-xl text-sm font-mono disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,217,255,0.18)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)]"
                        whileTap={{ scale: loading ? 1 : 0.95 }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t.booking}
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            {t.confirm}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Success */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-5"
                  >
                    <motion.div
                      className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>

                    <div>
                      <h3 className="text-2xl font-black font-mono bg-gradient-to-r from-[#00d9ff] to-green-400 bg-clip-text text-transparent">
                        {t.confirmed}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-2 font-mono">
                        {t.confirmMsg} <span className="text-[var(--accent-primary)] font-bold">{email}</span>
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
                      <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                      <span className="text-sm font-mono text-[var(--text-primary)]">
                        {selectedDate && format(selectedDate, "MMM d")} • {selectedTime} CET
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">•</span>
                      <span className="text-sm text-[var(--text-primary)] capitalize">{callType === "video" ? t.videoCall : t.phoneCall}</span>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] font-mono">
                      {t.reschedule}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}