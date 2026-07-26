import { Wrench } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

// ✅ ОНОВЛЕНО: Повідомлення про роботи на сайті + очікування реєстрації
const betaTranslations = {
  en: "⚙️ UNDER MAINTENANCE   ●   Site improvements in progress   ●   Awaiting business registration   ●   Service bookings paused   ●   ",
  uk: "⚙️ ТЕХНІЧНІ РОБОТИ   ●   Йде покращення сайту   ●   Очікує реєстрацію бізнесу   ●   Замовлення призупинені   ●   ",
  nl: "⚙️ ONDERHOUD   ●   Site verbeteringen bezig   ●   Wacht op bedrijfsregistratie   ●   Service boekingen gepauzeerd   ●   ",
  ar: "⚙️ قيد الصيانة   ●   جاري تحسين الموقع   ●   في انتظار تسجيل الأعمال   ●   تم إيقاف حجوزات الخدمة   ●   ",
  es: "⚙️ EN MANTENIMIENTO   ●   Mejoras del sitio en progreso   ●   Esperando registro comercial   ●   Reservas pausadas   ●   "
};

export function BetaBanner() {
  const { language } = useLanguage();

  // Get translated message
  const message = betaTranslations[language as keyof typeof betaTranslations] || betaTranslations.en;

  // Create long repeating string for seamless animation
  const repeatedMessage = Array(10).fill(message).join("");

  // Arabic is a cursive script: `letter-spacing` breaks the joins between
  // letters, `text-transform: uppercase` does nothing, and the generic
  // `monospace` family has no Arabic glyphs — together they rendered the ticker
  // as disconnected boxes. Use a proper Arabic-capable stack and drop both.
  const isArabic = language === "ar";

  return (
    <div id="beta-banner" className="fixed top-0 left-0 right-0 z-[10000] bg-[#1a1a1a] border-b-2 border-[#ff9500] overflow-hidden">
      {/* Main content container */}
      <div className="relative h-10 md:h-12 flex items-center overflow-hidden bg-gradient-to-b from-[#252525] to-[#1a1a1a]">
        {/* Left warning indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-10 md:w-14 bg-[#ff9500] flex items-center justify-center border-r-2 border-black z-20">
          <Wrench className="w-5 h-5 md:w-6 md:h-6 text-black" strokeWidth={2.5} />
        </div>

        {/* Right warning indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-10 md:w-14 bg-[#ff9500] flex items-center justify-center border-l-2 border-black z-20">
          <Wrench className="w-5 h-5 md:w-6 md:h-6 text-black" strokeWidth={2.5} />
        </div>

        {/* Scrolling text — CSS animation instead of motion for performance.
            The track holds exactly TWO identical halves, so translateX(-50%)
            lands precisely on a repeat boundary and the loop is seamless.
            The old markup had one padded span, so -50% cut mid-message and the
            ticker visibly jumped once per cycle. Padding now lives on the
            wrapper, where it can't skew the 50%. */}
        <div
          className="absolute inset-0 flex items-center overflow-hidden px-16"
          style={{ direction: 'ltr' }}
        >
          <div className="flex items-center whitespace-nowrap banner-scroll">
            {[0, 1].map((half) => (
              <span
                key={half}
                lang={language}
                aria-hidden={half === 1}
                className={`text-sm md:text-base font-bold ${isArabic ? '' : 'font-mono uppercase'}`}
                style={{
                  color: '#ff9500',
                  textShadow: '0 0 10px rgba(255, 149, 0, 0.6)',
                  letterSpacing: isArabic ? 'normal' : '0.15em',
                  fontFamily: isArabic
                    ? "'Noto Naskh Arabic', 'Noto Sans Arabic', 'Segoe UI', Tahoma, 'Geeza Pro', 'Arabic Typesetting', sans-serif"
                    : 'monospace',
                  // The track always scrolls LTR (see the wrapper), but each
                  // message must still shape and order internally as RTL.
                  direction: isArabic ? 'rtl' : 'ltr',
                  unicodeBidi: 'isolate',
                }}
              >
                {repeatedMessage}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes banner-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .banner-scroll {
          animation: banner-scroll 80s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .banner-scroll { animation: none; }
        }
      `}</style>
    </div>
  );
}