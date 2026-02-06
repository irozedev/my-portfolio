import { motion } from "motion/react";
import { useState } from "react";
import { 
  Sparkles, 
  Heart, 
  Code2, 
  ExternalLink,
  Github,
  Calendar,
  Users,
  Zap,
  Award,
  Filter,
  Grid3x3,
  List
} from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useFavorites } from "../hooks/use-favorites";

// Portfolio Projects
const projects = [
  {
    id: 'project-1',
    title: "AI SaaS Platform",
    category: "Full-Stack Development",
    description: "Enterprise-grade AI automation platform with real-time analytics and ML integration",
    fullDescription: "Built a comprehensive AI-powered SaaS platform that helps businesses automate workflows using GPT-4 integration. Features include real-time analytics dashboard, custom AI model training, and seamless API integration.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    tech: ["React", "Node.js", "OpenAI GPT-4", "PostgreSQL", "Redis", "Docker"],
    gradient: "from-cyan-500 to-blue-600",
    stats: { 
      users: "10K+", 
      growth: "+250%", 
      rating: 4.9,
      uptime: "99.9%"
    },
    year: "2024",
    duration: "6 months",
    team: "5 developers",
    role: "Lead Full-Stack Developer",
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 'project-2',
    title: "E-Commerce Platform",
    category: "Frontend Development",
    description: "Modern e-commerce solution with seamless checkout and inventory management",
    fullDescription: "Developed a high-performance e-commerce platform with advanced features including real-time inventory tracking, AI-powered product recommendations, and optimized checkout flow that increased conversion by 45%.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
    tech: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS", "Vercel", "Prisma"],
    gradient: "from-purple-500 to-pink-600",
    stats: { 
      conversion: "+45%", 
      revenue: "€500K",
      orders: "15K+",
      rating: 4.8
    },
    year: "2024",
    duration: "4 months",
    team: "3 developers",
    role: "Frontend Lead",
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 'project-3',
    title: "Healthcare Portal",
    category: "Enterprise Solution",
    description: "HIPAA-compliant patient management system with real-time collaboration",
    fullDescription: "Created a secure healthcare management platform compliant with HIPAA regulations. Includes patient records management, appointment scheduling, telemedicine integration, and real-time notifications.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    tech: ["Angular", "AWS", "PostgreSQL", "Socket.io", "Redis", "Docker"],
    gradient: "from-teal-500 to-cyan-600",
    stats: { 
      patients: "50K+", 
      uptime: "99.9%",
      hospitals: "12",
      rating: 4.7
    },
    year: "2023",
    duration: "8 months",
    team: "8 developers",
    role: "Senior Developer",
    liveUrl: "#",
    featured: true,
  },
  {
    id: 'project-4',
    title: "DeFi Dashboard",
    category: "Web3 Development",
    description: "Real-time cryptocurrency portfolio tracker with advanced analytics",
    fullDescription: "Built a comprehensive DeFi dashboard for tracking cryptocurrency portfolios across multiple blockchains. Features real-time price updates, advanced charting, and automated trading strategies.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    tech: ["React", "Web3.js", "Ethers.js", "The Graph", "TailwindCSS"],
    gradient: "from-amber-500 to-orange-600",
    stats: { 
      transactions: "1M+", 
      volume: "$50M",
      users: "25K+",
      rating: 4.9
    },
    year: "2023",
    duration: "5 months",
    team: "4 developers",
    role: "Web3 Developer",
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    id: 'project-5',
    title: "Social Analytics Platform",
    category: "Data Visualization",
    description: "Powerful social media analytics dashboard with ML-powered insights",
    fullDescription: "Developed an advanced social media analytics platform that aggregates data from multiple platforms and provides AI-powered insights, sentiment analysis, and predictive analytics.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tech: ["React", "D3.js", "Python", "TensorFlow", "FastAPI"],
    gradient: "from-green-500 to-emerald-600",
    stats: { 
      accuracy: "98%",
      reports: "100K+",
      brands: "500+",
      rating: 4.6
    },
    year: "2023",
    duration: "6 months",
    team: "6 developers",
    role: "Frontend + Data Viz Lead",
    liveUrl: "#",
    featured: false,
  },
  {
    id: 'project-6',
    title: "Real Estate Platform",
    category: "Full-Stack Development",
    description: "Modern property listing platform with virtual tours and AI matching",
    fullDescription: "Created a comprehensive real estate platform with 3D virtual tours, AI-powered property matching, mortgage calculator, and integrated CRM for real estate agents.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    tech: ["Next.js", "Three.js", "Node.js", "MongoDB", "Stripe"],
    gradient: "from-indigo-500 to-purple-600",
    stats: { 
      listings: "10K+",
      sales: "€2M+",
      agents: "200+",
      rating: 4.8
    },
    year: "2024",
    duration: "7 months",
    team: "5 developers",
    role: "Full-Stack Lead",
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
];

const categories = ["All", "Full-Stack Development", "Frontend Development", "Enterprise Solution", "Web3 Development", "Data Visualization"];

export function PortfolioGridSection() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <>
      <section id="projects" className="relative py-16 md:py-24 px-4 bg-[var(--bg-primary)] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -right-48 w-[500px] h-[500px] bg-[#00d9ff]/5 rounded-full blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
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
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-gradient-to-r from-[var(--accent-primary)]/10 to-purple-500/10 backdrop-blur-sm border border-[var(--accent-primary)]/20 rounded-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
              <span className="text-sm font-medium text-[var(--accent-primary)]">PORTFOLIO</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>

            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
              Explore my latest work showcasing expertise in modern web technologies
            </p>

            {/* Filters & View Toggle */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
              {/* Category Filters */}
              <div className="flex flex-wrap items-center gap-2 justify-center">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-[var(--accent-primary)] text-black"
                        : "bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "grid" ? "bg-[var(--accent-primary)] text-black" : "text-[var(--text-secondary)]"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "list" ? "bg-[var(--accent-primary)] text-black" : "text-[var(--text-secondary)]"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Projects Grid/List */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative" : "space-y-4 relative"}>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard 
                  project={project} 
                  viewMode={viewMode}
                  onProjectClick={setSelectedProject}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </>
  );
}

