import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/language-context";
import { Compass, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const tourTranslations = {
  en: {
    buttonText: "Take a Tour",
    buttonSubtext: "Learn how to navigate",
    title: "Welcome to Stepan Roze Portfolio! 👋",
    description: "Let me show you around. This quick tour will help you discover all the features.",
    closeButton: "Skip Tour",
    nextButton: "Next →",
    prevButton: "← Back",
    doneButton: "Got it! ✓",
    steps: [
      {
        element: "#hero-section",
        popover: {
          title: "🚀 Welcome!",
          description: "I'm Stepan Roze, a Full-Stack Developer specializing in React, TypeScript & modern web technologies.",
        }
      },
      {
        element: "#beta-banner",
        popover: {
          title: "✈️ Beta Mode",
          description: "This portfolio is in BETA - like an airport departure board, you'll see real-time updates and new features being deployed!",
        }
      },
      {
        element: "#theme-toggle",
        popover: {
          title: "🎨 Theme Switcher",
          description: "Toggle between Dark and Light themes. The site remembers your preference!",
        }
      },
      {
        element: "#language-selector",
        popover: {
          title: "🌍 Multi-Language",
          description: "Switch between English, Ukrainian, Dutch, Arabic, and Spanish. Full localization support!",
        }
      },
      {
        element: "#projects-section",
        popover: {
          title: "💼 Projects Gallery",
          description: "Browse my featured projects! On MOBILE: Tap any card to see full details. On DESKTOP: Hover to see effects, click to open details. Each project shows tech stack, metrics, and live demos!",
        }
      },
      {
        element: "#services-section",
        popover: {
          title: "🛠️ Services",
          description: "Tap or click on service cards to see details. Swipe to browse all available services!",
        }
      },
      {
        element: "#book-call-button",
        popover: {
          title: "📞 Book a Call",
          description: "Ready to work together? Schedule a free consultation directly from here!",
        }
      },
      {
        element: "#contact-section",
        popover: {
          title: "📧 Get in Touch",
          description: "Send me a message or connect via LinkedIn, GitHub, or Upwork. I respond within 24 hours!",
        }
      }
    ]
  },
  uk: {
    buttonText: "Почати Тур",
    buttonSubtext: "Дізнайтесь як користуватись",
    title: "Ласкаво просимо до Портфоліо Степана Розе! 👋",
    description: "Дозвольте показати вам усе. Цей короткий тур допоможе відкрити всі функції.",
    closeButton: "Пропустити",
    nextButton: "Далі →",
    prevButton: "← Назад",
    doneButton: "Зрозуміло! ✓",
    steps: [
      {
        element: "#hero-section",
        popover: {
          title: "🚀 Вітаю!",
          description: "Я Степан Розе, Full-Stack розробник, що спеціалізується на React, TypeScript і сучасних веб-технологіях.",
        }
      },
      {
        element: "#beta-banner",
        popover: {
          title: "✈️ Бета Режим",
          description: "Це портфоліо в BETA - як табло в аеропорту, ви побачите оновлення в реальному часі та нові функції!",
        }
      },
      {
        element: "#theme-toggle",
        popover: {
          title: "🎨 Перемикач Теми",
          description: "Перемикайтесь між темною і світлою темами. Сайт запам'ятає ваші налаштування!",
        }
      },
      {
        element: "#language-selector",
        popover: {
          title: "🌍 Мультимовність",
          description: "Перемикайтесь між англійською, українською, голландською, арабською та іспанською мовами!",
        }
      },
      {
        element: "#projects-section",
        popover: {
          title: "💼 Галерея Проектів",
          description: "Переглядайте мої проекти! На МОБІЛЬНОМУ: Торкніться будь-якої картки для деталей. На ДЕСКТОПІ: Наведіть курсор для ефектів, клікніть для відкриття. Кожен проект показує технології, метрики та демо!",
        }
      },
      {
        element: "#services-section",
        popover: {
          title: "🛠️ Послуги",
          description: "Натискайте на картки послуг щоб побачити деталі. Свайпайте для перегляду всіх послуг!",
        }
      },
      {
        element: "#book-call-button",
        popover: {
          title: "📞 Забронювати Дзвінок",
          description: "Готові працювати разом? Заплануйте безкоштовну консультацію прямо звідси!",
        }
      },
      {
        element: "#contact-section",
        popover: {
          title: "📧 Зв'язатися",
          description: "Надішліть мені повідомлення або зв'яжіться через LinkedIn, GitHub або Upwork. Відповідаю протягом 24 годин!",
        }
      }
    ]
  },
  nl: {
    buttonText: "Start Rondleiding",
    buttonSubtext: "Leer hoe te navigeren",
    title: "Welkom bij het Portfolio van Stepan Roze! 👋",
    description: "Laat me je rondleiden. Deze snelle tour helpt je alle functies te ontdekken.",
    closeButton: "Tour Overslaan",
    nextButton: "Volgende →",
    prevButton: "← Terug",
    doneButton: "Begrepen! ✓",
    steps: [
      {
        element: "#hero-section",
        popover: {
          title: "🚀 Welkom!",
          description: "Ik ben Stepan Roze, een Full-Stack Developer gespecialiseerd in React, TypeScript & moderne webtechnologieën.",
        }
      },
      {
        element: "#beta-banner",
        popover: {
          title: "✈️ Beta Modus",
          description: "Dit portfolio is in BETA - zoals een luchthavenbord zie je real-time updates en nieuwe functies!",
        }
      },
      {
        element: "#theme-toggle",
        popover: {
          title: "🎨 Thema Schakelaar",
          description: "Schakel tussen Donker en Licht thema. De site onthoudt je voorkeur!",
        }
      },
      {
        element: "#language-selector",
        popover: {
          title: "🌍 Meertalig",
          description: "Schakel tussen Engels, Oekraïens, Nederlands, Arabisch en Spaans. Volledige lokalisatie!",
        }
      },
      {
        element: "#projects-section",
        popover: {
          title: "💼 Projecten Galerij",
          description: "Bekijk mijn projecten! Op MOBIEL: Tik op een kaart voor details. Op DESKTOP: Hover voor effecten, klik om te openen. Elk project toont tech stack, metrics en live demo's!",
        }
      },
      {
        element: "#services-section",
        popover: {
          title: "🛠️ Diensten",
          description: "Tik of klik op servicekaarten voor details. Swipe om alle beschikbare diensten te bekijken!",
        }
      },
      {
        element: "#book-call-button",
        popover: {
          title: "📞 Boek een Gesprek",
          description: "Klaar om samen te werken? Plan hier direct een gratis consultatie!",
        }
      },
      {
        element: "#contact-section",
        popover: {
          title: "📧 Neem Contact Op",
          description: "Stuur me een bericht of maak contact via LinkedIn, GitHub of Upwork. Ik reageer binnen 24 uur!",
        }
      }
    ]
  },
  ar: {
    buttonText: "ابدأ الجولة",
    buttonSubtext: "تعلم كيفية التنقل",
    title: "مرحباً بك في محفظة ستيبان روز! 👋",
    description: "دعني أريك المكان. ستساعدك هذه الجولة السريعة في اكتشاف جميع الميزات.",
    closeButton: "تخطي الجولة",
    nextButton: "التالي ←",
    prevButton: "→ السابق",
    doneButton: "فهمت! ✓",
    steps: [
      {
        element: "#hero-section",
        popover: {
          title: "🚀 مرحباً!",
          description: "أنا ستيبان روز، مطور Full-Stack متخصص في React و TypeScript وتقنيات الويب الحديثة.",
        }
      },
      {
        element: "#beta-banner",
        popover: {
          title: "✈️ وضع البيتا",
          description: "هذه المحفظة في وضع BETA - مثل لوحة المغادرة في المطار، سترى التحديثات والميزات الجديدة!",
        }
      },
      {
        element: "#theme-toggle",
        popover: {
          title: "🎨 مبدل المظهر",
          description: "التبديل بين المظهر الداكن والفاتح. يتذكر الموقع تفضيلاتك!",
        }
      },
      {
        element: "#language-selector",
        popover: {
          title: "🌍 متعدد اللغات",
          description: "التبديل بين الإنجليزية والأوكرانية والهولندية والعربية والإسبانية!",
        }
      },
      {
        element: "#projects-section",
        popover: {
          title: "💼 معرض المشاريع",
          description: "تصفح مشاريعي! على الجوال: المس أي بطاقة للحصول على التفاصيل. على سطح المكتب: مرر للحصول على التأثيرات، انقر للفتح. كل مشروع يعرض التقنيات والمقاييس والعروض التوضيحية!",
        }
      },
      {
        element: "#services-section",
        popover: {
          title: "🛠️ الخدمات",
          description: "انقر على بطاقات الخدمة لرؤية التفاصيل. اسحب لتصفح جميع الخدمات المتاحة!",
        }
      },
      {
        element: "#book-call-button",
        popover: {
          title: "📞 حجز مكالمة",
          description: "هل أنت مستعد للعمل معاً؟ احجز استشارة مجانية من هنا مباشرة!",
        }
      },
      {
        element: "#contact-section",
        popover: {
          title: "📧 تواصل معي",
          description: "أرسل لي رسالة أو تواصل عبر LinkedIn أو GitHub أو Upwork. أرد خلال 24 ساعة!",
        }
      }
    ]
  },
  es: {
    buttonText: "Iniciar Tour",
    buttonSubtext: "Aprende a navegar",
    title: "¡Bienvenido al Portfolio de Stepan Roze! 👋",
    description: "Déjame mostrarte todo. Este tour rápido te ayudará a descubrir todas las funciones.",
    closeButton: "Saltar Tour",
    nextButton: "Siguiente →",
    prevButton: "← Atrás",
    doneButton: "¡Entendido! ✓",
    steps: [
      {
        element: "#hero-section",
        popover: {
          title: "🚀 ¡Bienvenido!",
          description: "Soy Stepan Roze, un desarrollador Full-Stack especializado en React, TypeScript y tecnologías web modernas.",
        }
      },
      {
        element: "#beta-banner",
        popover: {
          title: "✈️ Modo Beta",
          description: "Este portfolio está en BETA - como un tablero de aeropuerto, verás actualizaciones en tiempo real!",
        }
      },
      {
        element: "#theme-toggle",
        popover: {
          title: "🎨 Cambio de Tema",
          description: "Alterna entre temas Oscuro y Claro. ¡El sitio recuerda tu preferencia!",
        }
      },
      {
        element: "#language-selector",
        popover: {
          title: "🌍 Multilingüe",
          description: "Cambia entre inglés, ucraniano, holandés, árabe y español. ¡Soporte completo de localización!",
        }
      },
      {
        element: "#projects-section",
        popover: {
          title: "💼 Galería de Proyectos",
          description: "¡Explora mis proyectos! En MÓVIL: Toca cualquier tarjeta para detalles. En ESCRITORIO: Pasa el cursor para efectos, haz clic para abrir. ¡Cada proyecto muestra tecnologías, métricas y demos en vivo!",
        }
      },
      {
        element: "#services-section",
        popover: {
          title: "🛠️ Servicios",
          description: "Toca o haz clic en las tarjetas de servicio para ver detalles. ¡Desliza para ver todos!",
        }
      },
      {
        element: "#book-call-button",
        popover: {
          title: "📞 Reservar una Llamada",
          description: "¿Listo para trabajar juntos? ¡Programa una consulta gratuita desde aquí!",
        }
      },
      {
        element: "#contact-section",
        popover: {
          title: "📧 Contáctame",
          description: "Envíame un mensaje o conéctate vía LinkedIn, GitHub o Upwork. ¡Respondo en 24 horas!",
        }
      }
    ]
  }
};

export function SiteTour() {
  const { language } = useLanguage();
  const [showButton, setShowButton] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  const t = tourTranslations[language as keyof typeof tourTranslations] || tourTranslations.en;

  useEffect(() => {
    // Check if user has seen the tour before
    const tourSeen = localStorage.getItem('siteTourCompleted');
    if (!tourSeen) {
      // Auto-start tour after 2 seconds for new visitors
      const timer = setTimeout(() => {
        startTour();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setHasSeenTour(true);
      setShowButton(true);
    }
  }, []);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      progressText: "{{current}} / {{total}}",
      nextBtnText: t.nextButton,
      prevBtnText: t.prevButton,
      doneBtnText: t.doneButton,
      showButtons: ['next', 'previous', 'close'],
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.3)',
      overlayOpacity: 0.3,
      smoothScroll: true,
      animate: true,
      
      onDestroyStarted: () => {
        // Mark tour as completed
        localStorage.setItem('siteTourCompleted', 'true');
        setHasSeenTour(true);
        setShowButton(true);
        driverObj.destroy();
      },
      
      steps: t.steps.map((step, index) => ({
        element: step.element,
        popover: {
          ...step.popover,
          side: index === 0 ? "bottom" : "left",
          align: "start",
          onNextClick: () => {
            // Smooth scroll to next element
            const nextStep = t.steps[index + 1];
            if (nextStep) {
              const element = document.querySelector(nextStep.element);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }
            driverObj.moveNext();
          },
          onPrevClick: () => {
            driverObj.movePrevious();
          },
        }
      }))
    });

    driverObj.drive();
  };

  const resetTour = () => {
    localStorage.removeItem('siteTourCompleted');
    setHasSeenTour(false);
    startTour();
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetTour}
          className="fixed bottom-6 left-6 z-[100] flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00d9ff] to-purple-500 text-white rounded-full font-bold shadow-[0_0_40px_rgba(0,217,255,0.6)] hover:shadow-[0_0_60px_rgba(0,217,255,0.8)] transition-all group"
          aria-label="Site Tour"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Compass className="w-5 h-5" />
          </motion.div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-bold">{t.buttonText}</span>
            <span className="text-xs opacity-90">{t.buttonSubtext}</span>
          </div>
          
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#00d9ff]"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}