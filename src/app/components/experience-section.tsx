import { motion, useReducedMotion } from "motion/react";
import { Briefcase, Code, Rocket, Calendar, MapPin, Users, Building2, TrendingUp, Award, Zap, Globe, Heart, Target } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useState } from "react";

const experiences = [
  {
    year: "2015",
    title: "Junior Frontend Developer",
    company: "InnoInCo",
    location: "Kharkiv, Ukraine",
    period: "2015 - 2016",
    duration: "1 year",
    story: "The Beginning: From Curiosity to Code",
    storyDescription: "This is where it all started - a young developer's journey into the world of web development. Armed with determination and an insatiable curiosity, I transformed pixels into interactive experiences.",
    achievement: "Built 15+ responsive websites",
    impact: "Learned the art of pixel-perfect design",
    description: [
      "🎨 Learned HTML, CSS, and responsive design fundamentals",
      "🚀 Built landing pages and corporate websites from scratch",
      "✨ Collaborated with design team to implement pixel-perfect layouts",
      "🌐 Gained practical experience with cross-browser compatibility",
      "📱 Mastered mobile-first responsive design approach",
    ],
    icon: Building2,
    color: "#06b6d4",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    year: "2015",
    title: "Freelance Web Developer",
    company: "CIS Market (Self-employed)",
    location: "Remote",
    period: "2015 - 2019",
    duration: "4 years",
    story: "The Freelance Era: Building Trust & Expertise",
    storyDescription: "Four years of hustling, learning, and growing. Every project was a new challenge, every client a new lesson. This period shaped me into a professional who understands not just code, but business.",
    achievement: "40+ successful projects delivered",
    impact: "99% client satisfaction rate",
    description: [
      "⚡ Mastered JavaScript, jQuery, and modern ES6+ features",
      "🎯 Specialized in WordPress development and custom themes",
      "📈 Implemented SEO optimization strategies for client websites",
      "💼 Developed client communication and project planning skills",
      "🔧 Worked with Git version control and Google Analytics",
      "🗄️ Built responsive websites with PHP and MySQL integration",
    ],
    icon: Users,
    color: "#8b5cf6",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    year: "2019",
    title: "Middle Frontend Developer",
    company: "RONIS BT",
    location: "Kyiv, Ukraine",
    period: "May 2019 - Sep 2022",
    duration: "3 years 5 months",
    story: "The E-commerce Revolution: Scale & Performance",
    storyDescription: "Stepping into the world of enterprise e-commerce. Here, milliseconds mattered, and every line of code impacted thousands of users. I learned to think at scale.",
    achievement: "40% performance improvement",
    impact: "Handled 10K+ daily active users",
    description: [
      "🛒 Led Magento 1 & 2 e-commerce platform development",
      "⚛️ Built React applications with modern component architecture",
      "🐳 Gained deep expertise in Node.js, Docker, Linux, and Symfony",
      "🧩 Mastered modular and functional programming approaches",
      "👨‍🏫 Conducted thorough code reviews and mentored junior developers",
      "📧 Created email templates and worked with SQL databases",
      "🌍 Developed multilingual applications for international markets",
      "⚙️ Understood complex product configurations, statuses, and workflows",
      "🤝 Collaborated effectively in team environment with Agile methodology",
      "🚀 Achieved 40% performance boost through optimization techniques",
    ],
    icon: Briefcase,
    color: "var(--accent-primary)",
    gradient: "from-cyan-400 to-blue-600",
  },
  {
    year: "2022",
    title: "Middle JS Developer",
    company: "E-CONSULTING",
    location: "Remote",
    period: "Oct 2022 - Jan 2024",
    duration: "1 year 4 months",
    story: "The Enterprise Challenge: CRM & Integration",
    storyDescription: "Diving into enterprise CRM systems and complex integrations. Working with international teams taught me that great software transcends borders and time zones.",
    achievement: "5+ major CRM integrations",
    impact: "Reduced processing time by 60%",
    description: [
      "⚡ Developed Vue.js applications for MS Dynamics 365 CRM",
      "🔗 Created custom XRM solutions and complex integrations",
      "🌐 Implemented REST API integrations and performance optimizations",
      "🌍 Collaborated with international teams across multiple time zones",
      "💼 Worked with enterprise-level CRM configurations and workflows",
      "📊 Built custom dashboards and reporting tools",
    ],
    icon: Code,
    color: "#a78bfa",
    gradient: "from-purple-400 to-indigo-600",
  },
  {
    year: "2024",
    title: "Full-Stack + AI Developer",
    company: "Currently Building New Projects",
    location: "Europe (Belgium/Netherlands)",
    period: "Feb 2024 - Present",
    duration: "Current",
    story: "The Innovation Phase: AI & Full-Stack Mastery",
    storyDescription: "The journey continues. Now exploring the frontiers of AI, building intelligent applications, and pushing the boundaries of what's possible. The future is being written, one line of code at a time.",
    achievement: "AI-powered portfolio launched",
    impact: "Constantly learning & evolving",
    description: [
      "🤖 Integrating AI/ML technologies into web applications",
      "🎯 Exploring full-stack development with Node.js and modern frameworks",
      "🚀 Building personal projects and contributing to open-source",
      "💡 Developing chatbots for WhatsApp & Telegram",
      "🌟 Open to freelance projects and full-time opportunities",
      "📚 Continuously learning cutting-edge web technologies and best practices",
      "🎨 Creating automation solutions for businesses",
    ],
    icon: Rocket,
    color: "#22c55e",
    gradient: "from-green-400 to-emerald-600",
  },
];

