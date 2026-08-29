import { motion } from "motion/react";
import {
  Workflow,
  MessageSquare,
  FileText,
  CreditCard,
  Code2,
  RefreshCw,
  Rocket,
  Sunrise,
  MessageCircle,
  Target,
  CalendarCheck,
} from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { VIEWPORT, DURATION, EASE } from "../lib/motion";

/**
 * "How I work" — process + honest, part-time timelines.
 * Self-contained translations (en/uk/nl/ar/es) so the huge shared
 * translations file doesn't need touching.
 */
export function HowIWork() {
  const { language } = useLanguage();
  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  const kicker = L("How I work", "Hoe ik werk", "كيف أعمل", "Cómo trabajo");
  const title = L(
    "Clear process, honest timelines",
    "Helder proces, eerlijke planning",
    "عملية واضحة ومواعيد صادقة",
    "Proceso claro, plazos honestos",
  );
  const subtitle = L(
    "I run this alongside a main job, so I build every morning — steady daily progress instead of empty promises.",
    "Ik doe dit naast een hoofdbaan, dus ik bouw elke ochtend — dagelijkse voortgang in plaats van loze beloftes.",
    "أعمل على هذا إلى جانب وظيفة أساسية، لذا أبني كل صباح — تقدّم يومي ثابت بدل الوعود الفارغة.",
    "Lo compagino con un trabajo principal, así que avanzo cada mañana — progreso diario en vez de promesas vacías.",
  );

  const steps = [
    {
      icon: MessageSquare,
      n: "01",
      t: L("Intro — free", "Kennismaking — gratis", "تعارف — مجانًا", "Introducción — gratis"),
      d: L(
        "You tell me what you need. A short chat to understand the goal.",
        "Je vertelt wat je nodig hebt. Kort gesprek om het doel te snappen.",
        "تخبرني بما تحتاجه. محادثة قصيرة لفهم الهدف.",
        "Me cuentas qué necesitas. Una charla breve para entender el objetivo.",
      ),
    },
    {
      icon: FileText,
      n: "02",
      t: L("Quote & timeline", "Offerte & planning", "عرض السعر والمدة", "Presupuesto y plazo"),
      d: L(
        "Fixed price or hourly estimate — you see the total and deadline before we start.",
        "Vaste prijs of uurschatting — je ziet totaal en deadline vóór de start.",
        "سعر ثابت أو تقدير بالساعة — ترى المبلغ والموعد قبل أن نبدأ.",
        "Precio fijo o estimación por hora — ves el total y el plazo antes de empezar.",
      ),
    },
    {
      icon: CreditCard,
      n: "03",
      t: L("Deposit 30–50%", "Aanbetaling 30–50%", "دفعة أولى 30–50%", "Anticipo 30–50%"),
      d: L(
        "Rest on delivery. Small jobs — paid on completion.",
        "Rest bij oplevering. Kleine klussen — betaling achteraf.",
        "الباقي عند التسليم. المهام الصغيرة — الدفع بعد الإنجاز.",
        "El resto a la entrega. Trabajos pequeños — pago al finalizar.",
      ),
    },
    {
      icon: Code2,
      n: "04",
      t: L("Build with preview", "Bouwen met preview", "بناء مع معاينة", "Desarrollo con vista previa"),
      d: L(
        "Live link so you follow progress and adjust along the way, not at the end.",
        "Live link zodat je meekijkt en onderweg bijstuurt, niet pas op het einde.",
        "رابط مباشر لمتابعة التقدّم والتعديل أثناء العمل، لا في النهاية.",
        "Enlace en vivo para seguir el avance y ajustar sobre la marcha, no al final.",
      ),
    },
    {
      icon: RefreshCw,
      n: "05",
      t: L("Revisions included", "Revisies inbegrepen", "التعديلات مشمولة", "Revisiones incluidas"),
      d: L(
        "1–2 rounds of changes in the price. Usually that's all it takes.",
        "1–2 rondes wijzigingen in de prijs. Meestal is dat genoeg.",
        "جولتان من التعديلات ضمن السعر. عادةً هذا يكفي.",
        "1–2 rondas de cambios en el precio. Normalmente es suficiente.",
      ),
    },
    {
      icon: Rocket,
      n: "06",
      t: L("Launch & handover", "Lancering & overdracht", "الإطلاق والتسليم", "Lanzamiento y entrega"),
      d: L(
        "It's all yours — code, access, domains. Optional aftercare available.",
        "Alles is van jou — code, toegang, domeinen. Optionele nazorg mogelijk.",
        "كل شيء ملكك — الكود والوصول والنطاقات. دعم اختياري بعد الإطلاق.",
        "Todo es tuyo — código, accesos, dominios. Soporte posterior opcional.",
      ),
    },
  ];

  const availability = [
    {
      icon: Sunrise,
      t: L("Mornings · CET", "Ochtenden · CET", "الصباح · CET", "Mañanas · CET"),
      d: L("06:00–12:00, steady daily progress", "06:00–12:00, dagelijks vooruit", "06:00–12:00، تقدّم يومي ثابت", "06:00–12:00, avance diario"),
    },
    {
      icon: MessageCircle,
      t: L("Replies within the day", "Reactie binnen de dag", "الرد خلال اليوم", "Respuesta el mismo día"),
      d: L("No ghosting after a smart-shift", "Geen ghosting na een shift", "بلا اختفاء بعد الدوام", "Sin desaparecer tras el turno"),
    },
    {
      icon: Target,
      t: L("1–2 projects at a time", "1–2 projecten tegelijk", "مشروعان كحدّ أقصى", "1–2 proyectos a la vez"),
      d: L("Your project isn't in a queue", "Jouw project staat niet in de rij", "مشروعك ليس في طابور", "Tu proyecto no hace cola"),
    },
    {
      icon: CalendarCheck,
      t: L("Realistic deadlines", "Realistische deadlines", "مواعيد واقعية", "Plazos realistas"),
      d: L("Planned around mornings from day one", "Vanaf dag één op ochtenden gepland", "مخطّطة وفق الصباح منذ البداية", "Planificados según las mañanas"),
    },
  ];

  const tableHead = {
    what: L("What you need", "Wat je nodig hebt", "ما تحتاجه", "Qué necesitas"),
    price: L("Realistic total", "Realistisch totaal", "الإجمالي الواقعي", "Total realista"),
    time: L("Timeframe", "Doorlooptijd", "المدة", "Plazo"),
  };

  const rows = [
    {
      what: L("Landing page", "Landingspagina", "صفحة هبوط", "Landing page"),
      price: "€950 – €1 800",
      time: L("1–1.5 weeks", "1–1.5 week", "1–1.5 أسبوع", "1–1.5 semanas"),
    },
    {
      what: L("Website (4–6 pages)", "Website (4–6 pagina's)", "موقع (4–6 صفحات)", "Web (4–6 páginas)"),
      price: "€2 200 – €3 500",
      time: L("2.5–3.5 weeks", "2.5–3.5 week", "2.5–3.5 أسبوع", "2.5–3.5 semanas"),
    },
    {
      what: L("WhatsApp bot", "WhatsApp-bot", "بوت واتساب", "Bot de WhatsApp"),
      price: L("from €500", "vanaf €500", "من €500", "desde €500"),
      time: L("~1 week", "~1 week", "~أسبوع", "~1 semana"),
    },
    {
      what: L("Automation / integration", "Automatisering / integratie", "أتمتة / تكامل", "Automatización / integración"),
      price: "€65/h (~€325–650)",
      time: L("3–5 mornings", "3–5 ochtenden", "3–5 صباحات", "3–5 mañanas"),
    },
    {
      what: L("Web app / dashboard (MVP)", "Webapp / dashboard (MVP)", "تطبيق ويب / لوحة (MVP)", "Web app / panel (MVP)"),
      price: "€75/h (~€3 000–6 000)",
      time: L("4–6 weeks", "4–6 weken", "4–6 أسابيع", "4–6 semanas"),
    },
    {
      what: L("Online store", "Webshop", "متجر إلكتروني", "Tienda online"),
      price: L("from €1 800", "vanaf €1 800", "من €1 800", "desde €1 800"),
      time: L("3–5 weeks", "3–5 weken", "3–5 أسابيع", "3–5 semanas"),
    },
  ];

  const billingNote = L(
    "Fixed price for typical jobs · hourly for flexible work · no VAT (small-business scheme)",
    "Vaste prijs voor standaardklussen · uurtarief voor flexibel werk · geen btw (vrijstellingsregeling)",
    "سعر ثابت للمهام النمطية · بالساعة للعمل المرن · بدون ضريبة (نظام المنشآت الصغيرة)",
    "Precio fijo para trabajos típicos · por hora para lo flexible · sin IVA (régimen de pequeñas empresas)",
  );

  return (
    <section
      id="how-i-work"
      className="relative py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[var(--bg-primary)] overflow-hidden scroll-mt-24 md:scroll-mt-28"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--accent-primary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: DURATION, ease: EASE }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--accent-primary)]/10 to-purple-500/10 border border-[var(--accent-primary)]/30 rounded-full mb-6">
            <Workflow className="w-5 h-5 text-[var(--accent-primary)]" />
            <span className="text-sm font-medium text-[var(--accent-primary)]">{kicker}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Availability strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: DURATION, ease: EASE }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16"
        >
          {availability.map((a, i) => {
            const Icon = a.icon;
            return (
              <div
                key={i}
                className="flex flex-col gap-2 p-4 md:p-5 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl"
              >
                <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                <span className="text-sm md:text-base font-semibold text-[var(--text-primary)] leading-tight">{a.t}</span>
                <span className="text-xs text-[var(--text-muted)] leading-snug">{a.d}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Steps */}
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12 md:mb-16">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: DURATION, ease: EASE, delay: Math.min(i, 6) * 0.04 }}
                className="group relative p-6 bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-3xl hover:border-[var(--accent-primary)]/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-purple-500/20 border border-[var(--accent-primary)]/30 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <span className="text-2xl font-black font-mono text-[var(--text-muted)]/40 group-hover:text-[var(--accent-primary)]/40 transition-colors">
                    {s.n}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{s.t}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{s.d}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Realistic totals table */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: DURATION, ease: EASE }}
          className="bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-3xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="px-5 md:px-6 py-4 text-xs md:text-sm font-mono uppercase tracking-wider text-[var(--text-muted)]">{tableHead.what}</th>
                  <th className="px-5 md:px-6 py-4 text-xs md:text-sm font-mono uppercase tracking-wider text-[var(--accent-primary)]">{tableHead.price}</th>
                  <th className="px-5 md:px-6 py-4 text-xs md:text-sm font-mono uppercase tracking-wider text-[var(--text-muted)]">{tableHead.time}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)]/30 transition-colors">
                    <td className="px-5 md:px-6 py-4 text-sm md:text-base font-medium text-[var(--text-primary)]">{r.what}</td>
                    <td className="px-5 md:px-6 py-4 text-sm md:text-base font-bold text-[var(--accent-primary)] whitespace-nowrap">{r.price}</td>
                    <td className="px-5 md:px-6 py-4 text-sm md:text-base text-[var(--text-secondary)] whitespace-nowrap">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 md:px-6 py-4 bg-[var(--bg-secondary)]/30 border-t border-[var(--border-color)]">
            <p className="text-xs md:text-sm text-[var(--text-muted)]">{billingNote}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
