import { motion } from "motion/react";
import { Code, Globe, Bot, ShoppingCart, Workflow, TrendingUp, Sparkles, Zap, CheckCircle2, MousePointerClick } from "lucide-react";
import { useState } from "react";
import { ServiceActionModal } from "./service-action-modal";
import { ServicesCarousel } from "./services-carousel";

const services = [
  {
    id: 1,
    key: 'website',
    icon: Globe,
    title: "Web Development",
    description: "Custom websites that convert visitors into customers with modern design and best practices",
    color: "#00d9ff",
    gradient: "from-[#00d9ff] to-cyan-500",
    price: 2500,
    priceWithTax: 3025,
    features: ["Responsive Design", "SEO Optimized", "CMS Integration", "Analytics Setup", "Fast Loading", "Cross-browser Compatible"],
  },
  {
    id: 2,
    key: 'ecommerce',
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    description: "Full-featured online stores with seamless checkout and inventory management",
    color: "#a78bfa",
    gradient: "from-purple-500 to-indigo-500",
    popular: true,
    price: 5000,
    priceWithTax: 6050,
    features: ["Payment Gateway Integration", "Inventory Management", "Admin Dashboard", "Order Tracking", "Email Notifications", "Customer Reviews"],
  },
  {
    id: 3,
    key: 'webapp',
    icon: Code,
    title: "Web Applications",
    description: "Scalable apps built with modern frameworks like React, Next.js and TypeScript",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-500",
    price: 4000,
    priceWithTax: 4840,
    features: ["React/Vue.js Development", "Real-time Features", "API Development", "Cloud Hosting", "Database Design", "User Authentication"],
  },
  {
    id: 4,
    key: 'automation',
    icon: Workflow,
    title: "Process Automation",
    description: "Streamline workflows and boost productivity with intelligent automation solutions",
    color: "#22c55e",
    gradient: "from-green-500 to-emerald-500",
    price: 1500,
    priceWithTax: 1815,
    features: ["API Integration", "Data Sync", "Custom Scripts", "Workflow Design", "Task Scheduling", "Reporting Tools"],
  },
  {
    id: 5,
    key: 'chatbot',
    icon: Bot,
    title: "AI Chatbots",
    description: "Intelligent bots powered by GPT technology for customer support and engagement",
    color: "#f59e0b",
    gradient: "from-orange-500 to-yellow-500",
    price: 2000,
    priceWithTax: 2420,
    features: ["WhatsApp/Telegram Integration", "Multi-language Support", "AI-Powered Responses", "24/7 Availability", "Analytics Dashboard", "Custom Training"],
  },
  {
    id: 6,
    key: 'consulting',
    icon: TrendingUp,
    title: "Tech Consulting",
    description: "Expert advice for your technical challenges and architecture decisions",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-500",
    price: 500,
    priceWithTax: 605,
    features: ["Code Review", "Architecture Design", "Performance Audit", "Best Practices", "Team Training", "Technical Documentation"],
  },
];

export function ServicesUltra() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  const handleBookService = (service: typeof services[0]) => {
    setSelectedService(service);
  };

  return (
    <>
      <section
        id="services"
        className="relative py-20 md:py-32 px-4 bg-[var(--bg-primary)] overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 -left-40 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-gradient-to-r from-purple-500/10 to-[var(--accent-primary)]/10 backdrop-blur-sm border border-purple-500/20 rounded-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">SERVICES & PRICING</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-400 to-[var(--accent-primary)] bg-clip-text text-transparent">
                What I Offer
              </span>
            </h2>

            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Comprehensive web development services with transparent pricing
            </p>
          </motion.div>

          {/* Services Grid - Show ALL services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className={`relative h-full bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-3xl overflow-hidden cursor-pointer hover:border-[${service.color}]/50 transition-all`}>
                    {/* Tap Indicator */}
                    <motion.div
                      className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 bg-[#00d9ff] text-black rounded-full shadow-lg font-bold text-xs"
                      animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 0 20px rgba(0,217,255,0.4)",
                          "0 0 30px rgba(0,217,255,0.7)",
                          "0 0 20px rgba(0,217,255,0.4)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <MousePointerClick className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Click</span>
                    </motion.div>
                    
                    {/* Popular Badge */}
                    {service.popular && (
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                        <span className="text-xs font-bold text-white">POPULAR</span>
                      </div>
                    )}

                    {/* Icon & Title */}
                    <div className="p-6 pb-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                        style={{ background: `linear-gradient(135deg, ${service.color}20, ${service.color}10)` }}
                      >
                        <Icon className="w-8 h-8" style={{ color: service.color }} />
                      </div>

                      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                        {service.title}
                      </h3>

                      <p className="text-[var(--text-secondary)] mb-4 min-h-[60px]">
                        {service.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-[var(--text-primary)]">
                          €{service.priceWithTax}
                        </span>
                        <span className="text-sm text-[var(--text-secondary)]">incl. 21% BTW</span>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: service.color }} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="p-6 pt-0">
                      <motion.button
                        onClick={() => handleBookService(service)}
                        className={`w-full py-3 px-6 bg-gradient-to-r ${service.gradient} text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Zap className="w-4 h-4" />
                        <span>Get Started</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Action Modal */}
      {selectedService && (
        <ServiceActionModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}