import { Menu, X, Sun, Moon, LogIn, User, ChevronDown, Terminal } from "lucide-react";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLanguage, Language } from "../contexts/language-context";
import { useTheme } from "../contexts/theme-context";
import { smoothScrollToSection } from "../../utils/scroll-utils";
import { useAuth } from "../contexts/auth-context";
import { useAvailability } from "../contexts/availability-context";
import { useViewMode } from "../contexts/view-mode-context";
import { ViewModeToggle } from "./view-mode-toggle";
import { ModernAuthModal } from "./modern-auth-modal";
import { BookCallModal } from "./book-call-fixed";
import { AvailabilityScheduleModal } from "./availability-schedule-modal";

interface NavigationProps {
  onOpenProfile?: () => void;
}

export function Navigation({ onOpenProfile = () => {} }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookCallModal, setShowBookCallModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut, loading } = useAuth();
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
      setShowUserMenu(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    if (!showLangMenu && !showUserMenu) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (showLangMenu && !t.closest('.language-selector')) setShowLangMenu(false);
      if (showUserMenu && !t.closest('.user-menu')) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showLangMenu, showUserMenu]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed', err);
    }
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
  };

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
        className={`fixed top-10 md:top-12 left-0 right-0 w-full z-[9999] transition-all duration-300 border-b ${
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
                  onClick={() => { setShowLangMenu(!showLangMenu); setShowUserMenu(false); }}
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

              {/* Sign In (not logged in) */}
              {!user && !loading && (
                <button
                  onClick={() => setShowAuthModal(true)}
                  title={t('auth.signIn')}
                  aria-label={t('auth.signIn')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  {/* Label only on very wide screens. Sign-in is secondary here
                      — almost nobody uses it — while the Client/CV switch is the
                      primary control and keeps its labels. Something had to give
                      to stop the header wrapping onto two lines at 1440. */}
                  <span className="hidden 2xl:inline">{t('auth.signIn')}</span>
                </button>
              )}

              {/* User menu (logged in) */}
              {user && !loading && (
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 pr-2 rounded-md hover:bg-[var(--bg-secondary)] transition-colors"
                    aria-label="Account menu"
                  >
                    <span className="w-8 h-8 rounded-full overflow-hidden border-2 border-[var(--accent-primary)]/30 flex-shrink-0">
                      {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                        <img
                          src={user.user_metadata.avatar_url || user.user_metadata.picture}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="w-full h-full bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </span>
                      )}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-xl overflow-hidden z-[100000]`}>
                      <div className="px-3 py-2.5 border-b border-[var(--border-color)]">
                        <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                          {user.user_metadata?.name || 'User'}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { onOpenProfile(); setShowUserMenu(false); }}
                        className={`w-full px-3 py-2.5 ${isRTL ? 'text-right' : 'text-left'} text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors`}
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleSignOut}
                        className={`w-full px-3 py-2.5 ${isRTL ? 'text-right' : 'text-left'} text-sm text-red-400 hover:bg-red-500/10 transition-colors`}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}

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
              <ViewModeToggle size="compact" layoutGroup="mobile" />

              {/* Language — compact */}
              <div className="relative language-selector">
                <button
                  onClick={() => { setShowLangMenu(!showLangMenu); setShowUserMenu(false); }}
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

              {/* Login (not logged in) */}
              {!user && !loading && (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="p-2 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-md active:scale-95 transition-transform"
                  title="Sign In"
                >
                  <LogIn className="w-5 h-5 text-black" />
                </button>
              )}

              {/* Avatar (logged in) */}
              {user && !loading && (
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--accent-primary)]/30 active:scale-95 transition-transform"
                >
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img src={user.user_metadata.avatar_url || user.user_metadata.picture} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              )}

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

            {/* User Section */}
            <div className="px-5 py-4 border-b border-[var(--border-color)]">
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--bg-secondary)] rounded animate-pulse" />
                    <div className="h-3 bg-[var(--bg-secondary)] rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-[var(--accent-primary)]/40" loading="lazy" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[var(--text-primary)] truncate">{user.user_metadata?.name || 'User'}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { onOpenProfile(); closeMobileMenu(); }}
                      className="py-2.5 bg-[var(--accent-primary)]/10 rounded-md text-sm font-medium text-[var(--accent-primary)] active:scale-95 transition-transform"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="py-2.5 bg-red-500/10 rounded-md text-sm font-medium text-red-400 active:scale-95 transition-transform"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setShowAuthModal(true); closeMobileMenu(); }}
                  className="w-full py-3 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black font-bold rounded-md flex items-center justify-center gap-2 text-sm active:scale-98 transition-transform"
                >
                  <LogIn className="w-4 h-4" />
                  {t('auth.signIn')}
                </button>
              )}
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
      <ModernAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <BookCallModal isOpen={showBookCallModal} onClose={() => setShowBookCallModal(false)} />
      <AvailabilityScheduleModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        onBookCall={() => { setShowAvailabilityModal(false); setShowBookCallModal(true); }}
      />
    </>
  );
}
