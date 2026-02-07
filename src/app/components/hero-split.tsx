import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Sparkles, Code, Zap, Play, Github, Linkedin, Mail, Briefcase, Download, CheckCircle2, TrendingUp, Users, Award } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useAvailability } from "../contexts/availability-context";
import { Button } from "./ui/button";
import { useState } from "react";
import { BookCallModal } from "./book-call-fixed";
import { AvailabilityModal } from "./availability-modal";
import { getFormattedStats } from "../../utils/stats-calculator";

interface HeroSplitProps {
  onViewWork: () => void;
}

// Get dynamic stats from real data
const dynamicStats = getFormattedStats();

const stats = [
  { icon: Award, value: dynamicStats.yearsExperience, label: "Years Experience", labelKey: "yearsExperience", sectionId: "experience" },
  { icon: CheckCircle2, value: dynamicStats.projectsCompleted, label: "Projects Completed", labelKey: "projectsCompleted", sectionId: "projects" },
  { icon: Users, value: dynamicStats.happyClients, label: "Happy Clients", labelKey: "happyClients", sectionId: "contact" },
  { icon: TrendingUp, value: dynamicStats.successRate, label: "Success Rate", labelKey: "successRate", sectionId: "experience" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/irozedev", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/rozestepan", label: "LinkedIn" },
  { icon: Briefcase, href: "https://www.upwork.com/freelancers/rozestepan", label: "Upwork" },
  { icon: Mail, href: "mailto:hello@roze.live", label: "Email" },
];

export function HeroSplit({ onViewWork }: HeroSplitProps) {
  const { t } = useLanguage();
  const { isAvailable, statusText, statusEmoji, nextAvailable } = useAvailability();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  const handleOpenChat = () => {
    const event = new CustomEvent('openChatBot');
    window.dispatchEvent(event);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const nav = document.querySelector('nav');
      const headerOffset = nav ? nav.offsetHeight : 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <>
      <motion.section
        id="home"
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-32 sm:pt-36 md:pt-32 lg:pt-24 pb-8 sm:pb-12 px-4 sm:px-6"
        style={{ y }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid Pattern - Hidden on mobile for cleaner look */}
          <div className="hidden lg:block absolute inset-0 bg-[linear-gradient(to_right,#00d9ff0a_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
          
          {/* Gradient Orbs */}
          <motion.div
            style={{ y }}
            className="absolute top-1/4 -left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[#00d9ff]/20 rounded-full blur-[80px] md:blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 -right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-[80px] md:blur-[100px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-7xl relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <motion.div
              className="space-y-4 sm:space-y-6 lg:space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Availability Badge - FUNCTIONAL */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group relative"
              >
                <button
                  onClick={() => setIsAvailabilityModalOpen(true)}
                  className={`inline-flex items-center gap-2 px-4 py-2 sm:px-4 sm:py-2 ${
                    isAvailable ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' : 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20'
                  } border rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer`}
                >
                  <div className="relative">
                    <div className={`w-2 h-2 ${isAvailable ? 'bg-green-500' : 'bg-orange-500'} rounded-full animate-pulse`} />
                    <div className={`absolute inset-0 w-2 h-2 ${isAvailable ? 'bg-green-500' : 'bg-orange-500'} rounded-full animate-ping`} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-[var(--text-secondary)]">
                    {statusEmoji} {statusText}
                  </span>
                </button>
                {/* Tooltip with click hint */}
                <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">{nextAvailable}</p>
                  <p className="text-xs text-[#00d9ff]">👆 Click for detailed availability</p>
                </div>
              </motion.div>

              {/* Title */}
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg sm:text-xl md:text-xl text-[var(--text-secondary)] font-medium mb-2 sm:mb-3"
                >
                  {t("hero.greeting")}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-bold leading-tight mb-2 sm:mb-3 md:mb-4"
                >
                  <span className="bg-gradient-to-r from-[#00d9ff] via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Stepan Roze
                  </span>
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center gap-2 text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-[var(--text-primary)]"
                >
                  <Code className="w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 text-[#00d9ff]" />
                  <span>{t("hero.role")}</span>
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 text-purple-500" />
                </motion.div>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base sm:text-lg md:text-xl lg:text-xl text-[var(--text-secondary)] leading-relaxed"
              >
                {t("hero.description")}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Button
                  onClick={onViewWork}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-bold px-8 py-6 text-lg shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.6)] transition-all duration-300 group touch-manipulation"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t("hero.viewWork") || "View My Work"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  onClick={() => setIsBookCallOpen(true)}
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-[#00d9ff]/50 hover:border-[#00d9ff] text-[var(--text-primary)] hover:bg-[#00d9ff]/10 font-bold px-8 py-6 text-lg transition-all duration-300 group backdrop-blur-sm touch-manipulation"
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
                className="flex items-center gap-3 sm:gap-4 pt-2 sm:pt-4"
              >
                <span className="text-sm sm:text-base text-[var(--text-muted)]">{t("hero.followMe")}</span>
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="p-2.5 sm:p-3 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:text-[#00d9ff] hover:border-[#00d9ff]/50 hover:scale-110 transition-all duration-300"
                      whileHover={{ y: -3 }}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5 sm:w-5 sm:h-5" />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Right Column - Stats & Visual */}
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.button
                      key={stat.label}
                      onClick={() => scrollToSection(stat.sectionId)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[#00d9ff]/50 transition-all duration-300 group cursor-pointer text-left w-full"
                    >
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="p-2 sm:p-2.5 bg-[#00d9ff]/10 rounded-lg sm:rounded-xl group-hover:bg-[#00d9ff]/20 transition-colors">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#00d9ff]" />
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00d9ff] to-cyan-400 bg-clip-text text-transparent mb-0.5 sm:mb-1" dir="ltr">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-[var(--text-muted)]">
                        {t(`hero.${stat.labelKey}`) || stat.label}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feature Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-color)] rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-[var(--accent-primary)]/50 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-[var(--accent-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-[var(--accent-primary)]/10 rounded-lg sm:rounded-xl">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-primary)]" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                      {t("hero.fastReliable")}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-3 sm:mb-4">
                    {t("hero.fastReliableDesc")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Vue.js", "TypeScript", "Tailwind"].map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 sm:px-3 sm:py-1 bg-[var(--bg-primary)]/50 border border-[var(--border-color)] rounded-full text-xs font-medium text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* AI Assistant CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer"
                onClick={handleOpenChat}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg sm:rounded-xl">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[var(--text-primary)] mb-0.5 sm:mb-1">
                        Try AI Assistant
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                        Chat with my AI to learn more
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 md:h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
      </motion.section>

      {/* Book Call Modal */}
      <BookCallModal 
        isOpen={isBookCallOpen} 
        onClose={() => setIsBookCallOpen(false)} 
      />

      {/* Availability Modal */}
      <AvailabilityModal
        isOpen={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
        onBookCall={() => {
          setIsAvailabilityModalOpen(false);
          setIsBookCallOpen(true);
        }}
      />
    </>
  );
}