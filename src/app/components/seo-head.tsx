import { useEffect } from "react";
import { useLanguage } from "../contexts/language-context";

const seoData: Record<string, { title: string; description: string; keywords: string }> = {
  en: {
    title: "Stepan Roze | Front-End & JavaScript Developer — React, TypeScript, Next.js | Belgium",
    description: "Front-End / JavaScript Developer with 8+ years of commercial experience building e-commerce and enterprise web apps (childrensalon.com, vogacloset.com, Oschadbank). React, TypeScript, Vue, Next.js & Magento. Based in Lommel, Belgium. Available for freelance.",
    keywords: "Front-End Developer, JavaScript Developer, React Developer, TypeScript, Vue.js, Next.js, Magento, E-commerce Developer, Freelance Developer Belgium, Web Developer, Knockout.js, Node.js",
  },
  uk: {
    title: "Степан Розе | Front-End та JavaScript розробник — React, TypeScript, Next.js | Бельгія",
    description: "Front-End / JavaScript розробник з 8+ роками комерційного досвіду в e-commerce та enterprise (childrensalon.com, vogacloset.com, Ощадбанк). React, TypeScript, Vue, Next.js та Magento. Ломмель, Бельгія. Доступний для фрілансу.",
    keywords: "Front-End розробник, JavaScript розробник, React, TypeScript, Vue.js, Next.js, Magento, E-commerce розробник, Фріланс Бельгія, Веб-розробник",
  },
  nl: {
    title: "Stepan Roze | Front-End & JavaScript Developer — React, TypeScript, Next.js | België",
    description: "Front-End / JavaScript Developer met 8+ jaar commerciële ervaring in e-commerce en enterprise webapps (childrensalon.com, vogacloset.com, Oschadbank). React, TypeScript, Vue, Next.js & Magento. Lommel, België. Beschikbaar als freelancer.",
    keywords: "Front-End Developer, JavaScript Developer, React Developer, TypeScript, Vue.js, Next.js, Magento, E-commerce Developer, Freelance Developer België, Webontwikkelaar",
  },
  ar: {
    title: "ستيبان روز | مطور Front-End و JavaScript — React, TypeScript, Next.js | بلجيكا",
    description: "مطور Front-End / JavaScript مع أكثر من 8 سنوات خبرة تجارية في التجارة الإلكترونية وتطبيقات المؤسسات. React, TypeScript, Vue, Next.js و Magento. لوميل، بلجيكا.",
    keywords: "مطور Front-End, مطور JavaScript, مطور React, TypeScript, Vue.js, Next.js, Magento, مطور مستقل بلجيكا",
  },
  es: {
    title: "Stepan Roze | Front-End & JavaScript Developer — React, TypeScript, Next.js | Bélgica",
    description: "Desarrollador Front-End / JavaScript con 8+ años de experiencia comercial en e-commerce y aplicaciones enterprise (childrensalon.com, vogacloset.com, Oschadbank). React, TypeScript, Vue, Next.js y Magento. Lommel, Bélgica. Disponible como freelance.",
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
  address: { "@type": "PostalAddress", addressLocality: "Lommel", addressCountry: "BE" },
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
