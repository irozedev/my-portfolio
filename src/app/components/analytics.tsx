import { useEffect } from "react";

// GA4 measurement id — set VITE_GA_ID (e.g. G-XXXXXXX) in your Netlify env.
const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

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
 * (GDPR-friendly). No-ops if VITE_GA_ID isn't configured.
 */
export function Analytics() {
  useEffect(() => {
    if (!GA_ID) {
      // Silence is the failure mode here: with no id this component does
      // nothing, forever, and the site looks perfectly fine while measuring
      // nothing at all. Production was in exactly that state and there was no
      // way to tell by looking at it. Set VITE_GA_ID in the Netlify build
      // environment (Site configuration → Environment variables).
      if (import.meta.env.DEV) {
        console.warn(
          "[analytics] VITE_GA_ID is not set — GA4 is disabled and no traffic is being measured.",
        );
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
