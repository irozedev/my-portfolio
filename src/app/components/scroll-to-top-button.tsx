import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/language-context";
import { useViewMode } from "../contexts/view-mode-context";
import { lockScroll, unlockScroll } from "../../utils/scroll-lock";
import { hiringStrings, hiringAnswer, hiringFunnel, whatsappHandoff } from "../lib/hiring-assistant";
import { mailtoLead } from "../lib/lead-fallback";
import { submitLead as postLead } from "../lib/submit-lead";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  action?: ChatAction;
}

// Sales funnel: collect project → budget → timeline → name → email, then send
// the lead to Stepan. 'qa' = free Q&A mode, 'done' = after a lead was sent.
// 'role' belongs to the hiring track: a recruiter is asked what the job is,
// not what they want built or what it may cost.
type Stage = 'intro' | 'qa' | 'role' | 'budget' | 'timeline' | 'name' | 'email' | 'done';
type Lead = { project?: string; role?: string; budget?: string; timeline?: string; name?: string; email?: string };

function funnelStrings(language: string) {
  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;
  return {
    welcome: L(
      "Hi! I'm Roze, Stepan's assistant. I'll get you a fast, honest quote in a few taps.\n\nWhat would you like to build?",
      "Hoi! Ik ben Roze, Stepan's assistent. In een paar tikken geef ik je een eerlijke prijs.\n\nWat wil je bouwen?",
      "مرحباً! أنا Roze، مساعد ستيبان. سأعطيك تقديراً صادقاً بسرعة.\n\nماذا تريد أن تبني؟",
      "¡Hola! Soy Roze, asistente de Stepan. En unos toques te doy un presupuesto honesto.\n\n¿Qué quieres construir?",
    ),
    reask: L("Sure — what would you like to build?", "Prima — wat wil je bouwen?", "تمام — ماذا تريد أن تبني؟", "Claro — ¿qué quieres construir?"),
    askBudget: L("Nice choice. What's your rough budget?", "Goede keuze. Wat is je budget ongeveer?", "اختيار جيد. ما ميزانيتك التقريبية؟", "¡Buena elección! ¿Presupuesto aproximado?"),
    askTimeline: L("Got it. When do you need it?", "Genoteerd. Wanneer heb je het nodig?", "تمام. متى تحتاجه؟", "Perfecto. ¿Para cuándo lo necesitas?"),
    askName: L("Great. What's your name?", "Top. Wat is je naam?", "رائع. ما اسمك؟", "Genial. ¿Cómo te llamas?"),
    askEmail: L("And your best email so Stepan can send the quote?", "En je e-mail zodat Stepan de offerte kan sturen?", "وبريدك ليرسل لك ستيبان العرض؟", "¿Tu email para que Stepan te envíe el presupuesto?"),
    badEmail: L("Hmm, that email looks off — mind trying again?", "Dat e-mailadres klopt niet — nog een keer?", "يبدو البريد غير صحيح — حاول مجدداً؟", "Ese email no parece válido — ¿otra vez?"),
    sending: L("Sending your request to Stepan…", "Ik stuur je aanvraag naar Stepan…", "أرسل طلبك إلى ستيبان…", "Enviando tu solicitud a Stepan…"),
    thanks: (n: string, e: string) => L(
      `Thanks, ${n}! Your request is with Stepan. He builds every morning (CET) and replies the same day at ${e}.\n\nWant a rough price now, or anything else?`,
      `Bedankt, ${n}! Je aanvraag staat bij Stepan. Hij bouwt elke ochtend (CET) en reageert dezelfde dag op ${e}.\n\nWil je nu een richtprijs of nog iets?`,
      `شكراً، ${n}! طلبك عند ستيبان. يعمل كل صباح (CET) ويرد في نفس اليوم على ${e}.\n\nتريد سعراً تقريبياً الآن أو شيئاً آخر؟`,
      `¡Gracias, ${n}! Tu solicitud está con Stepan. Trabaja cada mañana (CET) y responde el mismo día a ${e}.\n\n¿Quieres un precio aproximado ahora o algo más?`,
    ),
    failed: (e: string) => L(
      `I couldn't send it automatically. Please email Stepan directly at hello@roze.live — I noted your address (${e}).`,
      `Kon het niet automatisch versturen. Mail Stepan direct: hello@roze.live (jouw e-mail: ${e}).`,
      `تعذّر الإرسال تلقائياً. راسل ستيبان مباشرة: hello@roze.live (بريدك: ${e}).`,
      `No pude enviarlo automáticamente. Escribe a Stepan: hello@roze.live (tu email: ${e}).`,
    ),
    qaIntro: L("Sure — ask me about pricing, timelines, stack or availability. Or tap “Get a quote”.", "Tuurlijk — vraag over prijzen, planning, stack of beschikbaarheid. Of tik “Offerte”.", "بالتأكيد — اسأل عن الأسعار أو المدة أو الأدوات. أو اضغط «عرض سعر».", "Claro — pregunta sobre precios, plazos o stack. O toca “Presupuesto”."),
    labels: {
      website: L("Website", "Website", "موقع", "Web"),
      bot: L("Bot / Automation", "Bot / automatisering", "بوت / أتمتة", "Bot / automatización"),
      webapp: L("Web app", "Webapp", "تطبيق ويب", "Web app"),
      ecom: L("E-commerce", "Webshop", "متجر", "E-commerce"),
      ask: L("Just a question", "Even een vraag", "مجرد سؤال", "Solo una pregunta"),
      quote: L("Get a quote", "Offerte", "عرض سعر", "Presupuesto"),
      bUnder500: L("Under €500", "Onder €500", "أقل من €500", "Menos de €500"),
      b500: L("€500–1,500", "€500–1.500", "€500–1,500", "€500–1.500"),
      b1500: L("€1,500–5,000", "€1.500–5.000", "€1,500–5,000", "€1.500–5.000"),
      b5000: L("€5,000+", "€5.000+", "€5,000+", "€5.000+"),
      bNotSure: L("Not sure yet", "Weet ik nog niet", "لست متأكداً بعد", "Aún no sé"),
      tAsap: L("ASAP", "Zo snel mogelijk", "بأسرع وقت", "Cuanto antes"),
      t24: L("2–4 weeks", "2–4 weken", "2–4 أسابيع", "2–4 semanas"),
      t13: L("1–3 months", "1–3 maanden", "1–3 أشهر", "1–3 meses"),
      tflex: L("Flexible", "Flexibel", "مرن", "Flexible"),
    },
  };
}

