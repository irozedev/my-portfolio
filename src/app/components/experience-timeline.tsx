import { motion } from "motion/react";
import { 
  Briefcase, Code, Rocket, Calendar, MapPin, Building2, 
  TrendingUp, Award, Zap, Target, Heart, CheckCircle2
} from "lucide-react";

const experiences = [
  {
    year: "2024",
    title: "Full-Stack + AI Developer",
    company: "Learning & Building",
    location: "Europe (Belgium/Netherlands)",
    period: "Feb 2024 - Present",
    duration: "Current Position",
    achievement: "AI-powered portfolio launched",
    impact: "Constantly learning & evolving",
    description: [
      "Integrating AI/ML technologies into web applications",
      "Exploring full-stack development with Node.js and modern frameworks",
      "Building personal projects and contributing to open-source",
      "Developing chatbots for WhatsApp & Telegram",
      "Open to freelance projects and full-time opportunities",
      "Continuously learning cutting-edge web technologies",
      "Creating automation solutions for businesses",
    ],
    icon: Rocket,
    color: "#22c55e",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    year: "2022",
    title: "Middle JS Developer",
    company: "E-CONSULTING",
    location: "Remote",
    period: "Oct 2022 - Jan 2024",
    duration: "1 year 4 months",
    achievement: "5+ major CRM integrations",
    impact: "Reduced processing time by 60%",
    description: [
      "Developed Vue.js applications for MS Dynamics 365 CRM",
      "Created custom XRM solutions and complex integrations",
      "Implemented REST API integrations and performance optimizations",
      "Collaborated with international teams across multiple time zones",
      "Worked with enterprise-level CRM configurations and workflows",
      "Built custom dashboards and reporting tools",
    ],
    icon: Code,
    color: "#a78bfa",
    gradient: "from-purple-400 to-indigo-600",
  },
  {
    year: "2019",
    title: "Middle Frontend Developer",
    company: "RONIS BT",
    location: "Kyiv, Ukraine",
    period: "May 2019 - Sep 2022",
    duration: "3 years 5 months",
    achievement: "40% performance improvement",
    impact: "Handled 10K+ daily active users",
    description: [
      "Led Magento 1 & 2 e-commerce platform development",
      "Built React applications with modern component architecture",
      "Gained deep expertise in Node.js, Docker, Linux, and Symfony",
      "Mastered modular and functional programming approaches",
      "Conducted thorough code reviews and mentored junior developers",
      "Created email templates and worked with SQL databases",
      "Developed multilingual applications for international markets",
      "Achieved 40% performance boost through optimization techniques",
    ],
    icon: Briefcase,
    color: "#00d9ff",
    gradient: "from-cyan-400 to-blue-600",
  },
  {
    year: "2015",
    title: "Freelance Web Developer",
    company: "CIS Market (Self-employed)",
    location: "Remote",
    period: "2015 - 2019",
    duration: "4 years",
    achievement: "40+ successful projects delivered",
    impact: "99% client satisfaction rate",
    description: [
      "Mastered JavaScript, jQuery, and modern ES6+ features",
      "Specialized in WordPress development and custom themes",
      "Implemented SEO optimization strategies for client websites",
      "Developed client communication and project planning skills",
      "Worked with Git version control and Google Analytics",
      "Built responsive websites with PHP and MySQL integration",
    ],
    icon: TrendingUp,
    color: "#8b5cf6",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    year: "2015",
    title: "Junior Frontend Developer",
    company: "InnoInCo",
    location: "Kharkiv, Ukraine",
    period: "2015 - 2016",
    duration: "1 year",
    achievement: "Built 15+ responsive websites",
    impact: "Learned the art of pixel-perfect design",
    description: [
      "Learned HTML, CSS, and responsive design fundamentals",
      "Built landing pages and corporate websites from scratch",
      "Collaborated with design team to implement pixel-perfect layouts",
      "Gained practical experience with cross-browser compatibility",
      "Mastered mobile-first responsive design approach",
    ],
    icon: Building2,
    color: "#06b6d4",
    gradient: "from-cyan-500 to-blue-500",
  },
];

