import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Calendar, Users, Zap, Star, Clock } from 'lucide-react';
import { ProjectComments } from './project-comments';
import { ProjectReactions } from './project-reactions';
import { useEffect, useRef } from 'react';

interface Project {
  id?: string;
  title: string;
  subtitle: string;
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
  team?: string;
}

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  // Generate project ID if not provided
  const projectId = project.id || project.title.toLowerCase().replace(/\s+/g, '-');
  
  // USE REF to keep scroll position updated
  const scrollYRef = useRef(0);

  useEffect(() => {
    // Save current scroll position
    scrollYRef.current = window.scrollY;
    
    // Prevent scrolling - SIMPLE METHOD
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore body styles
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {/* 🔥 PREMIUM BACKDROP - DEVELOPER STYLE */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[100002]"
      />

      {/* 🔥 MODAL CONTAINER - ZOOM + SLIDE ANIMATION - NO OUTER SCROLL */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ 
          type: "spring", 
          damping: 30, 
          stiffness: 300,
        }}
        className="fixed inset-0 z-[100003] flex items-center justify-center p-0 sm:p-4 md:p-6"
        onClick={handleClose}
      >
        {/* 🔥 PREMIUM CARD - GLASSMORPHISM - OPTIMIZED FOR MOBILE */}
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="relative bg-[var(--bg-primary)] border-0 sm:border-2 border-[var(--accent-primary)]/30 rounded-none sm:rounded-2xl md:rounded-3xl w-full h-full sm:h-auto sm:max-w-3xl md:max-w-4xl lg:max-w-5xl shadow-[0_20px_80px_rgba(0,217,255,0.4)] flex flex-col sm:max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 via-transparent to-purple-500/5 pointer-events-none" />

          {/* 🔥 FLOATING CLOSE BUTTON - MOBILE OPTIMIZED */}
          <motion.button
            onClick={handleClose}
            className="fixed top-2 right-2 sm:absolute sm:top-6 sm:right-6 p-3 sm:p-3 rounded-xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] hover:border-[var(--accent-primary)]/50 hover:bg-red-500/20 transition-all z-[100002] group shadow-lg"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6 sm:w-6 sm:h-6 text-white group-hover:text-red-400 transition-colors" />
          </motion.button>

          {/* CONTENT - NO SCROLL */}
          <div className="relative flex-1">
            
            {/* 🔥 HERO IMAGE - PREMIUM GRADIENT OVERLAY */}
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} mix-blend-overlay`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
              
              {/* Featured Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-4 right-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 text-white font-mono font-bold text-xs sm:text-sm rounded-lg shadow-[0_4px_20px_rgba(0,217,255,0.5)]"
              >
                FEATURED
              </motion.div>

              {/* Project Type Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-4 left-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] text-[var(--text-primary)] font-mono font-bold text-xs sm:text-sm rounded-lg"
              >
                {project.subtitle}
              </motion.div>
            </div>

            {/* CONTENT SECTION */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-10">
              
              {/* 🔥 HEADER - PREMIUM TITLE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 sm:mb-8"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-white via-[var(--accent-primary)] to-purple-500 bg-clip-text text-transparent leading-tight">
                  {project.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] mb-4 sm:mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {project.timeline && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-lg">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--accent-primary)]" />
                      <span className="text-xs sm:text-sm text-[var(--text-secondary)] font-mono">{project.timeline}</span>
                    </div>
                  )}
                  {project.team && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-lg">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                      <span className="text-xs sm:text-sm text-[var(--text-secondary)] font-mono">{project.team}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* 🔥 TECH STACK - DEVELOPER PILLS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 sm:mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--glass-border)]" />
                  <h3 className="text-sm sm:text-base font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Tech Stack
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--glass-border)]" />
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {project.tech.map((tech, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/10 border border-[var(--accent-primary)]/30 rounded-lg text-xs sm:text-sm font-mono font-bold text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/60 hover:bg-[var(--accent-primary)]/20 transition-all cursor-default"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* 🔥 METRICS - PREMIUM CARDS */}
              {project.metrics && project.metrics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 sm:mb-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--glass-border)]" />
                    <h3 className="text-sm sm:text-base font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Key Metrics
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--glass-border)]" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {project.metrics.map((metric, index) => {
                      const Icon = metric.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="p-4 sm:p-6 bg-gradient-to-br from-[var(--glass-bg)] to-[var(--bg-tertiary)] border border-[var(--glass-border)] rounded-xl hover:border-[var(--accent-primary)]/50 hover:shadow-[0_8px_30px_rgba(0,217,255,0.2)] transition-all group"
                        >
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-primary)] mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                          <p className="text-xl sm:text-2xl font-black text-white mb-1 font-mono">
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

              {/* 🔥 DESCRIPTION - PREMIUM TEXT BLOCK */}
              {project.fullDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6 sm:mb-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--glass-border)]" />
                    <h3 className="text-sm sm:text-base font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      About This Project
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--glass-border)]" />
                  </div>
                  <div className="p-4 sm:p-6 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-xl">
                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                      {project.fullDescription}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 🔥 FEATURES - CHECKLIST STYLE */}
              {project.features && project.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6 sm:mb-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--glass-border)]" />
                    <h3 className="text-sm sm:text-base font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Key Features
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--glass-border)]" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {project.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-lg hover:border-[var(--accent-primary)]/40 transition-all group"
                      >
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-primary)] flex-shrink-0 mt-0.5 group-hover:text-yellow-400 transition-colors" />
                        <span className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 🔥 ACTION BUTTONS - PREMIUM STYLE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8 sm:mb-12 flex flex-wrap gap-3 sm:gap-4"
              >
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 text-white font-mono font-bold text-sm sm:text-base rounded-xl hover:shadow-[0_8px_30px_rgba(0,217,255,0.6)] transition-all flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                    View Live
                  </motion.a>
                )}
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 sm:py-3 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] hover:border-[var(--accent-primary)]/50 text-white font-mono font-bold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                    View Code
                  </motion.a>
                )}
              </motion.div>

              {/* DIVIDER */}
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent mb-8 sm:mb-12" />

              {/* 🔥 REACTIONS SECTION */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-8 sm:mb-12"
              >
                <ProjectReactions projectId={projectId} />
              </motion.div>

              {/* 🔥 COMMENTS SECTION */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <ProjectComments projectId={projectId} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}