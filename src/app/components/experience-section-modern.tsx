import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Briefcase, Calendar, MapPin, Award, Zap, Code, Rocket, TrendingUp, Building2, Users, Globe, Heart, Target, ChevronRight, Sparkles, ChevronDown } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useRef, useState, useEffect } from "react";
import { ExperienceTimelineMobile } from "./experience-timeline-mobile";

const experiences = [
  {
    year: "2015",
    title: "Junior Frontend Developer",
    company: "InnoInCo",
    location: "Kharkiv, Ukraine",
    period: "2015 - 2016",
    duration: "1 year",
    achievement: "Built 15+ responsive websites",
    impact: "Learned pixel-perfect design",
    description: [
      "HTML, CSS, Responsive Design",
      "Landing Pages & Corporate Sites",
      "Cross-browser Compatibility",
      "Mobile-First Approach",
    ],
    detailedInfo: {
      summary: "Started my journey in web development, focusing on creating responsive and accessible websites for local businesses.",
      keyProjects: [
        "Corporate websites for 10+ Ukrainian companies",
        "Landing pages with conversion rates up to 8%",
        "Implemented responsive grids using Bootstrap & custom CSS"
      ],
      technologies: [
        "HTML5, CSS3, SASS",
        "JavaScript (ES5), jQuery",
        "Bootstrap 3/4",
        "Photoshop for web design"
      ],
      learnings: [
        "Mastered semantic HTML and CSS best practices",
        "Learned to work with designers and translate mockups to code",
        "Understanding of cross-browser compatibility issues and solutions",
        "Foundation in performance optimization"
      ]
    },
    icon: Building2,
    color: "#06b6d4",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    year: "2015-2019",
    title: "Freelance Web Developer",
    company: "CIS Market",
    location: "Remote",
    period: "2015 - 2019",
    duration: "4 years",
    achievement: "40+ successful projects",
    impact: "99% client satisfaction",
    description: [
      "JavaScript, jQuery, ES6+",
      "WordPress Custom Themes",
      "SEO Optimization",
      "PHP & MySQL Integration",
    ],
    detailedInfo: {
      summary: "Expanded expertise through diverse freelance projects across CIS markets, building custom WordPress solutions and JavaScript applications.",
      keyProjects: [
        "Custom WordPress themes for e-commerce (WooCommerce)",
        "Dynamic web applications with AJAX and real-time updates",
        "SEO-optimized websites ranking in top 3 for target keywords",
        "Multi-language websites with custom translation systems"
      ],
      technologies: [
        "WordPress (Theme & Plugin Development)",
        "PHP 7+, MySQL, REST APIs",
        "JavaScript ES6+, jQuery, AJAX",
        "SEO tools: Yoast, Google Analytics, Search Console"
      ],
      learnings: [
        "Client communication and project management skills",
        "Building scalable WordPress architectures",
        "SEO best practices and content optimization",
        "Database design and query optimization"
      ]
    },
    icon: Users,
    color: "#8b5cf6",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    year: "2019",
    title: "Frontend Developer",
    company: "UKAD Group",
    location: "Remote",
    period: "2019 - 2020",
    duration: "1 year",
    achievement: "Modernized 10+ platforms",
    impact: "Improved performance by 40%",
    description: [
      "Vue.js & React Development",
      "RESTful API Integration",
      "Performance Optimization",
      "Component Architecture",
    ],
    detailedInfo: {
      summary: "Transitioned to modern JavaScript frameworks, leading modernization efforts for legacy platforms and implementing best practices.",
      keyProjects: [
        "Migrated jQuery applications to Vue.js with improved performance",
        "Built reusable component library used across 5+ projects",
        "Implemented state management with Vuex",
        "Optimized bundle sizes reducing load time by 40%"
      ],
      technologies: [
        "Vue.js 2/3, Vuex, Vue Router",
        "React 16+, Redux basics",
        "Webpack, Babel, modern build tools",
        "RESTful APIs, Axios, Fetch"
      ],
      learnings: [
        "Component-based architecture principles",
        "State management patterns",
        "Modern JavaScript tooling and workflows",
        "Performance profiling and optimization techniques"
      ]
    },
    icon: Rocket,
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    year: "2020",
    title: "Frontend Developer",
    company: "WebCompanion",
    location: "Remote",
    period: "2020 - 2021",
    duration: "1 year",
    achievement: "Built 8+ e-commerce sites",
    impact: "Increased conversions by 35%",
    description: [
      "Magento Development",
      "E-commerce Solutions",
      "Payment Gateway Integration",
      "Custom Module Development",
    ],
    detailedInfo: {
      summary: "Specialized in e-commerce development with Magento, creating high-converting online stores with complex integrations.",
      keyProjects: [
        "Large-scale Magento 2 stores with 10,000+ products",
        "Custom payment gateway integrations (PayPal, Stripe, local providers)",
        "Advanced product configurators with real-time pricing",
        "Multi-store setups with shared catalog and inventory"
      ],
      technologies: [
        "Magento 2 (Frontend & Backend)",
        "PHP 7.4+, MySQL, Redis",
        "Knockout.js, RequireJS, jQuery",
        "Payment APIs, Shipping integrations"
      ],
      learnings: [
        "E-commerce platform architecture and scalability",
        "Payment processing security (PCI compliance)",
        "Inventory management systems",
        "Conversion rate optimization (CRO) techniques"
      ]
    },
    icon: TrendingUp,
    color: "#22c55e",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "exp1",
    year: "2021-Now",
    title: "Senior Frontend Developer",
    company: "roze.live",
    location: "Belgium",
    period: "2021 - Present",
    duration: "4+ years",
    achievement: "Leading modern projects",
    impact: "Cutting-edge solutions",
    description: [
      "React, TypeScript, Next.js",
      "AI Integration & Automation",
      "Full-Stack Development",
      "Team Leadership",
    ],
    detailedInfo: {
      summary: "Leading modern web development projects with focus on cutting-edge technologies, AI integration, and delivering enterprise-grade solutions.",
      keyProjects: [
        "Next.js applications with SSR/SSG for optimal performance",
        "AI-powered features using OpenAI, Claude, and custom models",
        "Real-time collaborative tools with WebSockets",
        "Design systems and component libraries used by multiple teams"
      ],
      technologies: [
        "React 18+, Next.js 14+, TypeScript",
        "Tailwind CSS, Framer Motion, advanced animations",
        "Node.js, Supabase, PostgreSQL",
        "AI APIs: OpenAI, Anthropic, Vercel AI SDK"
      ],
      learnings: [
        "AI/ML integration in web applications",
        "System architecture and scalability design",
        "Team mentorship and code review practices",
        "Modern DevOps and CI/CD workflows"
      ]
    },
    icon: Award,
    color: "#00d9ff",
    gradient: "from-cyan-400 to-blue-400",
  },
];