// Smart local fallback — keeps the chat useful (with current pricing, stack,
// availability and contact) whenever the AI backend is unavailable or returns
// its generic fallback (e.g. ANTHROPIC_API_KEY not configured on Supabase).
function localAnswer(input: string, language: string): string {
  const s = input.toLowerCase();
  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  if (/(^|\b)(hi|hello|hey|прив|hallo|hoi|hola|مرحبا|salut)/.test(s))
    return L(
      "Hi! I can help with pricing, timelines, my stack, availability or contact. What do you need?",
      "Hoi! Ik help met prijzen, planning, stack, beschikbaarheid of contact. Wat heb je nodig?",
      "مرحباً! أساعدك في الأسعار، المدة، الأدوات، التوفر أو التواصل. ماذا تريد؟",
      "¡Hola! Puedo ayudarte con precios, plazos, stack, disponibilidad o contacto. ¿Qué necesitas?",
    );

  if (/(price|cost|rate|budget|pricing|quote|how much|цін|цена|скільки|prijs|kost|precio|cuánto|سعر|كم)/.test(s))
    return L(
      "Starting prices (no VAT — small-business scheme):\n• Landing page — from €950\n• Website 4–6 pages — €2,200–3,500\n• WhatsApp bot — from €500\n• Automation — €65/h\n• Web app / dashboard — €75/h\n• E-commerce — from €1,800\n• Consulting — €75/h\n\nTell me what you need and I'll narrow it down.",
      "Vanafprijzen (geen btw — vrijstellingsregeling):\n• Landingspagina — vanaf €950\n• Website 4–6 pagina's — €2.200–3.500\n• WhatsApp-bot — vanaf €500\n• Automatisering — €65/u\n• Webapp — €75/u\n• E-commerce — vanaf €1.800\n• Consulting — €75/u\n\nVertel wat je nodig hebt.",
      "أسعار البداية (بدون ضريبة — نظام المنشآت الصغيرة):\n• صفحة هبوط — من €950\n• موقع 4–6 صفحات — €2,200–3,500\n• بوت تيليجرام — من €500\n• أتمتة — €65/س\n• تطبيق ويب — €75/س\n• متجر — من €1,800\n• استشارة — €75/س\n\nأخبرني بما تحتاج.",
      "Precios iniciales (sin IVA — régimen de pequeñas empresas):\n• Landing — desde €950\n• Web 4–6 páginas — €2.200–3.500\n• Bot de WhatsApp — desde €500\n• Automatización — €65/h\n• Web app — €75/h\n• E-commerce — desde €1.800\n• Consultoría — €75/h\n\nCuéntame qué necesitas.",
    );

  if (/(time|timeline|how long|deadline|deliver|строк|термін|скільки часу|termijn|hoelang|plazo|cuánto tiempo|مدة|وقت)/.test(s))
    return L(
      "Realistic timelines (I build mornings, ~20h/week):\n• Landing — 1–1.5 weeks\n• Website 4–6 pages — 2.5–3.5 weeks\n• WhatsApp bot — ~1 week\n• Automation — 3–5 mornings\n• Web app (MVP) — 4–6 weeks\n• E-commerce — 3–5 weeks",
      "Realistische planning (ik bouw 's ochtends, ~20u/week):\n• Landing — 1–1.5 week\n• Website 4–6 pagina's — 2.5–3.5 week\n• Bot — ~1 week\n• Automatisering — 3–5 ochtenden\n• Webapp (MVP) — 4–6 weken\n• E-commerce — 3–5 weken",
      "مواعيد واقعية (أعمل صباحاً، ~20 ساعة/أسبوع):\n• صفحة هبوط — 1–1.5 أسبوع\n• موقع 4–6 صفحات — 2.5–3.5 أسبوع\n• بوت — ~أسبوع\n• أتمتة — 3–5 صباحات\n• تطبيق (MVP) — 4–6 أسابيع\n• متجر — 3–5 أسابيع",
      "Plazos realistas (trabajo por las mañanas, ~20h/semana):\n• Landing — 1–1.5 semanas\n• Web 4–6 páginas — 2.5–3.5 semanas\n• Bot — ~1 semana\n• Automatización — 3–5 mañanas\n• Web app (MVP) — 4–6 semanas\n• E-commerce — 3–5 semanas",
    );

  if (/(available|availability|when.*(free|start)|hire|busy|доступ|коли|beschikbaar|wanneer|disponible|cuándo|متاح|متوفر)/.test(s))
    return L(
      "I work on projects every morning, 06:00–12:00 CET (I have a main job too). I reply within the day and take only 1–2 projects at a time, so yours gets real attention.",
      "Ik werk elke ochtend aan projecten, 06:00–12:00 CET (ik heb ook een hoofdbaan). Ik reageer binnen de dag en neem 1–2 projecten tegelijk.",
      "أعمل على المشاريع كل صباح، 06:00–12:00 بتوقيت وسط أوروبا. أرد خلال اليوم وأتولى مشروعين فقط في المرة.",
      "Trabajo en proyectos cada mañana, 06:00–12:00 CET (también tengo trabajo principal). Respondo el mismo día y tomo solo 1–2 proyectos a la vez.",
    );

  if (/(contact|email|reach|mail|write|telegram|контакт|звʼяз|звяз|пошта|contacto|correo|تواصل|بريد)/.test(s))
    return L(
      "Best way to reach me:\n• Email: hello@roze.live\n• GitHub: github.com/irozedev\n• LinkedIn: linkedin.com/in/rozestepan\n\nOr use the contact form below — I reply within the day.",
      "Zo bereik je me:\n• E-mail: hello@roze.live\n• GitHub: github.com/irozedev\n• LinkedIn: linkedin.com/in/rozestepan\n\nOf het formulier hieronder — ik reageer binnen de dag.",
      "أفضل طريقة للتواصل:\n• البريد: hello@roze.live\n• GitHub: github.com/irozedev\n• LinkedIn: linkedin.com/in/rozestepan\n\nأو نموذج التواصل أدناه.",
      "Mejor forma de contactarme:\n• Email: hello@roze.live\n• GitHub: github.com/irozedev\n• LinkedIn: linkedin.com/in/rozestepan\n\nO el formulario de abajo — respondo el mismo día.",
    );

  if (/(skill|tech|stack|experience|expertise|react|vue|next|typescript|magento|навич|досвід|стек|ervaring|vaardig|habilidad|experiencia|خبرة|مهارات)/.test(s))
    return L(
      "8+ years, front-end / JavaScript. Stack: React, Vue, Next.js, TypeScript, Node.js, Magento. Built e-commerce (childrensalon.com, vogacloset.com) and banking systems (a national bank CRM). Based in Belgium.",
      "8+ jaar, front-end / JavaScript. Stack: React, Vue, Next.js, TypeScript, Node.js, Magento. E-commerce (childrensalon.com, vogacloset.com) en banksystemen (een nationale bank). België.",
      "خبرة 8+ سنوات، Front-End / JavaScript. الأدوات: React, Vue, Next.js, TypeScript, Node.js, Magento. تجارة إلكترونية وأنظمة مصرفية. مقيم في بلجيكا.",
      "8+ años, front-end / JavaScript. Stack: React, Vue, Next.js, TypeScript, Node.js, Magento. E-commerce (childrensalon.com, vogacloset.com) y banca (un banco nacional). En Bélgica.",
    );

  if (/(start|begin|hire|work with|project|почати|проект|starten|beginnen|empezar|proyecto|بدء|مشروع)/.test(s))
    return L(
      "Great! Tell me briefly: what you want to build, rough budget and deadline. Then email hello@roze.live or use the form below — I'll send a fixed quote + timeline.",
      "Top! Vertel kort: wat je wil bouwen, budget en deadline. Mail hello@roze.live of gebruik het formulier — je krijgt een vaste offerte + planning.",
      "رائع! أخبرني باختصار: ما تريد بناءه، الميزانية والموعد. راسلني على hello@roze.live أو عبر النموذج، وسأرسل عرضاً ثابتاً + جدولاً.",
      "¡Genial! Cuéntame: qué quieres construir, presupuesto y plazo. Escribe a hello@roze.live o usa el formulario y te envío presupuesto fijo + plazo.",
    );

  return ""; // no info match — the smart layer / funnel decides what to do
}

