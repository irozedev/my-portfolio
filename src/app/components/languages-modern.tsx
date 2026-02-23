import { motion } from "motion/react";
import { Star, Globe, Award, TrendingUp } from "lucide-react";

const languages = [
  { name: "Ukrainian", level: "Native", stars: 5, color: "#0057B7", flag: "🇺🇦", description: "Mother tongue" },
  { name: "English", level: "Professional", stars: 4, color: "#012169", flag: "🇬🇧", description: "C1 Level" },
  { name: "Dutch", level: "Elementary", stars: 2, color: "#FF4F00", flag: "🇳🇱", description: "A2 Level" },
  { name: "Spanish", level: "Elementary", stars: 2, color: "#AA151B", flag: "🇪🇸", description: "A2 Level" },
];

export function LanguagesModern() {
  return (
    <div className="w-full space-y-8">
      {/* Languages Grid - Enhanced */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {languages.map((lang, index) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="group relative bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-2xl p-5 sm:p-6 hover:border-[var(--accent-primary)]/60 transition-all duration-300 overflow-hidden"
          >
            {/* Background Glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `radial-gradient(circle at top left, ${lang.color}15, transparent 60%)` }}
            />

            {/* Corner Brackets - Technical Style */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ borderColor: lang.color }}
            />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ borderColor: lang.color }}
            />

            {/* Scanlines Effect on Hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)'
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  {/* Flag Icon with Glow */}
                  <motion.div
                    className="relative p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${lang.color}20` }}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-2xl sm:text-3xl">{lang.flag}</span>
                    
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity"
                      style={{ backgroundColor: lang.color }}
                    />
                  </motion.div>

                  <div className="flex-1">
                    <h4 className="font-mono font-bold text-base sm:text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-1">
                      {lang.name}
                    </h4>
                    <p className="text-xs sm:text-sm font-medium" style={{ color: lang.color }}>
                      {lang.level}
                    </p>
                    <p className="text-[10px] sm:text-xs text-[var(--text-muted)] font-mono">
                      {lang.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stars Display - Enhanced */}
              <div className="flex items-center gap-1.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.1 + i * 0.08,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <Star
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        i < lang.stars
                          ? "fill-current"
                          : "fill-none"
                      } transition-all duration-300 group-hover:scale-110`}
                      style={{
                        color: i < lang.stars ? lang.color : "var(--text-muted)",
                        opacity: i < lang.stars ? 1 : 0.3,
                      }}
                    />
                  </motion.div>
                ))}
                <motion.span 
                  className="ml-2 text-sm sm:text-base font-mono font-bold"
                  style={{ color: lang.color }}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {lang.stars}/5
                </motion.span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: lang.color }}
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${(lang.stars / 5) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Footer - New Addition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-8"
      >
        {[
          { 
            label: "Languages", 
            value: languages.length, 
            color: "#00d9ff",
            icon: Globe
          },
          { 
            label: "Avg Proficiency", 
            value: `${Math.round((languages.reduce((sum, l) => sum + l.stars, 0) / languages.length) * 20)}%`, 
            color: "#22c55e",
            icon: TrendingUp
          },
          { 
            label: "Professional", 
            value: languages.filter(l => l.stars >= 4).length, 
            color: "#a78bfa",
            icon: Award
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="relative p-4 sm:p-5 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-xl hover:border-[var(--accent-primary)]/50 transition-all group overflow-hidden"
            >
              {/* Hover gradient */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}10 0%, transparent 100%)`
                }}
              />

              {/* Corner accent */}
              <div 
                className="absolute top-0 right-0 w-12 h-12 opacity-20"
                style={{
                  background: `radial-gradient(circle at top right, ${stat.color}, transparent 70%)`
                }}
              />
              
              <div className="relative z-10 flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </motion.div>
                
                <div className="flex-1">
                  <p className="text-xl sm:text-2xl font-mono font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
