/**
 * Where enquiries go now that Supabase is switched off.
 *
 * Every form on this site used to POST to a Supabase edge function. That
 * project was shut down, so the hostname stopped resolving and each submission
 * failed with "TypeError: Failed to fetch" - the contact form, the booking
 * modal and the chat funnel alike. The visitor saw an error; the enquiry was
 * gone.
 *
 * It now posts to /api/contact, a function on the host this site actually runs
 * on. That is Vercel, not Netlify: production answers with `Server: Vercel` and
 * an `X-Vercel-Cache` header, and the netlify.toml still in the repo is a
 * leftover from an earlier deployment. A Netlify Forms attempt returned 405 for
 * exactly that reason.
 *
 * The function emails Stepan through Resend and needs RESEND_API_KEY set on the
 * Vercel project. Until that exists it answers 503, and the caller falls back
 * to a prefilled mail draft - so an enquiry is never silently dropped the way
 * it was for as long as the dead endpoint sat there.
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

/**
 * Post one enquiry. Resolves true only when it was actually delivered.
 *
 * Never throws: the caller's job is to decide what to do when delivery did not
 * happen, and wrapping every call site in try/catch to learn that is worse than
 * a boolean.
 */
export async function submitLead(payload: LeadPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok && import.meta.env.DEV) {
      const detail = await res.text().catch(() => "");
      console.warn("[submit-lead] not delivered:", res.status, detail);
    }
    return res.ok;
  } catch {
    return false;
  }
}
