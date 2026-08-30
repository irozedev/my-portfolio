import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Linkedin, Github, Briefcase, Send, CheckCircle2, Clock, MessageSquare, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useViewMode } from "../contexts/view-mode-context";
import { submitLead } from "../lib/submit-lead";
import { openMailtoLead, CONTACT_EMAIL } from "../lib/lead-fallback";
import { toast } from "sonner";
import { VIEWPORT, DURATION, EASE } from "../lib/motion";

// Simple form components
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className={className} {...props} />
);

const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={className} {...props} />
);

const Button = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={className} {...props}>{children}</button>
);

/**
 * Digits only, country code included, no + or spaces — that is the format
 * wa.me wants. Leave it empty and the WhatsApp card is simply not rendered,
 * so a half-filled number can never ship as a dead link.
 *
 * Worth having: WhatsApp is how business is contacted in the Netherlands and
 * Flanders (13.8M users, ~90% of internet users) where a contact form is not.
 */
const WHATSAPP_NUMBER = "32469631424";

const contactLinks = [
  {
    icon: Mail,
    key: 'email',
    value: "rozedev095@gmail.com",
    href: "mailto:rozedev095@gmail.com",
    color: "#00d9ff",
  },
  ...(WHATSAPP_NUMBER
    ? [{
        icon: MessageCircle,
        key: 'whatsapp',
        value: "+32 469 63 14 24",
        href: `https://wa.me/${WHATSAPP_NUMBER}`,
        label: "WhatsApp",
        color: "#25d366",
      }]
    : []),
  {
    icon: Linkedin,
    key: 'linkedin',
    value: "linkedin.com/in/rozestepan",
    href: "https://linkedin.com/in/rozestepan",
    color: "#0077b5",
  },
  {
    icon: Github,
    key: 'github',
    value: "github.com/irozedev",
    href: "https://github.com/irozedev",
    label: "GitHub",
    color: "#333333",
  },
  {
    icon: Briefcase,
    key: 'upwork',
    value: "upwork.com/freelancers/rozestepan",
    href: "https://www.upwork.com/freelancers/rozestepan",
    color: "#6fda44",
  },
];

