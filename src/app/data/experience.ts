import { Briefcase, Code2, Rocket, Building2, Users } from "lucide-react";

/**
 * The single source of truth for employment history.
 *
 * It lives here, not inside the timeline component, because two things render
 * it: the timeline on the page and the printable CV at `#cv`. The old
 * `public/Stepan_Roze_CV.pdf` was maintained by hand and had already drifted —
 * it carried the wrong E-Consulting end date and no Albron entry, so the file a
 * recruiter downloaded contradicted the page they downloaded it from. Anything
 * factual about a role belongs in this file and nowhere else.
 */

export type Lang = (en: string, nl: string, ar: string, es: string) => string;

// Non-textual data only. Company names are proper nouns and stay as written;
// everything a visitor reads is built per-language in `experienceCopy`.
export const experiences = [
  {
    id: 1,
    year: "2026",
    company: "Self-Employed",
    tech: ["Next.js 14", "TypeScript", "React", "Netlify Functions", "Supabase", "Telegram Bot API", "WayForPay", "GA4"],
    icon: Rocket,
    gradient: "from-cyan-400 via-cyan-500 to-sky-600",
    color: "#00d9ff",
  },
  // Work outside the field, and it is here on purpose. Without it there is an
  // eighteen-month hole between E-Consulting and the freelance work, and a
  // reader fills a hole with the worst guess available. A named period reads
  // better than any of them. For a Benelux employer a permanent Belgian
  // contract also answers what they cannot ask out loud: right to work,
  // residence, and whether the candidate actually lives here.
  //
  // `aside: true` renders it as a footnote rather than a job: a slim muted
  // strip in the timeline, a single line on the CV. It has to be *present* to
  // close the gap, and it has to be *quiet* so it does not read as a career
  // move competing with the engineering roles for attention. Present and quiet
  // are not in conflict — a reader who is counting months finds it, and a
  // reader who is scanning for engineering skips past it.
  {
    id: 6,
    year: "2025",
    company: "Albron / Center Parcs",
    tech: [],
    icon: Briefcase,
    gradient: "from-slate-500 via-gray-500 to-zinc-500",
    color: "#94a3b8",
    aside: true,
  },
  {
    id: 2,
    year: "2024",
    company: "E-Consulting",
    tech: ["JavaScript (ES6+)", "MS Dynamics 365 XRM", "Vue.js", "Canvas", "REST API"],
    icon: Code2,
    gradient: "from-sky-400 via-cyan-500 to-teal-500",
    color: "#a78bfa",
  },
  {
    id: 3,
    year: "2022",
    company: "Ronis BT",
    tech: ["Magento 1 & 2", "React", "Knockout.js", "jQuery", "SCSS / LESS", "JavaScript (ES6+)"],
    icon: Users,
    gradient: "from-teal-400 via-cyan-500 to-cyan-600",
    color: "#10b981",
  },
  {
    id: 4,
    year: "2015",
    company: "Web Studio & Freelance",
    tech: ["HTML5", "CSS3", "JavaScript", "jQuery", "Bootstrap", "PHP"],
    icon: Building2,
    gradient: "from-cyan-300 via-sky-500 to-blue-600",
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

export function experienceCopy(L: Lang) {
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
      // The grade is gone from the title on purpose. In Belgium the employer
      // assigns a grade after the interview, so a self-declared one can only
      // cap the offer, never raise it — "Middle" was arguing against its own
      // CV. What replaces it is the keyword recruiters actually search on.
      title: L(
        "JavaScript Developer — Dynamics 365 / CRM",
        "JavaScript-ontwikkelaar — Dynamics 365 / CRM",
        "مطوّر JavaScript — Dynamics 365 / CRM",
        "Desarrollador JavaScript — Dynamics 365 / CRM",
      ),
      period: L("Oct 2022 — Dec 2024", "okt 2022 — dec 2024", "أكتوبر 2022 — ديسمبر 2024", "oct 2022 — dic 2024"),
      location: `${remote}, ${L("Ukraine", "Oekraïne", "أوكرانيا", "Ucrania")}`,
      type: fullTime,
      description: L(
        "Built and customized CRM web resources for a national bank on MS Dynamics 365 XRM in pure functional JavaScript. Developed a Vue.js electronic document-signing application for bank workflows and integrated REST APIs with back-end teams.",
        "CRM-webresources gebouwd en aangepast voor een nationale bank op MS Dynamics 365 XRM in puur functioneel JavaScript. Een Vue.js-applicatie voor elektronisch ondertekenen van documenten ontwikkeld en REST API's geïntegreerd met back-endteams.",
        "بنيت وخصّصت موارد ويب لنظام CRM لبنك أحد البنوك الوطنية على MS Dynamics 365 XRM بجافاسكربت وظيفي خالص. طوّرت تطبيق توقيع مستندات إلكتروني بـ Vue.js لسير عمل البنك، وربطت واجهات REST مع فرق الخلفية.",
        "Construí y personalicé recursos web de CRM para un banco nacional sobre MS Dynamics 365 XRM en JavaScript funcional puro. Desarrollé una aplicación Vue.js de firma electrónica de documentos e integré APIs REST con los equipos de back-end.",
      ),
      achievements: [
        L(
          "Developed CRM web resources for a national bank on MS Dynamics 365 XRM",
          "CRM-webresources ontwikkeld voor een nationale bank op MS Dynamics 365 XRM",
          "طوّرت موارد ويب لنظام CRM لأحد البنوك الوطنية على MS Dynamics 365 XRM",
          "Desarrollé recursos web de CRM para un banco nacional en MS Dynamics 365 XRM",
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
      // Same reason as role 2: the ladder is dropped. "Junior → Middle" told a
      // growth story to a reader who is only scanning for the highest grade on
      // the page, and the lowest word wins that scan.
      title: L(
        "Front-End Developer — E-commerce",
        "Front-end-ontwikkelaar — E-commerce",
        "مطوّر واجهات — التجارة الإلكترونية",
        "Desarrollador Front-End — E-commerce",
      ),
      period: L("May 2019 — Sep 2022", "mei 2019 — sep 2022", "مايو 2019 — سبتمبر 2022", "may 2019 — sep 2022"),
      location: `${kharkiv} (${L("hybrid", "hybride", "هجين", "híbrido")})`,
      type: fullTime,
      // "Core team member on childrensalon.com" could be read as a job at
      // Childrensalon itself. It was agency work: the employer is Ronis BT,
      // in the company field right above this, and these two were its client
      // accounts. Saying so costs one word and survives a reference check —
      // and the brand names, which are what prove the scale, stay.
      description: L(
        "Core front-end team member on two client accounts: childrensalon.com — one of the world's largest luxury children's fashion retailers — and vogacloset.com (MENA fashion marketplace). Rewrote the Product Detail Page front-end during a Magento 1.9 → custom Symfony re-platforming.",
        "Kernlid van het front-endteam op twee klantaccounts: childrensalon.com — een van de grootste luxe kinderkledingretailers ter wereld — en vogacloset.com (MENA-fashionmarktplaats). De front-end van de productdetailpagina herschreven tijdens een re-platforming van Magento 1.9 naar custom Symfony.",
        "عضو أساسي في فريق الواجهات على حسابَي عميلين: childrensalon.com — أحد أكبر متاجر أزياء الأطفال الفاخرة في العالم — وvogacloset.com (سوق أزياء في الشرق الأوسط وشمال أفريقيا). أعدت كتابة واجهة صفحة تفاصيل المنتج خلال الانتقال من Magento 1.9 إلى Symfony مخصّص.",
        "Miembro del equipo front-end en dos cuentas de cliente: childrensalon.com — uno de los mayores minoristas de moda infantil de lujo del mundo — y vogacloset.com (marketplace de moda MENA). Reescribí el front-end de la ficha de producto durante la migración de Magento 1.9 a Symfony a medida.",
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
