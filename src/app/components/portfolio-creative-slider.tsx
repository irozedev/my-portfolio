import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Award, ExternalLink, Github, ArrowRight } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { ProjectFullscreenView } from "./project-fullscreen-view";

type Lang = (en: string, nl: string, ar: string, es: string) => string;

// Real, curated projects. Screenshots are captured once and served as static
// assets from /public/projects (no runtime API dependency, no rate limits).
// A gradient fallback shows if an image ever fails to load.
//
// Only the non-textual data lives here. Everything the visitor reads is built
// per-language in `projectCopy` below — same inline-L() convention the newer
// components use, so the huge shared translations file stays untouched.
const projects = [
  {
    id: "marinek-store",
    title: "marinek.store",
    image: "/projects/marinek.webp",
    tech: [
      "Next.js 14",
      "TypeScript",
      "Tailwind",
      "Netlify Functions",
      "Supabase",
      "WayForPay",
      "Telegram Bot API",
      "Resend",
      "GA4",
    ],
    gradient: "from-cyan-500 to-blue-600",
    year: "2026",
    liveUrl: "https://marinek.store",
    featured: true,
  },
  {
    id: "roze-live",
    title: "roze.live",
    image: "/projects/roze.webp",
    tech: ["React", "TypeScript", "Tailwind", "Vite", "Motion"],
    gradient: "from-teal-500 to-cyan-600",
    year: "2026",
    liveUrl: "https://roze.live",
    githubUrl: "https://github.com/irozedev",
    featured: false,
  },
] as const;

type ProjectData = (typeof projects)[number];

/**
 * Per-project copy in all five languages.
 *
 * The tone here is deliberately conversational rather than résumé-formal:
 * these cards are the first thing a prospective client reads, and a spec sheet
 * does not tell them what the project actually achieved.
 */