type ChatAction =
  | { kind: 'nav'; target: string; label: string }
  | { kind: 'view'; mode: 'client' | 'cv'; label: string }
  | { kind: 'quote'; label: string }
  | { kind: 'link'; href: string; label: string };

// Smart in-browser assistant: site navigation, guidance and info answers — zero
// API cost, instant, private. Returns matched=false only when nothing is
// recognised, so the funnel can treat the text as a project description.
function assistantReply(input: string, language: string): { text: string; action?: ChatAction; matched: boolean } {
  const s = input.toLowerCase();
  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  const lblServices = L("Open Services", "Naar diensten", "الخدمات", "Ver servicios");
  const lblWork = L("See my work", "Bekijk werk", "شاهد أعمالي", "Ver trabajo");
  const lblProcess = L("How I work", "Werkwijze", "آلية العمل", "Cómo trabajo");
  const lblAbout = L("About me", "Over mij", "نبذة عني", "Sobre mí");
  const lblContact = L("Open contact", "Naar contact", "نموذج التواصل", "Ir a contacto");
  const lblCompany = L("Company view", "Bedrijfsweergave", "وضع الشركة", "Vista empresa");
  const lblGithub = L("Open GitHub", "Open GitHub", "فتح GitHub", "Abrir GitHub");
  const lblCV = L("Download CV", "CV downloaden", "تحميل السيرة", "Descargar CV");
  const lblQuote = L("Get a quote", "Offerte", "عرض سعر", "Presupuesto");

  // Site guide / help
  if (/(how (does|to use) (this|the)? ?(site|page|website)|what is this (site|page|website)|show me around|navigate|site ?guide|help me (find|navigate)|навігац|навигац|hoe werkt (deze|de) ?(site|website)|rondleiding|cómo funciona (este|el) ?(sitio|web)|guíame|كيف (يعمل|أستخدم) الموقع|جولة)/.test(s))
    return { matched: true, text: L(
      "Quick tour:\n• Services — what I build & prices\n• Process — how I work + honest timelines\n• Projects — real work\n• GitHub — live code\n• Contact — reach Stepan\n\nTwo modes (top toggle): Client (hire me) & Company (full CV). 5 languages, dark/light. Where to?",
      "Korte rondleiding:\n• Diensten — wat ik bouw & prijzen\n• Werkwijze — hoe ik werk + eerlijke planning\n• Projecten — echt werk\n• GitHub — live code\n• Contact — bereik Stepan\n\nTwee modi (boven): Client & Company (volledig cv). 5 talen, donker/licht. Waarheen?",
      "جولة سريعة:\n• الخدمات — ما أبنيه والأسعار\n• آلية العمل — كيف أعمل + مواعيد صادقة\n• المشاريع — أعمال حقيقية\n• GitHub — كود مباشر\n• التواصل — الوصول لستيبان\n\nوضعان (بالأعلى): عميل وشركة. 5 لغات. إلى أين؟",
      "Tour rápido:\n• Servicios — qué construyo y precios\n• Proceso — cómo trabajo + plazos honestos\n• Proyectos — trabajo real\n• GitHub — código en vivo\n• Contacto — contactar a Stepan\n\nDos modos (arriba): Cliente y Empresa. 5 idiomas. ¿A dónde?",
    ) };

  // View mode
  if (/(view mode|client mode|company mode|cv mode|company view|switch.*(mode|view)|режим|weergave|modus|bedrijfsmodus|modo (empresa|cliente|cv))/.test(s))
    return { matched: true, action: { kind: 'view', mode: 'cv', label: lblCompany }, text: L(
      "This site has two modes (toggle at the top):\n• Client — services, prices, projects\n• Company — full CV: experience & skills\n\nOpen the full CV view?",
      "Twee modi (schakelaar boven):\n• Client — diensten, prijzen, projecten\n• Company — volledig cv: ervaring & skills\n\nCompany-weergave openen?",
      "وضعان (بالأعلى):\n• عميل — خدمات وأسعار ومشاريع\n• شركة — السيرة كاملة\n\nأفتح وضع الشركة؟",
      "Dos modos (arriba):\n• Cliente — servicios, precios, proyectos\n• Empresa — CV completo\n\n¿Abrir vista Empresa?",
    ) };

  // Process
  if (/(how (do|does)( you| he| stepan)? ?work|your process|work process|workflow|how it works|steps|як (ти )?прац|процес|hoe werk je|werkwijze|stappen|cómo (trabajas|funciona el proceso)|pasos|كيف تعمل|آلية العمل|خطوات)/.test(s))
    return { matched: true, action: { kind: 'nav', target: '#how-i-work', label: lblProcess }, text: L(
      "Simple: free intro → fixed quote & timeline → 30–50% deposit → build with live preview → 1–2 revisions → launch & handover. I build every morning (CET), steady daily progress.",
      "Simpel: gratis intro → vaste prijs & planning → 30–50% aanbetaling → bouwen met preview → 1–2 revisies → lancering. Ik bouw elke ochtend (CET).",
      "ببساطة: تعارف مجاني → سعر ثابت ومدة → دفعة 30–50% → بناء مع معاينة → تعديلان → إطلاق. أعمل كل صباح (CET).",
      "Simple: intro gratis → precio fijo y plazo → anticipo 30–50% → desarrollo con vista previa → 1–2 revisiones → lanzamiento. Trabajo cada mañana (CET).",
    ) };

  // Services
  if (/(service|offering|what.*(can|do) you (do|offer)|послуг|що ти робиш|dienst|wat doe je|servicio|qué (haces|ofreces)|خدمات|ماذا تقدم)/.test(s))
    return { matched: true, action: { kind: 'nav', target: '#services', label: lblServices }, text: L(
      "Automation & bots, websites & landing pages, UI design & build, web apps & dashboards, e-commerce and consulting. Want the full list with prices?",
      "Automatisering & bots, websites & landingspagina's, UI-ontwerp & build, webapps & dashboards, e-commerce en consulting. Lijst met prijzen?",
      "أتمتة وبوتات، مواقع وصفحات هبوط، تصميم وبناء واجهات، تطبيقات ولوحات، متاجر، واستشارات. أعرض القائمة بالأسعار؟",
      "Automatización y bots, webs y landings, diseño UI y build, web apps y paneles, e-commerce y consultoría. ¿Ver la lista con precios?",
    ) };

  // CV / resume
  if (/(\bcv\b|resume|curriculum|résumé|резюме|السيرة الذاتية|سيرة ذاتية)/.test(s))
    // Points at the generated CV page, not the retired static PDF. That file
    // was maintained by hand and had drifted out of sync with the site.
    return { matched: true, action: { kind: 'link', href: '#cv', label: lblCV }, text: L(
      "Open Stepan's CV — printable, and \"Save as PDF\" from there. Or switch to Company view for the full interactive timeline.",
      "Open Stepans cv — printbaar, en daar \"Opslaan als PDF\". Of schakel naar Company-weergave voor de volledige tijdlijn.",
      "افتح سيرة ستيبان — قابلة للطباعة والحفظ كـ PDF. أو بدّل لوضع الشركة للخبرة كاملة.",
      "Abre el CV de Stepan — imprimible, y desde ahí \"Guardar como PDF\". O cambia a vista Empresa para la trayectoria completa.",
    ) };

  // Experience / career
  if (/(experience|career|work history|employment|\bjobs?\b|досвід|карʼєр|ervaring|loopbaan|experiencia|carrera|خبرة|مسيرة)/.test(s))
    return { matched: true, action: { kind: 'view', mode: 'cv', label: lblCompany }, text: L(
      "8+ years: luxury e-commerce (childrensalon.com, vogacloset.com), banking systems (a national bank CRM), shipped 2026 projects. Full timeline is in Company view.",
      "8+ jaar: luxe e-commerce (childrensalon.com, vogacloset.com), banksystemen (een nationale bank CRM), 2026-projecten. Volledige tijdlijn in Company-weergave.",
      "8+ سنوات: تجارة فاخرة (childrensalon.com، vogacloset.com)، أنظمة مصرفية (أحد البنوك الوطنية)، مشاريع 2026. الخبرة كاملة في وضع الشركة.",
      "8+ años: e-commerce de lujo (childrensalon.com, vogacloset.com), banca (un banco nacional CRM), proyectos 2026. Trayectoria completa en vista Empresa.",
    ) };

  // GitHub
  if (/(github|source ?code|repos?|repositor|исходник|broncode|código fuente|جيت ?هاب)/.test(s))
    return { matched: true, action: { kind: 'link', href: 'https://github.com/irozedev', label: lblGithub }, text: L(
      "Stepan's public code is on GitHub (@irozedev). Open it?",
      "Stepans publieke code staat op GitHub (@irozedev). Openen?",
      "كود ستيبان العام على GitHub (@irozedev). أفتحه؟",
      "El código público de Stepan está en GitHub (@irozedev). ¿Lo abro?",
    ) };

  // Projects / work
  if (/(portfolio|projects?|your work|examples?|case ?stud|demo|роб(о|і)т|проєкт|портфоліо|приклад|\bwerk\b|voorbeeld|trabajos?|proyectos?|ejemplos?|أعمال|مشاريع|أمثلة)/.test(s))
    return { matched: true, action: { kind: 'nav', target: '#projects', label: lblWork }, text: L(
      "Featured: marinek.store (Next.js 14, payments + Telegram automation) and this portfolio. Want to see them?",
      "Uitgelicht: marinek.store (Next.js 14, betalingen + Telegram) en dit portfolio. Bekijken?",
      "من الأعمال: marinek.store (Next.js 14، مدفوعات + تيليجرام) وهذا الموقع. أعرضها؟",
      "Destacado: marinek.store (Next.js 14, pagos + Telegram) y este portfolio. ¿Los ves?",
    ) };

  // About
  if (/(about (you|stepan|him)|who are you|who is stepan|your background|про себе|про степан|хто ти|over (jou|stepan)|wie ben je|sobre (ti|stepan|él)|quién eres|من أنت|نبذة)/.test(s))
    return { matched: true, action: { kind: 'nav', target: '#about', label: lblAbout }, text: L(
      "Stepan Roze — Front-End / JavaScript developer, 8+ years, Belgium. React, Vue, Next.js, TypeScript, Magento. More in the About section.",
      "Stepan Roze — Front-End / JavaScript developer, 8+ jaar, België. React, Vue, Next.js, TypeScript, Magento. Meer in About.",
      "ستيبان روز — مطور Front-End / JavaScript، 8+ سنوات، بلجيكا. المزيد في قسم نبذة.",
      "Stepan Roze — desarrollador Front-End / JavaScript, 8+ años, Bélgica. Más en Sobre mí.",
    ) };

  // Contact
  if (/(contact|reach (you|him|stepan)|get in touch|звʼяз|звяз|контакт|contacto|contact opnemen|اتصال|تواصل)/.test(s))
    return { matched: true, action: { kind: 'nav', target: '#contact', label: lblContact }, text: L(
      "Reach Stepan at hello@roze.live — replies within the day. Or open the contact form",
      "Mail Stepan: hello@roze.live — reactie binnen de dag. Of open het formulier",
      "راسل ستيبان: hello@roze.live — رد خلال اليوم. أو افتح النموذج",
      "Escribe a Stepan: hello@roze.live — respuesta el mismo día. O abre el formulario",
    ) };

  // Hire / start → funnel
  if (/(\bhire\b|let'?s (build|work|start)|start a project|work with (you|me)|найняти|почати проект|inhuren|samenwerken|contratar|trabajar contigo|empezar (un )?proyecto|توظيف|لنبدأ)/.test(s))
    return { matched: true, action: { kind: 'quote', label: lblQuote }, text: L(
      "Love it! I'll grab a few details for Stepan and get you a fast quote. Ready?",
      "Top! Ik verzamel wat details voor Stepan voor een snelle offerte. Klaar?",
      "رائع! سآخذ بعض التفاصيل لستيبان لعرض سريع. جاهز؟",
      "¡Genial! Tomo unos datos para Stepan y te doy un presupuesto rápido. ¿Listo?",
    ) };

  // Spoken languages
  if (/(languages? (do )?you speak|do you speak|fluent|native language|які мови|розмовляєш|talen spreek|welke talen|idiomas hablas|qué idiomas|تتحدث|لغات تتكلم)/.test(s))
    return { matched: true, text: L(
      "Stepan speaks Ukrainian (native) & English, and is learning Dutch. This site & chat work in English, Ukrainian, Dutch, Arabic and Spanish.",
      "Stepan spreekt Oekraïens (moedertaal) & Engels, en leert Nederlands. Site & chat: 5 talen.",
      "يتحدث ستيبان الأوكرانية (الأم) والإنجليزية ويتعلّم الهولندية. الموقع بأربع لغات.",
      "Stepan habla ucraniano (nativo) e inglés, y aprende neerlandés. Sitio y chat en 5 idiomas.",
    ) };

  // Location
  if (/(where.*(based|live|located|from)|your location|which country|\bcity\b|belgium|де ти|звідки|локац|waar.*(woon|gevestigd|zit)|locatie|dónde (estás|vives)|ubicación|país|أين (تقيم|تعيش)|بلد)/.test(s))
    return { matched: true, text: L(
      "Based in Belgium (CET), working remotely with clients across Europe and beyond.",
      "België (CET), werkt remote met klanten in heel Europa en daarbuiten.",
      "مقيم في بلجيكا (CET)، أعمل عن بُعد مع عملاء في أوروبا وخارجها.",
      "En Bélgica (CET), trabajo en remoto con clientes de Europa y más allá.",
    ) };

  // Info knowledge base (price / timeline / availability / stack / greeting …)
  const info = localAnswer(input, language);
  if (info) return { matched: true, text: info };

  // Nothing recognised
  return { matched: false, text: L(
    "I can show you around (services, projects, process, contact), answer pricing/timeline/stack questions, or start a quick quote. What would you like?",
    "Ik kan je rondleiden (diensten, projecten, werkwijze, contact), prijs/planning/stack beantwoorden of een offerte starten. Wat wil je?",
    "يمكنني إرشادك (خدمات، مشاريع، آلية العمل، تواصل)، والإجابة عن الأسعار/المدة/الأدوات، أو بدء عرض سعر. ماذا تريد؟",
    "Puedo guiarte (servicios, proyectos, proceso, contacto), responder sobre precio/plazo/stack o iniciar un presupuesto. ¿Qué quieres?",
  ) };
}

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasServiceContext, setHasServiceContext] = useState(false);
  const [isRateLimited] = useState(false);
  const [, setRequestCount] = useState(0);
  const [, setShowQuickQuestions] = useState(true);
  const [stage, setStage] = useState<Stage>('intro');
  const [lead, setLead] = useState<Lead>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();
  // The chat used to be hidden in CV mode, on the reasoning that a lead funnel
  // asking for a budget is useless to a recruiter. True of that funnel — but the
  // conclusion was wrong: it left the CV with no way to ask anything at all,
  // including the one question a Benelux employer needs answered and cannot ask
  // out loud. So company mode gets its own track (lib/hiring-assistant.ts) and
  // its own three-field funnel, and the widget is shown in both.
  const { setViewMode, isClientMode } = useViewMode();
  const rafRef = useRef<number>(0);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Scroll tracking - optimized with rAF
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          setScrollProgress(progress);
          setIsVisible(scrollTop > 200);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Lock scroll when chat open
  useEffect(() => {
    if (isChatOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => unlockScroll();
  }, [isChatOpen]);

  // Listen for openChatBot event
  useEffect(() => {
    const handleOpenChatBot = (event: Event) => {
      const serviceName = sessionStorage.getItem('chatbotServiceName');
      const experience = sessionStorage.getItem('chatbotExperience');
      const experienceRole = sessionStorage.getItem('chatbotExperienceRole');
      const experiencePeriod = sessionStorage.getItem('chatbotExperiencePeriod');

      const F = funnelStrings(language);

      // Opened from hero / generic — let the default welcome effect run the funnel.
      if (event && !serviceName && !experience) {
        setIsChatOpen(true);
        return;
      }

      // Opened from a service card — pre-fill the project and jump to budget.
      if (serviceName) {
        setHasServiceContext(true);
        setIsChatOpen(true);
        setLead({ project: serviceName });
        setStage('budget');
        setShowQuickQuestions(true);
        setTimeout(() => {
          setMessages([{
            id: Date.now(),
            text: `${serviceName} — great choice!\n\n${F.askBudget}`,
            sender: "bot",
            timestamp: new Date(),
          }]);
          sessionStorage.removeItem('chatbotService');
          sessionStorage.removeItem('chatbotServiceName');
        }, 300);
      } else if (experience) {
        // Opened from an experience card — free Q&A mode.
        setHasServiceContext(true);
        setIsChatOpen(true);
        setStage('qa');
        setShowQuickQuestions(true);
        setTimeout(() => {
          setMessages([{
            id: Date.now(),
            text: `Hi! You're looking at my work at ${experience} as ${experienceRole} (${experiencePeriod}).\n\nAsk me anything about it — or tap “${F.labels.quote}” to start a project.`,
            sender: "bot",
            timestamp: new Date(),
          }]);
          sessionStorage.removeItem('chatbotExperience');
          sessionStorage.removeItem('chatbotExperienceRole');
          sessionStorage.removeItem('chatbotExperiencePeriod');
        }, 300);
      }
    };

    window.addEventListener('openChatBot', handleOpenChatBot);
    return () => window.removeEventListener('openChatBot', handleOpenChatBot);
  }, [messages.length]);

  // Default welcome — starts the sales funnel at the "what to build" step.
  useEffect(() => {
    if (isChatOpen && messages.length === 0 && !hasServiceContext) {
      setStage('intro');
      setShowQuickQuestions(true);
      setTimeout(() => {
        setMessages([{
          id: Date.now(),
          text: isClientMode ? funnelStrings(language).welcome : hiringStrings(language).welcome,
          sender: "bot",
          timestamp: new Date(),
        }]);
      }, 500);
    }
  }, [isChatOpen, messages.length, hasServiceContext, language, isClientMode]);

  // Switching mode mid-conversation leaves a client funnel sitting in front of
  // a recruiter (or the reverse). Clear it so the right script starts fresh.
  useEffect(() => {
    setMessages([]);
    setStage('intro');
    setLead({});
    setHasServiceContext(false);
  }, [isClientMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Detect language
  const detectLanguage = (text: string): string => {
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/\b(hallo|hoi|dank|graag|bent|heeft|waar|wat|wanneer|hoe|waarom)\b/i.test(text)) return 'nl';
    if (/\b(hola|gracias|cómo|qué|dónde|cuándo|buenos días)\b/i.test(text)) return 'es';
    return 'en';
  };

  const pushMsg = (text: string, sender: "user" | "bot", action?: ChatAction) =>
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), text, sender, timestamp: new Date(), action }]);

  const botSay = (text: string, delay = 450, action?: ChatAction) => {
    setIsTyping(true);
    window.setTimeout(() => {
      setIsTyping(false);
      pushMsg(text, "bot", action);
    }, delay);
  };

  // Execute an action button (navigate the site, switch view, start a quote…).
  const runAction = (a: ChatAction) => {
    if (a.kind === 'quote') {
      setStage('intro');
      botSay(funnelStrings(language).reask, 250);
      return;
    }
    if (a.kind === 'link') {
      window.open(a.href, a.href.startsWith('http') ? '_blank' : '_self', 'noopener,noreferrer');
      return;
    }
    if (a.kind === 'view') {
      setViewMode(a.mode);
      setIsChatOpen(false);
      return;
    }
    // nav — close chat, then scroll to the section (switching mode if needed)
    setIsChatOpen(false);
    const clientOnly = ['#services', '#how-i-work'].includes(a.target);
    const cvOnly = ['#experience'].includes(a.target);
    window.setTimeout(() => {
      const el = document.querySelector(a.target);
      if (!el && (clientOnly || cvOnly)) {
        setViewMode(clientOnly ? 'client' : 'cv');
        window.setTimeout(() => document.querySelector(a.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 450);
        return;
      }
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 350);
  };

  // Send the collected lead to Stepan (saved server-side + emailed via Resend).
  const submitLead = (finalLead: Lead) => {
    const F = funnelStrings(language);
    botSay(F.sending, 200);
    // Netlify Forms, which emails it on. The Supabase function this used to
    // post to is switched off, so every lead the chat collected was lost.
    postLead({
      name: finalLead.name || 'Website visitor',
      email: finalLead.email,
      service: isClientMode
        ? `Chat lead — ${finalLead.project || 'General'}`
        : `Hiring enquiry — ${finalLead.role || 'Role not stated'}`,
      source: isClientMode ? 'chat-client' : 'chat-company',
      message:
        `New lead from the site chat\n\n` +
        `• Mode: ${isClientMode ? 'client' : 'company'}\n` +
        `• Project: ${finalLead.project || '—'}\n` +
        `• Role: ${finalLead.role || '—'}\n` +
        `• Budget: ${finalLead.budget || '—'}\n` +
        `• Timeline: ${finalLead.timeline || '—'}\n` +
        `• Name: ${finalLead.name || '—'}\n` +
        `• Email: ${finalLead.email || '—'}\n` +
        `• Language: ${language}`,
    })
      .then(ok => { if (!ok) throw new Error('form endpoint rejected the lead'); })
      .then(() => {
        setStage('done');
        // Whatever the chat collected is already written into the WhatsApp
        // message, so nobody has to type any of it a second time.
        const wa: ChatAction = {
          kind: 'link',
          href: whatsappHandoff(language, finalLead),
          label: hiringFunnel(language).labels.whatsapp,
        };
        botSay(
          isClientMode
            ? funnelStrings(language).thanks(finalLead.name || '', finalLead.email || '')
            : hiringFunnel(language).done(finalLead.name || '', finalLead.email || ''),
          600,
          wa,
        );
      })
      .catch(err => {
        console.error('Lead submit error:', err);
        setStage('done');
        // Not delivered - most likely RESEND_API_KEY missing, which
        // /api/contact answers as 503. The hand-off matters more here, not
        // less: it is the only route left that does not make him retype
        // anything. Two of them, because a visitor on a desktop without
        // WhatsApp Web has nowhere to go with the first one.
        botSay(funnelStrings(language).failed(finalLead.email || ''), 600, {
          kind: 'link',
          href: whatsappHandoff(language, finalLead),
          label: hiringFunnel(language).labels.whatsapp,
        });
        window.setTimeout(() => {
          pushMsg(
            language === 'nl' ? 'Liever mailen? Ik zet je antwoorden alvast in het bericht.'
              : language === 'ar' ? 'تفضّل البريد؟ سأضع إجاباتك في الرسالة سلفاً.'
              : language === 'es' ? '¿Prefieres el correo? Dejo tus respuestas ya escritas.'
              : 'Prefer email? I will put your answers into the message for you.',
            'bot',
            { kind: 'link', href: mailtoLead(language, finalLead), label: 'Email' },
          );
        }, 1400);
      });
  };

  // One funnel step: record the answer for the current stage and ask the next.
  const processAnswer = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const F = funnelStrings(language);

    const detected = detectLanguage(text);
    if (detected !== language && ['en', 'nl', 'ar', 'es'].includes(detected)) setLanguage(detected as any);

    // Company mode runs its own three questions and its own answers.
    if (!isClientMode) {
      const HF = hiringFunnel(language);
      switch (stage) {
        case 'role':
          setLead(l => ({ ...l, role: text }));
          setStage('name');
          botSay(HF.askName);
          return;
        case 'name':
          setLead(l => ({ ...l, name: text }));
          setStage('email');
          botSay(HF.askEmail);
          return;
        case 'email': {
          if (!emailRe.test(text)) { botSay(HF.badEmail, 250); return; }
          const finalLead = { ...lead, email: text };
          setLead(finalLead);
          submitLead(finalLead);
          return;
        }
        default: {
          const r = hiringAnswer(text, language);
          botSay(r.text, 450);
          return;
        }
      }
    }

    switch (stage) {
      case 'intro': {
        // If it's a recognised question / navigation, answer it and stay here.
        const r = assistantReply(text, language);
        if (r.matched) { botSay(r.text, 450, r.action); return; }
        // Otherwise treat the text as the project description and advance.
        setLead(l => ({ ...l, project: text }));
        setStage('budget');
        botSay(F.askBudget);
        break;
      }
      case 'budget':
        setLead(l => ({ ...l, budget: text }));
        setStage('timeline');
        botSay(F.askTimeline);
        break;
      case 'timeline':
        setLead(l => ({ ...l, timeline: text }));
        setStage('name');
        botSay(F.askName);
        break;
      case 'name':
        setLead(l => ({ ...l, name: text }));
        setStage('email');
        botSay(F.askEmail);
        break;
      case 'email': {
        if (!emailRe.test(text)) { botSay(F.badEmail, 250); return; }
        const finalLead = { ...lead, email: text };
        setLead(finalLead);
        submitLead(finalLead);
        break;
      }
      case 'qa':
      case 'done':
      default: {
        const r = assistantReply(text, language);
        botSay(r.text, 450, r.action);
        break;
      }
    }
  };

  const handleSend = (overrideMessage?: string) => {
    const messageToSend = overrideMessage ?? inputValue;
    if (!messageToSend || !messageToSend.trim()) return;
    setShowQuickQuestions(false);
    pushMsg(messageToSend, "user");
    setInputValue("");
    setRequestCount(prev => prev + 1);
    processAnswer(messageToSend);
  };

  // Quick-reply chip tap.
  const handleChip = (chip: { label: string; value: string; special?: 'qa' | 'quote' | 'hire' | 'wa' }) => {
    const F = funnelStrings(language);
    pushMsg(chip.label, "user");
    if (chip.special === 'qa') { setStage('qa'); botSay(F.qaIntro, 300); return; }
    if (chip.special === 'quote') { setStage('intro'); botSay(F.reask, 300); return; }
    if (chip.special === 'hire') { setStage('role'); botSay(hiringFunnel(language).start, 300); return; }
    if (chip.special === 'wa') { window.open(whatsappHandoff(language, lead), '_blank', 'noopener,noreferrer'); return; }
    processAnswer(chip.value);
  };

  // Quick-reply chips shown under the messages, driven by the current stage.
  const chipsForStage = (): { label: string; value: string; special?: 'qa' | 'quote' | 'hire' | 'wa' }[] => {
    const F = funnelStrings(language);
    const one = (label: string) => ({ label, value: label });

    // Company mode: topics, then a way to leave a role. No budget, no timeline.
    if (!isClientMode) {
      const H = hiringStrings(language);
      const HF = hiringFunnel(language);
      if (stage === 'role' || stage === 'name' || stage === 'email') return [];
      if (stage === 'done') return [{ label: HF.labels.whatsapp, value: '', special: 'wa' }];
      return [
        one(H.labels.permit), one(H.labels.location), one(H.labels.stack),
        one(H.labels.languages), one(H.labels.experience),
        { label: HF.labels.talk, value: '', special: 'hire' },
      ];
    }

    switch (stage) {
      case 'intro':
        return [one(F.labels.website), one(F.labels.bot), one(F.labels.webapp), one(F.labels.ecom), { label: F.labels.ask, value: '', special: 'qa' }];
      case 'budget':
        return [F.labels.bUnder500, F.labels.b500, F.labels.b1500, F.labels.b5000, F.labels.bNotSure].map(one);
      case 'timeline':
        return [F.labels.tAsap, F.labels.t24, F.labels.t13, F.labels.tflex].map(one);
      case 'qa':
      case 'done':
        return [{ label: F.labels.quote, value: '', special: 'quote' }];
      default:
        return [];
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99989]"
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] h-[calc(100dvh-120px)] sm:h-[600px] max-h-[700px] bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/50 rounded-2xl shadow-[0_0_24px_rgba(0,217,255,0.18)] z-[99990] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center">
                      <Bot className="w-6 h-6 text-[var(--accent-primary)]" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    {/* A chat header is a UI label, not a display heading.
                        index.css puts var(--font-display) on every h1–h6, which
                        set this line in the heading face at 13px where it only
                        looked wide. Force the body face here. */}
                    <h3 className="text-sm font-semibold text-black tracking-normal [font-family:var(--font-body)]">
                      {isClientMode ? "Roze — project assistant" : "Roze — hiring assistant"}
                    </h3>
                    {/* The subtitle is a promise, so it has to match the script
                        behind it: quotes for a client, and the three things a
                        hiring side checks first for a company. */}
                    <p className="text-[10px] text-black/60 font-mono tracking-wide">
                      {isClientMode
                        ? "ONLINE • FAST QUOTES"
                        : "ONLINE • PERMIT, STACK, LANGUAGES"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-black/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--bg-secondary)]/20">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.sender === "user"
                        ? "bg-gradient-to-br from-[var(--accent-primary)] to-cyan-400"
                        : "bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                    }`}>
                      {message.sender === "user" ? (
                        <User className="w-3.5 h-3.5 text-black" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      )}
                    </div>
                    <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black"
                        : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]"
                    }`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}>
                      <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                        {message.text}
                      </p>
                      {message.sender === "bot" && message.action && (
                        <button
                          onClick={() => runAction(message.action!)}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-black hover:brightness-110 active:scale-95 transition"
                        >
                          {message.action.label}
                          <ArrowUp className="w-3.5 h-3.5 rotate-45" />
                        </button>
                      )}
                      <p className={`text-[10px] mt-1 ${
                        message.sender === "user" ? "text-black/50" : "text-[var(--text-muted)]"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                      <Bot className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    </div>
                    <div className="rounded-xl px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                      <div className="flex gap-1">
                        {[0, 0.15, 0.3].map((delay, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-[var(--accent-primary)] rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick-reply chips (stage-driven sales funnel) */}
              {!isTyping && chipsForStage().length > 0 && (
                <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
                  <div className="flex flex-wrap gap-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    {chipsForStage().map((chip) => (
                      <button
                        key={chip.label}
                        onClick={() => handleChip(chip)}
                        className="text-xs px-3 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)]/10 border border-[var(--border-color)] hover:border-[var(--accent-primary)]/40 rounded-lg transition-all font-medium"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-primary)] flex-shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={
                      stage === 'email' ? 'you@email.com' :
                      stage === 'name' ? (language === 'nl' ? 'Je naam…' : language === 'es' ? 'Tu nombre…' : language === 'ar' ? 'اسمك…' : 'Your name…') :
                      (language === 'nl' ? 'Typ een bericht…' : language === 'es' ? 'Escribe un mensaje…' : language === 'ar' ? 'اكتب رسالة…' : 'Type a message…')
                    }
                    className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 text-sm"
                    inputMode={stage === 'email' ? 'email' : 'text'}
                    disabled={isRateLimited}
                  />
                  <motion.button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isRateLimited}
                    className="px-4 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-[9px] text-[var(--text-muted)] text-center mt-1.5 font-mono">
                  {
                   language === 'nl' ? 'Reactie binnen de dag • hello@roze.live' :
                   language === 'es' ? 'Respuesta el mismo día • hello@roze.live' :
                   language === 'ar' ? 'رد خلال اليوم • hello@roze.live' :
                   'Replies within the day • hello@roze.live'}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      {/* bottom rises by whatever the cookie banner is occupying; the
          variable is unset the rest of the time, so this is just bottom-6 */}
      <div
        className="fixed right-4 sm:right-6 z-[99900] flex flex-col gap-3 items-center"
        style={{ bottom: 'calc(1.5rem + var(--cookie-banner-h, 0px))' }}
      >
        {/* Scroll to Top with Progress Ring */}
        <AnimatePresence>
          {isVisible && (
            <motion.button
              onClick={scrollToTop}
              className="relative w-12 h-12 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-2 border-[var(--accent-primary)]/40 rounded-full flex items-center justify-center shadow-lg hover:border-[var(--accent-primary)] hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all group"
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to top"
            >
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(0,217,255,0.15)" strokeWidth="2" />
                <circle
                  cx="24" cy="24" r="22" fill="none"
                  stroke="#00d9ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200"
                />
              </svg>

              <ArrowUp className="w-5 h-5 text-[var(--accent-primary)] group-hover:text-[var(--accent-primary)] relative z-10" strokeWidth={2.5} />

              {/* Progress percentage on hover */}
              <div className="absolute -left-12 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-[var(--accent-primary)] bg-[var(--bg-primary)]/90 border border-[var(--border-color)] rounded px-1.5 py-0.5 pointer-events-none">
                {Math.round(scrollProgress)}%
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Bot Button — both modes, each with its own script */}
        {(
        <motion.button
          id="chat-bot-button"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative w-14 h-14 bg-gradient-to-br from-[var(--accent-primary)] to-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(0,217,255,0.18)] hover:shadow-[0_0_40px_rgba(0,217,255,0.6)] transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <AnimatePresence mode="wait">
            {isChatOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="w-6 h-6 text-black" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <MessageCircle className="w-6 h-6 text-black" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification Badge */}
          {!isChatOpen && messages.length === 0 && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                1
              </motion.span>
            </motion.div>
          )}

          {/* Pulse */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[var(--accent-primary)]"
            animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
        )}
      </div>
    </>
  );
}