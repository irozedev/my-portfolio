import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/language-context";
import { Compass, X, ArrowRight, ArrowLeft, Bot, Sparkles, Zap, Target, Rocket, Code, MessageSquare, Phone, Shield, Globe, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  tip?: string;
  icon: any;
  highlight: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
}

export function SiteTour() {
  const { language } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [steps, setSteps] = useState<TourStep[]>([]);

  const getTourSteps = () => {
    const translations: Record<string, any> = {
      en: {
        welcome: "Hi! I'm Roze Bot 🤖",
        intro: "Let me show you around this portfolio!",
        steps: [
          {
            id: "beta-banner",
            icon: Zap,
            title: "🚨 BETA Banner",
            desc: "This site is in BETA testing! Inspired by airport departure boards with that retro technical vibe.",
            tip: "Pro tip: All page offsets are calculated from this 64px banner height!"
          },
          {
            id: "navigation",
            icon: Target,
            title: "🧭 Navigation Bar",
            desc: "Quick access to all sections: Home, About, Experience, Projects, Services, Contact. Plus theme toggle and language selector!",
            tip: "The navbar is sticky and follows you as you scroll."
          },
          {
            id: "theme-toggle",
            icon: Sparkles,
            title: "🎨 Theme Switcher",
            desc: "Toggle between Dark & Light themes. The entire site adapts instantly with smooth transitions and glassmorphism effects!",
            tip: "Dark theme (#0a0a0a) is optimized for focus, Light for readability."
          },
          {
            id: "language-selector",
            icon: Globe,
            title: "🌍 Multi-Language Support",
            desc: "Choose from 5 languages: English, Ukrainian, Dutch, Arabic, and Spanish. Full i18n support with RTL for Arabic!",
            tip: "The site remembers your language preference in localStorage."
          },
          {
            id: "hero-section",
            icon: Rocket,
            title: "👋 Hero Section",
            desc: "Meet Stepan Roze - Full-Stack Developer with 10+ years of experience. Features animated stats, CTA buttons, and dynamic content!",
            tip: "Stats (150+ projects, 50+ clients) are calculated from real data in stats-calculator.ts"
          },
          {
            id: "about",
            icon: Code,
            title: "👨‍💻 About Me",
            desc: "Learn about my background, passion for clean code, AI integration expertise, and what makes me unique as a developer.",
            tip: "Scroll to see animated skill bars for React, Node.js, TypeScript, and more!"
          },
          {
            id: "experience",
            icon: TrendingUp,
            title: "💼 Experience Timeline",
            desc: "My career journey: Freelancing (2015-2019) → Ronis (2019-2022) → eConsulting (2022-2024) → AI Learning & Upskilling (2025)!",
            tip: "Click on each role to expand and see achievements, technologies used, and project highlights."
          },
          {
            id: "projects",
            icon: Rocket,
            title: "🚀 Projects Portfolio",
            desc: "Browse 150+ completed projects! Click on project cards to see detailed views with images, descriptions, tech stack, and live links.",
            tip: "Projects can be filtered by category (Web, Mobile, AI) and sorted by date or popularity."
          },
          {
            id: "services-section",
            icon: Target,
            title: "⚡ Services Slider",
            desc: "Explore 6+ services I offer: Full-Stack Web Development, E-Commerce Solutions, AI Chatbots, Mobile Apps, and more!",
            tip: "Click on a service card to select it - this will pre-fill the contact form below!"
          },
          {
            id: "contact-section",
            icon: MessageSquare,
            title: "📧 Contact Form",
            desc: "Get in touch! Fill out the form and I'll respond within 24 hours. Form submissions go securely to my server via API.",
            tip: "You can also reach me directly via LinkedIn, GitHub, Email, or Upwork - all links below!"
          },
          {
            id: "book-call-button",
            icon: Phone,
            title: "📞 Book a Call",
            desc: "Schedule a FREE 30-minute consultation! Pick your timezone, preferred date, and time - syncs automatically with my calendar.",
            tip: "No login required - guest booking is enabled for everyone!"
          },
          {
            id: "footer",
            icon: Shield,
            title: "📄 Footer & Legal",
            desc: "Quick links to social media, legal pages (Privacy Policy, Terms of Service, Cookie Policy), and GDPR compliance info.",
            tip: "All legal pages are auto-generated and GDPR-compliant for EU users."
          }
        ],
        button: "Site Tour",
        buttonSub: "Start guided tour",
        skip: "Skip Tour",
        next: "Next Step",
        prev: "Go Back",
        finish: "Finish Tour",
        stepOf: "Step {{current}} of {{total}}"
      },
      uk: {
        welcome: "Привіт! Я Roze Bot 🤖",
        intro: "Дозволь показати тобі це портфоліо!",
        steps: [
          {
            id: "beta-banner",
            icon: Zap,
            title: "🚨 BETA Банер",
            desc: "Сайт в BETA тестуванні! Стиль натхненний аеропортними табло з ретро технічним виглядом.",
            tip: "Порада: Всі відступи сторінки розраховуються від висоти банера 64px!"
          },
          {
            id: "navigation",
            icon: Target,
            title: "🧭 Навігація",
            desc: "Швидкий доступ до всіх секцій: Головна, Про мене, Досвід, Проекти, Послуги, Контакти. Плюс перемикач теми та мов!",
            tip: "Навігація липка та слідує за тобою при скролі."
          },
          {
            id: "theme-toggle",
            icon: Sparkles,
            title: "🎨 Перемикач теми",
            desc: "Переключайся між темною та світлою темами. Весь сайт адаптується миттєво з glassmorphism ефектами!",
            tip: "Темна тема (#0a0a0a) оптимізована для фокусу, світла для читабельності."
          },
          {
            id: "language-selector",
            icon: Globe,
            title: "🌍 Багатомовність",
            desc: "Обирай з 5 мов: англійська, українська, голландська, арабська та іспанська. Повна підтримка i18n з RTL для арабської!",
            tip: "Сайт запам'ятовує твою мову в localStorage."
          },
          {
            id: "hero-section",
            icon: Rocket,
            title: "👋 Головна секція",
            desc: "Знайомся - Stepan Roze, Full-Stack розробник з 10+ роками досвіду. Анімована статистика, CTA кнопки, динамічний контент!",
            tip: "Статистика (150+ проектів, 50+ клієнтів) розраховується з реальних даних."
          },
          {
            id: "about",
            icon: Code,
            title: "👨‍💻 Про мене",
            desc: "Дізнайся про мій бекграунд, любов до чистого коду, експертизу в AI інтеграції та що робить мене унікальним.",
            tip: "Прокрути щоб побачити анімовані скіл-бари для React, Node.js, TypeScript!"
          },
          {
            id: "experience",
            icon: TrendingUp,
            title: "💼 Досвід роботи",
            desc: "Моя кар'єра: Фріланс (2015-2019) → Ronis (2019-2022) → eConsulting (2022-2024) → AI навчання (2025)!",
            tip: "Клікай на кожну роль щоб розгорнути досягнення, технології та проекти."
          },
          {
            id: "projects",
            icon: Rocket,
            title: "🚀 Проекти",
            desc: "Переглядай 150+ завершених проектів! Клікай на картки для деталей з зображеннями, описом, стеком та посиланнями.",
            tip: "Проекти можна фільтрувати (Web, Mobile, AI) та сортувати."
          },
          {
            id: "services-section",
            icon: Target,
            title: "⚡ Послуги",
            desc: "Досліджуй 6+ послуг: Full-Stack розробка, E-Commerce, AI чатботи, мобільні додатки та інше!",
            tip: "Клік на послугу автоматично заповнює форму контакту нижче!"
          },
          {
            id: "contact-section",
            icon: MessageSquare,
            title: "📧 Контактна форма",
            desc: "Зв'яжись зі мною! Заповни форму і я відповім протягом 24 годин. Дані йдуть через безпечний API.",
            tip: "Також можеш написати напряму через LinkedIn, GitHub, Email або Upwork!"
          },
          {
            id: "book-call-button",
            icon: Phone,
            title: "📞 Забронювати дзвінок",
            desc: "Заплануй БЕЗКОШТОВНУ 30-хв консультацію! Обери часовий пояс, дату та час - синхронізується з календарем.",
            tip: "Вхід не потрібен - гості можуть бронювати!"
          },
          {
            id: "footer",
            icon: Shield,
            title: "📄 Футер та Legal",
            desc: "Швидкі посилання на соцмережі, юридичні сторінки (Privacy, Terms, Cookies) та GDPR відповідність.",
            tip: "Всі legal сторінки автогенеровані та GDPR-сумісні."
          }
        ],
        button: "Тур сайту",
        buttonSub: "Почати огляд",
        skip: "Пропустити",
        next: "Далі",
        prev: "Назад",
        finish: "Завершити",
        stepOf: "Крок {{current}} з {{total}}"
      },
      nl: {
        welcome: "Hoi! Ik ben Roze Bot 🤖",
        intro: "Laat me je rondleiden door dit portfolio!",
        steps: [
          {
            id: "beta-banner",
            icon: Zap,
            title: "🚨 BETA Banner",
            desc: "Deze site is in BETA testing! Geïnspireerd door luchthaven vertrekborden met een retro technische sfeer.",
            tip: "Pro tip: Alle pagina offsets worden berekend vanaf deze 64px banner hoogte!"
          },
          {
            id: "navigation",
            icon: Target,
            title: "🧭 Navigatie",
            desc: "Snelle toegang tot alle secties: Home, Over, Ervaring, Projecten, Diensten, Contact. Plus thema en taal kiezers!",
            tip: "De navbar blijft plakken en volgt je tijdens het scrollen."
          },
          {
            id: "theme-toggle",
            icon: Sparkles,
            title: "🎨 Thema schakelaar",
            desc: "Wissel tussen donker en licht thema. De hele site past zich direct aan met glassmorphism effecten!",
            tip: "Donker thema (#0a0a0a) is geoptimaliseerd voor focus, licht voor leesbaarheid."
          },
          {
            id: "language-selector",
            icon: Globe,
            title: "🌍 Meertalig",
            desc: "Kies uit 5 talen: Engels, Oekraïens, Nederlands, Arabisch en Spaans. Volledige i18n ondersteuning met RTL voor Arabisch!",
            tip: "De site onthoudt je taalvoorkeur in localStorage."
          },
          {
            id: "hero-section",
            icon: Rocket,
            title: "👋 Hero sectie",
            desc: "Ontmoet Stepan Roze - Full-Stack Developer met 10+ jaar ervaring. Geanimeerde stats, CTA knoppen en dynamische content!",
            tip: "Stats (150+ projecten, 50+ klanten) worden berekend uit echte data."
          },
          {
            id: "about",
            icon: Code,
            title: "👨‍💻 Over mij",
            desc: "Leer over mijn achtergrond, passie voor clean code, AI expertise en wat me uniek maakt als developer.",
            tip: "Scroll om geanimeerde skill bars te zien voor React, Node.js, TypeScript!"
          },
          {
            id: "experience",
            icon: TrendingUp,
            title: "💼 Ervaring Timeline",
            desc: "Mijn carrière: Freelance (2015-2019) → Ronis (2019-2022) → eConsulting (2022-2024) → AI Learning (2025)!",
            tip: "Klik op elke rol om prestaties, technologieën en projecten te zien."
          },
          {
            id: "projects",
            icon: Rocket,
            title: "🚀 Projecten",
            desc: "Bekijk 150+ voltooide projecten! Klik op kaarten voor details met afbeeldingen, beschrijvingen en links.",
            tip: "Projecten kunnen gefilterd (Web, Mobile, AI) en gesorteerd worden."
          },
          {
            id: "services-section",
            icon: Target,
            title: "⚡ Diensten Slider",
            desc: "Verken 6+ diensten: Full-Stack ontwikkeling, E-Commerce, AI Chatbots, Mobile Apps en meer!",
            tip: "Klik op een dienst om het contactformulier automatisch in te vullen!"
          },
          {
            id: "contact-section",
            icon: MessageSquare,
            title: "📧 Contact formulier",
            desc: "Neem contact op! Vul het formulier in en ik reageer binnen 24 uur. Berichten gaan veilig via API.",
            tip: "Je kunt me ook direct bereiken via LinkedIn, GitHub, Email of Upwork!"
          },
          {
            id: "book-call-button",
            icon: Phone,
            title: "📞 Gesprek boeken",
            desc: "Plan een GRATIS 30-min consultatie! Kies je tijdzone, datum en tijd - synchroniseert automatisch.",
            tip: "Geen login vereist - gasten kunnen boeken!"
          },
          {
            id: "footer",
            icon: Shield,
            title: "📄 Footer & Legal",
            desc: "Snelle links naar sociale media, juridische pagina's (Privacy, Terms, Cookies) en GDPR naleving.",
            tip: "Alle juridische pagina's zijn automatisch gegenereerd en GDPR-conform."
          }
        ],
        button: "Site rondleiding",
        buttonSub: "Start de tour",
        skip: "Overslaan",
        next: "Volgende",
        prev: "Vorige",
        finish: "Voltooien",
        stepOf: "Stap {{current}} van {{total}}"
      },
      ar: {
        welcome: "مرحبا! أنا Roze Bot 🤖",
        intro: "دعني أريك هذا المعرض!",
        steps: [
          {
            id: "beta-banner",
            icon: Zap,
            title: "🚨 شريط BETA",
            desc: "الموقع في مرحلة التجريب! مستوحى من لوحات المطار مع طابع تقني قديم.",
            tip: "نصيحة: جميع الإزاحات محسوبة من ارتفاع الشريط 64px!"
          },
          {
            id: "navigation",
            icon: Target,
            title: "🧭 شريط التنقل",
            desc: "وصول سريع لجميع الأقسام: الرئيسية، عني، الخبرة، المشاريع، الخدمات، الاتصال. بالإضافة إلى مبدل السمة واللغة!",
            tip: "شريط التنقل ثابت ويتبعك أثناء التمرير."
          },
          {
            id: "theme-toggle",
            icon: Sparkles,
            title: "🎨 مبدل المظهر",
            desc: "التبديل بين المظهر الداكن والفاتح. الموقع يتكيف فورا مع تأثيرات glassmorphism!",
            tip: "المظهر الداكن (#0a0a0a) للتركيز، الفاتح للقراءة."
          },
          {
            id: "language-selector",
            icon: Globe,
            title: "🌍 متعدد اللغات",
            desc: "اختر من 5 لغات: الإنجليزية، الأوكرانية، الهولندية، العربية والإسبانية. دعم كامل مع RTL للعربية!",
            tip: "الموقع يتذكر لغتك المفضلة."
          },
          {
            id: "hero-section",
            icon: Rocket,
            title: "👋 القسم الرئيسي",
            desc: "تعرف على Stepan Roze - مطور Full-Stack بخبرة 10+ سنوات. إحصائيات متحركة، أزرار CTA ومحتوى ديناميكي!",
            tip: "الإحصائيات (150+ مشروع، 50+ عميل) محسوبة من بيانات حقيقية."
          },
          {
            id: "about",
            icon: Code,
            title: "👨‍💻 عني",
            desc: "تعرف على خلفيتي، شغفي بالكود النظيف، خبرتي في الذكاء الاصطناعي وما يجعلني فريدا.",
            tip: "قم بالتمرير لرؤية أشرطة المهارات لـ React و Node.js و TypeScript!"
          },
          {
            id: "experience",
            icon: TrendingUp,
            title: "💼 خط الخبرة",
            desc: "مسيرتي: مستقل (2015-2019) → Ronis (2019-2022) → eConsulting (2022-2024) → تعلم AI (2025)!",
            tip: "انقر على كل دور لرؤية الإنجازات والتقنيات والمشاريع."
          },
          {
            id: "projects",
            icon: Rocket,
            title: "🚀 المشاريع",
            desc: "تصفح 150+ مشروع مكتمل! انقر على البطاقات للحصول على التفاصيل مع الصور والأوصاف والروابط.",
            tip: "يمكن تصفية المشاريع (Web, Mobile, AI) وترتيبها."
          },
          {
            id: "services-section",
            icon: Target,
            title: "⚡ الخدمات",
            desc: "استكشف 6+ خدمات: تطوير Full-Stack، التجارة الإلكترونية، روبوتات AI، تطبيقات الجوال وأكثر!",
            tip: "النقر على خدمة يملأ نموذج الاتصال تلقائيا!"
          },
          {
            id: "contact-section",
            icon: MessageSquare,
            title: "📧 نموذج الاتصال",
            desc: "تواصل معي! املأ النموذج وسأرد خلال 24 ساعة. البيانات تذهب بأمان عبر API.",
            tip: "يمكنك أيضا التواصل مباشرة عبر LinkedIn أو GitHub أو Email أو Upwork!"
          },
          {
            id: "book-call-button",
            icon: Phone,
            title: "📞 حجز مكالمة",
            desc: "جدول استشارة مجانية 30 دقيقة! اختر المنطقة الزمنية والتاريخ والوقت - يتم المزامنة تلقائيا.",
            tip: "لا حاجة لتسجيل الدخول - الضيوف يمكنهم الحجز!"
          },
          {
            id: "footer",
            icon: Shield,
            title: "📄 التذييل والقانوني",
            desc: "روابط سريعة لوسائل التواصل، الصفحات القانونية (الخصوصية، الشروط، الكوكيز) والامتثال لـ GDPR.",
            tip: "جميع الصفحات القانونية متوافقة مع GDPR."
          }
        ],
        button: "جولة الموقع",
        buttonSub: "ابدأ الجولة",
        skip: "تخطي",
        next: "التالي",
        prev: "السابق",
        finish: "إنهاء",
        stepOf: "خطوة {{current}} من {{total}}"
      },
      es: {
        welcome: "¡Hola! Soy Roze Bot 🤖",
        intro: "¡Déjame mostrarte este portafolio!",
        steps: [
          {
            id: "beta-banner",
            icon: Zap,
            title: "🚨 Banner BETA",
            desc: "¡El sitio está en pruebas BETA! Inspirado en tableros de aeropuerto con vibra técnica retro.",
            tip: "Consejo: ¡Todos los offsets se calculan desde esta altura de banner de 64px!"
          },
          {
            id: "navigation",
            icon: Target,
            title: "🧭 Navegación",
            desc: "Acceso rápido a todas las secciones: Inicio, Sobre mí, Experiencia, Proyectos, Servicios, Contacto. ¡Más tema e idioma!",
            tip: "La navbar es pegajosa y te sigue mientras desplazas."
          },
          {
            id: "theme-toggle",
            icon: Sparkles,
            title: "🎨 Cambiar tema",
            desc: "Alterna entre tema oscuro y claro. ¡Todo el sitio se adapta con efectos glassmorphism!",
            tip: "Tema oscuro (#0a0a0a) optimizado para enfoque, claro para legibilidad."
          },
          {
            id: "language-selector",
            icon: Globe,
            title: "🌍 Multi-idioma",
            desc: "Elige entre 5 idiomas: inglés, ucraniano, holandés, árabe y español. Soporte completo i18n con RTL para árabe!",
            tip: "El sitio recuerda tu preferencia de idioma en localStorage."
          },
          {
            id: "hero-section",
            icon: Rocket,
            title: "👋 Sección Hero",
            desc: "Conoce a Stepan Roze - Desarrollador Full-Stack con 10+ años de experiencia. ¡Estadísticas animadas, botones CTA y contenido dinámico!",
            tip: "Las estadísticas (150+ proyectos, 50+ clientes) se calculan de datos reales."
          },
          {
            id: "about",
            icon: Code,
            title: "👨‍💻 Sobre mí",
            desc: "Aprende sobre mi historial, pasión por código limpio, experiencia en AI y qué me hace único como desarrollador.",
            tip: "¡Desplázate para ver barras de habilidades animadas para React, Node.js, TypeScript!"
          },
          {
            id: "experience",
            icon: TrendingUp,
            title: "💼 Línea de Experiencia",
            desc: "Mi carrera: Freelance (2015-2019) → Ronis (2019-2022) → eConsulting (2022-2024) → Aprendizaje AI (2025)!",
            tip: "Haz clic en cada rol para expandir logros, tecnologías y proyectos."
          },
          {
            id: "projects",
            icon: Rocket,
            title: "🚀 Proyectos",
            desc: "¡Navega 150+ proyectos completados! Haz clic en tarjetas para detalles con imágenes, descripciones y enlaces.",
            tip: "Los proyectos pueden filtrarse (Web, Mobile, AI) y ordenarse."
          },
          {
            id: "services-section",
            icon: Target,
            title: "⚡ Slider de Servicios",
            desc: "Explora 6+ servicios: Desarrollo Full-Stack, E-Commerce, Chatbots AI, Apps Móviles, ¡y más!",
            tip: "¡Hacer clic en un servicio pre-completa el formulario de contacto!"
          },
          {
            id: "contact-section",
            icon: MessageSquare,
            title: "📧 Formulario de Contacto",
            desc: "¡Ponte en contacto! Llena el formulario y responderé en 24 horas. Los envíos van de forma segura vía API.",
            tip: "¡También puedes contactarme directamente por LinkedIn, GitHub, Email o Upwork!"
          },
          {
            id: "book-call-button",
            icon: Phone,
            title: "📞 Reservar llamada",
            desc: "¡Programa una consulta GRATUITA de 30 min! Elige zona horaria, fecha y hora - se sincroniza automáticamente.",
            tip: "¡No se requiere inicio de sesión - los invitados pueden reservar!"
          },
          {
            id: "footer",
            icon: Shield,
            title: "📄 Footer y Legal",
            desc: "Enlaces rápidos a redes sociales, páginas legales (Privacidad, Términos, Cookies) y cumplimiento GDPR.",
            tip: "Todas las páginas legales son auto-generadas y conformes con GDPR."
          }
        ],
        button: "Tour del sitio",
        buttonSub: "Comenzar tour",
        skip: "Saltar",
        next: "Siguiente",
        prev: "Anterior",
        finish: "Finalizar",
        stepOf: "Paso {{current}} de {{total}}"
      }
    };

    return translations[language] || translations.en;
  };

  const calculateHighlight = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      width: rect.width,
      height: rect.height
    };
  };

  const startTour = () => {
    const t = getTourSteps();
    
    // Build steps with highlights
    const tourSteps: TourStep[] = t.steps.map((step: any) => ({
      id: step.id,
      title: step.title,
      description: step.desc,
      tip: step.tip,
      icon: step.icon,
      highlight: calculateHighlight(step.id)
    }));

    // Filter out missing elements but keep tour going
    const validSteps = tourSteps.filter(step => step.highlight !== null);
    
    if (validSteps.length === 0) {
      console.warn('[Site Tour] No elements found. Showing button.');
      setShowButton(true);
      return;
    }

    setSteps(validSteps);
    setCurrentStep(0);
    setIsActive(true);
    
    // Scroll to first element
    setTimeout(() => {
      const firstElement = document.getElementById(validSteps[0].id);
      if (firstElement) {
        const offset = 120;
        const elementPosition = firstElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        
        // CRITICAL: Recalculate highlights AFTER scroll completes
        setTimeout(() => {
          const recalculatedSteps = validSteps.map(step => ({
            ...step,
            highlight: calculateHighlight(step.id)
          }));
          setSteps(recalculatedSteps);
        }, 600); // Wait for smooth scroll to finish
      }
    }, 300);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      
      setTimeout(() => {
        const nextElement = document.getElementById(steps[nextStepIndex].id);
        if (nextElement) {
          const offset = 120;
          const elementPosition = nextElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          
          // Recalculate highlights after scroll - ONLY if tour is still active
          setTimeout(() => {
            setSteps(prevSteps => {
              if (prevSteps.length === 0) return prevSteps;
              return prevSteps.map(step => ({
                ...step,
                highlight: calculateHighlight(step.id)
              }));
            });
          }, 600);
        }
      }, 100);
    } else {
      // Last step - close IMMEDIATELY without scrolling
      finishTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      
      setTimeout(() => {
        const prevElement = document.getElementById(steps[prevStepIndex].id);
        if (prevElement) {
          const offset = 120;
          const elementPosition = prevElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          
          // Recalculate highlights after scroll - ONLY if tour is still active
          setTimeout(() => {
            setSteps(prevSteps => {
              if (prevSteps.length === 0) return prevSteps;
              return prevSteps.map(step => ({
                ...step,
                highlight: calculateHighlight(step.id)
              }));
            });
          }, 600);
        }
      }, 100);
    }
  };

  const finishTour = () => {
    // Close tour INSTANTLY - clear state first to prevent any animations
    setIsActive(false);
    setCurrentStep(0);
    setSteps([]);
    localStorage.setItem('siteTourCompleted', 'true');
    
    // Show button after a tiny delay to ensure overlay is gone
    setTimeout(() => {
      setShowButton(true);
    }, 50);
  };

  // Auto-start tour on first visit
  useEffect(() => {
    const tourCompleted = localStorage.getItem('siteTourCompleted');
    if (tourCompleted) {
      setShowButton(true);
      return;
    }

    const timer = setTimeout(() => {
      startTour();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Update highlights on resize
  useEffect(() => {
    if (!isActive || steps.length === 0) return;

    const handleResize = () => {
      const updatedSteps = steps.map(step => ({
        ...step,
        highlight: calculateHighlight(step.id)
      }));
      setSteps(updatedSteps);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive, steps]);

  const t = getTourSteps();
  const step = steps[currentStep];

  return (
    <>
      {/* TOUR BUTTON */}
      <AnimatePresence>
        {showButton && !isActive && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              localStorage.removeItem('siteTourCompleted');
              setShowButton(false);
              setTimeout(startTour, 300);
            }}
            className="fixed bottom-6 left-6 z-[100] flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#00d9ff] to-purple-500 text-white rounded-xl font-bold shadow-[0_0_30px_rgba(0,217,255,0.5)] hover:shadow-[0_0_40px_rgba(0,217,255,0.7)] transition-all font-mono text-sm"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Compass className="w-5 h-5" />
            </motion.div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-xs font-bold">{t.button}</span>
              <span className="text-[10px] opacity-90">{t.buttonSub}</span>
            </div>
            
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-white/50"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* TOUR OVERLAY */}
      <AnimatePresence>
        {isActive && step && step.highlight && (
          <>
            {/* SVG SPOTLIGHT OVERLAY - PROPER CUTOUT */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99998] pointer-events-none"
              style={{ isolation: 'isolate' }}
            >
              <svg
                width="100%"
                height="100%"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100vh',
                }}
              >
                <defs>
                  <mask id="spotlight-mask">
                    {/* White = visible, Black = hidden */}
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    {/* Cut out the highlighted element - DON'T subtract scrollY here because SVG is fixed */}
                    <rect
                      x={step.highlight.left - 16}
                      y={step.highlight.top - window.pageYOffset - 16}
                      width={step.highlight.width + 32}
                      height={step.highlight.height + 32}
                      fill="black"
                      rx="12"
                    />
                  </mask>
                  
                  {/* Radial gradient for glow inside cutout */}
                  <radialGradient id="spotlight-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(0, 217, 255, 0.15)" />
                    <stop offset="50%" stopColor="rgba(0, 217, 255, 0.08)" />
                    <stop offset="100%" stopColor="rgba(0, 217, 255, 0)" />
                  </radialGradient>
                </defs>
                
                {/* Dark overlay with cutout */}
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="rgba(0, 0, 0, 0.92)"
                  mask="url(#spotlight-mask)"
                />
                
                {/* Light glow INSIDE the cutout area to make element visible */}
                <rect
                  x={step.highlight.left - 16}
                  y={step.highlight.top - window.pageYOffset - 16}
                  width={step.highlight.width + 32}
                  height={step.highlight.height + 32}
                  fill="url(#spotlight-glow)"
                  rx="12"
                  style={{ mixBlendMode: 'screen' }}
                />
                
                {/* Bright spotlight effect around edges */}
                <rect
                  x={step.highlight.left - 20}
                  y={step.highlight.top - window.pageYOffset - 20}
                  width={step.highlight.width + 40}
                  height={step.highlight.height + 40}
                  fill="none"
                  stroke="rgba(0, 217, 255, 0.3)"
                  strokeWidth="8"
                  rx="14"
                  style={{ filter: 'blur(12px)' }}
                />
              </svg>
            </motion.div>

            {/* CYAN BORDER AROUND ELEMENT */}
            <motion.div
              className="fixed z-[99999] pointer-events-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                top: step.highlight.top - window.pageYOffset - 16,
                left: step.highlight.left - 16,
                width: step.highlight.width + 32,
                height: step.highlight.height + 32,
              }}
            >
              {/* Main border */}
              <motion.div
                className="absolute inset-0 rounded-xl border-[3px] border-[#00d9ff]"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0, 217, 255, 0.5), inset 0 0 20px rgba(0, 217, 255, 0.2)',
                    '0 0 40px rgba(0, 217, 255, 0.8), inset 0 0 30px rgba(0, 217, 255, 0.3)',
                    '0 0 20px rgba(0, 217, 255, 0.5), inset 0 0 20px rgba(0, 217, 255, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Corner indicators */}
              {[
                { top: -3, left: -3 },
                { top: -3, right: -3 },
                { bottom: -3, left: -3 },
                { bottom: -3, right: -3 }
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute w-5 h-5 bg-[#00d9ff] rounded-sm"
                  style={pos}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.15
                  }}
                />
              ))}

              {/* Scanning line effect */}
              <motion.div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent"
                animate={{
                  top: ['0%', '100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                style={{ opacity: 0.6 }}
              />
            </motion.div>

            {/* ROZE BOT CHARACTER + POPOVER */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed z-[100000] pointer-events-auto px-4 sm:px-0"
              style={{
                // Mobile: bottom of screen, Desktop: near element
                top: window.innerWidth < 640
                  ? 'auto'
                  : Math.min(
                      step.highlight.top - window.pageYOffset + step.highlight.height + 40,
                      window.innerHeight - 450
                    ),
                bottom: window.innerWidth < 640 ? '20px' : 'auto',
                left: window.innerWidth < 640
                  ? '0'
                  : Math.max(
                      20,
                      Math.min(
                        step.highlight.left + step.highlight.width / 2 - 200,
                        window.innerWidth - 420
                      )
                    ),
                right: window.innerWidth < 640 ? '0' : 'auto',
              }}
            >
              <div className="relative w-full sm:w-[400px] max-w-[calc(100vw-2rem)] mx-auto">
                {/* Roze Bot Avatar */}
                <motion.div
                  className="absolute -top-14 left-6 w-20 h-20 bg-gradient-to-br from-[#00d9ff] to-purple-500 rounded-full flex items-center justify-center border-4 border-[var(--bg-primary)] shadow-[0_0_40px_rgba(0,217,255,0.7)]"
                  animate={{
                    y: [0, -6, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                >
                  <Bot className="w-10 h-10 text-white" />
                  
                  {/* Thinking dots */}
                  <motion.div
                    className="absolute -top-3 -right-3 flex gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-[#00d9ff] rounded-full"
                        animate={{
                          y: [0, -10, 0],
                          opacity: [0.4, 1, 0.4]
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#00d9ff]"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.8, 0, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                </motion.div>

                {/* Popover Card */}
                <div className="relative bg-[var(--bg-primary)] border-2 border-[#00d9ff] rounded-2xl shadow-[0_20px_80px_rgba(0,217,255,0.6)] overflow-hidden">
                  {/* Gradient bg */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/10 via-transparent to-purple-500/10 pointer-events-none" />
                  
                  {/* Scanlines */}
                  <div className="absolute inset-0 pointer-events-none opacity-10">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="h-[2px] bg-[#00d9ff] mb-4" />
                    ))}
                  </div>

                  {/* Content */}
                  <div className="relative p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="px-2.5 py-1 bg-[#00d9ff]/20 border border-[#00d9ff]/40 rounded-md">
                            <span className="text-[10px] font-bold text-[#00d9ff] font-mono">
                              {t.stepOf.replace('{{current}}', String(currentStep + 1)).replace('{{total}}', String(steps.length))}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            {step.icon && <step.icon className="w-4 h-4 text-[#00d9ff]" />}
                          </motion.div>
                        </div>
                        <h3 className="text-base font-black text-[var(--text-primary)] font-mono mb-2 leading-tight">
                          {step.title}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                          {step.description}
                        </p>
                        
                        {/* Pro Tip */}
                        {step.tip && (
                          <div className="mt-3 p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-lg backdrop-blur-sm">
                            <div className="flex items-start gap-2">
                              <Zap className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-purple-200 leading-relaxed">
                                <span className="font-bold">Pro Tip:</span> {step.tip}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={finishTour}
                        className="ml-3 p-2 hover:bg-[var(--glass-bg)] rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-[var(--text-muted)]" />
                      </button>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="h-1 bg-[var(--glass-border)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#00d9ff] to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--glass-border)]">
                      <button
                        onClick={finishTour}
                        className="px-3 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-mono"
                      >
                        {t.skip}
                      </button>
                      
                      <div className="flex items-center gap-2">
                        {currentStep > 0 && (
                          <button
                            onClick={prevStep}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg hover:border-[#00d9ff]/50 transition-all font-mono text-xs font-bold"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            {t.prev}
                          </button>
                        )}
                        
                        <button
                          onClick={nextStep}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#00d9ff] to-purple-500 text-white rounded-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] transition-all font-mono text-xs font-bold"
                        >
                          {currentStep === steps.length - 1 ? t.finish : t.next}
                          {currentStep < steps.length - 1 && <ArrowRight className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}