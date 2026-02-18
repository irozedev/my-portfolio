import { motion, useMotionValue, useTransform, animate, PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, ReactNode } from "react";

interface SliderProps {
  children: ReactNode[];
  slidesPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  spacing?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
}

export function FeatherSlider({
  children,
  slidesPerView = { mobile: 1, tablet: 2, desktop: 3 },
  spacing = 24,
  autoplay = false,
  autoplayDelay = 5000,
  showNavigation = true,
  showPagination = true,
}: SliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesVisible, setSlidesVisible] = useState(slidesPerView.desktop);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  
  const totalSlides = children.length;
  const maxIndex = Math.max(0, totalSlides - slidesVisible);

  // Responsive slides per view
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth < 768) {
        setSlidesVisible(slidesPerView.mobile);
      } else if (window.innerWidth < 1024) {
        setSlidesVisible(slidesPerView.tablet);
      } else {
        setSlidesVisible(slidesPerView.desktop);
      }
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, [slidesPerView]);

  // FIX: Force re-initialization on mount for mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      // Force recalculation of slide widths
      if (containerRef.current) {
        const slideWidth = getSlideWidth();
        if (slideWidth > 0) {
          // Re-position slider to first slide
          goToSlide(0);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Calculate slide width
  const getSlideWidth = () => {
    if (!containerRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    return (containerWidth - (spacing * (slidesVisible - 1))) / slidesVisible;
  };

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clampedIndex);
    const slideWidth = getSlideWidth();
    const targetX = -clampedIndex * (slideWidth + spacing);
    
    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  // Navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < maxIndex) {
      goToSlide(currentIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, maxIndex]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev >= maxIndex ? 0 : prev + 1;
        goToSlide(next);
        return next;
      });
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, maxIndex, isDragging]);

  // Drag end handler
  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    const slideWidth = getSlideWidth();
    const currentX = x.get();
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    // Calculate new index based on drag distance and velocity
    let newIndex = Math.round(-currentX / (slideWidth + spacing));
    
    // IMPROVED: Better swipe detection for mobile
    const swipeThreshold = slideWidth * 0.2; // 20% of slide width
    
    // If user swiped more than threshold or has high velocity
    if (Math.abs(offset) > swipeThreshold || Math.abs(velocity) > 500) {
      if (offset > 0) {
        // Swiped right (go to previous)
        newIndex = Math.max(0, currentIndex - 1);
      } else {
        // Swiped left (go to next)
        newIndex = Math.min(maxIndex, currentIndex + 1);
      }
    } else {
      // Snap to nearest slide
      newIndex = currentIndex;
    }
    
    goToSlide(newIndex);
  };

  return (
    <div className="relative group/slider w-full">
      {/* Navigation Buttons */}
      {showNavigation && totalSlides > slidesVisible && (
        <>
          {/* Previous Button */}
          <motion.button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-[var(--bg-secondary)]/95 to-[var(--bg-primary)]/95 backdrop-blur-xl border-2 border-[var(--accent-primary)]/40 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(0,217,255,0.3)] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 opacity-60 hover:opacity-100 group-hover/slider:opacity-100 hover:shadow-[0_0_50px_rgba(0,217,255,0.6)]"
            whileHover={{ 
              scale: 1.1, 
              rotate: -5
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: currentIndex === 0 ? 0.3 : 1 }}
          >
            <ChevronLeft className="w-5 h-5 md:w-7 md:h-7 text-[var(--accent-primary)]" strokeWidth={3} />
          </motion.button>

          {/* Next Button */}
          <motion.button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-[var(--bg-secondary)]/95 to-[var(--bg-primary)]/95 backdrop-blur-xl border-2 border-[var(--accent-primary)]/40 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(0,217,255,0.3)] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 opacity-60 hover:opacity-100 group-hover/slider:opacity-100 hover:shadow-[0_0_50px_rgba(0,217,255,0.6)]"
            whileHover={{ 
              scale: 1.1,
              rotate: 5
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: currentIndex >= maxIndex ? 0.3 : 1 }}
          >
            <ChevronRight className="w-5 h-5 md:w-7 md:h-7 text-[var(--accent-primary)]" strokeWidth={3} />
          </motion.button>
        </>
      )}

      {/* Slides Container */}
      <div ref={containerRef} className="overflow-hidden relative touch-pan-y">
        <motion.div
          drag="x"
          dragConstraints={{
            left: -(maxIndex * (getSlideWidth() + spacing)),
            right: 0,
          }}
          dragElastic={0.2}
          dragMomentum={true}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x, touchAction: 'pan-y' }}
          className="flex cursor-grab active:cursor-grabbing"
        >
          {children.map((child, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0"
              style={{
                width: `calc(${100 / slidesVisible}% - ${spacing * (slidesVisible - 1) / slidesVisible}px)`,
                marginRight: index < children.length - 1 ? `${spacing}px` : 0,
              }}
              whileHover={!isDragging ? { scale: 1.02, y: -5 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pagination Dots */}
      {showPagination && totalSlides > slidesVisible && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className="relative group/dot"
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Outer glow */}
              <motion.div
                className="absolute inset-0 rounded-full bg-[var(--accent-primary)]"
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  currentIndex === index
                    ? { scale: 2.5, opacity: 0.2 }
                    : { scale: 0, opacity: 0 }
                }
                transition={{ duration: 0.4 }}
              />

              {/* Middle ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[var(--accent-primary)]"
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  currentIndex === index
                    ? { scale: 2, opacity: 0.4 }
                    : { scale: 0, opacity: 0 }
                }
                transition={{ duration: 0.3 }}
              />

              {/* Dot */}
              <div className="relative flex items-center justify-center" style={{ width: currentIndex === index ? '32px' : '12px', height: '12px' }}>
                {currentIndex === index ? (
                  <motion.div
                    className="bg-gradient-to-r from-[#00d9ff] to-[#a78bfa] rounded-sm shadow-[0_0_15px_rgba(0,217,255,0.6)]"
                    initial={{ width: "12px", height: "12px", borderRadius: "50%" }}
                    animate={{ width: "32px", height: "4px", borderRadius: "2px" }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  />
                ) : (
                  <motion.div
                    className="w-2.5 h-2.5 bg-white/30 rounded-full"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.3, backgroundColor: "rgba(0, 217, 255, 0.5)" }}
                  />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Progress Indicator */}
      {autoplay && !isDragging && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: autoplayDelay / 1000, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "restart"
            }}
          />
        </div>
      )}

      {/* Slide Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute -top-8 md:-top-10 right-0 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-color)] rounded-full text-xs md:text-sm text-[var(--text-secondary)]"
      >
        <span className="text-[var(--accent-primary)] font-bold">{currentIndex + 1}</span>
        <span>/</span>
        <span>{maxIndex + 1}</span>
      </motion.div>
    </div>
  );
}