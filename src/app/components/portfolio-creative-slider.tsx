import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "@/styles/slick.css";
import { 
  Sparkles, 
  Heart, 
  Code2, 
  ExternalLink,
  Github,
  Calendar,
  Users,
  Zap,
  Award,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Keyboard,
  Hand,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useFavorites } from "../hooks/use-favorites";
import { useSliderNavigation } from "../hooks/use-slider-navigation";
import { ProjectFullscreenView } from "./project-fullscreen-view";
import { AnimatePresence } from "motion/react";

// Real, curated projects. Screenshots are captured once and served as static
// assets from /public/projects (no runtime API dependency, no rate limits).
// A gradient fallback shows if an image ever fails to load.
const projects = [
  {
    id: 'marinek-store',
    title: "marinek.store",
    category: "Freelance · Landing & Payments",
    description: "Commercial Next.js 14 landing for a fitness coaching program — payments, analytics and automated access delivery.",
    fullDescription: "Designed, built and launched marinek.store end-to-end: a Next.js 14 landing site with three pricing tiers, WayForPay payment integration, GA4 analytics and automated post-payment access delivery via a Telegram bot. Payment webhooks run on Cloudflare Workers. Shipped to production in July 2026 with an AI-assisted workflow.",
    image: "/projects/marinek.webp",
    tech: ["Next.js 14", "TypeScript", "WayForPay", "Cloudflare Workers", "Telegram Bot", "GA4"],
    gradient: "from-cyan-500 to-blue-600",
    stats: {
      launched: "2026",
      stack: "Next 14",
      payments: "WayForPay",
      automation: "Telegram",
    },
    year: "2026",
    duration: "Freelance",
    team: "Solo",
    role: "Full ownership (design → launch)",
    liveUrl: "https://marinek.store",
    featured: true,
  },
  {
    id: 'roze-live',
    title: "roze.live",
    category: "Personal · Portfolio",
    description: "This portfolio — a multilingual React/TypeScript site with dark mode, view modes and live GitHub data.",
    fullDescription: "My personal portfolio built with React, TypeScript, Tailwind and Vite. Features five languages, light/dark theming, client & company view modes, motion-based animations, a contact pipeline and a live GitHub projects feed.",
    image: "/projects/roze.webp",
    tech: ["React", "TypeScript", "Tailwind", "Vite", "Motion"],
    gradient: "from-teal-500 to-cyan-600",
    stats: {
      stack: "React",
      lang: "TypeScript",
      i18n: "5 langs",
      type: "Portfolio",
    },
    year: "2026",
    duration: "Personal",
    team: "Solo",
    role: "Design & Development",
    liveUrl: "https://roze.live",
    githubUrl: "https://github.com/irozedev",
    featured: false,
  },
];

// Custom Arrow Components
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute left-0 md:-left-20 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-purple-500/30 rounded-full flex items-center justify-center hover:from-purple-500/30 hover:to-pink-500/30 hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.3)] group"
    aria-label="Previous project"
  >
    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-purple-400 group-hover:scale-110 transition-transform" />
  </button>
);

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute right-0 md:-right-20 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-purple-500/30 rounded-full flex items-center justify-center hover:from-purple-500/30 hover:to-pink-500/30 hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.3)] group"
    aria-label="Next project"
  >
    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-purple-400 group-hover:scale-110 transition-transform" />
  </button>
);