export function ExperienceSectionModern() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const hoverStartTimeRef = useRef<number | null>(null);
  const [hasShownPrompt, setHasShownPrompt] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const toggleCard = (index: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Track hover time and show chatbot prompt if user hovers for 3+ seconds
  useEffect(() => {
    if (hoveredCard === null) {
      hoverStartTimeRef.current = null;
      return;
    }

    hoverStartTimeRef.current = Date.now();

    const checkHoverDuration = setInterval(() => {
      if (hoverStartTimeRef.current && !hasShownPrompt) {
        const duration = Date.now() - hoverStartTimeRef.current;
        if (duration >= 3000) { // 3 seconds
          const exp = experiences[hoveredCard];
          setHasShownPrompt(true);
          
          // Set chatbot context
          sessionStorage.setItem('chatbotExperience', exp.company);
          sessionStorage.setItem('chatbotExperienceRole', exp.title);
          sessionStorage.setItem('chatbotExperiencePeriod', exp.period);
          
          // Show chatbot with custom message
          const event = new CustomEvent('openChatBot');
          window.dispatchEvent(event);
          
          clearInterval(checkHoverDuration);
        }
      }
    }, 500);

    return () => clearInterval(checkHoverDuration);
  }, [hoveredCard, hasShownPrompt]);

  return (
    <section 
      id="experience" 
      ref={containerRef}
      className="relative py-12 md:py-16 px-4 bg-[var(--bg-primary)] overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-gradient-to-r from-[var(--accent-primary)]/10 to-purple-500/10 backdrop-blur-sm border border-[var(--accent-primary)]/20 rounded-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
            <span className="text-sm font-medium text-[var(--accent-primary)] whitespace-nowrap">9 YEARS OF INNOVATION</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
              Experience Timeline
            </span>
          </h2>
          
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
            From startup hustle to enterprise scale — building the future of web
          </p>
        </motion.div>

        {/* 3D Floating Timeline Cards */}
        <div className="relative mt-16 lg:mt-24">
          {/* Mobile Timeline - Use dedicated mobile component */}
          <ExperienceTimelineMobile experiences={experiences} />

          {/* Desktop Timeline */}
          <div className="hidden lg:block">
            {/* Central Timeline Line */}
            <motion.div
              className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--accent-primary)] via-purple-500 to-pink-500"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
            />

            {/* Experience Cards */}
            <div className="space-y-24">
              {experiences.map((exp, index) => {
                const isEven = index % 2 === 0;
                const isSelected = false;
                const isExpanded = expandedCards.has(index);
                
                // Click handler to open chatbot
                const handleCardClick = () => {
                  sessionStorage.setItem('chatbotExperience', exp.company);
                  sessionStorage.setItem('chatbotExperienceRole', exp.title);
                  sessionStorage.setItem('chatbotExperiencePeriod', exp.period);
                  const event = new CustomEvent('openChatBot');
                  window.dispatchEvent(event);
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`relative lg:grid lg:grid-cols-2 lg:gap-12 items-center ${
                      isEven ? "" : "lg:flex-row-reverse"
                    }`}
                  >
                    {/* Card */}
                    <motion.div
                      className={`relative ${isEven ? "lg:col-start-1" : "lg:col-start-2"}`}
                      whileHover={{ 
                        scale: 1.02,
                        rotateY: isEven ? 2 : -2,
                        z: 50
                      }}
                      onClick={handleCardClick}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="group relative bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] backdrop-blur-xl rounded-3xl border border-[var(--border-color)] p-6 md:p-8 overflow-hidden cursor-pointer transition-all duration-500 hover:border-[var(--accent-primary)]/50">
                        {/* Glow Effect */}
                        <motion.div
                          className={`absolute -inset-1 bg-gradient-to-r ${exp.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                        />

                        {/* Content */}
                        <div className="relative z-10">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <motion.div
                                className={`p-4 rounded-2xl bg-gradient-to-br ${exp.gradient} shadow-lg`}
                                style={{
                                  boxShadow: `0 8px 25px ${exp.color}40`,
                                }}
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                              >
                                <exp.icon className="w-8 h-8 text-white" />
                              </motion.div>
                              <div>
                                <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-1">
                                  {exp.title}
                                </h3>
                                <p className="text-lg font-semibold text-[var(--accent-primary)]">
                                  {exp.company}
                                </p>
                              </div>
                            </div>
                            
                            {/* Improved Year Badge */}
                            <motion.div
                              className="flex flex-col items-end gap-1"
                              whileHover={{ scale: 1.05 }}
                            >
                              <motion.div
                                className={`relative px-5 py-2.5 rounded-2xl bg-gradient-to-br ${exp.gradient} text-white font-bold text-base shadow-lg overflow-hidden`}
                                style={{
                                  boxShadow: `0 8px 25px ${exp.color}50, 0 0 40px ${exp.color}30`,
                                }}
                                whileHover={{ 
                                  boxShadow: `0 12px 35px ${exp.color}60, 0 0 50px ${exp.color}40`,
                                }}
                              >
                                {/* Shine effect */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: '100%' }}
                                  transition={{ duration: 0.6 }}
                                />
                                <span className="relative z-10 flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {exp.year}
                                </span>
                              </motion.div>
                              <span className="text-xs text-[var(--text-secondary)] font-medium">
                                {exp.duration}
                              </span>
                            </motion.div>
                          </div>

                          {/* Meta Info */}
                          <div className="flex flex-wrap gap-4 mb-4 text-sm text-[var(--text-secondary)]">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{exp.period}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{exp.location}</span>
                            </div>
                          </div>

                          {/* Achievements */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2 p-3 bg-[var(--bg-primary)]/50 rounded-xl border border-[var(--border-color)]">
                              <Award className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                              <span className="text-sm text-[var(--text-secondary)]">{exp.achievement}</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-[var(--bg-primary)]/50 rounded-xl border border-[var(--border-color)]">
                              <Target className="w-5 h-5 text-green-400 flex-shrink-0" />
                              <span className="text-sm text-[var(--text-secondary)]">{exp.impact}</span>
                            </div>
                          </div>

                          {/* Tech Stack Details - Always Visible */}
                          <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
                            {exp.description.map((item, i) => (
                              <motion.div
                                key={i}
                                initial={{ x: -20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + i * 0.05 }}
                                className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                              >
                                <ChevronRight className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
                                <span>{item}</span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Expandable Detailed Info */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-6 mt-6 border-t border-[var(--border-color)] space-y-6">
                                  {/* Summary */}
                                  <div>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                      {exp.detailedInfo.summary}
                                    </p>
                                  </div>

                                  {/* Key Projects */}
                                  <div>
                                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                      <Rocket className="w-4 h-4 text-[var(--accent-primary)]" />
                                      Key Projects
                                    </h4>
                                    <div className="space-y-2">
                                      {exp.detailedInfo.keyProjects.map((project, i) => (
                                        <motion.div
                                          key={i}
                                          initial={{ x: -20, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{ delay: i * 0.05 }}
                                          className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                                        >
                                          <ChevronRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                          <span>{project}</span>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Technologies */}
                                  <div>
                                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                      <Code className="w-4 h-4 text-[var(--accent-primary)]" />
                                      Technologies Used
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {exp.detailedInfo.technologies.map((tech, i) => (
                                        <motion.span
                                          key={i}
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ delay: i * 0.03 }}
                                          className={`px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r ${exp.gradient} bg-opacity-10 text-[var(--text-primary)] border border-[var(--border-color)]`}
                                        >
                                          {tech}
                                        </motion.span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Key Learnings */}
                                  <div>
                                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                                      Key Learnings
                                    </h4>
                                    <div className="space-y-2">
                                      {exp.detailedInfo.learnings.map((learning, i) => (
                                        <motion.div
                                          key={i}
                                          initial={{ x: -20, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{ delay: i * 0.05 }}
                                          className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                                        >
                                          <ChevronRight className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                          <span>{learning}</span>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Learn More Button */}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCard(index);
                            }}
                            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border-color)] text-sm font-medium text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/50 transition-all duration-300 group/btn"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span>{isExpanded ? "Show Less" : "Learn More"}</span>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.div>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Timeline Node (Desktop Only) */}
                    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        className="relative"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <motion.div
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${exp.gradient} border-4 border-[var(--bg-primary)] z-10 relative`}
                          whileHover={{ scale: 1.5 }}
                          animate={{
                            boxShadow: [
                              `0 0 0 0 ${exp.color}40`,
                              `0 0 0 20px ${exp.color}00`,
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Connecting Line (Mobile) */}
                    <div className="lg:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent-primary)] to-purple-500" />
                    <div className="lg:hidden absolute left-4 top-8 w-3 h-3 rounded-full bg-[var(--accent-primary)] -translate-x-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: "Years Experience", value: "9+", icon: Calendar, color: "from-cyan-500 to-blue-500" },
            { label: "Companies", value: "5+", icon: Building2, color: "from-purple-500 to-pink-500" },
            { label: "Projects", value: "50+", icon: Rocket, color: "from-amber-500 to-orange-500" },
            { label: "Technologies", value: "20+", icon: Code, color: "from-green-500 to-emerald-500" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="relative group"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="relative bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] backdrop-blur-xl rounded-2xl border border-[var(--border-color)] p-6 text-center overflow-hidden">
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-[var(--accent-primary)]" />
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}