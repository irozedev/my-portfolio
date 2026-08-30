import { motion } from "motion/react";
import { Code, Globe, Bot, ShoppingCart, TrendingUp, Sparkles, Zap, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight, Keyboard } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { ServiceActionModal } from "./service-action-modal";
import { useLanguage } from "../contexts/language-context";
import { VIEWPORT, DURATION, EASE } from "../lib/motion";

const services = [
  {
    id: 1,
    key: 'automation',
    icon: Bot,
    title: "Automation & Bots",
    description: "WhatsApp bots, workflow automation and API integrations that save you hours every week",
    color: "#f59e0b",
    gradient: "from-orange-500 to-yellow-500",
    popular: true,
    priceRange: "from €65/hr",
    price: 65,
    priceWithTax: 65,
    features: ["WhatsApp & Telegram bots", "Payment & API integrations", "Workflow automation", "Data sync & scripts"],
  },
  {
    id: 2,
    key: 'landing',
    icon: Globe,
    title: "Websites & Landing Pages",
    description: "Fast, modern sites that turn visitors into customers — built with Next.js / React",
    color: "#00d9ff",
    gradient: "from-[#00d9ff] to-cyan-500",
    priceRange: "from €950",
    price: 950,
    priceWithTax: 950,
    features: ["Responsive & fast", "Payments (Stripe/WayForPay)", "GA4 analytics", "SEO-ready"],
  },
  {
    id: 3,
    key: 'design',
    icon: Sparkles,
    title: "UI Design & Build",
    description: "Modern interface design and pixel-perfect build in one — design and code from the same person",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-500",
    priceRange: "from €600",
    price: 600,
    priceWithTax: 600,
    features: ["UI / UX design", "Design-to-code", "Responsive layouts", "Reusable components"],
  },
  {
    id: 4,
    key: 'webapp',
    icon: Code,
    title: "Web Apps & Dashboards",
    description: "Custom tools, dashboards and integrations for your business processes",
    color: "#a78bfa",
    gradient: "from-[#7c8cf8] to-[#5a6ee0]",
    priceRange: "from €75/hr",
    price: 75,
    priceWithTax: 75,
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
    priceRange: "from €1800",
    price: 1800,
    priceWithTax: 1800,
    features: ["Magento 1 & 2 / custom", "Payment gateways", "Shipping integrations", "Product pages & SEO"],
  },
  {
    id: 6,
    key: 'consulting',
    icon: TrendingUp,
    title: "Consulting / Hourly",
    description: "Front-end & automation advice, code review and hands-on help by the hour",
    color: "#8b5cf6",
    gradient: "from-[#7c8cf8] to-[#4c5fd7]",
    priceRange: "€75/hr",
    price: 75,
    priceWithTax: 75,
    features: ["Code review & audits", "Architecture advice", "Automation strategy", "Pair programming"],
  },
];

// Carousel arrows, rendered here rather than handed to the slider library.
const arrowClass =
  "absolute top-1/2 -translate-y-1/2 z-20 hidden md:flex w-11 h-11 md:w-10 md:h-10 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--accent-primary)]/30 rounded-full items-center justify-center hover:border-[var(--accent-primary)]/70 hover:scale-105 transition-all duration-300 group disabled:opacity-20 disabled:pointer-events-none";

/* The phone pair. 44px square: WCAG 2.2 Target Size (Minimum) asks for 24,
   and a thumb wants more. */
const mobileArrowClass =
  "flex md:hidden w-11 h-11 shrink-0 items-center justify-center rounded-full border border-[var(--accent-primary)]/30 bg-[var(--glass-bg)] transition-colors duration-200 hover:border-[var(--accent-primary)]/70 disabled:opacity-20 disabled:pointer-events-none";

// Pixels of pointer travel above which a press counts as a drag, not a click.
const DRAG_THRESHOLD = 6;

type Lang = (en: string, nl: string, ar: string, es: string) => string;

