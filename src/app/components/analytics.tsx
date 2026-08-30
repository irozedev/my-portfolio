import { useEffect } from "react";

/* GA4 measurement id. A measurement id is not a secret — it ships inside the
   page source of every site that uses one — so the real id is the default
   rather than an environment variable the deployment has to remember. Kept
   overridable by VITE_GA_ID so a staging build can point somewhere else; that
   one is read at BUILD time, so it needs a redeploy to take effect. */
const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined) || "G-03XHCMNB8N";

function loadGA() {
  if (!GA_ID || typeof document === "undefined") return;
  if (document.getElementById("ga4-src")) return; // already loaded

  const src = document.createElement("script");
  src.id = "ga4-src";
  src.async = true;
  src.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(src);

  const init = document.createElement("script");
  init.id = "ga4-init";
  init.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', { anonymize_ip: true });
  `;
  document.head.appendChild(init);
}

/**
 * Loads Google Analytics 4 — but only when the visitor has accepted cookies
 * (GDPR-friendly), with IP anonymisation.
 */
export function Analytics() {
  useEffect(() => {
    /* Silence is the failure mode here: with no id this component does
       nothing, forever, while the site looks perfectly fine and measures
       nothing at all. Production was in exactly that state for months and
       there was no way to tell by looking at it, which is why the id now has
       a real default. An empty VITE_GA_ID can still blank it deliberately. */
    if (!GA_ID) {
      if (import.meta.env.DEV) {
        console.warn("[analytics] no GA4 id — nothing is being measured.");
      }
      return;
    }

    if (localStorage.getItem("cookie-consent") === "accepted") {
      loadGA();
      return;
    }

    const onConsent = (e: Event) => {
      if ((e as CustomEvent).detail === "accepted") loadGA();
    };
    window.addEventListener("cookie-consent-changed", onConsent);
    return () => window.removeEventListener("cookie-consent-changed", onConsent);
  }, []);

  return null;
}
