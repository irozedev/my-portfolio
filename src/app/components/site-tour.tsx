import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "../contexts/language-context";
import { Compass, X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  tip?: string;
  elementId: string;
}

export function SiteTour() {
  const { language } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showButton, setShowButton] = useState(true); // Always show button
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const getTourSteps = useCallback((): TourStep[] => {
    const translations: Record<string, TourStep[]> = {
      en: [
        {
          id: "step-1",
          elementId: "beta-banner",
          title: "🚨 BETA Banner",
          description: "This site is in BETA testing! Inspired by airport departure boards.",
          tip: "All page offsets are calculated from this banner height"
        },
        {
          id: "step-2",
          elementId: "navigation",
          title: "🧭 Navigation",
          description: "Quick access to all sections with sticky behavior",
          tip: "Navbar follows you as you scroll"
        },
        {
          id: "step-3",
          elementId: "theme-toggle",
          title: "🎨 Theme Toggle",
          description: "Switch between light and dark modes instantly",
          tip: "Your preference is saved in browser"
        },
        {
          id: "step-4",
          elementId: "language-selector",
          title: "🌍 Language Selector",
          description: "Choose from 5 languages: EN/UK/NL/AR/ES",
          tip: "All content translates automatically"
        },
        {
          id: "step-5",
          elementId: "availability-widget",
          title: "📅 Availability Widget",
          description: "Check current availability and book a call",
          tip: "Real-time status updates based on schedule"
        },
        {
          id: "step-6",
          elementId: "hero",
          title: "👋 Hero Section",
          description: "Introduction and main call-to-action",
          tip: "Animated stats show real-time metrics"
        },
        {
          id: "step-7",
          elementId: "about",
          title: "ℹ️ About Section",
          description: "Background, skills, and technologies",
          tip: "Tech stack with interactive skill bars"
        },
        {
          id: "step-8",
          elementId: "projects",
          title: "🚀 Projects Portfolio",
          description: "Showcase of completed projects with live demos",
          tip: "Click on projects for detailed view"
        },
        {
          id: "step-9",
          elementId: "services",
          title: "💼 Services",
          description: "Available services and pricing packages",
          tip: "All prices include Belgian VAT (21%)"
        },
        {
          id: "step-10",
          elementId: "contact",
          title: "📧 Contact Form",
          description: "Get in touch for project inquiries",
          tip: "Response within 24 hours guaranteed"
        }
      ],
      uk: [
        {
          id: "step-1",
          elementId: "beta-banner",
          title: "🚨 BETA Банер",
          description: "Сайт у BETA тестуванні! Натхнений табло аеропорту.",
          tip: "Всі відступи сторінки розраховуються від висоти банера"
        },
        {
          id: "step-2",
          elementId: "navigation",
          title: "🧭 Навігація",
          description: "Швидкий доступ до всіх секцій з липким поведінкою",
          tip: "Навбар слідує за вами при прокручуванні"
        },
        {
          id: "step-3",
          elementId: "theme-toggle",
          title: "🎨 Перемикач теми",
          description: "Миттєво перемикайтесь між світлою та темною темами",
          tip: "Ваші налаштування зберігаються в браузері"
        },
        {
          id: "step-4",
          elementId: "language-selector",
          title: "🌍 Вибір мови",
          description: "Оберіть з 5 мов: EN/UK/NL/AR/ES",
          tip: "Весь контент перекладається автоматично"
        },
        {
          id: "step-5",
          elementId: "availability-widget",
          title: "📅 Віджет доступності",
          description: "Перевірте поточну доступність та забронюйте дзвінок",
          tip: "Статус оновлюється в реальному часі"
        },
        {
          id: "step-6",
          elementId: "hero",
          title: "👋 Головна секція",
          description: "Вступ та основний заклик до дії",
          tip: "Анімована статистика показує метрики в реальному часі"
        },
        {
          id: "step-7",
          elementId: "about",
          title: "ℹ️ Про мене",
          description: "Досвід, навички та технології",
          tip: "Технічний стек з інтерактивними шкалами навичок"
        },
        {
          id: "step-8",
          elementId: "projects",
          title: "🚀 Портфоліо проектів",
          description: "Витрина завершених проектів з демо",
          tip: "Клацніть на проекти для детального перегляду"
        },
        {
          id: "step-9",
          elementId: "services",
          title: "💼 Послуги",
          description: "Доступні послуги та пакети цін",
          tip: "Всі ціни включають бельгійський ПДВ (21%)"
        },
        {
          id: "step-10",
          elementId: "contact",
          title: "📧 Контактна форма",
          description: "Зв'яжіться для запитів щодо проектів",
          tip: "Гарантована відповідь протягом 24 годин"
        }
      ],
      nl: [
        {
          id: "step-1",
          elementId: "beta-banner",
          title: "🚨 BETA Banner",
          description: "Site is in BETA testing! Geïnspireerd door luchthavenborden.",
          tip: "Alle pagina-offsets zijn berekend vanaf deze bannerhoogte"
        },
        {
          id: "step-2",
          elementId: "navigation",
          title: "🧭 Navigatie",
          description: "Snelle toegang tot alle secties met sticky gedrag",
          tip: "Navbar volgt u terwijl u scrolt"
        },
        {
          id: "step-3",
          elementId: "theme-toggle",
          title: "🎨 Thema Schakelaar",
          description: "Schakel direct tussen lichte en donkere modus",
          tip: "Uw voorkeur wordt opgeslagen in browser"
        },
        {
          id: "step-4",
          elementId: "language-selector",
          title: "🌍 Taalkiezer",
          description: "Kies uit 5 talen: EN/UK/NL/AR/ES",
          tip: "Alle inhoud wordt automatisch vertaald"
        },
        {
          id: "step-5",
          elementId: "availability-widget",
          title: "📅 Beschikbaarheid Widget",
          description: "Controleer huidige beschikbaarheid en boek een gesprek",
          tip: "Real-time statusupdates op basis van planning"
        },
        {
          id: "step-6",
          elementId: "hero",
          title: "👋 Hero Sectie",
          description: "Introductie en belangrijkste call-to-action",
          tip: "Geanimeerde statistieken tonen real-time metrics"
        },
        {
          id: "step-7",
          elementId: "about",
          title: "ℹ️ Over Sectie",
          description: "Achtergrond, vaardigheden en technologieën",
          tip: "Tech stack met interactieve vaardigheidsbalken"
        },
        {
          id: "step-8",
          elementId: "projects",
          title: "🚀 Projecten Portfolio",
          description: "Showcase van voltooide projecten met live demo's",
          tip: "Klik op projecten voor gedetailleerde weergave"
        },
        {
          id: "step-9",
          elementId: "services",
          title: "💼 Diensten",
          description: "Beschikbare diensten en prijspakketten",
          tip: "Alle prijzen inclusief Belgische BTW (21%)"
        },
        {
          id: "step-10",
          elementId: "contact",
          title: "📧 Contactformulier",
          description: "Neem contact op voor projectvragen",
          tip: "Reactie binnen 24 uur gegarandeerd"
        }
      ]
    };

    return translations[language] || translations.en;
  }, [language]);

  // Calculate highlight position for current element
  const updateHighlight = useCallback(() => {
    if (!isActive) return;

    const steps = getTourSteps();
    const step = steps[currentStep];
    if (!step) return;

    const element = document.getElementById(step.elementId);
    if (!element) {
      console.warn(`Element not found: ${step.elementId}`);
      setHighlightRect(null);
      return;
    }

    const rect = element.getBoundingClientRect();
    setHighlightRect(rect);

    // Smooth scroll to element
    const headerOffset = 80; // Navigation height
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset - 100;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }, [isActive, currentStep, getTourSteps]);

  const startTour = () => {
    const tourCompleted = localStorage.getItem('siteTourCompleted');
    if (!tourCompleted) {
      localStorage.setItem('siteTourCompleted', 'true');
    }
    setIsActive(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    const steps = getTourSteps();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    setHighlightRect(null);
  };

  // Update highlight when step changes
  useEffect(() => {
    if (isActive) {
      // Small delay to allow page to render
      const timer = setTimeout(updateHighlight, 100);
      return () => clearTimeout(timer);
    }
  }, [isActive, currentStep, updateHighlight]);

  // Update highlight on resize (throttled)
  useEffect(() => {
    if (!isActive) return;

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateHighlight, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [isActive, updateHighlight]);

  const steps = getTourSteps();
  const step = steps[currentStep];

  if (!isActive && showButton) {
    return (
      <button
        onClick={startTour}
        className="fixed bottom-24 left-4 sm:left-6 z-[100] w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Start site tour"
      >
        <Compass className="w-6 h-6 text-white" />
      </button>
    );
  }

  if (!isActive || !step) return null;

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] transition-opacity"
        onClick={closeTour}
      />

      {/* HIGHLIGHT BOX */}
      {highlightRect && (
        <div
          className="fixed z-[9999] pointer-events-none transition-all duration-300"
          style={{
            top: highlightRect.top - 8,
            left: highlightRect.left - 8,
            width: highlightRect.width + 16,
            height: highlightRect.height + 16,
            border: '3px solid #00d9ff',
            borderRadius: '12px',
            boxShadow: '0 0 0 4px rgba(0, 217, 255, 0.2), 0 0 40px rgba(0, 217, 255, 0.4)',
          }}
        />
      )}

      {/* TOOLTIP CARD */}
      <div
        className="fixed z-[10000] bg-[var(--card-bg)] border-2 border-[var(--accent-primary)] rounded-2xl shadow-2xl p-6 max-w-sm w-[calc(100vw-2rem)] md:w-96"
        style={{
          bottom: '20px',
          right: '50%',
          transform: 'translateX(50%)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-full flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-mono text-base md:text-lg font-bold text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {currentStep + 1} / {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={closeTour}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
            aria-label="Close tour"
          >
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-6">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {step.description}
          </p>
          {step.tip && (
            <div className="bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-lg p-3">
              <p className="text-xs text-[var(--accent-primary)] font-mono">
                💡 {step.tip}
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'uk' ? 'Назад' : language === 'nl' ? 'Vorige' : 'Back'}
          </button>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 hover:from-[var(--accent-secondary)] hover:to-cyan-500 text-black rounded-lg transition-all text-sm font-mono font-bold"
          >
            {currentStep === steps.length - 1
              ? language === 'uk'
                ? 'Готово'
                : language === 'nl'
                ? 'Klaar'
                : 'Finish'
              : language === 'uk'
              ? 'Далі'
              : language === 'nl'
              ? 'Volgende'
              : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Skip Button */}
        <button
          onClick={closeTour}
          className="w-full mt-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          {language === 'uk' ? 'Пропустити тур' : language === 'nl' ? 'Sla tour over' : 'Skip tour'}
        </button>
      </div>
    </>
  );
}
