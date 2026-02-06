import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Menu, X, Sun, Moon, LogIn, User, ChevronDown, Globe } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useLanguage, Language } from "../contexts/language-context";
import { useTheme } from "../contexts/theme-context";
import { smoothScrollToSection } from "../../utils/scroll-utils";
import { useAuth } from "../contexts/auth-context";
import { useAvailability } from "../contexts/availability-context";
import { ModernAuthModal } from "./modern-auth-modal";
import { BookCallModal } from "./book-call-fixed";

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
  const { scrollYProgress } = useScroll();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut, loading } = useAuth();
  const { isAvailable } = useAvailability();

  const isRTL = language === 'ar';

  const navItems = useMemo(() => [
    { label: t("nav.home"), href: "#home" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.experience"), href: "#experience" },
    { label: t("nav.projects"), href: "#projects" },
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.contact"), href: "#contact" },
  ], [t]);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "uk", label: "Українська", flag: "🇺🇦" },
    { code: "nl", label: "Nederlands", flag: "🇳🇱" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];
  const displayLang = currentLang.code.toUpperCase() === 'UK' ? 'UA' : currentLang.code.toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = navItems.map(item => item.href.replace('#', '') || 'home');
      const current = sections.find(section => {
        const element = section === 'home' ? document.body : document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  // Block body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Close all other menus when mobile menu opens
      setShowLangMenu(false);
      setShowUserMenu(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close language menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showLangMenu && !target.closest('.language-selector')) {
        setShowLangMenu(false);
      }
      if (showUserMenu && !target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    if (showLangMenu || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangMenu, showUserMenu]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  // Smooth scroll with header offset
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    smoothScrollToSection(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 w-full z-[99999] transition-all duration-500 ease-in-out border-b ${
          scrolled
            ? 'bg-[var(--bg-primary)] backdrop-blur-xl shadow-lg border-[var(--border-color)]'
            : 'bg-[var(--bg-primary)]/80 backdrop-blur-sm border-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--accent-primary)] via-purple-500 to-pink-500 shadow-lg shadow-[var(--accent-primary)]/50"
          style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
        />

        <motion.div 
          className="w-full px-3 sm:px-4 lg:px-6"
          animate={{ 
            paddingTop: scrolled ? '0.75rem' : '1.25rem',
            paddingBottom: scrolled ? '0.75rem' : '1.25rem'
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className={`flex items-center w-full gap-2 sm:gap-3 lg:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Logo - Left Side (Right in RTL due to flex-row-reverse) */}
            <div className="flex-1 flex items-center gap-3 justify-start min-w-0">
              <motion.a
                href="#home"
                onClick={(e) => handleNavClick(e, "#home")}
                className="flex items-center gap-2 sm:gap-3 group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  {/* 3D Layered Effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 rounded-xl blur-sm opacity-50"
                    animate={{ 
                      rotate: [0, 5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="relative w-10 h-10 bg-gradient-to-br from-[var(--accent-primary)] via-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-black text-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[var(--accent-primary)]/50 group-hover:rotate-[-5deg]">
                    <span className="text-white drop-shadow-lg">R</span>
                  </div>
                  {/* Status Indicator */}
                  <motion.div 
                    className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-primary)] shadow-lg ${
                      isAvailable ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: isAvailable 
                        ? ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 0 6px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0)']
                        : ['0 0 0 0 rgba(249, 115, 22, 0.7)', '0 0 0 6px rgba(249, 115, 22, 0)', '0 0 0 0 rgba(249, 115, 22, 0)']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <motion.span 
                    className="font-bold text-lg bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent-primary)] bg-clip-text text-transparent"
                    whileHover={{ letterSpacing: "0.05em" }}
                    transition={{ duration: 0.2 }}
                  >
                    roze.live
                  </motion.span>
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">{t("hero.role")}</span>
                </div>
              </motion.a>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-1 justify-center">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace('#', '') || (item.href === '#home' && activeSection === '');
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-2 md:px-2.5 xl:px-3 py-2 text-xs md:text-[11px] lg:text-xs xl:text-sm font-medium transition-colors group whitespace-nowrap ${
                      isActive
                        ? "text-[var(--accent-primary)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">{item.label}</span>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute inset-0 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    <motion.div
                      className="absolute inset-0 bg-[var(--bg-secondary)]/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent"
                      initial={{ width: 0 }}
                      whileHover={{ width: "80%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                );
              })}
            </div>

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-end">
              {/* User Menu / Auth Button */}
              <div className="relative user-menu">
                {loading ? (
                  <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
                ) : user ? (
                  <>
                    <motion.button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#00d9ff]/30 hover:border-[#00d9ff] transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt={user.user_metadata?.name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#00d9ff] to-purple-500 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] shadow-lg ${
                        isAvailable ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                    </motion.button>

                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute right-0 mt-3 w-64 bg-[var(--bg-primary)] border-2 border-[#00d9ff]/30 rounded-2xl shadow-[0_0_30px_rgba(0,217,255,0.2)] overflow-hidden z-[100000]"
                      >
                        <div className="p-4 border-b border-white/10 bg-gradient-to-br from-[#00d9ff]/10 to-purple-500/10">
                          <div className="flex items-center gap-3">
                            {user.user_metadata?.avatar_url ? (
                              <img
                                src={user.user_metadata.avatar_url}
                                alt={user.user_metadata?.name || 'User'}
                                className="w-12 h-12 rounded-full object-cover border-2 border-[#00d9ff]/50"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d9ff] to-purple-500 flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[var(--text-primary)] truncate">
                                {user.user_metadata?.name || 'User'}
                              </p>
                              <p className="text-xs text-[var(--text-secondary)] truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onOpenProfile();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                          >
                            <User className="w-5 h-5 text-[#00d9ff] group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-[var(--text-primary)]">{t("auth.myProfile")}</span>
                          </button>

                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors group"
                          >
                            <LogIn className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform rotate-180" />
                            <span className="text-sm font-medium text-red-400">{t("auth.signOut")}</span>
                          </button>
                        </div>

                        <div className="p-3 border-t border-white/10 bg-white/5">
                          <p className="text-xs text-[var(--text-secondary)] text-center">
                            Signed in with Google
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <motion.button
                    onClick={() => setShowAuthModal(true)}
                    className="relative px-4 xl:px-5 py-2 xl:py-2.5 bg-gradient-to-r from-[#00d9ff] via-cyan-400 to-[#00d9ff] bg-[length:200%_100%] hover:bg-[position:100%_0] text-black font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:shadow-[0_0_40px_rgba(0,217,255,0.7)] transition-all duration-500 flex items-center gap-2 overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      backgroundPosition: {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear'
                      }
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                        repeatDelay: 1,
                      }}
                    />
                    
                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <LogIn className="w-4 h-4 relative z-10" />
                    </motion.div>
                    
                    <span className="relative z-10 whitespace-nowrap hidden xl:inline">{t("auth.signIn")}</span>
                    
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-[#00d9ff] opacity-0 group-hover:opacity-20"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  </motion.button>
                )}
              </div>

              {/* Language Selector */}
              <div className="relative language-selector">
                <motion.button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors flex items-center gap-1.5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe className="w-5 h-5 text-[var(--text-secondary)]" />
                  <span className="text-xs font-medium text-[var(--text-secondary)] uppercase">
                    {displayLang}
                  </span>
                </motion.button>
                
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden z-[100000]`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-4 py-2 ${isRTL ? 'text-right' : 'text-left'} hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-3 ${
                          language === lang.code ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]" : "text-[var(--text-primary)]"
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
                )}
              </motion.button>

              {/* Enhanced CTA Button */}
              <motion.a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="ml-2 relative px-5 py-2.5 overflow-hidden group rounded-2xl shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-2xl"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl blur opacity-40 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                
                <span className="relative z-10 text-white font-bold text-sm flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    👋
                  </motion.span>
                  {t("nav.hireMe")}
                  <motion.span
                    className="text-lg"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.a>
            </div>

            {/* Tablet/Mobile Menu Button + Controls */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Language Selector for Mobile/Tablet */}
              <div className="relative language-selector">
                <motion.button
                  onClick={() => {
                    setShowLangMenu(!showLangMenu);
                    setShowUserMenu(false);
                  }}
                  className="p-2 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe className="w-5 h-5 text-[var(--text-secondary)]" />
                </motion.button>
                
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 w-40 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden z-[100001]`}
                    >
                      {languages.map((lang) => (
                        <motion.button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLangMenu(false);
                          }}
                          className={`w-full px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} text-sm font-medium transition-all flex items-center justify-between ${
                            language === lang.code
                              ? "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]"
                              : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                          }`}
                          whileHover={{ x: isRTL ? -4 : 4 }}
                        >
                          <span>{lang.label}</span>
                          {language === lang.code && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 rounded-full bg-[var(--accent-primary)]"
                            />
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle for Mobile/Tablet */}
              <motion.button
                onClick={toggleTheme}
                className="p-2 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
                )}
              </motion.button>

              {/* Login Button for Mobile/Tablet (only when not logged in) */}
              {!user && !loading && (
                <motion.button
                  onClick={() => setShowAuthModal(true)}
                  className="p-2 bg-gradient-to-r from-[#00d9ff] to-cyan-400 rounded-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] transition-all flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Sign In"
                >
                  <LogIn className="w-5 h-5 text-black" />
                </motion.button>
              )}

              {/* User Avatar for Mobile/Tablet (only when logged in) */}
              {user && !loading && (
                <motion.button
                  onClick={() => {
                    setIsMobileMenuOpen(true);
                  }}
                  className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#00d9ff]/30 hover:border-[#00d9ff] transition-all flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Profile"
                >
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img
                      src={user.user_metadata.avatar_url || user.user_metadata.picture}
                      alt={user.user_metadata?.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#00d9ff] to-purple-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] shadow-lg ${
                    isAvailable ? 'bg-green-500' : 'bg-orange-500'
                  }`} />
                </motion.button>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setShowLangMenu(false);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-[var(--text-primary)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg"
                aria-label="Toggle menu"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Mobile/Tablet Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-[var(--bg-primary)] z-[99998] overflow-y-auto"
              style={{ 
                top: scrolled ? '64px' : '80px',
                height: scrolled ? 'calc(100vh - 64px)' : 'calc(100vh - 80px)',
              }}
            >
              <div className="min-h-full flex flex-col px-4 sm:px-6 py-6 sm:py-8">
                {/* User Profile Section */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 sm:p-6 bg-gradient-to-br from-[#00d9ff]/10 to-purple-500/10 rounded-2xl border-2 border-[#00d9ff]/30"
                >
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/5 rounded animate-pulse" />
                        <div className="h-3 bg-white/5 rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  ) : user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        {user.user_metadata?.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            alt={user.user_metadata?.name || 'User'}
                            className="w-16 h-16 rounded-full object-cover border-2 border-[#00d9ff]/50"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00d9ff] to-purple-500 flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-lg text-[var(--text-primary)] truncate">
                            {user.user_metadata?.name || 'User'}
                          </p>
                          <p className="text-sm text-[var(--text-secondary)] truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          onClick={() => {
                            onOpenProfile();
                            setIsMobileMenuOpen(false);
                          }}
                          className="px-4 py-3 bg-[#00d9ff]/20 hover:bg-[#00d9ff]/30 rounded-xl transition-colors flex items-center justify-center gap-2"
                          whileTap={{ scale: 0.95 }}
                        >
                          <User className="w-5 h-5 text-[#00d9ff]" />
                          <span className="text-sm font-semibold text-[#00d9ff]">Profile</span>
                        </motion.button>

                        <motion.button
                          onClick={handleSignOut}
                          className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors flex items-center justify-center gap-2"
                          whileTap={{ scale: 0.95 }}
                        >
                          <LogIn className="w-5 h-5 text-red-400 rotate-180" />
                          <span className="text-sm font-semibold text-red-400">Sign Out</span>
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#00d9ff] to-purple-500 flex items-center justify-center">
                        <LogIn className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[var(--text-primary)] mb-1">
                          Welcome!
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          Sign in to unlock exclusive features
                        </p>
                      </div>
                      <motion.button
                        onClick={() => setShowAuthModal(true)}
                        className="w-full py-4 bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(0,217,255,0.3)] flex items-center justify-center gap-3"
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Sign in with Google
                      </motion.button>
                    </div>
                  )}
                </motion.div>

                {/* Navigation Links */}
                <div className="flex-1 flex flex-col justify-center space-y-3 mb-8">
                  {navItems.map((item, index) => {
                    const sectionId = item.href.replace('#', '') || 'home';
                    const isActive = activeSection === sectionId;
                    
                    return (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        onClick={() => handleNavClick(event, item.href)}
                        className={`relative py-5 px-5 sm:py-6 sm:px-6 rounded-2xl transition-all group overflow-hidden ${
                          isActive 
                            ? "bg-gradient-to-r from-[#00d9ff]/20 to-cyan-400/10 border-2 border-[#00d9ff]/50" 
                            : "bg-white/5 backdrop-blur-sm border-2 border-white/10 hover:border-[#00d9ff]/30"
                        }`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#00d9ff]/0 via-[#00d9ff]/10 to-[#00d9ff]/0"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                        
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-3 sm:gap-4">
                            {isActive && (
                              <motion.div
                                layoutId="mobileActiveDot"
                                className="w-3 h-3 bg-[#00d9ff] rounded-full shadow-[0_0_12px_rgba(0,217,255,0.8)]"
                                transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                              />
                            )}
                            <span className={`font-bold text-xl sm:text-2xl ${
                              isActive ? "text-[#00d9ff]" : "text-[var(--text-primary)]"
                            }`}>
                              {item.label}
                            </span>
                          </div>
                          
                          <motion.div
                            animate={{ x: isActive ? 0 : -10 }}
                            whileHover={{ x: 5 }}
                            className="text-[#00d9ff] text-xl"
                          >
                            →
                          </motion.div>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>

                {/* CTA Button */}
                <motion.a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); smoothScrollToSection("#contact"); setIsMobileMenuOpen(false); }}
                  className="relative flex items-center justify-center gap-3 w-full py-5 sm:py-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-2xl font-bold text-lg sm:text-xl shadow-[0_0_30px_rgba(0,217,255,0.5)] overflow-hidden group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  
                  <span className="relative z-10 text-white flex items-center gap-3">
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      👋
                    </motion.span>
                    {t("nav.hireMe")}
                    <motion.span
                      className="text-2xl"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Enhanced Auth Modal */}
      <ModernAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Book Call Modal */}
      <BookCallModal
        isOpen={showBookCallModal}
        onClose={() => setShowBookCallModal(false)}
      />
    </>
  );
}