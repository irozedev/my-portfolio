import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

const betaTranslations = {
  en: "BETA VERSION   ●   WORK IN PROGRESS   ●   This portfolio is under active development   ●   Some features may not work as expected   ●   ",
  uk: "БЕТА ВЕРСІЯ   ●   У РОЗРОБЦІ   ●   Це портфоліо активно розробляється   ●   Деякі функції можуть працювати некоректно   ●   ",
  nl: "BETA VERSIE   ●   IN ONTWIKKELING   ●   Deze portfolio is in actieve ontwikkeling   ●   Sommige functies werken mogelijk niet zoals verwacht   ●   ",
  ar: "نسخة تجريبية   ●   قيد التطوير   ●   هذا الملف الشخصي قيد التطوير النشط   ●   قد لا تعمل بعض الميزات كما هو متوقع   ●   ",
  es: "VERSIÓN BETA   ●   EN DESARROLLO   ●   Este portafolio está en desarrollo activo   ●   Algunas funciones pueden no funcionar como se espera   ●   "
};

export function BetaBanner() {
  const { language, isRTL } = useLanguage();
  
  // Get translated message
  const message = betaTranslations[language as keyof typeof betaTranslations] || betaTranslations.en;
  
  // Create long repeating string for seamless animation
  const repeatedMessage = Array(10).fill(message).join("");
  
  return (
    <div id="beta-banner" className="fixed top-0 left-0 right-0 z-[10000] bg-[#1a1a1a] border-b-2 border-[#ffcc00] overflow-hidden">
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
        {/* Left warning indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-16 bg-[#ffcc00] flex items-center justify-center border-r-2 border-black z-20 shadow-lg">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-black" strokeWidth={2.5} fill="#ffcc00" />
          </motion.div>
        </div>

        {/* Right warning indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-16 bg-[#ffcc00] flex items-center justify-center border-l-2 border-black z-20 shadow-lg">
          <motion.div
            animate={{
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-black" strokeWidth={2.5} fill="#ffcc00" />
          </motion.div>
        </div>

        {/* Scrolling text container - with proper padding to avoid icons */}
        <div className="absolute inset-0 flex items-center overflow-hidden">
          <motion.div
            className="flex items-center whitespace-nowrap"
            style={{ paddingLeft: '3rem' }}
            animate={{
              x: [0, '-50%'],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span 
              className="font-mono text-base md:text-lg font-bold uppercase"
              style={{
                color: '#ffcc00',
                textShadow: `
                  0 0 10px rgba(255, 204, 0, 0.6),
                  0 1px 0 rgba(0, 0, 0, 0.9),
                  0 2px 4px rgba(0, 0, 0, 0.7)
                `,
                letterSpacing: '0.2em',
                fontFamily: 'monospace',
                fontWeight: '700',
              }}
            >
              {repeatedMessage}
            </span>
          </motion.div>
        </div>

        {/* Top highlight strip */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ffcc00]/60 to-transparent" />
        
        {/* Bottom shadow strip */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Subtle flicker overlay */}
        <motion.div
          className="absolute inset-0 bg-[#ffcc00]/5 pointer-events-none mix-blend-overlay"
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
          <div key={i} className="w-1 h-0.5 bg-[#ffcc00]/30 rounded-full" />
        ))}
      </div>
    </div>
  );
}