import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Code, Zap, Play, Github, Linkedin, Mail, Briefcase, Star, GitFork, ExternalLink, Award, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useAvailability } from "../contexts/availability-context";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import { BookCallModal } from "./book-call-fixed";
import { AvailabilityModal } from "./availability-modal";
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

interface HeroEpicProps {
  onViewWork: () => void;
}

const socialLinks = [
  { icon: Github, href: "https://github.com/irozedev", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/rozestepan", label: "LinkedIn" },
  { icon: Briefcase, href: "https://www.upwork.com/freelancers/rozestepan", label: "Upwork" },
  { icon: Mail, href: "mailto:rozedev095@gmail.com", label: "Email" },
];

// Get dynamic stats
const dynamicStats = getFormattedStats();

const stats = [
  { icon: Award, value: dynamicStats.yearsExperience, label: "Years Experience", labelKey: "yearsExperience" },
  { icon: CheckCircle2, value: dynamicStats.projectsCompleted, label: "Projects Completed", labelKey: "projectsCompleted" },
  { icon: Users, value: dynamicStats.happyClients, label: "Happy Clients", labelKey: "happyClients" },
  { icon: TrendingUp, value: dynamicStats.successRate, label: "Success Rate", labelKey: "successRate" },
];

export function HeroEpic({ onViewWork }: HeroEpicProps) {
  const { t, language } = useLanguage();
  const { isAvailable, statusText, statusEmoji } = useAvailability();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // GitHub repos state
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentRepoIndex, setCurrentRepoIndex] = useState(0);
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
      // Auto-rotate every 4 seconds
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
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

  const currentRepo = repos[currentRepoIndex];

  return (
    <>
      <motion.section
        id="home"
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-24 pb-12 px-4 sm:px-6"
        style={{ y }}
      >
        {/* Epic Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated Grid */}
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#00d9ff0a_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              maskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, #000 70%, transparent 110%)"
            }}
          />
          
          {/* Gradient Orbs with Enhanced Animation */}
          <motion.div
            className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#00d9ff]/20 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.4, 1.2, 1],
              opacity: [0.3, 0.6, 0.4, 0.3],
              x: [0, 100, 50, 0],
              y: [0, 50, -30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]"
            animate={{
              scale: [1.2, 1, 1.5, 1.2],
              opacity: [0.4, 0.6, 0.3, 0.4],
              x: [0, -100, -50, 0],
              y: [0, -50, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] bg-pink-500/15 rounded-full blur-[100px]"
            animate={{
              scale: [1, 1.3, 1.1, 1],
              opacity: [0.2, 0.5, 0.3, 0.2],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="container mx-auto max-w-7xl relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN - Hero Content */}
            <motion.div
              className="space-y-6 lg:space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Availability Badge */}
              <motion.button
                onClick={() => setIsAvailabilityModalOpen(true)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center gap-3 px-5 py-3 ${
                  isAvailable 
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 hover:from-green-500/30 hover:to-emerald-500/30' 
                    : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/50 hover:from-orange-500/30 hover:to-red-500/30'
                } border-2 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg group`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <motion.div 
                    className={`w-3 h-3 ${isAvailable ? 'bg-green-500' : 'bg-orange-500'} rounded-full`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className={`absolute inset-0 ${isAvailable ? 'bg-green-500' : 'bg-orange-500'} rounded-full`}
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <span className="text-base font-bold text-[var(--text-primary)]">
                  {statusEmoji} {statusText}
                </span>
              </motion.button>

              {/* Title */}
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl text-[var(--text-secondary)] font-semibold mb-4"
                >
                  {t("hero.greeting")}
                </motion.p>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6"
                >
                  <motion.span 
                    className="inline-block bg-gradient-to-r from-[#00d9ff] via-[#00b8ff] to-purple-500 bg-clip-text text-transparent"
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
                    Stepan
                  </motion.span>
                  <br />
                  <motion.span 
                    className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-[#00d9ff] bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.5
                    }}
                    style={{
                      backgroundSize: '200% 200%'
                    }}
                  >
                    Roze
                  </motion.span>
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Code className="w-8 h-8 text-[#00d9ff]" />
                  </motion.div>
                  <span>{t("hero.role")}</span>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-8 h-8 text-purple-500" />
                  </motion.div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-xl"
                >
                  {t("hero.description")}
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  onClick={onViewWork}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-bold px-8 py-6 text-lg rounded-2xl shadow-[0_0_40px_rgba(0,217,255,0.4)] hover:shadow-[0_0_60px_rgba(0,217,255,0.6)] transition-all duration-300 group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t("hero.viewWork") || "View My Work"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  onClick={() => setIsBookCallOpen(true)}
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-[#00d9ff]/50 hover:border-[#00d9ff] text-[var(--text-primary)] hover:bg-[#00d9ff]/10 font-bold px-8 py-6 text-lg rounded-2xl transition-all duration-300 group backdrop-blur-sm"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  {t("hero.getInTouch") || "Book a Call"}
                </Button>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4"
              >
                <span className="text-sm text-[var(--text-muted)] font-medium">{t("hero.followMe")}</span>
                <div className="flex gap-3">
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
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT COLUMN - Stats + GitHub Project Showcase */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="relative bg-[var(--bg-secondary)]/60 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-6 hover:border-[#00d9ff]/50 transition-all duration-300 group overflow-hidden cursor-pointer"
                    >
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <motion.div 
                            className="p-3 bg-[#00d9ff]/10 rounded-xl group-hover:bg-[#00d9ff]/20 transition-colors"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Icon className="w-5 h-5 text-[#00d9ff]" />
                          </motion.div>
                        </div>
                        <motion.div 
                          className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#00d9ff] to-cyan-400 bg-clip-text text-transparent mb-2"
                          dir="ltr"
                        >
                          {stat.value}
                        </motion.div>
                        <div className="text-sm text-[var(--text-muted)] font-medium">
                          {t(`hero.${stat.labelKey}`) || stat.label}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* GitHub Project Showcase */}
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-64 bg-[var(--bg-secondary)]/60 backdrop-blur-xl border border-[var(--border-color)] rounded-3xl"
                  >
                    <motion.div
                      className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                ) : currentRepo ? (
                  <motion.div
                    key={currentRepo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-[var(--bg-secondary)]/60 backdrop-blur-xl border-2 border-[var(--accent-primary)]/30 rounded-3xl p-6 shadow-2xl shadow-[var(--accent-primary)]/10 overflow-hidden group"
                    whileHover={{ borderColor: "rgba(0, 217, 255, 0.6)" }}
                  >
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
                      transition={{ duration: 8, repeat: Infinity }}
                    />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                              <Github className="w-6 h-6 text-[var(--accent-primary)]" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">
                              {currentRepo.name}
                            </h3>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-4">
                            {currentRepo.description || 'No description available'}
                          </p>
                        </div>
                        {currentRepo.language && (
                          <motion.div
                            className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-primary)]/50 border border-[var(--border-color)] rounded-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getLanguageColor(currentRepo.language) }}
                            />
                            <span className="text-xs font-medium text-[var(--text-secondary)]">
                              {currentRepo.language}
                            </span>
                          </motion.div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">{currentRepo.stargazers_count}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                          <GitFork className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">{currentRepo.forks_count}</span>
                        </div>
                      </div>

                      {/* Topics */}
                      {currentRepo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {currentRepo.topics.slice(0, 4).map((topic, index) => (
                            <motion.span
                              key={topic}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="px-3 py-1 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-full text-xs font-medium text-[var(--accent-primary)]"
                            >
                              #{topic}
                            </motion.span>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.a
                          href={currentRepo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-black font-bold rounded-xl transition-all"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Github className="w-4 h-4" />
                          {language === 'uk' ? 'Код' : 
                           language === 'nl' ? 'Code' : 
                           language === 'ar' ? 'كود' :
                           language === 'es' ? 'Código' :
                           'Code'}
                        </motion.a>
                        {currentRepo.homepage && (
                          <motion.a
                            href={currentRepo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] font-bold rounded-xl transition-all"
                            whileHover={{ scale: 1.05, y: -2 }}
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

                      {/* Project Indicator Dots */}
                      <div className="flex items-center justify-center gap-2 mt-6">
                        {repos.map((_, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setCurrentRepoIndex(index)}
                            className={`transition-all ${
                              index === currentRepoIndex
                                ? 'w-8 h-2 bg-[var(--accent-primary)]'
                                : 'w-2 h-2 bg-[var(--text-secondary)]/30 hover:bg-[var(--text-secondary)]/50'
                            } rounded-full`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
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
