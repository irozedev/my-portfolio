import { Menu, X, Sun, Moon, ChevronDown, Terminal } from "lucide-react";
import { useState, useEffect, useMemo, useCallback, useRef, Suspense, lazy } from "react";
import { useLanguage, Language } from "../contexts/language-context";
import { useTheme } from "../contexts/theme-context";
import { smoothScrollToSection } from "../../utils/scroll-utils";
import { useAvailability } from "../contexts/availability-context";
import { useViewMode } from "../contexts/view-mode-context";
import { ViewModeToggle } from "./view-mode-toggle";
const BookCallModal = lazy(() => import("./book-call-fixed").then(m => ({ default: m.BookCallModal })));
const AvailabilityScheduleModal = lazy(() => import("./availability-schedule-modal").then(m => ({ default: m.AvailabilityScheduleModal })));
import { useModalA11y } from "../hooks/use-modal-a11y";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showBookCallModal, setShowBookCallModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isAvailable } = useAvailability();
  const { isClientMode } = useViewMode();
  const rafRef = useRef(0);

  const isRTL = language === 'ar';

  const navItems = useMemo(() => {
    if (isClientMode) {
      return [
        { label: t("nav.home"), href: "#hero" },
        { label: t("nav.services"), href: "#services" },
        {
          label:
            
            language === "nl" ? "Werkwijze" :
            language === "ar" ? "آلية العمل" :
            language === "es" ? "Proceso" : "Process",
          href: "#how-i-work",
        },
        { label: t("nav.projects"), href: "#projects" },
        { label: t("nav.about"), href: "#about" },
        { label: t("nav.contact"), href: "#contact" },
      ];
    } else {
      return [
        { label: t("nav.home"), href: "#hero" },
        { label: t("nav.experience"), href: "#experience" },
        { label: t("nav.about"), href: "#about" },
        { label: t("nav.projects"), href: "#projects" },
        { label: t("nav.contact"), href: "#contact" },
      ];
    }
  }, [t, isClientMode, language]);

  // Order and contents must match OFFERED in language-context.tsx.
  // Ukrainian was retired: the site targets the European hiring market.
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "nl", label: "Nederlands", flag: "🇳🇱" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];
  const displayLang = currentLang.code.toUpperCase() === 'UK' ? 'UA' : currentLang.code.toUpperCase();

  // Throttled scroll handler with rAF
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        setScrolled(scrollY > 50);

        // Scroll progress
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);

        // Active section
        const sections = navItems.map(item => item.href.replace('#', '') || 'home');
        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.offsetHeight : 80;
        const isMobile = window.innerWidth < 768;
        const bannerH = isMobile ? 40 : 48;
        const totalOffset = bannerH + navHeight + (isMobile ? 20 : 30);
        let found = false;

        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= totalOffset + 50 && rect.bottom >= totalOffset) {
              setActiveSection(section);
              found = true;
              break;
            }
          }
        }
        if (!found && scrollY < 100) setActiveSection('home');

        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [navItems]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      setShowLangMenu(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // The menu is a dialog, so it gets Escape and a focus trap like the rest.
  const mobileMenuRef = useModalA11y({
    isOpen: isMobileMenuOpen,
    onClose: () => setIsMobileMenuOpen(false),
  });

  // Close the language dropdown on outside click
  useEffect(() => {
    if (!showLangMenu) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('.language-selector')) setShowLangMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showLangMenu]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    smoothScrollToSection(href);
    setIsMobileMenuOpen(false);
  }, []);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <>
      <nav
        id="navigation"
        /* top-0, not top-10/top-12. Those offsets existed to clear the
           maintenance ticker that used to sit above the header; with the
           ticker unmounted they left a 48px strip of empty background across
           the top of every page. */
        className={`fixed top-0 left-0 right-0 w-full z-[9999] transition-all duration-300 border-b ${
          scrolled
            ? 'bg-[var(--bg-primary)]/95 backdrop-blur-md shadow-lg border-[var(--border-color)]'
            : 'bg-[var(--bg-primary)]/90 backdrop-blur-sm border-transparent'
        }`}
      >
        {/* Scroll Progress Bar — pure CSS driven */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--accent-primary)] via-purple-500 to-pink-500"
          style={{ width: `${scrollProgress}%`, transition: 'width 0.1s linear' }}
        />

        <div className={`w-full px-3 sm:px-4 lg:px-6 ${scrolled ? 'py-2.5' : 'py-3 lg:py-4'} transition-all duration-300`}>
          <div className={`flex items-center w-full gap-2 sm:gap-3 lg:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            
            {/* Logo — Lightweight */}
            <div className="flex-1 flex items-center gap-2 justify-start min-w-0">
              <a
                href="#home"
                onClick={(e) => handleNavClick(e, "#home")}
                className="flex items-center gap-2 group"
              >
                {/* Simple hexagon logo */}
                <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-cyan-400"
                    style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}
                  />
                  <div
                    className="absolute inset-[2px] bg-[var(--bg-primary)] flex items-center justify-center"
                    style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}
                  >
                    <span
                      className="text-xl font-black bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 bg-clip-text text-transparent"
                    >
                      S
                    </span>
                  </div>
                  {/* Availability dot */}
                  <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] ${
                    isAvailable ? 'bg-green-500' : 'bg-orange-500'
                  }`} />
                </div>

                {/* Status Badge — desktop only, clickable */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAvailabilityModal(true);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] hover:border-[var(--accent-primary)]/40 transition-colors cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
                  <span className={`text-xs font-bold uppercase ${isAvailable ? 'text-green-500' : 'text-orange-500'}`}>
                    {isAvailable ? (
                      language === 'nl' ? 'Online' : language === 'ar' ? 'متصل' : language === 'es' ? 'En línea' : 'Online'
                    ) : (
                      language === 'nl' ? 'Bezet' : language === 'ar' ? 'مشغول' : language === 'es' ? 'Ocupado' : 'Busy'
                    )}
                  </span>
                </button>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.replace('#', '') || (item.href === '#home' && activeSection === '');
                return (
                  <a
                    key={`${item.href}-${index}`}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md whitespace-nowrap ${
                      isActive
                        ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/60"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-1.5 flex-1 justify-end">
              {/* Client / CV switch. Lives here rather than as a floating panel:
                  it is navigation, and pinned to the right edge it covered the
                  About section text. */}
              <ViewModeToggle className="mr-1" />

              {/* Language Selector */}
              <div id="language-selector" className="relative language-selector">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-md transition-colors flex items-center gap-1.5"
                >
                  <span className="text-lg">{currentLang.flag}</span>
                  <span className="text-xs font-medium text-[var(--text-secondary)] uppercase">{displayLang}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showLangMenu && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-44 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-xl overflow-hidden z-[100000]`}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                        className={`w-full px-3 py-2 ${isRTL ? 'text-right' : 'text-left'} hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-2.5 text-sm ${
                          language === lang.code ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]" : "text-[var(--text-primary)]"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                className="p-2 hover:bg-[var(--bg-secondary)] rounded-md transition-colors"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-[var(--text-secondary)]" /> : <Moon className="w-5 h-5 text-[var(--text-secondary)]" />}
              </button>

              {/* Sign-in, the account dropdown and the profile link used to sit
                  here. Nobody signs in to read a CV, and an account control in
                  the header of a portfolio raises a question it cannot answer
                  ("an account for what?"). The owner still reaches the admin
                  panel at #admin, which carries its own sign-in button. */}

              {/* CTA — Terminal-style "Start Project" */}
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="ml-2 group relative flex items-center gap-2 whitespace-nowrap px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--accent-primary)]/40 rounded-md font-mono text-sm text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 hover:border-[var(--accent-primary)] hover:shadow-[0_0_15px_rgba(0,217,255,0.2)] transition-all active:scale-95"
              >
                <Terminal className="w-4 h-4" />
                <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors">$</span>
                <span>
                  {
                   language === 'nl' ? 'start project' :
                   language === 'ar' ? 'ابدأ مشروع' :
                   language === 'es' ? 'iniciar proyecto' :
                   'start project'}
                </span>
                <span className="w-[2px] h-4 bg-[var(--accent-primary)] animate-blink" />
              </a>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center gap-1.5">
              {/* Icon-only here — the labels do not fit next to the language
                  chip, the theme button and the burger on a 390px screen. */}
              <ViewModeToggle size="compact" />

              {/* Language — compact */}
              <div className="relative language-selector">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-2 bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-md flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <span className="text-sm">{currentLang.flag}</span>
                  <span className="text-[10px] font-mono font-bold text-[var(--text-primary)]">{displayLang}</span>
                </button>

                {showLangMenu && (
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-1.5 w-44 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-2xl overflow-hidden z-[100001]`}>
                    <div className="px-3 py-1.5 bg-[var(--bg-secondary)]/30 border-b border-[var(--border-color)]">
                      <p className="text-[9px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest">SELECT LANG</p>
                    </div>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                        className={`w-full px-3 py-2.5 text-sm flex items-center gap-2.5 active:bg-[var(--accent-primary)]/20 transition-colors ${
                          language === lang.code
                            ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-l-2 border-[var(--accent-primary)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50 border-l-2 border-transparent"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="flex-1 text-left font-mono text-xs">{lang.label}</span>
                        {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="p-2 bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-md active:scale-95 transition-transform"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-[var(--text-secondary)]" /> : <Moon className="w-5 h-5 text-[var(--text-secondary)]" />}
              </button>

              {/* Burger */}
              <button
                onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setShowLangMenu(false); }}
                className="p-2 text-[var(--text-primary)] bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-md active:scale-90 transition-transform"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== Mobile Menu — rendered OUTSIDE <nav> so backdrop-blur on the nav
           doesn't become the containing block and trap this fixed overlay ===== */}
      <div
          className={`lg:hidden fixed inset-0 z-[10001] transition-all duration-300 ease-out ${
            isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={closeMobileMenu} />

          {/* Panel */}
          <div
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            tabIndex={-1}
            className={`absolute top-0 right-0 h-full w-full max-w-sm bg-[var(--bg-primary)] border-l border-[var(--border-color)] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
              <span className="font-mono text-sm text-[var(--text-muted)]">// menu</span>
              <button aria-label="Close" onClick={closeMobileMenu} className="p-2 hover:bg-[var(--bg-secondary)] rounded-md active:scale-90 transition-transform">
                <X className="w-5 h-5 text-[var(--text-primary)]" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-1">
              {navItems.map((item) => {
                const sectionId = item.href.replace('#', '') || 'home';
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`flex items-center justify-between py-4 px-4 rounded-lg text-lg font-semibold transition-colors active:scale-[0.98] ${
                      isActive
                        ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-l-2 border-[var(--accent-primary)]"
                        : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border-l-2 border-transparent"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[var(--text-muted)] text-sm">→</span>
                  </a>
                );
              })}
            </div>

            {/* CTA at bottom */}
            <div className="px-5 py-4 border-t border-[var(--border-color)]">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="flex items-center justify-center gap-2 w-full py-4 bg-[var(--bg-secondary)] border border-[var(--accent-primary)]/40 rounded-md font-mono text-sm text-[var(--accent-primary)] active:scale-95 transition-transform"
              >
                <Terminal className="w-4 h-4" />
                <span className="text-[var(--text-muted)]">$</span>
                <span>
                  {
                   language === 'nl' ? 'start project' :
                   language === 'ar' ? 'ابدأ مشروع' :
                   language === 'es' ? 'iniciar proyecto' :
                   'start project'}
                </span>
                <span className="w-[2px] h-4 bg-[var(--accent-primary)] animate-blink" />
              </a>
            </div>
          </div>
        </div>

      {/* Modals */}
      {showBookCallModal && (
        <Suspense fallback={null}>
          <BookCallModal isOpen onClose={() => setShowBookCallModal(false)} />
        </Suspense>
      )}
      {showAvailabilityModal && (
        <Suspense fallback={null}>
          <AvailabilityScheduleModal
            isOpen
            onClose={() => setShowAvailabilityModal(false)}
            onBookCall={() => { setShowAvailabilityModal(false); setShowBookCallModal(true); }}
          />
        </Suspense>
      )}
    </>
  );
}
