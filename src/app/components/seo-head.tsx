import { useEffect } from "react";
import { useLanguage } from "../contexts/language-context";

const SITE_URL = "https://roze.live";

const seoData: Record<string, { title: string; description: string; keywords: string }> = {
  en: {
    title: "Stepan Roze | Front-End & JavaScript Developer — React, TypeScript, Next.js | Belgium",
    description: "Front-End / JavaScript Developer with 8+ years of commercial experience building e-commerce and enterprise web apps (childrensalon.com, vogacloset.com, Oschadbank). React, TypeScript, Vue, Next.js & Magento. Based in Antwerp, Belgium. Available for freelance.",
    keywords: "Front-End Developer, JavaScript Developer, React Developer, TypeScript, Vue.js, Next.js, Magento, E-commerce Developer, Freelance Developer Belgium, Web Developer, Knockout.js, Node.js",
  },
  uk: {
    title: "Степан Розе | Front-End та JavaScript розробник — React, TypeScript, Next.js | Бельгія",
    description: "Front-End / JavaScript розробник з 8+ роками комерційного досвіду в e-commerce та enterprise (childrensalon.com, vogacloset.com, Ощадбанк). React, TypeScript, Vue, Next.js та Magento. Антверпен, Бельгія. Доступний для фрілансу.",
    keywords: "Front-End розробник, JavaScript розробник, React, TypeScript, Vue.js, Next.js, Magento, E-commerce розробник, Фріланс Бельгія, Веб-розробник",
  },
  nl: {
    title: "Stepan Roze | Front-End & JavaScript Developer — React, TypeScript, Next.js | België",
    description: "Front-End / JavaScript Developer met 8+ jaar commerciële ervaring in e-commerce en enterprise webapps (childrensalon.com, vogacloset.com, Oschadbank). React, TypeScript, Vue, Next.js & Magento. Antwerpen, België. Beschikbaar als freelancer.",
    keywords: "Front-End Developer, JavaScript Developer, React Developer, TypeScript, Vue.js, Next.js, Magento, E-commerce Developer, Freelance Developer België, Webontwikkelaar",
  },
  ar: {
    title: "ستيبان روز | مطور Front-End و JavaScript — React, TypeScript, Next.js | بلجيكا",
    description: "مطور Front-End / JavaScript مع أكثر من 8 سنوات خبرة تجارية في التجارة الإلكترونية وتطبيقات المؤسسات. React, TypeScript, Vue, Next.js و Magento. أنتويرب، بلجيكا.",
    keywords: "مطور Front-End, مطور JavaScript, مطور React, TypeScript, Vue.js, Next.js, Magento, مطور مستقل بلجيكا",
  },
  es: {
    title: "Stepan Roze | Front-End & JavaScript Developer — React, TypeScript, Next.js | Bélgica",
    description: "Desarrollador Front-End / JavaScript con 8+ años de experiencia comercial en e-commerce y aplicaciones enterprise (childrensalon.com, vogacloset.com, Oschadbank). React, TypeScript, Vue, Next.js y Magento. Amberes, Bélgica. Disponible como freelance.",
    keywords: "Desarrollador Front-End, Desarrollador JavaScript, Desarrollador React, TypeScript, Vue.js, Next.js, Magento, Desarrollador Freelance Bélgica",
  },
};

// JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Stepan Roze",
  jobTitle: "Front-End / JavaScript Developer",
  url: "https://roze.live",
  image: "https://roze.live/og-image.jpg",
  email: "rozedev095@gmail.com",
  telephone: "+32469631424",
  address: { "@type": "PostalAddress", addressLocality: "Antwerp", addressRegion: "Flanders", addressCountry: "BE" },
  sameAs: [
    "https://github.com/irozedev",
    "https://linkedin.com/in/rozestepan",
    "https://www.upwork.com/freelancers/rozestepan",
  ],
  knowsAbout: ["JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Node.js", "Knockout.js", "Magento", "E-commerce", "Web Performance"],
  worksFor: { "@type": "Organization", name: "Freelance" },
  alumniOf: [{ "@type": "CollegeOrUniversity", name: "V.N. Karazin Kharkiv National University" }],
  description: "Front-End / JavaScript Developer with 8+ years of commercial experience building e-commerce and enterprise web applications, from large-scale luxury retail platforms to banking systems.",
};

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Stepan Roze Portfolio",
  url: "https://roze.live",
  description: "Professional portfolio of Stepan Roze, Front-End / JavaScript Developer specializing in React, Vue, Next.js and TypeScript",
  author: { "@type": "Person", name: "Stepan Roze" },
};

