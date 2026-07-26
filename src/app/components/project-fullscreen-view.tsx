import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Calendar, Users, Zap, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { ProjectComments } from './project-comments';
import { ProjectReactions } from './project-reactions';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/language-context';

interface Project {
  id?: string;
  title: string;
  subtitle?: string;
  category?: string;
  description: string;
  image: string;
  tech: string[];
  metrics?: Array<{ icon: any; label: string; value: string }>;
  gradient: string;
  liveUrl?: string;
  githubUrl?: string;
  fullDescription?: string;
  features?: string[];
  timeline?: string;
  year?: string;
  duration?: string;
  team?: string;
  role?: string;
}

interface ProjectFullscreenViewProps {
  project: Project;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export function ProjectFullscreenView({ 
  project, 
  onClose, 
  onNext, 
  onPrev,
  hasNext = false,
  hasPrev = false 
}: ProjectFullscreenViewProps) {
  const [scrolled, setScrolled] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const { language } = useLanguage();
  const L = (en: string, uk: string, nl: string, ar: string, es: string) =>
    language === 'uk' ? uk : language === 'nl' ? nl : language === 'ar' ? ar : language === 'es' ? es : en;

  // NOTE: no early return above this line. `if (!project) return null` used to
  // sit here, which skipped the two effects below whenever project was null —
  // React then saw a different number of hooks between renders and threw
  // "Rendered more hooks than during the previous render". The guard now lives
  // after every hook, and each effect no-ops when there is no project.
  const projectId = project
    ? project.id || project.title.toLowerCase().replace(/\s+/g, '-')
    : '';

  useEffect(() => {
    if (!project) return;

    // Save current scroll position BEFORE locking
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    // Lock body scroll and PRESERVE position
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = `-${scrollX}px`;
    document.body.style.width = '100%';
    
    // Handle ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      // Restore body styles and scroll position
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      
      // Restore scroll position
      window.scrollTo(scrollX, scrollY);
      
      window.removeEventListener('keydown', handleEscape);
    };
  }, [project, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!project) return null;

  // Only update state when crossing thresholds — avoids a re-render of this
  // large modal on every scroll frame (which made mobile scrolling janky).
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrolled((prev) => {
      const next = scrollTop > 50;
      return prev === next ? prev : next;
    });
    if (scrollTop > 100) {
      setShowScrollHint((prev) => (prev ? false : prev));
    }
  };

