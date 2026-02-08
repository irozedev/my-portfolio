import { motion, AnimatePresence } from "motion/react";
import { Cookie, X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/language-context";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setTimeout(() => setShowBanner(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:bottom-20 md:max-w-md z-[60] bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-xl max-h-[85vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={handleDecline}
            className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-1 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors z-10"
          >
            <X className="w-4 h-4 text-[var(--text-muted)]" />
          </button>

          {/* Icon & Title */}
          <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4 pr-8">
            <div className="p-1.5 md:p-2 bg-[var(--accent-primary)]/10 rounded-lg shrink-0">
              <Cookie className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent-primary)]" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-[var(--text-primary)] mb-1">
                🍪 Cookie Notice
              </h3>
              <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
                We use cookies to improve your experience and analyze site traffic. 
                By continuing, you agree to our use of cookies.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-3 md:gap-4 text-xs text-[var(--text-muted)] mb-3 md:mb-4">
            <a 
              href="#privacy" 
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'privacy';
                window.dispatchEvent(new HashChangeEvent('hashchange'));
              }}
              className="hover:text-[var(--accent-primary)] transition-colors underline cursor-pointer"
            >
              Privacy Policy
            </a>
            <a 
              href="#terms" 
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'terms';
                window.dispatchEvent(new HashChangeEvent('hashchange'));
              }}
              className="hover:text-[var(--accent-primary)] transition-colors underline cursor-pointer"
            >
              Terms of Service
            </a>
          </div>

          {/* Actions */}
          <div className="flex gap-2 md:gap-3">
            <motion.button
              onClick={handleAccept}
              className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 hover:from-[var(--accent-secondary)] hover:to-cyan-300 text-white text-sm md:text-base font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Accept All
            </motion.button>
            <motion.button
              onClick={handleDecline}
              className="px-3 md:px-4 py-2 md:py-2.5 border-2 border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm md:text-base font-semibold rounded-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Decline
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}