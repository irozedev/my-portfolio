/**
 * The assistant's answers for company mode.
 *
 * The chat was built as a lead funnel: what do you want built, what is the
 * budget, when do you need it, leave your email. In CV mode the reader is a
 * recruiter or a hiring manager and every one of those questions is the wrong
 * question, so the widget was simply hidden there — which left the CV with no
 * way to ask anything at all.
 *
 * This is the other half: the four or five things a hiring side actually asks,
 * answered from what the page already states, and then a funnel of its own.
 *
 * Every fact here is on the site somewhere else too, and that is deliberate —
 * a visitor who is told one thing by the page and another by the assistant
 * stops believing both:
 *   right to work, contract   → data/experience.ts, cv-print.tsx
 *   location and radius       → seo-head.tsx
 *   languages and levels      → languages-modern.tsx  (English B1, Dutch A2)
 *   stack and years           → data/experience.ts
 *
 * Two things are deliberately NOT answered, because the site does not state
 * them and inventing either would be worse than saying so: salary, and notice
 * period. Both route to email.
 *
 * There IS a funnel here, it just collects different fields. A recruiter who
 * has read enough should be able to leave a role and a way to reply without
 * hunting for the contact form, exactly as a client can.
 */

export type Lang = "en" | "nl" | "ar" | "es";

const pick = (language: string, en: string, nl: string, ar: string, es: string) =>
  language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

export function hiringStrings(language: string) {
  const L = (en: string, nl: string, ar: string, es: string) => pick(language, en, nl, ar, es);

  return {
    welcome: L(
      "Hi. I answer for Stepan on the things a hiring side usually checks first — right to work, location, stack, languages.\n\nWhat would you like to know?",
      "Hoi. Ik beantwoord voor Stepan wat een werkgever meestal als eerste checkt — werkvergunning, locatie, stack, talen.\n\nWat wil je weten?",
      "مرحباً. أجيب نيابةً عن ستيبان عمّا يتحقق منه صاحب العمل أولاً — حق العمل، الموقع، الأدوات، اللغات.\n\nما الذي تريد معرفته؟",
      "Hola. Respondo por Stepan lo que una empresa suele comprobar primero — permiso de trabajo, ubicación, stack, idiomas.\n\n¿Qué quieres saber?",
    ),
    labels: {
      permit: L("Right to work", "Werkvergunning", "حق العمل", "Permiso de trabajo"),
      location: L("Location", "Locatie", "الموقع", "Ubicación"),
      stack: L("Stack", "Stack", "الأدوات", "Stack"),
      languages: L("Languages", "Talen", "اللغات", "Idiomas"),
      experience: L("Experience", "Ervaring", "الخبرة", "Experiencia"),
      contact: L("Contact & CV", "Contact & cv", "التواصل والسيرة", "Contacto y CV"),
    },
    fallback: L(
      "I only answer from what is on this page, so I would rather not guess at that one. Stepan reads rozedev095@gmail.com himself and replies the same day.",
      "Ik antwoord alleen met wat op deze pagina staat, dus daar gok ik liever niet naar. Stepan leest rozedev095@gmail.com zelf en reageert dezelfde dag.",
      "أجيب فقط بما هو موجود على هذه الصفحة، ولا أفضّل التخمين. ستيبان يقرأ rozedev095@gmail.com بنفسه ويرد في نفس اليوم.",
      "Solo respondo con lo que hay en esta página, así que prefiero no adivinar. Stepan lee rozedev095@gmail.com y responde el mismo día.",
    ),
  };
}

type Answer = { text: string; matched: boolean };

