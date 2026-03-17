import { motion } from "motion/react";
import { Briefcase, MapPin, Calendar, Award, ChevronRight, Code2, Rocket, Building2, Users, Target } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/language-context";

const experiences = [
  {
    id: 1,
    year: "2025",
    period: "Jan 2025 - Present",
    title: "Self-Development & AI Learning",
    company: "Independent Study",
    location: "Remote",
    type: "Learning",
    description: "Improving skills and studying AI technologies, machine learning, and modern development practices",
    achievements: [
      "Deep diving into AI/ML technologies",
      "Building AI-powered applications",
      "Exploring LLMs and neural networks",
      "Enhancing full-stack expertise"
    ],
    tech: ["AI/ML", "Python", "TensorFlow", "LLMs", "React", "Next.js"],
    icon: Rocket,
    gradient: "from-cyan-500 via-blue-500 to-purple-500",
    color: "#00d9ff"
  },
  {
    id: 2,
    year: "2024",
    period: "Oct 2022 - Dec 2024",
    title: "Senior Full-Stack Developer",
    company: "eConsulting",
    location: "Remote, EU",
    type: "Full-time",
    description: "Led full-stack development projects, built enterprise solutions, and mentored development teams",
    achievements: [
      "Built 15+ enterprise applications",
      "Managed projects worth €800K+ total value",
      "Achieved 99% client satisfaction rate",
      "Implemented CI/CD pipelines and DevOps practices"
    ],
    tech: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    icon: Code2,
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    color: "#a78bfa"
  },
  {
    id: 3,
    year: "2022",
    period: "May 2019 - Sep 2022",
    title: "Full-Stack Developer",
    company: "Ronis",
    location: "Ukraine",
    type: "Full-time",
    description: "Developed web applications, managed databases, and built RESTful APIs for various business solutions",
    achievements: [
      "Delivered 25+ production applications",
      "Optimized database performance by 60%",
      "Built scalable REST APIs",
      "Mentored 3 junior developers"
    ],
    tech: ["React", "Node.js", "Express", "MongoDB", "MySQL", "Docker"],
    icon: Users,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    color: "#10b981"
  },
  {
    id: 4,
    year: "2019",
    period: "2015 - 2019",
    title: "Freelance Web Developer",
    company: "Freelance",
    location: "Ukraine",
    type: "Freelance",
    description: "Built custom web solutions, WordPress sites, and JavaScript applications for 50+ clients across CIS market",
    achievements: [
      "Delivered 50+ successful projects",
      "Maintained 99% client satisfaction",
      "Ranked websites in top 3 for SEO",
      "Built e-commerce stores with WooCommerce"
    ],
    tech: ["WordPress", "PHP", "JavaScript", "jQuery", "MySQL", "HTML/CSS"],
    icon: Building2,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    color: "#f59e0b"
  },
];

