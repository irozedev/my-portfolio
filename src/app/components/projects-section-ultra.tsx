import { motion, useMotionValue, useTransform } from "motion/react";
import { ExternalLink, Github, Sparkles, ArrowUpRight, Star, Code2, Layers, Zap, Hand } from "lucide-react";
import { useState, useRef, MouseEvent } from "react";
import { useLanguage } from "../contexts/language-context";
import { FeatherSlider } from "./feather-slider";
import { ProjectDetailModal } from "./project-detail-modal";

const projects = [
  {
    id: 1,
    title: "AI SaaS Platform",
    category: "Full-Stack",
    description: "Next-generation AI-powered business automation platform with real-time analytics",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=75",
    tech: ["React", "Node.js", "OpenAI", "PostgreSQL"],
    gradient: "from-cyan-500 to-blue-600",
    size: "large",
    stats: { users: "10K+", growth: "+250%", rating: "4.9" },
    links: { live: "#", github: "#" }
  },
  {
    id: 2,
    title: "E-Commerce Pro",
    category: "Frontend",
    description: "Modern e-commerce platform with seamless checkout experience",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&q=75",
    tech: ["Next.js", "Stripe", "Tailwind"],
    gradient: "from-purple-500 to-pink-600",
    size: "medium",
    stats: { conversion: "+45%", revenue: "€500K" },
    links: { live: "#", github: "#" }
  },
  {
    id: 3,
    title: "DeFi Dashboard",
    category: "Web3",
    description: "Real-time cryptocurrency portfolio tracker with advanced analytics",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=75",
    tech: ["Web3.js", "Ethers", "React"],
    gradient: "from-amber-500 to-orange-600",
    size: "medium",
    stats: { transactions: "1M+", volume: "$50M" },
    links: { live: "#", github: "#" }
  },
  {
    id: 4,
    title: "Social Analytics",
    category: "Data Viz",
    description: "Powerful social media analytics dashboard with ML insights",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=75",
    tech: ["D3.js", "Python", "React"],
    gradient: "from-green-500 to-emerald-600",
    size: "small",
    stats: { accuracy: "98%" },
    links: { live: "#" }
  },
  {
    id: 5,
    title: "Healthcare Portal",
    category: "Enterprise",
    description: "HIPAA-compliant patient management system",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=75",
    tech: ["Angular", "AWS", "PostgreSQL"],
    gradient: "from-blue-500 to-indigo-600",
    size: "small",
    stats: { patients: "50K+" },
    links: { live: "#" }
  }
];

