import { useEffect } from "react";
import { useLanguage } from "../contexts/language-context";

const seoData: Record<string, { title: string; description: string; keywords: string }> = {
  en: {
    title: "Stepan Roze | Senior Full-Stack Developer — React, TypeScript, Node.js | Belgium",
    description: "Senior Full-Stack Developer with 10+ years experience. Specializing in React, TypeScript, Node.js, Next.js, Magento 2 & e-commerce. 150+ projects delivered. Based in Belgium. Available for freelance.",
    keywords: "Full-Stack Developer, React Developer, TypeScript Expert, Node.js Developer, Magento 2, E-commerce Developer, Freelance Developer Belgium, Web Developer, Next.js, PostgreSQL, Docker, SaaS Development, Frontend Engineer",
  },
  uk: {
    title: "Степан Розе | Senior Full-Stack Розробник — React, TypeScript, Node.js | Бельгія",
    description: "Senior Full-Stack розробник з 10+ роками досвіду. React, TypeScript, Node.js, Next.js, Magento 2 та e-commerce. 150+ проектів. Бельгія. Доступний для фрілансу.",
    keywords: "Full-Stack розробник, React розробник, TypeScript, Node.js, Magento 2, E-commerce розробник, Фріланс Бельгія, Веб-розробник",
  },
  nl: {
    title: "Stepan Roze | Senior Full-Stack Developer — React, TypeScript, Node.js | België",
    description: "Senior Full-Stack Developer met 10+ jaar ervaring. Gespecialiseerd in React, TypeScript, Node.js, Next.js, Magento 2 & e-commerce. 150+ projecten. België. Beschikbaar als freelancer.",
    keywords: "Full-Stack Developer, React Developer, TypeScript, Node.js, Magento 2, E-commerce Developer, Freelance Developer België, Webontwikkelaar",
  },
  ar: {
    title: "ستيبان روز | مطور Full-Stack كبير — React, TypeScript, Node.js | بلجيكا",
    description: "مطور Full-Stack كبير مع أكثر من 10 سنوات خبرة. React, TypeScript, Node.js, Next.js, Magento 2. أكثر من 150 مشروع. بلجيكا.",
    keywords: "مطور Full-Stack, مطور React, TypeScript, Node.js, Magento 2, مطور مستقل بلجيكا",
  },
  es: {
    title: "Stepan Roze | Senior Full-Stack Developer — React, TypeScript, Node.js | Bélgica",
    description: "Desarrollador Senior Full-Stack con 10+ años de experiencia. React, TypeScript, Node.js, Next.js, Magento 2 y e-commerce. 150+ proyectos. Bélgica. Disponible como freelance.",
    keywords: "Desarrollador Full-Stack, Desarrollador React, TypeScript, Node.js, Magento 2, Desarrollador Freelance Bélgica",
  },
};

// JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Stepan Roze",
  jobTitle: "Senior Full-Stack Developer",
  url: "https://roze.live",
  image: "https://roze.live/og-image.jpg",
  email: "stepan@roze.live",
  address: { "@type": "PostalAddress", addressCountry: "BE" },
  sameAs: [
    "https://github.com/irozedev",
    "https://linkedin.com/in/rozestepan",
    "https://www.upwork.com/freelancers/rozestepan",
  ],
  knowsAbout: ["React", "TypeScript", "Node.js", "Next.js", "Magento 2", "PostgreSQL", "Docker", "GraphQL", "Tailwind CSS", "E-commerce"],
  worksFor: { "@type": "Organization", name: "Freelance" },
  alumniOf: [],
  description: "Senior Full-Stack Developer with 10+ years of experience building high-performance web applications, e-commerce platforms, and SaaS solutions.",
};

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Stepan Roze Portfolio",
  url: "https://roze.live",
  description: "Professional portfolio of Stepan Roze, Senior Full-Stack Developer",
  author: { "@type": "Person", name: "Stepan Roze" },
};

export function SEOHead() {
  const { language } = useLanguage();
  const data = seoData[language] || seoData.en;

  useEffect(() => {
    document.title = data.title;
    document.documentElement.lang = language === 'uk' ? 'uk' : language;

    const metas: [string, string, string][] = [
      // Basic
      ["name", "description", data.description],
      ["name", "keywords", data.keywords],
      ["name", "author", "Stepan Roze"],
      ["name", "robots", "index, follow, max-image-preview:large, max-snippet:-1"],
      ["name", "googlebot", "index, follow"],
      ["name", "theme-color", "#0a0a0a"],
      ["name", "color-scheme", "dark light"],
      // Open Graph
      ["property", "og:type", "website"],
      ["property", "og:site_name", "Stepan Roze Portfolio"],
      ["property", "og:title", data.title],
      ["property", "og:description", data.description],
      ["property", "og:image", "https://roze.live/og-image.jpg"],
      ["property", "og:image:width", "1200"],
      ["property", "og:image:height", "630"],
      ["property", "og:url", "https://roze.live/"],
      ["property", "og:locale", language === 'uk' ? 'uk_UA' : language === 'nl' ? 'nl_NL' : language === 'ar' ? 'ar_SA' : language === 'es' ? 'es_ES' : 'en_US'],
      // Twitter
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", data.title],
      ["name", "twitter:description", data.description],
      ["name", "twitter:image", "https://roze.live/og-image.jpg"],
      // Geo
      ["name", "geo.region", "BE"],
      ["name", "geo.placename", "Belgium"],
    ];

    metas.forEach(([attr, key, content]) => setMeta(attr, key, content));

    // Canonical
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canon) { canon = document.createElement("link"); canon.rel = "canonical"; document.head.appendChild(canon); }
    canon.href = "https://roze.live/";

    // Alternate languages
    const alts: Record<string, string> = {
      en: "https://roze.live/?lang=en",
      uk: "https://roze.live/?lang=uk",
      nl: "https://roze.live/?lang=nl",
      ar: "https://roze.live/?lang=ar",
      es: "https://roze.live/?lang=es",
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
    xd.href = "https://roze.live/";
    document.head.appendChild(xd);

    // JSON-LD structured data
    let scriptPerson = document.getElementById('ld-person');
    if (!scriptPerson) {
      scriptPerson = document.createElement("script");
      scriptPerson.id = "ld-person";
      scriptPerson.type = "application/ld+json";
      document.head.appendChild(scriptPerson);
    }
    scriptPerson.textContent = JSON.stringify(structuredData);

    let scriptSite = document.getElementById('ld-website');
    if (!scriptSite) {
      scriptSite = document.createElement("script");
      scriptSite.id = "ld-website";
      scriptSite.type = "application/ld+json";
      document.head.appendChild(scriptSite);
    }
    scriptSite.textContent = JSON.stringify(websiteData);

  }, [language, data]);

  return null;
}

function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
}
