import { motion } from "motion/react";
import { Code, Globe, Bot, ShoppingCart, Workflow, TrendingUp, Sparkles, Zap, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight, Keyboard, Play, Pause, Hand } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "@/styles/slick.css";
import { ServiceActionModal } from "./service-action-modal";
import { useSliderNavigation } from "../hooks/use-slider-navigation";
import { SliderControls } from "./slider-controls";
import { AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/language-context";

const services = [
  {
    id: 1,
    key: 'website',
    icon: Globe,
    title: "Web Development",
    description: "Custom websites that convert visitors into customers with modern design and best practices",
    color: "#00d9ff",
    gradient: "from-[#00d9ff] to-cyan-500",
    price: 2500,
    priceWithTax: 3025,
    features: ["Responsive Design", "SEO Optimized", "CMS Integration", "Analytics Setup", "Fast Loading", "Cross-browser Compatible"],
  },
  {
    id: 2,
    key: 'ecommerce',
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    description: "Full-featured online stores with seamless checkout and inventory management",
    color: "#a78bfa",
    gradient: "from-purple-500 to-indigo-500",
    popular: true,
    price: 5000,
    priceWithTax: 6050,
    features: ["Payment Gateway Integration", "Inventory Management", "Admin Dashboard", "Order Tracking", "Email Notifications", "Customer Reviews"],
  },
  {
    id: 3,
    key: 'webapp',
    icon: Code,
    title: "Web Applications",
    description: "Scalable apps built with modern frameworks like React, Next.js and TypeScript",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-500",
    price: 4000,
    priceWithTax: 4840,
    features: ["React/Vue.js Development", "Real-time Features", "API Development", "Cloud Hosting", "Database Design", "User Authentication"],
  },
  {
    id: 4,
    key: 'automation',
    icon: Workflow,
    title: "Process Automation",
    description: "Streamline workflows and boost productivity with intelligent automation solutions",
    color: "#22c55e",
    gradient: "from-green-500 to-emerald-500",
    price: 1500,
    priceWithTax: 1815,
    features: ["API Integration", "Data Sync", "Custom Scripts", "Workflow Design", "Task Scheduling", "Reporting Tools"],
  },
  {
    id: 5,
    key: 'chatbot',
    icon: Bot,
    title: "AI Chatbots",
    description: "Intelligent bots powered by GPT technology for customer support and engagement",
    color: "#f59e0b",
    gradient: "from-orange-500 to-yellow-500",
    price: 2000,
    priceWithTax: 2420,
    features: ["WhatsApp/Telegram Integration", "Multi-language Support", "AI-Powered Responses", "24/7 Availability", "Analytics Dashboard", "Custom Training"],
  },
  {
    id: 6,
    key: 'consulting',
    icon: TrendingUp,
    title: "Tech Consulting",
    description: "Expert advice for your technical challenges and architecture decisions",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-500",
    price: 500,
    priceWithTax: 605,
    features: ["Code Review", "Architecture Design", "Performance Audit", "Best Practices", "Team Training", "Technical Documentation"],
  },
];

// Custom Arrow Components
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#00d9ff]/20 to-cyan-500/20 backdrop-blur-xl border-2 border-[#00d9ff]/30 rounded-full flex items-center justify-center hover:from-[#00d9ff]/30 hover:to-cyan-500/30 hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(0,217,255,0.3)] group"
    aria-label="Previous service"
  >
    <ChevronLeft className="w-6 h-6 text-[#00d9ff] group-hover:scale-110 transition-transform" />
  </button>
);

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#00d9ff]/20 to-cyan-500/20 backdrop-blur-xl border-2 border-[#00d9ff]/30 rounded-full flex items-center justify-center hover:from-[#00d9ff]/30 hover:to-cyan-500/30 hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(0,217,255,0.3)] group"
    aria-label="Next service"
  >
    <ChevronRight className="w-6 h-6 text-[#00d9ff] group-hover:scale-110 transition-transform" />
  </button>
);

