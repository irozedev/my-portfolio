import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Linkedin, Github, Briefcase, Send, CheckCircle2, XCircle, Loader2, Clock, MessageSquare, Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { projectId, publicAnonKey } from "@/utils/supabase/info";
import { useAvailability } from "../contexts/availability-context";

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

const contactLinks = [
  {
    icon: Mail,
    key: 'email',
    value: "hello@roze.live",
    href: "mailto:hello@roze.live",
    color: "#00d9ff",
  },
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
  const { t } = useLanguage();
  const { isAvailable, statusText, statusEmoji, detailedStatus } = useAvailability();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
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
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(t("contact.successMessage") || "Message sent successfully! I'll get back to you soon.");
        setFormData({ name: "", email: "", service: "", message: "" });
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send message. Please try emailing directly.");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert("Failed to send message. Please try emailing hello@roze.live directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: Clock, text: t('contact.benefits.response') },
    { icon: MessageSquare, text: t('contact.benefits.consultation') },
    { icon: CheckCircle2, text: t('contact.benefits.flexible') },
  ];

  return (
    <section id="contact" className="min-h-screen py-6 sm:py-8 md:py-10 px-3 sm:px-4 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-[var(--text-primary)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {(t("contact.title") || "Get In Touch").toUpperCase()}
            </motion.h2>
            
            <motion.div
              className="h-1 w-24 sm:w-32 bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent mx-auto mb-4 sm:mb-6"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            />

            <motion.p
              className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-4 px-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Whether you need a custom app, optimization, or technical advice, I'm here to help.
            </motion.p>

            {/* Benefits */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 px-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#00d9ff] flex-shrink-0" />
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
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <div className="relative p-4 sm:p-6 md:p-8 bg-[var(--bg-secondary)]/50 backdrop-blur-md border border-[var(--border-color)] rounded-2xl sm:rounded-3xl
                      hover:bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/50 transition-all duration-500
                      hover:shadow-[0_0_30px_var(--shadow-color)] overflow-hidden">
                      {/* Gradient Background on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/0 via-[#00d9ff]/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
                          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-0.5 sm:mb-1 text-[var(--text-primary)] group-hover:text-[#00d9ff] transition-colors">
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
                          className="flex-shrink-0 text-lg sm:text-xl text-[var(--text-muted)] group-hover:text-[#00d9ff] transition-colors"
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
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
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
                <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/5 to-purple-500/5 rounded-3xl opacity-50" />
                
                <div className="relative space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-base sm:text-lg font-semibold mb-3 text-[var(--text-primary)]">
                      {t("contact.form.name")}
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full h-14 px-5 text-base sm:text-lg bg-white dark:bg-[var(--bg-primary)] border-2 border-[var(--border-color)] rounded-xl
                        text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                        focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-base sm:text-lg font-semibold mb-3 text-[var(--text-primary)]">
                      {t("contact.form.email")}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full h-14 px-5 text-base sm:text-lg bg-white dark:bg-[var(--bg-primary)] border-2 border-[var(--border-color)] rounded-xl
                        text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                        focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-base sm:text-lg font-semibold mb-3 text-[var(--text-primary)]">
                      {t("contact.form.service")}
                    </label>
                    <Input
                      id="service"
                      type="text"
                      placeholder="Web Development"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      required
                      className="w-full h-14 px-5 text-base sm:text-lg bg-white dark:bg-[var(--bg-primary)] border-2 border-[var(--border-color)] rounded-xl
                        text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                        focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-base sm:text-lg font-semibold mb-3 text-[var(--text-primary)]">
                      {t("contact.form.message")}
                    </label>
                    <Textarea
                      id="message"
                      placeholder={t("contact.form.messagePlaceholder")}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={8}
                      className="w-full px-5 py-4 text-base sm:text-lg bg-white dark:bg-[var(--bg-primary)] border-2 border-[var(--border-color)] rounded-xl
                        text-[var(--text-primary)] placeholder:text-[var(--text-muted)] min-h-[150px] md:min-h-[200px]
                        focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 transition-all resize-y"
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