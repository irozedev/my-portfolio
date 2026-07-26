import { useEffect, useState, useCallback, useRef } from "react";
import { useLanguage } from "../contexts/language-context";
import { Compass, X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  tip?: string;
  elementId: string;
}

const tourSteps: Record<string, TourStep[]> = {
  en: [
    { elementId: "beta-banner", title: "Banner", description: "Site is under maintenance. Inspired by airport boards.", tip: "Offsets calculated from banner height" },
    { elementId: "navigation", title: "Navigation", description: "Quick access to all sections with sticky navbar.", tip: "Theme toggle & language selector included" },
    { elementId: "hero", title: "Hero", description: "Introduction with animated stats and social links.", tip: "Live GitHub stats updated daily" },
    { elementId: "about", title: "About", description: "Skills, tech stack, and experience overview.", tip: "Hover skill bars for details" },
    { elementId: "projects", title: "Projects", description: "Portfolio with live demos and source code.", tip: "Click for project details" },
    { elementId: "services", title: "Services", description: "Available services with pricing (incl. 21% VAT).", tip: "Try AI Assistant for automation" },
    { elementId: "chat-bot-button", title: "AI Chat", description: "Smart chatbot for pricing, skills & availability.", tip: "Auto-detects your language" },
    { elementId: "contact", title: "Contact", description: "Get in touch! Response within 24h guaranteed.", tip: "Fill form to start" },
  ],
  uk: [
    { elementId: "beta-banner", title: "Банер", description: "Сайт на технічному обслуговуванні.", tip: "Відступи від висоти банера" },
    { elementId: "navigation", title: "Навігація", description: "Швидкий доступ до секцій, тема та мова.", tip: "Перемикач теми та мови" },
    { elementId: "hero", title: "Головна", description: "Вступ з анімацією та соц. мережами.", tip: "GitHub статистика оновлюється" },
    { elementId: "about", title: "Про мене", description: "Навички, технології та досвід.", tip: "Наведіть на навички" },
    { elementId: "projects", title: "Проекти", description: "Портфоліо з демо та кодом.", tip: "Клік для деталей" },
    { elementId: "services", title: "Послуги", description: "Послуги з цінами (ПДВ 21%).", tip: "AI для автоматизації" },
    { elementId: "chat-bot-button", title: "AI Чат", description: "Чатбот для цін, навичок та доступності.", tip: "Автовизначення мови" },
    { elementId: "contact", title: "Контакти", description: "Відповідь протягом 24 годин!", tip: "Заповніть форму" },
  ],
  nl: [
    { elementId: "beta-banner", title: "Banner", description: "Site is in onderhoud.", tip: "Offsets vanaf bannerhoogte" },
    { elementId: "navigation", title: "Navigatie", description: "Snelle toegang tot secties.", tip: "Thema & taal schakelaar" },
    { elementId: "hero", title: "Hero", description: "Intro met stats en sociale links.", tip: "GitHub stats dagelijks bijgewerkt" },
    { elementId: "about", title: "Over", description: "Skills, tech stack en ervaring.", tip: "Hover voor details" },
    { elementId: "projects", title: "Projecten", description: "Portfolio met demo's en broncode.", tip: "Klik voor details" },
    { elementId: "services", title: "Diensten", description: "Diensten met prijzen (incl. 21% BTW).", tip: "AI-assistent beschikbaar" },
    { elementId: "chat-bot-button", title: "AI Chat", description: "Chatbot voor prijzen en beschikbaarheid.", tip: "Taaldetectie automatisch" },
    { elementId: "contact", title: "Contact", description: "Reactie binnen 24 uur!", tip: "Vul formulier in" },
  ],
  ar: [
    { elementId: "beta-banner", title: "البانر", description: "الموقع قيد الصيانة.", tip: "حسابات من ارتفاع البانر" },
    { elementId: "navigation", title: "التنقل", description: "وصول سريع لجميع الأقسام.", tip: "تبديل السمة واللغة" },
    { elementId: "hero", title: "الرئيسية", description: "مقدمة مع إحصائيات وروابط.", tip: "إحصائيات GitHub محدثة" },
    { elementId: "about", title: "عني", description: "المهارات والتقنيات والخبرة.", tip: "مرر للتفاصيل" },
    { elementId: "projects", title: "المشاريع", description: "معرض أعمال مع عروض حية.", tip: "انقر للتفاصيل" },
    { elementId: "services", title: "الخدمات", description: "خدمات مع أسعار.", tip: "مساعد AI متاح" },
    { elementId: "chat-bot-button", title: "AI دردشة", description: "روبوت ذكي للأسعار والمهارات.", tip: "كشف اللغة تلقائي" },
    { elementId: "contact", title: "تواصل", description: "رد خلال 24 ساعة!", tip: "املأ النموذج" },
  ],
  es: [
    { elementId: "beta-banner", title: "Banner", description: "Sitio en mantenimiento.", tip: "Offsets desde altura del banner" },
    { elementId: "navigation", title: "Navegacion", description: "Acceso rapido a secciones.", tip: "Tema e idioma incluidos" },
    { elementId: "hero", title: "Hero", description: "Intro con stats y redes sociales.", tip: "Stats de GitHub actualizados" },
    { elementId: "about", title: "Sobre mi", description: "Habilidades, tecnologias y experiencia.", tip: "Hover para detalles" },
    { elementId: "projects", title: "Proyectos", description: "Portfolio con demos y codigo fuente.", tip: "Click para detalles" },
    { elementId: "services", title: "Servicios", description: "Servicios con precios (IVA 21%).", tip: "Asistente AI disponible" },
    { elementId: "chat-bot-button", title: "AI Chat", description: "Chatbot para precios y disponibilidad.", tip: "Deteccion de idioma automatica" },
    { elementId: "contact", title: "Contacto", description: "Respuesta en 24 horas!", tip: "Llena el formulario" },
  ],
};