export function hiringAnswer(input: string, language: string): Answer {
  const s = input.toLowerCase();
  const L = (en: string, nl: string, ar: string, es: string) => pick(language, en, nl, ar, es);
  const hit = (text: string): Answer => ({ text, matched: true });

  // right to work — the first thing a Benelux employer needs and cannot ask
  // outright, so it is answered before anything else
  if (/(permit|visa|sponsor|work authoris|authoriz|right to work|verblijf|vergunning|sponsoring|werkvergunning|permiso|patrocinio|تأشيرة|إقامة)/.test(s))
    return hit(L(
      "Permanent contract in Belgium, indefinite duration. No sponsorship needed, no permit to arrange — he is settled and already working here.",
      "Vast contract in België, onbepaalde duur. Geen sponsoring nodig, geen vergunning te regelen — hij is gevestigd en werkt hier al.",
      "عقد دائم في بلجيكا وغير محدّد المدة. لا حاجة إلى كفالة أو تصريح — فهو مقيم ويعمل هنا بالفعل.",
      "Contrato indefinido en Bélgica. No necesita patrocinio ni permiso — ya reside y trabaja aquí.",
    ));

  if (/(where|location|based|relocat|commut|remote|onsite|on-site|hybrid|waar|locatie|woont|afstand|kantoor|hybride|dónde|ubicaci|remoto|híbrido|أين|الموقع|بعد)/.test(s))
    return hit(L(
      "Lommel, Limburg — the Belgian side, close to the Dutch border. Open to roles in Flanders, the Netherlands, or remote.",
      "Lommel, Limburg — Belgische kant, vlak bij de Nederlandse grens. Open voor functies in Vlaanderen, Nederland of op afstand.",
      "لوميل، ليمبورغ — الجانب البلجيكي قرب الحدود الهولندية. منفتح على وظائف في فلاندرز أو هولندا أو عن بُعد.",
      "Lommel, Limburgo — lado belga, junto a la frontera neerlandesa. Abierto a puestos en Flandes, Países Bajos o en remoto.",
    ));

  if (/(language|speak|dutch|english|nederlands|engels|taal|talen|spreek|idioma|hablas|neerland|inglés|لغة|اللغات|هولندي|إنجليزي)/.test(s))
    return hit(L(
      "Ukrainian is his mother tongue. English is B1, working level — enough for standups, code review and written specs. Dutch is A2, NT2 1.2 certified, and still improving.\n\nStated plainly on purpose: he would rather you know the level now than find out in week two.",
      "Oekraïens is zijn moedertaal. Engels is B1, werkniveau — genoeg voor standups, code review en geschreven specificaties. Nederlands is A2, NT2 1.2 behaald, en gaat nog vooruit.\n\nBewust zo eerlijk: liever nu duidelijk dan in week twee.",
      "الأوكرانية لغته الأم. الإنجليزية B1 مستوى عمل — تكفي للاجتماعات ومراجعة الكود والمواصفات المكتوبة. الهولندية A2 بشهادة NT2 1.2 وما زالت تتحسّن.\n\nقيلت بصراحة عمداً: أن تعرف المستوى الآن أفضل من اكتشافه لاحقاً.",
      "El ucraniano es su lengua materna. Inglés B1, nivel de trabajo — suficiente para dailies, revisión de código y especificaciones escritas. Neerlandés A2, certificado NT2 1.2, y sigue mejorando.\n\nDicho así a propósito: mejor saberlo ahora que en la segunda semana.",
    ));

  if (/(stack|tech|technolog|framework|react|vue|typescript|dynamics|magento|node|skills|vaardig|technisch|habilidad|tecnolog|أدوات|تقني|مهارات)/.test(s))
    return hit(L(
      "Front-end first: React, Next.js, Vue, TypeScript, Tailwind. Magento on the commerce side.\n\nThe less common half is MS Dynamics 365 XRM — two years of CRM web resources in plain functional JavaScript for a national bank, plus a Vue signing app on canvas.",
      "Front-end voorop: React, Next.js, Vue, TypeScript, Tailwind. Magento aan de commerce-kant.\n\nDe zeldzamere helft is MS Dynamics 365 XRM — twee jaar CRM-webresources in puur functioneel JavaScript voor een nationale bank, plus een Vue-ondertekenapp op canvas.",
      "الواجهات أولاً: React وNext.js وVue وTypeScript وTailwind، وMagento في التجارة.\n\nالجانب الأندر هو MS Dynamics 365 XRM — سنتان من موارد CRM بجافاسكربت وظيفي لأحد البنوك الوطنية، مع تطبيق توقيع بـ Vue على Canvas.",
      "Front-end primero: React, Next.js, Vue, TypeScript, Tailwind. Magento en comercio.\n\nLa mitad menos común es MS Dynamics 365 XRM — dos años de recursos web de CRM en JavaScript funcional para un banco nacional, más una app de firma en Vue sobre canvas.",
    ));

  if (/(experience|years|background|career|history|ervaring|jaar|loopbaan|achtergrond|experiencia|años|trayector|خبرة|سنوات|مسيرة)/.test(s))
    return hit(L(
      "Eight years of commercial front-end. Product pages for childrensalon.com during a Magento 1.9 to Symfony migration, front-end on the vogacloset.com marketplace, then two years on banking CRM at E-Consulting. Twenty-plus freelance clients before that.\n\nThe full timeline is on this page under Experience.",
      "Acht jaar commerciële front-end. Productpagina's voor childrensalon.com tijdens een migratie van Magento 1.9 naar Symfony, front-end op de marktplaats vogacloset.com, daarna twee jaar bank-CRM bij E-Consulting. Daarvoor twintig-plus freelanceklanten.\n\nDe volledige tijdlijn staat op deze pagina onder Ervaring.",
      "ثماني سنوات في واجهات تجارية. صفحات منتجات لـ childrensalon.com أثناء الانتقال من Magento 1.9 إلى Symfony، وواجهات في سوق vogacloset.com، ثم سنتان في CRM مصرفي لدى E-Consulting، وقبلها أكثر من عشرين عميلاً بالعمل الحر.\n\nالجدول الكامل في قسم الخبرة بهذه الصفحة.",
      "Ocho años de front-end comercial. Páginas de producto para childrensalon.com durante la migración de Magento 1.9 a Symfony, front-end en el marketplace vogacloset.com, después dos años de CRM bancario en E-Consulting. Antes, más de veinte clientes freelance.\n\nLa cronología completa está en esta página, en Experiencia.",
    ));

  if (/(contact|email|reach|cv|resume|apply|hire|interview|solliciter|bereik|mail|contacto|correo|currículum|entrevista|تواصل|بريد|سيرة|مقابلة)/.test(s))
    return hit(L(
      "rozedev095@gmail.com — he reads it himself and replies the same day. The CV downloads from the button in the header, and LinkedIn is linked in the footer.",
      "rozedev095@gmail.com — hij leest het zelf en reageert dezelfde dag. Het cv download je via de knop in de header, LinkedIn staat in de footer.",
      "rozedev095@gmail.com — يقرأه بنفسه ويرد في نفس اليوم. السيرة الذاتية من الزر في الأعلى، وLinkedIn في التذييل.",
      "rozedev095@gmail.com — lo lee él y responde el mismo día. El CV se descarga desde el botón de la cabecera, y LinkedIn está en el pie.",
    ));

  // salary and notice: the page states neither, so neither gets invented
  if (/(salary|pay|compensation|wage|salaris|loon|vergoeding|sueldo|salario|راتب|أجر|notice|opzeg|termijn|preaviso|إشعار)/.test(s))
    return hit(L(
      "That is not something this page states, and I am not going to invent a number. Ask Stepan directly at rozedev095@gmail.com — he answers that kind of question the same day.",
      "Dat staat niet op deze pagina, en ik ga geen bedrag verzinnen. Vraag het Stepan direct via rozedev095@gmail.com — dat soort vragen beantwoordt hij dezelfde dag.",
      "هذا غير مذكور في الصفحة، ولن أختلق رقماً. اسأل ستيبان مباشرة على rozedev095@gmail.com — يرد على هذا النوع من الأسئلة في نفس اليوم.",
      "Eso no aparece en esta página y no voy a inventar una cifra. Pregúntale a Stepan en rozedev095@gmail.com — responde ese tipo de preguntas el mismo día.",
    ));

  return { text: hiringStrings(language).fallback, matched: false };
}


