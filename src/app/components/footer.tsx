import { motion } from "motion/react";
import { Github, Linkedin, Mail, Code2, Briefcase } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useAvailability } from "../contexts/availability-context";
import { useViewMode } from "../contexts/view-mode-context";
import { LegalFooter } from "./legal-footer";
import { smoothScrollToSection } from "../../utils/scroll-utils";
import { VIEWPORT } from "../lib/motion";

// `clientOnly` links are hidden in CV mode. An Upwork freelancer profile is a
// useful proof point for a buyer and a mixed signal for a recruiter, who reads
// it as "available for gigs" rather than "looking for a position".
const socialLinks = [
  { icon: Github, href: "https://github.com/irozedev", label: "GitHub", color: "#333333" },
  { icon: Linkedin, href: "https://linkedin.com/in/rozestepan", label: "LinkedIn", color: "#0077b5" },
  { icon: Briefcase, href: "https://www.upwork.com/freelancers/rozestepan", label: "Upwork", color: "#14a800", clientOnly: true },
  { icon: Mail, href: "mailto:rozedev095@gmail.com", label: "Email", color: "#00d9ff" },
];

export function Footer() {
  const { t, language } = useLanguage();
  const { isAvailable } = useAvailability();
  const { isClientMode } = useViewMode();

  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  // ✅ ВИПРАВЛЕННЯ: Обробник кліка для якірних посилань
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    smoothScrollToSection(href);
  };

  // The footer used to render identically in both view modes, which broke it
  // twice over in CV mode: it linked to `#services`, a section main-page.tsx
  // does not render there, so five of nine links scrolled nowhere; and the
  // whole "Services" column is a sales menu aimed at a buyer, not a recruiter.
  const footerLinks = [
    {
      title: t("footer.navigation"),
      links: [
        { label: t("nav.about"), href: "#about" },
        // Mirror of the services case: #experience only exists in CV mode.
        ...(isClientMode ? [] : [{ label: t("nav.experience"), href: "#experience" }]),
        { label: t("nav.projects"), href: "#projects" },
        ...(isClientMode ? [{ label: t("nav.services"), href: "#services" }] : []),
        { label: t("nav.contact"), href: "#contact" },
      ],
    },
    ...(isClientMode
      ? [
          {
            title: t("footer.services"),
            links: [
              { label: t("footer.frontendDev"), href: "#services" },
              { label: t("footer.ecommerce"), href: "#services" },
              { label: t("footer.consulting"), href: "#services" },
              { label: t("footer.fullstack"), href: "#services" },
            ],
          },
        ]
      : []),
  ];

  return (
    <footer id="footer" className="relative bg-[var(--bg-primary)] border-t border-[var(--border-color)] py-12 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Main Footer Content.
            The column count follows the content. It was hardcoded to 4 while
            the brand block spans 2 and the number of link columns depends on
            the view mode — so in CV mode, with its single Navigation column,
            three of four tracks were filled and the footer sat against the left
            edge with ~360px of dead space on the right. */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 ${
            isClientMode ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-purple-500 bg-clip-text text-transparent">
                  Stepan Roze
                </h3>
                {/* `hero.role` is agency copy — "I build high-converting
                    websites & AI automation for businesses". Fine when the
                    reader is buying; wrong when they are hiring. */}
                <p className="text-sm text-[var(--text-secondary)] font-medium">
                  {isClientMode
                    ? `${t("hero.role")} & ${t("hero.aiEnthusiast")}`
                    : L(
                        "Front-End / JavaScript Developer · 8+ years",
                        "Front-end / JavaScript-ontwikkelaar · 8+ jaar",
                        "مطوّر Front-End / JavaScript · أكثر من 8 سنوات",
                        "Desarrollador Front-End / JavaScript · 8+ años",
                      )}
                </p>
              </div>
            </div>

            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed max-w-md text-base md:text-lg">
              {isClientMode
                ? t("hero.description")
                : L(
                    "8+ years building e-commerce and enterprise web applications — luxury retail at childrensalon.com and vogacloset.com, banking systems at Oschadbank. Based in Belgium, working in English.",
                    "8+ jaar e-commerce en enterprise-webapplicaties gebouwd — luxe retail bij childrensalon.com en vogacloset.com, banksystemen bij Oschadbank. Gevestigd in België, werktaal Engels.",
                    "أكثر من 8 سنوات في بناء تطبيقات التجارة الإلكترونية وتطبيقات المؤسسات — تجزئة فاخرة في childrensalon.com وvogacloset.com، وأنظمة مصرفية في Oschadbank. مقيم في بلجيكا، ولغة العمل الإنجليزية.",
                    "8+ años construyendo e-commerce y aplicaciones web empresariales — retail de lujo en childrensalon.com y vogacloset.com, sistemas bancarios en Oschadbank. Residente en Bélgica, idioma de trabajo inglés.",
                  )}
            </p>

            {/* Status Badge - synced with availability context */}
            <div className={`inline-flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm ${
              isAvailable 
                ? 'from-green-500/10 to-[#00d9ff]/10 border border-green-500/30' 
                : 'from-red-500/10 to-orange-500/10 border border-red-500/30'
            }`}>
              <div className="relative flex-shrink-0">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  isAvailable ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div className={`absolute inset-0 w-3 h-3 rounded-full animate-ping ${
                  isAvailable ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              <div>
                <motion.a 
                  href="#contact"
                  onClick={(e) => handleAnchorClick(e, "#contact")}
                  className="text-base md:text-lg font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  {isAvailable ? t('footer.letsBuild') : t('footer.coffeeBreak')}
                </motion.a>
                {/* "Full-time & Freelance" pointing at #services: the label
                    advertises availability for gigs and the target section is
                    not rendered in CV mode. In CV mode state the employment
                    intent plainly and link to contact instead. */}
                <motion.a
                  href={isClientMode ? "#services" : "#contact"}
                  onClick={(e) => handleAnchorClick(e, isClientMode ? "#services" : "#contact")}
                  className="text-sm md:text-base text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer block whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  {isClientMode
                    ? t('footer.workType')
                    : L(
                        "Open to full-time roles",
                        "Open voor vaste functies",
                        "متاح لوظائف بدوام كامل",
                        "Abierto a puestos a tiempo completo",
                      )}
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Links Columns */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ delay: Math.min(index, 6) * 0.05 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-[var(--accent-primary)]">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300 flex items-center gap-2 group cursor-pointer"
                    >
                      <span className="w-0 h-px bg-[var(--accent-primary)] group-hover:w-4 transition-all duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <motion.p
            className="text-sm md:text-base text-[var(--text-secondary)] text-center md:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
          >
            © 2026 Stepan Roze. {t("footer.rights")}
          </motion.p>

          {/* Social Links */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.2 }}
          >
            {socialLinks.filter((s) => isClientMode || !s.clientOnly).map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="p-3 bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:scale-110 transition-all duration-300 group"
                  whileHover={{ y: -5 }}
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5 transition-colors" />
                </motion.a>
              );
            })}
          </motion.div>
        </div>

        {/* Extra Info */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm md:text-base text-[var(--text-muted)]">
            {t("footer.builtWith")}
          </p>
        </motion.div>
      </div>

      {/* Legal Footer */}
      <LegalFooter />
    </footer>
  );
}