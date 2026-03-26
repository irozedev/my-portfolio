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
  const { language, isRTL } = useLanguage();
  
  // Get translated message
  const message = betaTranslations[language as keyof typeof betaTranslations] || betaTranslations.en;
  
  // Create long repeating string for seamless animation
  const repeatedMessage = Array(10).fill(message).join("");
  
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

        {/* Scrolling text - CSS animation instead of motion for performance */}
        <div className="absolute inset-0 flex items-center overflow-hidden" style={{ direction: 'ltr' }}>
          <div
            className="flex items-center whitespace-nowrap banner-scroll"
            style={{ 
              paddingLeft: '4rem',
              paddingRight: '4rem',
            }}
          >
            <span 
              className="font-mono text-sm md:text-base font-bold uppercase"
              style={{
                color: '#ff9500',
                textShadow: '0 0 10px rgba(255, 149, 0, 0.6)',
                letterSpacing: '0.15em',
                fontFamily: 'monospace',
              }}
            >
              {repeatedMessage}
            </span>
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
      `}</style>
    </div>
  );
}