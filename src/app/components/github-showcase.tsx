import { motion, AnimatePresence } from "motion/react";
import { Github, Star, GitFork, ExternalLink, Code2, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/language-context";
import { VIEWPORT, DURATION, EASE } from "../lib/motion";

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
}

const GITHUB_USER = "irozedev";
const CACHE_KEY = "gh_repos_v2";
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

// Repos we never want to surface (profile config, private tooling, etc.)
const EXCLUDED_NAMES = new Set<string>(["irozedev"]);
const EXCLUDED_TOPICS = new Set<string>(["github-config"]);

export function GitHubShowcase() {
  const { language } = useLanguage();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchGitHubRepos();
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (repos.length > 0) {
      autoRotateRef.current = setInterval(() => {
        setFeaturedIndex((prev) => (prev + 1) % repos.length);
      }, 5000);

      return () => {
        if (autoRotateRef.current) {
          clearInterval(autoRotateRef.current);
        }
      };
    }
  }, [repos.length]);

  const fetchGitHubRepos = async () => {
    // Serve from cache first to avoid GitHub's unauthenticated rate limit (60/h per IP)
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { ts, data } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && Array.isArray(data)) {
          setRepos(data);
          setLoading(false);
          return;
        }
      }
    } catch { /* ignore cache errors */ }

    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100&type=owner`,
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
      const raw = await res.json();

      const cleaned: GitHubRepo[] = (Array.isArray(raw) ? raw : [])
        .filter((r: any) =>
          r && !r.fork && !r.archived && !r.private &&
          !EXCLUDED_NAMES.has(r.name) &&
          !(r.topics || []).some((t: string) => EXCLUDED_TOPICS.has(t))
        )
        .sort((a: any, b: any) =>
          (b.stargazers_count - a.stargazers_count) ||
          (new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
        )
        .slice(0, 12)
        .map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          html_url: r.html_url,
          homepage: r.homepage,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          language: r.language,
          topics: r.topics || [],
        }));

      setRepos(cleaned);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: cleaned })); } catch { /* ignore */ }
    } catch (error) {
      console.error('Error loading GitHub projects:', error);
      setRepos([]);
    } finally {
      setLoading(false);
    }
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

  const getButtonText = (type: 'code' | 'demo') => {
    const texts = {
      code: { en: 'Code', nl: 'Code', ar: 'كود', es: 'Código' },
      demo: { en: 'Demo', nl: 'Demo', ar: 'تجربة', es: 'Demo' }
    };
    return texts[type][language as keyof typeof texts.code] || texts[type].en;
  };

  if (loading) {
    return (
      <section className="py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <motion.div
              className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </section>
    );
  }

  // No public repos yet (or API/rate-limit failure) — show an honest CTA instead of fake data
  if (repos.length === 0) {
    return (
      <section id="github" className="py-12 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-3xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/60 backdrop-blur-xl border border-[var(--border-color)] rounded-full mb-6">
            <Github className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-sm font-bold text-[var(--text-secondary)]">
              {
               language === 'nl' ? 'GitHub Projecten' :
               language === 'ar' ? 'مشاريع GitHub' :
               language === 'es' ? 'Proyectos GitHub' :
               'GitHub Projects'}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-[#00d9ff] to-purple-500 bg-clip-text text-transparent mb-3">
            {
             language === 'nl' ? 'Projecten binnenkort beschikbaar' :
             language === 'ar' ? 'المشاريع قادمة قريباً' :
             language === 'es' ? 'Proyectos próximamente' :
             'Projects coming soon'}
          </h2>
          <p className="text-base text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            {
             language === 'nl' ? 'Mijn repositories worden geleidelijk openbaar. Bekijk intussen mijn GitHub.' :
             language === 'ar' ? 'يتم فتح مستودعاتي تدريجياً. في هذه الأثناء، تفضل بزيارة GitHub الخاص بي.' :
             language === 'es' ? 'Mis repositorios se están abriendo poco a poco. Mientras tanto, visita mi GitHub.' :
             'My repositories are going public gradually. In the meantime, take a look at my GitHub.'}
          </p>
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-black font-bold rounded-xl transition-all"
          >
            <Github className="w-5 h-5" />
            github.com/{GITHUB_USER}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    );
  }

  const featuredRepo = repos[featuredIndex];

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00d9ff]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">{/* Changed from max-w-6xl to max-w-7xl */}
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/60 backdrop-blur-xl border border-[var(--border-color)] rounded-full mb-4">
            <Github className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-sm font-bold text-[var(--text-secondary)]">
              {
               language === 'nl' ? 'GitHub Projecten' : 
               language === 'ar' ? 'مشاريع GitHub' :
               language === 'es' ? 'Proyectos GitHub' :
               'GitHub Projects'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-[#00d9ff] to-purple-500 bg-clip-text text-transparent mb-3">
            {
             language === 'nl' ? 'Recente Ontwikkelingen' : 
             language === 'ar' ? 'أحدث الت��ورات' :
             language === 'es' ? 'Desarrollos Recientes' :
             'Latest Developments'}
          </h2>
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            {
             language === 'nl' ? 'Mijn beste open-source projecten van GitHub' : 
             language === 'ar' ? 'أفضل مشاريعي مفتوحة المصدر من GitHub' :
             language === 'es' ? 'Mis mejores proyectos de código abierto en GitHub' :
             'My best open-source projects from GitHub'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Featured Project - Large Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredRepo.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: DURATION, ease: EASE }}
              className="relative group"
            >
              <div className="relative bg-[var(--bg-secondary)]/40 backdrop-blur-xl border-2 border-[var(--accent-primary)]/30 rounded-3xl p-8 overflow-hidden hover:border-[var(--accent-primary)]/60 transition-all duration-500">
                
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: "linear-gradient(135deg, #00d9ff, #9333ea, #ec4899)",
                    backgroundSize: "200% 200%"
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />

                <div className="relative z-10">
                  {/* Badge */}
                  <div className="flex items-center gap-2 mb-6">
                    <motion.div
                      className="p-2 bg-[var(--accent-primary)]/10 rounded-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: DURATION, ease: EASE }}
                    >
                      <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                    </motion.div>
                    <span className="text-sm font-bold text-[var(--accent-primary)] uppercase tracking-wider">
                      {
                       language === 'nl' ? 'Uitgelicht Project' : 
                       language === 'ar' ? 'المشروع المميز' :
                       language === 'es' ? 'Proyecto Destacado' :
                       'Featured Project'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mb-3">
                    {featuredRepo.name}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                    {featuredRepo.description || 'No description available'}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {featuredRepo.language && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-primary)]/50 border border-[var(--border-color)] rounded-full">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getLanguageColor(featuredRepo.language) }}
                        />
                        <span className="text-sm font-medium text-[var(--text-secondary)]">
                          {featuredRepo.language}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-bold">{featuredRepo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <GitFork className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-bold">{featuredRepo.forks_count}</span>
                    </div>
                  </div>

                  {/* Topics */}
                  {featuredRepo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredRepo.topics.slice(0, 5).map((topic, index) => (
                        <motion.span
                          key={topic}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: Math.min(index, 6) * 0.05 }}
                          className="px-3 py-1 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-full text-xs font-medium text-[var(--accent-primary)]"
                        >
                          #{topic}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.a
                      href={featuredRepo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-black font-bold rounded-xl transition-all"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Code2 className="w-4 h-4" />
                      {getButtonText('code')}
                    </motion.a>
                    {featuredRepo.homepage && (
                      <motion.a
                        href={featuredRepo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] font-bold rounded-xl transition-all"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        {getButtonText('demo')}
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Project Grid - Small Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {repos.map((repo, index) => (
              <motion.button
                key={repo.id}
                onClick={() => setFeaturedIndex(index)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ delay: Math.min(index, 6) * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`relative text-left bg-[var(--bg-secondary)]/40 backdrop-blur-xl border-2 rounded-2xl p-5 transition-all duration-300 ${
                  index === featuredIndex
                    ? 'border-[var(--accent-primary)] shadow-[0_0_24px_rgba(0,217,255,0.18)]'
                    : 'border-[var(--border-color)] hover:border-[var(--accent-primary)]/50'
                }`}
              >
                {/* Active Indicator */}
                {index === featuredIndex && (
                  <motion.div
                    layoutId="activeProject"
                    className="absolute inset-0 bg-[var(--accent-primary)]/5 rounded-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <Github className="w-5 h-5 text-[var(--accent-primary)]" />
                    {repo.language && (
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                    )}
                  </div>
                  
                  <h4 className="font-bold text-[var(--text-primary)] mb-2 line-clamp-1">
                    {repo.name}
                  </h4>
                  
                  <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">
                    {repo.description || 'No description'}
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" /> {repo.forks_count}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {repos.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setFeaturedIndex(index)}
              className="relative"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div
                className={`transition-all duration-300 rounded-full ${
                  index === featuredIndex
                    ? 'w-8 h-2 bg-[var(--accent-primary)]'
                    : 'w-2 h-2 bg-[var(--text-secondary)]/30 hover:bg-[var(--text-secondary)]/50'
                }`}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}