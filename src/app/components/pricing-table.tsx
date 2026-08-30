import { useLanguage } from "../contexts/language-context";
import { VIEWPORT, DURATION, EASE } from "../lib/motion";
import { motion } from "motion/react";

/**
 * Prices with durations and scope.
 *
 * The service cards already carry a price, but a price on its own is a number
 * to haggle over: what a buyer wants next is how long it takes and what is
 * inside it. This is that table.
 *
 * Every figure here is the same one the chat assistant quotes in
 * scroll-to-top-button.tsx. They have to stay in step — a visitor who reads
 * €950 on the page and is told something else in the chat stops believing both.
 * If you change a number, change it in both places.
 *
 * Deliberately NOT here: the monthly maintenance retainer that appears on the
 * design canvas. It is not in the site's data anywhere and the assistant knows
 * nothing about it, so publishing a price for it would be committing to a
 * figure that has never been agreed.
 */
export function PricingTable() {
  const { language } = useLanguage();

  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  const rows = [
    {
      what: L("Landing page", "Landingspagina", "صفحة هبوط", "Landing page"),
      scope: L(
        "design · one page · form or WhatsApp · GA4 · hosting set up",
        "ontwerp · 1 pagina · formulier of WhatsApp · GA4 · hosting opgezet",
        "تصميم · صفحة واحدة · نموذج أو واتساب · GA4 · إعداد الاستضافة",
        "diseño · una página · formulario o WhatsApp · GA4 · hosting configurado",
      ),
      price: L("from €950", "vanaf €950", "من €950", "desde €950"),
      time: L("1 – 1.5 weeks", "1 – 1,5 week", "١ – ١٫٥ أسبوع", "1 – 1,5 semanas"),
    },
    {
      what: L("Website, 4 to 6 pages", "Website, 4 tot 6 pagina's", "موقع من 4 إلى 6 صفحات", "Web, 4 a 6 páginas"),
      scope: L(
        "design · CMS you can edit yourself · multilingual · SEO basics · GA4 · forms",
        "ontwerp · CMS om zelf te wijzigen · meertalig · SEO-basis · GA4 · formulieren",
        "تصميم · نظام إدارة تحرّره بنفسك · متعدّد اللغات · أساسيات SEO · GA4 · نماذج",
        "diseño · CMS editable por ti · multiidioma · SEO básico · GA4 · formularios",
      ),
      price: "€2 200 – €3 500",
      time: L("2.5 – 3.5 weeks", "2,5 – 3,5 weken", "٢٫٥ – ٣٫٥ أسابيع", "2,5 – 3,5 semanas"),
    },
    {
      what: L("Web shop", "Webshop", "متجر إلكتروني", "Tienda online"),
      scope: L(
        "catalogue · payment provider · shipping · stock · order status by mail",
        "catalogus · betaalprovider · verzendkoppeling · voorraad · orderstatus per mail",
        "كتالوج · مزوّد دفع · شحن · مخزون · حالة الطلب بالبريد",
        "catálogo · pasarela de pago · envíos · stock · estado del pedido por correo",
      ),
      price: L("from €1 800", "vanaf €1 800", "من €1 800", "desde €1 800"),
      time: L("3 – 5 weeks", "3 – 5 weken", "٣ – ٥ أسابيع", "3 – 5 semanas"),
    },
    {
      what: L("WhatsApp bot", "WhatsApp-bot", "بوت واتساب", "Bot de WhatsApp"),
      scope: L(
        "conversation flow · hooked to your calendar or orders · hand-off to a human",
        "gespreksflow · koppeling met je agenda of orders · overdracht naar een mens",
        "مسار المحادثة · ربط بالتقويم أو الطلبات · تحويل إلى شخص",
        "flujo de conversación · conectado a tu agenda o pedidos · paso a una persona",
      ),
      price: L("from €500", "vanaf €500", "من €500", "desde €500"),
      time: L("about 1 week", "± 1 week", "أسبوع تقريباً", "≈ 1 semana"),
    },
    {
      what: L("Automation", "Automatisering", "أتمتة", "Automatización"),
      scope: L(
        "link between two systems · failures reported to you · log · runs by itself",
        "koppeling tussen twee systemen · foutmeldingen naar jou · logboek · draait vanzelf",
        "ربط بين نظامين · إشعارات الأخطاء لك · سجل · يعمل تلقائياً",
        "enlace entre dos sistemas · errores avisados a ti · registro · funciona solo",
      ),
      price: L("€65 / hour", "€65 / uur", "€65 / ساعة", "€65 / hora"),
      time: L("3 – 5 mornings", "3 – 5 ochtenden", "٣ – ٥ صباحات", "3 – 5 mañanas"),
    },
    {
      what: L("Web app or dashboard, first version", "Webapp of dashboard, eerste versie", "تطبيق ويب أو لوحة، النسخة الأولى", "Web app o panel, primera versión"),
      scope: L(
        "sign-in · roles · screens built to fit · export · API integration",
        "inloggen · rollen · schermen op maat · export · API-koppeling",
        "تسجيل دخول · صلاحيات · شاشات مخصّصة · تصدير · ربط API",
        "acceso · roles · pantallas a medida · exportación · integración API",
      ),
      price: L("€75 / hour", "€75 / uur", "€75 / ساعة", "€75 / hora"),
      time: L("4 – 6 weeks", "4 – 6 weken", "٤ – ٦ أسابيع", "4 – 6 semanas"),
    },
    {
      what: L("Help or advice by the hour", "Losse hulp of advies", "مساعدة أو استشارة بالساعة", "Ayuda o consultoría por hora"),
      scope: L(
        "code review · a bug nobody can find · advice before a rebuild",
        "code review · een bug die niemand vindt · advies bij een verbouwing",
        "مراجعة كود · خطأ لا يجده أحد · استشارة قبل إعادة البناء",
        "revisión de código · un bug que nadie encuentra · consejo antes de rehacer",
      ),
      price: L("€75 / hour", "€75 / uur", "€75 / ساعة", "€75 / hora"),
      time: L("by arrangement", "in overleg", "حسب الاتفاق", "a convenir"),
    },
  ];

  const head = {
    what: L("What", "Wat", "ماذا", "Qué"),
    price: L("Price", "Prijs", "السعر", "Precio"),
    time: L("Lead time", "Doorlooptijd", "المدة", "Plazo"),
  };

  return (
    /* Its own band. On one flat ground the page ran as a single stripe for
       seven screens; a distinct surface is what makes this read as a section
       rather than more of the same page. */
    <section
      id="pricing"
      className="scroll-mt-24 md:scroll-mt-28 bg-[var(--bg-tertiary)] border-y border-[var(--border-color)] py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: DURATION, ease: EASE }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
            <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-[-0.04em] leading-[0.9] text-[var(--text-primary)]">
              {L("Prices", "Prijzen", "الأسعار", "Precios")}
            </h2>
            <p className="font-mono text-xs text-[var(--text-muted)] sm:text-right sm:max-w-[34ch] leading-relaxed">
              {L(
                "no VAT — small-business scheme",
                "geen btw, vrijstellingsregeling kleine ondernemingen",
                "بدون ضريبة — نظام المنشآت الصغيرة",
                "sin IVA — régimen de pequeñas empresas",
              )}
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[var(--border-color)] shadow-[var(--shadow-panel)]">
            {/* Column headers are for the desktop table only; the stacked
                mobile layout labels each value where it sits instead. */}
            <div className="hidden md:grid grid-cols-[1.7fr_1fr_1fr] bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
              {[head.what, head.price, head.time].map((h) => (
                <div key={h} className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-faint)] px-6 py-4">
                  {h}
                </div>
              ))}
            </div>

            {rows.map((r, i) => (
              <div
                key={r.what}
                className={`grid md:grid-cols-[1.7fr_1fr_1fr] md:items-start gap-1 md:gap-0 px-6 py-5 ${
                  i % 2 ? "bg-[var(--bg-secondary)]/40" : ""
                } ${i < rows.length - 1 ? "border-b border-[var(--border-color)]" : ""}`}
              >
                <div className="md:pr-6">
                  <div className="text-[var(--text-primary)]">{r.what}</div>
                  <div className="font-mono text-[11px] leading-relaxed text-[var(--text-muted)] mt-1.5">
                    {r.scope}
                  </div>
                </div>
                <div className="font-mono text-[var(--text-primary)] mt-2 md:mt-0">
                  <span className="md:hidden font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-faint)] mr-2">
                    {head.price}
                  </span>
                  {r.price}
                </div>
                <div className="font-mono text-sm text-[var(--text-secondary)] mt-1 md:mt-0">
                  <span className="md:hidden font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-faint)] mr-2">
                    {head.time}
                  </span>
                  {r.time}
                </div>
              </div>
            ))}
          </div>

          <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed mt-5 max-w-[80ch]">
            {L(
              "I build in the mornings, around 20 hours a week. These lead times already account for that, so what is written is what it becomes — not a quote that grows halfway through.",
              "Ik bouw in de ochtenden, ongeveer 20 uur per week. Die doorlooptijden houden daar rekening mee, dus wat er staat is wat het wordt. Geen offerte die halverwege groeit.",
              "أعمل في الصباح، نحو 20 ساعة أسبوعياً. المدد المذكورة تأخذ ذلك في الحسبان، فما هو مكتوب هو ما سيكون — لا عرض ينمو في منتصف الطريق.",
              "Trabajo por las mañanas, unas 20 horas por semana. Los plazos ya lo tienen en cuenta, así que lo escrito es lo que será — no un presupuesto que crece a mitad de camino.",
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
