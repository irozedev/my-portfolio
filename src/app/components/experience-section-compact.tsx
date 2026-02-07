import { motion, AnimatePresence } from "motion/react";
import { Briefcase, MapPin, Calendar, ChevronLeft, ChevronRight, Star, TrendingUp, Users, Award } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/language-context";

export function ExperienceSectionCompact() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);

  const experiences = [
    {
      key: 'senior-dev',
      period: '2020 - Present',
      years: '5+ years',
      icon: Star,
      color: '#00d9ff',
      gradient: 'from-[#00d9ff] to-cyan-500',
      metrics: [
        { icon: TrendingUp, value: '40+', labelKey: 'projects' },
        { icon: Users, value: '20+', labelKey: 'clients' },
        { icon: Award, value: '99%', labelKey: 'satisfaction' },
      ],
    },
    {
      key: 'freelance',
      period: '2018 - 2020',
      years: '2 years',
      icon: Briefcase,
      color: '#a78bfa',
      gradient: 'from-purple-500 to-indigo-500',
      metrics: [
        { icon: TrendingUp, value: '15+', labelKey: 'projects' },
        { icon: Users, value: '10+', labelKey: 'clients' },
        { icon: Award, value: '98%', labelKey: 'satisfaction' },
      ],
    },
    {
      key: 'junior-dev',
      period: '2015 - 2018',
      years: '3 years',
      icon: Award,
      color: '#22c55e',
      gradient: 'from-green-500 to-emerald-500',
      metrics: [
        { icon: TrendingUp, value: '10+', labelKey: 'projects' },
        { icon: Users, value: '3', labelKey: 'companies' },
        { icon: Award, value: '95%', labelKey: 'growth' },
      ],
    },
  ];

  const totalPages = experiences.length;

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentExperience = experiences[currentPage];
  const Icon = currentExperience.icon;

  return (
    <section id="experience" className="min-h-screen py-20 md:py-32 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[600px] h-[600px] bg-[#00d9ff]/10 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto max-w-7xl relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-gradient-to-r from-purple-500/20 to-[#00d9ff]/20 border border-purple-500/30 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Briefcase className="w-5 h-5 text-purple-400" />
              <span className="text-sm md:text-base font-semibold text-[var(--text-primary)]">{t('experience.subtitle')}</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-[#00d9ff] to-green-400 bg-clip-text text-transparent">
                {t('experience.title').toUpperCase()}
              </span>
            </motion.h2>
            
            <motion.div
              className="h-1 w-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            />

            <motion.p
              className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {t('experience.description')}
            </motion.p>
          </div>

          {/* Book Container */}
          <div className="max-w-6xl mx-auto">
            <div className="relative perspective-1000">
              {/* Book */}
              <motion.div 
                className="relative mx-auto"
                initial={{ rotateY: -10 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 1, type: "spring" }}
              >
                {/* Main Book Content */}
                <div className="relative bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-3xl p-8 md:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
                  {/* Book Spine Effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent rounded-l-3xl" />
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, x: 100, rotateY: 90 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      exit={{ opacity: 0, x: -100, rotateY: -90 }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                      className="min-h-[500px] md:min-h-[600px]"
                    >
                      {/* Page Header */}
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <motion.div
                              className={`p-4 rounded-2xl bg-gradient-to-br ${currentExperience.gradient}`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <Icon className="w-8 h-8 text-white" />
                            </motion.div>
                            <div>
                              <h3 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                                {t(`experience.${currentExperience.key}.title`)}
                              </h3>
                              <p className="text-lg text-[var(--text-secondary)] mt-1">
                                {t(`experience.${currentExperience.key}.company`)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl">
                              <Calendar className="w-4 h-4" style={{ color: currentExperience.color }} />
                              <span className="text-sm text-[var(--text-secondary)]">{currentExperience.period}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl">
                              <Briefcase className="w-4 h-4" style={{ color: currentExperience.color }} />
                              <span className="text-sm text-[var(--text-secondary)]">{currentExperience.years}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl">
                              <MapPin className="w-4 h-4" style={{ color: currentExperience.color }} />
                              <span className="text-sm text-[var(--text-secondary)]">{t(`experience.${currentExperience.key}.location`)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Page Number */}
                        <div className="text-right">
                          <div className="text-sm text-[var(--text-muted)] mb-2">{t('experience.chapter')}</div>
                          <div className="text-4xl font-bold" style={{ color: currentExperience.color }}>
                            {currentPage + 1}/{totalPages}
                          </div>
                        </div>
                      </div>

                      {/* Story Content */}
                      <div className="space-y-6 mb-8">
                        <div>
                          <h4 className="text-xl font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: currentExperience.color }} />
                            {t('experience.story')}
                          </h4>
                          <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                            {t(`experience.${currentExperience.key}.story`)}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xl font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: currentExperience.color }} />
                            {t('experience.achievements')}
                          </h4>
                          <ul className="space-y-3">
                            {[0, 1, 2].map((i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-3 text-[var(--text-secondary)]"
                              >
                                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: `${currentExperience.color}30` }}>
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentExperience.color }} />
                                </div>
                                <span className="text-base leading-relaxed">
                                  {t(`experience.${currentExperience.key}.achievements.${i}`)}
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-xl font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: currentExperience.color }} />
                            {t('experience.technologies')}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {t(`experience.${currentExperience.key}.technologies`).split(',').map((tech: string, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-sm text-[var(--text-secondary)]"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border-color)]">
                        {currentExperience.metrics.map((metric, i) => {
                          const MetricIcon = metric.icon;
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                              className="text-center p-4 bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)]"
                            >
                              <MetricIcon className="w-6 h-6 mx-auto mb-2" style={{ color: currentExperience.color }} />
                              <div className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1">
                                {metric.value}
                              </div>
                              <div className="text-xs md:text-sm text-[var(--text-secondary)]">
                                {t(`experience.metrics.${metric.labelKey}`)}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8">
                  <motion.button
                    onClick={prevPage}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-[#00d9ff]/20 border-2 border-purple-500/30 rounded-xl text-[var(--text-primary)] hover:border-purple-500/50 transition-all"
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-semibold">{t('experience.previous')}</span>
                  </motion.button>

                  {/* Page Indicators */}
                  <div className="flex gap-2">
                    {experiences.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          i === currentPage
                            ? 'w-8'
                            : 'bg-white/20'
                        }`}
                        style={{
                          backgroundColor: i === currentPage ? currentExperience.color : undefined,
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>

                  <motion.button
                    onClick={nextPage}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00d9ff]/20 to-purple-500/20 border-2 border-[#00d9ff]/30 rounded-xl text-[var(--text-primary)] hover:border-[#00d9ff]/50 transition-all"
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="font-semibold">{t('experience.next')}</span>
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Timeline Decoration */}
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden xl:block">
                  <div className="flex flex-col items-center gap-4">
                    {experiences.map((exp, i) => (
                      <motion.div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          i === currentPage ? 'scale-150' : 'scale-100'
                        }`}
                        style={{
                          backgroundColor: i === currentPage ? exp.color : 'transparent',
                          borderColor: exp.color,
                        }}
                        whileHover={{ scale: 1.5 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Summary Stats */}
            <motion.div
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center p-6 bg-gradient-to-br from-[#00d9ff]/10 to-cyan-500/10 border border-[#00d9ff]/30 rounded-2xl">
                <div className="text-4xl font-bold text-[#00d9ff] mb-2">10+</div>
                <div className="text-sm text-[var(--text-secondary)]">{t('experience.summary.years')}</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-2xl">
                <div className="text-4xl font-bold text-purple-400 mb-2">65+</div>
                <div className="text-sm text-[var(--text-secondary)]">{t('experience.summary.projects')}</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl">
                <div className="text-4xl font-bold text-green-400 mb-2">30+</div>
                <div className="text-sm text-[var(--text-secondary)]">{t('experience.summary.clients')}</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-2xl">
                <div className="text-4xl font-bold text-orange-400 mb-2">99%</div>
                <div className="text-sm text-[var(--text-secondary)]">{t('experience.summary.satisfaction')}</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}