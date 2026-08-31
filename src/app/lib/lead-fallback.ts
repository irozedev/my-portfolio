/**
 * What to do with a lead when the server cannot take it.
 *
 * Enquiries go to Netlify Forms (see lib/submit-lead.ts). This is what happens
 * when that does not work - Forms switched off for the site, the visitor
 * offline, an ad blocker eating the POST.
 *
 * A mail draft that already contains everything they typed. Delivery still
 * needs one tap from them, but the enquiry survives, which is more than was
 * true while the site posted to a Supabase project that had been shut down and
 * silently dropped every lead.
 *
 * Deliberately a draft rather than a silent background send. A mail client the
 * visitor can see is the one delivery method that cannot fail quietly, and they
 * keep a copy in their own sent folder - which is worth something when the
 * reason they are writing is that the last thing they tried did not work.
 */

export const CONTACT_EMAIL = "hello@roze.live";

type LeadFields = {
  name?: string;
  email?: string;
  role?: string;
  service?: string;
  project?: string;
  budget?: string;
  timeline?: string;
  message?: string;
};

/** Build a mailto: with the enquiry already written into the body. */
export function mailtoLead(language: string, fields: LeadFields): string {
  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  const subject = fields.role
    ? L("Role enquiry", "Vacature", "بخصوص وظيفة", "Consulta de puesto")
    : L("Project enquiry", "Projectaanvraag", "بخصوص مشروع", "Consulta de proyecto");

  const label = {
    name: L("Name", "Naam", "الاسم", "Nombre"),
    email: L("Email", "E-mail", "البريد", "Email"),
    role: L("Role", "Functie", "الوظيفة", "Puesto"),
    service: L("Service", "Dienst", "الخدمة", "Servicio"),
    project: L("Project", "Project", "المشروع", "Proyecto"),
    budget: L("Budget", "Budget", "الميزانية", "Presupuesto"),
    timeline: L("Timing", "Planning", "التوقيت", "Plazo"),
    message: L("Message", "Bericht", "الرسالة", "Mensaje"),
  };

  const lines: string[] = [];
  const add = (k: string, v?: string) => {
    if (v && v.trim()) lines.push(`${k}: ${v.trim()}`);
  };

  add(label.name, fields.name);
  add(label.email, fields.email);
  add(label.role, fields.role);
  add(label.service, fields.service);
  add(label.project, fields.project);
  add(label.budget, fields.budget);
  add(label.timeline, fields.timeline);
  if (fields.message && fields.message.trim()) {
    lines.push("", `${label.message}:`, fields.message.trim());
  }

  const body = lines.join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Open that draft. Uses assignment rather than window.open: a mailto in a new
 * tab leaves an orphan blank tab behind in several browsers, and some popup
 * blockers drop it outright when it is not directly inside a click handler.
 */
export function openMailtoLead(language: string, fields: LeadFields): void {
  if (typeof window === "undefined") return;
  window.location.href = mailtoLead(language, fields);
}
