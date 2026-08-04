import { useEffect } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { experiences, experienceCopy, type Lang } from "../data/experience";
import { useLanguage } from "../contexts/language-context";

/**
 * Printable one-page CV, at `#cv`.
 *
 * Built from `data/experience.ts`, the same module the timeline renders, so the
 * downloaded document and the website cannot disagree. The hand-maintained
 * `public/Stepan_Roze_CV.pdf` had already drifted apart from the site — wrong
 * E-Consulting end date, no Albron entry — which is the failure this replaces.
 *
 * Deliberately plain: no gradients, no glass, no motion. Half of what a Belgian
 * recruiter does with a CV is print it or push it through a parser, and both
 * work better on ordinary black text. The screen version is styled to look like
 * a sheet of paper so what you see is what comes out of the printer.
 *
 * "Print" opens the browser dialog; every browser offers "Save as PDF" there,
 * so there is no PDF library in the bundle and no file to keep in sync.
 */

// Education is the last entry and is presented under its own heading rather
// than as a job. Everything else is work.
const EDUCATION_ID = 5;

// Length budget: the document this replaces was two A4 pages, and two pages is
// the normal shape for eight years of experience in Belgium — so the content is
// not squeezed into one. Measured at 1.7 pages, which leaves room for the copy
// to grow without spilling onto a third.
//
// Education still drops its bullets: "studied algorithms" under a 2012–2015
// heading is filler next to eight years of employment.
const NO_BULLETS = new Set([EDUCATION_ID]);

