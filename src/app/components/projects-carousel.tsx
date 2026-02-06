import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink, Github, X, Sparkles, Euro } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/language-context";

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  image: string;
  tech: string[];
  gradient: string;
  stats?: Record<string, string>;
  links?: { live?: string; github?: string };
  price?: number;
  priceWithTax?: number;
  features?: string[];
}

interface ProjectsCarouselProps {
  projects: Project[];
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = projects.length - 1;
      if (newIndex >= projects.length) newIndex = 0;
      return newIndex;
    });
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentProject = projects[currentIndex];
  const nextIndex = (currentIndex + 1) % projects.length;
  const nextProject = projects[nextIndex];

  return (
    <>
      <div className="relative w-full max-w-6xl mx-auto">
        {/* Main Carousel with Peek Effect on Mobile */}
        <div className="relative overflow-visible">
          {/* Desktop: Full width carousel */}
          <div className="hidden md:block relative h-[600px] overflow-hidden rounded-3xl bg-[var(--bg-secondary)]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 25 },
                  opacity: { duration: 0.3 },
                }}
                className="absolute inset-0"
                style={{ willChange: "transform, opacity" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
              >
                <ProjectCard project={currentProject} onOpen={setSelectedProject} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile: Carousel with Peek Effect */}
          <div className="md:hidden relative h-[500px] overflow-visible px-4">
            <div className="relative h-full">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                {/* Current Card */}
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 200, damping: 25 },
                    opacity: { duration: 0.3 },
                  }}
                  className="absolute inset-0 rounded-3xl overflow-hidden bg-[var(--bg-secondary)]"
                  style={{ willChange: "transform, opacity" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                >
                  <ProjectCard project={currentProject} onOpen={setSelectedProject} />
                </motion.div>
              </AnimatePresence>

              {/* Peek Next Card (Mobile) */}
              <motion.div 
                className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none z-10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative h-full overflow-hidden rounded-r-2xl">
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/50 z-10" />
                  <img
                    src={nextProject.image}
                    alt=""
                    className="w-full h-full object-cover scale-110 blur-[2px]"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Navigation Arrows - Desktop Only */}
          <button
            onClick={() => paginate(-1)}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all group"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all group"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-[#00d9ff]"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Thumbnail Preview */}
        <div className="hidden md:flex items-center justify-center gap-4 mt-6 overflow-x-auto pb-4">
          {projects.map((project, index) => (
            <motion.button
              key={project.id}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-[#00d9ff] scale-110"
                  : "border-white/20 opacity-50 hover:opacity-100"
              }`}
              whileHover={{ scale: index === currentIndex ? 1.1 : 1.05 }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-[#00d9ff]/20" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:bg-black/70 transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="overflow-y-auto max-h-[90vh]">
                {/* Header Image */}
                <div className="relative h-64 md:h-80">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${selectedProject.gradient} opacity-60`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 -mt-20 relative">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${selectedProject.gradient} mb-4`}>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white">{selectedProject.category}</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                    {selectedProject.title}
                  </h2>

                  <p className="text-lg text-[var(--text-secondary)] mb-6">
                    {selectedProject.longDescription || selectedProject.description}
                  </p>

                  {/* Price */}
                  {selectedProject.price && (
                    <div className="mb-8 p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-4xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                          <Euro className="w-8 h-8 text-[#00d9ff]" />
                          {selectedProject.priceWithTax?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Base price: €{selectedProject.price?.toLocaleString()} + 21% BTW (Belgian tax)
                      </p>
                    </div>
                  )}

                  {/* Tech Stack */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.tech.map((tech) => (
                        <span
                          key={tech}
                          className={`px-4 py-2 bg-gradient-to-r ${selectedProject.gradient} bg-opacity-10 border border-[var(--card-border)] rounded-xl text-sm font-medium text-[var(--text-primary)]`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  {selectedProject.features && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Key Features</h3>
                      <ul className="space-y-3">
                        {selectedProject.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${selectedProject.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                            <span className="text-[var(--text-secondary)]">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Stats */}
                  {selectedProject.stats && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Project Stats</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(selectedProject.stats).map(([key, value]) => (
                          <div key={key} className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl">
                            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">{value}</div>
                            <div className="text-sm text-[var(--text-secondary)] capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {selectedProject.links && (
                    <div className="flex flex-wrap gap-4">
                      {selectedProject.links.live && (
                        <a
                          href={selectedProject.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${selectedProject.gradient} text-white font-bold rounded-xl hover:opacity-90 transition-all`}
                        >
                          <ExternalLink className="w-5 h-5" />
                          <span>Visit Live Site</span>
                        </a>
                      )}
                      {selectedProject.links.github && (
                        <a
                          href={selectedProject.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] font-bold rounded-xl hover:border-[var(--accent-primary)] transition-all"
                        >
                          <Github className="w-5 h-5" />
                          <span>View Code</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <div 
      className="relative w-full h-full group cursor-pointer"
      onClick={() => onOpen(project)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {/* Category Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${project.gradient} mb-4`}>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold text-white">{project.category}</span>
          </div>

          {/* Title */}
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Price if available */}
          {project.price && (
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white flex items-center gap-1">
                  <Euro className="w-6 h-6" />
                  {project.priceWithTax?.toLocaleString()}
                </span>
                <span className="text-sm text-white/70">(incl. 21% BTW)</span>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(project);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all group/btn"
          >
            <span>View Details</span>
            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}