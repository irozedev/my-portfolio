import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Play, Github, Linkedin, Mail, Briefcase, Sparkles, Code2, Zap, TrendingUp } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { Button } from "./ui/button";
import { useState } from "react";
import { BookCallModal } from "./book-call-fixed";
import { getFormattedStats } from "../../utils/stats-calculator";

interface HeroCleanProps {
  onViewWork: () => void;
}

const socialLinks = [
  { icon: Github, href: "https://github.com/irozedev", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/rozestepan", label: "LinkedIn" },
  { icon: Briefcase, href: "https://www.upwork.com/freelancers/rozestepan", label: "Upwork" },
  { icon: Mail, href: "mailto:rozedev095@gmail.com", label: "Email" },
];

const dynamicStats = getFormattedStats();

export function HeroClean({ onViewWork }: HeroCleanProps) {
  const { t, language } = useLanguage();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <>
      <motion.section
        id="home"
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-4 sm:px-6"
        style={{ y, opacity }}
      >
        {/* Simplified Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle Grid */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(to right, #00d9ff0a 1px, transparent 1px), linear-gradient(to bottom, #00d9ff0a 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
          
          {/* Modern Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-[#00d9ff]/10 rounded-full blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -50, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-6xl relative z-10 pt-20 pb-12">
          <div className="text-center space-y-8">
            
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium">
                {t("hero.greeting")}
              </p>
              
              {/* Name with Epic Animation */}
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tight">
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
                  Stepan
                </motion.span>
                <motion.span 
                  className="block bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-bold text-[var(--text-primary)]"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Code2 className="w-7 h-7 md:w-8 md:h-8 text-[#00d9ff]" />
                </motion.div>
                <span>{t("hero.role")}</span>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-7 h-7 md:w-8 md:h-8 text-purple-500" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base md:text-lg lg:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed"
            >
              {t("hero.description")}
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {[
                { value: dynamicStats.yearsExperience, label: t("hero.yearsExperience") || "Years Exp" },
                { value: dynamicStats.projectsCompleted, label: t("hero.projectsCompleted") || "Projects" },
                { value: dynamicStats.happyClients, label: t("hero.happyClients") || "Clients" },
                { value: dynamicStats.successRate, label: t("hero.successRate") || "Success" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="relative bg-[var(--bg-secondary)]/40 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-4 md:p-6 overflow-hidden transition-all duration-300 hover:border-[#00d9ff]/50">
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div 
                        className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-[#00d9ff] to-cyan-400 bg-clip-text text-transparent mb-1"
                        dir="ltr"
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs md:text-sm text-[var(--text-muted)] font-medium">
                        {stat.label}
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#00d9ff]/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button
                onClick={onViewWork}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black font-bold px-8 py-6 text-base md:text-lg rounded-2xl shadow-[0_0_40px_rgba(0,217,255,0.3)] hover:shadow-[0_0_60px_rgba(0,217,255,0.5)] transition-all duration-300 group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {t("hero.viewWork") || "View My Work"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                onClick={() => setIsBookCallOpen(true)}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-[#00d9ff]/50 hover:border-[#00d9ff] text-[var(--text-primary)] hover:bg-[#00d9ff]/10 font-bold px-8 py-6 text-base md:text-lg rounded-2xl transition-all duration-300 group backdrop-blur-sm"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                {t("hero.getInTouch") || "Book a Call"}
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            >
              <span className="text-sm text-[var(--text-muted)] font-medium">
                {t("hero.followMe") || "Connect with me"}
              </span>
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

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="pt-8"
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
        </div>
      </motion.section>

      {/* Modals */}
      <BookCallModal isOpen={isBookCallOpen} onClose={() => setIsBookCallOpen(false)} />
    </>
  );
}