export function SiteTour() {
  const { language } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const intervalRef = useRef<number>(0);
  const isScrollingRef = useRef(false);

  const steps = tourSteps[language] || tourSteps.en;
  const step = steps[currentStep];

  // Build list of valid (existing) step indices
  const getValidSteps = useCallback(() => {
    const valid: number[] = [];
    for (let i = 0; i < steps.length; i++) {
      if (document.getElementById(steps[i].elementId)) {
        valid.push(i);
      }
    }
    return valid;
  }, [steps]);

  // Update rect for current element
  const updateRect = useCallback(() => {
    if (!step || isScrollingRef.current) return;
    const el = document.getElementById(step.elementId);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [step]);

  // Continuously update rect position while tour is active
  useEffect(() => {
    if (!isActive) return;
    
    // Update every 100ms for smooth tracking
    intervalRef.current = window.setInterval(updateRect, 100);
    
    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [isActive, updateRect]);

  // Scroll to element when step changes
  useEffect(() => {
    if (!isActive || !step) return;

    const el = document.getElementById(step.elementId);
    if (!el) return;

    // For fixed elements (banner, navigation), no need to scroll
    const style = window.getComputedStyle(el);
    if (style.position === 'fixed') {
      // Just update rect immediately
      setTimeout(updateRect, 100);
      return;
    }

    isScrollingRef.current = true;
    
    const rect = el.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const offset = window.innerWidth < 768 ? 100 : 140;
    
    window.scrollTo({
      top: Math.max(0, absoluteTop - offset),
      behavior: 'smooth'
    });

    // Wait for scroll to complete, then start updating rect
    setTimeout(() => {
      isScrollingRef.current = false;
      updateRect();
    }, 600);
  }, [isActive, currentStep, step]);

  const startTour = () => {
    localStorage.setItem('siteTourCompleted', 'true');
    const validSteps = getValidSteps();
    if (validSteps.length > 0) {
      setCurrentStep(validSteps[0]);
      setIsActive(true);
    }
  };

  const nextStep = () => {
    const validSteps = getValidSteps();
    const currentIdx = validSteps.indexOf(currentStep);
    if (currentIdx < validSteps.length - 1) {
      setCurrentStep(validSteps[currentIdx + 1]);
    } else {
      closeTour();
    }
  };

  const prevStep = () => {
    const validSteps = getValidSteps();
    const currentIdx = validSteps.indexOf(currentStep);
    if (currentIdx > 0) {
      setCurrentStep(validSteps[currentIdx - 1]);
    }
  };

  const closeTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTargetRect(null);
  };

  const validSteps = getValidSteps();
  const currentValidIdx = validSteps.indexOf(currentStep);
  const hasPrev = currentValidIdx > 0;
  const hasNext = currentValidIdx < validSteps.length - 1;

  // Tour button (not active)
  if (!isActive) {
    return (
      <button
        onClick={startTour}
        className="fixed bottom-24 left-4 sm:left-6 z-[100] w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Start site tour"
      >
        <Compass className="w-6 h-6 text-white" />
      </button>
    );
  }

  if (!step) return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={closeTour}
        style={{
          background: targetRect 
            ? undefined 
            : 'rgba(0,0,0,0.5)',
        }}
      />

      {/* Highlight cutout using box-shadow */}
      {targetRect && (
        <div
          className="fixed z-[9999] pointer-events-none rounded-lg"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.5), 0 0 15px rgba(0,217,255,0.6)',
            border: '2px solid #00d9ff',
            transition: 'top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease',
          }}
        />
      )}

      {/* Tooltip - always at bottom on mobile, centered bottom on desktop */}
      <div
        className="fixed z-[10001] bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/60 rounded-xl shadow-2xl p-4"
        style={isMobile ? {
          bottom: '16px',
          left: '16px',
          right: '16px',
        } : {
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          maxWidth: 'calc(100vw - 2rem)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-lg flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">
                {currentValidIdx + 1} / {validSteps.length}
              </p>
            </div>
          </div>
          <button aria-label="Close"
            onClick={closeTour}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-90"
          >
            <X className="w-4 h-4 text-[var(--text-muted)]" />
          </button>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-2 leading-relaxed">
          {step.description}
        </p>
        {step.tip && (
          <p className="text-xs text-[var(--accent-primary)] font-mono mb-3 opacity-80">
            {step.tip}
          </p>
        )}

        {/* Progress */}
        <div className="h-1 bg-[var(--bg-secondary)] rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentValidIdx + 1) / validSteps.length) * 100}%` }}
          />
        </div>

        {/* Nav buttons */}
        <div className="flex gap-2">
          <button aria-label="Previous step"
            onClick={prevStep}
            disabled={!hasPrev}
            className="flex items-center gap-1 px-3 py-2.5 bg-[var(--bg-secondary)] rounded-lg text-xs font-mono disabled:opacity-30 active:scale-95 transition-all min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button aria-label="Next step"
            onClick={nextStep}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black rounded-lg text-sm font-mono font-bold active:scale-95 transition-all min-h-[44px]"
          >
            {!hasNext
              ? (language === 'uk' ? 'Готово' : language === 'nl' ? 'Klaar' : language === 'ar' ? 'تم' : language === 'es' ? 'Listo' : 'Finish')
              : (language === 'uk' ? 'Далі' : language === 'nl' ? 'Volgende' : language === 'ar' ? 'التالي' : language === 'es' ? 'Siguiente' : 'Next')}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={closeTour}
            className="px-3 py-2.5 text-[var(--text-muted)] text-xs hover:text-[var(--text-primary)] active:scale-95 transition-all min-h-[44px]"
          >
            Skip
          </button>
        </div>
      </div>
    </>
  );
}
