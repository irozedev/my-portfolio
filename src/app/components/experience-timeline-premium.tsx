import { motion } from "motion/react";
import { Briefcase, MapPin, Calendar, Award, ChevronRight, Code2, Rocket, Building2, Users, Target } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/language-context";

type Lang = (en: string, nl: string, ar: string, es: string) => string;

// Non-textual data only. Company names are proper nouns and stay as written;
// everything a visitor reads is built per-language in `experienceCopy`.
const experiences = [
  {
    id: 1,
    year: "2026",
    company: "Self-Employed",
    tech: ["Next.js 14", "TypeScript", "React", "Netlify Functions", "Supabase", "Telegram Bot API", "WayForPay", "GA4"],
    icon: Rocket,
    gradient: "from-cyan-500 via-blue-500 to-purple-500",
    color: "#00d9ff",
  },
  // Work outside the field, and it is here on purpose. Without it there is an
  // eighteen-month hole between E-Consulting and the freelance work, and a
  // reader fills a hole with the worst guess available. A named period reads
  // better than any of them. For a Benelux employer a permanent Belgian
  // contract also answers what they cannot ask out loud: right to work,
  // residence, and whether the candidate actually lives here.
  {
    id: 6,
    year: "2025",
    company: "Albron / Center Parcs",
    tech: [],
    icon: Briefcase,
    gradient: "from-slate-500 via-gray-500 to-zinc-500",
    color: "#94a3b8",
  },
  {
    id: 2,
    year: "2024",
    company: "E-Consulting",
    tech: ["JavaScript (ES6+)", "MS Dynamics 365 XRM", "Vue.js", "Canvas", "REST API"],
    icon: Code2,
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    color: "#a78bfa",
  },
  {
    id: 3,
    year: "2022",
    company: "Ronis BT",
    tech: ["Magento 1 & 2", "React", "Knockout.js", "jQuery", "SCSS / LESS", "JavaScript (ES6+)"],
    icon: Users,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    color: "#10b981",
  },
  {
    id: 4,
    year: "2015",
    company: "Web Studio & Freelance",
    tech: ["HTML5", "CSS3", "JavaScript", "jQuery", "Bootstrap", "PHP"],
    icon: Building2,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    color: "#f59e0b",
  },
  {
    id: 5,
    year: "2012",
    company: "V.N. Karazin Kharkiv National University",
    tech: ["Computer Science", "Algorithms", "Data Structures"],
    icon: Building2,
    gradient: "from-slate-500 via-gray-500 to-zinc-500",
    color: "#94a3b8",
  },
] as const;

