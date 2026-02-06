import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ExternalLink, Github, Zap, TrendingUp, Users, DollarSign, Clock, Star, ArrowRight, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import { useLanguage } from "../contexts/language-context";
import { ProjectCardSkeleton } from "./skeleton-loader";

const projects = [
  {
    id: 1,
    title: "E-Commerce Empire",
    subtitle: "Magento Multi-Store Platform",
    description: "Built a scalable e-commerce ecosystem serving 50k+ monthly users with advanced analytics and AI-powered recommendations.",
    image: "https://images.unsplash.com/photo-1747224317387-ee2e7eaa865d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlY29tbWVyY2UlMjBpbnRlcmZhY2UlMjBkZXNpZ258ZW58MXx8fHwxNzY5OTA2MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Magento", "React", "Node.js", "MySQL"],
    stats: [
      { icon: Users, label: "50K+ Users", value: "50,000+", color: "text-blue-400" },
      { icon: TrendingUp, label: "Revenue Growth", value: "+180%", color: "text-green-400" },
      { icon: Zap, label: "Load Time", value: "1.2s", color: "text-yellow-400" },
    ],
    color: "from-blue-500 to-cyan-500",
    size: "large", // 2 columns
    featured: true,
    github: "https://github.com/irozedev",
    demo: "https://example.com",
  },
  {
    id: 2,
    title: "AI Analytics Dashboard",
    subtitle: "SaaS Platform",
    description: "Real-time analytics platform with AI-powered insights and predictive modeling.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWFzJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzfGVufDF8fHx8MTc2OTgyNTA3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["React", "TypeScript", "D3.js", "Python"],
    stats: [
      { icon: Sparkles, label: "AI Models", value: "12+", color: "text-purple-400" },
      { icon: Users, label: "Active Users", value: "2,500+", color: "text-blue-400" },
    ],
    color: "from-purple-500 to-pink-500",
    size: "medium",
    github: "https://github.com/irozedev",
    demo: "https://example.com",
  },
  {
    id: 3,
    title: "Neural Network Lab",
    subtitle: "AI Experimentation Platform",
    description: "Interactive platform for training and visualizing neural networks in real-time.",
    image: "https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMG5ldXJhbCUyMG5ldHdvcmslMjB2aXN1YWxpemF0aW9ufGVufDF8fHx8MTc2OTkwNjE2NXww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Python", "TensorFlow", "React", "WebGL"],
    stats: [
      { icon: Zap, label: "Processing", value: "Real-time", color: "text-yellow-400" },
    ],
    color: "from-orange-500 to-red-500",
    size: "medium",
    github: "https://github.com/irozedev",
  },
  {
    id: 4,
    title: "Crypto Trading Hub",
    subtitle: "Blockchain Platform",
    description: "Advanced trading platform with real-time market data and portfolio management.",
    image: "https://images.unsplash.com/photo-1657049671938-3e5988228df3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG9jdXJyZW5jeSUyMHRyYWRpbmclMjBwbGF0Zm9ybXxlbnwxfHx8fDE3Njk4Njc1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["React", "Web3", "Solidity", "Node.js"],
    stats: [
      { icon: DollarSign, label: "Trading Volume", value: "$2.5M+", color: "text-green-400" },
      { icon: Users, label: "Traders", value: "1,200+", color: "text-blue-400" },
    ],
    color: "from-green-500 to-emerald-500",
    size: "large",
    featured: true,
    github: "https://github.com/irozedev",
    demo: "https://example.com",
  },
  {
    id: 5,
    title: "Design System",
    subtitle: "Component Library",
    description: "Comprehensive React component library with 100+ components and dark mode support.",
    image: "https://images.unsplash.com/photo-1725413069386-3854e743aed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1aSUyMGNvbXBvbmVudHMlMjBkZXNpZ24lMjBzeXN0ZW18ZW58MXx8fHwxNzY5ODgzMDU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["React", "Storybook", "Tailwind", "TypeScript"],
    stats: [
      { icon: Star, label: "Components", value: "100+", color: "text-yellow-400" },
    ],
    color: "from-pink-500 to-rose-500",
    size: "small",
    github: "https://github.com/irozedev",
  },
  {
    id: 6,
    title: "API Gateway",
    subtitle: "Microservices Architecture",
    description: "Scalable API gateway handling 1M+ requests per day with advanced caching.",
    image: "https://images.unsplash.com/photo-1679652797942-5619ec446cfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGklMjBtaWNyb3NlcnZpY2VzJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2OTkwNjI1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Node.js", "Redis", "Docker", "MongoDB"],
    stats: [
      { icon: Zap, label: "Requests/Day", value: "1M+", color: "text-yellow-400" },
    ],
    color: "from-indigo-500 to-blue-500",
    size: "small",
    github: "https://github.com/irozedev",
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = (mouseXPos / width - 0.5) * 2;
    const yPct = (mouseYPos / height - 0.5) * 2;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const sizeClasses = {
    large: "md:col-span-2 md:row-span-2",
    medium: "md:col-span-1 md:row-span-2",
    small: "md:col-span-1 md:row-span-1",
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`group relative ${sizeClasses[project.size as keyof typeof sizeClasses]} min-h-[300px]`}
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        className="relative w-full h-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] backdrop-blur-xl rounded-3xl border border-[var(--border-color)] overflow-hidden cursor-pointer"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ 
          scale: 1.02,
          borderColor: "var(--accent-primary)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient Glow */}
        <motion.div
          className={`absolute -inset-1 bg-gradient-to-r ${project.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
          style={{ zIndex: -1 }}
        />

        {/* Featured Badge */}
        {project.featured && (
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="absolute top-4 left-4 z-20"
          >
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${project.color} text-white text-xs font-bold flex items-center gap-2 shadow-lg`}>
              <Star className="w-3 h-3 fill-current" />
              FEATURED
            </div>
          </motion.div>
        )}

        {/* Background Image */}
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent" />
        </motion.div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-2 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.1 }}
          >
            {project.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-color)] rounded-full text-xs text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-3 py-1 bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-color)] rounded-full text-xs text-[var(--text-secondary)]">
                +{project.tags.length - 3}
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {project.title}
          </motion.h3>

          <motion.p
            className={`text-sm md:text-base bg-gradient-to-r ${project.color} bg-clip-text text-transparent font-semibold mb-3`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {project.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2"
            initial={{ y: 20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            {project.description}
          </motion.p>

          {/* Stats */}
          {project.stats && project.stats.length > 0 && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={isHovered ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              {project.stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 bg-[var(--bg-primary)]/60 backdrop-blur-sm rounded-lg border border-[var(--border-color)]"
                >
                  <stat.icon className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
                  <div>
                    <div className={`text-xs font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${project.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all group/btn`}
              >
                <span className="text-sm">View Live</span>
                <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl hover:border-[var(--accent-primary)] transition-all group/btn"
              >
                <Github className="w-5 h-5 text-[var(--text-secondary)] group-hover/btn:text-[var(--accent-primary)]" />
              </a>
            )}
          </motion.div>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mouseX.get() * 50 + 50}% ${mouseY.get() * 50 + 50}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export function ProjectsSectionModern() {
  const { t } = useLanguage();

  return (
    <section id="projects" className="relative py-12 md:py-16 px-4 bg-[var(--bg-primary)] overflow-hidden" style={{ position: 'relative' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            x: [0, 80, 0],
            y: [0, -80, 0],
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
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent">
              FEATURED WORK
            </span>
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Cutting-edge projects that push the boundaries of web development
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.button
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-[0_0_40px_rgba(0,217,255,0.5)] transition-all"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-6 h-6" />
            <span>View All Projects</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}