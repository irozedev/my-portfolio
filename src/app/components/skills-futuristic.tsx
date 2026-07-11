import { motion, AnimatePresence } from "motion/react";
import { Code2, Database, Zap, Box, Cpu, Terminal, Layers, GitBranch, Globe } from "lucide-react";
import { useState } from "react";

interface Skill {
  name: string;
  icon: typeof Code2;
  category: string;
  level: number;
  color: string;
  glow: string;
  years: string;
}

const skills: Skill[] = [
  // Frontend
  { name: "React", icon: Code2, category: "Frontend", level: 95, color: "#00d9ff", glow: "shadow-[0_0_30px_rgba(0,217,255,0.6)]", years: "5+ yrs" },
  { name: "Vue.js", icon: Layers, category: "Frontend", level: 90, color: "#42b883", glow: "shadow-[0_0_30px_rgba(66,184,131,0.6)]", years: "3+ yrs" },
  { name: "TypeScript", icon: Terminal, category: "Frontend", level: 92, color: "#3178c6", glow: "shadow-[0_0_30px_rgba(49,120,198,0.6)]", years: "4+ yrs" },
  { name: "Next.js", icon: Box, category: "Frontend", level: 88, color: "#ffffff", glow: "shadow-[0_0_30px_rgba(255,255,255,0.4)]", years: "3+ yrs" },
  
  // Backend
  { name: "Node.js", icon: Cpu, category: "Backend", level: 85, color: "#68a063", glow: "shadow-[0_0_30px_rgba(104,160,99,0.6)]", years: "4+ yrs" },
  { name: "Knockout.js", icon: Database, category: "Frontend", level: 80, color: "#c73635", glow: "shadow-[0_0_30px_rgba(199,54,53,0.6)]", years: "3+ yrs" },
  { name: "PHP", icon: Terminal, category: "Backend", level: 75, color: "#8993be", glow: "shadow-[0_0_30px_rgba(137,147,190,0.6)]", years: "5+ yrs" },
  
  // Tools & Others
  { name: "Git", icon: GitBranch, category: "Tools", level: 95, color: "#f05032", glow: "shadow-[0_0_30px_rgba(240,80,50,0.6)]", years: "8+ yrs" },
  { name: "Docker", icon: Box, category: "Tools", level: 78, color: "#2496ed", glow: "shadow-[0_0_30px_rgba(36,150,237,0.6)]", years: "2+ yrs" },
  { name: "Magento 2", icon: Globe, category: "E-commerce", level: 82, color: "#ee672f", glow: "shadow-[0_0_30px_rgba(238,103,47,0.6)]", years: "4+ yrs" },
];

const categories = ["All", "Frontend", "Backend", "Tools", "E-commerce"];

export function SkillsFuturistic() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const filteredSkills = selectedCategory === "All" 
    ? skills 
    : skills.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter - Futuristic Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`relative px-4 py-2 font-mono text-xs font-bold rounded-lg border-2 transition-all overflow-hidden ${
              selectedCategory === category
                ? 'border-[var(--accent-primary)] text-black bg-[var(--accent-primary)] shadow-[0_0_30px_rgba(0,217,255,0.5)]'
                : 'border-[var(--glass-border)] text-[var(--text-muted)] bg-[var(--glass-bg)] hover:border-[var(--accent-primary)]/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Scanline effect for active */}
            {selectedCategory === category && (
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="h-full w-full" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
                }} />
              </div>
            )}
            <span className="relative z-10">{category.toUpperCase()}</span>
          </motion.button>
        ))}
      </div>

      {/* Skills Grid - Hexagon Layout */}
      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, index) => {
            const Icon = skill.icon;
            const isHovered = hoveredSkill === skill.name;
            
            return (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.05
                }}
                onHoverStart={() => setHoveredSkill(skill.name)}
                onHoverEnd={() => setHoveredSkill(null)}
                className="relative group"
              >
                {/* Skill Card */}
                <div className={`relative h-32 bg-[var(--glass-bg)] backdrop-blur-xl border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                  isHovered 
                    ? `border-[${skill.color}] ${skill.glow}` 
                    : 'border-[var(--glass-border)]'
                }`}>
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    style={{
                      background: `linear-gradient(135deg, ${skill.color}15 0%, transparent 100%)`
                    }}
                  />

                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ borderColor: skill.color }}
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ borderColor: skill.color }}
                  />

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-3 z-10">
                    {/* Icon with glow */}
                    <motion.div
                      className="relative mb-2"
                      animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    >
                      <Icon className="w-8 h-8" style={{ color: skill.color }} />
                      {isHovered && (
                        <motion.div
                          className="absolute inset-0 blur-xl opacity-60"
                          style={{ backgroundColor: skill.color }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.6 }}
                        />
                      )}
                    </motion.div>

                    {/* Name */}
                    <h4 className="text-xs font-mono font-bold text-[var(--text-primary)] text-center mb-1">
                      {skill.name}
                    </h4>

                    {/* Years */}
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">
                      {skill.years}
                    </p>
                  </div>

                  {/* Progress Bar - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--bg-tertiary)]">
                    <motion.div
                      className="h-full"
                      style={{ backgroundColor: skill.color }}
                      initial={{ width: "0%" }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.05 }}
                    />
                  </div>

                  {/* Level Badge - Top Right */}
                  <motion.div
                    className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                    style={{ 
                      backgroundColor: `${skill.color}20`,
                      color: skill.color,
                      border: `1px solid ${skill.color}40`
                    }}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                  >
                    {skill.level}%
                  </motion.div>

                  {/* Scanline effect on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        initial={{ y: '-100%' }}
                        animate={{ y: '100%' }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        style={{
                          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)'
                        }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Category Tag - Bottom */}
                <motion.div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[var(--bg-primary)] border border-[var(--glass-border)] rounded-full text-[9px] font-mono font-bold text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                  initial={{ y: -5 }}
                  whileInView={{ y: 0 }}
                >
                  {skill.category}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8"
      >
        {[
          { label: "Technologies", value: skills.length, color: "#00d9ff" },
          { label: "Avg Expertise", value: `${Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length)}%`, color: "#22c55e" },
          { label: "Total Experience", value: "8+ yrs", color: "#a78bfa" },
          { label: "Categories", value: categories.length - 1, color: "#f59e0b" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative p-4 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-xl hover:border-[var(--accent-primary)]/50 transition-all group overflow-hidden"
          >
            {/* Hover gradient */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(135deg, ${stat.color}10 0%, transparent 100%)`
              }}
            />
            
            <div className="relative z-10 text-center">
              <p className="text-2xl font-mono font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
