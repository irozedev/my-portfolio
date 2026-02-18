import { motion } from "motion/react";
import { Code, Globe, Bot, Zap, ArrowRight, CheckCircle2, Sparkles, ShoppingCart, Workflow, TrendingUp } from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      key: 'website',
      icon: Globe,
      color: "#00d9ff",
      gradient: "from-[#00d9ff] to-cyan-500",
      timeline: "2-4 weeks",
      features: ["Responsive design", "SEO optimization", "CMS integration", "Analytics"],
    },
    {
      key: 'ecommerce',
      icon: ShoppingCart,
      color: "#a78bfa",
      gradient: "from-purple-500 to-indigo-500",
      popular: true,
      timeline: "4-8 weeks",
      features: ["Full platform", "Payment gateway", "Inventory mgmt", "Admin dashboard"],
    },
    {
      key: 'automation',
      icon: Workflow,
      color: "#22c55e",
      gradient: "from-green-500 to-emerald-500",
      timeline: "1-3 weeks",
      features: ["Process automation", "API integrations", "Data sync", "Custom scripts"],
    },
    {
      key: 'chatbot',
      icon: Bot,
      color: "#f59e0b",
      gradient: "from-orange-500 to-yellow-500",
      timeline: "2-4 weeks",
      features: ["WhatsApp/Telegram", "AI-powered (GPT)", "Multi-language", "24/7 support"],
    },
    {
      key: 'webapp',
      icon: Code,
      color: "#ec4899",
      gradient: "from-pink-500 to-rose-500",
      timeline: "4-12 weeks",
      features: ["Custom web app", "React/Vue.js", "Real-time features", "Scalable"],
    },
    {
      key: 'consulting',
      icon: TrendingUp,
      color: "#8b5cf6",
      gradient: "from-violet-500 to-purple-500",
      timeline: "Flexible",
      features: ["Tech consulting", "Code review", "Architecture", "Performance audit"],
    },
  ];

  const handleServiceClick = (serviceKey: string) => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      sessionStorage.setItem('selectedService', serviceKey);
    }
  };
  
  return (
    <section id="services" className="py-12 md:py-16 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-[var(--accent-primary)]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto max-w-7xl relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Compact Header */}
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-[#00d9ff]/20 to-purple-500/20 border border-[#00d9ff]/30 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-4 h-4 text-[#00d9ff]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">Services</span>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent">
                What I Can Build
              </span>
            </motion.h2>

            <motion.p
              className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Professional development services for European businesses
            </motion.p>
          </div>

          {/* Compact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.key}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Popular Badge */}
                  {service.popular && (
                    <div 
                      className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
                    >
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                        ⭐ Popular
                      </div>
                    </div>
                  )}

                  {/* Glow */}
                  <motion.div
                    className={`absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity bg-gradient-to-r ${service.gradient}`}
                  />

                  {/* Card */}
                  <motion.div
                    onClick={() => handleServiceClick(service.key)}
                    className="relative h-full bg-[var(--glass-bg)] backdrop-blur-xl border-2 border-[var(--glass-border)] rounded-2xl p-5 hover:border-[#00d9ff]/50 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Icon & Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-[var(--text-primary)] opacity-70">
                          Contact for
                        </div>
                        <div className="text-base font-bold text-[var(--accent-primary)]">
                          Quote
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                      {service.key.charAt(0).toUpperCase() + service.key.slice(1)}
                    </h3>

                    {/* Timeline */}
                    <div className="flex items-center gap-2 mb-3 text-xs">
                      <span className="px-2 py-1 bg-[var(--glass-bg)] rounded-lg text-[var(--text-secondary)]">
                        {service.timeline}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-1.5 mb-4">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: service.color }} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                      <span className="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-[#00d9ff] transition-colors">
                        Get Started
                      </span>
                      <ArrowRight className="w-5 h-5 text-[#00d9ff] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block p-6 md:p-8 bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/10 border-2 border-[#00d9ff]/30 rounded-2xl">
              <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-2">
                Need something custom?
              </p>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[var(--accent-primary)] via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Let's discuss your project!
              </p>
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
