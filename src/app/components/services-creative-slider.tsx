import { motion } from "motion/react";
import { Code, Globe, Bot, ShoppingCart, TrendingUp, Sparkles, Zap, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight, Keyboard } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { ServiceActionModal } from "./service-action-modal";
import { useLanguage } from "../contexts/language-context";

const services = [
  {
    id: 1,
    key: 'automation',
    icon: Bot,
    title: "Automation & Bots",
    description: "Telegram bots, workflow automation and API integrations that save you hours every week",
    color: "#f59e0b",
    gradient: "from-orange-500 to-yellow-500",
    popular: true,
    priceRange: "from €45/hr",
    price: 45,
    priceWithTax: 45,
    features: ["Telegram & Discord bots", "Payment & API integrations", "Workflow automation", "Data sync & scripts"],
  },
  {
    id: 2,
    key: 'landing',
    icon: Globe,
    title: "Websites & Landing Pages",
    description: "Fast, modern sites that turn visitors into customers — built with Next.js / React",
    color: "#00d9ff",
    gradient: "from-[#00d9ff] to-cyan-500",
    priceRange: "from €650",
    price: 650,
    priceWithTax: 650,
    features: ["Responsive & fast", "Payments (Stripe/WayForPay)", "GA4 analytics", "SEO-ready"],
  },
  {
    id: 3,
    key: 'design',
    icon: Sparkles,
    title: "UI Design & Build",
    description: "Modern interface design and pixel-perfect build in one — AI-assisted, delivered fast",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-500",
    priceRange: "from €400",
    price: 400,
    priceWithTax: 400,
    features: ["UI / UX design", "Design-to-code", "Responsive layouts", "Reusable components"],
  },
  {
    id: 4,
    key: 'webapp',
    icon: Code,
    title: "Web Apps & Dashboards",
    description: "Custom tools, dashboards and integrations for your business processes",
    color: "#a78bfa",
    gradient: "from-purple-500 to-indigo-500",
    priceRange: "from €60/hr",
    price: 60,
    priceWithTax: 60,
    features: ["Custom dashboards", "Internal tools", "REST API integration", "Admin panels"],
  },
  {
    id: 5,
    key: 'ecommerce',
    icon: ShoppingCart,
    title: "E-Commerce",
    description: "Online stores and storefronts with payment and shipping — Magento or custom",
    color: "#22c55e",
    gradient: "from-green-500 to-emerald-500",
    priceRange: "from €1200",
    price: 1200,
    priceWithTax: 1200,
    features: ["Magento 1 & 2 / custom", "Payment gateways", "Shipping integrations", "Product pages & SEO"],
  },
  {
    id: 6,
    key: 'consulting',
    icon: TrendingUp,
    title: "Consulting / Hourly",
    description: "Front-end & automation advice, code review and hands-on help by the hour",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-500",
    priceRange: "€55/hr",
    price: 55,
    priceWithTax: 55,
    features: ["Code review & audits", "Architecture advice", "Automation strategy", "Pair programming"],
  },
];

// Carousel arrows. We render these ourselves now — they used to be handed to
// react-slick, which injected the onClick and removed them at the ends.
const arrowClass =
  "absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#00d9ff]/20 to-cyan-500/20 backdrop-blur-xl border-2 border-[#00d9ff]/30 rounded-full flex items-center justify-center hover:from-[#00d9ff]/30 hover:to-cyan-500/30 hover:scale-110 transition-all duration-300 shadow-[0_0_24px_rgba(0,217,255,0.18)] group disabled:opacity-25 disabled:pointer-events-none";

const PrevArrow = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`${arrowClass} left-0 md:-left-16`}
    aria-label="Previous service"
  >
    <ChevronLeft className="w-6 h-6 text-[#00d9ff] group-hover:scale-110 transition-transform" />
  </button>
);

