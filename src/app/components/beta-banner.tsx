import { motion } from "motion/react";
import { AlertTriangle, Wrench } from "lucide-react";
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
      {/* Horizontal scanlines effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.4) 2px,
            rgba(0, 0, 0, 0.4) 4px
          )`
        }}
      />

      {/* Main content container */}
      <div className="relative h-14 md:h-16 flex items-center overflow-hidden bg-gradient-to-b from-[#252525] to-[#1a1a1a]">
        {/* Left warning indicator - WRENCH замість warning */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-16 bg-[#ff9500] flex items-center justify-center border-r-2 border-black z-20 shadow-lg">
          <motion.div
            animate={{
              rotate: [0, 15, -15, 15, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Wrench className="w-6 h-6 md:w-7 md:h-7 text-black" strokeWidth={2.5} />
          </motion.div>
        </div>

        {/* Right warning indicator - WRENCH замість warning */}
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-16 bg-[#ff9500] flex items-center justify-center border-l-2 border-black z-20 shadow-lg">
          <motion.div
            animate={{
              rotate: [0, -15, 15, -15, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
          >
            <Wrench className="w-6 h-6 md:w-7 md:h-7 text-black" strokeWidth={2.5} />
          </motion.div>
        </div>

        {/* Scrolling text container - with proper padding to avoid icons */}
        <div className="absolute inset-0 flex items-center overflow-hidden">
          <motion.div
            className="flex items-center whitespace-nowrap"
            style={{ 
              paddingLeft: '4rem',
              paddingRight: '4rem',
              direction: 'ltr', // Force LTR for animation direction
            }}
            animate={{ x: isRTL ? ['0%', '50%'] : [0, '-50%'] }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span 
              className="font-mono text-base md:text-lg font-bold uppercase"
              style={{
                color: '#ff9500',
                textShadow: `
                  0 0 10px rgba(255, 149, 0, 0.6),
                  0 1px 0 rgba(0, 0, 0, 0.9),
                  0 2px 4px rgba(0, 0, 0, 0.7)
                `,
                letterSpacing: isRTL ? '0' : '0.2em',
                fontFamily: 'monospace',
                fontWeight: '700',
                direction: isRTL ? 'rtl' : 'ltr', // Text direction only
              }}
            >
              {repeatedMessage}
            </span>
          </motion.div>
        </div>

        {/* Top highlight strip */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ff9500]/60 to-transparent" />
        
        {/* Bottom shadow strip */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Subtle flicker overlay */}
        <motion.div
          className="absolute inset-0 bg-[#ff9500]/5 pointer-events-none mix-blend-overlay"
          animate={{
            opacity: [0, 0.15, 0, 0.1, 0],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Bottom border with dots pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-1 flex items-center justify-center gap-1 bg-black/40">
        {Array(50).fill(null).map((_, i) => (
          <div key={i} className="w-1 h-0.5 bg-[#ff9500]/30 rounded-full" />
        ))}
      </div>
    </div>
  );
}