/**
 * Display copy per service, in all four languages.
 *
 * The `services` array above stays canonical English on purpose: its `title`
 * is what goes into sessionStorage and the `openChatBot` event, and the chat
 * assistant matches on English service names. Only what the user reads is
 * translated.
 */
function serviceCopy(L: Lang) {
  const from = L("from", "vanaf", "من", "desde");
  const perHour = L("/hr", "/uur", "/س", "/h");

  return {
    automation: {
      title: L("Automation & Bots", "Automatisering & bots", "الأتمتة والبوتات", "Automatización y bots"),
      description: L(
        "WhatsApp bots, workflow automation and API integrations that save you hours every week",
        "WhatsApp-bots, procesautomatisering en API-integraties die je elke week uren besparen",
        "بوتات واتساب وأتمتة سير العمل وتكاملات API توفّر عليك ساعات كل أسبوع",
        "Bots de WhatsApp, automatización de procesos e integraciones de API que te ahorran horas cada semana",
      ),
      price: `${from} €65${perHour}`,
      features: [
        L("WhatsApp & Telegram bots", "WhatsApp- en Telegram-bots", "بوتات واتساب وتيليجرام", "Bots de WhatsApp y Telegram"),
        L("Payment & API integrations", "Betaal- en API-integraties", "تكاملات الدفع وواجهات API", "Integraciones de pago y API"),
        L("Workflow automation", "Procesautomatisering", "أتمتة سير العمل", "Automatización de procesos"),
        L("Data sync & scripts", "Datasynchronisatie en scripts", "مزامنة البيانات والسكربتات", "Sincronización de datos y scripts"),
      ],
    },
    landing: {
      title: L("Websites & Landing Pages", "Websites & landingspagina's", "المواقع وصفحات الهبوط", "Webs y landing pages"),
      description: L(
        "Fast, modern sites that turn visitors into customers — built with Next.js / React",
        "Snelle, moderne sites die bezoekers klant maken — gebouwd met Next.js / React",
        "مواقع سريعة وحديثة تحوّل الزوار إلى عملاء — مبنية بـ Next.js / React",
        "Sitios rápidos y modernos que convierten visitas en clientes — con Next.js / React",
      ),
      price: `${from} €950`,
      features: [
        L("Responsive & fast", "Responsief en snel", "متجاوب وسريع", "Responsive y rápido"),
        L("Payments (Stripe/WayForPay)", "Betalingen (Stripe/WayForPay)", "مدفوعات (Stripe/WayForPay)", "Pagos (Stripe/WayForPay)"),
        L("GA4 analytics", "GA4-analytics", "تحليلات GA4", "Analítica GA4"),
        L("SEO-ready", "SEO-klaar", "جاهز لتحسين محركات البحث", "Listo para SEO"),
      ],
    },
    design: {
      title: L("UI Design & Build", "UI-ontwerp & bouw", "تصميم وتنفيذ الواجهات", "Diseño UI y desarrollo"),
      description: L(
        "Modern interface design and pixel-perfect build in one — design and code from the same person",
        "Modern interface-ontwerp én pixel-perfecte bouw in één — ontwerp en code van dezelfde persoon",
        "تصميم واجهات حديث وتنفيذ دقيق في آن واحد — التصميم والكود من الشخص نفسه",
        "Diseño de interfaz moderno y maquetación pixel-perfect en uno — diseño y código de la misma persona",
      ),
      price: `${from} €600`,
      features: [
        L("UI / UX design", "UI / UX-ontwerp", "تصميم UI / UX", "Diseño UI / UX"),
        L("Design-to-code", "Design-to-code", "تحويل التصميم إلى كود", "De diseño a código"),
        L("Responsive layouts", "Responsieve layouts", "تخطيطات متجاوبة", "Maquetación responsive"),
        L("Reusable components", "Herbruikbare componenten", "مكوّنات قابلة لإعادة الاستخدام", "Componentes reutilizables"),
      ],
    },
    webapp: {
      title: L("Web Apps & Dashboards", "Webapps & dashboards", "تطبيقات الويب ولوحات التحكم", "Aplicaciones web y paneles"),
      description: L(
        "Custom tools, dashboards and integrations for your business processes",
        "Maatwerk-tools, dashboards en integraties voor je bedrijfsprocessen",
        "أدوات مخصّصة ولوحات تحكم وتكاملات لعمليات عملك",
        "Herramientas a medida, paneles e integraciones para tus procesos de negocio",
      ),
      price: `${from} €75${perHour}`,
      features: [
        L("Custom dashboards", "Custom dashboards", "لوحات تحكم مخصّصة", "Paneles a medida"),
        L("Internal tools", "Interne tools", "أدوات داخلية", "Herramientas internas"),
        L("REST API integration", "REST API-integratie", "تكامل REST API", "Integración de REST API"),
        L("Admin panels", "Beheerpanelen", "لوحات إدارة", "Paneles de administración"),
      ],
    },
    ecommerce: {
      title: L("E-Commerce", "E-commerce", "التجارة الإلكترونية", "E-commerce"),
      description: L(
        "Online stores and storefronts with payment and shipping — Magento or custom",
        "Webshops met betaling en verzending — Magento of maatwerk",
        "متاجر إلكترونية مع الدفع والشحن — Magento أو حل مخصّص",
        "Tiendas online con pago y envío — Magento o a medida",
      ),
      price: `${from} €1800`,
      features: [
        L("Magento 1 & 2 / custom", "Magento 1 & 2 / maatwerk", "Magento 1 و2 / مخصّص", "Magento 1 y 2 / a medida"),
        L("Payment gateways", "Betaalproviders", "بوابات الدفع", "Pasarelas de pago"),
        L("Shipping integrations", "Verzendintegraties", "تكاملات الشحن", "Integraciones de envío"),
        L("Product pages & SEO", "Productpagina's & SEO", "صفحات المنتجات وSEO", "Fichas de producto y SEO"),
      ],
    },
    consulting: {
      title: L("Consulting / Hourly", "Consultancy / per uur", "استشارات / بالساعة", "Consultoría / por horas"),
      description: L(
        "Front-end & automation advice, code review and hands-on help by the hour",
        "Front-end- en automatiseringsadvies, code review en praktische hulp per uur",
        "استشارات في الواجهات والأتمتة ومراجعة الكود ومساعدة عملية بالساعة",
        "Asesoría de front-end y automatización, code review y ayuda práctica por horas",
      ),
      price: `€75${perHour}`,
      features: [
        L("Code review & audits", "Code review & audits", "مراجعة الكود والتدقيق", "Code review y auditorías"),
        L("Architecture advice", "Architectuuradvies", "استشارات معمارية", "Asesoría de arquitectura"),
        L("Automation strategy", "Automatiseringsstrategie", "استراتيجية الأتمتة", "Estrategia de automatización"),
        L("Pair programming", "Pair programming", "برمجة ثنائية", "Programación en pareja"),
      ],
    },
  } as const;
}