// Project Card Component
function ProjectCard({ 
  project, 
  viewMode,
  onProjectClick
}: { 
  project: typeof projects[0]; 
  viewMode: "grid" | "list";
  onProjectClick: (project: typeof projects[0]) => void;
}) {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isProjectFavorited = isFavorite(project.id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isProjectFavorited) {
      await removeFavorite(project.id);
    } else {
      await addFavorite(project.id, project.title, project.image, 'project');
    }
  };

  if (viewMode === "list") {
    return (
      <motion.div
        className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--accent-primary)]/50 transition-all"
        whileHover={{ scale: 1.01 }}
        onClick={() => onProjectClick(project)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative md:w-1/3 h-64 md:h-auto">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-40`} />
            {project.featured && (
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                  <Award className="w-3 h-3 text-white" />
                  <span className="text-xs font-bold text-white">Featured</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-[var(--accent-primary)] font-semibold mb-2">{project.category}</p>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">{project.title}</h3>
              </div>
              <button onClick={handleToggleFavorite} className="p-2">
                <Heart className={`w-5 h-5 ${isProjectFavorited ? 'fill-red-500 text-red-500' : 'text-[var(--text-secondary)]'}`} />
              </button>
            </div>

            <p className="text-[var(--text-secondary)] mb-4">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.slice(0, 5).map((tech) => (
                <span key={tech} className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-lg text-xs text-[var(--text-secondary)]">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {Object.entries(project.stats).slice(0, 3).map(([key, value]) => (
                <div key={key}>
                  <div className="text-sm font-bold text-[var(--accent-primary)]">{value}</div>
                  <div className="text-xs text-[var(--text-secondary)] capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--accent-primary)]/50 transition-all group"
      whileHover={{ y: -8 }}
      onClick={() => onProjectClick(project)}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg">
            <Award className="w-3 h-3 text-white" />
            <span className="text-xs font-bold text-white uppercase">Featured</span>
          </div>
        </div>
      )}

      {/* Favorite Button */}
      <motion.button
        onClick={handleToggleFavorite}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:bg-black/70 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart className={`w-5 h-5 transition-all ${isProjectFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
      </motion.button>

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-40`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative p-6">
        <p className="text-sm text-[var(--accent-primary)] font-semibold mb-2">{project.category}</p>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{project.title}</h3>
        <p className="text-[var(--text-secondary)] mb-4 line-clamp-2 min-h-[48px]">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.slice(0, 3).map((tech) => (
            <span key={tech} className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-lg text-xs text-[var(--text-secondary)]">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {Object.entries(project.stats).slice(0, 2).map(([key, value]) => (
            <div key={key}>
              <div className="text-lg font-bold text-[var(--accent-primary)]">{value}</div>
              <div className="text-xs text-[var(--text-secondary)] capitalize">{key}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Project Detail Modal (same as before)
function ProjectDetailModal({ 
  project, 
  onClose 
}: { 
  project: typeof projects[0]; 
  onClose: () => void;
}) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isProjectFavorited = isFavorite(project.id);

  const handleToggleFavorite = async () => {
    if (isProjectFavorited) {
      await removeFavorite(project.id);
    } else {
      await addFavorite(project.id, project.title, project.image, 'project');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,217,255,0.3)]"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:bg-black/70 transition-all"
        >
          <span className="text-white text-2xl leading-none">&times;</span>
        </button>

        <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
          <div className="relative h-80 overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-40`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent" />
            
            <div className="absolute top-6 left-6 flex gap-3">
              {project.featured && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg">
                  <Award className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">Featured</span>
                </div>
              )}
              <div className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${project.gradient} rounded-full shadow-lg`}>
                <Code2 className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">{project.category}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">{project.title}</h2>
              
              <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>{project.year} • {project.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>{project.team}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>{project.role}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">About the Project</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">{project.fullDescription}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-3">
                {project.tech.map((tech) => (
                  <span key={tech} className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-sm text-[var(--text-primary)] font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(project.stats).map(([key, value]) => (
                  <div key={key} className="p-4 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl text-center">
                    <div className="text-2xl font-bold text-[var(--accent-primary)] mb-1">{value}</div>
                    <div className="text-xs text-[var(--text-secondary)] capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r ${project.gradient} text-white font-bold rounded-xl hover:opacity-90 transition-all`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>View Live Demo</span>
                </motion.a>
              )}
              
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-[var(--text-primary)] font-bold rounded-xl hover:border-[var(--accent-primary)] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </motion.a>
              )}

              <motion.button
                onClick={handleToggleFavorite}
                className={`flex items-center justify-center gap-2 px-6 py-4 border-2 font-bold rounded-xl transition-all ${
                  isProjectFavorited 
                    ? 'bg-red-500/10 border-red-500 text-red-500'
                    : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className={`w-5 h-5 ${isProjectFavorited ? 'fill-red-500' : ''}`} />
                <span>{isProjectFavorited ? 'Saved' : 'Save'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}