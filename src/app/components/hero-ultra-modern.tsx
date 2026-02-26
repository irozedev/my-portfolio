import { motion, useMotionValue, useTransform, useScroll, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Code, Zap, Play, Github, Linkedin, Mail, Briefcase, Star, GitFork, ExternalLink, Terminal, ChevronDown, Flame, Award, CheckCircle2, Users, TrendingUp, MessageCircle } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useAvailability } from "../contexts/availability-context";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { BookCallModal } from "./book-call-fixed";
import { AvailabilityScheduleModal } from "./availability-schedule-modal";
import { getFormattedStats } from "../../utils/stats-calculator";
import { StatsAirport } from "./stats-airport";

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

interface HeroUltraModernProps {
  onViewWork: () => void;
}

const socialLinks = [
  { icon: Github, href: "https://github.com/irozedev", label: "GitHub", color: "#00d9ff" },
  { icon: Linkedin, href: "https://linkedin.com/in/rozestepan", label: "LinkedIn", color: "#0077b5" },
  { icon: Briefcase, href: "https://www.upwork.com/freelancers/rozestepan", label: "Upwork", color: "#6fda44" },
  { icon: Mail, href: "mailto:hello@roze.live", label: "Email", color: "#00d9ff" },
];

const techStack = [
  { name: "React", color: "#61dafb", icon: "⚛️" },
  { name: "TypeScript", color: "#3178c6", icon: "📘" },
  { name: "Node.js", color: "#68a063", icon: "🟢" },
  { name: "Next.js", color: "#000000", icon: "▲" },
  { name: "Python", color: "#3572A5", icon: "🐍" },
  { name: "PostgreSQL", color: "#336791", icon: "🐘" },
  { name: "Docker", color: "#2496ED", icon: "🐳" },
  { name: "AWS", color: "#FF9900", icon: "☁️" },
  { name: "GraphQL", color: "#E10098", icon: "◆" },
  { name: "Tailwind", color: "#06B6D4", icon: "🎨" },
];

const codingLines = [
  "const magic = await createAwesome();",
  "function buildDreams() { return reality; }",
  "const success = problems.map(solve);",
  "while(coding) { coffee.drink(); }",
  "export const quality = 'guaranteed';",
];

const dynamicStats = getFormattedStats();

// Fallback GitHub repos data
const fallbackRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "roze-portfolio",
    description: "Modern portfolio with React, TypeScript, and Tailwind CSS. Features dark mode, animations, and responsive design.",
    html_url: "https://github.com/irozedev/roze-portfolio",
    homepage: "https://roze.live",
    stargazers_count: 12,
    forks_count: 3,
    language: "TypeScript",
    topics: ["react", "typescript", "tailwind"]
  },
  {
    id: 2,
    name: "ai-chatbot-pro",
    description: "Advanced AI chatbot with multi-language support and context awareness. Built with Node.js and OpenAI API.",
    html_url: "https://github.com/irozedev/ai-chatbot-pro",
    homepage: null,
    stargazers_count: 24,
    forks_count: 7,
    language: "JavaScript",
    topics: ["ai", "chatbot", "nodejs"]
  },
  {
    id: 3,
    name: "e-commerce-platform",
    description: "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
    html_url: "https://github.com/irozedev/e-commerce-platform",
    homepage: null,
    stargazers_count: 18,
    forks_count: 5,
    language: "TypeScript",
    topics: ["ecommerce", "react", "nodejs"]
  },
  {
    id: 4,
    name: "task-automation-suite",
    description: "Python automation tools for web scraping, data processing, and workflow optimization.",
    html_url: "https://github.com/irozedev/task-automation-suite",
    homepage: null,
    stargazers_count: 31,
    forks_count: 9,
    language: "Python",
    topics: ["automation", "python", "scraping"]
  },
  {
    id: 5,
    name: "api-gateway-microservices",
    description: "Scalable microservices architecture with Docker, Kubernetes, and API gateway pattern.",
    html_url: "https://github.com/irozedev/api-gateway-microservices",
    homepage: null,
    stargazers_count: 15,
    forks_count: 4,
    language: "Go",
    topics: ["microservices", "docker", "kubernetes"]
  },
  {
    id: 6,
    name: "data-visualization-dashboard",
    description: "Interactive dashboard for data visualization using React, D3.js, and real-time WebSocket updates.",
    html_url: "https://github.com/irozedev/data-visualization-dashboard",
    homepage: "https://viz.roze.live",
    stargazers_count: 27,
    forks_count: 8,
    language: "JavaScript",
    topics: ["visualization", "d3js", "react"]
  }
];

