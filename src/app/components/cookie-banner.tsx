import { Cookie, X, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/language-context";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { language } = useLanguage();

  // This is a consent notice, so it has to be readable in the language the
  // visitor is actually using — an English-only banner over an Arabic page is
  // not informed consent.
  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setTimeout(() => setShowBanner(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: "accepted" }));
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  /* The banner is on screen before anything is scrolled, so importing motion
     here pinned the 42 kB chunk to the critical path for the sake of one slide
     up. A CSS keyframe does the same entrance.

     No exit animation any more: AnimatePresence was the only reason this
     component needed the library, and an exit tween on a banner the reader has
     just dismissed is the one animation nobody waits to watch. */
  /* Publish the banner's height so the floating buttons can clear it. They sit
     in the same corner; on a phone this banner is nearly full width and covers
     them outright. Neither component needs to import the other for this. */
  const bannerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = document.documentElement;
    if (!showBanner) {
      root.style.removeProperty('--cookie-banner-h');
      return;
    }
    const set = () => {
      const h = bannerRef.current?.offsetHeight ?? 0;
      // its own bottom offset (bottom-20 = 5rem) plus a gap
      root.style.setProperty('--cookie-banner-h', h ? `${h + 92}px` : '0px');
    };
    set();
    const ro = new ResizeObserver(set);
    if (bannerRef.current) ro.observe(bannerRef.current);
    return () => {
      ro.disconnect();
      root.style.removeProperty('--cookie-banner-h');
    };
  }, [showBanner]);

  if (!showBanner) return null;

  return (
    <div
      ref={bannerRef}
      className="motion-safe:animate-[cookie-in_0.35s_cubic-bezier(0.22,1,0.36,1)] fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:bottom-20 md:max-w-md z-[9990] bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-xl"
    >
          {/* Close Button */}
          <button aria-label={L("Close", "Sluiten", "إغلاق", "Cerrar")}
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
                {L("Cookie notice", "Cookiemelding", "إشعار ملفات تعريف الارتباط", "Aviso de cookies")}
              </h3>
              <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
                {L(
                  "We use cookies to improve your experience and analyse site traffic. Analytics loads only after you accept.",
                  "We gebruiken cookies om je ervaring te verbeteren en het siteverkeer te analyseren. Analytics laadt pas na je toestemming.",
                  "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل زيارات الموقع. لا تُحمَّل أدوات التحليل إلا بعد موافقتك.",
                  "Usamos cookies para mejorar tu experiencia y analizar el tráfico del sitio. La analítica se carga solo tras tu consentimiento.",
                )}
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
              {L("Privacy Policy", "Privacybeleid", "سياسة الخصوصية", "Política de privacidad")}
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
              {L("Terms of Service", "Gebruiksvoorwaarden", "شروط الخدمة", "Términos del servicio")}
            </a>
          </div>

          {/* Actions */}
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 hover:from-[var(--accent-secondary)] hover:to-cyan-300 text-white text-sm md:text-base font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]"
            >
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
              {L("Accept all", "Alles accepteren", "قبول الكل", "Aceptar todo")}
            </button>
            <button
              onClick={handleDecline}
              className="px-3 md:px-4 py-2 md:py-2.5 border-2 border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm md:text-base font-semibold rounded-xl transition-all motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]"
            >
              {L("Decline", "Weigeren", "رفض", "Rechazar")}
            </button>
          </div>
    </div>
  );
}