  return (
    <AnimatePresence>
      {/* 🔥 FULL-SCREEN IMMERSIVE VIEW - ZOOM IN EFFECT */}
      <motion.div
        key="project-view"
        initial={{ 
          opacity: 0,
          scale: 0.9,
          y: 20
        }}
        animate={{ 
          opacity: 1,
          scale: 1,
          y: 0
        }}
        exit={{ 
          opacity: 0,
          scale: 0.95,
          y: 20
        }}
        transition={{ 
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth entrance
        }}
        className="fixed inset-0 z-[100000] bg-[var(--bg-primary)] overflow-hidden"
      >
        {/* 🔥 FIXED HEADER - GLASSMORPHISM */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? 'bg-[var(--bg-primary)]/95 backdrop-blur-xl border-b border-[var(--border-color)] shadow-lg'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
            {/* Back Button - MOBILE TAP INDICATOR */}
            <motion.button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 rounded-xl transition-all group active:scale-95"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--accent-primary)] group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline text-sm font-bold text-[var(--text-primary)] font-mono">{L("BACK", "НАЗАД", "TERUG", "رجوع", "ATRÁS")}</span>
            </motion.button>

            {/* Project Title - Hidden on scroll down */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : -10 }}
              className="flex-1 text-center hidden md:block"
            >
              <h3 className="text-lg font-black text-[var(--text-primary)] font-mono truncate">
                {project.title}
              </h3>
            </motion.div>

            {/* Navigation Arrows - Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <motion.button
                onClick={onPrev}
                disabled={!hasPrev}
                className="p-2.5 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                whileHover={hasPrev ? { scale: 1.1 } : {}}
                whileTap={hasPrev ? { scale: 0.9 } : {}}
                title={L("Previous project (Arrow Left)", "Попередній проєкт (←)", "Vorig project (←)", "المشروع السابق (←)", "Proyecto anterior (←)")}
              >
                <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
              </motion.button>
              
              <motion.button
                onClick={onNext}
                disabled={!hasNext}
                className="p-2.5 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                whileHover={hasNext ? { scale: 1.1 } : {}}
                whileTap={hasNext ? { scale: 0.9 } : {}}
                title={L("Next project (Arrow Right)", "Наступний проєкт (→)", "Volgend project (→)", "المشروع التالي (→)", "Proyecto siguiente (→)")}
              >
                <ArrowRight className="w-5 h-5 text-[var(--text-primary)]" />
              </motion.button>

              <motion.button
                onClick={onClose}
                className="p-2.5 bg-red-500/10 backdrop-blur-xl border-2 border-red-500/30 hover:border-red-500/60 hover:bg-red-500/20 rounded-xl transition-all group active:scale-95"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                title={L("Close (Esc)", "Закрити (Esc)", "Sluiten (Esc)", "إغلاق (Esc)", "Cerrar (Esc)")}
              >
                <X className="w-5 h-5 text-red-400" />
              </motion.button>
            </div>

            {/* Close Button - Mobile */}
            <motion.button aria-label={L("Close", "Закрити", "Sluiten", "إغلاق", "Cerrar")}
              onClick={onClose}
              className="sm:hidden p-2.5 bg-red-500/10 backdrop-blur-xl border-2 border-red-500/30 hover:border-red-500/60 rounded-xl transition-all active:scale-95"
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-red-400" />
            </motion.button>
          </div>
        </motion.div>

        {/* 🔥 SCROLLABLE CONTENT */}
        {/* `overflow-x-hidden` is load-bearing, not decoration. `overflow-y:
            auto` on its own computes overflow-x to `auto` as well, so the
            600px ambient glow below (wider than any phone) gave this container
            a real horizontal scroll range. The page could be dragged sideways
            and every section looked narrower than the screen — that is the
            mobile width bug. */}
        <div
          className="h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain [-webkit-overflow-scrolling:touch] scrollbar-thin scrollbar-thumb-[var(--accent-primary)]/30 scrollbar-track-transparent pt-20"
          onScroll={handleScroll}
        >
          {/* 🔥 HERO IMAGE — full screenshot, anchored to top, no parallax gap */}
          <div className="relative h-[38vh] sm:h-[46vh] md:h-[54vh] lg:h-[62vh] overflow-hidden bg-[var(--bg-secondary)]">
            <img
              src={project.image}
              alt={project.title}
              // This is the LCP element once the fullscreen view opens, so it
              // must not be lazy — the view only mounts on demand anyway.
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-top"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            
            {/* Gradient Overlays */}
            <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} mix-blend-overlay opacity-60`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/50 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-6 left-4 sm:left-6 flex flex-col gap-3">
              {project.category && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-4 py-2 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] text-[var(--text-primary)] font-mono font-bold text-xs sm:text-sm rounded-lg shadow-lg"
                >
                  {project.category}
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="px-4 py-2 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 text-white font-mono font-bold text-xs sm:text-sm rounded-lg shadow-[0_4px_20px_rgba(0,217,255,0.5)]"
              >
                {L("⭐ FEATURED", "⭐ ОБРАНЕ", "⭐ UITGELICHT", "⭐ مميّز", "⭐ DESTACADO")}
              </motion.div>
            </div>

            {/* Project Stats - Floating */}
            {(project.year || project.duration) && (
              <div className="absolute bottom-6 right-4 sm:right-6 flex flex-col gap-2">
                {project.year && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="px-3 py-1.5 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] text-[var(--accent-primary)] font-mono font-bold text-xs rounded-lg text-right"
                  >
                    {project.year}
                  </motion.div>
                )}
                {project.duration && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="px-3 py-1.5 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] text-[var(--text-secondary)] font-mono text-xs rounded-lg text-right"
                  >
                    {project.duration}
                  </motion.div>
                )}
              </div>
            )}

            {/* Scroll Hint - MOBILE INDICATOR */}
            <AnimatePresence>
              {showScrollHint && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex flex-col items-center gap-2 px-4 py-3 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--accent-primary)]/50 rounded-full shadow-lg"
                  >
                    <span className="text-xs font-mono text-[var(--accent-primary)] font-bold">{L("SCROLL DOWN", "ЛИСТАЙ НИЖЧЕ", "SCROLL OMLAAG", "مرّر لأسفل", "DESLIZA")}</span>
                    <ChevronDown className="w-4 h-4 text-[var(--accent-primary)]" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 🔥 MAIN CONTENT SECTION */}
          <div className="relative w-full max-w-full overflow-x-hidden bg-[var(--bg-primary)]">
            {/* Background Glow — sized against the viewport so it can never be
                wider than the screen it sits on. */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(600px,100%)] h-[600px] bg-[var(--accent-primary)]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 pb-28 sm:pb-16">
              
              {/* 🔥 TITLE SECTION */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 sm:mb-12"
              >
                {/* Anchored to the text token, not `white` — this heading sits
                    on --bg-primary, so a white gradient stop disappeared in
                    the light theme. */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-purple-500 bg-clip-text text-transparent leading-tight">
                  {project.title}
                </h1>
                
                {project.role && (
                  <p className="text-base sm:text-lg md:text-xl text-[var(--accent-primary)] font-mono font-bold mb-4">
                    {project.role}
                  </p>
                )}
                
                <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                  {project.description}
                </p>

                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-3 mt-6">
                  {project.timeline && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-xl">
                      <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                      <span className="text-sm text-[var(--text-secondary)] font-mono">{project.timeline}</span>
                    </div>
                  )}
                  {project.team && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-xl">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-[var(--text-secondary)] font-mono">{project.team}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* 🔥 TECH STACK - ANGULAR CORNERS */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 sm:mb-12"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[var(--accent-primary)]/50" />
                  <h3 className="text-sm sm:text-base font-mono font-black text-[var(--text-primary)] uppercase tracking-wider">
                    {L("Tech Stack", "Стек", "Tech-stack", "التقنيات", "Stack")}
                  </h3>
                  <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[var(--accent-primary)]/50" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.tech.map((tech, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2.5 bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/10 border-2 border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)]/60 text-sm font-mono font-bold text-[var(--accent-primary)] transition-all cursor-pointer active:scale-95"
                      style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* 🔥 METRICS - PREMIUM CARDS */}
              {project.metrics && project.metrics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 sm:mb-12"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[var(--accent-primary)]/50" />
                    <h3 className="text-sm sm:text-base font-mono font-black text-[var(--text-primary)] uppercase tracking-wider">
                      {L("Key Metrics", "Ключові метрики", "Kerncijfers", "مقاييس رئيسية", "Métricas clave")}
                    </h3>
                    <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[var(--accent-primary)]/50" />
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {project.metrics.map((metric, index) => {
                      const Icon = metric.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="p-6 bg-gradient-to-br from-[var(--glass-bg)] to-[var(--bg-tertiary)] border-2 border-[var(--glass-border)] hover:border-[var(--accent-primary)]/50 hover:shadow-[0_8px_30px_rgba(0,217,255,0.3)] transition-all group cursor-pointer active:scale-95"
                          style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                        >
                          <Icon className="w-6 h-6 text-[var(--accent-primary)] mb-3 group-hover:scale-110 transition-transform" />
                          <p className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-1 font-mono">
                            {metric.value}
                          </p>
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-mono">
                            {metric.label}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* 🔥 DESCRIPTION */}
              {project.fullDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8 sm:mb-12"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[var(--accent-primary)]/50" />
                    <h3 className="text-sm sm:text-base font-mono font-black text-[var(--text-primary)] uppercase tracking-wider">
                      {L("About This Project", "Про проєкт", "Over dit project", "عن هذا المشروع", "Sobre el proyecto")}
                    </h3>
                    <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[var(--accent-primary)]/50" />
                  </div>
                  <div className="p-6 sm:p-8 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)]" style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                      {project.fullDescription}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 🔥 FEATURES - CHECKLIST */}
              {project.features && project.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8 sm:mb-12"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[var(--accent-primary)]/50" />
                    <h3 className="text-sm sm:text-base font-mono font-black text-[var(--text-primary)] uppercase tracking-wider">
                      {L("Key Features", "Ключове", "Belangrijkste onderdelen", "أبرز الميزات", "Claves")}
                    </h3>
                    <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[var(--accent-primary)]/50" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {project.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-start gap-3 p-4 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] hover:border-[var(--accent-primary)]/40 transition-all group cursor-pointer active:scale-95"
                        style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                      >
                        <Zap className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 mt-0.5 group-hover:text-yellow-400 transition-colors" />
                        <span className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 🔥 ACTION BUTTONS - CLEAR TAP INDICATORS */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-12 flex flex-wrap gap-4"
              >
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-6 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 text-white font-mono font-black text-sm sm:text-base hover:shadow-[0_8px_40px_rgba(0,217,255,0.7)] transition-all flex items-center justify-center gap-3 group active:scale-95"
                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    {L("VIEW LIVE", "ВІДКРИТИ САЙТ", "LIVE BEKIJKEN", "افتح الموقع", "VER EN VIVO")}
                  </motion.a>
                )}
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-6 py-4 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] hover:border-[var(--accent-primary)]/50 text-[var(--text-primary)] font-mono font-black text-sm sm:text-base transition-all flex items-center justify-center gap-3 group active:scale-95"
                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    {L("VIEW CODE", "КОД", "CODE BEKIJKEN", "الكود", "VER CÓDIGO")}
                  </motion.a>
                )}
              </motion.div>

              {/* DIVIDER */}
              <div className="h-0.5 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent mb-12" />

              {/* 🔥 REACTIONS */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-12"
              >
                <ProjectReactions projectId={projectId} />
              </motion.div>

              {/* 🔥 COMMENTS */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <ProjectComments projectId={projectId} />
              </motion.div>
            </div>
          </div>

          {/* 🔥 MOBILE NAVIGATION - BOTTOM */}
          <div className="sm:hidden sticky bottom-0 left-0 right-0 bg-[var(--bg-primary)]/95 backdrop-blur-xl border-t-2 border-[var(--border-color)] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <motion.button
                onClick={onPrev}
                disabled={!hasPrev}
                className="flex-1 px-4 py-3 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-95"
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                whileTap={hasPrev ? { scale: 0.95 } : {}}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-mono font-bold text-sm">{L("PREV", "НАЗАД", "VORIGE", "السابق", "ANTERIOR")}</span>
              </motion.button>
              
              <motion.button
                onClick={onNext}
                disabled={!hasNext}
                className="flex-1 px-4 py-3 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-95"
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                whileTap={hasNext ? { scale: 0.95 } : {}}
              >
                <span className="font-mono font-bold text-sm">{L("NEXT", "ДАЛЕЕ", "VOLGENDE", "التالي", "SIGUIENTE")}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}