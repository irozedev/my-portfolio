import { motion } from "motion/react";
import { Briefcase, MapPin, Calendar, Award, ChevronRight, Code2, Building2, Target } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/language-context";
import { experiences, experienceCopy, type Lang } from "../data/experience";
import { VIEWPORT, DURATION, EASE } from "../lib/motion";


export function ExperienceTimelinePremium() {
  const { t, language } = useLanguage();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const L: Lang = (en, nl, ar, es) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;
  const copy = experienceCopy(L);

  const stats = [
    { icon: Award, value: "8+", label: L("Years", "Jaar", "سنوات", "Años") },
    {
      icon: Building2,
      value: "3",
      label: L("Enterprise brands", "Enterprise-merken", "علامات كبرى", "Marcas enterprise"),
    },
    { icon: Code2, value: "5", label: L("Roles", "Rollen", "أدوار", "Puestos") },
    {
      icon: Target,
      value: "2026",
      label: L("Latest launch", "Laatste launch", "أحدث إطلاق", "Último lanzamiento"),
    },
  ];

  return (
    <section
      id="experience"
      className="relative py-6 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[var(--bg-primary)] overflow-hidden scroll-mt-24 md:scroll-mt-28"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: DURATION, ease: EASE }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--accent-primary)]/10 to-purple-500/10 border border-[var(--accent-primary)]/30 rounded-full mb-6"
          >
            <Briefcase className="w-5 h-5 text-[var(--accent-primary)]" />
            <span className="text-sm font-medium text-[var(--accent-primary)]">
              {L("Career journey", "Loopbaan", "المسار المهني", "Trayectoria")}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
            {t("experience.title") || L("Work experience", "Werkervaring", "الخبرة العملية", "Experiencia")}
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            {t("experience.subtitle") ||
              L(
                "8+ years building e-commerce & enterprise web applications",
                "8+ jaar e-commerce en enterprise-webapplicaties bouwen",
                "أكثر من 8 سنوات في بناء تطبيقات التجارة الإلكترونية والمؤسسات",
                "8+ años construyendo e-commerce y aplicaciones web empresariales",
              )}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Spine — desktop centre, mobile left */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent-primary)]/40 via-purple-500/40 to-pink-500/40 hidden md:block -translate-x-1/2" />
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent-primary)]/40 via-purple-500/40 to-pink-500/40 block md:hidden" />

          <div className="space-y-12 md:space-y-16">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              const Icon = exp.icon;
              const isSelected = selectedId === exp.id;
              const isHovered = hoveredId === exp.id;
              const text = copy[exp.id as keyof typeof copy];
              const isAside = "aside" in exp && exp.aside;

              // The non-IT period renders as a footnote on the spine instead of
              // a card: it exists to close an eighteen-month gap, not to be
              // read as a career step. A full-size card gave it the same weight
              // as a national bank, which is the wrong claim; hiding it would leave
              // the hole. So: same position in the chronology, a fraction of
              // the visual volume, and no "Show more" to invite a detour.
              if (isAside) {
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={VIEWPORT}
                    transition={{ duration: DURATION, ease: EASE }}
                    className="relative pl-16 md:pl-0 md:flex md:justify-center"
                  >
                    {/* A small hollow marker on the spine, not a haloed icon. */}
                    <div className="absolute left-[1.4rem] md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full border-2 border-[var(--border-color)] bg-[var(--bg-primary)]" />

                    {/* Opaque enough to interrupt the spine behind it. At 40%
                        the line showed straight through and read as if it had
                        sliced the strip in half. */}
                    <div className="relative md:w-[min(34rem,100%)] md:mt-6 md:mb-2 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-[var(--text-secondary)]">
                          {text.title}
                        </span>
                        <span className="text-sm text-[var(--text-muted)]">— {exp.company}</span>
                        <span className="text-xs text-[var(--text-muted)] ms-auto whitespace-nowrap">
                          {text.period}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                        {text.description}
                      </p>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: DURATION, ease: EASE, delay: Math.min(index, 6) * 0.05 }}
                  className="relative grid md:grid-cols-2 gap-8 items-start pl-16 md:pl-0"
                  onMouseEnter={() => setHoveredId(exp.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Mobile node */}
                  <div className="block md:hidden absolute left-0 top-4">
                    <motion.div
                      className="relative"
                      animate={{ scale: isHovered || isSelected ? 1.12 : 1 }}
                    >
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${exp.gradient} p-0.5`}>
                        <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[var(--accent-primary)]" />
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 rounded-full blur-lg opacity-40"
                        style={{ background: `radial-gradient(circle, ${exp.color}, transparent)` }}
                      />
                    </motion.div>
                  </div>

                  {/*
                    Card placement.
                    There used to be a trailing empty <div> here "for grid
                    balance". It was not balancing anything: for right-hand
                    items the card is explicitly placed in column 2, so
                    auto-placement pushed that filler onto a SECOND row. The
                    explicit column start is the whole mechanism — no filler
                    needed, and nothing spills onto an extra row.
                    (It also carried `md:direction-ltr`, which is not a Tailwind
                    class and compiled to nothing.)
                  */}
                  <motion.div
                    className={`${isEven ? "md:pr-12" : "md:pl-12 md:col-start-2"} md:row-start-1 w-full`}
                  >
                    <div
                      className={`bg-[var(--glass-bg)] backdrop-blur-xl border-2 ${
                        isHovered || isSelected ? "border-[var(--accent-primary)]/50" : "border-[var(--glass-border)]"
                      } rounded-2xl p-6 md:p-8 transition-all duration-500 cursor-pointer group relative overflow-hidden`}
                      onClick={() => setSelectedId(isSelected ? null : exp.id)}
                    >
                      {/* Hover wash */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at ${isEven ? "right" : "left"} center, ${exp.color}15 0%, transparent 70%)`,
                        }}
                      />

                      {/* Year */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${exp.gradient} rounded-full mb-4 relative z-10`}>
                        <Calendar className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold text-white">{exp.year}</span>
                      </div>

                      {/* Role & company */}
                      <div className="relative z-10 mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                          {text.title}
                        </h3>
                        <div className="flex items-center gap-4 text-[var(--text-secondary)] flex-wrap">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Building2 className="w-4 h-4 flex-shrink-0" />
                            {exp.company}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            {text.location}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] mt-2">
                          {text.period} · {text.type}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-[var(--text-secondary)] mb-4 leading-relaxed relative z-10">
                        {text.description}
                      </p>

                      {/* Achievements */}
                      <motion.div
                        initial={false}
                        animate={{ height: isSelected ? "auto" : 0, opacity: isSelected ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden relative z-10"
                      >
                        <div className="space-y-2 mb-4 pt-4 border-t border-[var(--border-color)]">
                          {text.achievements.map((achievement, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: isSelected ? 1 : 0, x: isSelected ? 0 : -20 }}
                              transition={{ delay: idx * 0.06 }}
                              className="flex items-start gap-2"
                            >
                              <Award className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-[var(--text-secondary)]">{achievement}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Tech */}
                      <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                        {exp.tech.slice(0, isSelected ? exp.tech.length : 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-full text-xs text-[var(--text-secondary)]"
                          >
                            {tech}
                          </span>
                        ))}
                        {!isSelected && exp.tech.length > 3 && (
                          <span className="px-3 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-full text-xs text-[var(--text-muted)]">
                            +{exp.tech.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Expand */}
                      <button
                        type="button"
                        className="text-sm font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-hover)] flex items-center gap-1 transition-colors relative z-10"
                        aria-expanded={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(isSelected ? null : exp.id);
                        }}
                      >
                        {isSelected
                          ? L("Show less", "Minder tonen", "أقل", "Ver menos")
                          : L("Show more", "Meer tonen", "المزيد", "Ver más")}
                        <motion.div animate={{ rotate: isSelected ? 90 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      </button>
                    </div>
                  </motion.div>

                  {/* Desktop node */}
                  <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2">
                    <motion.div
                      className="relative"
                      animate={{ scale: isHovered || isSelected ? 1.15 : 1 }}
                    >
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${exp.gradient} p-1`}>
                        <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                          <Icon className="w-7 h-7 text-[var(--accent-primary)]" />
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 rounded-full blur-xl opacity-40"
                        style={{ background: `radial-gradient(circle, ${exp.color}, transparent)` }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: DURATION, ease: EASE, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ delay: Math.min(index, 6) * 0.05 }}
                className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl p-4 md:p-6 text-center hover:border-[var(--accent-primary)]/50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-[var(--accent-primary)]/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent-primary)]" />
                </div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent mb-1 md:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-[var(--text-secondary)]">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