function projectCopy(L: Lang) {
  return {
    "marinek-store": {
      category: L(
        "Freelance · payments",
        "Freelance · betalingen",
        "عمل حر · مدفوعات",
        "Freelance · pagos",
      ),
      description: L(
        "A paid marathon that actually keeps its paywall shut. Pay, the payment gets verified, and you get your own one-time Telegram invite. No more link that everybody forwards.",
        "Een betaalde marathon die haar paywall echt dicht houdt. Je betaalt, de betaling wordt geverifieerd, en je krijgt je eigen eenmalige Telegram-invite. Geen link meer die iedereen doorstuurt.",
        "ماراثون مدفوع يُحكم إغلاق بوابة الدفع فعليًا. تدفع، فيُتحقَّق من الدفع، ثم تحصل على دعوة تيليجرام خاصة بك تُستخدم مرة واحدة. لا رابط يتناقله الجميع بعد الآن.",
        "Un maratón de pago que de verdad mantiene cerrado su acceso. Pagas, el pago se verifica y recibes tu propia invitación de Telegram de un solo uso. Se acabó el enlace que todos reenvían.",
      ),
      role: L(
        "Full ownership — design to launch",
        "Volledig eigendom — ontwerp tot livegang",
        "مسؤولية كاملة — من التصميم إلى الإطلاق",
        "Responsabilidad total — del diseño al lanzamiento",
      ),
      duration: L("Freelance", "Freelance", "عمل حر", "Freelance"),
      team: L("Solo", "Solo", "منفرد", "En solitario"),
      fullDescription: L(
        "Designed, built and launched marinek.store end-to-end: a statically exported Next.js 14 site with three pricing tiers, legal pages and consent-gated GA4. In July 2026 I rebuilt the whole payment and access flow. Access had been handed out through a single shared Telegram link baked into the client bundle — anyone could open the thank-you page and join without paying, and the link spread by forwarding. Now the order is created and priced server-side, submitted to WayForPay through their Purchase API, and access is released only after a signature-verified webhook confirms the payment. Each buyer receives a personal single-use Telegram invite plus a transactional email, and a refund or void revokes the invite automatically. The site itself is a static export, so all server logic lives in Netlify Functions with Supabase as the order store.",
        "marinek.store van begin tot eind ontworpen, gebouwd en gelanceerd: een statisch geëxporteerde Next.js 14-site met drie tarieven, juridische pagina's en GA4 achter cookie-consent. In juli 2026 heb ik de volledige betaal- en toegangsflow herbouwd. Toegang liep eerder via één gedeelde Telegram-link die in de client-bundle zat — iedereen kon de bedankpagina openen en zonder betaling meedoen, en de link werd doorgestuurd. Nu wordt de order server-side aangemaakt en geprijsd, ondertekend naar WayForPay via hun Purchase API gestuurd, en komt toegang pas vrij nadat een webhook met geverifieerde signature de betaling bevestigt. Elke koper krijgt een persoonlijke eenmalige Telegram-invite plus een e-mail, en een terugbetaling trekt de invite automatisch in. De site is een statische export, dus alle serverlogica zit in Netlify Functions met Supabase als orderopslag.",
        "صمّمت وبنيت وأطلقت marinek.store من البداية إلى النهاية: موقع Next.js 14 بتصدير ثابت، بثلاث فئات أسعار وصفحات قانونية وGA4 لا يعمل إلا بعد الموافقة. في يوليو 2026 أعدت بناء مسار الدفع والوصول بالكامل. كان الوصول يُمنح عبر رابط تيليجرام واحد مشترك مدفون في حزمة العميل — يستطيع أي شخص فتح صفحة الشكر والانضمام دون دفع، والرابط ينتشر بالتحويل. الآن يُنشأ الطلب ويُسعَّر على الخادم، ويُوقَّع ويُرسل إلى WayForPay عبر واجهة Purchase API، ولا يُفتح الوصول إلا بعد أن يؤكّد الدفع خطّاف ويب موثَّق التوقيع. يستلم كل مشترٍ دعوة تيليجرام خاصة تُستخدم مرة واحدة مع رسالة بريد، وأي استرداد أو إلغاء يبطل الدعوة تلقائيًا. الموقع تصدير ثابت، لذا تعمل كل المنطق الخادمي في Netlify Functions مع Supabase لتخزين الطلبات.",
        "Diseñé, construí y lancé marinek.store de principio a fin: un sitio Next.js 14 de exportación estática con tres niveles de precio, páginas legales y GA4 supeditado al consentimiento. En julio de 2026 reconstruí todo el flujo de pago y acceso. Antes el acceso se repartía con un único enlace de Telegram compartido, incrustado en el bundle del cliente: cualquiera podía abrir la página de agradecimiento y entrar sin pagar, y el enlace se propagaba reenviándolo. Ahora el pedido se crea y se tarifica en el servidor, se firma y se envía a WayForPay por su Purchase API, y el acceso solo se libera cuando un webhook con firma verificada confirma el pago. Cada comprador recibe una invitación de Telegram personal de un solo uso más un correo, y una devolución o anulación revoca la invitación automáticamente. El sitio es una exportación estática, así que toda la lógica de servidor vive en Netlify Functions con Supabase como almacén de pedidos.",
      ),
      features: [
        // The outcome leads, not the architecture. A list of technical
        // decisions convinces other developers; what convinces a hiring
        // manager or a client is that the system is in production and
        // handling real money.
        L(
          "Live in production, handling real money — every order so far has released access automatically, with no manual step",
          "Live in productie met echt geld — elke bestelling tot nu toe gaf automatisch toegang, zonder handmatige stap",
          "يعمل في بيئة الإنتاج ويتعامل مع أموال حقيقية — كل طلب حتى الآن فتح الوصول تلقائيًا دون أي خطوة يدوية",
          "En producción y gestionando dinero real — hasta ahora cada pedido ha liberado el acceso automáticamente, sin ningún paso manual",
        ),
        L(
          "Server-side pricing — the amount never comes from the client, so a tier cannot be bought for one hryvnia",
          "Prijs alleen server-side — het bedrag komt nooit van de client, dus een tarief is niet voor één hryvnia te koop",
          "التسعير على الخادم فقط — المبلغ لا يأتي من العميل أبدًا، فلا يمكن شراء فئة بهريفنيا واحدة",
          "Precio solo en servidor — el importe nunca llega del cliente, así que un nivel no se compra por una grivna",
        ),
        L(
          "Signature-verified payment webhook, plus an independent amount check against the stored order",
          "Betaal-webhook met geverifieerde signature, plus een onafhankelijke bedragcontrole tegen de opgeslagen order",
          "خطّاف دفع موثَّق التوقيع، مع تحقّق مستقل من المبلغ مقابل الطلب المحفوظ",
          "Webhook de pago con firma verificada, más una comprobación independiente del importe contra el pedido guardado",
        ),
        L(
          "Idempotent webhook: the gateway retries for up to four days, and a conditional update guarantees exactly one invite per order",
          "Idempotente webhook: de gateway probeert tot vier dagen opnieuw, en een conditionele update garandeert precies één invite per order",
          "خطّاف غير متأثر بالتكرار: البوابة تعيد المحاولة حتى أربعة أيام، وتحديث شرطي يضمن دعوة واحدة بالضبط لكل طلب",
          "Webhook idempotente: la pasarela reintenta hasta cuatro días, y una actualización condicional garantiza exactamente una invitación por pedido",
        ),
        L(
          "Single-use Telegram invites — one member, seven-day expiry, three tiers routed to two channels",
          "Eenmalige Telegram-invites — één lid, zeven dagen geldig, drie tarieven naar twee kanalen",
          "دعوات تيليجرام لمرة واحدة — عضو واحد، صلاحية سبعة أيام، ثلاث فئات موجَّهة إلى قناتين",
          "Invitaciones de Telegram de un solo uso — un miembro, caducidad de siete días, tres niveles hacia dos canales",
        ),
        L(
          "Refunds and voids revoke the invite automatically",
          "Terugbetalingen en annuleringen trekken de invite automatisch in",
          "الاسترداد والإلغاء يبطلان الدعوة تلقائيًا",
          "Devoluciones y anulaciones revocan la invitación automáticamente",
        ),
        L(
          "Email as the guaranteed delivery channel if the buyer closes the tab",
          "E-mail als gegarandeerd bezorgkanaal als de koper het tabblad sluit",
          "البريد الإلكتروني كقناة تسليم مضمونة إذا أغلق المشتري التبويب",
          "El correo como canal de entrega garantizado si el comprador cierra la pestaña",
        ),
        L(
          "Analytics mount only after explicit cookie consent",
          "Analytics laadt pas na expliciete cookie-toestemming",
          "التحليلات لا تُحمَّل إلا بعد موافقة صريحة على الكوكيز",
          "La analítica se carga solo tras el consentimiento explícito de cookies",
        ),
        L(
          "Least-privilege bot: invite permission only, so a leaked token cannot damage the channels",
          "Bot met minimale rechten: alleen uitnodigen, dus een gelekt token kan de kanalen niet beschadigen",
          "بوت بأقل الصلاحيات: صلاحية الدعوة فقط، فلا يستطيع رمز مسروق إضرار القنوات",
          "Bot con privilegios mínimos: solo invitar, así un token filtrado no puede dañar los canales",
        ),
      ],
    },
    "roze-live": {
      category: L(
        "Personal · portfolio",
        "Persoonlijk · portfolio",
        "شخصي · بورتفوليو",
        "Personal · portafolio",
      ),
      description: L(
        "The site you're on right now. Five languages, two view modes for two audiences, a light theme that isn't an afterthought — and a chat that quotes your project without an API bill.",
        "De site waar je nu bent. Vijf talen, twee weergavemodi voor twee doelgroepen, een licht thema dat geen bijzaak is — en een chat die je project inschat zonder API-rekening.",
        "الموقع الذي تتصفّحه الآن. خمس لغات، ووضعان للعرض لجمهورين، وثيم فاتح ليس مجرد إضافة لاحقة — ودردشة تقدّر مشروعك دون فاتورة API.",
        "El sitio en el que estás ahora. Cinco idiomas, dos modos de vista para dos públicos, un tema claro que no es un añadido — y un chat que presupuesta tu proyecto sin factura de API.",
      ),
      role: L(
        "Design & development",
        "Ontwerp & ontwikkeling",
        "التصميم والتطوير",
        "Diseño y desarrollo",
      ),
      duration: L("Personal", "Persoonlijk", "شخصي", "Personal"),
      team: L("Solo", "Solo", "منفرد", "En solitario"),
      fullDescription: L(
        "My personal portfolio, built with React 19, TypeScript, Tailwind v4 and Vite. Five languages including Arabic with real RTL support, a light and a dark theme, and two view modes — one for clients looking to hire, one showing the full CV. The chat assistant runs entirely in the browser: it answers questions about pricing, timelines and stack, navigates the page for you and collects a lead, at zero API cost.",
        "Mijn persoonlijke portfolio, gebouwd met React 19, TypeScript, Tailwind v4 en Vite. Vijf talen inclusief Arabisch met echte RTL-ondersteuning, een licht en een donker thema, en twee weergavemodi — één voor klanten, één met het volledige cv. De chat-assistent loopt volledig in de browser: hij antwoordt over prijzen, planning en stack, navigeert de pagina voor je en verzamelt een lead, tegen nul API-kosten.",
        "بورتفوليو الشخصي، مبني بـ React 19 وTypeScript وTailwind v4 وVite. خمس لغات منها العربية بدعم RTL حقيقي، وثيم فاتح وآخر داكن، ووضعان للعرض — أحدهما للعملاء والآخر يعرض السيرة الكاملة. مساعد الدردشة يعمل بالكامل في المتصفّح: يجيب عن الأسعار والمواعيد والتقنيات، ويتنقّل في الصفحة عنك، ويجمع العميل المحتمل — بتكلفة API صفرية.",
        "Mi portafolio personal, hecho con React 19, TypeScript, Tailwind v4 y Vite. Cinco idiomas incluido árabe con soporte RTL real, tema claro y oscuro, y dos modos de vista: uno para clientes y otro con el CV completo. El asistente de chat funciona íntegramente en el navegador: responde sobre precios, plazos y stack, navega la página por ti y capta el contacto, con coste de API cero.",
      ),
      features: [
        L(
          "Five languages with a real ?lang= URL, honest hreflang and Arabic RTL",
          "Vijf talen met een echte ?lang=-URL, eerlijke hreflang en Arabisch RTL",
          "خمس لغات مع رابط ?lang= حقيقي، وhreflang صادق، وRTL للعربية",
          "Cinco idiomas con una URL ?lang= real, hreflang honesto y RTL en árabe",
        ),
        L(
          "Client and CV view modes off one dataset",
          "Client- en cv-weergavemodi uit één dataset",
          "وضعا العرض «عميل» و«سيرة» من مجموعة بيانات واحدة",
          "Modos de vista cliente y CV desde un mismo conjunto de datos",
        ),
        L(
          "Light and dark themes applied before first paint — no flash on reload",
          "Licht en donker thema toegepast vóór de eerste paint — geen flits bij herladen",
          "الثيم الفاتح والداكن يُطبَّق قبل أول رسم — بلا وميض عند إعادة التحميل",
          "Temas claro y oscuro aplicados antes del primer pintado — sin destello al recargar",
        ),
        L(
          "In-browser chat assistant: quotes, navigation and lead capture at zero API cost",
          "Chat-assistent in de browser: prijsindicatie, navigatie en leadcaptatie tegen nul API-kosten",
          "مساعد دردشة داخل المتصفّح: تسعير وتنقّل وجمع العملاء بتكلفة API صفرية",
          "Asistente de chat en el navegador: presupuesto, navegación y captación con coste de API cero",
        ),
        L(
          "Keyboard-navigable throughout, with focus trapping in every dialog",
          "Volledig met het toetsenbord te navigeren, met focus-trapping in elke dialog",
          "التنقّل بالكيبورد في كل المواضع، مع حصر التركيز في كل نافذة حوار",
          "Navegable por teclado en todo el sitio, con focus trap en cada diálogo",
        ),
        L(
          "Code-split bundle, live GitHub feed, static screenshots instead of runtime API calls",
          "Code-split bundle, live GitHub-feed, statische screenshots in plaats van runtime-API-calls",
          "حزمة مقسَّمة، وتغذية GitHub مباشرة، ولقطات ثابتة بدل نداءات API وقت التشغيل",
          "Bundle dividido, feed de GitHub en vivo, capturas estáticas en lugar de llamadas API en tiempo de ejecución",
        ),
      ],
    },
  } as const;
}