export function ExperienceTimelinePremium() {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section
      id="experience"
      className="relative py-6 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[var(--bg-primary)] overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-full mb-6"
          >
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">Career Journey</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[var(--text-primary)] via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {t("experience.title") || "Work Experience"}
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            {t("experience.subtitle") || "9+ years building exceptional digital products"}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line - Desktop */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-pink-500/50 hidden md:block -translate-x-1/2" />
          
          {/* Timeline Line - Mobile */}
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-pink-500/50 block md:hidden" />

          {/* Timeline Items */}
          <div className="space-y-12 md:space-y-16">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              const Icon = exp.icon;
              const isSelected = selectedId === exp.id;
              const isHovered = hoveredId === exp.id;

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative grid md:grid-cols-2 gap-8 items-start pl-16 md:pl-0"
                  onMouseEnter={() => setHoveredId(exp.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Mobile Icon (Left Side) */}
                  <div className="block md:hidden absolute left-0 top-4">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.2 }}
                      animate={{
                        scale: isHovered || isSelected ? 1.15 : 1,
                      }}
                    >
                      {/* Outer Ring */}
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${exp.gradient} p-0.5 shadow-[0_0_20px_rgba(0,217,255,0.4)]`}>
                        {/* Inner Circle */}
                        <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-cyan-400" />
                        </div>
                      </div>

                      {/* Glow */}
                      <div
                        className="absolute inset-0 rounded-full blur-lg opacity-50"
                        style={{
                          background: `radial-gradient(circle, ${exp.color}, transparent)`,
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Content Card - Always on left side on mobile, alternating on desktop */}
                  <motion.div
                    className={`${isEven ? "md:pr-12" : "md:pl-12 md:col-start-2"} w-full`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-2 ${
                      isHovered || isSelected ? "border-cyan-500/50" : "border-white/10"
                    } rounded-2xl p-6 md:p-8 transition-all duration-500 cursor-pointer group relative overflow-hidden`}
                      onClick={() => setSelectedId(isSelected ? null : exp.id)}
                    >
                      {/* Glow Effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          background: `radial-gradient(circle at ${isEven ? "right" : "left"} center, ${exp.color}15 0%, transparent 70%)`,
                        }}
                      />

                      {/* Year Badge */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${exp.gradient} rounded-full mb-4`}>
                        <Calendar className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold text-white">{exp.year}</span>
                      </div>

                      {/* Company & Role */}
                      <div className="relative z-10 mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-cyan-400 transition-colors">
                          {exp.title}
                        </h3>
                        <div className="flex items-center gap-4 text-[var(--text-secondary)] flex-wrap">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Building2 className="w-4 h-4" />
                            {exp.company}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {exp.location}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] mt-2">{exp.period}</p>
                      </div>

                      {/* Description */}
                      <p className="text-[var(--text-secondary)] mb-4 leading-relaxed relative z-10">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      <motion.div
                        initial={false}
                        animate={{ height: isSelected ? "auto" : 0, opacity: isSelected ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 mb-4 pt-4 border-t border-white/10">
                          {exp.achievements.map((achievement, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: isSelected ? 1 : 0, x: isSelected ? 0 : -20 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-2"
                            >
                              <Award className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-[var(--text-secondary)]">{achievement}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                        {exp.tech.slice(0, isSelected ? exp.tech.length : 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-[var(--text-secondary)] hover:border-cyan-500/50 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                        {!isSelected && exp.tech.length > 3 && (
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-[var(--text-muted)]">
                            +{exp.tech.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Expand Button */}
                      <button
                        className={`text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors relative z-10 ${
                          isEven ? "md:ml-auto" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(isSelected ? null : exp.id);
                        }}
                      >
                        {isSelected ? "Show Less" : "Show More"}
                        <motion.div
                          animate={{ rotate: isSelected ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      </button>
                    </div>
                  </motion.div>

                  {/* Timeline Node (Desktop) */}
                  <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.2 }}
                      animate={{
                        scale: isHovered || isSelected ? 1.2 : 1,
                      }}
                    >
                      {/* Outer Ring */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${exp.gradient} p-1 shadow-[0_0_30px_rgba(0,217,255,0.4)]`}>
                        {/* Inner Circle */}
                        <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                          <Icon className="w-7 h-7 text-cyan-400" />
                        </div>
                      </div>

                      {/* Glow */}
                      <div
                        className="absolute inset-0 rounded-full blur-xl opacity-50"
                        style={{
                          background: `radial-gradient(circle, ${exp.color}, transparent)`,
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Empty Space for Grid Balance */}
                  <div className={`hidden md:block ${isEven ? "md:pl-12" : "md:pr-12 md:direction-ltr"}`} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {[
            { icon: Code2, value: "100+", label: "Projects" },
            { icon: Users, value: "50+", label: "Clients" },
            { icon: Award, value: "9+", label: "Years" },
            { icon: Target, value: "98%", label: "Success" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 text-center hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                </div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-1 md:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}