/* ---------------------------------------------------------------------------
 * The hiring funnel: role -> name -> email. Three questions, not five - a
 * recruiter is not buying anything, they are checking whether it is worth a
 * call, and every extra field is a reason to close the tab.
 * ------------------------------------------------------------------------ */

export function hiringFunnel(language: string) {
  const L = (en: string, nl: string, ar: string, es: string) => pick(language, en, nl, ar, es);

  return {
    start: L(
      "Happy to pass it on. What is the role, and which company?",
      "Geef ik door. Om welke functie gaat het, en welk bedrijf?",
      "سأنقل ذلك. ما الوظيفة وأي شركة؟",
      "Se lo paso. ¿Qué puesto es, y qué empresa?",
    ),
    askName: L("And your name?", "En je naam?", "واسمك؟", "¿Y tu nombre?"),
    askEmail: L(
      "Where should Stepan reply?",
      "Waar mag Stepan antwoorden?",
      "أين يرد ستيبان؟",
      "¿Dónde debe responder Stepan?",
    ),
    badEmail: L(
      "That address does not look right — try once more?",
      "Dat adres klopt niet — nog een keer?",
      "لا يبدو البريد صحيحاً — مرة أخرى؟",
      "Esa dirección no parece válida — ¿otra vez?",
    ),
    done: (n: string, e: string) => L(
      `Thanks, ${n}. It is with Stepan and he replies the same day at ${e}.

If it is quicker for you, the button below opens WhatsApp with all of this already written out.`,
      `Bedankt, ${n}. Het staat bij Stepan en hij reageert dezelfde dag op ${e}.

Gaat het sneller via WhatsApp? De knop hieronder zet dit alvast in het bericht.`,
      `شكراً ${n}. وصل الطلب إلى ستيبان وسيرد في نفس اليوم على ${e}.

إن كان واتساب أسرع لك، الزر بالأسفل يفتحه والرسالة مكتوبة سلفاً.`,
      `Gracias, ${n}. Está con Stepan y responde el mismo día a ${e}.

Si te va mejor WhatsApp, el botón de abajo lo abre con todo ya escrito.`,
    ),
    labels: {
      talk: L("Talk to Stepan", "Stepan spreken", "التحدث إلى ستيبان", "Hablar con Stepan"),
      whatsapp: L("Continue on WhatsApp", "Verder op WhatsApp", "المتابعة على واتساب", "Seguir por WhatsApp"),
    },
  };
}

