import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { Euro, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

interface Service {
  id: number;
  icon: any;
  title: string;
  description: string;
  price: number;
  priceWithTax: number;
  features: string[];
  gradient: string;
  popular?: boolean;
}

interface ServicesCarouselProps {
  services: Service[];
  onBookService?: (service: Service) => void;
}

export function ServicesCarousel({ services, onBookService }: ServicesCarouselProps) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % services.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, services.length]);

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Desktop: 3 cards visible (prev, current, next)
  // Mobile: 1 card visible with swipe
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="relative w-full py-12">
      {/* Desktop View: 3D Carousel or Grid */}
      <div className="hidden md:block relative">
        {/* Show Grid for 2 or fewer services */}
        {services.length <= 2 ? (
          <div className="max-w-5xl mx-auto">
            <div className={`grid gap-8 ${services.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-2'}`}>
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <ServiceCard
                    service={service}
                    isActive={true}
                    onBook={onBookService}
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Navigation Dots */}
            {services.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                {services.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-8 bg-[#00d9ff]"
                        : "w-2 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* 3D Carousel for 3+ services */
          <div className="h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {services.map((service, index) => {
                const offset = index - activeIndex;
                const absOffset = Math.abs(offset);
                const isActive = index === activeIndex;

                // Calculate positions
                let translateX = offset * 400;
                let scale = 1 - absOffset * 0.2;
                let zIndex = services.length - absOffset;
                let opacity = absOffset > 1 ? 0 : 1 - absOffset * 0.5;
                let rotateY = offset * 20;

                if (absOffset > 1) return null;

                return (
                  <motion.div
                    key={service.id}
                    className="absolute"
                    animate={{
                      x: translateX,
                      scale: scale,
                      z: -absOffset * 100,
                      opacity: opacity,
                      rotateY: rotateY,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    style={{
                      zIndex: zIndex,
                      transformStyle: "preserve-3d",
                    }}
                    onClick={() => !isActive && handleCardClick(index)}
                  >
                    <ServiceCard
                      service={service}
                      isActive={isActive}
                      onBook={onBookService}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-8 bg-[#00d9ff]"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to service ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile View: Swipeable Cards with Peek Effect */}
      <div className="md:hidden relative overflow-visible px-2">
        <div className="relative h-[550px]">
          {services.map((service, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);
            
            // Show current, next preview, and previous (hidden)
            if (offset < -1 || offset > 1) return null;
            
            return (
              <motion.div
                key={service.id}
                className="absolute left-0 right-0"
                initial={false}
                animate={{
                  x: offset === 0 ? 0 : offset > 0 ? '85%' : '-100%',
                  scale: offset === 0 ? 1 : 0.85,
                  opacity: offset === 0 ? 1 : offset > 0 ? 0.6 : 0,
                  zIndex: offset === 0 ? 10 : 5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                style={{
                  pointerEvents: offset === 0 ? 'auto' : 'none',
                }}
              >
                <div className="px-2">
                  <ServiceCard
                    service={service}
                    isActive={index === activeIndex}
                    onBook={onBookService}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Swipe Navigation */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowRight className="w-5 h-5 rotate-180 text-[var(--text-primary)]" />
          </button>
          
          {/* Navigation Dots */}
          <div className="flex items-center gap-2">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-[#00d9ff]"
                    : "w-2 bg-white/30"
                }`}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={() => setActiveIndex(Math.min(services.length - 1, activeIndex + 1))}
            disabled={activeIndex === services.length - 1}
            className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowRight className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ 
  service, 
  isActive, 
  onBook 
}: { 
  service: Service; 
  isActive: boolean;
  onBook?: (service: Service) => void;
}) {
  const Icon = service.icon;

  return (
    <motion.div
      className={`relative w-full md:w-[380px] bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-3xl overflow-hidden cursor-pointer ${
        isActive ? "shadow-[0_0_50px_rgba(0,217,255,0.3)]" : ""
      }`}
      whileHover={{ scale: isActive ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Popular Badge */}
      {service.popular && (
        <div className="absolute top-4 right-4 z-10">
          <div className={`flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r ${service.gradient} rounded-full`}>
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-xs font-bold text-white">POPULAR</span>
          </div>
        </div>
      )}

      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-5`} />

      <div className="relative p-8">
        {/* Icon */}
        <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-[var(--text-secondary)] mb-6 min-h-[60px]">
          {service.description}
        </p>

        {/* Price */}
        <div className="mb-6 pb-6 border-b border-[var(--card-border)]">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Euro className="w-8 h-8 text-[#00d9ff]" />
              {service.priceWithTax.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Base: €{service.price.toLocaleString()} + 21% BTW
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {service.features.map((feature, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isActive ? 1 : 0.7, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CheckCircle2 className="w-5 h-5 text-[#00d9ff] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <motion.button
          onClick={() => onBook?.(service)}
          className={`w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r ${service.gradient} text-white font-bold rounded-xl hover:opacity-90 transition-all group`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Book Now</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
}