import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, Video, Phone, X, Check, ChevronLeft, Loader2, ArrowRight, CheckCircle } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, addDays, startOfDay, isBefore, isWeekend, setHours, setMinutes } from "date-fns";
import { useLanguage } from "../contexts/language-context";
import { useAuth } from "../contexts/auth-context";
import { projectId, publicAnonKey } from "@/utils/supabase/info";
import "react-day-picker/dist/style.css";

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export function BookCallModal({ isOpen, onClose }: BookCallModalProps) {
  const { t } = useLanguage();
  const { user, accessToken } = useAuth();
  const [step, setStep] = useState<'date' | 'time' | 'details' | 'success'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [callType, setCallType] = useState<'video' | 'phone'>('video');
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Time slots (9 AM - 6 PM, excluding lunch 12-1 PM)
  const timeSlots: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "13:00", available: true },
    { time: "13:30", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: true },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
    { time: "17:00", available: true },
    { time: "17:30", available: true },
  ];

  // Auto-select first available date when modal opens
  useEffect(() => {
    if (!selectedDate) {
      const tomorrow = addDays(startOfDay(new Date()), 1);
      const firstAvailable = isWeekend(tomorrow) ? addDays(tomorrow, 1) : tomorrow;
      setSelectedDate(firstAvailable);
    }
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    setTimeout(() => {
      setStep('date');
      setSelectedDate(undefined);
      setSelectedTime("");
      setPurpose("");
      setNotes("");
      setError("");
    }, 300);
  }, []);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleSubmit = async () => {
    if (!user || !selectedDate || !selectedTime || !accessToken) return;

    setLoading(true);
    setError("");

    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const bookingDateTime = setMinutes(setHours(selectedDate, hours), minutes);

      const booking = {
        userId: user.id,
        userName: user.user_metadata?.name || user.email,
        userEmail: user.email,
        date: format(bookingDateTime, 'yyyy-MM-dd'),
        time: selectedTime,
        callType,
        purpose,
        notes,
        timezone: 'Europe/Brussels',
        createdAt: new Date().toISOString(),
      };

      console.log('Booking data:', booking);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7/book-call`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(booking),
        }
      );

      console.log('Booking response:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Booking error:', errorData);
        throw new Error(`Failed to book call: ${errorData}`);
      }

      setStep('success');
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error('Error booking call:', err);
      setError(err.message || 'Failed to book call. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Disable past dates and weekends
  const disabledDays = (date: Date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 30); // Only allow booking up to 30 days ahead
    return isBefore(date, today) || isWeekend(date) || isBefore(maxDate, date);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] border-2 border-[#00d9ff]/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d9ff] to-purple-500 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                    {step === 'success' ? t('bookCall.bookingConfirmed') : t('bookCall.title')}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {step === 'date' && t('bookCall.subtitle')}
                    {step === 'time' && t('bookCall.selectTime')}
                    {step === 'details' && 'Add details'}
                    {step === 'success' && t('bookCall.lookingForward')}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* Availability Notice */}
            <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-[#00d9ff]/10 to-purple-500/10 border border-[#00d9ff]/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#00d9ff] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                    Available Working Hours
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    📅 Until February 14: Available <span className="font-bold text-[#00d9ff]">06:00 - 12:00 CET</span>
                    <br />
                    📅 After February 14: Regular schedule resumes
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Step 1: Date Selection */}
              {step === 'date' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[var(--text-secondary)]">
                      {t('bookCall.availableWeekdays')}
                    </p>
                  </div>
                  
                  <div className="calendar-wrapper">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) setStep('time');
                      }}
                      disabled={disabledDays}
                      fromDate={addDays(new Date(), 1)}
                      toDate={addDays(new Date(), 30)}
                      className="bg-white/5 rounded-2xl p-4"
                      classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center text-[var(--text-primary)]",
                        caption_label: "text-lg font-bold",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-white/10 rounded-lg transition-colors",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-[var(--text-muted)] rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#00d9ff]/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-white/10 rounded-md transition-colors text-[var(--text-primary)]",
                        day_selected: "bg-[#00d9ff] text-black hover:bg-[#00d9ff] hover:text-black focus:bg-[#00d9ff] focus:text-black font-bold",
                        day_today: "bg-white/5 text-[#00d9ff] font-bold",
                        day_outside: "text-[var(--text-muted)] opacity-50",
                        day_disabled: "text-[var(--text-muted)] opacity-30 line-through",
                        day_hidden: "invisible",
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Time Selection */}
              {step === 'time' && selectedDate && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[var(--text-primary)] font-semibold">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Europe/Brussels timezone (CET)
                      </p>
                    </div>
                    <button
                      onClick={() => setStep('date')}
                      className="text-sm text-[#00d9ff] hover:underline"
                    >
                      {t('bookCall.changeDate')}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <motion.button
                        key={slot.time}
                        onClick={() => handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          slot.available
                            ? 'border-white/10 hover:border-[#00d9ff]/50 hover:bg-[#00d9ff]/10'
                            : 'border-white/5 opacity-30 cursor-not-allowed'
                        }`}
                        whileHover={slot.available ? { scale: 1.05 } : {}}
                        whileTap={slot.available ? { scale: 0.95 } : {}}
                      >
                        <Clock className="w-5 h-5 mx-auto mb-2 text-[#00d9ff]" />
                        <div className="font-semibold text-[var(--text-primary)]">{slot.time}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Details */}
              {step === 'details' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="p-4 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#00d9ff]" />
                      <div>
                        <div className="font-semibold text-[var(--text-primary)]">
                          {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {selectedTime} (CET)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call Type */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                      Call Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setCallType('video')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          callType === 'video'
                            ? 'border-[#00d9ff] bg-[#00d9ff]/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Video className="w-6 h-6 mx-auto mb-2 text-[#00d9ff]" />
                        <div className="font-semibold text-[var(--text-primary)]">Video Call</div>
                      </button>
                      <button
                        onClick={() => setCallType('phone')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          callType === 'phone'
                            ? 'border-[#00d9ff] bg-[#00d9ff]/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Phone className="w-6 h-6 mx-auto mb-2 text-[#00d9ff]" />
                        <div className="font-semibold text-[var(--text-primary)]">Phone Call</div>
                      </button>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Purpose of Call
                    </label>
                    <textarea
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="Tell me about your project..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#00d9ff]/50 focus:ring-2 focus:ring-[#00d9ff]/20 transition-all resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tell me about your project..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#00d9ff]/50 focus:ring-2 focus:ring-[#00d9ff]/20 transition-all resize-none"
                      rows={4}
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('time')}
                      className="flex-1 px-6 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-[var(--text-secondary)] hover:bg-white/10 transition-all"
                    >
                      Back
                    </button>
                    <motion.button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        <>
                          Confirm Booking
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-[#00d9ff] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {t('bookCall.bookingConfirmed')}
                  </h3>

                  <p className="text-[var(--text-secondary)] mb-6">
                    {t('bookCall.calendarInvitation')} <span className="text-[#00d9ff] font-semibold">{user?.email}</span>
                  </p>

                  <div className="p-4 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-xl mb-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">{t('bookCall.date')}:</span>
                        <span className="text-[var(--text-primary)] font-semibold">
                          {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">{t('bookCall.time')}:</span>
                        <span className="text-[var(--text-primary)] font-semibold">{selectedTime} CET</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">{t('bookCall.type')}:</span>
                        <span className="text-[var(--text-primary)] font-semibold capitalize">{t(`bookCall.${callType}`)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-muted)]">
                    Need to reschedule? Email me at rozedev095@gmail.com
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}