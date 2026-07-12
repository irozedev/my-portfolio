import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Award,
  Heart,
  Code2,
  ExternalLink,
  Github,
  Calendar,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useFavorites } from "../hooks/use-favorites";
import { ProjectFullscreenView } from "./project-fullscreen-view";

// Real, curated projects. Screenshots are captured once and served as static
// assets from /public/projects (no runtime API dependency, no rate limits).
// A gradient fallback shows if an image ever fails to load.
const projects = [
  {
    id: 'marinek-store',
    title: "marinek.store",
    category: "Freelance · Landing & Payments",
    description: "Commercial Next.js 14 landing for a fitness coaching program — payments, analytics and automated access delivery.",
    fullDescription: "Designed, built and launched marinek.store end-to-end: a Next.js 14 landing site with three pricing tiers, WayForPay payment integration, GA4 analytics and automated post-payment access delivery via a Telegram bot. Payment webhooks run on Cloudflare Workers. Shipped to production in July 2026 with an AI-assisted workflow.",
    image: "/projects/marinek.webp",
    tech: ["Next.js 14", "TypeScript", "WayForPay", "Cloudflare Workers", "Telegram Bot", "GA4"],
    gradient: "from-cyan-500 to-blue-600",
    stats: {
      launched: "2026",
      stack: "Next 14",
      payments: "WayForPay",
      automation: "Telegram",
    },
    year: "2026",
    duration: "Freelance",
    team: "Solo",
    role: "Full ownership (design → launch)",
    liveUrl: "https://marinek.store",
    featured: true,
  },
  {
    id: 'roze-live',
    title: "roze.live",
    category: "Personal · Portfolio",
    description: "This portfolio — a multilingual React/TypeScript site with dark mode, view modes and live GitHub data.",
    fullDescription: "My personal portfolio built with React, TypeScript, Tailwind and Vite. Features five languages, light/dark theming, client & company view modes, motion-based animations, a contact pipeline and a live GitHub projects feed.",
    image: "/projects/roze.webp",
    tech: ["React", "TypeScript", "Tailwind", "Vite", "Motion"],
    gradient: "from-teal-500 to-cyan-600",
    stats: {
      stack: "React",
      lang: "TypeScript",
      i18n: "5 langs",
      type: "Portfolio",
    },
    year: "2026",
    duration: "Personal",
    team: "Solo",
    role: "Design & Development",
    liveUrl: "https://roze.live",
    githubUrl: "https://github.com/irozedev",
    featured: false,
  },
];

type Project = typeof projects[0];

export function PortfolioCreativeSlider() {
  const { t } = useLanguage();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const isFavorite = (projectId: string) => favorites.some((fav) => fav.projectId === projectId);

  const handleToggleFavorite = (project: Project) => {
    if (isFavorite(project.id)) {
      removeFavorite(project.id);
    } else {
      addFavorite({
        projectId: project.id,
        projectName: project.title,
        projectImage: project.image,
        type: 'project',
      });
    }
  };

  return (
    <section
      id="projects"
      className="relative py-6 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[var(--bg-primary)] overflow-hidden scroll-mt-32 md:scroll-mt-36"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-full mb-6">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Featured Work</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[var(--text-primary)] via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {t("projects.title")}
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            {t("projects.subtitle")}
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {projects.map((project, index) => {
            const isFav = isFavorite(project.id);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedProject(project)}
                className="group relative flex flex-col bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-3xl overflow-hidden hover:border-[var(--accent-primary)]/50 hover:shadow-[0_20px_60px_-15px_rgba(0,217,255,0.25)] transition-all duration-500 cursor-pointer"
              >
                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-full text-black text-xs font-bold shadow-lg">
                    FEATURED
                  </div>
                )}

                {/* Favorite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(project);
                  }}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-black/70 hover:scale-110 transition-all duration-300"
                  aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`w-5 h-5 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-white"}`} />
                </button>

                {/* Screenshot */}
                <div className={`relative h-52 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br ${project.gradient}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none`} />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 md:p-7">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="text-sm text-[var(--accent-primary)] font-medium">{project.category}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-[var(--text-secondary)] mb-5 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Facts */}
                  <div className="grid grid-cols-2 gap-3 mb-5 p-4 bg-[var(--bg-secondary)]/40 rounded-xl border border-[var(--border-color)]">
                    {Object.entries(project.stats).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-base md:text-lg font-bold text-[var(--accent-primary)] truncate">{value}</div>
                        <div className="text-[10px] md:text-xs text-[var(--text-muted)] capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tech.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] rounded-full text-xs text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="px-3 py-1 bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] rounded-full text-xs text-[var(--text-muted)]">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mb-5 text-sm text-[var(--text-muted)]">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{project.year}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{project.duration}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{project.team}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-xl text-black font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_24px_rgba(0,217,255,0.4)] transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live
                    </a>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                      className="px-4 py-3 bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 transition-all flex items-center justify-center gap-2"
                    >
                      Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-3 bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 transition-all flex items-center justify-center"
                        aria-label="View code on GitHub"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectFullscreenView
            project={{
              ...selectedProject,
              subtitle: selectedProject.category,
              timeline: `${selectedProject.year} • ${selectedProject.duration}`,
            }}
            onClose={() => setSelectedProject(null)}
            onNext={() => {
              const i = projects.findIndex((p) => p.id === selectedProject.id);
              setSelectedProject(projects[(i + 1) % projects.length]);
            }}
            onPrev={() => {
              const i = projects.findIndex((p) => p.id === selectedProject.id);
              setSelectedProject(projects[(i - 1 + projects.length) % projects.length]);
            }}
            hasNext={projects.length > 1}
            hasPrev={projects.length > 1}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
