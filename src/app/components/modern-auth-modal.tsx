import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Github, Loader2, Zap, Rocket } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { useLanguage } from "../contexts/language-context";
import { toast } from "sonner";
import { lockScroll, unlockScroll } from "../../utils/scroll-lock";
import { useModalA11y } from "../hooks/use-modal-a11y";

interface ModernAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModernAuthModal({ isOpen, onClose }: ModernAuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"google" | "github" | null>(null);
  const { signInWithProvider } = useAuth();
  const { t, language } = useLanguage();

  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [isOpen]);

  const handleSocialLogin = async (provider: "google" | "github") => {
    setLoading(true);
    setSelectedProvider(provider);
    try {
      await signInWithProvider(provider);
      const providerName = provider === "google" ? "Google" : "GitHub";
      toast.success(
        `🚀 ${L("Redirecting to", "Doorsturen naar", "جارٍ التحويل إلى", "Redirigiendo a")} ${providerName}…`,
      );
      // Don't close modal immediately - user is being redirected
    } catch (error: any) {
      console.error("Social login error:", error);
      const providerName = provider === "google" ? "Google" : "GitHub";
      toast.error(
        error.message ||
          `${L("Could not sign in with", "Inloggen mislukt via", "تعذّر تسجيل الدخول عبر", "No se pudo iniciar sesión con")} ${providerName}.`,
      );
      setLoading(false);
      setSelectedProvider(null);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Escape to close, focus trapped inside, focus restored to the trigger.
  // Hook must run before the early return so its call order never changes.
  const dialogRef = useModalA11y({ isOpen, onClose: handleClose });

  // The `isOpen` check belongs INSIDE AnimatePresence. It used to be an early
  // `return null` above this point, which unmounted the whole tree in one go —
  // AnimatePresence never got a chance to run the exit variants, so every
  // `exit={...}` below was dead code and the dialog vanished instantly.
  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div
        key="auth-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        /* `items-start sm:items-center` + `overflow-y-auto`: the panel is taller
           than a landscape phone or a 13" laptop, and a centred flex item in a
           non-scrolling container has its overflow clipped in BOTH directions —
           the sign-in buttons were simply unreachable. Now the backdrop
           scrolls and the panel is capped to the visible viewport. */
        className="fixed inset-0 z-[100000] bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto overscroll-contain p-4 py-8"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md my-auto"
        >
          {/* Glow. `animate-pulse` was removed: a permanently breathing halo
              behind a dialog you are trying to read is just noise. */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-primary)] via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-15" />

          {/* Modal Content */}
          <div className="relative bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 bg-[#00d9ff]/10 rounded-full blur-3xl"
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
            {!loading && (
              <button aria-label={L("Close", "Sluiten", "إغلاق", "Cerrar")}
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] rounded-full transition-colors group"
              >
                <X className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" />
              </button>
            )}

            {/* Header */}
            <div className="relative px-6 pt-8 pb-5 sm:px-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mb-4 bg-gradient-to-br from-[var(--accent-primary)]/20 to-purple-500/20 rounded-2xl"
              >
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--accent-primary)]" />
              </motion.div>

              <motion.h2
                id="auth-modal-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2"
              >
                {t("auth.welcome")}! 👋
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-[var(--text-muted)] text-sm sm:text-base"
              >
                {t("auth.unlockFeatures")}
              </motion.p>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative px-6 sm:px-8 pb-5 space-y-3"
            >
              {[
                { icon: Zap, text: t("auth.premiumProjects") },
                { icon: Rocket, text: t("auth.personalizedExperience") },
                { icon: Sparkles, text: t("auth.exclusiveContent") },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 text-[var(--text-secondary)]"
                >
                  <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-[var(--accent-primary)]" />
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Login Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="relative px-6 sm:px-8 pt-1 space-y-3"
            >
              {/* Google Login */}
              <motion.button
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="relative w-full py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group overflow-hidden"
              >
                {/* Animated shine effect */}
                {!loading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      repeatDelay: 1,
                    }}
                  />
                )}

                {loading && selectedProvider === "google" ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="relative z-10">{L("Connecting to Google…", "Verbinden met Google…", "جارٍ الاتصال بـ Google…", "Conectando con Google…")}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="relative z-10 text-sm sm:text-base">{t("auth.continueWithGoogle")}</span>
                  </>
                )}
              </motion.button>

              {/* GitHub Login */}
              <motion.button
                onClick={() => handleSocialLogin("github")}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="relative w-full py-3.5 bg-[#24292e] hover:bg-[#1a1e22] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group overflow-hidden"
              >
                {/* Animated shine effect */}
                {!loading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      repeatDelay: 1,
                    }}
                  />
                )}

                {loading && selectedProvider === "github" ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="relative z-10">{L("Connecting to GitHub…", "Verbinden met GitHub…", "جارٍ الاتصال بـ GitHub…", "Conectando con GitHub…")}</span>
                  </>
                ) : (
                  <>
                    <Github className="w-6 h-6 relative z-10" />
                    <span className="relative z-10 text-sm sm:text-base">{t("auth.continueWithGithub")}</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="relative px-6 sm:px-8 pt-4 pb-6 text-center"
            >
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {L(
                  "By continuing you agree to the",
                  "Door verder te gaan ga je akkoord met het",
                  "بالمتابعة أنت توافق على",
                  "Al continuar aceptas la",
                )}{" "}
                <a href="#privacy" className="text-[var(--accent-primary)] hover:underline">
                  {L("Privacy Policy", "privacybeleid", "سياسة الخصوصية", "Política de privacidad")}
                </a>{" "}
                {L("and", "en de", "و", "y los")}{" "}
                <a href="#terms" className="text-[var(--accent-primary)] hover:underline">
                  {L("Terms of Service", "gebruiksvoorwaarden", "شروط الخدمة", "Términos del servicio")}
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}