export function ContactSection() {
  const { t, language } = useLanguage();
  const { isClientMode } = useViewMode();

  const L = (en: string, nl: string, ar: string, es: string) =>
    language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [servicePreselected, setServicePreselected] = useState(false);

  // Check for preselected service from sessionStorage
  useEffect(() => {
    const checkPreselectedService = () => {
      const selectedServiceKey = sessionStorage.getItem('selectedService');
      if (selectedServiceKey) {
        // Map service keys to display names
        const serviceNames: { [key: string]: string } = {
          'website': 'Web Development',
          'ecommerce': 'E-Commerce Solutions',
          'webapp': 'Web Applications',
          'automation': 'Process Automation',
          'chatbot': 'AI Chatbots',
          'consulting': 'Tech Consulting',
        };
        
        const serviceName = serviceNames[selectedServiceKey] || selectedServiceKey;
        setFormData(prev => ({ ...prev, service: serviceName }));
        setServicePreselected(true);
        
        // Clear from sessionStorage
        sessionStorage.removeItem('selectedService');
        
        // Optional: Add a pre-filled message template
        setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            message: prev.message || `Hi Stepan! I'm interested in ${serviceName}. I'd like to discuss...`
          }));
        }, 300);

        // Hide badge after 5 seconds
        setTimeout(() => setServicePreselected(false), 5000);
      }
    };

    checkPreselectedService();
    
    // Also listen for the contact section becoming visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        checkPreselectedService();
      }
    }, { threshold: 0.3 });

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      observer.observe(contactSection);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // The two modes reuse the same three server fields, so the payload says
      // which meaning they carry. Without this the lead email reads "Budget:
      // Colruyt Group / Timeline: Front-End Developer", which is unusable when
      // you are trying to answer it a week later.
      const payload = isClientMode
        ? { ...formData, source: 'client' }
        : {
            name: formData.name,
            email: formData.email,
            service: `Hiring enquiry — ${formData.service || 'unspecified'}`,
            budget: formData.budget ? `Company: ${formData.budget}` : 'Company: not given',
            timeline: formData.timeline ? `Role: ${formData.timeline}` : 'Role: not given',
            message: formData.message,
            source: 'cv',
          };

      const ok = await submitLead(payload);

      if (ok) {
        toast.success(t("contact.successMessage") || "Message sent successfully! I'll get back to you soon.");
        setFormData({ name: "", email: "", service: "", budget: "", timeline: "", message: "" });
      } else {
        throw new Error('form endpoint rejected the submission');
      }
    } catch (error) {
      /* The endpoint is unreachable, not merely unhappy: the Supabase project
         the site posts to does not resolve. Telling the visitor to "email
         directly" makes them retype everything they just filled in, so hand
         them a draft that already contains it. */
      console.error('Error sending message:', error);
      toast.error(
        t("contact.sendFailed") ||
          `Could not send from the site. Opening your mail app with the message ready \u2014 or write to ${CONTACT_EMAIL}.`,
      );
      openMailtoLead(language, {
        name: formData.name,
        email: formData.email,
        service: formData.service,
        budget: formData.budget,
        timeline: formData.timeline,
        message: formData.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // "Free initial consultation" and "Flexible working arrangements" are things
  // you say to someone deciding whether to buy. To someone deciding whether to
  // interview you, the useful facts are different — and the right-to-work one
  // answers a question a Belgian employer is not allowed to ask outright.
  const benefits = [
    { icon: Clock, text: t('contact.benefits.response') },
    {
      icon: MessageSquare,
      text: isClientMode
        ? t('contact.benefits.consultation')
        : L(
            "Happy to start with a short intro call",
            "Graag eerst een kort kennismakingsgesprek",
            "يسعدني البدء بمكالمة تعارف قصيرة",
            "Encantado de empezar con una llamada breve",
          ),
    },
    {
      icon: CheckCircle2,
      text: isClientMode
        ? t('contact.benefits.flexible')
        : L(
            "Based in Belgium — no sponsorship needed",
            "Woonachtig in België — geen sponsoring nodig",
            "مقيم في بلجيكا — لا حاجة إلى كفالة",
            "Residente en Bélgica — sin necesidad de patrocinio",
          ),
    },
  ];

  return (
    <section id="contact" className="min-h-screen py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] relative overflow-hidden scroll-mt-24 md:scroll-mt-28">
      {/* Background Elements */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-[radial-gradient(closest-side,var(--glow-secondary),transparent)]" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: DURATION, ease: EASE }}
        >
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-[var(--text-primary)]"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
            >
              {(t("contact.title") || "Get In Touch").toUpperCase()}
            </motion.h2>
            
            <motion.div
              className="h-1 w-24 sm:w-32 bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent mx-auto mb-4 sm:mb-6"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT}
              transition={{ delay: 0.3 }}
            />

            <motion.p
              className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-4 px-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VIEWPORT}
              transition={{ delay: 0.5 }}
            >
              Whether you need a custom app, optimization, or technical advice, I'm here to help.
            </motion.p>

            {/* Benefits */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 px-2"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ delay: 0.7 }}
            >
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-primary)] flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{benefit.text}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Left Column - Contact Methods */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: DURATION, ease: EASE }}
            >
              {contactLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.key}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block group"
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT}
                    transition={{ delay: Math.min(index, 6) * 0.05 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <div className="relative p-4 sm:p-6 md:p-8 bg-[var(--bg-secondary)]/50 backdrop-blur-md border border-[var(--border-color)] rounded-2xl sm:rounded-3xl
                      hover:bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/50 transition-all duration-500
                      hover:shadow-[0_0_30px_var(--shadow-color)] overflow-hidden">
                      {/* Gradient Background on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/0 via-[#00d9ff]/5 to-[#00d9ff]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative flex items-center gap-3 sm:gap-4 md:gap-5">
                        {/* Icon */}
                        <motion.div
                          className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl flex items-center justify-center border-2 transition-all duration-300 group-hover:shadow-lg"
                          style={{
                            backgroundColor: `${link.color}20`,
                            borderColor: link.color,
                          }}
                          whileHover={{ rotate: 5, scale: 1.1 }}
                        >
                          <Icon 
                            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-all duration-300" 
                            style={{ color: link.color }}
                          />
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-0.5 sm:mb-1 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                            {t(`contact.contactLinks.${link.key}.label`)}
                          </h3>
                          <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] truncate">
                            {link.value}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5 sm:mt-1 hidden sm:block">
                            {t(`contact.contactLinks.${link.key}.description`)}
                          </p>
                        </div>

                        {/* Arrow */}
                        <motion.div
                          className="flex-shrink-0 text-lg sm:text-xl text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.div>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: DURATION, ease: EASE }}
              className="relative"
            >
              {/* Service Preselected Badge */}
              <AnimatePresence>
                {servicePreselected && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Service loaded!</span>
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="relative p-6 sm:p-8 bg-[var(--bg-secondary)]/50 backdrop-blur-md border border-[var(--border-color)] rounded-3xl space-y-6">
                {/* Light Theme Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/5 to-[#00d9ff]/[0.02] rounded-3xl opacity-50" />
                
                <div className="relative space-y-5">
                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[var(--text-muted)]">
                        {t("contact.form.name")}
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full h-12 px-4 text-base bg-white dark:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl
                          text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                          focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[var(--text-muted)]">
                        {t("contact.form.email")}
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full h-12 px-4 text-base bg-white dark:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl
                          text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                          focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/*
                    The form asks different questions of the two audiences.

                    It used to ask everyone the same three: pick a service, name
                    a budget, name a timeline — and all three were `required`.
                    In CV mode that made the form not merely off-key but
                    unusable: a recruiter with a vacancy has no budget figure to
                    type, so they either invented one or gave up on the only
                    contact channel on the page.
                  */}
                  <div>
                    <label htmlFor="service" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[var(--text-muted)]">
                      {isClientMode
                        ? t("contact.form.service")
                        : L("What is this about?", "Waar gaat het over?", "بخصوص ماذا؟", "¿De qué se trata?")}
                    </label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      required
                      className="w-full h-12 px-4 text-base bg-white dark:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl
                        text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                        focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 focus:outline-none transition-all cursor-pointer"
                    >
                      {isClientMode ? (
                        <>
                          <option value="">Select a service</option>
                          <option value="Web Development">Web Development</option>
                          <option value="E-Commerce Solutions">E-Commerce Solutions</option>
                          <option value="Web Applications">Web Applications</option>
                          <option value="Process Automation">Process Automation</option>
                          <option value="AI Chatbots">AI Chatbots</option>
                          <option value="Tech Consulting">Tech Consulting</option>
                          <option value="Other">Other</option>
                        </>
                      ) : (
                        <>
                          <option value="">
                            {L("Select one", "Maak een keuze", "اختر واحدًا", "Elige una opción")}
                          </option>
                          <option value="Full-time position">
                            {L("Full-time position", "Vaste functie", "وظيفة بدوام كامل", "Puesto a tiempo completo")}
                          </option>
                          <option value="Contract / interim role">
                            {L("Contract / interim role", "Contract / interim", "عقد / مؤقت", "Contrato / interino")}
                          </option>
                          <option value="Introductory call">
                            {L("Introductory call", "Kennismakingsgesprek", "مكالمة تعارف", "Llamada introductoria")}
                          </option>
                          <option value="Other">{L("Other", "Anders", "أخرى", "Otro")}</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Client: budget + timeline. CV: company + role — the two
                      things a recruiter can actually answer, and neither is
                      required, so nothing blocks the send. */}
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor="budget" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[var(--text-muted)]">
                        {isClientMode
                          ? t("contact.form.budget")
                          : L("Company", "Bedrijf", "الشركة", "Empresa")}
                      </label>
                      <Input
                        id="budget"
                        type="text"
                        placeholder={isClientMode ? "€5,000 - €10,000" : L("Company name", "Bedrijfsnaam", "اسم الشركة", "Nombre de la empresa")}
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        required={isClientMode}
                        className="w-full h-12 px-4 text-base bg-white dark:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl
                          text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                          focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="timeline" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[var(--text-muted)]">
                        {isClientMode
                          ? t("contact.form.timeline")
                          : L("Role", "Functie", "الوظيفة", "Puesto")}
                      </label>
                      <Input
                        id="timeline"
                        type="text"
                        placeholder={isClientMode ? "1-3 months" : L("e.g. Front-End Developer", "bijv. Front-end developer", "مثال: مطوّر واجهات", "p. ej. Desarrollador Front-End")}
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        required={isClientMode}
                        className="w-full h-12 px-4 text-base bg-white dark:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl
                          text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                          focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[var(--text-muted)]">
                      {t("contact.form.message")}
                    </label>
                    <Textarea
                      id="message"
                      placeholder={
                        isClientMode
                          ? t("contact.form.messagePlaceholder")
                          : L(
                              "Tell me about the role and the team…",
                              "Vertel iets over de functie en het team…",
                              "أخبرني عن الوظيفة والفريق…",
                              "Cuéntame sobre el puesto y el equipo…",
                            )
                      }
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full px-4 py-3 text-base bg-white dark:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl
                        text-[var(--text-primary)] placeholder:text-[var(--text-muted)] min-h-[130px] md:min-h-[160px]
                        focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 focus:outline-none transition-all resize-y"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-[#00d9ff] to-cyan-400
                      hover:from-cyan-400 hover:to-[#00d9ff] text-black
                      shadow-[0_4px_20px_rgba(0,217,255,0.3)] hover:shadow-[0_8px_30px_rgba(0,217,255,0.5)]
                      transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span className="text-base sm:text-lg">{t("contact.sending")}</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <Send className="w-5 h-5" />
                        <span className="text-base sm:text-lg">{t("contact.send")}</span>
                      </span>
                    )}
                  </Button>

                  <p className="text-sm sm:text-base text-[var(--text-muted)] text-center">
                    {t("contact.formNote")}
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}