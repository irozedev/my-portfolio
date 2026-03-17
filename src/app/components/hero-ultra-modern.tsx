import { useLanguage } from "../contexts/language-context";
import { useAvailability } from "../contexts/availability-context";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { BookCallModal } from "./book-call-fixed";
import { AvailabilityScheduleModal } from "./availability-schedule-modal";
import { getFormattedStats } from "../../utils/stats-calculator";
import { StatsAirport } from "./stats-airport";
import { Github, Linkedin, Briefcase, Mail, Sparkles, Code2, Rocket } from "lucide-react";
import { motion } from "motion/react";

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

const dynamicStats = getFormattedStats();

export function HeroUltraModern({ onViewWork }: HeroUltraModernProps) {
  const { t, language } = useLanguage();
  const { isAvailable, statusText, statusEmoji } = useAvailability();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isAvailabilityScheduleOpen, setIsAvailabilityScheduleOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-20 pb-12">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00d9ff08_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />
        
        {/* Gradient Orbs */}
        <motion.div 
          className="absolute top-1/4 -left-48 w-96 h-96 bg-[var(--accent-primary)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Status Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--accent-primary)]/30 rounded-full mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span
                className="text-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {statusEmoji}
              </motion.span>
              <span className="text-sm font-mono text-[var(--text-secondary)]">{statusText}</span>
            </motion.div>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-[var(--accent-primary)] via-cyan-300 to-[var(--accent-primary)] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                STEPAN ROZE
              </span>
            </h1>

            {/* Role with Rotating Text */}
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-secondary)] mb-4">
              {t('hero.role')}
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mx-auto px-4">
              {t('hero.description')}
            </p>
          </motion.div>

          {/* Infinite Tech Marquee - FIXED FOR ARABIC */}
          <div className="relative overflow-hidden py-4 mb-8">
            <div className="flex gap-4 animate-marquee">
              {/* First set */}
              {techStack.map((tech, i) => (
                <div
                  key={`tech-1-${i}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg whitespace-nowrap flex-shrink-0"
                >
                  <span className="text-xl">{tech.icon}</span>
                  <span className="text-sm font-mono text-[var(--text-primary)]">{tech.name}</span>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {techStack.map((tech, i) => (
                <div
                  key={`tech-2-${i}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg whitespace-nowrap flex-shrink-0"
                >
                  <span className="text-xl">{tech.icon}</span>
                  <span className="text-sm font-mono text-[var(--text-primary)]">{tech.name}</span>
                </div>
              ))}
              {/* Triple for extra safety */}
              {techStack.map((tech, i) => (
                <div
                  key={`tech-3-${i}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg whitespace-nowrap flex-shrink-0"
                >
                  <span className="text-xl">{tech.icon}</span>
                  <span className="text-sm font-mono text-[var(--text-primary)]">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => setIsBookCallOpen(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black font-bold rounded-lg overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Rocket className="w-5 h-5" />
                {t('hero.bookCall')}
              </span>
            </button>

            <button
              onClick={onViewWork}
              className="px-8 py-4 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold rounded-lg border-2 border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)] transition-all w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <Code2 className="w-5 h-5" />
                {t('hero.viewWork')}
              </span>
            </button>
          </motion.div>

          {/* Stats */}
          <StatsAirport />

          {/* Social Links */}
          <motion.div 
            className="flex items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-lg hover:border-[var(--accent-primary)] transition-all hover:scale-110"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5 text-[var(--accent-primary)]" />
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      {isBookCallOpen && (
        <BookCallModal onClose={() => setIsBookCallOpen(false)} />
      )}
      {isAvailabilityScheduleOpen && (
        <AvailabilityScheduleModal onClose={() => setIsAvailabilityScheduleOpen(false)} />
      )}
    </>
  );
}
