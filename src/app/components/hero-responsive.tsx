import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Sparkles, Code, Zap, Play, Github, Linkedin, Mail, Briefcase } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { BookCallModal } from "./book-call-fixed";

interface HeroResponsiveProps {
  onViewWork: () => void;
}

const socialLinks = [
  { icon: Github, href: "https://github.com/irozedev", label: "GitHub", color: "#333333" },
  { icon: Linkedin, href: "https://linkedin.com/in/rozestepan", label: "LinkedIn", color: "#0077b5" },
  { icon: Briefcase, href: "https://www.upwork.com/freelancers/rozestepan", label: "Upwork", color: "#14a800" },
  { icon: Mail, href: "mailto:rozedev095@gmail.com", label: "Email", color: "#00d9ff" },
];

const techStack = ["React", "Vue.js", "TypeScript", "Node.js", "Tailwind", "Magento", "3D"];

export function HeroResponsive({ onViewWork }: HeroResponsiveProps) {
  const { t } = useLanguage();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpenChat = () => {
    const event = new CustomEvent('openChatBot');
    window.dispatchEvent(event);
  };

  return (
    <>
      <section
        id="home"
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20 pb-16 px-4 sm:pt-24 sm:pb-20 md:pt-28 md:pb-24"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid Pattern - Hidden on mobile for performance */}
          <div className="hidden sm:block absolute inset-0 bg-[linear-gradient(to_right,#00d9ff0a_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff0a_1px,transparent_1px)] bg-[size:4rem_4rem] md:bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
          
          {/* Gradient Orbs - Optimized for mobile */}
          <motion.div
            style={isMobile ? {} : { y }}
            className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-[#00d9ff]/20 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            style={isMobile ? {} : { y: useTransform(scrollYProgress, [0, 1], [0, -150]) }}
            className="absolute top-1/3 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-purple-500/20 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating Elements - Hidden on mobile */}
          <motion.div
            className="hidden md:block absolute top-1/4 right-1/3 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 border-2 border-[#00d9ff]/30 rounded-lg"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="hidden md:block absolute bottom-1/3 left-1/3 w-6 h-6 md:w-8 md:h-8 bg-[#00d9ff]/20 rounded-full"
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-7xl relative z-10 w-full">
          <div className="flex flex-col items-center text-center">
            
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 sm:mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-full backdrop-blur-sm">
                <div className="relative flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-[var(--text-secondary)]">
                  Available for new projects
                </span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-4 sm:mb-6 w-full"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight mb-3 sm:mb-4">
                <span className="block text-[var(--text-primary)] mb-1 sm:mb-2">
                  {t("hero.greeting")}
                </span>
                <span className="block bg-gradient-to-r from-[#00d9ff] via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Stepan Roze
                </span>
              </h1>
            </motion.div>

            {/* Animated Role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex flex-wrap items-center justify-center gap-2 text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-[var(--text-primary)]">
                <Code className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-[#00d9ff]" />
                <span>{t("hero.role")}</span>
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-purple-500" />
                <span className="hidden sm:inline">&</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  {t("hero.aiEnthusiast")}
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[var(--text-secondary)] leading-relaxed max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mb-8 sm:mb-10 md:mb-12 px-4"
            >
              {t("hero.description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12 md:mb-16 w-full sm:w-auto px-4"
            >
              <Button
                onClick={onViewWork}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-bold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.6)] transition-all duration-300 group"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="truncate">{t("hero.viewWork") || "View My Work"}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                onClick={() => setIsBookCallOpen(true)}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-[#00d9ff]/50 hover:border-[#00d9ff] text-[var(--text-primary)] hover:bg-[#00d9ff]/10 font-bold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg transition-all duration-300 group backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span className="truncate">{t("hero.getInTouch") || "Book a Call"}</span>
              </Button>

              {/* AI Assistant button - separate row on smallest screens */}
              <Button
                onClick={handleOpenChat}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-purple-500/50 hover:border-purple-500 text-[var(--text-primary)] hover:bg-purple-500/10 font-bold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg transition-all duration-300 group backdrop-blur-sm"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="truncate">AI Assistant</span>
              </Button>
            </motion.div>

            {/* Tech Stack Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12 px-4 max-w-2xl mx-auto"
            >
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.08 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-full text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:border-[#00d9ff]/50 hover:text-[#00d9ff] transition-all cursor-default"
                >
                  {tech}
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-4"
            >
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="p-2.5 sm:p-3 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[#00d9ff] hover:border-[#00d9ff]/50 hover:scale-110 transition-all duration-300"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Scroll Indicator - Hidden on small mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="hidden sm:block absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                  Scroll to explore
                </span>
                <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-[var(--border-color)] rounded-full p-1">
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1 h-2 bg-[#00d9ff] rounded-full mx-auto"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
      </section>

      {/* Book Call Modal */}
      <BookCallModal 
        isOpen={isBookCallOpen} 
        onClose={() => setIsBookCallOpen(false)} 
      />
    </>
  );
}