export function PortfolioCreativeSlider() {
  const { t } = useLanguage();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  // Initialize isMobile based on window size to prevent flashing
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const sliderRef = useRef<Slider>(null);
  const [isProcessingClick, setIsProcessingClick] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enable advanced navigation (keyboard + touch swipe)
  useSliderNavigation({
    sliderRef,
    totalSlides: projects.length,
    enableKeyboard: true,
    enableSwipe: true,
  });

  // 🔥 FIX: Debounced project click handler with swipe detection
  const handleProjectClick = (project: typeof projects[0], index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Don't trigger click if it was a drag/swipe
    if (isDragging) {
      setIsDragging(false);
      return;
    }
    
    if (isProcessingClick) return;
    
    const isActive = index === currentSlide;
    
    if (isActive) {
      setIsProcessingClick(true);
      setSelectedProject(project);
      
      setTimeout(() => {
        setIsProcessingClick(false);
      }, 600);
    } else {
      sliderRef.current?.slickGoTo(index);
    }
  };

  // 🔥 NEW: Touch handlers to detect swipe vs click
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    
    // If moved more than 15px, it's a drag
    if (deltaX > 15 || deltaY > 15) {
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const isFavorite = (projectId: string) => {
    return favorites.some(fav => fav.projectId === projectId);
  };

  const handleToggleFavorite = (project: typeof projects[0]) => {
    if (isFavorite(project.id)) {
      removeFavorite(project.id);
    } else {
      addFavorite({
        projectId: project.id,
        projectName: project.title,
        projectImage: project.image,
        type: 'project',
      });
    }
  };

  // Dynamic initial settings based on screen size
  const settings = {
    dots: projects.length > 1,
    infinite: isMobile ? projects.length > 1 : projects.length > 2,
    speed: 700,
    slidesToShow: isMobile ? 1 : Math.min(3, projects.length),
    slidesToScroll: 1,
    centerMode: projects.length > 2,
    centerPadding: isMobile ? "40px" : "0px",
    autoplay: projects.length > 2,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    swipeToSlide: true,
    touchThreshold: 25, // 🔥 INCREASED from 10 to 25 for better swipe detection
    variableWidth: false,
    adaptiveHeight: false,
    arrows: !isMobile,
    beforeChange: (_current: number, next: number) => {
      setCurrentSlide(next);
      setIsDragging(false); // Reset dragging state on slide change
    },
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(3, projects.length),
          centerMode: projects.length > 2,
          centerPadding: "0px",
          swipeToSlide: true,
          variableWidth: false,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "60px",
          arrows: false,
          swipeToSlide: true,
          variableWidth: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "40px",
          arrows: false,
          swipeToSlide: true,
          variableWidth: false,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "30px",
          arrows: false,
          swipeToSlide: true,
          variableWidth: false,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "20px",
          arrows: false,
          swipeToSlide: true,
          variableWidth: false,
        }
      },
      {
        breakpoint: 368,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "10px",
          arrows: false,
          swipeToSlide: true,
          variableWidth: false,
        }
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "5px",
          arrows: false,
          swipeToSlide: true,
          variableWidth: false,
        }
      }
    ],
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-purple-500/50 transition-all duration-300" />
    ),
    appendDots: (dots: React.ReactNode) => (
      <div className="mt-12">
        <ul className="flex items-center justify-center gap-3"> {dots} </ul>
      </div>
    ),
  };

  return (
    <section
      id="projects"
      className="relative py-6 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[var(--bg-primary)] overflow-hidden scroll-mt-32 md:scroll-mt-36"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-full mb-6"
          >
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Featured Work</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t("projects.title")}
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            {t("projects.subtitle")}
          </p>
        </motion.div>

        {/* Projects Slider */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative px-0 md:px-20"
        >
          <style>
            {`
              .slick-slide {
                padding: 0 16px;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
              }
              
              .slick-slide > div {
                height: 100%;
              }

              /* Active center card */
              .slick-center .portfolio-card {
                transform: scale(1);
                opacity: 1;
                z-index: 20;
                filter: brightness(1.1) blur(0);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
              }

              /* Left side card */
              .slick-slide:has(+ .slick-center) .portfolio-card {
                transform: scale(0.88);
                opacity: 0.65;
                z-index: 10;
                filter: brightness(0.75) blur(0.5px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
              }

              /* Right side card */
              .slick-center + .slick-slide .portfolio-card {
                transform: scale(0.88);
                opacity: 0.65;
                z-index: 10;
                filter: brightness(0.75) blur(0.5px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
              }

              /* Other cards - No flickering */
              .portfolio-card {
                transform: scale(0.8);
                opacity: 0.4;
                z-index: 1;
                filter: brightness(0.6) blur(1.5px);
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                            opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                            filter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                will-change: transform, opacity, filter;
              }

              /* Smooth transitions */
              .slick-list {
                overflow: visible !important;
              }

              .slick-track {
                display: flex;
                align-items: center;
              }

              /* Dots styling */
              .slick-dots {
                bottom: -60px;
              }

              .slick-dots li {
                margin: 0 6px;
              }

              .slick-dots li button:before {
                font-size: 12px;
                color: rgba(168, 85, 247, 0.3);
                opacity: 1;
                transition: all 0.3s;
              }

              .slick-dots li.slick-active button:before {
                color: #a78bfa;
                transform: scale(1.5);
              }

              .slick-dots li:hover button:before {
                color: rgba(168, 85, 247, 0.6);
              }

              /* Mobile adjustments */
              @media (max-width: 768px) {
                /* Disable 3D transforms on mobile - simpler is better */
                .slick-slide {
                  padding: 0 8px;
                }
                
                .portfolio-card {
                  transform: scale(0.85) !important;
                  opacity: 0.5 !important;
                  filter: brightness(0.7) blur(1px) !important;
                  transition: all 0.4s ease-out !important;
                }
                
                .slick-center .portfolio-card {
                  transform: scale(1) !important;
                  opacity: 1 !important;
                  filter: brightness(1) blur(0) !important;
                  z-index: 20;
                }
                
                /* Remove 3D transforms from side cards on mobile */
                .slick-slide:has(+ .slick-center) .portfolio-card,
                .slick-center + .slick-slide .portfolio-card {
                  transform: scale(0.9) !important;
                  opacity: 0.6 !important;
                  filter: brightness(0.75) blur(0.5px) !important;
                }
                
                /* Fix overflow issues on small screens */
                .slick-list {
                  overflow: hidden !important;
                  perspective: none !important;
                }
                
                .slick-track {
                  transform-style: flat !important;
                }
                
                /* Adjust dots position for mobile */
                .slick-dots {
                  bottom: -50px !important;
                }
              }
              
              /* Extra small screens - more aggressive fixes */
              @media (max-width: 480px) {
                .slick-slide {
                  padding: 0 6px;
                }
                
                .portfolio-card {
                  transform: scale(0.9) !important;
                  opacity: 0.6 !important;
                }
                
                .slick-center .portfolio-card {
                  transform: scale(1) !important;
                  opacity: 1 !important;
                }
                
                /* Side cards barely visible on very small screens */
                .slick-slide:has(+ .slick-center) .portfolio-card,
                .slick-center + .slick-slide .portfolio-card {
                  transform: scale(0.92) !important;
                  opacity: 0.5 !important;
                }
              }
            `}
          </style>

          <Slider ref={sliderRef} {...settings}>
            {projects.map((project, index) => {
              const isFav = isFavorite(project.id);
              const firstStat = Object.entries(project.stats)[0];
              const isActive = index === currentSlide;

              return (
                <div key={project.id} className="outline-none focus:outline-none">
                  <motion.div
                    onClick={(e) => handleProjectClick(project, index, e)}
                    className="portfolio-card relative bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 group cursor-pointer"
                    whileHover={!isMobile ? { y: -8 } : undefined}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                  >
                    {/* TAP/CLICK indicators removed per redesign plan */}

                    {/* SIDE CARDS INDICATOR - TOP POSITION */}
                    {!isActive && (
                      <motion.div
                        className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm text-white/60 rounded-lg font-mono text-xs border border-white/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="w-3 h-3" />
                        <span className="hidden sm:inline">CLICK TO CENTER</span>
                        <span className="sm:hidden">CENTER</span>
                      </motion.div>
                    )}
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        FEATURED
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(project);
                      }}
                      className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-black/70 hover:scale-110 transition-all duration-300"
                      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart 
                        className={`w-5 h-5 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`}
                      />
                    </button>

                    {/* Project Image (live screenshot, gradient fallback) */}
                    <div className={`relative h-64 md:h-80 overflow-hidden bg-gradient-to-br ${project.gradient}`}>
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        style={{ maxWidth: '100%' }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none`} />
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                      {/* Category */}
                      <div className="flex items-center gap-2 mb-3">
                        <Code2 className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-400 font-medium">{project.category}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[var(--text-secondary)] mb-6 leading-relaxed line-clamp-2">
                        {project.description}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                        {Object.entries(project.stats).slice(0, 4).map(([key, value], idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                              {value}
                            </div>
                            <div className="text-xs text-[var(--text-muted)] capitalize">{key}</div>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-[var(--text-secondary)] hover:border-purple-500/50 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 4 && (
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-[var(--text-muted)]">
                            +{project.tech.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mb-6 text-sm text-[var(--text-muted)]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {project.year}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {project.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.team}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ExternalLink className="w-5 h-5" />
                          View Live
                        </motion.a>
                        {project.githubUrl && (
                          <motion.a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:border-purple-500/50 transition-all duration-300 flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Github className="w-5 h-5" />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </Slider>
        </motion.div>

        {/* Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 space-y-3"
        >
          <p className="text-sm text-[var(--text-muted)]">
            {currentSlide + 1} / {projects.length}
          </p>
          <p className="text-xs text-[var(--text-muted)] flex flex-wrap items-center justify-center gap-1 sm:gap-2 px-2">
            <Keyboard className="w-3 h-3 flex-shrink-0" />
            <span className="text-center">
              {t("services.navigation.centerCard")} • {t("services.navigation.controls")}
            </span>
          </p>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectFullscreenView
            project={{
              ...selectedProject,
              subtitle: selectedProject.category,
              timeline: `${selectedProject.year} • ${selectedProject.duration}`,
            }}
            onClose={() => setSelectedProject(null)}
            onNext={() => {
              const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
              const nextIndex = (currentIndex + 1) % projects.length;
              setSelectedProject(projects[nextIndex]);
            }}
            onPrev={() => {
              const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
              const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
              setSelectedProject(projects[prevIndex]);
            }}
            hasNext={true}
            hasPrev={true}
          />
        )}
      </AnimatePresence>
    </section>
  );
}