import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "../contexts/language-context";
import { Compass, X, ArrowRight, ArrowLeft, Sparkles, Target } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  tip?: string;
  elementId: string | string[]; // ✅ Підтримка масиву!
}

export function SiteTour() {
  const { language } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [highlightRects, setHighlightRects] = useState<DOMRect[]>([]); // ✅ Масив rect'ів!
  const [isElementVisible, setIsElementVisible] = useState(false);

  const getTourSteps = useCallback((): TourStep[] => {
    const translations: Record<string, TourStep[]> = {
      en: [
        {
          id: "step-1",
          elementId: "beta-banner",
          title: "🚨 BETA Banner",
          description: "This site is in BETA testing! Inspired by airport departure boards.",
          tip: "All page offsets calculated from banner height"
        },
        {
          id: "step-2",
          elementId: ["navigation", "theme-toggle", "language-selector"], // ✅ КІЛЬКА ЕЛЕМЕНТІВ!
          title: "🧭 Navigation & Controls",
          description: "Quick access to all sections. Sticky navbar with theme toggle and language selector.",
          tip: "Click navigation links, toggle theme, or switch language"
        },
        {
          id: "step-3",
          elementId: "theme-toggle",
          title: "🎨 Theme Toggle",
          description: "Switch between light/dark modes. Your preference is saved.",
          tip: "Toggle to see instant theme change"
        },
        {
          id: "step-4",
          elementId: "language-selector",
          title: "🌍 Language",
          description: "Choose from 5 languages: EN/UK/NL/AR/ES. Auto-translates all content.",
          tip: "Try switching language now"
        },
        {
          id: "step-5",
          elementId: "hero",
          title: "👋 Hero Section",
          description: "Introduction with animated stats and social links.",
          tip: "Live GitHub stats updated daily"
        },
        {
          id: "step-6",
          elementId: "about",
          title: "ℹ️ About Me",
          description: "Background, skills, tech stack with interactive skill bars and detailed experience.",
          tip: "Hover over skill bars to see detailed information and proficiency levels"
        },
        {
          id: "step-7",
          elementId: "projects",
          title: "🚀 Projects",
          description: "Portfolio showcase with live demos and source code.",
          tip: "Click projects for details"
        },
        {
          id: "step-8",
          elementId: "services",
          title: "💼 Services",
          description: "Available services with pricing (includes 21% VAT). Try the AI Assistant for process automation!",
          tip: "Click 'Get Started with Process Automation' to open AI chatbot"
        },
        {
          id: "step-9",
          elementId: "chat-bot-button",
          title: "🤖 AI Chat Assistant",
          description: "Smart AI chatbot that can answer questions about pricing, skills, projects, and availability. Auto-detects your language!",
          tip: "Click to open chat • Ask anything in EN/UK/NL/AR/ES • Language auto-switches based on your message"
        },
        {
          id: "step-10",
          elementId: "contact",
          title: "📧 Contact",
          description: "Get in touch! Response within 24 hours guaranteed.",
          tip: "Fill form to start conversation"
        }
      ],
      uk: [
        {
          id: "step-1",
          elementId: "beta-banner",
          title: "🚨 BETA Банер",
          description: "Сайт у BETA! Натхнений табло аеропорту.",
          tip: "Відступи розраховані від висоти банера"
        },
        {
          id: "step-2",
          elementId: ["navigation", "theme-toggle", "language-selector"], // ✅ КІЛЬКА ЕЛЕМЕНТІВ!
          title: "🧭 Навігація та Контролі",
          description: "Швидкий доступ до секцій. Липкий navbar з перемикачем теми та мови.",
          tip: "Клік на посилання, перемкніть тему або змініть мову"
        },
        {
          id: "step-3",
          elementId: "theme-toggle",
          title: "🎨 Тема",
          description: "Перемикайте світла/темна тема. Зберігається в браузері.",
          tip: "Перемкніть щоб побачити зміни"
        },
        {
          id: "step-4",
          elementId: "language-selector",
          title: "🌍 Мова",
          description: "Оберіть з 5 мов: EN/UK/NL/AR/ES. Авто-переклад контенту.",
          tip: "Спробуйте змінити мову зараз"
        },
        {
          id: "step-5",
          elementId: "hero",
          title: "👋 Головна",
          description: "Вступ з анімованою статистикою та соц. мережами.",
          tip: "GitHub статистика оновлюється щодня"
        },
        {
          id: "step-6",
          elementId: "about",
          title: "ℹ️ Про мене",
          description: "Досвід, навички, технології з інтерактивними шкалами та детальною досвідомістю.",
          tip: "Наведіть на навички для деталей та рівнів кваліфікації"
        },
        {
          id: "step-7",
          elementId: "projects",
          title: "🚀 Проекти",
          description: "Портфоліо з демо та вихідним кодом.",
          tip: "Клацніть на проект для деталей"
        },
        {
          id: "step-8",
          elementId: "services",
          title: "💼 Послуги",
          description: "Доступні послуги з цінами (включає ПДВ 21%). Спробуйте AI асистента для автоматизації процесів!",
          tip: "Клацніть 'Get Started with Process Automation' щоб відкрити AI чатбот"
        },
        {
          id: "step-9",
          elementId: "chat-bot-button",
          title: "🤖 AI Чат Асистент",
          description: "Розумний AI чатбот, який може відповідати на питання про ціни, навички, проекти та доступність. Автоматично визначає вашу мову!",
          tip: "Клацніть, щоб відкрити чат • Задайте щось у EN/UK/NL/AR/ES • Мова автоматично змінюється відповідно до вашого повідомлення"
        },
        {
          id: "step-10",
          elementId: "contact",
          title: "📧 Контакти",
          description: "Зв'яжіться! Відповідь протягом 24 годин гарантована.",
          tip: "Заповніть форму для початку розмови"
        }
      ],
      nl: [
        {
          id: "step-1",
          elementId: "beta-banner",
          title: "🚨 BETA Banner",
          description: "Site is in BETA! Geïnspireerd door luchthavenborden.",
          tip: "Offsets berekend vanaf bannerhoogte"
        },
        {
          id: "step-2",
          elementId: ["navigation", "theme-toggle", "language-selector"], // ✅ MEERDERE ELEMENTEN!
          title: "🧭 Navigatie & Bediening",
          description: "Snelle toegang tot secties. Sticky navbar met thema en taal schakelaar.",
          tip: "Klik links, schakel thema of wijzig taal"
        },
        {
          id: "step-3",
          elementId: "theme-toggle",
          title: "🎨 Thema",
          description: "Schakel licht/donker thema. Voorkeur opgeslagen.",
          tip: "Schakel voor directe themawijziging"
        },
        {
          id: "step-4",
          elementId: "language-selector",
          title: "🌍 Taal",
          description: "Kies uit 5 talen: EN/UK/NL/AR/ES. Auto-vertaling content.",
          tip: "Probeer nu taal te wijzigen"
        },
        {
          id: "step-5",
          elementId: "hero",
          title: "👋 Hero",
          description: "Intro met geanimeerde stats en sociale links.",
          tip: "GitHub stats dagelijks bijgewerkt"
        },
        {
          id: "step-6",
          elementId: "about",
          title: "ℹ️ Over",
          description: "Achtergrond, skills, tech stack met interactieve skill bars en gedetailleerde ervaring.",
          tip: "Hover over skill bars voor gedetailleerde informatie en vaardigheidsniveaus"
        },
        {
          id: "step-7",
          elementId: "projects",
          title: "🚀 Projecten",
          description: "Portfolio met live demo's en broncode.",
          tip: "Klik projecten voor details"
        },
        {
          id: "step-8",
          elementId: "services",
          title: "💼 Diensten",
          description: "Beschikbare diensten met prijzen (incl. 21% BTW). Probeer de AI-assistent voor procesautomatisering!",
          tip: "Klik 'Get Started with Process Automation' om AI chatbot te openen"
        },
        {
          id: "step-9",
          elementId: "chat-bot-button",
          title: "🤖 AI Chat Assistant",
          description: "Slimme AI chatbot die vragen kan beantwoorden over prijzen, vaardigheden, projecten en beschikbaarheid. Detecteert automatisch uw taal!",
          tip: "Klik om chat te openen • Vraag iets in EN/UK/NL/AR/ES • Taal verandert automatisch op basis van uw bericht"
        },
        {
          id: "step-10",
          elementId: "contact",
          title: "📧 Contact",
          description: "Neem contact op! Reactie binnen 24 uur gegarandeerd.",
          tip: "Vul formulier in om te starten"
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

    const elementIds = Array.isArray(step.elementId) ? step.elementId : [step.elementId];
    const rects: DOMRect[] = [];

    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`Element not found: ${id}`);
        return;
      }

      const rect = element.getBoundingClientRect();
      rects.push(rect);
    });

    setHighlightRects(rects);
    setIsElementVisible(rects.length > 0);

    // ✅ ПОКРАЩЕНО: Більш розумна прокрутка для мобільних
    if (rects.length > 0) {
      const firstRect = rects[0];
      const isMobile = window.innerWidth < 768;
      
      // На мобільних - менший offset, на десктопі - більший
      const headerOffset = isMobile ? 120 : 150;
      const elementPosition = firstRect.top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition), // Не прокручуємо вище 0
        behavior: 'smooth'
      });
    }
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

  // ✅ ДОДАНО: Автоматичний skip кроків з відсутніми елементами
  useEffect(() => {
    if (!isActive) return;

    const steps = getTourSteps();
    const step = steps[currentStep];
    if (!step) return;

    const elementIds = Array.isArray(step.elementId) ? step.elementId : [step.elementId];
    const foundElements = elementIds.some(id => document.getElementById(id) !== null);

    // Якщо жоден елемент не знайдено - автоматично переходимо далі (але не більше 3 разів підряд)
    if (!foundElements && currentStep < steps.length - 1) {
      const skipAttempts = Number(sessionStorage.getItem('tourSkipAttempts') || '0');
      if (skipAttempts < 3) {
        sessionStorage.setItem('tourSkipAttempts', String(skipAttempts + 1));
        console.warn(`⏭️ Skipping step ${currentStep + 1} - element not found`);
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 500);
      } else {
        // Скинути лічильник якщо знайдено хоча б один елемент
        sessionStorage.setItem('tourSkipAttempts', '0');
      }
    } else {
      sessionStorage.setItem('tourSkipAttempts', '0');
    }
  }, [isActive, currentStep, getTourSteps]);

  const closeTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    setHighlightRects([]);
    setIsElementVisible(false);
    sessionStorage.removeItem('tourSkipAttempts'); // ✅ Очищаємо лічильник
  };

  // Update highlight when step changes
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(updateHighlight, 200);
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
        className="fixed bottom-[88px] left-4 sm:left-6 z-[100] w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        aria-label="Start site tour"
      >
        <Compass className="w-6 h-6 text-white" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-black animate-pulse">
          ✨
        </div>
      </button>
    );
  }

  if (!isActive || !step) return null;

  return (
    <>
      {/* DARK OVERLAY WITH CUTOUT - NO BACKGROUND ON MOBILE */}
      <div
        className="fixed inset-0 z-[9998] pointer-events-auto"
        style={{
          background: highlightRects.length > 0 && isElementVisible
            ? window.innerWidth >= 768 // Only show dark overlay on desktop
              ? `
                radial-gradient(
                  ellipse ${highlightRects[0].width + 40}px ${highlightRects[0].height + 40}px at ${highlightRects[0].left + highlightRects[0].width / 2}px ${highlightRects[0].top + highlightRects[0].height / 2}px,
                  transparent 0%,
                  transparent 50%,
                  rgba(0, 0, 0, 0.50) 50%,
                  rgba(0, 0, 0, 0.50) 100%
                )
              `
              : 'transparent' // No dark background on mobile
            : window.innerWidth >= 768 
              ? 'rgba(0, 0, 0, 0.50)' 
              : 'transparent'
        }}
        onClick={closeTour}
      />

      {/* ANIMATED SPOTLIGHT RINGS - MULTIPLE ELEMENTS */}
      {highlightRects.length > 0 && isElementVisible && (
        <>
          {highlightRects.map((rect, index) => {
            // Creative color gradients for each element
            const colors = [
              { border: 'rgba(0, 217, 255, 0.8)', shadow: 'rgba(0, 217, 255, 0.7)', solid: '#00d9ff' }, // Cyan
              { border: 'rgba(168, 85, 247, 0.8)', shadow: 'rgba(168, 85, 247, 0.7)', solid: '#a855f7' }, // Purple
              { border: 'rgba(236, 72, 153, 0.8)', shadow: 'rgba(236, 72, 153, 0.7)', solid: '#ec4899' }, // Pink
              { border: 'rgba(34, 197, 94, 0.8)', shadow: 'rgba(34, 197, 94, 0.7)', solid: '#22c55e' }, // Green
              { border: 'rgba(249, 115, 22, 0.8)', shadow: 'rgba(249, 115, 22, 0.7)', solid: '#f97316' }, // Orange
            ];
            const color = colors[index % colors.length];

            return (
              <div key={`highlight-${index}`}>
                {/* Outer pulsing ring */}
                <div
                  className="fixed z-[9999] pointer-events-none"
                  style={{
                    top: rect.top - 20,
                    left: rect.left - 20,
                    width: rect.width + 40,
                    height: rect.height + 40,
                    borderRadius: '16px',
                    border: `4px solid ${color.border}`,
                    boxShadow: `0 0 0 8px ${color.border.replace('0.8', '0.3')}, 0 0 60px ${color.shadow}, inset 0 0 40px ${color.border.replace('0.8', '0.2')}`,
                    animation: `tour-pulse 2s ease-in-out infinite ${index * 0.2}s` // Staggered animation
                  }}
                />

                {/* Inner solid border */}
                <div
                  className="fixed z-[9999] pointer-events-none"
                  style={{
                    top: rect.top - 8,
                    left: rect.left - 8,
                    width: rect.width + 16,
                    height: rect.height + 16,
                    borderRadius: '12px',
                    border: `3px solid ${color.solid}`,
                    boxShadow: `0 0 30px ${color.shadow}`
                  }}
                />

                {/* Number badge for multiple elements */}
                {highlightRects.length > 1 && (
                  <div
                    className="fixed z-[9999] pointer-events-none"
                    style={{
                      top: rect.top - 12,
                      left: rect.left - 12,
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-black font-mono"
                      style={{
                        background: `linear-gradient(135deg, ${color.solid}, ${color.border.replace('0.8', '1')})`,
                        boxShadow: `0 0 20px ${color.shadow}`
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>
                )}

                {/* Pointing arrow indicator - only for first element */}
                {index === 0 && (
                  <div
                    className="fixed z-[9999] pointer-events-none"
                    style={{
                      top: rect.top - 50,
                      left: rect.left + rect.width / 2 - 20,
                      animation: 'tour-bounce 1.5s ease-in-out infinite'
                    }}
                  >
                    <div className="bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-full p-2 shadow-lg">
                      <Target className="w-8 h-8 text-black" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* TOOLTIP CARD */}
      <div
        className="fixed z-[10000] bg-[var(--card-bg)] border-2 border-[var(--accent-primary)] rounded-2xl shadow-2xl p-4 md:p-6 max-w-[calc(100vw-2rem)] w-full md:max-w-md backdrop-blur-xl"
        style={{
          // SMART POSITIONING - адаптивне для мобілі
          ...((() => {
            const isMobile = window.innerWidth < 768;
            if (!isMobile) {
              // Desktop - внизу по центру
              return {
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
              };
            } else {
              // Mobile - розумне позиціонування відносно елемента
              if (highlightRects.length > 0 && isElementVisible) {
                const firstRect = highlightRects[0];
                const elementCenterY = firstRect.top + firstRect.height / 2;
                const screenHeight = window.innerHeight;
                const isElementInTopHalf = elementCenterY < screenHeight / 2;
                
                if (isElementInTopHalf) {
                  // Елемент вгорі - popover знизу
                  return {
                    bottom: '16px',
                    left: '1rem',
                    right: '1rem',
                    width: 'auto',
                    maxWidth: 'calc(100vw - 2rem)',
                  };
                } else {
                  // Елемент внизу - popover вгорі
                  return {
                    top: '16px',
                    left: '1rem',
                    right: '1rem',
                    width: 'auto',
                    maxWidth: 'calc(100vw - 2rem)',
                  };
                }
              } else {
                // Fallback - внизу
                return {
                  bottom: '16px',
                  left: '1rem',
                  right: '1rem',
                  width: 'auto',
                  maxWidth: 'calc(100vw - 2rem)',
                };
              }
            }
          })())
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-full flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-mono text-base md:text-lg font-bold text-[var(--text-primary)] truncate">
                {step.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Step {currentStep + 1} / {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={closeTour}
            className="p-3 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors shrink-0 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close tour"
          >
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-5">
          <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
            {step.description}
          </p>
          {step.tip && (
            <div className="bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-lg p-3">
              <p className="text-xs md:text-sm text-[var(--accent-primary)] font-mono leading-relaxed">
                💡 {step.tip}
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2 md:gap-3">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-3 md:px-4 py-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors text-xs md:text-sm font-mono active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'uk' ? 'Назад' : language === 'nl' ? 'Vorige' : 'Back'}</span>
          </button>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-3 md:px-4 py-2.5 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 hover:from-[var(--accent-secondary)] hover:to-cyan-500 text-black rounded-lg transition-all text-xs md:text-sm font-mono font-bold active:scale-95 flex-1 justify-center"
          >
            <span>
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
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Skip Button */}
        <button
          onClick={closeTour}
          className="w-full mt-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors active:scale-95"
        >
          {language === 'uk' ? 'Пропустити тур ✕' : language === 'nl' ? 'Sla tour over ✕' : 'Skip tour ✕'}
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes tour-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes tour-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Reduce motion for mobile performance */
        @media (max-width: 768px) {
          @keyframes tour-pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              opacity: 0.9;
            }
          }
          
          @keyframes tour-bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
        }

        /* Disable animations if user prefers reduced motion */
        @media (prefers-reduced-motion: reduce) {
          @keyframes tour-pulse {
            0%, 100% {
              opacity: 1;
            }
          }
          
          @keyframes tour-bounce {
            0%, 100% {
              transform: translateY(0);
            }
          }
        }
      `}</style>
    </>
  );
}