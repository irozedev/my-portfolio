import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Code, Zap, Play, Github, Linkedin, Mail, Briefcase, Star, GitFork, ExternalLink, Award, CheckCircle2, TrendingUp, Users, Rocket } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import { BookCallModal } from "./book-call-fixed";
import { getFormattedStats } from "../../utils/stats-calculator";

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

interface HeroEpicStructuredProps {
  onViewWork: () => void;
}

const socialLinks = [
  { icon: Github, href: "https://github.com/irozedev", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/rozestepan", label: "LinkedIn" },
  { icon: Briefcase, href: "https://www.upwork.com/freelancers/rozestepan", label: "Upwork" },
  { icon: Mail, href: "mailto:hello@roze.live", label: "Email" },
];

const dynamicStats = getFormattedStats();

const stats = [
  { icon: Award, value: dynamicStats.yearsExperience, label: "Years Experience", labelKey: "yearsExperience" },
  { icon: CheckCircle2, value: dynamicStats.projectsCompleted, label: "Projects Completed", labelKey: "projectsCompleted" },
  { icon: Users, value: dynamicStats.happyClients, label: "Happy Clients", labelKey: "happyClients" },
  { icon: TrendingUp, value: dynamicStats.successRate, label: "Success Rate", labelKey: "successRate" },
];

export function HeroEpicStructured({ onViewWork }: HeroEpicStructuredProps) {
  const { t, language } = useLanguage();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // GitHub Repos State
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [currentRepoIndex, setCurrentRepoIndex] = useState(0);
  const [reposLoading, setReposLoading] = useState(true);
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
        setCurrentRepoIndex((prev) => (prev + 1) % repos.length);
      }, 4000);

      return () => {
        if (autoRotateRef.current) {
          clearInterval(autoRotateRef.current);
        }
      };
    }
  }, [repos.length]);

  const fetchGitHubRepos = async () => {
    try {
      const response = await fetch('https://api.github.com/users/irozedev/repos?sort=updated&per_page=12');
      const data = await response.json();
      
      const filteredRepos = data
        .filter((repo: GitHubRepo) => !repo.fork)
        .sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);
      
      setRepos(filteredRepos);
      setReposLoading(false);
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      setReposLoading(false);
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

  const currentRepo = repos[currentRepoIndex];

  return (
    <>
      <motion.section
        id="home"
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-4 sm:px-6"
        style={{ y, opacity }}
      >
        {/* Enhanced Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(to right, #00d9ff0a 1px, transparent 1px), linear-gradient(to bottom, #00d9ff0a 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
          
          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 -left-40 w-[800px] h-[800px] bg-[#00d9ff]/10 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 80, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 -right-40 w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[120px]"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -60, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[100px]"
            animate={{
              scale: [1, 1.3, 1],
              x: [-50, 50, -50],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Main Content Container */}
        <div className="container mx-auto max-w-7xl relative z-10 pt-24 pb-12">
          
          {/* ============================================ */}
          {/* SECTION 1: INTRO & IDENTITY */}
          {/* ============================================ */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            
            {/* Left: Main Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Greeting */}
              <div className="space-y-3">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl text-[var(--text-secondary)] font-medium flex items-center gap-2"
                >
                  <motion.span
                    animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                    className="inline-block text-2xl"
                  >
                    👋
                  </motion.span>
                  {t("hero.greeting")}
                </motion.p>
                
                {/* Name */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
                  <motion.span 
                    className="block bg-gradient-to-r from-[#00d9ff] via-cyan-400 to-[#00d9ff] bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: '200% 200%'
                    }}
                  >
                    Stepan Roze
                  </motion.span>
                </h1>

                {/* Role with Icons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 text-xl md:text-2xl font-bold text-[var(--text-primary)]"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Code className="w-6 h-6 md:w-7 md:h-7 text-[#00d9ff]" />
                  </motion.div>
                  <span>{t("hero.role")}</span>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-6 h-6 md:w-7 md:h-7 text-purple-500" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl"
              >
                {t("hero.description")}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 pt-2"
              >
                <Button
                  onClick={onViewWork}
                  size="lg"
                  className="bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-bold px-8 py-6 text-base md:text-lg rounded-2xl shadow-[0_0_40px_rgba(0,217,255,0.3)] hover:shadow-[0_0_60px_rgba(0,217,255,0.5)] transition-all duration-300 group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t("hero.viewWork")}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  onClick={() => setIsBookCallOpen(true)}
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#00d9ff]/50 hover:border-[#00d9ff] text-[var(--text-primary)] hover:bg-[#00d9ff]/10 font-bold px-8 py-6 text-base md:text-lg rounded-2xl transition-all duration-300 group backdrop-blur-sm"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  {t("hero.getInTouch")}
                </Button>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-3 pt-2"
              >
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="p-3 bg-[var(--bg-secondary)]/60 backdrop-blur-sm border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[#00d9ff] hover:border-[#00d9ff]/50 hover:bg-[var(--bg-secondary)] transition-all duration-300"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Right: 3D GitHub Circular Slider */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Section Label */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/60 backdrop-blur-xl border border-[var(--border-color)] rounded-full mb-2">
                  <Github className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    {language === 'uk' ? 'GitHub Проекти' : 
                     language === 'nl' ? 'GitHub Projecten' : 
                     language === 'ar' ? 'مشاريع GitHub' :
                     language === 'es' ? 'Proyectos GitHub' :
                     'Live GitHub Projects'}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-muted)]">
                  {language === 'uk' ? 'Топ-6 репозиторіїв' : 
                   language === 'nl' ? 'Top 6 repositories' : 
                   language === 'ar' ? 'أفضل 6 مستودعات' :
                   language === 'es' ? 'Top 6 repositorios' :
                   'Top 6 repositories'}
                </p>
              </div>

              {/* 3D Circular Slider Container */}
              <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                
                {/* Central Glow */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00d9ff]/10 to-purple-500/10 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Featured Project - Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {!reposLoading && currentRepo && (
                      <motion.div
                        key={currentRepo.id}
                        initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        transition={{ duration: 0.6 }}
                        className="w-[280px] sm:w-[320px] md:w-[360px] relative group"
                      >
                        <div className="relative bg-[var(--bg-secondary)]/80 backdrop-blur-2xl border-2 border-[var(--accent-primary)]/40 rounded-3xl p-6 md:p-8 overflow-hidden hover:border-[var(--accent-primary)]/70 transition-all duration-500 shadow-[0_0_80px_rgba(0,217,255,0.15)]">
                          
                          {/* Animated Background Gradient */}
                          <motion.div
                            className="absolute inset-0 opacity-20"
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
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                              <motion.div
                                className="p-2 bg-[var(--accent-primary)]/10 rounded-lg"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                              >
                                <Rocket className="w-5 h-5 text-[var(--accent-primary)]" />
                              </motion.div>
                              
                              {currentRepo.language && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-primary)]/60 border border-[var(--border-color)] rounded-full">
                                  <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: getLanguageColor(currentRepo.language) }}
                                  />
                                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                                    {currentRepo.language}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Project Name */}
                            <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] mb-2 line-clamp-1">
                              {currentRepo.name}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2 min-h-[40px]">
                              {currentRepo.description || 'No description available'}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm font-bold">{currentRepo.stargazers_count}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                                <GitFork className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-bold">{currentRepo.forks_count}</span>
                              </div>
                            </div>

                            {/* Topics */}
                            {currentRepo.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {currentRepo.topics.slice(0, 3).map((topic) => (
                                  <span
                                    key={topic}
                                    className="px-2 py-0.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-full text-xs font-medium text-[var(--accent-primary)]"
                                  >
                                    #{topic}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                              <motion.a
                                href={currentRepo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-black font-bold rounded-xl text-sm transition-all"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Github className="w-4 h-4" />
                                Code
                              </motion.a>
                              {currentRepo.homepage && (
                                <motion.a
                                  href={currentRepo.homepage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] font-bold rounded-xl text-sm transition-all"
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Demo
                                </motion.a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {reposLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-[280px] sm:w-[320px] md:w-[360px] aspect-square flex items-center justify-center"
                      >
                        <motion.div
                          className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Orbit Indicators - Small Project Cards */}
                {!reposLoading && repos.length > 0 && repos.map((repo, index) => {
                  const angle = (index / repos.length) * Math.PI * 2 - Math.PI / 2;
                  const radius = 220;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <motion.button
                      key={repo.id}
                      onClick={() => setCurrentRepoIndex(index)}
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                        index === currentRepoIndex ? 'z-20' : 'z-10'
                      }`}
                      style={{
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                          index === currentRepoIndex
                            ? 'bg-[var(--accent-primary)] text-black border-2 border-[var(--accent-primary)] shadow-[0_0_30px_rgba(0,217,255,0.5)]'
                            : 'bg-[var(--bg-secondary)]/60 border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/50'
                        }`}
                      >
                        {repo.language && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}

                {/* Pagination Dots */}
                {!reposLoading && repos.length > 0 && (
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {repos.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentRepoIndex(index)}
                        className="relative"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <div
                          className={`transition-all duration-300 rounded-full ${
                            index === currentRepoIndex
                              ? 'w-8 h-2 bg-[var(--accent-primary)]'
                              : 'w-2 h-2 bg-[var(--text-secondary)]/30 hover:bg-[var(--text-secondary)]/50'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ============================================ */}
          {/* SECTION 2: STATS & ACHIEVEMENTS */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-12"
          >
            {/* Section Label */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/60 backdrop-blur-xl border border-[var(--border-color)] rounded-full mb-2">
                <TrendingUp className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  {language === 'uk' ? 'Статистика' : 
                   language === 'nl' ? 'Statistieken' : 
                   language === 'ar' ? 'إحصائيات' :
                   language === 'es' ? 'Estadísticas' :
                   'Track Record'}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#00d9ff] to-purple-500 bg-clip-text text-transparent">
                {language === 'uk' ? 'Досягнення в Цифрах' : 
                 language === 'nl' ? 'Prestaties in Cijfers' : 
                 language === 'ar' ? 'الإنجازات بالأرقام' :
                 language === 'es' ? 'Logros en Números' :
                 'Achievements in Numbers'}
              </h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    className="relative group"
                  >
                    <div className="relative bg-[var(--bg-secondary)]/40 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-[var(--accent-primary)]/50 hover:shadow-[0_0_40px_rgba(0,217,255,0.1)]">
                      
                      {/* Hover Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Icon */}
                      <div className="relative z-10 mb-3">
                        <div className="inline-flex p-2.5 bg-[var(--accent-primary)]/10 rounded-xl group-hover:bg-[var(--accent-primary)]/20 transition-colors">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent-primary)]" />
                        </div>
                      </div>
                      
                      {/* Value */}
                      <div 
                        className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-[#00d9ff] to-cyan-400 bg-clip-text text-transparent mb-1"
                        dir="ltr"
                      >
                        {stat.value}
                      </div>
                      
                      {/* Label */}
                      <div className="relative z-10 text-xs md:text-sm text-[var(--text-muted)] font-medium leading-tight">
                        {t(`hero.${stat.labelKey}`) || stat.label}
                      </div>

                      {/* Corner Accent */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-[var(--text-muted)]"
            >
              <TrendingUp className="w-6 h-6 rotate-90" />
              <span className="text-xs font-medium uppercase tracking-wider">
                {t("hero.scrollDown") || "Scroll Down"}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Modals */}
      <BookCallModal isOpen={isBookCallOpen} onClose={() => setIsBookCallOpen(false)} />
    </>
  );
}