function experienceCopy(L: Lang) {
  const remote = L("Remote", "Op afstand", "عن بُعد", "En remoto");
  const kharkiv = L("Kharkiv, Ukraine", "Charkov, Oekraïne", "خاركيف، أوكرانيا", "Járkov, Ucrania");
  const lommel = L("Lommel, Belgium", "Lommel, België", "لوميل، بلجيكا", "Lommel, Bélgica");
  const fullTime = L("Full-time", "Voltijds", "دوام كامل", "Jornada completa");

  return {
    1: {
      title: L("Freelance Web Developer", "Freelance webontwikkelaar", "مطوّر ويب مستقل", "Desarrollador web freelance"),
      period: L("2026 — present", "2026 — heden", "2026 — حتى الآن", "2026 — actualidad"),
      location: L("Belgium (remote)", "België (op afstand)", "بلجيكا (عن بُعد)", "Bélgica (en remoto)"),
      type: L("Freelance", "Freelance", "عمل حر", "Freelance"),
      description: L(
        "Designing, building and launching commercial web products end-to-end with an AI-assisted workflow. Delivered marinek.store — a Next.js 14 landing site for a fitness coaching program with three pricing tiers, verified card payments and automated one-time access delivery over Telegram.",
        "Commerciële webproducten van begin tot eind ontwerpen, bouwen en lanceren, met AI in de workflow. marinek.store opgeleverd — een Next.js 14-landingssite voor een fitnessprogramma met drie tarieven, geverifieerde kaartbetalingen en automatische eenmalige toegang via Telegram.",
        "أصمّم وأبني وأطلق منتجات ويب تجارية من البداية إلى النهاية بسير عمل مدعوم بالذكاء الاصطناعي. أنجزت marinek.store — موقع هبوط بـ Next.js 14 لبرنامج لياقة، بثلاث فئات أسعار ومدفوعات بطاقات موثَّقة وتسليم وصول تلقائي لمرة واحدة عبر تيليجرام.",
        "Diseño, construyo y lanzo productos web comerciales de principio a fin con un flujo asistido por IA. Entregué marinek.store — una landing en Next.js 14 para un programa de fitness con tres niveles de precio, pagos con tarjeta verificados y entrega automática de acceso de un solo uso por Telegram.",
      ),
      achievements: [
        L(
          "Launched marinek.store to production (Next.js 14) in July 2026",
          "marinek.store in juli 2026 in productie gebracht (Next.js 14)",
          "أطلقت marinek.store في الإنتاج (Next.js 14) في يوليو 2026",
          "Lancé marinek.store a producción (Next.js 14) en julio de 2026",
        ),
        L(
          "Rebuilt paid access: server-priced orders, signature-verified webhooks, single-use Telegram invites",
          "Betaalde toegang herbouwd: server-side geprijsde orders, webhooks met geverifieerde signature, eenmalige Telegram-invites",
          "أعدت بناء الوصول المدفوع: تسعير الطلبات على الخادم، وخطّافات موثَّقة التوقيع، ودعوات تيليجرام لمرة واحدة",
          "Reconstruí el acceso de pago: pedidos tarifados en servidor, webhooks con firma verificada, invitaciones de Telegram de un solo uso",
        ),
        L(
          "Replaced a shared invite link that let anyone join the paid channels without paying",
          "Een gedeelde invite-link vervangen waarmee iedereen zonder te betalen de betaalde kanalen in kon",
          "استبدلت رابط دعوة مشتركًا كان يُدخل أي شخص إلى القنوات المدفوعة دون دفع",
          "Sustituí un enlace de invitación compartido que dejaba entrar a cualquiera sin pagar",
        ),
        L(
          "Made the payment webhook idempotent against a four-day retry window; refunds revoke access automatically",
          "De betaal-webhook idempotent gemaakt tegen een retry-venster van vier dagen; terugbetalingen trekken toegang automatisch in",
          "جعلت خطّاف الدفع غير متأثر بإعادة المحاولة على مدى أربعة أيام؛ والاسترداد يبطل الوصول تلقائيًا",
          "Hice el webhook de pago idempotente frente a una ventana de reintentos de cuatro días; las devoluciones revocan el acceso automáticamente",
        ),
        L(
          "Built the serverless backend on Netlify Functions with Supabase, alongside a fully static Next.js export",
          "De serverless backend gebouwd op Netlify Functions met Supabase, naast een volledig statische Next.js-export",
          "بنيت الخلفية بلا خادم على Netlify Functions مع Supabase، جنبًا إلى جنب مع تصدير Next.js ثابت بالكامل",
          "Construí el backend serverless en Netlify Functions con Supabase, junto a una exportación de Next.js totalmente estática",
        ),
        L(
          "Owned the full cycle: requirements, design, build, launch and support",
          "De volledige cyclus in eigen hand: eisen, ontwerp, bouw, livegang en support",
          "توليت الدورة الكاملة: المتطلبات والتصميم والتنفيذ والإطلاق والدعم",
          "Asumí el ciclo completo: requisitos, diseño, desarrollo, lanzamiento y soporte",
        ),
      ],
    },
    // Deliberately kept short: this entry explains a period, it does not
    // compete for attention. One line of description, two facts, then back
    // down to the IT roles.
    6: {
      title: L(
        "Senior Kitchen Assistant",
        "Eerste keukenhulp",
        "مساعد مطبخ أول",
        "Ayudante de cocina sénior",
      ),
      period: L("Jun 2025 — present", "jun 2025 — heden", "يونيو 2025 — حتى الآن", "jun 2025 — actualidad"),
      location: lommel,
      type: fullTime,
      description: L(
        "Relocated to Belgium and took a permanent full-time role in hospitality while returning to web development in parallel.",
        "Verhuisd naar België en een vast voltijds contract in de horeca aangenomen, terwijl ik parallel terugkeerde naar webontwikkeling.",
        "انتقلت إلى بلجيكا والتحقت بعقد دائم بدوام كامل في قطاع الضيافة، مع العودة بالتوازي إلى تطوير الويب.",
        "Me mudé a Bélgica y asumí un contrato indefinido a tiempo completo en hostelería, mientras retomaba en paralelo el desarrollo web.",
      ),
      achievements: [
        L(
          "Permanent contract (onbepaalde duur) — settled and working in Belgium",
          "Vast contract van onbepaalde duur — gevestigd en werkzaam in België",
          "عقد دائم (onbepaalde duur) — مقيم وأعمل في بلجيكا",
          "Contrato indefinido (onbepaalde duur) — establecido y trabajando en Bélgica",
        ),
        L(
          "Daily work in a Dutch-speaking environment",
          "Dagelijks werk in een Nederlandstalige omgeving",
          "عمل يومي في بيئة ناطقة بالهولندية",
          "Trabajo diario en un entorno neerlandófono",
        ),
      ],
    },
    2: {
      title: L("Middle JavaScript Developer", "Middle JavaScript-ontwikkelaar", "مطوّر JavaScript متوسط", "Desarrollador JavaScript Middle"),
      period: L("Oct 2022 — Dec 2024", "okt 2022 — dec 2024", "أكتوبر 2022 — ديسمبر 2024", "oct 2022 — dic 2024"),
      location: `${remote}, ${L("Ukraine", "Oekraïne", "أوكرانيا", "Ucrania")}`,
      type: fullTime,
      description: L(
        "Built and customized CRM web resources for Oschadbank — Ukraine's state savings bank — on MS Dynamics 365 XRM in pure functional JavaScript. Developed a Vue.js electronic document-signing application for bank workflows and integrated REST APIs with back-end teams.",
        "CRM-webresources gebouwd en aangepast voor Oschadbank — de Oekraïense staatsspaarbank — op MS Dynamics 365 XRM in puur functioneel JavaScript. Een Vue.js-applicatie voor elektronisch ondertekenen van documenten ontwikkeld en REST API's geïntegreerd met back-endteams.",
        "بنيت وخصّصت موارد ويب لنظام CRM لبنك Oschadbank — بنك التوفير الحكومي في أوكرانيا — على MS Dynamics 365 XRM بجافاسكربت وظيفي خالص. طوّرت تطبيق توقيع مستندات إلكتروني بـ Vue.js لسير عمل البنك، وربطت واجهات REST مع فرق الخلفية.",
        "Construí y personalicé recursos web de CRM para Oschadbank — la caja de ahorros estatal de Ucrania — sobre MS Dynamics 365 XRM en JavaScript funcional puro. Desarrollé una aplicación Vue.js de firma electrónica de documentos e integré APIs REST con los equipos de back-end.",
      ),
      achievements: [
        L(
          "Developed CRM web resources for Oschadbank on MS Dynamics 365 XRM",
          "CRM-webresources ontwikkeld voor Oschadbank op MS Dynamics 365 XRM",
          "طوّرت موارد ويب لنظام CRM لبنك Oschadbank على MS Dynamics 365 XRM",
          "Desarrollé recursos web de CRM para Oschadbank en MS Dynamics 365 XRM",
        ),
        L(
          "Built a Vue.js document-signing app (async requests, canvas-based UI)",
          "Een Vue.js-app voor documentondertekening gebouwd (async requests, canvas-UI)",
          "بنيت تطبيق توقيع مستندات بـ Vue.js (طلبات غير متزامنة وواجهة على Canvas)",
          "Construí una app de firma de documentos en Vue.js (peticiones asíncronas, UI con canvas)",
        ),
        L(
          "Configured entity fields and integrated REST APIs with back-end teams",
          "Entiteitvelden geconfigureerd en REST API's geïntegreerd met back-endteams",
          "أعددت حقول الكيانات وربطت واجهات REST مع فرق الخلفية",
          "Configuré campos de entidades e integré APIs REST con los equipos de back-end",
        ),
        L(
          "Introduced GPT-based tooling into daily development (since 2022)",
          "GPT-tooling in de dagelijkse ontwikkeling geïntroduceerd (sinds 2022)",
          "أدخلت أدوات مبنية على GPT في التطوير اليومي (منذ 2022)",
          "Introduje herramientas basadas en GPT en el desarrollo diario (desde 2022)",
        ),
      ],
    },
    3: {
      title: L(
        "Front-End Developer (Junior → Middle)",
        "Front-end-ontwikkelaar (Junior → Middle)",
        "مطوّر واجهات (مبتدئ → متوسط)",
        "Desarrollador Front-End (Junior → Middle)",
      ),
      period: L("May 2019 — Sep 2022", "mei 2019 — sep 2022", "مايو 2019 — سبتمبر 2022", "may 2019 — sep 2022"),
      location: `${kharkiv} (${L("hybrid", "hybride", "هجين", "híbrido")})`,
      type: fullTime,
      description: L(
        "Core team member on childrensalon.com — one of the world's largest luxury children's fashion retailers — and vogacloset.com (MENA fashion marketplace). Rewrote the Product Detail Page front-end during a Magento 1.9 → custom Symfony re-platforming.",
        "Kernteamlid bij childrensalon.com — een van de grootste luxe kinderkledingretailers ter wereld — en vogacloset.com (MENA-fashionmarktplaats). De front-end van de productdetailpagina herschreven tijdens een re-platforming van Magento 1.9 naar custom Symfony.",
        "عضو في الفريق الأساسي لـ childrensalon.com — أحد أكبر متاجر أزياء الأطفال الفاخرة في العالم — وvogacloset.com (سوق أزياء في الشرق الأوسط وشمال أفريقيا). أعدت كتابة واجهة صفحة تفاصيل المنتج خلال الانتقال من Magento 1.9 إلى Symfony مخصّص.",
        "Miembro del equipo principal de childrensalon.com — uno de los mayores minoristas de moda infantil de lujo del mundo — y vogacloset.com (marketplace de moda MENA). Reescribí el front-end de la ficha de producto durante la migración de Magento 1.9 a Symfony a medida.",
      ),
      achievements: [
        L(
          "Migrated legacy jQuery to a modular vanilla JS architecture for the product page",
          "Legacy jQuery gemigreerd naar een modulaire vanilla JS-architectuur voor de productpagina",
          "نقلت jQuery القديم إلى بنية JavaScript صافية ومعيارية لصفحة المنتج",
          "Migré jQuery heredado a una arquitectura modular de JS puro para la ficha de producto",
        ),
        L(
          "Integrated payment providers (Stripe, Klarna) into checkout and order flows",
          "Betaalproviders (Stripe, Klarna) geïntegreerd in checkout- en orderflows",
          "دمجت مزوّدي الدفع (Stripe وKlarna) في مسارات الدفع والطلبات",
          "Integré proveedores de pago (Stripe, Klarna) en el checkout y el flujo de pedidos",
        ),
        L(
          "Built reusable components with Magento 1 & 2, React and Knockout.js",
          "Herbruikbare componenten gebouwd met Magento 1 & 2, React en Knockout.js",
          "بنيت مكوّنات قابلة لإعادة الاستخدام بـ Magento 1 و2 وReact وKnockout.js",
          "Construí componentes reutilizables con Magento 1 y 2, React y Knockout.js",
        ),
        L(
          "Improved performance and SEO for high-traffic retail pages",
          "Performance en SEO verbeterd voor retailpagina's met veel verkeer",
          "حسّنت الأداء وتحسين محركات البحث لصفحات تجارية عالية الزيارات",
          "Mejoré el rendimiento y el SEO de páginas de retail con mucho tráfico",
        ),
      ],
    },
    4: {
      title: L(
        "Front-End Developer (in-house & freelance)",
        "Front-end-ontwikkelaar (in-house & freelance)",
        "مطوّر واجهات (داخلي ومستقل)",
        "Desarrollador Front-End (interno y freelance)",
      ),
      period: L("2015 — 2019", "2015 — 2019", "2015 — 2019", "2015 — 2019"),
      location: kharkiv,
      type: fullTime,
      description: L(
        "Started in a web studio with formal HTML/CSS training, then delivered freelance projects: responsive websites with jQuery, Bootstrap, vanilla JS and PHP basics, with exposure to .NET project structure.",
        "Begonnen in een webstudio met formele HTML/CSS-opleiding, daarna freelanceprojecten opgeleverd: responsieve websites met jQuery, Bootstrap, vanilla JS en PHP-basis, met kennismaking met .NET-projectstructuur.",
        "بدأت في استوديو ويب بتدريب رسمي على HTML/CSS، ثم أنجزت مشاريع مستقلة: مواقع متجاوبة بـ jQuery وBootstrap وJavaScript صافٍ وأساسيات PHP، مع اطّلاع على بنية مشاريع .NET.",
        "Empecé en un estudio web con formación formal en HTML/CSS y después entregué proyectos freelance: webs responsive con jQuery, Bootstrap, JS puro y bases de PHP, con contacto con la estructura de proyectos .NET.",
      ),
      achievements: [
        L(
          "Completed formal HTML/CSS training in a web studio (2015)",
          "Formele HTML/CSS-opleiding afgerond in een webstudio (2015)",
          "أكملت تدريبًا رسميًا على HTML/CSS في استوديو ويب (2015)",
          "Completé formación formal de HTML/CSS en un estudio web (2015)",
        ),
        L(
          "Delivered responsive freelance websites for local businesses",
          "Responsieve freelancewebsites opgeleverd voor lokale bedrijven",
          "أنجزت مواقع متجاوبة كعمل مستقل لشركات محلية",
          "Entregué webs freelance responsive para negocios locales",
        ),
        L(
          "Worked with jQuery, Bootstrap, vanilla JS and PHP basics",
          "Gewerkt met jQuery, Bootstrap, vanilla JS en PHP-basis",
          "عملت بـ jQuery وBootstrap وJavaScript صافٍ وأساسيات PHP",
          "Trabajé con jQuery, Bootstrap, JS puro y bases de PHP",
        ),
        L(
          "Gained exposure to .NET project structure",
          "Kennisgemaakt met .NET-projectstructuur",
          "اطّلعت على بنية مشاريع .NET",
          "Me familiaricé con la estructura de proyectos .NET",
        ),
      ],
    },
    5: {
      title: L(
        "Computer Science (coursework)",
        "Informatica (studie)",
        "علوم الحاسوب (دراسة)",
        "Informática (estudios)",
      ),
      period: L("2012 — 2015", "2012 — 2015", "2012 — 2015", "2012 — 2015"),
      location: kharkiv,
      type: L("Education", "Opleiding", "تعليم", "Formación"),
      description: L(
        "Completed coursework in Computer Science, building a foundation in programming, algorithms, data structures and software development principles.",
        "Studie informatica gevolgd en zo een basis gelegd in programmeren, algoritmen, datastructuren en principes van softwareontwikkeling.",
        "درست علوم الحاسوب، فبنيت أساسًا في البرمجة والخوارزميات وبنى البيانات ومبادئ تطوير البرمجيات.",
        "Cursé Informática, construyendo una base en programación, algoritmos, estructuras de datos y principios de desarrollo de software.",
      ),
      achievements: [
        L(
          "Studied programming fundamentals and algorithms",
          "Programmeerfundamenten en algoritmen gestudeerd",
          "درست أساسيات البرمجة والخوارزميات",
          "Estudié fundamentos de programación y algoritmos",
        ),
        L(
          "Learned data structures and software engineering principles",
          "Datastructuren en software-engineeringprincipes geleerd",
          "تعلّمت بنى البيانات ومبادئ هندسة البرمجيات",
          "Aprendí estructuras de datos y principios de ingeniería de software",
        ),
        L(
          "Built a strong technical foundation for a front-end career",
          "Een sterke technische basis gelegd voor een front-endcarrière",
          "بنيت أساسًا تقنيًا متينًا لمسار مهني في الواجهات",
          "Construí una base técnica sólida para una carrera en front-end",
        ),
      ],
    },
  } as const;
}

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
      className="relative py-6 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[var(--bg-primary)] overflow-hidden scroll-mt-32 md:scroll-mt-36"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
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

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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
