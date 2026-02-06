import { useEffect } from "react";
import { useLanguage } from "../contexts/language-context";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export function SEOHead({
  title = "Stepan Roze | Frontend Developer & Web Development Expert",
  description = "Experienced Frontend Developer specializing in React, TypeScript, Next.js, and modern web technologies. 5+ years building high-performance web applications, e-commerce platforms, and SaaS solutions.",
  keywords = "Frontend Developer, React Developer, TypeScript, Next.js, Web Development, JavaScript",
  ogImage = "https://roze.live/og-image.jpg",
  canonical = "https://roze.live/",
}: SEOHeadProps) {
  const { language } = useLanguage();

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag("name", "description", description);
    updateMetaTag("name", "keywords", keywords);
    updateMetaTag("property", "og:title", title);
    updateMetaTag("property", "og:description", description);
    updateMetaTag("property", "og:image", ogImage);
    updateMetaTag("property", "twitter:title", title);
    updateMetaTag("property", "twitter:description", description);
    updateMetaTag("property", "twitter:image", ogImage);

    // Update canonical link
    updateCanonicalLink(canonical);

    // Update language
    document.documentElement.lang = language;
  }, [title, description, keywords, ogImage, canonical, language]);

  return null;
}

function updateMetaTag(attr: string, attrValue: string, content: string) {
  let element = document.querySelector(`meta[${attr}="${attrValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updateCanonicalLink(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}