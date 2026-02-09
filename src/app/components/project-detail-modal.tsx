import { motion } from 'motion/react';
import { X, ExternalLink, Github, Calendar, Users, Zap } from 'lucide-react';
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
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = '100%';
    
    return () => {
      const scrollY = scrollYRef.current;
      
      // Restore body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position IMMEDIATELY (no animation)
      window.scrollTo(0, scrollY);
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
    <>
      {/* Backdrop - DARK THEME */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100000]"
      />

      {/* Modal - ZOOM IN/OUT ANIMATION */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          duration: 0.3 
        }}
        className="fixed inset-0 z-[100001] overflow-y-auto"
        onClick={handleClose}
      >
        <div className="min-h-full flex items-start justify-center p-4 sm:p-6 lg:p-8">
          <div 
            className="bg-[var(--bg-primary)] border-2 border-[#00d9ff]/30 rounded-3xl w-full max-w-5xl shadow-[0_0_100px_rgba(0,217,255,0.3)] my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="sticky top-4 float-right mr-4 sm:mr-6 mt-4 sm:mt-6 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Content */}
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} mix-blend-overlay`} />
                
                {/* Floating Badge */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-[#00d9ff]/90 backdrop-blur-sm text-black font-bold rounded-full shadow-lg">
                  Featured
                </div>
              </motion.div>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <p className="text-sm sm:text-base text-[#00d9ff] font-semibold mb-2">
                  {project.subtitle}
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-[#00d9ff] to-purple-500 bg-clip-text text-transparent">
                  {project.title}
                </h2>
                <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-6">
                  {project.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                  {project.timeline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#00d9ff]" />
                      {project.timeline}
                    </div>
                  )}
                  {project.team && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#00d9ff]" />
                      {project.team}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white/5 border border-[#00d9ff]/30 rounded-xl text-sm font-medium text-[#00d9ff] hover:bg-[#00d9ff]/10 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {project.metrics.map((metric, index) => {
                      const Icon = metric.icon;
                      return (
                        <div
                          key={index}
                          className="p-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl hover:border-[#00d9ff]/50 transition-colors"
                        >
                          <Icon className="w-6 h-6 text-[#00d9ff] mb-3" />
                          <p className="text-2xl font-bold text-white mb-1">
                            {metric.value}
                          </p>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {metric.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Full Description */}
              {project.fullDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                    About This Project
                  </h3>
                  <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                    {project.fullDescription}
                  </p>
                </motion.div>
              )}

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8"
                >
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {project.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-[var(--text-secondary)]"
                      >
                        <Zap className="w-5 h-5 text-[#00d9ff] flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-12 flex flex-wrap gap-4"
              >
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:from-[#00b8dd] hover:to-cyan-300 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View Live
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <Github className="w-5 h-5" />
                    View Code
                  </a>
                )}
              </motion.div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#00d9ff]/50 to-transparent mb-12" />

              {/* Reactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-12"
              >
                <ProjectReactions projectId={projectId} />
              </motion.div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#00d9ff]/50 to-transparent mb-12" />

              {/* Comments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <ProjectComments projectId={projectId} projectName={project.title} />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}