export function ExperienceSection() {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const totalYears = new Date().getFullYear() - 2015;
  const totalProjects = 60; // Rough estimate based on experience

  return (
    <section id="experience" className="min-h-screen py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Enhanced Background Decorations */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[var(--glow-primary)] rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[var(--glow-secondary)] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-20">
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <TrendingUp className="w-5 h-5 text-[var(--accent-primary)]" />
              <span className="text-sm md:text-base text-[var(--text-primary)] font-semibold">My Journey</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl mb-6 text-[var(--text-primary)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {totalYears}+ Years
              </span>
              {" "}of Crafting Digital Experiences
            </motion.h2>

            <motion.div
              className="h-1 w-32 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent mx-auto mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            />

            <motion.p
              className="text-lg md:text-xl text-[var(--text-secondary)] max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              From a curious beginner to a seasoned full-stack developer, every project has been a stepping stone. 
              Here's the story of growth, challenges, and continuous learning.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl">
                <div className="text-3xl md:text-4xl font-bold text-[#00d9ff] mb-1">{totalYears}+</div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">Years Experience</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-1">{totalProjects}+</div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">Projects Delivered</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl">
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-1">99%</div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">Client Satisfaction</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl">
                <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-1">10+</div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">Technologies Mastered</div>
              </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Animated Vertical Line */}
            <motion.div
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:transform md:-translate-x-1/2 overflow-hidden rounded-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#06b6d4] via-[#8b5cf6] via-[#00d9ff] via-[#a78bfa] to-[#22c55e]" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>

            {experiences.map((exp, index) => {
              const Icon = exp.icon;
              const isEven = index % 2 === 0;
              const isExpanded = expandedIndex === index;

              return (
                <motion.div
                  key={index}
                  className="relative mb-32 last:mb-0"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={shouldReduceMotion ? {} : { delay: index * 0.2 }}
                >
                  {/* Timeline Node with pulse effect */}
                  <div className={`absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 top-0 flex items-center justify-center z-20`}>
                    <div className="relative">
                      {/* Pulsing outer ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: exp.color }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      {/* Icon Container with gradient */}
                      <motion.div
                        className={`relative w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl border-4 border-[var(--bg-primary)] bg-gradient-to-br ${exp.gradient}`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Icon className="w-8 h-8 md:w-12 md:h-12 text-white drop-shadow-lg" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
                      </motion.div>

                      {/* Year badge */}
                      <motion.div
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--bg-primary)] border-2 rounded-full text-xs font-bold whitespace-nowrap shadow-lg"
                        style={{ borderColor: exp.color, color: exp.color }}
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                      >
                        {exp.year}
                      </motion.div>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`ml-24 md:ml-0 md:w-[calc(50%-5rem)] ${isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                    <motion.div
                      className="relative group cursor-pointer"
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {/* Glow effect */}
                      <div
                        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                        style={{ background: `linear-gradient(135deg, ${exp.color}40, transparent)` }}
                      />

                      {/* Main card */}
                      <div className={`relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-2 rounded-3xl p-6 md:p-8 transition-all duration-300 ${
                        isExpanded ? 'border-[#00d9ff] shadow-[0_0_50px_rgba(0,217,255,0.3)]' : 'border-white/10 group-hover:border-[#00d9ff]/50'
                      }`}>
                        {/* Story badge */}
                        <motion.div
                          className={`inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full text-sm font-semibold bg-gradient-to-r ${exp.gradient} text-white shadow-lg`}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                        >
                          <Award className="w-4 h-4" />
                          {exp.story}
                        </motion.div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl lg:text-4xl mb-2 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                          {exp.title}
                        </h3>

                        {/* Company with icon and "Currently Building" badge */}
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[var(--text-secondary)]" />
                            <p className="text-lg md:text-xl text-[var(--text-secondary)]">{exp.company}</p>
                          </div>
                          {index === experiences.length - 1 && (
                            <motion.div
                              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/40 rounded-full"
                              animate={{
                                scale: [1, 1.05, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <motion.div
                                className="w-2 h-2 bg-green-400 rounded-full"
                                animate={{
                                  opacity: [1, 0.5, 1],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                }}
                              />
                              <span className="text-xs font-bold text-green-400">ACTIVE NOW</span>
                            </motion.div>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-[var(--text-muted)]">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                            <Calendar className="w-4 h-4" style={{ color: exp.color }} />
                            <span>{exp.period}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                            <MapPin className="w-4 h-4" style={{ color: exp.color }} />
                            <span>{exp.location}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                            <Zap className="w-4 h-4" style={{ color: exp.color }} />
                            <span>{exp.duration}</span>
                          </div>
                        </div>

                        {/* Story description */}
                        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed italic">
                          "{exp.storyDescription}"
                        </p>

                        {/* Achievement badges */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                          <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#00d9ff]/10 to-transparent rounded-xl border border-[#00d9ff]/20">
                            <Target className="w-5 h-5 text-[#00d9ff] flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs text-[var(--text-muted)] mb-1">Achievement</div>
                              <div className="text-sm font-semibold text-[var(--text-primary)]">{exp.achievement}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl border border-purple-500/20">
                            <Heart className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs text-[var(--text-muted)] mb-1">Impact</div>
                              <div className="text-sm font-semibold text-[var(--text-primary)]">{exp.impact}</div>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <motion.div
                          className="h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent mb-6"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                        />

                        {/* Description */}
                        <motion.div
                          initial={false}
                          animate={{ height: isExpanded ? 'auto' : '200px' }}
                          className="overflow-hidden relative"
                        >
                          <ul className="space-y-3">
                            {exp.description.map((item, i) => (
                              <motion.li
                                key={i}
                                className="flex items-start gap-3 text-[var(--text-secondary)] leading-relaxed"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                              >
                                <span className="text-lg">{item}</span>
                              </motion.li>
                            ))}
                          </ul>

                          {/* Fade overlay when collapsed */}
                          {!isExpanded && (
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
                          )}
                        </motion.div>

                        {/* Expand button */}
                        <motion.button
                          className="mt-4 px-4 py-2 text-sm font-semibold rounded-xl transition-all"
                          style={{ 
                            backgroundColor: `${exp.color}20`,
                            color: exp.color,
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isExpanded ? 'Show Less ↑' : 'Read More ↓'}
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative inline-block p-8 md:p-12 bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/10 border-2 border-[var(--accent-primary)]/30 rounded-3xl overflow-hidden">
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 to-purple-500/5"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />

              <div className="relative z-10">
                <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-4 flex items-center justify-center gap-3">
                  <Rocket className="w-6 h-6 text-[var(--accent-primary)]" />
                  Want to be part of this journey?
                </p>
                <p className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Let's build something amazing together!
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}