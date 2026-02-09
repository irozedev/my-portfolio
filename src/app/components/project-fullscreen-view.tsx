import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Calendar, Users, Zap, Star, Clock, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { ProjectComments } from './project-comments';
import { ProjectReactions } from './project-reactions';
import { useEffect, useState } from 'react';

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
  const [scrollY, setScrollY] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);

  if (!project) return null;

  // Generate project ID if not provided
  const projectId = project.id || project.title.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    // Handle ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollY(scrollTop);
    if (scrollTop > 100) setShowScrollHint(false);
  };

  return (
    <AnimatePresence>
      {/* 🔥 FULL-SCREEN SLIDE-IN VIEW - DEVELOPER STYLE */}
      <motion.div
        key="project-view"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ 
          type: "spring", 
          damping: 30, 
          stiffness: 300,
          mass: 0.8
        }}
        className="fixed inset-0 z-[100000] bg-[var(--bg-primary)] overflow-hidden"
      >
        {/* 🔥 FIXED HEADER - GLASSMORPHISM */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrollY > 50 
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
              <span className="hidden sm:inline text-sm font-bold text-[var(--text-primary)] font-mono">BACK</span>
            </motion.button>

            {/* Project Title - Hidden on scroll down */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: scrollY > 50 ? 1 : 0, y: scrollY > 50 ? 0 : -10 }}
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
                title="Previous Project (Arrow Left)"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
              </motion.button>
              
              <motion.button
                onClick={onNext}
                disabled={!hasNext}
                className="p-2.5 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                whileHover={hasNext ? { scale: 1.1 } : {}}
                whileTap={hasNext ? { scale: 0.9 } : {}}
                title="Next Project (Arrow Right)"
              >
                <ArrowRight className="w-5 h-5 text-[var(--text-primary)]" />
              </motion.button>

              <motion.button
                onClick={onClose}
                className="p-2.5 bg-red-500/10 backdrop-blur-xl border-2 border-red-500/30 hover:border-red-500/60 hover:bg-red-500/20 rounded-xl transition-all group active:scale-95"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                title="Close (Esc)"
              >
                <X className="w-5 h-5 text-red-400" />
              </motion.button>
            </div>

            {/* Close Button - Mobile */}
            <motion.button
              onClick={onClose}
              className="sm:hidden p-2.5 bg-red-500/10 backdrop-blur-xl border-2 border-red-500/30 hover:border-red-500/60 rounded-xl transition-all active:scale-95"
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-red-400" />
            </motion.button>
          </div>
        </motion.div>

        {/* 🔥 SCROLLABLE CONTENT */}
        <div 
          className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--accent-primary)]/30 scrollbar-track-transparent pt-20"
          onScroll={handleScroll}
        >
          {/* 🔥 HERO IMAGE - PARALLAX EFFECT */}
          <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
            <motion.img
              style={{
                y: scrollY * 0.5,
                scale: 1 + scrollY * 0.0005,
              }}
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
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
                ⭐ FEATURED
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
                    <span className="text-xs font-mono text-[var(--accent-primary)] font-bold">SCROLL DOWN</span>
                    <ChevronDown className="w-4 h-4 text-[var(--accent-primary)]" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 🔥 MAIN CONTENT SECTION */}
          <div className="relative bg-[var(--bg-primary)]">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
              
              {/* 🔥 TITLE SECTION */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 sm:mb-12"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-white via-[var(--accent-primary)] to-purple-500 bg-clip-text text-transparent leading-tight">
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
                    Tech Stack
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
                      Key Metrics
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
                          <p className="text-2xl sm:text-3xl font-black text-white mb-1 font-mono">
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
                      About This Project
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
                      Key Features
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
                    VIEW LIVE
                  </motion.a>
                )}
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-6 py-4 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] hover:border-[var(--accent-primary)]/50 text-white font-mono font-black text-sm sm:text-base transition-all flex items-center justify-center gap-3 group active:scale-95"
                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    VIEW CODE
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
                <span className="font-mono font-bold text-sm">PREV</span>
              </motion.button>
              
              <motion.button
                onClick={onNext}
                disabled={!hasNext}
                className="flex-1 px-4 py-3 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-95"
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                whileTap={hasNext ? { scale: 0.95 } : {}}
              >
                <span className="font-mono font-bold text-sm">NEXT</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
