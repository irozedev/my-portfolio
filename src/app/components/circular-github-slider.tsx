import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Star, GitFork, ExternalLink, Github, ChevronLeft, ChevronRight, Code2 } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
}

export function CircularGitHubSlider() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    fetchGitHubRepos();
  }, []);

  const fetchGitHubRepos = async () => {
    try {
      const response = await fetch('https://api.github.com/users/irozedev/repos?sort=updated&per_page=12');
      const data = await response.json();
      
      // Filter out forks and sort by stars
      const filteredRepos = data
        .filter((repo: GitHubRepo) => !repo.fork)
        .sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count)
        .slice(0, 8);
      
      setRepos(filteredRepos);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      setLoading(false);
    }
  };

  const next = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % repos.length);
  };

  const prev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + repos.length) % repos.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Calculate position for circular layout
  const getCircularPosition = (index: number) => {
    const totalRepos = repos.length;
    const angle = ((index - activeIndex + totalRepos) % totalRepos) * (360 / totalRepos);
    const radius = 280;
    
    const x = Math.sin((angle * Math.PI) / 180) * radius;
    const z = Math.cos((angle * Math.PI) / 180) * radius - radius;
    
    // Calculate scale and opacity based on position
    const scale = Math.max(0.4, 1 - Math.abs(z) / 600);
    const opacity = Math.max(0.3, 1 - Math.abs(z) / 500);
    
    return { x, z, scale, opacity, rotateY: -angle / 4 };
  };

  const getLanguageColor = (lang: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      Java: "#b07219",
      Go: "#00ADD8",
      Rust: "#dea584",
      PHP: "#4F5D95",
      Ruby: "#701516",
      CSS: "#563d7c",
      HTML: "#e34c26",
      Vue: "#41b883",
      React: "#61dafb",
    };
    return colors[lang] || "#00d9ff";
  };

  if (loading) {
    return (
      <div className="relative py-20 overflow-hidden">
        <div className="flex items-center justify-center h-[600px]">
          <motion.div
            className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  if (repos.length === 0) {
    return null;
  }

  const activeRepo = repos[activeIndex];

  return (
    <section className="relative py-20 overflow-hidden" id="github-projects">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent-primary)]/5 to-transparent pointer-events-none" />
      
      <motion.div
        className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/20 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Github className="w-5 h-5 text-[var(--accent-primary)]" />
            <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              {language === 'uk' ? 'GitHub Проекти' : 
               language === 'nl' ? 'GitHub Projecten' : 
               language === 'ar' ? 'مشاريع GitHub' :
               language === 'es' ? 'Proyectos GitHub' :
               'GitHub Projects'}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
              {language === 'uk' ? 'Мої останні роботи' : 
               language === 'nl' ? 'Mijn laatste werk' : 
               language === 'ar' ? 'أحدث أعمالي' :
               language === 'es' ? 'Mi último trabajo' :
               'My Latest Work'}
            </span>
          </h2>

          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            {language === 'uk' ? 'Досліджуйте мої проекти з відкритим кодом на GitHub' : 
             language === 'nl' ? 'Verken mijn open-source projecten op GitHub' : 
             language === 'ar' ? 'استكشف مشاريعي مفتوحة المصدر على GitHub' :
             language === 'es' ? 'Explora mis proyectos de código abierto en GitHub' :
             'Explore my open-source projects on GitHub'}
          </p>
        </motion.div>

        {/* 3D Circular Carousel */}
        <div className="relative h-[600px] flex items-center justify-center perspective-[1400px]">
          {/* Active Project Info Card */}
          <motion.div
            key={activeRepo.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl z-20"
          >
            <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--border-color)] rounded-3xl p-8 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-[var(--accent-primary)]" />
                    {activeRepo.name}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {activeRepo.description || 'No description available'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {activeRepo.language && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getLanguageColor(activeRepo.language) }}
                    />
                    <span className="text-sm text-[var(--text-secondary)]">{activeRepo.language}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">{activeRepo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <GitFork className="w-4 h-4" />
                  <span className="text-sm">{activeRepo.forks_count}</span>
                </div>
              </div>

              {activeRepo.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeRepo.topics.slice(0, 5).map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-full text-xs font-medium text-[var(--accent-primary)]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <motion.a
                  href={activeRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-black font-bold rounded-xl transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-5 h-5" />
                  View Code
                </motion.a>
                {activeRepo.homepage && (
                  <motion.a
                    href={activeRepo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] font-bold rounded-xl transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-5 h-5" />
                    Live Demo
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Circular Cards Container */}
          <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
            {repos.map((repo, index) => {
              const { x, z, scale, opacity, rotateY } = getCircularPosition(index);
              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={repo.id}
                  className={`absolute top-1/2 left-1/2 w-80 cursor-pointer ${
                    isActive ? 'pointer-events-none' : 'pointer-events-auto'
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                  initial={false}
                  animate={{
                    x: x - 160,
                    y: -120,
                    z: z,
                    scale: scale,
                    opacity: opacity,
                    rotateY: rotateY,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                  }}
                  onClick={() => !isActive && goToSlide(index)}
                >
                  <div className={`relative p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-[var(--accent-primary)]/20 border-2 border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] hover:border-[var(--accent-primary)]/50'
                  }`}>
                    {/* Language Badge */}
                    {repo.language && (
                      <div
                        className="absolute top-4 right-4 w-3 h-3 rounded-full shadow-lg"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                    )}

                    <h4 className="text-xl font-bold text-[var(--text-primary)] mb-3 truncate">
                      {repo.name}
                    </h4>
                    
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                      {repo.description || 'No description'}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {repo.stargazers_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        {repo.forks_count}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <motion.button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-color)] hover:border-[var(--accent-primary)] rounded-full transition-colors"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 text-[var(--text-primary)]" />
          </motion.button>

          <motion.button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-color)] hover:border-[var(--accent-primary)] rounded-full transition-colors"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6 text-[var(--text-primary)]" />
          </motion.button>
        </div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {repos.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === activeIndex
                  ? 'w-12 h-3 bg-[var(--accent-primary)]'
                  : 'w-3 h-3 bg-[var(--text-secondary)]/30 hover:bg-[var(--text-secondary)]/50'
              } rounded-full`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="https://github.com/irozedev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 hover:from-[var(--accent-primary)]/80 hover:to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-[var(--accent-primary)]/30 transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-6 h-6" />
            {language === 'uk' ? 'Всі проекти на GitHub' : 
             language === 'nl' ? 'Alle projecten op GitHub' : 
             language === 'ar' ? 'جميع المشاريع على GitHub' :
             language === 'es' ? 'Todos los proyectos en GitHub' :
             'View All Projects on GitHub'}
            <ExternalLink className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