export function PortfolioCreativeSlider() {
  const { t, language } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const L: Lang = (en, nl, ar, es) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;
  const copy = projectCopy(L);

  // Merge static data with the current language's copy. The fullscreen view
  // takes the same shape, so it stays localized too.
  const view = (project: ProjectData) => {
    const text = copy[project.id as keyof typeof copy];
    return {
      ...project,
      tech: [...project.tech],
      category: text.category,
      description: text.description,
      fullDescription: text.fullDescription,
      features: [...text.features],
      role: text.role,
      duration: text.duration,
      team: text.team,
      subtitle: text.category,
      timeline: `${project.year} • ${text.duration}`,
    };
  };

  const selectedProject = selectedId
    ? view(projects.find((p) => p.id === selectedId) ?? projects[0])
    : null;

  const openLabel = L("Look inside", "Bekijk van binnen", "اطّلع من الداخل", "Ver por dentro");
  const liveLabel = L("Open the live site", "Live site openen", "افتح الموقع المباشر", "Abrir el sitio");

  return (
    <section
      id="projects"
      className="relative py-6 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[var(--bg-primary)] overflow-hidden scroll-mt-24 md:scroll-mt-28"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-full mb-6">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              {L("Things I've built", "Wat ik gebouwd heb", "أعمال بنيتها", "Cosas que he construido")}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
            {t("projects.title")}
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            {t("projects.subtitle")}
          </p>
        </motion.div>

        {/* Projects grid.
            The screenshot is the hero of each card now: full-bleed at the top
            with the title set over it, instead of a small thumbnail above a
            table of facts. The old card led with a four-cell stats box, which
            read like a datasheet — these are two personal projects, not
            product listings. */}
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 max-w-5xl mx-auto">
          {projects.map((project, index) => {
            const text = copy[project.id as keyof typeof copy];

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)]/40 hover:shadow-[0_24px_60px_-24px_var(--shadow-color)] transition-all duration-500"
              >
                {/* Screenshot.
                    A fixed aspect-ratio box reserves the space before the image
                    decodes, so the grid does not jump (CLS). */}
                <button
                  type="button"
                  onClick={() => setSelectedId(project.id)}
                  className={`relative block w-full aspect-[16/10] overflow-hidden bg-gradient-to-br ${project.gradient} text-left`}
                  aria-label={`${project.title} — ${openLabel}`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />

                  {/* Scrim only where the text sits, so the screenshot itself
                      stays readable. Fixed dark colours, not theme tokens:
                      the caption on top is always white. */}
                  <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

                  {/* Caption over the photo */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6" dir="auto">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/70 mb-1.5">
                      {text.category}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                      {project.title}
                    </h3>
                  </div>

                  {project.featured && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[var(--accent-primary)] text-black text-[11px] font-bold tracking-wide">
                      {L("Featured", "Uitgelicht", "مميّز", "Destacado")}
                    </span>
                  )}
                </button>

                {/* The favourite heart used to sit here. Favourites were stored
                    per signed-in account, and nobody signs in to a portfolio —
                    it invited a click that led to a login wall. */}

                {/* Body */}
                <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                  <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                    {text.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)]">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-auto pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedId(project.id)}
                      className="flex-1 py-3 px-4 rounded-xl bg-[var(--accent-primary)] text-[var(--bg-primary)] text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                    >
                      {openLabel}
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 transition-all flex items-center justify-center flex-shrink-0"
                      aria-label={liveLabel}
                      title={liveLabel}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {"githubUrl" in project && project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 transition-all flex items-center justify-center flex-shrink-0"
                        aria-label={L("View code on GitHub", "Code op GitHub", "الكود على GitHub", "Código en GitHub")}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectFullscreenView
            project={selectedProject}
            onClose={() => setSelectedId(null)}
            onNext={() => {
              const i = projects.findIndex((p) => p.id === selectedId);
              setSelectedId(projects[(i + 1) % projects.length].id);
            }}
            onPrev={() => {
              const i = projects.findIndex((p) => p.id === selectedId);
              setSelectedId(projects[(i - 1 + projects.length) % projects.length].id);
            }}
            hasNext={projects.length > 1}
            hasPrev={projects.length > 1}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
