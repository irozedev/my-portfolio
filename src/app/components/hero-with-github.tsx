import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Sparkles, Code, Zap, Play, Github, Linkedin, Mail, Briefcase, Star, GitFork, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useAvailability } from "../contexts/availability-context";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { BookCallModal } from "./book-call-fixed";
import { AvailabilityModal } from "./availability-modal";

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

interface HeroWithGitHubProps {
  onViewWork: () => void;
}

const socialLinks = [
  { icon: Github, href: "https://github.com/irozedev", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/rozestepan", label: "LinkedIn" },
  { icon: Briefcase, href: "https://www.upwork.com/freelancers/rozestepan", label: "Upwork" },
  { icon: Mail, href: "mailto:hello@roze.live", label: "Email" },
];

export function HeroWithGitHub({ onViewWork }: HeroWithGitHubProps) {
  const { t, language } = useLanguage();
  const { isAvailable, statusText, statusEmoji, nextAvailable } = useAvailability();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  // GitHub repos state
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchGitHubRepos();
  }, []);

  const fetchGitHubRepos = async () => {
    try {
      const response = await fetch('https://api.github.com/users/irozedev/repos?sort=updated&per_page=12');
      const data = await response.json();
      
      const filteredRepos = data
        .filter((repo: GitHubRepo) => !repo.fork)
        .sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);
      
      setRepos(filteredRepos);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      setLoading(false);
    }
  };

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % repos.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + repos.length) % repos.length);
  };

  const getCircularPosition = (index: number) => {
    const totalRepos = repos.length;
    const angle = ((index - activeIndex + totalRepos) % totalRepos) * (360 / totalRepos);
    const radius = 200;
    
    const x = Math.sin((angle * Math.PI) / 180) * radius;
    const z = Math.cos((angle * Math.PI) / 180) * radius - radius;
    
    const scale = Math.max(0.5, 1 - Math.abs(z) / 500);
    const opacity = Math.max(0.2, 1 - Math.abs(z) / 400);
    
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

  const activeRepo = repos[activeIndex];

  return (
    <>
      <motion.section
        id="home"
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-32 pb-20 px-4 sm:px-6"
        style={{ y }}
      >
        {/* Epic Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated Grid */}
          <div className="hidden lg:block absolute inset-0 bg-[linear-gradient(to_right,#00d9ff0a_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
          
          {/* Multiple Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#00d9ff]/20 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 -right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.3, 0.6, 0.3],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500/15 rounded-full blur-[100px]"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-7xl relative z-10 w-full">
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 items-center">
            
            {/* Left Column - Hero Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Availability Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group relative"
              >
                <button
                  onClick={() => setIsAvailabilityModalOpen(true)}
                  className={`inline-flex items-center gap-2 px-5 py-3 ${
                    isAvailable ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' : 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20'
                  } border-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg`}
                >
                  <div className="relative">
                    <div className={`w-2.5 h-2.5 ${isAvailable ? 'bg-green-500' : 'bg-orange-500'} rounded-full animate-pulse`} />
                    <div className={`absolute inset-0 w-2.5 h-2.5 ${isAvailable ? 'bg-green-500' : 'bg-orange-500'} rounded-full animate-ping`} />
                  </div>
                  <span className="text-base font-bold text-[var(--text-secondary)]">
                    {statusEmoji} {statusText}
                  </span>
                </button>
              </motion.div>

              {/* Title Section */}
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl md:text-2xl text-[var(--text-secondary)] font-medium mb-4"
                >
                  {t("hero.greeting")}
                </motion.p>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-4"
                >
                  <span className="bg-gradient-to-r from-[#00d9ff] via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                    Stepan Roze
                  </span>
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6"
                >
                  <Code className="w-8 h-8 text-[#00d9ff]" />
                  <span>{t("hero.role")}</span>
                  <Zap className="w-8 h-8 text-purple-500" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl"
                >
                  {t("hero.description")}
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  onClick={onViewWork}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-bold px-8 py-6 text-lg shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.6)] transition-all duration-300 group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t("hero.viewWork") || "View My Work"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  onClick={() => setIsBookCallOpen(true)}
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-[#00d9ff]/50 hover:border-[#00d9ff] text-[var(--text-primary)] hover:bg-[#00d9ff]/10 font-bold px-8 py-6 text-lg transition-all duration-300 group backdrop-blur-sm"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  {t("hero.getInTouch") || "Book a Call"}
                </Button>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-4 pt-4"
              >
                <span className="text-base text-[var(--text-muted)]">{t("hero.followMe")}</span>
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="p-3 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[#00d9ff] hover:border-[#00d9ff]/50 hover:scale-110 transition-all duration-300"
                      whileHover={{ y: -5 }}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Right Column - 3D GitHub Carousel */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {loading ? (
                <div className="flex items-center justify-center h-[600px]">
                  <motion.div
                    className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : repos.length > 0 ? (
                <div className="relative h-[600px]" style={{ perspective: "1400px" }}>
                  {/* Active Project Card - Top */}
                  {activeRepo && (
                    <motion.div
                      key={activeRepo.id}
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-20"
                    >
                      <div className="bg-[var(--bg-secondary)]/90 backdrop-blur-xl border-2 border-[var(--accent-primary)]/50 rounded-3xl p-6 shadow-2xl shadow-[var(--accent-primary)]/20">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-[var(--accent-primary)]/10 rounded-xl">
                            <Github className="w-6 h-6 text-[var(--accent-primary)]" />
                          </div>
                          <h3 className="text-xl font-bold text-[var(--text-primary)] truncate flex-1">
                            {activeRepo.name}
                          </h3>
                          {activeRepo.language && (
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: getLanguageColor(activeRepo.language) }}
                            />
                          )}
                        </div>

                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 line-clamp-2">
                          {activeRepo.description || 'No description available'}
                        </p>

                        <div className="flex items-center gap-4 mb-4">
                          {activeRepo.language && (
                            <div className="flex items-center gap-2">
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
                          <div className="flex flex-wrap gap-2 mb-4">
                            {activeRepo.topics.slice(0, 4).map((topic) => (
                              <span
                                key={topic}
                                className="px-2 py-1 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-full text-xs font-medium text-[var(--accent-primary)]"
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
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-black font-bold rounded-xl transition-colors text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Github className="w-4 h-4" />
                            {language === 'uk' ? 'Код' : 
                             language === 'nl' ? 'Code' : 
                             language === 'ar' ? 'كود' :
                             language === 'es' ? 'Código' :
                             'Code'}
                          </motion.a>
                          {activeRepo.homepage && (
                            <motion.a
                              href={activeRepo.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] font-bold rounded-xl transition-colors text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ExternalLink className="w-4 h-4" />
                              {language === 'uk' ? 'Демо' : 
                               language === 'nl' ? 'Demo' : 
                               language === 'ar' ? 'تجربة' :
                               language === 'es' ? 'Demo' :
                               'Demo'}
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 3D Circular Cards */}
                  <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                    {repos.map((repo, index) => {
                      const { x, z, scale, opacity, rotateY } = getCircularPosition(index);
                      const isActive = index === activeIndex;

                      return (
                        <motion.div
                          key={repo.id}
                          className={`absolute top-1/2 left-1/2 w-64 cursor-pointer ${
                            isActive ? 'pointer-events-none' : 'pointer-events-auto'
                          }`}
                          style={{ transformStyle: "preserve-3d" }}
                          initial={false}
                          animate={{
                            x: x - 128,
                            y: 50,
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
                          onClick={() => !isActive && setActiveIndex(index)}
                        >
                          <div className={`relative p-5 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                            isActive
                              ? 'bg-[var(--accent-primary)]/20 border-2 border-[var(--accent-primary)]'
                              : 'bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] hover:border-[var(--accent-primary)]/50'
                          }`}>
                            {repo.language && (
                              <div
                                className="absolute top-3 right-3 w-3 h-3 rounded-full"
                                style={{ backgroundColor: getLanguageColor(repo.language) }}
                              />
                            )}

                            <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2 truncate pr-6">
                              {repo.name}
                            </h4>
                            
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
                              {repo.description || 'No description'}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {repo.stargazers_count}
                              </div>
                              <div className="flex items-center gap-1">
                                <GitFork className="w-3 h-3" />
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
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-3 bg-[var(--bg-secondary)]/90 backdrop-blur-sm border border-[var(--border-color)] hover:border-[var(--accent-primary)] rounded-full transition-colors"
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-5 h-5 text-[var(--text-primary)]" />
                  </motion.button>

                  <motion.button
                    onClick={next}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-3 bg-[var(--bg-secondary)]/90 backdrop-blur-sm border border-[var(--border-color)] hover:border-[var(--accent-primary)] rounded-full transition-colors"
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-5 h-5 text-[var(--text-primary)]" />
                  </motion.button>

                  {/* Dots Pagination */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
                    {repos.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`transition-all ${
                          index === activeIndex
                            ? 'w-8 h-2 bg-[var(--accent-primary)]'
                            : 'w-2 h-2 bg-[var(--text-secondary)]/30 hover:bg-[var(--text-secondary)]/50'
                        } rounded-full`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Modals */}
      <BookCallModal isOpen={isBookCallOpen} onClose={() => setIsBookCallOpen(false)} />
      <AvailabilityModal isOpen={isAvailabilityModalOpen} onClose={() => setIsAvailabilityModalOpen(false)} />
    </>
  );
}