type ArrowProps = { onClick: () => void; disabled: boolean; label: string };

const PrevArrow = ({ onClick, disabled, label }: ArrowProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`${arrowClass} left-0 md:-left-12`}
    aria-label={label}
  >
    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-[var(--accent-primary)]" />
  </button>
);

const NextArrow = ({ onClick, disabled, label }: ArrowProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`${arrowClass} right-0 md:-right-12`}
    aria-label={label}
  >
    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[var(--accent-primary)]" />
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
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  // One dot per scroll stop (n - perView + 1), not per card — with three cards
  // visible the outer ones never reach the centre.
  const [pager, setPager] = useState({ page: 0, pages: 1, stepWidth: 0 });
  const { t, language } = useLanguage();
  const [isProcessingClick, setIsProcessingClick] = useState(false);

  const L: Lang = (en, nl, ar, es) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;
  const copy = serviceCopy(L);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Measured from getBoundingClientRect rather than offsetLeft: in RTL
  // scrollLeft runs negative and offsetLeft is anchored the wrong way.
  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;

    const trackBox = track.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    const delta =
      cardBox.left + cardBox.width / 2 - (trackBox.left + trackBox.width / 2);

    track.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  // Nearest centre wins. An IntersectionObserver fires for several cards at
  // once here and the last one in the batch would win, which flickered.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const trackCentre = track.getBoundingClientRect().left + track.clientWidth / 2;
      let best = 0;
      let bestDistance = Infinity;

      Array.from(track.children).forEach((child, index) => {
        const box = (child as HTMLElement).getBoundingClientRect();
        const distance = Math.abs(box.left + box.width / 2 - trackCentre);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });

      setCurrentSlide(best);

      // `scrollLeft` is negative in RTL; the magnitude is what matters.
      const offset = Math.abs(track.scrollLeft);
      const max = track.scrollWidth - track.clientWidth;
      setEdges({ atStart: offset <= 1, atEnd: offset >= max - 1 });

      // Measured, not assumed — flex-basis decides how many cards fit.
      const first = track.children[0] as HTMLElement | undefined;
      if (first) {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const stepWidth = first.offsetWidth + gap;
        const perView = Math.max(1, Math.round((track.clientWidth + gap) / stepWidth));
        const pages = Math.max(1, track.children.length - perView + 1);
        // The final stop is the scroll extent, which can be short of a card.
        const page = max <= 0 ? 0 : Math.min(pages - 1, Math.round(offset / stepWidth));
        setPager({ page, pages, stepWidth });
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Step by one card width, not by index: the last card never reaches the
  // centre, so an index-based arrow stops moving before the track ends.
  const goToPage = useCallback((page: number) => {
    const track = trackRef.current;
    if (!track || !pager.stepWidth) return;
    const rtl = getComputedStyle(track).direction === "rtl";
    track.scrollTo({ left: (rtl ? -1 : 1) * page * pager.stepWidth, behavior: "smooth" });
  }, [pager.stepWidth]);

  const step = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.children[0] as HTMLElement | undefined;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  }, []);

  // Mouse input. Touch scrolls natively; a mouse needs drag and wheel mapping.
  // The only way to move the carousel with a mouse was to hit an arrow.
  // ---------------------------------------------------------------------

  // There is deliberately NO vertical-wheel-to-horizontal handler here.
  //
  // There used to be one: a non-passive `wheel` listener that called
  // preventDefault() and turned deltaY into scrollLeft, so a mouse could move
  // the carousel. It released the gesture at either end of the track, which
  // sounds polite and is not: on the way down the page the pointer crosses
  // this section, the page stops dead, and you have to scroll through six
  // cards before the page moves again. Hijacking the reader's primary axis to
  // drive a secondary one is a scroll trap, whatever the escape hatch.
  //
  // A mouse still has arrows, dots, keyboard and drag, and the browser already
  // maps Shift+wheel to horizontal scroll on an overflow container for free.
  // Trackpads send real deltaX, which never needed translating.

  // Click-and-drag with a mouse.
  //
  // Snapping is switched off for the duration of the drag: scroll-snap also
  // applies to programmatic scrollLeft writes, so with it on the track fought
  // every frame of the gesture. On release we re-enable it and centre the
  // nearest card explicitly.
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: track.scrollLeft,
      moved: 0,
    };
    // Snapping off IMMEDIATELY, as an inline style rather than through the
    // `is-dragging` class. scroll-snap also governs programmatic scrollLeft
    // writes, so with it on, every write in handlePointerMove is snapped
    // straight back and the track does not move at all. A class cannot do this
    // job: setState only lands on the next render, and the first moves of the
    // gesture happen before that.
    track.style.scrollSnapType = "none";

    // NOT setIsDragging(true) here. `.services-track.is-dragging *` sets
    // pointer-events: none on every descendant, and flipping that on mousedown
    // broke every card click on the section: by the time the button came back
    // up, hit-testing could no longer see the card, so the browser targeted the
    // track instead and the card's onClick — the one that opens the chat with
    // the service filled in — never ran. Nothing looked broken; the click just
    // went nowhere.
    //
    // Dragging state now begins when the pointer has actually travelled far
    // enough to be a drag, in handlePointerMove below.
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!dragRef.current.active || !track) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.moved = Math.max(dragRef.current.moved, Math.abs(dx));
    // Past the threshold this is a drag, not a click: kill text selection and
    // snapping, and stop descendants from swallowing the gesture.
    if (dragRef.current.moved > DRAG_THRESHOLD) setIsDragging(true);
    track.scrollLeft = dragRef.current.startScroll - dx;
  };

  const handlePointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    if (trackRef.current) trackRef.current.style.scrollSnapType = "";
    if (dragRef.current.moved <= DRAG_THRESHOLD) return;

    // Land on the nearest scroll stop, not on `scrollToIndex(currentSlide)`.
    // Centring the "nearest card to the middle" undoes the gesture whenever
    // more than one card is visible: with three on screen, dragging 200px does
    // not change which card is nearest the centre, so the track sprang back to
    // exactly where it started and dragging looked broken. Snapping to a stop
    // is also what the arrows and the dots do, so all three agree.
    const track = trackRef.current;
    if (!track || !pager.stepWidth) return;
    const offset = Math.abs(track.scrollLeft);
    const page = Math.max(0, Math.min(pager.pages - 1, Math.round(offset / pager.stepWidth)));
    goToPage(page);
  };

  // Arrow keys move the carousel, but ONLY while it has focus. The old global
  // keydown listener called preventDefault() on every arrow press and ate
  // keystrokes in every input on the page.
  const handleTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    step(e.key === "ArrowRight" ? 1 : -1);
  };

  // FIX: Debounced click handler to prevent multiple triggers
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

  const handleCardClick = (service: typeof services[0], index: number) => {
    if (isProcessingClick) return;

    // A mouse drag ends with a click event on whatever card was under the
    // cursor. Without this the carousel opened a service every time you
    // dragged it.
    if (dragRef.current.moved > DRAG_THRESHOLD) {
      dragRef.current.moved = 0;
      return;
    }

    // Below 1024px only one card is on screen, and its neighbours peek in at
    // the edges. Tapping a peeking card brings it to the centre instead of
    // opening a service the user cannot even read yet; the second tap, now on
    // the centred card, opens it.
    if (isMobile && index !== currentSlide) {
      scrollToIndex(index);
      return;
    }

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
        className="relative py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[var(--bg-primary)] overflow-hidden scroll-mt-24 md:scroll-mt-28"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-secondary),transparent)]" />
          <div className="absolute bottom-0 -left-40 w-96 h-96 bg-[#00d9ff]/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: DURATION, ease: EASE }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: DURATION, ease: EASE }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/[0.07] border border-[var(--accent-primary)]/30 rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
              <span className="text-sm font-medium text-[var(--accent-primary)]">{t("services.subtitle")}</span>
            </motion.div>

            {/* `from-white` was invisible in the light theme — the gradient
                started at the page colour. Anchor it to the text token so it
                inverts with the palette. */}
            <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-[-0.035em] leading-[0.92] text-[var(--text-primary)] mb-6">
              {t("services.title")}
            </h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
              {t("services.description")}
            </p>
          </motion.div>

          {/* Services Slider */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: DURATION, ease: EASE, delay: 0.2 }}
            className="relative px-2 md:px-16 pb-4"
          >
            <style>
              {`
                /* Scroll-snap carousel. Replaces react-slick: no JS layout, no
                   cloned DOM nodes, native touch momentum, and the browser
                   handles reduced-motion for us. */
                .services-track {
                  display: flex;
                  align-items: stretch;
                  gap: 1.5rem;
                  overflow-x: auto;
                  overflow-y: hidden;
                  /* proximity, not mandatory. Mandatory re-snaps on every
                     scroll event, so a trackpad flick or a slow drag got
                     yanked back to the nearest card mid-gesture — that was the
                     "won't scroll properly" feel. Proximity snaps when you
                     stop near a card and otherwise leaves the scroll alone. */
                  scroll-snap-type: x proximity;
                  /* Don't let an over-scroll at either end chain to the page */
                  overscroll-behavior-x: contain;
                  -webkit-overflow-scrolling: touch;
                  padding: 1rem 0 1.5rem;
                  scrollbar-width: none;
                  /* NOTE: no scroll-padding-inline and no scroll-behavior
                     here. scroll-padding-inline: 50% shifted every snap port
                     by half the track ON TOP OF scroll-snap-align: center,
                     double-counting the offset so cards snapped to a position
                     nowhere near the middle. scroll-behavior: smooth on the
                     element also made every wheel tick animate, which is what
                     made the track feel laggy and rubbery; scrollTo/scrollBy
                     pass behavior:"smooth" explicitly where it is wanted. */
                }
                .services-track::-webkit-scrollbar { display: none; }

                /* Mouse affordance: the track is grabbable. */
                @media (hover: hover) and (pointer: fine) {
                  .services-track { cursor: grab; }
                  .services-track.is-dragging { cursor: grabbing; }
                }

                /* While dragging, snapping and text selection both get in the
                   way — snapping fights each programmatic scrollLeft write,
                   and selection turns the gesture into a text highlight. */
                .services-track.is-dragging {
                  scroll-snap-type: none;
                  scroll-behavior: auto;
                  user-select: none;
                }
                .services-track.is-dragging * {
                  pointer-events: none;
                }

                .services-track > * {
                  scroll-snap-align: center;
                  flex: 0 0 min(100%, 22rem);
                  display: flex;
                }

                /* Show three cards side by side once there is room */
                @media (min-width: 1024px) {
                  .services-track > * { flex-basis: calc((100% - 3rem) / 3); }
                }

                /* Single-card mode. Snapping is mandatory here — with one card
                   on screen there is no ambiguity about where to land, so the
                   selected card always ends up centred.
                   The inline padding is what lets the FIRST and LAST cards
                   reach the centre at all: without it they can only sit
                   flush against their end of the track. */
                @media (max-width: 1023px) {
                  .services-track {
                    scroll-snap-type: x mandatory;
                    padding-inline: max(0px, calc((100% - 22rem) / 2));
                  }
                }

                .service-card {
                  width: 100%;
                  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                              opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                              border-color 0.3s ease;
                }

                /* Recede off-centre cards ONLY while a single card fills the
                   track. Above 1024px three cards are visible at once, so
                   dimming two of the three made a full-width row look broken
                   rather than focused. */
                @media (max-width: 1023px) {
                  .service-card {
                    transform: scale(0.96);
                    opacity: 0.6;
                  }
                  .service-card[data-active="true"] {
                    transform: scale(1);
                    opacity: 1;
                  }
                }

                @media (prefers-reduced-motion: reduce) {
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
              className={`services-track${isDragging ? " is-dragging" : ""}`}
              role="group"
              aria-roledescription="carousel"
              aria-label={t("services.title")}
              tabIndex={0}
              onKeyDown={handleTrackKeyDown}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {services.map((service, index) => {
                const Icon = service.icon;
                const isActive = currentSlide === index;
                const text = copy[service.key as keyof typeof copy];

                return (
                  <div
                    key={service.id}
                    data-index={index}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} / ${services.length}: ${text.title}`}
                  >
                    <motion.div
                      onClick={() => handleCardClick(service, index)}
                      data-active={isActive}
                      className="service-card relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 md:p-8 shadow-[var(--shadow-card)] hover:border-[var(--accent-primary)]/50 group cursor-pointer overflow-visible"
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
                            {t("services.popular")}
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
                      <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors">
                        {text.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] mb-6 leading-relaxed min-h-[60px]">
                        {text.description}
                      </p>

                      {/* Price */}
                      <div className="mb-6 pb-6 border-b border-white/10">
                        <div className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--accent-primary)] mb-1">
                          {text.price}
                        </div>
                        {service.key === 'automation' && (
                          <p className="text-xs text-[var(--accent-primary)] font-mono mb-1">
                            {L(
                              "or fixed from €500/bot",
                              "of vast vanaf €500/bot",
                              "أو سعر ثابت من €500 للبوت",
                              "o fijo desde €500/bot",
                            )}
                          </p>
                        )}
                        <p className="text-xs text-[var(--text-muted)]">
                          {t("services.priceNote")}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        {text.features.slice(0, 4).map((feature, idx) => (
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
                        {text.features.length > 4 && (
                          <p className="text-xs text-[var(--text-muted)] ml-8">
                            +{text.features.length - 4}{" "}
                            {L("more", "meer", "أخرى", "más")}
                          </p>
                        )}
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookService(service);
                        }}
                        className={`w-full py-3 bg-gradient-to-r ${service.gradient} rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all duration-300 group/btn`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Zap className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                        {L("Start project", "Project starten", "ابدأ المشروع", "Iniciar proyecto")}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </motion.button>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <PrevArrow
              onClick={() => step(-1)}
              disabled={edges.atStart}
              label={L("Previous service", "Vorige dienst", "الخدمة السابقة", "Servicio anterior")}
            />
            <NextArrow
              onClick={() => step(1)}
              disabled={edges.atEnd}
              label={L("Next service", "Volgende dienst", "الخدمة التالية", "Servicio siguiente")}
            />
          </motion.div>

          {/* Dots + counter */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            className="text-center mt-8 space-y-3 px-4"
          >
            {/* One dot per scroll stop, not per card. On mobile a stop IS a
                card, so this still renders six; on desktop, where three are
                visible at once, it renders four — the four positions the
                arrows already move between. */}
            {/* On a phone the side arrows sat at the card's right edge, exactly
                where the fixed scroll-to-top button lives - measured at 390px
                the two overlapped within a pixel, so the arrow was covered and
                could not be tapped at all. Below md they move in here, beside
                the dots, where nothing fixed can reach them. */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={edges.atStart}
                aria-label={L("Previous service", "Vorige dienst", "الخدمة السابقة", "Servicio anterior")}
                className={mobileArrowClass}
              >
                <ChevronLeft className="w-5 h-5 text-[var(--accent-primary)]" />
              </button>

              {Array.from({ length: pager.pages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToPage(index)}
                  aria-label={copy[services[index].key as keyof typeof copy].title}
                  aria-current={pager.page === index}
                  className="group/dot grid place-items-center h-6 px-1 -my-2"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      pager.page === index
                        ? "w-6 bg-[var(--accent-primary)]"
                        : "w-2 bg-[var(--text-muted)]/35 group-hover/dot:bg-[var(--accent-primary)]/60"
                    }`}
                  />
                </button>
              ))}

              <button
                type="button"
                onClick={() => step(1)}
                disabled={edges.atEnd}
                aria-label={L("Next service", "Volgende dienst", "الخدمة التالية", "Servicio siguiente")}
                className={mobileArrowClass}
              >
                <ChevronRight className="w-5 h-5 text-[var(--accent-primary)]" />
              </button>
            </div>

            <p className="text-sm text-[var(--text-muted)]" aria-live="polite">
              {pager.page + 1} / {pager.pages}
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