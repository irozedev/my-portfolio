import { motion } from "motion/react";
import { Star, Globe } from "lucide-react";

const languages = [
  { name: "Ukrainian", level: "Native", stars: 5, color: "#0057B7", flag: "🇺🇦" },
  { name: "English", level: "Professional", stars: 4, color: "#012169", flag: "🇬🇧" },
  { name: "Dutch", level: "Intermediate", stars: 3, color: "#FF4F00", flag: "🇳🇱" },
  { name: "Spanish", level: "Elementary", stars: 2, color: "#AA151B", flag: "🇪🇸" },
];

export function LanguagesModern() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {languages.map((lang, index) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group relative bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-[var(--border-color)] rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-[#00d9ff]/50 transition-all duration-300 overflow-hidden"
          >
            {/* Glow Effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              style={{ background: `radial-gradient(circle at center, ${lang.color}20, transparent 70%)` }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                  <div
                    className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${lang.color}20` }}
                  >
                    <span className="text-xl sm:text-2xl">{lang.flag}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-[#00d9ff] transition-colors">
                      {lang.name}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)]">
                      {lang.level}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stars Display */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                  >
                    <Star
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < lang.stars
                          ? "fill-current"
                          : "fill-none"
                      } transition-all duration-300`}
                      style={{
                        color: i < lang.stars ? lang.color : "var(--text-muted)",
                        opacity: i < lang.stars ? 1 : 0.3,
                      }}
                    />
                  </motion.div>
                ))}
                <span className="ml-2 text-sm font-semibold" style={{ color: lang.color }}>
                  {lang.stars}/5
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}