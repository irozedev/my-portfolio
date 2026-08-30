import { Award, CheckCircle2, Users, TrendingUp, Star, Zap, Code2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/language-context";
import { useViewMode } from "../contexts/view-mode-context";
import { useReveal } from "../lib/use-reveal";

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
  index: number;
}

function StatCard({ icon: Icon, value, label, color, index }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const timer = setTimeout(() => {
      setDisplayValue(value);
      setHasAnimated(true);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [value, index, hasAnimated]);

  /* This row renders before any scroll, so it cannot import motion without
     pinning that chunk to the critical path. Same reveal, done in CSS. */
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-shown={shown}
      className="reveal relative group"
      style={{ transitionDelay: `${Math.min(index, 6) * 40}ms` }}
    >
      {/* Card */}
      <div className="relative bg-[var(--bg-secondary)]/40 backdrop-blur-sm border border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 rounded-xl p-3 md:p-4 overflow-hidden transition-all duration-300">
        
        {/* Subtle accent line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Icon */}
          <div className="mb-2">
            <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color }} />
          </div>

          {/* Value - Terminal style */}
          <div className="mb-1">
            <span 
              className="text-xl md:text-2xl font-mono font-bold tracking-tight"
              style={{ color }}
            >
              {displayValue}
            </span>
          </div>

          {/* Label */}
          <div className="text-[10px] md:text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
            {label}
          </div>
        </div>

        {/* Hover effect - minimal */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
}

export function StatsAirport() {
  const { language, t } = useLanguage();
  const { isClientMode } = useViewMode();

  const stats = [
    {
      icon: Code2,
      value: "6",
      label: 
             language === 'nl' ? 'Actief' : 
             language === 'ar' ? 'نشط' :
             language === 'es' ? 'Activos' :
             'Active',
      color: "#00d9ff",
    },
    {
      icon: Star,
      value: "99%",
      label: 
             language === 'nl' ? 'Rating' : 
             language === 'ar' ? 'التقييم' :
             language === 'es' ? 'Rating' :
             'Rating',
      color: "#ffd700",
    },
    {
      icon: Zap,
      value: "24/7",
      label: 
             language === 'nl' ? 'Online' : 
             language === 'ar' ? 'متصل' :
             language === 'es' ? 'En Línea' :
             'Online',
      color: "#00d9ff",
    },
    {
      icon: Award,
      value: `8+`,
      label: t("hero.yearsExperience") || "Years",
      color: "#FFD700",
    },
    {
      icon: CheckCircle2,
      value: `3`,
      label: 
             language === 'nl' ? 'Merken' :
             language === 'ar' ? 'علامات' :
             language === 'es' ? 'Marcas' :
             'Brands',
      color: "#00d9ff",
    },
    {
      icon: Users,
      value: `3`,
      label: 
             language === 'nl' ? 'Talen' :
             language === 'ar' ? 'لغات' :
             language === 'es' ? 'Idiomas' :
             'Languages',
      color: "#9333ea",
    },
    {
      icon: TrendingUp,
      value: `AI`,
      label: 
             language === 'nl' ? 'sinds 2022' :
             language === 'ar' ? 'منذ 2022' :
             language === 'es' ? 'desde 2022' :
             'since 2022',
      color: "#10b981",
    },
  ];

  return (
    <section className="py-6 md:py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Developer-Style Stats Grid - FULL WIDTH */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              /* Seven tiles in gold, violet, emerald and cyan is a row of
                 confetti: every tile shouts, so none of them lands. In client
                 mode they all take the accent and the numbers carry the
                 difference. The CV keeps its colours — it was deliberately
                 left out of the redesign. */
              color={isClientMode ? "var(--accent-primary)" : stat.color}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}