function ProjectCard({ project, index, onClick }: { project: typeof projects[0]; index: number; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleProjectClick = () => {
    // Navigate to project detail page
    window.location.href = `/project/${project.id}`;
  };

  const sizeClasses = {
    large: "md:col-span-2 md:row-span-2",
    medium: "md:col-span-1 md:row-span-1",
    small: "md:col-span-1 md:row-span-1"
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-3xl ${sizeClasses[project.size]} cursor-pointer`}
      onClick={onClick}
    >
      {/* Animated Glow on Hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={isHovered ? {
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 217, 255, 0.15), transparent 40%)`
        } : {}}
        transition={{ duration: 0.3 }}
      />

      {/* Card Content */}
      <div className="relative h-full min-h-[300px] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] backdrop-blur-xl border border-[var(--border-color)] rounded-3xl overflow-hidden group-hover:border-[var(--accent-primary)]/50 transition-all duration-500">
        
        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none">
          {!imageLoaded && (
            <div className="w-full h-full bg-[var(--bg-secondary)] shimmer" />
          )}
          <motion.img
            src={project.image}
            alt={project.title}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
              filter: isHovered ? "brightness(0.4)" : "brightness(0.6)"
            }}
            transition={{ duration: 0.6 }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-60 mix-blend-multiply`} />
        </div>

        {/* Holographic Overlay */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1), transparent 50%)`
          }}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6 md:p-8 z-10">
          
          {/* 🔥 TAP INDICATOR - ALWAYS VISIBLE */}
          <motion.div
            className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2.5 bg-[#00d9ff] text-black rounded-full shadow-[0_0_40px_rgba(0,217,255,0.8)] font-bold text-xs md:text-sm"
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 30px rgba(0,217,255,0.8)",
                "0 0 50px rgba(0,217,255,1)",
                "0 0 30px rgba(0,217,255,0.8)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Hand className="w-4 h-4 md:w-5 md:h-5" />
            <span>TAP</span>
            <motion.div
              className="w-2 h-2 bg-black rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          
          {/* Top Section */}
          <div className="space-y-3">
            {/* Category Badge */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
            >
              <Layers className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">{project.category}</span>
            </motion.div>

            {/* Stats (for large cards) */}
            {project.size === "large" && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-wrap gap-4"
              >
                {Object.entries(project.stats).map(([key, value], i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg">
                    <Sparkles className="w-3 h-3 text-[var(--accent-primary)]" />
                    <span className="text-xs text-white font-medium">{value}</span>
                    <span className="text-xs text-white/60">{key}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="space-y-4">
            {/* Tech Stack */}
            <motion.div
              animate={{
                y: isHovered ? 0 : 20,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white"
                >
                  {tech}
                </span>
              ))}
            </motion.div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {project.title}
              </h3>
              <motion.p
                animate={{
                  opacity: isHovered ? 1 : 0.8,
                  y: isHovered ? 0 : 10
                }}
                className="text-white/80 text-sm md:text-base line-clamp-2"
              >
                {project.description}
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              animate={{
                y: isHovered ? 0 : 30,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex gap-3"
            >
              {project.links.live && (
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-medium hover:shadow-xl transition-shadow"
                >
                  <span>View Live</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              )}
              {project.links.github && (
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Corner Accents */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
        />
      </div>
    </motion.div>
  );
}

export function ProjectsSectionUltra() {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <section id="projects-section" className="relative py-12 md:py-16 px-4 bg-[var(--bg-primary)] overflow-hidden" style={{ position: 'relative' }}>
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-[var(--accent-primary)]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 -left-40 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 18,
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
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-gradient-to-r from-[var(--accent-primary)]/10 to-purple-500/10 backdrop-blur-sm border border-[var(--accent-primary)]/20 rounded-full"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Star className="w-5 h-5 text-[var(--accent-primary)]" />
            <span className="text-sm font-medium text-[var(--accent-primary)]">SELECTED WORKS</span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-white via-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </motion.h2>
          
          <motion.p
            className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Transforming ideas into powerful digital experiences with cutting-edge tech
          </motion.p>
        </motion.div>

        {/* Projects Slider */}
        <FeatherSlider
          slidesPerView={{ mobile: 1, tablet: 1, desktop: 2 }}
          spacing={24}
          autoplay={false}
          showNavigation={true}
          showPagination={true}
        >
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </FeatherSlider>

        {/* View More CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-[var(--accent-primary)]/50 transition-all"
          >
            <Code2 className="w-5 h-5" />
            <span>View All Projects</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={{
            ...selectedProject,
            subtitle: selectedProject.category,
            fullDescription: `${selectedProject.description}\n\nThis project showcases cutting-edge technologies and modern development practices. Built with performance and scalability in mind, it demonstrates expertise in ${selectedProject.tech.join(', ')}.`,
            features: [
              "Modern & responsive design",
              "High performance optimization",
              "Scalable architecture",
              "Clean & maintainable code"
            ],
            timeline: "4-8 weeks",
            team: "Solo project",
            liveUrl: selectedProject.links.live,
            githubUrl: selectedProject.links.github,
            metrics: Object.entries(selectedProject.stats).map(([label, value]) => ({
              icon: Sparkles,
              label,
              value: String(value)
            }))
          }}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}