import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Github, TrendingUp, Users, Zap, Star, Award, ArrowUpRight, Eye, Code2, Sparkles, Layers } from "lucide-react";
import { useState } from 'react';
import { useLanguage } from "../contexts/language-context";
import { ProjectDetailModal } from "./project-detail-modal";
import { ProjectReactions } from "./project-reactions";

const projects = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    subtitle: "Magento 2 Overhaul",
    description: "Enterprise platform rebuild with 40% faster load time and 25% conversion boost.",
    fullDescription: "Complete overhaul of a legacy e-commerce platform serving 50,000+ monthly users. Implemented modern performance optimization techniques, redesigned the checkout flow, and integrated real-time inventory management. The result was a 40% improvement in load times and a 25% increase in conversion rates.",
    features: [
      "Real-time inventory synchronization across 5 warehouses",
      "Progressive Web App (PWA) implementation for mobile users",
      "Advanced caching strategy reducing server load by 60%",
      "Personalized product recommendations using ML algorithms",
      "Multi-currency and multi-language support for EU markets",
    ],
    timeline: "6 months",
    team: "Team of 5",
    image: "https://images.unsplash.com/photo-1763872011479-aa293bf083a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlLWNvbW1lcmNlJTIwc2hvcHBpbmclMjBvbmxpbmV8ZW58MXx8fHwxNzY4MTM1MzkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    tech: ["Magento 2", "JavaScript", "REST API", "Redis", "Elasticsearch"],
    metrics: [
      { icon: Zap, label: "Load Time", value: "-40%" },
      { icon: TrendingUp, label: "Conversion", value: "+25%" },
      { icon: Users, label: "Users/mo", value: "50K+" },
    ],
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    bgGradient: "from-purple-500/20 via-pink-500/10 to-rose-500/20",
    size: "large",
    liveUrl: "https://example.com",
  },
  {
    id: "ms-dynamics-dashboard",
    title: "MS Dynamics 365",
    subtitle: "Custom Dashboard",
    description: "Real-time enterprise data visualization with Vue.js.",
    fullDescription: "Built a comprehensive real-time dashboard for Microsoft Dynamics 365 users, providing instant insights into sales, customer behavior, and inventory data. The dashboard processes millions of data points daily with sub-100ms response times.",
    features: [
      "Real-time data streaming from D365 APIs",
      "Customizable widgets and layouts",
      "Role-based access control",
      "Export reports to PDF/Excel",
      "Mobile-responsive design",
    ],
    timeline: "4 months",
    team: "Solo project",
    image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGRhc2hib2FyZCUyMGFuYWx5dGljc3xlbnwxfHx8fDE3NjgxOTczNDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tech: ["Vue.js", "D365", "TypeScript", "WebSocket", "Chart.js"],
    metrics: [
      { icon: Users, label: "Users", value: "50+" },
      { icon: Award, label: "Uptime", value: "99.9%" },
    ],
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    bgGradient: "from-blue-500/20 via-cyan-500/10 to-teal-500/20",
    size: "medium",
    githubUrl: "https://github.com",
  },
  {
    id: "component-library",
    title: "Component Library",
    subtitle: "Vue.js Charts",
    description: "Real-time visualization library with 60fps performance.",
    fullDescription: "Created a high-performance charting library for Vue.js applications with a focus on real-time data visualization. The library supports 15+ chart types with smooth 60fps animations and can handle datasets with millions of data points.",
    features: [
      "15+ chart types (line, bar, pie, scatter, etc.)",
      "Smooth 60fps animations",
      "Handles millions of data points",
      "Responsive and touch-friendly",
      "Extensive customization options",
    ],
    timeline: "3 months",
    team: "Solo project",
    image: "https://images.unsplash.com/photo-1677469684112-5dfb3aa4d3df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWIlMjBkZXNpZ258ZW58MXx8fHwxNzY4MTc4MDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tech: ["Vue.js", "Chart.js", "Canvas", "TypeScript", "WebGL"],
    metrics: [
      { icon: Zap, label: "Updates", value: "<100ms" },
      { icon: Star, label: "Charts", value: "15+" },
    ],
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    bgGradient: "from-green-500/20 via-emerald-500/10 to-teal-500/20",
    size: "medium",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
];

