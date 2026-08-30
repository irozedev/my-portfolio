/**
 * Where enquiries go now that Supabase is switched off.
 *
 * Every form on this site used to POST to a Supabase edge function. That
 * project was shut down, so the hostname stopped resolving and each submission
 * failed with "TypeError: Failed to fetch" - the contact form, the booking
 * modal and the chat funnel alike. The visitor saw an error; the enquiry was
 * gone.
 *
 * Netlify Forms replaces it. The site is already hosted there, it is server
 * side, it emails on each submission, and there is nothing to run or pay for
 * below a hundred a month. The catch is that Netlify only registers a form it
 * can find in the built HTML, which is why index.html carries a hidden one
 * declaring these exact field names - change them in both places or the
 * submission is rejected.
 *
 * If that POST fails too - Forms disabled on the site, or the visitor offline -
 * the caller falls back to a prefilled mail draft. Two independent routes, so
 * an enquiry is never simply lost the way it was for as long as the dead
 * endpoint sat there.
 */

export type LeadPayload = {
  name?: string;
  email?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  source?: string;
};

/** The name in index.html's hidden form. Both must agree. */
const FORM_NAME = "contact";

/**
 * Post one enquiry. Resolves true when Netlify accepted it.
 *
 * Never throws: the caller's job is to decide what to do when delivery did not
 * happen, and wrapping every call site in try/catch to find that out is worse
 * than a boolean.
 */
export async function submitLead(payload: LeadPayload): Promise<boolean> {
  const body = new URLSearchParams({ "form-name": FORM_NAME });
  for (const [k, v] of Object.entries(payload)) {
    if (v && String(v).trim()) body.append(k, String(v).trim());
  }

  try {
    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    return res.ok;
  } catch {
    return false;
  }
}
