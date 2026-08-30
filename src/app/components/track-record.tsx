import { useLanguage } from "../contexts/language-context";
import { VIEWPORT, DURATION, EASE } from "../lib/motion";
import { motion } from "motion/react";

/**
 * The names, for the client page.
 *
 * A company shopping for a developer wants to know who else trusted him, and
 * the client page had nowhere to say it — the employment history lives in the
 * CV timeline, which client mode never renders. This is not that timeline: it
 * is three references and a count, weighted so the eye has an order to read
 * them in rather than four equal rows.
 *
 * Facts are the ones in data/experience.ts and nowhere else. The bank is not
 * named, deliberately — see the "stop naming the bank" commit.
 */
export function TrackRecord() {
  const { language } = useLanguage();

  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  const chip =
    "font-mono text-[11px] text-[var(--text-muted)] border border-[var(--border-color)] rounded-full px-3 py-1";

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[var(--bg-primary)]">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: DURATION, ease: EASE }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
              {L(
                "Before that, on a team, at scale",
                "Daarvoor, als teamlid op grote platformen",
                "قبل ذلك، ضمن فريق وعلى نطاق واسع",
                "Antes de eso, en equipo y a gran escala",
              )}
            </span>
            <span className="font-mono text-[11px] text-[var(--text-faint)]">2015 &ndash; 2024</span>
          </div>

          <div className="grid lg:grid-cols-[1.32fr_1fr] gap-4">
            {/* The tall cell. childrensalon is the largest thing he has worked
                on, so it gets the height, the numbers and the only wash. */}
            <div className="relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-7 md:p-8 shadow-[var(--shadow-card)] lg:row-span-2 flex flex-col">
              <div
                aria-hidden
                className="absolute -top-24 -right-16 w-64 h-64 rounded-full bg-[radial-gradient(closest-side,var(--glow-primary),transparent)]"
              />
              {/* The cell is as tall as the two beside it, and its copy is
                  shorter, so the figures go to the floor rather than leaving a
                  third of the card empty underneath them. */}
              <div className="relative flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-primary)]">
                    {L("largest scale", "grootste schaal", "أكبر نطاق", "mayor escala")}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--text-faint)]">Ronis BT &middot; 2022</span>
                </div>

                <h3 className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.03em] text-[var(--text-primary)] mb-4">
                  childrensalon<span className="text-[var(--text-faint)]">.com</span>
                </h3>

                <p className="text-[var(--text-secondary)] leading-relaxed mb-7">
                  {L(
                    "One of the largest luxury childrenswear retailers in the world. Rewrote the product detail page during the move from Magento 1.9 to custom Symfony.",
                    "Een van de grootste luxe kinderkledingretailers ter wereld. Productdetailpagina herschreven tijdens de overstap van Magento 1.9 naar custom Symfony.",
                    "من أكبر متاجر ملابس الأطفال الفاخرة في العالم. أعدت كتابة صفحة تفاصيل المنتج أثناء الانتقال من Magento 1.9 إلى Symfony مخصّص.",
                    "Una de las mayores tiendas de ropa infantil de lujo del mundo. Reescribí la página de detalle de producto durante la migración de Magento 1.9 a Symfony a medida.",
                  )}
                </p>

                <div className="flex gap-8 pt-6 mt-auto border-t border-[var(--border-color)]">
                  <div>
                    <div className="font-display text-3xl font-extrabold tracking-tight text-[var(--text-primary)] leading-none">
                      1.9 &rarr;
                    </div>
                    <div className="font-mono text-[11px] text-[var(--text-muted)] mt-2">
                      {L("Magento to Symfony", "Magento naar Symfony", "من Magento إلى Symfony", "de Magento a Symfony")}
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-3xl font-extrabold tracking-tight text-[var(--text-primary)] leading-none">
                      PDP
                    </div>
                    <div className="font-mono text-[11px] text-[var(--text-muted)] mt-2">
                      {L("rewritten end to end", "volledig herschreven", "أُعيدت كتابتها بالكامل", "reescrita por completo")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:p-7 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-4">
                <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                  vogacloset<span className="text-[var(--text-faint)]">.com</span>
                </h3>
                <span className="font-mono text-[11px] text-[var(--text-faint)] shrink-0">Ronis BT &middot; 2022</span>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed mb-5">
                {L(
                  "Fashion marketplace for the Middle East and North Africa. Front-end on a team, multilingual and right-to-left.",
                  "Modemarktplaats voor het Midden-Oosten en Noord-Afrika. Front-end in een team, meertalig en van rechts naar links.",
                  "سوق أزياء للشرق الأوسط وشمال أفريقيا. واجهات ضمن فريق، متعدّدة اللغات ومن اليمين إلى اليسار.",
                  "Marketplace de moda para Oriente Medio y el Norte de África. Front-end en equipo, multiidioma y de derecha a izquierda.",
                )}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className={chip}>{L("multilingual", "meertalig", "متعدّد اللغات", "multiidioma")}</span>
                <span className={chip}>RTL</span>
                <span className={chip}>{L("marketplace", "marktplaats", "سوق", "marketplace")}</span>
              </div>
            </div>

            {/* The bank. Two years of Dynamics 365 is the scarce half of the
                profile in this market, so it gets the detail rather than one
                line — but never the bank's name. */}
            <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:p-7 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1">
                <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                  {L("A national bank", "Een nationale bank", "أحد البنوك الوطنية", "Un banco nacional")}
                </h3>
                <span className="font-mono text-[11px] text-[var(--text-faint)] shrink-0">
                  E-Consulting &middot; 2022 &ndash; 2024
                </span>
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.13em] text-[var(--accent-primary)] mb-4">
                {L("CRM on Dynamics 365 XRM", "CRM op Dynamics 365 XRM", "CRM على Dynamics 365 XRM", "CRM sobre Dynamics 365 XRM")}
              </div>

              <div className="grid gap-2.5 rounded-2xl bg-white/[0.03] p-4 mb-5">
                {[
                  L("Web resources on MS Dynamics 365 XRM, in plain functional JavaScript",
                    "Webresources op MS Dynamics 365 XRM, in puur functioneel JavaScript",
                    "موارد ويب على MS Dynamics 365 XRM بجافاسكربت وظيفي خالص",
                    "Recursos web en MS Dynamics 365 XRM, en JavaScript funcional puro"),
                  L("A Vue app for signing documents: async requests, signature on canvas",
                    "Een Vue-app voor documentondertekening: async requests, handtekening op canvas",
                    "تطبيق Vue لتوقيع المستندات: طلبات غير متزامنة وتوقيع على Canvas",
                    "Una app Vue para firmar documentos: peticiones asíncronas y firma en canvas"),
                  L("Entity fields configured, REST APIs agreed with the back-end teams",
                    "Entiteitvelden geconfigureerd, REST API's afgestemd met de back-endteams",
                    "إعداد حقول الكيانات وتنسيق واجهات REST مع فرق الخلفية",
                    "Campos de entidades configurados, APIs REST acordadas con los equipos de back-end"),
                ].map((line) => (
                  <span key={line} className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-primary)] mr-2">&#9656;</span>
                    {line}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                <span className={chip}>Dynamics 365 XRM</span>
                <span className={chip}>JavaScript ES6+</span>
                <span className={chip}>Vue.js</span>
                <span className={chip}>REST API</span>
              </div>
            </div>
          </div>

          {/* The freelance years as one wide, quiet cell with the numbers first */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center gap-6 md:gap-11 rounded-3xl border border-[var(--border-color)] bg-white/[0.02] px-7 py-6">
            <div className="flex gap-10 shrink-0">
              {[
                { v: "20+", l: L("clients", "opdrachtgevers", "عميلاً", "clientes") },
                { v: "8", l: L("years front-end", "jaar front-end", "سنوات واجهات", "años front-end") },
                { v: "2", l: L("continents", "continenten", "قارتان", "continentes") },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-4xl font-extrabold tracking-[-0.035em] text-[var(--text-primary)] leading-none">
                    {s.v === "20+" ? (
                      <>
                        20<span className="text-[var(--accent-primary)]">+</span>
                      </>
                    ) : (
                      s.v
                    )}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--text-muted)] mt-1.5">{s.l}</div>
                </div>
              ))}
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {L(
                "Websites and web shops built and maintained for clients across Europe and North America, freelance between 2015 and 2022.",
                "Websites en webshops gebouwd en onderhouden voor opdrachtgevers in Europa en Noord-Amerika, als freelancer tussen 2015 en 2022.",
                "مواقع ومتاجر بُنيت وصينت لعملاء في أوروبا وأمريكا الشمالية، بالعمل الحر بين 2015 و2022.",
                "Webs y tiendas creadas y mantenidas para clientes de Europa y Norteamérica, como freelance entre 2015 y 2022.",
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
