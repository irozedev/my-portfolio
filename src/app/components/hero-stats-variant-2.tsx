import { motion } from "motion/react";
import { Code, CheckCircle2, Star } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

export function HeroStatsVariant2() {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Code,
      value: "5+",
      label: t("hero.yearsExperience"),
      variable: "const experience",
      color: "#00d9ff",
      lineNumber: 1,
    },
    {
      icon: CheckCircle2,
      value: "50+",
      label: t("hero.projectsCompleted"),
      variable: "const projects",
      color: "#22c55e",
      lineNumber: 2,
    },
    {
      icon: Star,
      value: "100%",
      label: t("hero.happyClients"),
      variable: "const satisfaction",
      color: "#f59e0b",
      lineNumber: 3,
    },
  ];

  return (
    <motion.div
      className="pt-4 sm:pt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Code Editor Style Container */}
      <div className="bg-[#0a0a0a]/90 backdrop-blur-sm border border-[var(--border-color)] rounded-xl overflow-hidden">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono ml-2">
              developer.stats.ts
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Active</span>
          </div>
        </div>

        {/* Code Lines */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Line Number */}
                <span className="text-xs text-[var(--text-muted)] font-mono pt-1 select-none w-6 text-right">
                  {stat.lineNumber}
                </span>

                {/* Code Content */}
                <div className="flex-1 p-3 sm:p-4 bg-[var(--bg-secondary)]/30 border border-[var(--border-color)] rounded-lg hover:border-[#00d9ff]/50 transition-all duration-300 group-hover:bg-[var(--bg-secondary)]/50">
                  {/* Variable Declaration */}
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs sm:text-sm font-mono">
                    <span className="text-purple-400">const</span>
                    <span className="text-blue-400">{stat.variable.split(' ')[1]}</span>
                    <span className="text-[var(--text-muted)]">=</span>
                    <span className="text-orange-400">{`{`}</span>
                  </div>

                  {/* Value with Icon */}
                  <div className="flex items-center gap-3 pl-4 sm:pl-6">
                    <stat.icon className="w-5 h-5 flex-shrink-0" style={{ color: stat.color }} />
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-sm text-green-400 font-mono">value:</span>
                      <span
                        className="text-2xl sm:text-3xl font-black font-mono"
                        style={{ color: stat.color }}
                      >
                        "{stat.value}"
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="flex items-baseline gap-2 pl-4 sm:pl-6 mt-1">
                    <span className="text-sm text-green-400 font-mono">label:</span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      "{stat.label}"
                    </span>
                  </div>

                  {/* Closing Brace */}
                  <div className="mt-2 text-xs sm:text-sm font-mono">
                    <span className="text-orange-400">{`}`}</span>
                    <span className="text-[var(--text-muted)]">;</span>
                  </div>

                  {/* Hover Glow */}
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${stat.color}08 0%, transparent 70%)`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer - Export Statement */}
        <div className="px-4 py-2 bg-[var(--bg-secondary)]/30 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--text-muted)] font-mono select-none">4</span>
            <span className="text-xs text-purple-400 font-mono">export default</span>
            <span className="text-xs text-blue-400 font-mono">developerStats</span>
            <span className="text-xs text-[var(--text-muted)] font-mono">;</span>
          </div>
        </div>
      </div>

      {/* Bottom Comment */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-3 text-center"
      >
        <span className="text-[10px] text-[var(--text-muted)] font-mono">
          // TypeScript | ESLint: No issues found ✓
        </span>
      </motion.div>
    </motion.div>
  );
}
