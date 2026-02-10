import { motion } from "motion/react";
import { Code, CheckCircle2, Star, GitCommit, GitBranch } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

export function HeroStatsVariant3() {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Code,
      value: "5+",
      label: t("hero.yearsExperience"),
      commit: "feat: 5+ years of experience",
      hash: "a7f3e9b",
      color: "#00d9ff",
    },
    {
      icon: CheckCircle2,
      value: "50+",
      label: t("hero.projectsCompleted"),
      commit: "feat: 50+ projects delivered",
      hash: "b2c4d8a",
      color: "#22c55e",
    },
    {
      icon: Star,
      value: "100%",
      label: t("hero.happyClients"),
      commit: "feat: 100% client satisfaction",
      hash: "c9f1a2e",
      color: "#f59e0b",
    },
  ];

  return (
    <motion.div
      className="pt-4 sm:pt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Git Log Style */}
      <div className="space-y-2">
        {/* Branch Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)]/30 border border-[var(--border-color)] rounded-lg mb-4"
        >
          <GitBranch className="w-4 h-4 text-[#00d9ff]" />
          <span className="text-xs font-mono text-[var(--text-muted)]">
            On branch <span className="text-[#00d9ff] font-bold">main</span>
          </span>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-400 font-mono">Up to date</span>
          </div>
        </motion.div>

        {/* Commits */}
        <div className="space-y-2">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="group relative bg-[#0a0a0a]/80 backdrop-blur-sm border border-[var(--border-color)] rounded-lg overflow-hidden hover:border-[#00d9ff]/50 transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ x: 4 }}
            >
              <div className="p-3 sm:p-4">
                {/* Commit Header */}
                <div className="flex items-center gap-2 mb-2">
                  <GitCommit className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-xs font-mono text-[#00d9ff]">{stat.hash}</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    2 hours ago
                  </span>
                  <div className="ml-auto">
                    <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded font-mono">
                      +100
                    </span>
                  </div>
                </div>

                {/* Commit Message */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: `${stat.color}50` }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-mono text-[var(--text-primary)] mb-1">
                      {stat.commit}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] font-mono">
                      Author: Stepan Roze &lt;hello@roze.live&gt;
                    </p>
                  </div>
                </div>

                {/* Stats Display */}
                <div className="flex items-center gap-3 pl-4 pt-3 border-t border-[var(--border-color)]">
                  <stat.icon className="w-5 h-5 flex-shrink-0" style={{ color: stat.color }} />
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-3xl sm:text-4xl font-black font-mono"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      {stat.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, ${stat.color}08 0%, transparent 50%)`,
                }}
              />

              {/* Left Border on Hover */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: stat.color }}
                initial={{ scaleY: 0 }}
                whileHover={{ scaleY: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Git Status Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 px-3 py-2 bg-[var(--bg-secondary)]/30 border border-[var(--border-color)] rounded-lg"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              3 commits ahead of origin/main
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-green-400 font-mono">All tests passing</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">•</span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Build: #1247</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
