import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Github, Linkedin, Mail, Download, Code, CheckCircle2, Star, Sparkles, Zap, Rocket } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { BookCallModal } from "./book-call-modal";

interface HeroSectionProps {
  onViewWork: () => void;
}

const socialLinks = [
  { icon: Github, href: "https://github.com/irozedev", label: "GitHub", color: "#333333" },
  { icon: Linkedin, href: "https://linkedin.com/in/rozestepan", label: "LinkedIn", color: "#0077b5" },
  { icon: Mail, href: "mailto:hello@roze.live", label: "Email", color: "#00d9ff" },
];

export function Hero({ onViewWork }: HeroSectionProps) {
  const { t } = useLanguage();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

  const handleOpenChat = () => {
    // Открываем глобальный чат-бот
    const event = new CustomEvent('openChatBot');
    window.dispatchEvent(event);
  };

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 px-3 sm:px-4 sm:pt-28 md:pt-24 md:pb-16"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 -left-12 sm:-left-24 md:-left-48 w-[200px] sm:w-[300px] md:w-[600px] h-[200px] sm:h-[300px] md:h-[600px] bg-[#00d9ff]/30 sm:bg-[#00d9ff]/20 md:bg-[#00d9ff]/10 rounded-full blur-[60px] sm:blur-[80px] md:blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 -right-12 sm:-right-24 md:-right-48 w-[180px] sm:w-[250px] md:w-[500px] h-[180px] sm:h-[250px] md:h-[500px] bg-purple-500/30 sm:bg-purple-500/20 md:bg-purple-500/10 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Infinite Scrolling Text - Left Side */}
          <div className="absolute left-0 top-0 bottom-0 w-32 hidden lg:flex items-center justify-center overflow-hidden">
            <div className="relative h-full flex items-center">
              <motion.div
                className="flex flex-col gap-8 text-6xl font-black tracking-tighter opacity-5"
                animate={{
                  y: [0, -2000],
                }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                }}
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-8">
                    <span className="bg-gradient-to-b from-[#00d9ff] to-purple-500 bg-clip-text text-transparent">DEVELOPER</span>
                    <span className="text-[var(--text-primary)]">•</span>
                    <span className="bg-gradient-to-b from-purple-500 to-pink-500 bg-clip-text text-transparent">INNOVATOR</span>
                    <span className="text-[var(--text-primary)]">•</span>
                    <span className="bg-gradient-to-b from-pink-500 to-[#00d9ff] bg-clip-text text-transparent">CREATOR</span>
                    <span className="text-[var(--text-primary)]">•</span>
                    <span className="bg-gradient-to-b from-[#00d9ff] to-cyan-400 bg-clip-text text-transparent">DESIGNER</span>
                    <span className="text-[var(--text-primary)]">•</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
          
          {/* Infinite Scrolling Text - Right Side */}
          <div className="absolute right-0 top-0 bottom-0 w-32 hidden lg:flex items-center justify-center overflow-hidden">
            <div className="relative h-full flex items-center">
              <motion.div
                className="flex flex-col gap-8 text-6xl font-black tracking-tighter opacity-5"
                animate={{
                  y: [-2000, 0],
                }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                }}
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-8">
                    <span className="bg-gradient-to-b from-amber-500 to-orange-500 bg-clip-text text-transparent">FRONTEND</span>
                    <span className="text-[var(--text-primary)]">•</span>
                    <span className="bg-gradient-to-b from-green-500 to-emerald-500 bg-clip-text text-transparent">FULLSTACK</span>
                    <span className="text-[var(--text-primary)]">•</span>
                    <span className="bg-gradient-to-b from-blue-500 to-indigo-500 bg-clip-text text-transparent">ARCHITECT</span>
                    <span className="text-[var(--text-primary)]">•</span>
                    <span className="bg-gradient-to-b from-red-500 to-rose-500 bg-clip-text text-transparent">EXPERT</span>
                    <span className="text-[var(--text-primary)]">•</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <motion.div
              className="space-y-6 md:space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Title Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-base sm:text-xl md:text-2xl text-[var(--text-secondary)] font-medium mb-3 sm:mb-4">
                  {t("hero.greeting")}
                </h2>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight sm:leading-none mb-3 sm:mb-4">
                  <span className="bg-gradient-to-r from-[#00d9ff] via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Stepan Roze
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-primary)]">
                  {t("hero.role")}
                </p>
              </motion.div>

              {/* Description */}
              <motion.p
                className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t("hero.description")}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleOpenChat}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-bold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.6)] transition-all duration-300 group"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="truncate">{t("hero.viewWork") || "What I'm Doing Now"}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Button>
                
                <Button
                  onClick={() => setIsBookCallOpen(true)}
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-[#00d9ff]/50 hover:border-[#00d9ff] text-[var(--text-primary)] hover:bg-[#00d9ff]/10 font-bold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg transition-all duration-300 group backdrop-blur-sm"
                >
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="truncate">{t("hero.getInTouch") || "Book a Consultation"}</span>
                </Button>
              </motion.div>

              {/* Quick Stats - TERMINAL DEVELOPER STYLE */}
              <motion.div
                className="pt-4 sm:pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Desktop: 3 columns, Mobile: 3 columns on single row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { 
                      icon: Code, 
                      value: "5+", 
                      label: t("hero.yearsExperience"),
                      prefix: "experience:",
                      suffix: "years",
                      color: "#00d9ff"
                    },
                    { 
                      icon: CheckCircle2, 
                      value: "50+", 
                      label: t("hero.projectsCompleted"),
                      prefix: "projects:",
                      suffix: "completed",
                      color: "#22c55e"
                    },
                    { 
                      icon: Star, 
                      value: "100%", 
                      label: t("hero.happyClients"),
                      prefix: "satisfaction:",
                      suffix: "rate",
                      color: "#f59e0b"
                    },
                  ].map((stat, index) => (
                    <motion.div 
                      key={index} 
                      className="relative group bg-[#0a0a0a]/80 backdrop-blur-sm border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[#00d9ff]/50 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ y: -2, borderColor: 'rgba(0, 217, 255, 0.5)' }}
                    >
                      {/* Terminal Header Bar */}
                      <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500/60" />
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500/60" />
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500/60" />
                        </div>
                        <span className="text-[7px] sm:text-[9px] text-[var(--text-muted)] font-mono ml-auto">
                          stats.sh
                        </span>
                      </div>

                      {/* Terminal Content */}
                      <div className="p-2 sm:p-4">
                        {/* Command Line Style - hidden on mobile */}
                        <div className="hidden sm:flex items-center gap-2 mb-2">
                          <span className="text-[#00d9ff] text-xs font-mono">$</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">
                            cat {stat.prefix}
                          </span>
                        </div>

                        {/* Value Display */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-2 mb-1">
                          <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: stat.color }} />
                          <span className="text-lg sm:text-3xl font-black font-mono" style={{ color: stat.color }}>
                            {stat.value}
                          </span>
                          <span className="text-[8px] sm:text-[10px] text-[var(--text-muted)] font-mono hidden sm:inline">
                            {stat.suffix}
                          </span>
                        </div>

                        {/* Blinking Cursor - hidden on mobile */}
                        <motion.span
                          className="hidden sm:inline-block w-2 h-4 bg-[#00d9ff] ml-1"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      </div>

                      {/* Hover Glow */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${stat.color}10 0%, transparent 70%)`
                        }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Bottom Info - Optional */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-3 text-center"
                >
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    // Real-time metrics from production
                  </span>
                </motion.div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex items-center gap-2.5 sm:gap-3 pt-3 sm:pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="p-2.5 sm:p-3 bg-[var(--card-bg)] backdrop-blur-sm border border-[var(--card-border)] rounded-xl text-[var(--text-secondary)] hover:text-[#00d9ff] hover:border-[#00d9ff]/50 hover:scale-110 transition-all duration-300 group"
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-colors" />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Elements */}
            <motion.div
              className="flex flex-col items-center justify-center space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Tech Stack Floating Cards */}
              <motion.div
                className="grid grid-cols-3 gap-4 w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {["React", "TypeScript", "Next.js", "Node.js", "Tailwind", "GraphQL"].map((tech, index) => (
                  <motion.div
                    key={tech}
                    className="p-4 bg-[var(--card-bg)] backdrop-blur-sm border border-[var(--card-border)] rounded-xl text-center hover:border-[#00d9ff]/50 hover:scale-105 transition-all"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <span className="text-sm font-medium text-[var(--text-secondary)]">{tech}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="relative w-full max-w-md h-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="absolute top-0 left-1/4 w-20 h-20 bg-[#00d9ff]/20 rounded-full blur-2xl"
                  animate={{
                    y: [0, -20, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"
                  animate={{
                    y: [0, 20, 0],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            className="flex flex-col items-center gap-2 group cursor-pointer"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => {
              const aboutSection = document.getElementById("about");
              aboutSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[#00d9ff] transition-colors">
              {t("hero.scrollExplore")}
            </span>
            <div className="w-6 h-10 border-2 border-[var(--card-border)] group-hover:border-[#00d9ff] rounded-full flex items-start justify-center p-1.5 transition-colors">
              <motion.div
                className="w-1.5 h-1.5 bg-[var(--text-secondary)] group-hover:bg-[#00d9ff] rounded-full transition-colors"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.button>
        </motion.div>
      </section>

      {/* Book Call Modal */}
      <BookCallModal isOpen={isBookCallOpen} onClose={() => setIsBookCallOpen(false)} />
    </>
  );
}