export function ExperienceTimeline() {
  const totalYears = new Date().getFullYear() - 2015;
  const totalProjects = 60;

  return (
    <section id="experience" className="py-20 px-4 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-gradient-to-r from-[#00d9ff]/20 to-purple-500/20 border border-[#00d9ff]/30 rounded-full backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <TrendingUp className="w-5 h-5 text-[#00d9ff]" />
            <span className="text-sm md:text-base text-[var(--text-primary)] font-semibold">Career Journey</span>
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
            {" "}of Experience
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            From junior developer to full-stack specialist. Every step shaped who I am today.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl">
              <div className="text-3xl md:text-4xl font-bold text-[#00d9ff] mb-1">{totalYears}+</div>
              <div className="text-xs md:text-sm text-[var(--text-secondary)]">Years</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-1">{totalProjects}+</div>
              <div className="text-xs md:text-sm text-[var(--text-secondary)]">Projects</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-1">99%</div>
              <div className="text-xs md:text-sm text-[var(--text-secondary)]">Satisfaction</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl">
              <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-1">10+</div>
              <div className="text-xs md:text-sm text-[var(--text-secondary)]">Technologies</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 md:transform md:-translate-x-1/2">
            <div className="absolute inset-0 bg-gradient-to-b from-green-400 via-purple-500 via-cyan-400 via-purple-400 to-cyan-500" />
          </div>

          {/* Timeline Items */}
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={index}
                className="relative mb-16 last:mb-0"
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Timeline Node */}
                <div className="absolute -left-4 md:left-1/2 md:transform md:-translate-x-1/2 z-20">
                  <motion.div
                    className={`w-8 h-8 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl border-2 md:border-4 border-[var(--bg-primary)] bg-gradient-to-br ${exp.gradient}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon className="w-4 h-4 md:w-8 md:h-8 text-white drop-shadow-lg" />
                  </motion.div>
                </div>

                {/* Content Card */}
                <div className={`ml-8 md:ml-0 md:w-[calc(50%-4rem)] ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <motion.div
                    className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-2 border-white/10 rounded-3xl p-6 md:p-8 hover:border-[#00d9ff]/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    {/* Year Badge */}
                    <motion.div
                      className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full text-sm font-bold bg-gradient-to-r"
                      style={{ 
                        background: `linear-gradient(to right, ${exp.color}40, ${exp.color}20)`,
                        color: exp.color,
                        border: `2px solid ${exp.color}50`,
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                      {exp.year}
                    </motion.div>

                    {/* Title & Company */}
                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[#00d9ff] transition-colors">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-5 h-5 text-[var(--text-secondary)]" />
                      <p className="text-lg text-[var(--text-secondary)]">{exp.company}</p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                        <MapPin className="w-4 h-4" style={{ color: exp.color }} />
                        <span className="text-sm text-[var(--text-secondary)]">{exp.location}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                        <Zap className="w-4 h-4" style={{ color: exp.color }} />
                        <span className="text-sm text-[var(--text-secondary)]">{exp.duration}</span>
                      </div>
                    </div>

                    {/* Achievement Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
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
                    <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/50 to-transparent mb-4" />

                    {/* Description */}
                    <ul className="space-y-2">
                      {exp.description.map((item, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-3 text-[var(--text-secondary)] leading-relaxed"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: exp.color }} />
                          <span className="text-sm">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
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
          <div className="relative inline-block p-8 md:p-12 bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/10 border-2 border-[var(--accent-primary)]/30 rounded-3xl">
            <div className="relative z-10">
              <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-4 flex items-center justify-center gap-3">
                <Rocket className="w-6 h-6 text-[var(--accent-primary)]" />
                Ready to work together?
              </p>
              <p className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Let's create something amazing!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}