export function CVPrint({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const L: Lang = (en, nl, ar, es) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;
  const copy = experienceCopy(L);

  const roles = experiences.filter((e) => e.id !== EDUCATION_ID);
  const education = experiences.filter((e) => e.id === EDUCATION_ID);

  useEffect(() => {
    const previous = document.title;
    // The filename a browser suggests in "Save as PDF" comes from the title.
    document.title = "Stepan Roze — Front-End / JavaScript Developer — CV";
    return () => {
      document.title = previous;
    };
  }, []);

  const entry = (exp: (typeof experiences)[number]) => {
    const text = copy[exp.id as keyof typeof copy];
    const bullets = NO_BULLETS.has(exp.id) ? [] : text.achievements;

    return (
      <article key={exp.id} className="cv-entry">
        <header className="cv-entry-head">
          <h3>
            {text.title}
            <span className="cv-at"> — {exp.company}</span>
          </h3>
          <span className="cv-period">{text.period}</span>
        </header>
        <p className="cv-meta">
          {text.location} · {text.type}
        </p>
        <p className="cv-desc">{text.description}</p>
        {bullets.length > 0 && (
          <ul className="cv-list">
            {bullets.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        )}
        {exp.tech.length > 0 && (
          <p className="cv-tech">
            <strong>{L("Stack", "Stack", "التقنيات", "Stack")}:</strong>{" "}
            {exp.tech.join(" · ")}
          </p>
        )}
      </article>
    );
  };

  return (
    <div className="cv-root">
      {/* Screen-only controls. `cv-noprint` drops them from the printed sheet. */}
      <div className="cv-actions cv-noprint">
        <button type="button" onClick={onClose}>
          <ArrowLeft className="w-4 h-4" />
          {L("Back to site", "Terug naar site", "العودة إلى الموقع", "Volver al sitio")}
        </button>
        <button type="button" onClick={() => window.print()} className="cv-primary">
          <Printer className="w-4 h-4" />
          {L("Print / Save as PDF", "Printen / Opslaan als PDF", "طباعة / حفظ PDF", "Imprimir / Guardar PDF")}
        </button>
      </div>

      <main className="cv-sheet" dir="auto">
        <header className="cv-header">
          {/* Lifted out of the original PDF, so the document keeps the same
              face. Note it is NOT the photo the About section shows. */}
          <img className="cv-photo" src="/cv-photo.jpg" alt="Stepan Roze" />
          <div className="cv-identity">
            <h1>Stepan Roze</h1>
            <p className="cv-role">
              {L(
                "Front-End / JavaScript Developer · 8+ years",
                "Front-end / JavaScript-ontwikkelaar · 8+ jaar",
                "مطوّر Front-End / JavaScript · أكثر من 8 سنوات",
                "Desarrollador Front-End / JavaScript · 8+ años",
              )}
            </p>
            {/* Values stay links so they remain clickable in the saved PDF. */}
            <dl className="cv-contact">
              <dt>{L("Email", "E-mail", "البريد", "Email")}</dt>
              <dd>
                <a href="mailto:rozedev095@gmail.com">rozedev095@gmail.com</a>
              </dd>

              <dt>{L("Location", "Locatie", "الموقع", "Ubicación")}</dt>
              <dd>
                {L(
                  "Lommel, Limburg, Belgium — permanent contract, no sponsorship needed",
                  "Lommel, Limburg, België — vast contract, geen sponsoring nodig",
                  "لوميل، ليمبورغ، بلجيكا — عقد دائم، لا حاجة لكفالة",
                  "Lommel, Limburgo, Bélgica — contrato indefinido, sin patrocinio",
                )}
              </dd>

              <dt>{L("Website", "Website", "الموقع الإلكتروني", "Web")}</dt>
              <dd>
                <a href="https://roze.live">roze.live</a>
              </dd>

              <dt>GitHub</dt>
              <dd>
                <a href="https://github.com/irozedev">github.com/irozedev</a>
              </dd>

              <dt>LinkedIn</dt>
              <dd>
                <a href="https://linkedin.com/in/rozestepan">linkedin.com/in/rozestepan</a>
              </dd>
            </dl>
          </div>
        </header>

        <section>
          <h2>{L("Profile", "Profiel", "نبذة", "Perfil")}</h2>
          <p className="cv-desc">
            {L(
              "Front-End / JavaScript developer with 8+ years of commercial experience, most of it in high-traffic e-commerce and enterprise systems: childrensalon.com and vogacloset.com in luxury retail, and CRM for Oschadbank, Ukraine's state savings bank. Comfortable owning a feature end to end — from the product question to the deployed page. Now based in Belgium and looking for a front-end role in Flanders or remote.",
              "Front-end/JavaScript-ontwikkelaar met 8+ jaar commerciële ervaring, grotendeels in e-commerce met veel verkeer en enterprisesystemen: childrensalon.com en vogacloset.com in luxe retail, en CRM voor Oschadbank, de Oekraïense staatsspaarbank. Neemt een feature van begin tot eind in eigen hand. Woont nu in België en zoekt een front-endfunctie in Vlaanderen of op afstand.",
              "مطوّر Front-End/JavaScript بخبرة تجارية تتجاوز 8 سنوات، معظمها في متاجر إلكترونية عالية الزيارات وأنظمة مؤسسية: childrensalon.com وvogacloset.com في التجزئة الفاخرة، ونظام CRM لبنك Oschadbank الحكومي الأوكراني. أتولى الميزة من الفكرة حتى النشر. أقيم الآن في بلجيكا وأبحث عن وظيفة front-end في فلاندرز أو عن بُعد.",
              "Desarrollador Front-End/JavaScript con más de 8 años de experiencia comercial, sobre todo en e-commerce de alto tráfico y sistemas empresariales: childrensalon.com y vogacloset.com en retail de lujo, y CRM para Oschadbank, la caja de ahorros estatal de Ucrania. Me hago cargo de una funcionalidad de principio a fin. Resido en Bélgica y busco un puesto de front-end en Flandes o en remoto.",
            )}
          </p>
        </section>

        <section>
          <h2>{L("Core skills", "Kernvaardigheden", "المهارات الأساسية", "Competencias")}</h2>
          <p className="cv-desc">
            JavaScript (ES6+) · TypeScript · React · Vue.js · Next.js · Node.js ·
            Knockout.js · Magento 1 &amp; 2 · MS Dynamics 365 XRM · REST APIs ·
            SCSS / LESS · Supabase · Netlify / Vercel · Git · GA4
          </p>
        </section>

        <section>
          <h2>{L("Experience", "Werkervaring", "الخبرة العملية", "Experiencia")}</h2>
          {roles.map((exp) => entry(exp))}
        </section>

        <section>
          <h2>{L("Education", "Opleiding", "التعليم", "Formación")}</h2>
          {education.map((exp) => entry(exp))}
        </section>

        <section>
          <h2>{L("Languages", "Talen", "اللغات", "Idiomas")}</h2>
          {/* Kept honest on purpose: overstating Dutch costs more trust in
              Benelux IT than plain English does. */}
          <p className="cv-desc">
            {L(
              "English — professional working proficiency · Ukrainian, Russian — native · Dutch — basic, in daily use at work",
              "Engels — professionele werkvaardigheid · Oekraïens, Russisch — moedertaal · Nederlands — basis, dagelijks in gebruik op het werk",
              "الإنجليزية — إتقان مهني · الأوكرانية والروسية — لغة أم · الهولندية — أساسية، مستخدمة يوميًا في العمل",
              "Inglés — competencia profesional · ucraniano, ruso — nativo · neerlandés — básico, en uso diario en el trabajo",
            )}
          </p>
        </section>
      </main>
    </div>
  );
}
