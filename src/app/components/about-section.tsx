import { motion } from "motion/react";
import { Code2, Palette, Database, Wrench, Globe, Zap, CheckCircle2, Award, Target, GraduationCap, MapPin, Calendar, Briefcase, Box } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { SkillsModern } from "./skills-modern";
import { LanguagesModern } from "./languages-modern";

const highlights = [
  { icon: Award, key: "experience", color: "#00d9ff" },
  { icon: Target, key: "projects", color: "#a78bfa" },
  { icon: CheckCircle2, key: "satisfaction", color: "#22c55e" },
  { icon: Globe, key: "fullstack", color: "#f59e0b" },
];

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="min-h-screen py-6 sm:py-8 md:py-10 px-3 sm:px-4 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 w-full h-32 opacity-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 C150,60 350,60 600,30 C850,0 1050,0 1200,30 L1200,120 L0,120 Z" fill="var(--accent-primary)" />
        </svg>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-[var(--text-primary)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[var(--accent-primary)]">{(t("about.title") || "About Me").toUpperCase()}</span>
            </motion.h2>
            <motion.div
              className="h-1 w-24 sm:w-32 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent mx-auto mb-4 sm:mb-6"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            />
            <motion.p
              className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto px-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {t("about.subtitle")}
            </motion.p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Left - Photo & Info */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                {/* Photo Card */}
                <div className="relative bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] backdrop-blur-md rounded-3xl border border-[var(--border-color)] overflow-hidden p-4 group">
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  />
                  
                  <img
                    src="https://lh3.googleusercontent.com/d/1x2hWpjRadIpYFTygTX9SJTfzFobjSDol"
                    alt="Stepan Roze"
                    className="relative w-full h-[400px] object-cover rounded-2xl"
                    onError={(e) => {
                      // Fallback to Unsplash if Google Drive fails
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1737575655055-e3967cbefd03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRldmVsb3BlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODI0MzA1NHww&ixlib=rb-4.1.0&q=80&w=1080";
                    }}
                  />
                  
                  {/* Info Overlay */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--border-color)] rounded-xl p-4">
                      <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Stepan Roze</h3>
                      <p className="text-[var(--accent-primary)]">{t("hero.role")} & {t("hero.aiEnthusiast")}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <motion.div 
                    className="bg-gradient-to-br from-[var(--accent-primary)]/10 to-cyan-500/5 backdrop-blur-sm border border-[var(--accent-primary)]/30 rounded-xl p-4 hover:border-[var(--accent-primary)]/50 transition-all group"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-[var(--accent-primary)]" />
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{t("about.basedIn")}</div>
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {t("about.location")}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 hover:border-green-500/50 transition-all group"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5 text-green-400" />
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{t("about.forWork")}</div>
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-green-400 transition-colors">
                      {t("about.open")}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right - Description & Highlights */}
            <motion.div
              className="lg:col-span-7 space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {/* Description */}
              <div className="bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-8">
                <p className="text-xl text-[var(--text-primary)] mb-6 leading-relaxed">
                  {t("about.intro")}
                </p>

                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  {t("about.description")}
                </p>
              </div>

              {/* Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((highlight, index) => {
                  const Icon = highlight.icon;
                  return (
                    <motion.div
                      key={index}
                      className="bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-color)] rounded-xl p-6 
                        hover:bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/50 transition-all duration-300 
                        hover:scale-105 group cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="p-3 rounded-lg group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${highlight.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: highlight.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[var(--text-primary)] leading-relaxed">{t(`about.highlights.${highlight.key}`)}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Skills Bento Grid */}
          <div className="mb-16">
            <motion.h3
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8 flex items-center justify-center gap-3 text-[var(--text-primary)] font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Code2 className="w-8 h-8 text-[var(--accent-primary)]" />
              {(t("about.skillsTitle") || "Technical Skills").toUpperCase()}
            </motion.h3>
            
            <SkillsModern />
          </div>

          {/* Languages */}
          <div className="mt-16">
            <motion.h3
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8 flex items-center justify-center gap-3 text-[var(--text-primary)] font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Globe className="w-8 h-8 text-[var(--accent-primary)]" />
              LANGUAGES
            </motion.h3>
            
            <LanguagesModern />
          </div>

          {/* Education */}
          <div className="mt-16">
            <motion.h3
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-8 flex items-center justify-center gap-3 text-[var(--text-primary)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-[var(--accent-primary)]" />
              {(t("about.educationTitle") || "Education").toUpperCase()}
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Computer Academy STEP */}
              <motion.div
                className="bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-6 
                  hover:bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/50 transition-all duration-300 
                  hover:scale-105 hover:shadow-[0_0_30px_rgba(0,217,255,0.2)] group"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-[var(--accent-primary)]/20 to-purple-500/20 rounded-xl border border-[var(--accent-primary)]/30 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-8 h-8 text-[var(--accent-primary)]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                      {t("about.education.step.name")}
                    </h4>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{t("about.education.step.location")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--accent-primary)] text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      <span>{t("about.education.step.period")}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {t("about.education.step.description")}
                </p>
              </motion.div>

              {/* V.N. Karazin University */}
              <motion.div
                className="bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-color)] rounded-2xl p-6 
                  hover:bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/50 transition-all duration-300 
                  hover:scale-105 hover:shadow-[0_0_30px_rgba(0,217,255,0.2)] group relative overflow-hidden"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {/* University Logo Watermark */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                  <img 
                    src="https://images.unsplash.com/photo-1695556575317-9d49e3dccf75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbG9nbyUyMGVtYmxlbXxlbnwxfHx8fDE3NjkyMDM4Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="University emblem"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-[var(--accent-primary)]/20 rounded-xl border border-purple-500/30 group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                        {t("about.education.karazin.name")}
                      </h4>
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{t("about.education.karazin.location")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        <span>{t("about.education.karazin.period")}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {t("about.education.karazin.description")}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}