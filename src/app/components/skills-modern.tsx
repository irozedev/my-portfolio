import { motion, AnimatePresence } from "motion/react";
import { Code2, Palette, Database, Wrench, Globe, Zap, Box, CheckCircle2, X, Award, Briefcase, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

interface SkillExperience {
  company: string;
  role: string;
  period: string;
  achievements: string[];
}

interface Skill {
  name: string;
  icon: typeof Code2;
  color: string;
  level: number;
  experience: string;
  glow: string;
  description: string;
  keyProjects: string[];
  experienceDetails: SkillExperience[];
}

const skills: Skill[] = [
  { 
    name: "React", 
    icon: Code2, 
    color: "#00d9ff", 
    level: 95, 
    experience: "5+ years",
    glow: "shadow-[0_0_20px_rgba(0,217,255,0.3)]",
    description: "Building complex, scalable web applications with React, React Hooks, Context API, and modern state management solutions.",
    keyProjects: [
      "E-commerce platform with 1M+ monthly users",
      "Real-time collaboration tools",
      "Complex admin dashboards with data visualization"
    ],
    experienceDetails: [
      {
        company: "Tech Startup Inc.",
        role: "Senior React Developer",
        period: "2021 - Present",
        achievements: [
          "Led development of main product using React 18",
          "Implemented micro-frontend architecture",
          "Improved app performance by 40%"
        ]
      },
      {
        company: "Digital Agency Pro",
        role: "Frontend Developer",
        period: "2019 - 2021",
        achievements: [
          "Built 15+ React-based client projects",
          "Created reusable component library",
          "Mentored junior developers"
        ]
      }
    ]
  },
  { 
    name: "Vue.js", 
    icon: Palette, 
    color: "#42b883", 
    level: 90, 
    experience: "3+ years",
    glow: "shadow-[0_0_20px_rgba(66,184,131,0.3)]",
    description: "Developing modern SPAs with Vue 3, Composition API, Pinia for state management, and Nuxt.js for SSR applications.",
    keyProjects: [
      "SaaS application with complex workflows",
      "Multi-tenant dashboard system",
      "Progressive Web App for retail"
    ],
    experienceDetails: [
      {
        company: "Enterprise Solutions Ltd",
        role: "Vue.js Specialist",
        period: "2020 - Present",
        achievements: [
          "Migrated legacy app to Vue 3",
          "Implemented SSR with Nuxt.js",
          "Reduced bundle size by 35%"
        ]
      }
    ]
  },
  { 
    name: "JavaScript", 
    icon: Zap, 
    color: "#f7df1e", 
    level: 98, 
    experience: "8+ years",
    glow: "shadow-[0_0_20px_rgba(247,223,30,0.3)]",
    description: "Deep expertise in modern JavaScript (ES6+), async programming, functional programming patterns, and performance optimization.",
    keyProjects: [
      "Custom framework development",
      "Real-time data processing systems",
      "Complex algorithm implementations"
    ],
    experienceDetails: [
      {
        company: "Various Projects",
        role: "JavaScript Engineer",
        period: "2016 - Present",
        achievements: [
          "Built custom JS frameworks from scratch",
          "Optimized critical rendering paths",
          "Created high-performance algorithms"
        ]
      }
    ]
  },
  { 
    name: "TypeScript", 
    icon: Code2, 
    color: "#3178c6", 
    level: 85, 
    experience: "3+ years",
    glow: "shadow-[0_0_20px_rgba(49,120,198,0.3)]",
    description: "Writing type-safe, maintainable code with advanced TypeScript features including generics, utility types, and strict mode.",
    keyProjects: [
      "Enterprise application architecture",
      "Type-safe API layer",
      "Shared TypeScript libraries"
    ],
    experienceDetails: [
      {
        company: "FinTech Startup",
        role: "TypeScript Developer",
        period: "2021 - Present",
        achievements: [
          "Implemented strict TypeScript across codebase",
          "Created custom type definitions",
          "Reduced runtime errors by 60%"
        ]
      }
    ]
  },
  { 
    name: "Node.js", 
    icon: Database, 
    color: "#339933", 
    level: 80, 
    experience: "4+ years",
    glow: "shadow-[0_0_20px_rgba(51,153,51,0.3)]",
    description: "Building scalable backend services, RESTful APIs, GraphQL servers, and real-time applications with Node.js and Express.",
    keyProjects: [
      "Microservices architecture",
      "Real-time chat applications",
      "Payment processing systems"
    ],
    experienceDetails: [
      {
        company: "Cloud Services Inc",
        role: "Backend Developer",
        period: "2020 - Present",
        achievements: [
          "Built scalable microservices",
          "Implemented WebSocket servers",
          "Optimized database queries"
        ]
      }
    ]
  },
  { 
    name: "Tailwind", 
    icon: Palette, 
    color: "#06b6d4", 
    level: 92, 
    experience: "2+ years",
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    description: "Creating beautiful, responsive UI with Tailwind CSS, custom design systems, and utility-first CSS architecture.",
    keyProjects: [
      "Design system implementation",
      "Component library with Tailwind",
      "Mobile-first responsive layouts"
    ],
    experienceDetails: [
      {
        company: "Design Agency",
        role: "UI Developer",
        period: "2022 - Present",
        achievements: [
          "Created custom Tailwind configuration",
          "Built reusable component patterns",
          "Improved design consistency"
        ]
      }
    ]
  },
  { 
    name: "MongoDB", 
    icon: Database, 
    color: "#47a248", 
    level: 75, 
    experience: "3+ years",
    glow: "shadow-[0_0_20px_rgba(71,162,72,0.3)]",
    description: "Designing and optimizing NoSQL databases, aggregation pipelines, indexing strategies, and data modeling.",
    keyProjects: [
      "E-commerce product catalog",
      "User analytics platform",
      "Content management system"
    ],
    experienceDetails: [
      {
        company: "Data Solutions Co",
        role: "Database Developer",
        period: "2021 - Present",
        achievements: [
          "Optimized query performance",
          "Designed scalable schemas",
          "Implemented data aggregation pipelines"
        ]
      }
    ]
  },
  { 
    name: "Magento", 
    icon: Wrench, 
    color: "#ee672f", 
    level: 88, 
    experience: "4+ years",
    glow: "shadow-[0_0_20px_rgba(238,103,47,0.3)]",
    description: "Developing custom e-commerce solutions with Magento 2, custom modules, theme development, and performance optimization.",
    keyProjects: [
      "Multi-store e-commerce platforms",
      "Custom payment integrations",
      "B2B e-commerce solutions"
    ],
    experienceDetails: [
      {
        company: "E-commerce Agency",
        role: "Magento Developer",
        period: "2019 - Present",
        achievements: [
          "Built custom Magento modules",
          "Integrated third-party services",
          "Optimized site performance"
        ]
      }
    ]
  },
  { 
    name: "3D Design", 
    icon: Box, 
    color: "#ff6b6b", 
    level: 70, 
    experience: "2+ years",
    glow: "shadow-[0_0_20px_rgba(255,107,107,0.3)]",
    description: "Creating interactive 3D experiences with Three.js, WebGL, and modern 3D libraries for immersive web applications.",
    keyProjects: [
      "Product configurator 3D viewer",
      "Interactive portfolio with 3D elements",
      "WebGL-based visualizations"
    ],
    experienceDetails: [
      {
        company: "Creative Studio",
        role: "3D Web Developer",
        period: "2022 - Present",
        achievements: [
          "Built interactive 3D product viewers",
          "Optimized 3D performance",
          "Created immersive experiences"
        ]
      }
    ]
  },
];

export function SkillsModern() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.button
                key={skill.name}
                onClick={() => setSelectedSkill(skill)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-[var(--bg-secondary)]/50 backdrop-blur-sm border-2 border-[var(--border-color)] rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-[#00d9ff] transition-all duration-300 overflow-hidden cursor-pointer text-left"
              >
                {/* TAP/CLICK Hint Badge */}
                <div className="absolute top-2 right-2 z-20">
                  <motion.span
                    className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                  >
                    {isMobile ? '👆 TAP' : '🖱️ CLICK'}
                  </motion.span>
                </div>

                {/* Animated Background Gradient */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ 
                    background: `radial-gradient(circle at center, ${skill.color}15, transparent 70%)` 
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Pulse Effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl sm:rounded-2xl"
                  style={{ 
                    boxShadow: `0 0 0 0 ${skill.color}40`
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 0 0 ${skill.color}40`,
                      `0 0 0 8px ${skill.color}00`,
                      `0 0 0 0 ${skill.color}40`,
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <motion.div 
                        className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 flex-shrink-0"
                        style={{ backgroundColor: `${skill.color}20` }}
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: skill.color }} />
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-[#00d9ff] transition-colors truncate">
                          {skill.name}
                        </h4>
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          {skill.experience}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <motion.span 
                        className="text-lg sm:text-xl font-bold whitespace-nowrap" 
                        style={{ color: skill.color }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {skill.level}%
                      </motion.span>
                    </div>
                  </div>

                  {/* Click Hint */}
                  <motion.div
                    className="text-xs text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    initial={{ y: -10 }}
                    whileHover={{ y: 0 }}
                  >
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                    Click to see experience
                  </motion.div>
                </div>

                {/* Expert Badge */}
                {skill.level >= 85 && (
                  <motion.div 
                    className="absolute top-2 sm:top-3 right-2 sm:right-3"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                  >
                    <div className="p-0.5 sm:p-1 bg-green-500/20 rounded-full backdrop-blur-sm">
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--bg-primary)] border-2 rounded-2xl shadow-2xl"
              style={{ borderColor: selectedSkill.color }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div 
                className="sticky top-0 z-10 p-6 border-b border-white/10 backdrop-blur-xl"
                style={{ 
                  background: `linear-gradient(135deg, ${selectedSkill.color}20, transparent)` 
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-4 rounded-2xl"
                      style={{ backgroundColor: `${selectedSkill.color}20` }}
                    >
                      <selectedSkill.icon className="w-8 h-8" style={{ color: selectedSkill.color }} />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1">
                        {selectedSkill.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {selectedSkill.experience}
                        </span>
                        <span className="flex items-center gap-1 font-bold" style={{ color: selectedSkill.color }}>
                          <Award className="w-4 h-4" />
                          {selectedSkill.level}% Proficiency
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-[var(--text-secondary)]" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Overview
                  </h4>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {selectedSkill.description}
                  </p>
                </div>

                {/* Key Projects */}
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                    Key Projects
                  </h4>
                  <div className="space-y-2">
                    {selectedSkill.keyProjects.map((project, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-2 text-[var(--text-secondary)]"
                      >
                        <CheckCircle2 
                          className="w-5 h-5 mt-0.5 flex-shrink-0" 
                          style={{ color: selectedSkill.color }} 
                        />
                        <span>{project}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Experience Timeline */}
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                    Professional Experience
                  </h4>
                  <div className="space-y-4">
                    {selectedSkill.experienceDetails.map((exp, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className="relative pl-6 pb-4 border-l-2"
                        style={{ borderColor: `${selectedSkill.color}40` }}
                      >
                        {/* Timeline Dot */}
                        <div 
                          className="absolute left-[-6px] top-0 w-3 h-3 rounded-full"
                          style={{ backgroundColor: selectedSkill.color }}
                        />

                        <div className="space-y-2">
                          <div>
                            <h5 className="font-bold text-[var(--text-primary)]">
                              {exp.role}
                            </h5>
                            <p className="text-sm" style={{ color: selectedSkill.color }}>
                              {exp.company}
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {exp.period}
                            </p>
                          </div>
                          <ul className="space-y-1.5">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                                <span className="text-[var(--text-muted)] mt-1">•</span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}