const NextArrow = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`${arrowClass} right-0 md:-right-16`}
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
  const trackRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [isProcessingClick, setIsProcessingClick] = useState(false);

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

  // Centre a card in the track. Native smooth scrolling replaces react-slick's
  // JS animation, so it honours prefers-reduced-motion for free.
  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  // Whichever card is closest to the middle of the track is the active one.
  // An observer beats a scroll handler here: no work on frames where nothing
  // crosses a boundary.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setCurrentSlide(index);
        });
      },
      { root: track, threshold: 0.6 },
    );

    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  // Arrow keys move the carousel, but ONLY while it has focus. The old global
  // keydown listener called preventDefault() on every arrow press and ate
  // keystrokes in every input on the page.
  const handleTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const delta = e.key === "ArrowRight" ? 1 : -1;
    scrollToIndex(Math.min(Math.max(currentSlide + delta, 0), services.length - 1));
  };

  // 🔥 FIX: Debounced click handler to prevent multiple triggers
  const handleBookService = (service: typeof services[0]) => {
    if (isProcessingClick) return;
    
    setIsProcessingClick(true);
    
    // Skip modal — go directly to chat with service context
    sessionStorage.setItem('chatbotServiceName', service.title);
    sessionStorage.setItem('chatbotService', service.key);
    const event = new CustomEvent('openChatBot', { 
      detail: { service: service.key, serviceName: service.title }
    });
    window.dispatchEvent(event);
    
    setTimeout(() => {
      setIsProcessingClick(false);
    }, 300);
  };

  // Native scroll-snap swallows drags before they become clicks, so the old
  // touchstart/touchmove/touchend drag detector is gone. A card click now just
  // opens the service — no "click once to centre, again to open" dance.
  const handleCardClick = (service: typeof services[0]) => {
    if (isProcessingClick) return;
    handleBookService(service);
  };

  // Everything the ~90-line react-slick settings object used to configure —
  // slidesToShow, centerMode, centerPadding, responsive breakpoints, swipe
  // thresholds — is now CSS (flex-basis + scroll-snap). See the <style> block
  // below. Autoplay is gone on purpose: it fought the user's own scrolling and
  // there is no accessible way to pause it for keyboard users.

  return (
    <>
      <section
        id="services"
        className="relative py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[var(--bg-primary)] overflow-hidden scroll-mt-32 md:scroll-mt-36"
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
                /* Scroll-snap carousel. Replaces react-slick: no JS layout, no
                   cloned DOM nodes, native touch momentum, and the browser
                   handles reduced-motion for us. */
                .services-track {
                  display: flex;
                  gap: 1.5rem;
                  overflow-x: auto;
                  overflow-y: hidden;
                  scroll-snap-type: x mandatory;
                  scroll-behavior: smooth;
                  -webkit-overflow-scrolling: touch;
                  padding: 1rem 0 1.5rem;
                  /* Snap targets centre themselves inside the track */
                  scroll-padding-inline: 50%;
                  scrollbar-width: none;
                }
                .services-track::-webkit-scrollbar { display: none; }

                .services-track > * {
                  scroll-snap-align: center;
                  flex: 0 0 min(100%, 22rem);
                }

                /* Show three cards side by side once there is room */
                @media (min-width: 1024px) {
                  .services-track > * { flex-basis: calc((100% - 3rem) / 3); }
                }

                /* Off-centre cards recede. Driven by a data attribute we set
                   from the IntersectionObserver rather than react-slick's
                   .slick-center class, which never appeared when centerMode
                   was off and left every card dimmed. */
                .service-card {
                  height: 100%;
                  transform: scale(0.94);
                  opacity: 0.55;
                  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                              opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                              border-color 0.3s ease;
                }
                .service-card[data-active="true"] {
                  transform: scale(1);
                  opacity: 1;
                }

                @media (prefers-reduced-motion: reduce) {
                  .services-track { scroll-behavior: auto; }
                  .service-card {
                    transition: none;
                    transform: none;
                    opacity: 1;
                  }
                }
              `}
            </style>

            <div
              ref={trackRef}
              className="services-track"
              role="group"
              aria-roledescription="carousel"
              aria-label={t("services.title")}
              tabIndex={0}
              onKeyDown={handleTrackKeyDown}
            >
              {services.map((service, index) => {
                const Icon = service.icon;
                const isActive = currentSlide === index;

                return (
                  <div
                    key={service.id}
                    data-index={index}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} / ${services.length}: ${service.title}`}
                  >
                    <motion.div
                      onClick={() => handleCardClick(service)}
                      data-active={isActive}
                      className="service-card relative bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-3xl p-6 md:p-8 hover:border-purple-500/50 group cursor-pointer overflow-visible"
                      whileHover={!isMobile ? { y: -10 } : undefined}
                    >
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
                          className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 px-3 py-1 sm:px-4 sm:py-1.5 bg-[#00d9ff] rounded-full text-black text-[10px] sm:text-xs font-bold shadow-[0_0_20px_rgba(0,217,255,0.18)] z-30 whitespace-nowrap"
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
                        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00d9ff] to-cyan-400 bg-clip-text text-transparent mb-1">
                          {service.priceRange}
                        </div>
                        {service.key === 'automation' && (
                          <p className="text-xs text-[var(--accent-primary)] font-mono mb-1">
                            or fixed from €350/bot
                          </p>
                        )}
                        <p className="text-xs text-[var(--text-muted)]">
                          {t("services.priceNote")}
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
                        Start project
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </motion.button>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <PrevArrow onClick={() => scrollToIndex(currentSlide - 1)} disabled={currentSlide === 0} />
            <NextArrow
              onClick={() => scrollToIndex(currentSlide + 1)}
              disabled={currentSlide === services.length - 1}
            />
          </motion.div>

          {/* Dots + counter */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 space-y-3 px-4"
          >
            <div className="flex items-center justify-center gap-2">
              {services.map((service, index) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => scrollToIndex(index)}
                  aria-label={`Go to ${service.title}`}
                  aria-current={currentSlide === index}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-8 bg-[#00d9ff]"
                      : "w-3 bg-white/20 hover:bg-[#00d9ff]/50"
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-[var(--text-muted)]" aria-live="polite">
              {currentSlide + 1} / {services.length}
            </p>

            <div className="hidden sm:flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
              <Keyboard className="w-3 h-3 flex-shrink-0" />
              <span className="text-center">{t("services.navigation.keyboard")}</span>
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