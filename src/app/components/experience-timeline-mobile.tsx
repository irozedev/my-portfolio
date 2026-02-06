import { motion } from "motion/react";
import { Briefcase, MapPin, Calendar, Award, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useState } from "react";

interface Experience {
  year: string;
  title: string;
  company: string;
  location: string;
  period: string;
  duration: string;
  achievement: string;
  impact: string;
  description: string[];
  color: string;
  gradient: string;
}

interface ExperienceTimelineMobileProps {
  experiences: Experience[];
}

export function ExperienceTimelineMobile({ experiences }: ExperienceTimelineMobileProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="relative md:hidden px-4">
      {/* Timeline Line - Improved positioning */}
      <div className="absolute left-4 top-6 bottom-6 w-1 bg-gradient-to-b from-[#00d9ff]/30 via-purple-500/30 to-pink-500/30 rounded-full" />
      <div className="absolute left-4 top-6 bottom-6 w-1">
        <div className="w-full h-full bg-gradient-to-b from-[#00d9ff] via-purple-500 to-pink-500 rounded-full animate-pulse" 
             style={{ opacity: 0.4 }} 
        />
      </div>

      <div className="space-y-6">
        {experiences.map((exp, index) => {
          const isExpanded = expanded === index;
          
          return (
            <motion.div
              key={index}
              className="relative pl-16"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Timeline Dot - Improved */}
              <motion.div
                className="absolute left-0 top-8 w-9 h-9 rounded-full z-10 flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${exp.color}, ${exp.color}cc)`,
                  boxShadow: `0 0 25px ${exp.color}aa, 0 0 40px ${exp.color}66`,
                }}
                whileInView={{ scale: [0, 1.3, 1] }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-white"
                  animate={{
                    scale: isExpanded ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isExpanded ? Infinity : 0,
                    repeatType: "reverse",
                  }}
                />
              </motion.div>

              {/* Connecting Line to Card */}
              <div 
                className="absolute left-9 top-9 w-7 h-0.5 rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${exp.color}aa, transparent)`,
                }}
              />

              {/* Year Badge - Repositioned */}
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${exp.color}, ${exp.color}dd)`,
                  color: '#fff',
                  boxShadow: `0 4px 15px ${exp.color}66`,
                }}
                whileInView={{ x: [20, 0], opacity: [0, 1] }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Calendar className="w-3 h-3" />
                {exp.year}
              </motion.div>

              {/* Card */}
              <motion.div
                className={`bg-[var(--card-bg)] backdrop-blur-sm border rounded-2xl p-5 transition-all duration-300 ${
                  isExpanded ? 'shadow-[0_0_30px_rgba(0,217,255,0.2)] border-[var(--accent-primary)]' : 'border-[var(--card-border)]'
                }`}
                style={{ 
                  borderColor: isExpanded ? `${exp.color}88` : undefined,
                  background: isExpanded ? `linear-gradient(135deg, ${exp.color}08, var(--card-bg))` : undefined,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExpanded(isExpanded ? null : index)}
              >
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 leading-tight">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                    <Briefcase className="w-4 h-4 flex-shrink-0" style={{ color: exp.color }} />
                    <span className="font-medium truncate">{exp.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] flex-wrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{exp.location}</span>
                    </div>
                    <span className="text-[var(--text-muted)]">•</span>
                    <span>{exp.duration}</span>
                  </div>
                </div>

                {/* Achievement Badge */}
                <div 
                  className="flex items-start gap-2 mb-3 px-3 py-2.5 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${exp.color}15, ${exp.color}08)`,
                    border: `1px solid ${exp.color}30`,
                  }}
                >
                  <Award className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: exp.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[var(--text-primary)] block">
                      {exp.achievement}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {exp.impact}
                    </span>
                  </div>
                </div>

                {/* Expand Button */}
                <button
                  className="flex items-center gap-2 text-sm font-medium mt-3 group transition-all"
                  style={{ color: exp.color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(isExpanded ? null : index);
                  }}
                >
                  <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </button>

                {/* Expanded Content */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-[var(--card-border)]">
                    <ul className="space-y-2.5">
                      {exp.description.map((item, idx) => (
                        <motion.li 
                          key={idx}
                          className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                            style={{ 
                              backgroundColor: exp.color,
                              boxShadow: `0 0 8px ${exp.color}aa`,
                            }}
                          />
                          <span className="flex-1">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}