export function ServicesCreativeSlider() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  // Initialize isMobile based on window size to prevent flashing
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const sliderRef = useRef<Slider>(null);
  const { t } = useLanguage();
  const [isProcessingClick, setIsProcessingClick] = useState(false);
  
  // 🔥 NEW: Touch detection to differentiate swipe vs click
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Check immediately
    checkMobile();
    
    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enable advanced navigation (keyboard + touch swipe)
  useSliderNavigation({
    sliderRef,
    totalSlides: services.length,
    enableKeyboard: true,
    enableSwipe: true,
  });

  // FIX: Force slider re-initialization on mobile after mount
  useEffect(() => {
    // Trigger resize event to force slider recalculation
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      
      // Double-check: force slider to go to first slide
      if (sliderRef.current) {
        sliderRef.current.slickGoTo(0);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 🔥 FIX: Debounced click handler to prevent multiple triggers
  const handleBookService = (service: typeof services[0]) => {
    if (isProcessingClick) return; // Prevent multiple clicks
    
    setIsProcessingClick(true);
    setSelectedService(service);
    
    // Reset flag after 300ms (reduced from 500ms)
    setTimeout(() => {
      setIsProcessingClick(false);
    }, 300);
  };

  // 🔥 NEW: Touch handlers to detect swipe vs click
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
    
    // If moved more than 10px, it's a drag (reduced from 15px for better detection)
    if (deltaX > 10 || deltaY > 10) {
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    // Use requestAnimationFrame for smoother state updates
    requestAnimationFrame(() => {
      setTouchStart(null);
      // Reset dragging after a short delay to allow click detection
      setTimeout(() => {
        setIsDragging(false);
      }, 50);
    });
  };

  // 🔥 IMPROVED: Card click handler with better swipe detection
  const handleCardClick = (service: typeof services[0], index: number, e: React.MouseEvent | React.TouchEvent) => {
    // Don't prevent default or stop propagation - let slider handle it
    // Only stop propagation if we're actually going to open the modal
    
    // Don't trigger click if it was a drag/swipe
    if (isDragging) {
      return;
    }
    
    if (isProcessingClick) return; // Prevent multiple clicks
    
    const isActive = currentSlide === index;
    
    // If card is already centered (active), open modal
    if (isActive) {
      e.stopPropagation(); // Only stop propagation when opening modal
      handleBookService(service);
    } else {
      // Otherwise, navigate to center it (let slider handle the event)
      sliderRef.current?.slickGoTo(index);
    }
  };

  // Dynamic initial settings based on screen size
  const settings = {
    dots: true,
    infinite: true,
    speed: 400, // Reduced from 600 for faster response
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: isMobile ? "40px" : "0px",
    autoplay: !isMobile, // Disable autoplay on mobile to save battery
    autoplaySpeed: 5000,
    pauseOnHover: true,
    swipeToSlide: true,
    touchThreshold: 8, // Lower threshold for mobile (from 10)
    swipe: true,
    touchMove: true,
    draggable: true,
    accessibility: true,
    arrows: !isMobile,
    useCSS: true, // Use CSS transforms instead of JS
    useTransform: true, // Enable hardware acceleration
    lazyLoad: 'ondemand' as const, // Lazy load slides
    waitForAnimate: false, // Don't wait for animations to complete
    beforeChange: (_current: number, next: number) => {
      setCurrentSlide(next);
      setIsDragging(false);
    },
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          centerMode: true,
          centerPadding: "0px",
          swipeToSlide: true,
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
        }
      }
    ],
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-[#00d9ff]/50 transition-all duration-300" />
    ),
    appendDots: (dots: React.ReactNode) => (
      <div className="mt-8">
        <ul className="flex items-center justify-center gap-2"> {dots} </ul>
      </div>
    ),
  };

  return (
    <>
      <section
        id="services-section"
        className="relative py-12 md:py-16 px-4 bg-[var(--bg-primary)] overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 -left-40 w-96 h-96 bg-[#00d9ff]/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00d9ff]/10 to-purple-500/10 border border-[#00d9ff]/30 rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5 text-[#00d9ff]" />
              <span className="text-sm font-medium text-[#00d9ff]">{t("services.subtitle")}</span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#00d9ff] to-purple-400 bg-clip-text text-transparent">
              {t("services.title")}
            </h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
              {t("services.description")}
            </p>
          </motion.div>

          {/* Services Slider */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative px-2 md:px-16 pb-4"
          >
            <style>
              {`
                .slick-slide {
                  padding: 0 12px;
                  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                  filter: blur(0);
                }
                
                .slick-slide > div {
                  height: 100%;
                }

                /* Active center card */
                .slick-center .service-card {
                  transform: scale(1);
                  opacity: 1;
                  z-index: 20;
                  filter: brightness(1.1) blur(0);
                  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Left side card */
                .slick-slide:has(+ .slick-center) .service-card {
                  transform: scale(0.85);
                  opacity: 0.6;
                  z-index: 10;
                  filter: brightness(0.7) blur(1px);
                  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Right side card */
                .slick-center + .slick-slide .service-card {
                  transform: scale(0.85);
                  opacity: 0.6;
                  z-index: 10;
                  filter: brightness(0.7) blur(1px);
                  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Other cards - No flickering */
                .service-card {
                  transform: scale(0.75);
                  opacity: 0.3;
                  z-index: 1;
                  filter: brightness(0.5) blur(2px);
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
                  color: rgba(255, 255, 255, 0.3);
                  opacity: 1;
                  transition: all 0.3s;
                }

                .slick-dots li.slick-active button:before {
                  color: #00d9ff;
                  transform: scale(1.5);
                }

                .slick-dots li:hover button:before {
                  color: rgba(0, 217, 255, 0.6);
                }

                /* Mobile adjustments */
                @media (max-width: 768px) {
                  /* Disable 3D transforms on mobile - simpler is better */
                  .slick-slide {
                    padding: 0 8px;
                  }
                  
                  .service-card {
                    transform: scale(0.85) !important;
                    opacity: 0.5 !important;
                    filter: brightness(0.7) blur(1px) !important;
                    transition: all 0.4s ease-out !important;
                  }
                  
                  .slick-center .service-card {
                    transform: scale(1) !important;
                    opacity: 1 !important;
                    filter: brightness(1) blur(0) !important;
                    z-index: 20;
                  }
                  
                  /* Remove 3D transforms from side cards on mobile */
                  .slick-slide:has(+ .slick-center) .service-card,
                  .slick-center + .slick-slide .service-card {
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
                  
                  .service-card {
                    transform: scale(0.9) !important;
                    opacity: 0.6 !important;
                  }
                  
                  .slick-center .service-card {
                    transform: scale(1) !important;
                    opacity: 1 !important;
                  }
                  
                  /* Side cards barely visible on very small screens */
                  .slick-slide:has(+ .slick-center) .service-card,
                  .slick-center + .slick-slide .service-card {
                    transform: scale(0.92) !important;
                    opacity: 0.5 !important;
                  }
                }
              `}
            </style>

            <Slider ref={sliderRef} {...settings}>
              {services.map((service, index) => {
                const Icon = service.icon;
                const isActive = currentSlide === index;
                
                return (
                  <div key={service.id} className="outline-none focus:outline-none pt-4">
                    <motion.div
                      onClick={(e) => handleCardClick(service, index, e)}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      className="service-card relative bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-3xl p-6 md:p-8 hover:border-purple-500/50 transition-all duration-500 group cursor-pointer overflow-visible"
                      whileHover={!isMobile ? { y: -10 } : undefined}
                    >
                      {/* 🔥 TAP/CLICK INDICATOR - DEVELOPER STYLE - PURPLE THEME - TOP */}
                      {isActive && (
                        <motion.div
                          className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg font-mono font-bold text-xs shadow-[0_0_30px_rgba(168,85,247,0.9)] md:hidden"
                          animate={{
                            boxShadow: [
                              "0 0 20px rgba(168,85,247,0.9)",
                              "0 0 40px rgba(168,85,247,1)",
                              "0 0 20px rgba(168,85,247,0.9)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <Hand className="w-4 h-4" />
                          <span>TAP TO OPEN</span>
                        </motion.div>
                      )}
                      
                      {isActive && (
                        <motion.div
                          className="hidden md:flex absolute top-4 left-4 z-30 items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg font-mono font-bold text-xs shadow-[0_0_30px_rgba(168,85,247,0.9)]"
                          animate={{
                            boxShadow: [
                              "0 0 20px rgba(168,85,247,0.9)",
                              "0 0 40px rgba(168,85,247,1)",
                              "0 0 20px rgba(168,85,247,0.9)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <Hand className="w-4 h-4" />
                          <span>CLICK TO OPEN</span>
                        </motion.div>
                      )}

                      {/* SIDE CARDS INDICATOR - TOP */}
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
                      
                      {/* Animated Background Gradient - DISABLED ON MOBILE */}
                      {!isMobile && (
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                          style={{
                            background: `radial-gradient(circle at 50% 0%, ${service.color}15 0%, transparent 70%)`,
                          }}
                        />
                      )}

                      {/* Shimmer Effect - DISABLED ON MOBILE */}
                      {!isMobile && (
                        <div className="absolute inset-0 overflow-hidden">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatDelay: 5,
                              ease: 'easeInOut'
                            }}
                          />
                        </div>
                      )}

                      {/* Popular Badge */}
                      {service.popular && (
                        <div
                          className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 px-3 py-1 sm:px-4 sm:py-1.5 bg-[#00d9ff] rounded-full text-black text-[10px] sm:text-xs font-bold shadow-[0_0_20px_rgba(0,217,255,0.6)] z-30 whitespace-nowrap"
                        >
                          <span className="flex items-center gap-1">
                            ⭐ {t("services.popular")}
                          </span>
                        </div>
                      )}

                      {/* Glow Effect */}
                      <div 
                        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${service.color}50 0%, transparent 70%)`,
                        }}
                      />

                      {/* Icon with Floating Animation */}
                      <motion.div 
                        className={`relative w-16 h-16 md:w-20 md:h-20 mb-6 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-shadow duration-500`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        animate={{
                          y: [0, -8, 0],
                        }}
                        transition={{
                          y: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                      >
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
                        
                        {/* Icon Glow */}
                        <div 
                          className="absolute inset-0 rounded-2xl blur-md opacity-50"
                          style={{
                            background: `linear-gradient(135deg, ${service.color}, transparent)`,
                          }}
                        />
                      </motion.div>

                      {/* Title & Description */}
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-[#00d9ff] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] mb-6 leading-relaxed min-h-[60px]">
                        {service.description}
                      </p>

                      {/* Price */}
                      <div className="mb-6 pb-6 border-b border-white/10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-[var(--text-muted)]">Starting at</span>
                          <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00d9ff] to-cyan-400 bg-clip-text text-transparent">
                            €{service.priceWithTax}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          (€{service.price} + 21% BTW)
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        {service.features.slice(0, 4).map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0`}>
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                          </motion.div>
                        ))}
                        {service.features.length > 4 && (
                          <p className="text-xs text-[var(--text-muted)] ml-8">
                            +{service.features.length - 4} more features
                          </p>
                        )}
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookService(service);
                        }}
                        className={`w-full py-4 bg-gradient-to-r ${service.gradient} rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all duration-300 group/btn`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Zap className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                        Book Now
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </motion.button>
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
            className="text-center mt-8 space-y-3 px-4"
          >
            <p className="text-sm text-[var(--text-muted)]">
              {currentSlide + 1} / {services.length}
            </p>
            <div className="hidden sm:flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
              <Keyboard className="w-3 h-3 flex-shrink-0" />
              <span className="text-center">
                {t("services.navigation.inactive")} • {t("services.navigation.active")} • {t("services.navigation.keyboard")}
              </span>
            </div>
            <div className="flex sm:hidden items-center justify-center gap-2 text-[10px] sm:text-xs text-[var(--text-muted)] px-2">
              <span className="text-center leading-tight">
                {t("services.navigation.active")} • {t("services.navigation.keyboard")}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Action Modal */}
      {selectedService && (
        <ServiceActionModal
          service={selectedService}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          onChatBot={() => {
            // Store in sessionStorage for ChatBot
            sessionStorage.setItem('selectedService', selectedService.key);
            const event = new CustomEvent('openChatBot', { 
              detail: { 
                service: selectedService.key,
                serviceName: selectedService.title 
              } 
            });
            window.dispatchEvent(event);
            setSelectedService(null);
          }}
          onContact={() => {
            // Store in sessionStorage for Contact Form
            sessionStorage.setItem('selectedService', selectedService.key);
            const contactSection = document.getElementById("contact");
            contactSection?.scrollIntoView({ behavior: "smooth" });
            setSelectedService(null);
          }}
        />
      )}
    </>
  );
}