export function HeroUltraModern({ onViewWork }: HeroUltraModernProps) {
  const { t, language } = useLanguage();
  const { isAvailable, statusText, statusEmoji } = useAvailability();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isAvailabilityScheduleOpen, setIsAvailabilityScheduleOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  // Floating particles state
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number; icon: string }>>([]);

  useEffect(() => {
    // Generate floating tech particles
    const techIcons = ['⚛️', '📘', '🟢', '▲', '🐍', '🐘', '🐳', '☁️', '◆', '🎨', '⚡', '🔥', '💎', '✨', '🚀', '💻', '🎯', '⭐'];
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 15,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      icon: techIcons[Math.floor(Math.random() * techIcons.length)]
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX - innerWidth / 2);
      mouseY.set(clientY - innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Typing animation
  const [typedText, setTypedText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentLine = codingLines[currentLineIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < currentLine.length) {
          setTypedText(currentLine.slice(0, typedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(typedText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentLineIndex((prev) => (prev + 1) % codingLines.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentLineIndex]);

  // Counter animation
  const [countersStarted, setCountersStarted] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    years: 0,
    projects: 0,
    clients: 0,
    success: 0,
  });

  useEffect(() => {
    if (!countersStarted) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      years: parseInt(dynamicStats.yearsExperience),
      projects: parseInt(dynamicStats.projectsCompleted),
      clients: parseInt(dynamicStats.happyClients),
      success: parseFloat(dynamicStats.successRate),
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        years: Math.floor(targets.years * progress),
        projects: Math.floor(targets.projects * progress),
        clients: Math.floor(targets.clients * progress),
        success: parseFloat((targets.success * progress).toFixed(1)),
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          years: targets.years,
          projects: targets.projects,
          clients: targets.clients,
          success: targets.success,
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [countersStarted]);

  // GitHub Repos
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [currentRepoIndex, setCurrentRepoIndex] = useState(0);
  const [reposLoading, setReposLoading] = useState(true);

  useEffect(() => {
    fetchGitHubRepos();
  }, []);

  const fetchGitHubRepos = async () => {
    try {
      const response = await fetch('https://api.github.com/users/irozedev/repos?sort=updated&per_page=12', {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const filteredRepos = data
        .filter((repo: GitHubRepo) => !repo.fork)
        .sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);
      
      if (filteredRepos.length > 0) {
        setRepos(filteredRepos);
      } else {
        // Use fallback data if no repos found
        setRepos(fallbackRepos);
      }
      setReposLoading(false);
    } catch (error) {
      console.warn('Using fallback GitHub repos data:', error);
      // Use fallback static data when API fails
      setRepos(fallbackRepos);
      setReposLoading(false);
    }
  };

  useEffect(() => {
    if (repos.length > 0) {
      const interval = setInterval(() => {
        setCurrentRepoIndex((prev) => (prev + 1) % repos.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [repos.length]);

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

  // Current time
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const belgiumTime = currentTime.toLocaleTimeString('en-BE', { 
    timeZone: 'Europe/Brussels',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <motion.section
        id="hero"
        className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 pt-36 md:pt-40 lg:pt-44 pb-20"
        style={{ y, opacity }}
      >
        {/* Animated Mesh Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Tech Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute text-2xl opacity-20 blur-[0.5px]"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                fontSize: `${particle.size}px`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                rotate: [0, 360],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {particle.icon}
            </motion.div>
          ))}

          {/* Animated Grid */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(to right, #00d9ff0a 1px, transparent 1px), linear-gradient(to bottom, #00d9ff0a 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              rotateX,
              rotateY,
            }}
          />
          
          {/* Multiple Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 -left-40 w-[800px] h-[800px] bg-[#00d9ff]/10 rounded-full blur-[120px]"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 -right-40 w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[120px]"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -80, 0],
              y: [0, -60, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[100px]"
            animate={{
              scale: [1, 1.4, 1],
              x: [-50, 50, -50],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Main Content - BENTO GRID LAYOUT */}
        <div className="container mx-auto max-w-7xl relative z-10">
          
          {/* Top Row - Main Info */}
          <div className="grid lg:grid-cols-12 gap-4 mb-4">
            
            {/* Large Card - Hero Info (Left) */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 relative group"
            >
              <div className="relative h-full bg-[var(--bg-secondary)]/40 backdrop-blur-2xl border border-[var(--border-color)] rounded-3xl p-8 md:p-10 hover:border-[var(--accent-primary)]/50 transition-all duration-500">
                
                {/* Gradient Overlay */}
                <motion.div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, #00d9ff 0%, #9333ea 35%, #ec4899 70%, #00d9ff 100%)",
                    backgroundSize: "400% 400%"
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Additional glow effect */}
                <motion.div
                  className="absolute inset-0 opacity-10 blur-3xl pointer-events-none"
                  animate={{
                    background: [
                      'radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.6) 0%, transparent 50%)',
                      'radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.6) 0%, transparent 50%)',
                      'radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.6) 0%, transparent 50%)',
                      'radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.6) 0%, transparent 50%)',
                    ]
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />

                <div className="relative z-10 space-y-6">
                  {/* Greeting with Status */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <motion.p
                      className="text-lg md:text-xl text-[var(--text-secondary)] font-medium flex items-center gap-2"
                    >
                      <motion.span
                        animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                        className="text-2xl"
                      >
                        👋
                      </motion.span>
                      {t("hero.greeting")}
                    </motion.p>

                    {/* Live Status Badge - CLICKABLE */}
                    <motion.button
                      onClick={() => setIsAvailabilityScheduleOpen(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm text-sm font-bold cursor-pointer transition-all ${
                        isAvailable 
                          ? 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30' 
                          : 'bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30'
                      }`}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-400' : 'bg-orange-400'}`}
                      />
                      {statusEmoji} {statusText}
                    </motion.button>
                  </div>

                  {/* Name - EPIC - ONE LINE */}
                  <div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight mb-3">
                      <motion.span 
                        className="bg-gradient-to-r from-[#00d9ff] via-cyan-400 to-[#00d9ff] bg-clip-text text-transparent"
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
                        Stepan{" "}
                      </motion.span>
                      <motion.span 
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
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
                    </h1>

                    {/* Role */}
                    <div className="flex items-center gap-3 text-xl md:text-2xl font-bold text-[var(--text-primary)]">
                      <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                        <Code className="w-6 h-6 md:w-7 md:h-7 text-[#00d9ff]" />
                      </motion.div>
                      <span>{t("hero.role")}</span>
                      <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        <Zap className="w-6 h-6 md:w-7 md:h-7 text-purple-500" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                    {t("hero.description")}
                  </p>

                  {/* CTA Buttons - Magnetic Effect */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={onViewWork}
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-bold px-8 py-6 text-base md:text-lg rounded-2xl shadow-[0_0_40px_rgba(0,217,255,0.3)] hover:shadow-[0_0_60px_rgba(0,217,255,0.5)] transition-all duration-300 group"
                      >
                        <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        {t("hero.viewWork")}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        id="book-call-button"
                        onClick={() => setIsBookCallOpen(true)}
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto border-2 border-[#00d9ff] bg-transparent hover:bg-[#00d9ff] text-[#00d9ff] hover:text-black font-mono font-bold px-8 py-6 text-base md:text-lg rounded-2xl transition-all duration-300 group backdrop-blur-sm shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:shadow-[0_0_40px_rgba(0,217,255,0.6)]"
                      >
                        <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
                        {t("hero.getInTouch")}
                      </Button>
                    </motion.div>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <motion.a
                          key={social.label}
                          href={social.href}
                          target={social.href.startsWith("http") ? "_blank" : undefined}
                          rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="p-3 bg-[var(--bg-secondary)]/60 backdrop-blur-sm border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[#00d9ff] hover:border-[#00d9ff]/50 transition-all duration-300"
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
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Split into 2 cards */}
            <div className="lg:col-span-5 grid grid-rows-2 gap-4">
              
              {/* Live Coding Terminal - TOP */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative group h-full"
              >
                <div className="h-full bg-[var(--bg-secondary)]/40 backdrop-blur-2xl border border-[var(--border-color)] rounded-3xl p-5 md:p-6 overflow-hidden hover:border-[var(--accent-primary)]/50 transition-all duration-500 flex flex-col">
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-5 h-5 text-[var(--accent-primary)]" />
                    <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      {language === 'uk' ? 'Живий Код' : 
                       language === 'nl' ? 'Live Code' : 
                       language === 'ar' ? 'كود مباشر' :
                       language === 'es' ? 'Código en Vivo' :
                       'Live Coding'}
                    </span>
                  </div>

                  <div className="bg-[var(--bg-primary)]/60 backdrop-blur-sm border border-[var(--border-color)] rounded-xl p-4 font-mono text-xs md:text-sm flex-1 flex flex-col justify-between">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-purple-500 select-none" dir="ltr">{'>'}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[var(--text-primary)]" dir="ltr">{typedText}</span>
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="inline-block w-2 h-4 bg-[var(--accent-primary)] ml-1"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    
                    {/* Output lines */}
                    <div className="space-y-1 text-[10px] md:text-xs text-green-400 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)]" dir="ltr">✓</span>
                        <span dir="ltr">Build successful</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)]" dir="ltr">✓</span>
                        <span dir="ltr">Tests passing: 127/127</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)]" dir="ltr">⚡</span>
                        <span dir="ltr">Performance: 98/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>{language === 'uk' ? 'Активний' : language === 'nl' ? 'Actief' : language === 'ar' ? 'نشط' : language === 'es' ? 'Activo' : 'Active'}</span>
                      </div>
                      <span className="text-[var(--text-secondary)]">•</span>
                      <span dir="ltr">{belgiumTime}</span>
                    </div>
                    <div className="text-[var(--accent-primary)] font-bold" dir="ltr">
                      roze.live
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* GitHub Featured Project - BOTTOM */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="relative group"
              >
                <div className="h-full bg-[var(--bg-secondary)]/40 backdrop-blur-2xl border-2 border-[var(--accent-primary)]/30 rounded-3xl p-6 overflow-hidden hover:border-[var(--accent-primary)]/60 transition-all duration-500">
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Github className="w-5 h-5 text-[var(--accent-primary)]" />
                      <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                        {language === 'uk' ? 'Топ Проект' : 
                         language === 'nl' ? 'Top Project' : 
                         language === 'ar' ? 'أفضل مشروع' :
                         language === 'es' ? 'Proyecto Principal' :
                         'Featured Repo'}
                      </span>
                    </div>
                    
                    {/* Pagination Dots */}
                    {repos.length > 0 && (
                      <div className="flex gap-1">
                        {repos.map((_, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setCurrentRepoIndex(index)}
                            className={`transition-all rounded-full ${
                              index === currentRepoIndex
                                ? 'w-4 h-1.5 bg-[var(--accent-primary)]'
                                : 'w-1.5 h-1.5 bg-[var(--text-secondary)]/30'
                            }`}
                            whileHover={{ scale: 1.2 }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {!reposLoading && currentRepo && (
                      <motion.div
                        key={currentRepo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <h3 className="text-base md:text-lg font-black text-[var(--text-primary)] mb-2 line-clamp-1">
                          {currentRepo.name}
                        </h3>
                        
                        <p className="text-xs md:text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                          {currentRepo.description || 'No description'}
                        </p>
                        
                        <div className="flex items-center gap-2 md:gap-3 mb-3 text-xs md:text-sm flex-wrap">
                          {currentRepo.language && (
                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
                                style={{ backgroundColor: getLanguageColor(currentRepo.language) }}
                              />
                              <span className="text-[var(--text-secondary)]">{currentRepo.language}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                            <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-500" />
                            <span className="font-bold">{currentRepo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                            <GitFork className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-500" />
                            <span className="font-bold">{currentRepo.forks_count}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <motion.a
                            href={currentRepo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-[var(--accent-primary)] text-black font-bold rounded-xl text-xs md:text-sm"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Github className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            Code
                          </motion.a>
                          {currentRepo.homepage && (
                            <motion.a
                              href={currentRepo.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold rounded-xl text-xs md:text-sm"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              Demo
                            </motion.a>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {reposLoading && (
                      <div className="flex items-center justify-center h-32">
                        <motion.div
                          className="w-8 h-8 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Airport-Style Stats - Flip Cards */}
          <StatsAirport />

          {/* Scroll Indicator - CENTERED */}
          <div className="w-full flex justify-center">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="mt-8 md:mt-12 cursor-pointer"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <ChevronDown className="w-6 h-6" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  {t("hero.scrollDown") || "Explore More"}
                </span>
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Modals */}
      <BookCallModal isOpen={isBookCallOpen} onClose={() => setIsBookCallOpen(false)} />
      <AvailabilityScheduleModal isOpen={isAvailabilityScheduleOpen} onClose={() => setIsAvailabilityScheduleOpen(false)} />
    </>
  );
}