export function ProjectsSection() {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="projects" className="min-h-screen py-12 sm:py-16 md:py-20 lg:py-32 px-3 sm:px-4 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--accent-primary)]/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-gradient-to-r from-[#00d9ff]/20 to-purple-500/20 border border-[#00d9ff]/30 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-5 h-5 text-[#00d9ff]" />
              <span className="text-sm md:text-base text-[var(--text-primary)] font-semibold">Featured Work</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Projects That Matter
              </span>
            </motion.h2>

            <motion.div
              className="h-1 w-32 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent mx-auto mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            />

            <motion.p
              className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Turning ideas into reality with clean code, beautiful design, and measurable results.
            </motion.p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, index) => {
              const isLarge = project.size === "large";
              const isHovered = hoveredIndex === index;

              return (
                <motion.div
                  key={project.id}
                  className={`relative group cursor-pointer ${
                    isLarge ? "md:col-span-2 lg:col-span-2 md:row-span-2" : ""
                  }`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedProject(index)}
                >
                  {/* Glow effect - disabled on mobile for performance */}
                  <motion.div
                    className={`hidden md:block absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300 bg-gradient-to-r ${project.gradient}`}
                  />

                  {/* Main Card */}
                  <motion.div
                    className={`relative h-full min-h-[400px] ${
                      isLarge ? "md:min-h-[600px]" : "md:min-h-[400px]"
                    } rounded-3xl overflow-hidden border-2 border-white/10 hover:border-[#00d9ff]/50 transition-all duration-300 cursor-pointer`}
                  >
                    {/* Click Indicator - Simple on mobile */}
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2.5 bg-[#00d9ff] text-black rounded-full shadow-lg font-bold text-xs md:text-sm">
                      <Eye className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="hidden sm:inline">Tap to view</span>
                    </div>

                    {/* Background Image with overlay */}
                    <div className="absolute inset-0">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Gradient overlays */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${project.bgGradient}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent" />
                      <div className="absolute inset-0 bg-[var(--bg-primary)]/40 backdrop-blur-sm group-hover:backdrop-blur-none transition-all duration-500" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col p-6 md:p-8">
                      {/* Top: Tech Stack */}
                      <motion.div
                        className="flex flex-wrap gap-2 mb-auto"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {project.tech.slice(0, isLarge ? 5 : 3).map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-xs font-semibold text-white"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > (isLarge ? 5 : 3) && (
                          <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-xs font-semibold text-white">
                            +{project.tech.length - (isLarge ? 5 : 3)}
                          </span>
                        )}
                      </motion.div>

                      {/* Bottom: Info */}
                      <div className="space-y-4">
                        {/* Title & Subtitle */}
                        <div>
                          <motion.div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 mb-3 rounded-full text-xs font-bold bg-gradient-to-r ${project.gradient} text-white shadow-lg`}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Code2 className="w-3 h-3" />
                            {project.subtitle}
                          </motion.div>
                          
                          <h3 className={`${
                            isLarge ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
                          } font-bold text-white mb-2 group-hover:text-[#00d9ff] transition-colors`}>
                            {project.title}
                          </h3>
                          
                          <p className={`${
                            isLarge ? "text-base md:text-lg" : "text-sm md:text-base"
                          } text-gray-300 leading-relaxed`}>
                            {project.description}
                          </p>
                        </div>

                        {/* Metrics */}
                        <div className="flex flex-wrap gap-3">
                          {project.metrics.map((metric, i) => {
                            const Icon = metric.icon;
                            return (
                              <motion.div
                                key={i}
                                className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/15 transition-colors"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Icon className="w-4 h-4 text-[#00d9ff]" />
                                <div>
                                  <div className="text-xs text-gray-400">{metric.label}</div>
                                  <div className="text-sm font-bold text-white">{metric.value}</div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Opening project:', index);
                              setSelectedProject(index);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#00d9ff] via-cyan-400 to-[#00d9ff] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:shadow-[0_0_40px_rgba(0,217,255,0.8)] transition-all relative overflow-hidden group/btn"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                            />
                            <Eye className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">View Project</span>
                          </motion.button>

                          {/* Reactions - More Compact */}
                          <div onClick={(e) => e.stopPropagation()}>
                            <ProjectReactions projectId={project.id} compact />
                          </div>

                          {/* External Links */}
                          {(project.liveUrl || project.githubUrl) && (
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                              {project.liveUrl && (
                                <motion.a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-colors group"
                                  onClick={(e) => e.stopPropagation()}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="View Live Demo"
                                >
                                  <ExternalLink className="w-5 h-5 text-white group-hover:text-[#00d9ff] transition-colors" />
                                </motion.a>
                              )}
                              {project.githubUrl && (
                                <motion.a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-colors group"
                                  onClick={(e) => e.stopPropagation()}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="View GitHub Repo"
                                >
                                  <Github className="w-5 h-5 text-white group-hover:text-[#00d9ff] transition-colors" />
                                </motion.a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hover indicator */}
                    <motion.div
                      className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#00d9ff] to-purple-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.2, rotate: 90 }}
                    >
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            className="text-center mt-16 md:mt-20"
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
                  <Layers className="w-6 h-6 text-[var(--accent-primary)]" />
                  Interested in working together?
                </p>
                <p className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                  Let's create your next big project!
                </p>
                <motion.a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,217,255,0.5)] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start a Project
                  <ArrowUpRight className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject !== null && (
          <ProjectDetailModal
            project={projects[selectedProject]}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}