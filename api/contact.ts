/**
 * Enquiry endpoint. Emails every submission to Stepan.
 *
 * The site posts here from three places - the contact form, the booking modal
 * and the chat funnel. It used to post to a Supabase edge function; that
 * project was switched off, so the hostname stopped resolving and every
 * enquiry was silently lost. This replaces it with a function on the host the
 * site actually runs on, which is Vercel (`Server: Vercel`, `X-Vercel-Cache`)
 * - the netlify.toml still sitting in the repo is from an older deployment and
 * is not what serves the site.
 *
 * Delivery goes through Resend because it is the smallest thing that works: a
 * single POST, a free tier that covers a portfolio many times over, and no SDK
 * to install. Set RESEND_API_KEY in the Vercel project and it starts working
 * with no code change.
 *
 * Without that key the function answers 503 rather than pretending. The client
 * then opens a prefilled mail draft instead, so an enquiry still reaches him -
 * it just costs the visitor one tap. Never a silent drop, which is the state
 * this whole path was in.
 */

export const config = { runtime: "edge" };

const TO = "rozedev095@gmail.com";

/* roze.live is verified in Resend (EU region), so mail goes out over the
   site's own domain and is signed for it. The shared onboarding.resend.dev
   sender that stood here first also delivered, but Gmail stamped every
   notification "via resend.dev" - fine for a smoke test, wrong for the
   address a prospective client sees. Nobody replies to this box: replies go
   to the visitor via reply_to below. */
const FROM = "Roze site <hello@roze.live>";

type Payload = {
  name?: string;
  email?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  source?: string;
  /* honeypot: a real visitor never sees this field */
  botField?: string;
};

const clean = (v: unknown, max = 4000): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Bots fill hidden fields. Answer 200 so they do not learn anything, and
  // drop it.
  if (clean(body.botField)) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const name = clean(body.name, 120) || "Website visitor";
  const email = clean(body.email, 200);
  const message = clean(body.message);

  if (!message && !email) {
    return new Response(JSON.stringify({ error: "empty submission" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Say so plainly. The client falls back to a mail draft on anything that
    // is not 200, and a 503 with a reason is far easier to debug later than a
    // request that appears to succeed and delivers nothing.
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY is not set on this deployment" }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const lines = [
    `From:     ${name}${email ? ` <${email}>` : ""}`,
    clean(body.service, 200) && `Service:  ${clean(body.service, 200)}`,
    clean(body.budget, 200) && `Budget:   ${clean(body.budget, 200)}`,
    clean(body.timeline, 200) && `Timing:   ${clean(body.timeline, 200)}`,
    clean(body.source, 60) && `Source:   ${clean(body.source, 60)}`,
    "",
    message,
  ].filter(Boolean);

  const subject = `${clean(body.source, 60) || "site"}: ${name}${
    email ? ` (${email})` : ""
  }`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        subject,
        text: lines.join("\n"),
        // so hitting reply in Gmail answers the visitor, not the sender domain
        ...(email ? { reply_to: email } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: "mail provider rejected", detail: detail.slice(0, 400) }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "mail provider unreachable", detail: String(err).slice(0, 300) }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}