export function SEOHead() {
  const { language } = useLanguage();
  const data = seoData[language] || seoData.en;

  useEffect(() => {
    document.title = data.title;
    document.documentElement.lang = language === 'uk' ? 'uk' : language;

    // Self-referencing canonical. English lives at the bare origin (it is also
    // the x-default); every other language at ?lang=<code>. Pointing all five
    // at "https://roze.live/" — as this used to — told Google the translated
    // versions were duplicates and cancelled out the hreflang cluster below.
    const canonicalFor = (lang: string) =>
      lang === "en" ? SITE_URL + "/" : `${SITE_URL}/?lang=${lang === "uk" ? "ua" : lang}`;

    const pageUrl = canonicalFor(language);

    const metas: [string, string, string][] = [
      // Basic
      ["name", "description", data.description],
      ["name", "keywords", data.keywords],
      ["name", "author", "Stepan Roze"],
      ["name", "robots", "index, follow, max-image-preview:large, max-snippet:-1"],
      ["name", "googlebot", "index, follow"],
      ["name", "color-scheme", "dark light"],
      // NOTE: theme-color is deliberately NOT set here — theme-context.tsx owns
      // it and keeps it in sync with the active light/dark theme. Writing a
      // hardcoded value here stomped that on every language change.
      // Open Graph
      ["property", "og:type", "website"],
      ["property", "og:site_name", "Stepan Roze Portfolio"],
      ["property", "og:title", data.title],
      ["property", "og:description", data.description],
      ["property", "og:image", `${SITE_URL}/og-image.jpg`],
      ["property", "og:image:width", "1200"],
      ["property", "og:image:height", "630"],
      ["property", "og:image:alt", "Stepan Roze — Front-End / JavaScript Developer"],
      ["property", "og:url", pageUrl],
      ["property", "og:locale", language === 'uk' ? 'uk_UA' : language === 'nl' ? 'nl_BE' : language === 'ar' ? 'ar_SA' : language === 'es' ? 'es_ES' : 'en_US'],
      // Twitter
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", data.title],
      ["name", "twitter:description", data.description],
      ["name", "twitter:image", `${SITE_URL}/og-image.jpg`],
      ["name", "twitter:image:alt", "Stepan Roze — Front-End / JavaScript Developer"],
      // Geo — must match the static tags in index.html and the JSON-LD blocks
      ["name", "geo.region", "BE-VAN"],
      ["name", "geo.placename", "Antwerp, Flanders"],
    ];

    metas.forEach(([attr, key, content]) => setMeta(attr, key, content));

    // Canonical
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canon) { canon = document.createElement("link"); canon.rel = "canonical"; document.head.appendChild(canon); }
    canon.href = pageUrl;

    // Alternate languages. The hreflang codes and the ?lang= values must match
    // what sitemap.xml and index.html publish, or the cluster is ignored.
    const alts: Record<string, string> = {
      en: canonicalFor("en"),
      uk: canonicalFor("uk"),   // published as ?lang=ua
      "nl-BE": canonicalFor("nl"),
      nl: canonicalFor("nl"),
      ar: canonicalFor("ar"),
      es: canonicalFor("es"),
    };
    // Clean old alternates
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    Object.entries(alts).forEach(([lang, href]) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang;
      link.href = href;
      document.head.appendChild(link);
    });
    // x-default
    const xd = document.createElement("link");
    xd.rel = "alternate";
    xd.hreflang = "x-default";
    xd.href = SITE_URL + "/";
    document.head.appendChild(xd);

    // JSON-LD structured data. getElementById returns HTMLElement, which has
    // no `type` property — reach for the script element type explicitly.
    const upsertJsonLd = (id: string, payload: unknown) => {
      let el = document.getElementById(id) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement("script");
        el.id = id;
        el.type = "application/ld+json";
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(payload);
    };

    upsertJsonLd("ld-person", structuredData);
    upsertJsonLd("ld-website", websiteData);

  }, [language, data]);

  return null;
}

function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
}