/* ---------------------------------------------------------------------------
 * WhatsApp hand-off, shared by both modes.
 *
 * The point is that nothing gets retyped. Whatever the chat already collected
 * goes into the message body, so the visitor lands in WhatsApp with the thread
 * already started rather than staring at an empty box wondering what to say.
 *
 * wa.me wants digits only - no +, no spaces. Same number as the contact card
 * in contact-section.tsx; if one changes, change both.
 * ------------------------------------------------------------------------ */

export const WHATSAPP_NUMBER = "32469631424";

export function whatsappHandoff(
  language: string,
  fields: { role?: string; project?: string; budget?: string; timeline?: string; name?: string; email?: string },
): string {
  const L = (en: string, nl: string, ar: string, es: string) => pick(language, en, nl, ar, es);

  const lines: string[] = [
    L("Hi Stepan, coming from your site.", "Hoi Stepan, ik kom van je site.", "مرحباً ستيبان، جئت من موقعك.", "Hola Stepan, vengo de tu web."),
  ];

  const add = (label: string, value?: string) => {
    if (value && value.trim()) lines.push(`${label}: ${value.trim()}`);
  };

  add(L("Role", "Functie", "الوظيفة", "Puesto"), fields.role);
  add(L("Project", "Project", "المشروع", "Proyecto"), fields.project);
  add(L("Budget", "Budget", "الميزانية", "Presupuesto"), fields.budget);
  add(L("Timing", "Planning", "التوقيت", "Plazo"), fields.timeline);
  add(L("Name", "Naam", "الاسم", "Nombre"), fields.name);
  add(L("Email", "E-mail", "البريد", "Email"), fields.email);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
