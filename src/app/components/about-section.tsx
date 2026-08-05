import { motion } from "motion/react";
import { Code2, Globe, CheckCircle2, Award, Target, GraduationCap, MapPin, Calendar, Briefcase } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { SkillsFuturistic } from "./skills-futuristic";
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
    <section id="about" className="min-h-screen py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 bg-[var(--bg-primary)] relative overflow-hidden scroll-mt-24 md:scroll-mt-28">
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
                    width={600}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="relative w-full h-[400px] object-cover rounded-2xl"
                    onError={(e) => {
                      // Falls back to the real photo, served from /public.
                      //
                      // This used to fall back to an Unsplash stock portrait —
                      // a photograph of a stranger, under the caption "Stepan
                      // Roze", on the page whose whole job is to say who he is.
                      // The primary source is a Google Drive link, which can
                      // fail for reasons nobody controls (rate limiting, a
                      // permission change, Google retiring /d/ URLs), and the
                      // failure mode was silent. Lower resolution is a small
                      // price; showing someone else's face is not a price worth
                      // paying at all.
                      (e.target as HTMLImageElement).src = "/cv-photo.jpg";
                    }}
                  />
                  
                  {/* Info Overlay */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--border-color)] rounded-xl p-4">
                      <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Stepan Roze</h3>
                      {/* One claim, not two glued together. This used to append
                          "& AI Enthusiast" after a sentence that already had an
                          ampersand in it, which read as a broken list. */}
                      <p className="text-[var(--accent-primary)]">{t("hero.role")}</p>
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
            {/* Enhanced Technical Skills Header */}
            <motion.div
              className="relative mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-4 mb-3">
                <motion.div
                  className="p-3 bg-[var(--accent-primary)]/10 rounded-xl border-2 border-[var(--accent-primary)]/30"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Code2 className="w-8 h-8 text-[var(--accent-primary)]" />
                </motion.div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--text-primary)] font-mono uppercase tracking-wider">
                  {(t("about.skillsTitle") || "Technical Skills").toUpperCase()}
                </h3>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[var(--accent-primary)]" />
                <div className="h-1 w-1 rounded-full bg-[var(--accent-primary)]" />
                <div className="h-[2px] w-24 bg-[var(--accent-primary)]" />
                <div className="h-1 w-1 rounded-full bg-[var(--accent-primary)]" />
                <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[var(--accent-primary)]" />
              </div>
            </motion.div>
            
            <SkillsFuturistic />
          </div>

          {/* Languages */}
          <div className="mt-16">
            {/* Enhanced Languages Header */}
            <motion.div
              className="relative mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-4 mb-3">
                <motion.div
                  className="p-3 bg-purple-500/10 rounded-xl border-2 border-purple-500/30"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Globe className="w-8 h-8 text-purple-400" />
                </motion.div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--text-primary)] font-mono uppercase tracking-wider">
                  LANGUAGES
                </h3>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-purple-400" />
                <div className="h-1 w-1 rounded-full bg-purple-400" />
                <div className="h-[2px] w-24 bg-purple-400" />
                <div className="h-1 w-1 rounded-full bg-purple-400" />
                <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-purple-400" />
              </div>
            </motion.div>
            
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
                {/* The "university logo watermark" that used to sit here was a
                    stock photo from Unsplash with alt="University emblem" — it
                    is not Karazin's emblem, and claiming an institution's mark
                    is not a claim worth making for decoration rendered at 5%
                    opacity. It also cost a third-party request for something
                    effectively invisible. */}

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