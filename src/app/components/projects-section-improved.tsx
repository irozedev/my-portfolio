import { motion } from "motion/react";
import { Sparkles, Code2 } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { ProjectsCarousel } from "./projects-carousel";

const projects = [
  {
    id: 1,
    title: "AI SaaS Platform",
    category: "Full-Stack",
    description: "Next-generation AI-powered business automation platform with real-time analytics",
    longDescription: "A comprehensive AI-powered platform that automates business processes, provides real-time analytics, and integrates with popular tools. Built with modern tech stack for scalability and performance.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    tech: ["React", "Node.js", "OpenAI", "PostgreSQL", "TypeScript", "Redis"],
    gradient: "from-cyan-500 to-blue-600",
    stats: { users: "10K+", growth: "+250%", rating: "4.9" },
    links: { live: "#", github: "#" },
    price: 8000,
    priceWithTax: 9680,
    features: [
      "Custom AI model integration",
      "Real-time analytics dashboard",
      "Automated workflow builder",
      "Multi-tenant architecture",
      "API integration with 50+ services",
      "Advanced reporting & insights",
    ],
  },
  {
    id: 2,
    title: "E-Commerce Pro",
    category: "Frontend",
    description: "Modern e-commerce platform with seamless checkout experience",
    longDescription: "Full-featured e-commerce solution with advanced product management, secure payment processing, and optimized for conversions. Includes admin dashboard and customer portal.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&q=80",
    tech: ["Next.js", "Stripe", "Tailwind", "Prisma", "PostgreSQL"],
    gradient: "from-purple-500 to-pink-600",
    stats: { conversion: "+45%", revenue: "€500K" },
    links: { live: "#", github: "#" },
    price: 6000,
    priceWithTax: 7260,
    features: [
      "Product catalog management",
      "Secure payment gateway (Stripe)",
      "Shopping cart & wishlist",
      "Order tracking system",
      "Customer reviews & ratings",
      "SEO optimized pages",
    ],
  },
  {
    id: 3,
    title: "DeFi Dashboard",
    category: "Web3",
    description: "Real-time cryptocurrency portfolio tracker with advanced analytics",
    longDescription: "Comprehensive DeFi dashboard for tracking crypto portfolios, monitoring market trends, and executing trades. Features real-time data feeds and advanced charting.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80",
    tech: ["Web3.js", "Ethers", "React", "TypeScript", "Chart.js"],
    gradient: "from-amber-500 to-orange-600",
    stats: { transactions: "1M+", volume: "$50M" },
    links: { live: "#", github: "#" },
    price: 10000,
    priceWithTax: 12100,
    features: [
      "Multi-chain support (ETH, BSC, Polygon)",
      "Real-time price tracking",
      "Portfolio analytics & insights",
      "Transaction history",
      "Wallet integration (MetaMask, WalletConnect)",
      "Custom alerts & notifications",
    ],
  },
  {
    id: 4,
    title: "Social Analytics",
    category: "Data Viz",
    description: "Powerful social media analytics dashboard with ML insights",
    longDescription: "Advanced analytics platform for social media management with AI-powered insights, sentiment analysis, and automated reporting for multiple platforms.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    tech: ["D3.js", "Python", "React", "TensorFlow", "FastAPI"],
    gradient: "from-green-500 to-emerald-600",
    stats: { accuracy: "98%" },
    links: { live: "#" },
    price: 5000,
    priceWithTax: 6050,
    features: [
      "Multi-platform integration",
      "AI-powered sentiment analysis",
      "Automated report generation",
      "Competitor analysis",
      "Engagement metrics tracking",
      "Custom KPI dashboards",
    ],
  },
  {
    id: 5,
    title: "Healthcare Portal",
    category: "Enterprise",
    description: "HIPAA-compliant patient management system",
    longDescription: "Secure healthcare management platform with patient records, appointment scheduling, telemedicine integration, and full HIPAA compliance.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
    tech: ["Angular", "AWS", "PostgreSQL", "Node.js", "Docker"],
    gradient: "from-blue-500 to-indigo-600",
    stats: { patients: "50K+" },
    links: { live: "#" },
    price: 12000,
    priceWithTax: 14520,
    features: [
      "HIPAA-compliant data storage",
      "Patient records management",
      "Appointment scheduling",
      "Telemedicine integration",
      "Prescription management",
      "Insurance billing system",
    ],
  },
];

export function ProjectsSectionImproved() {
  const { t } = useLanguage();

  return (
    <section
      id="projects"
      className="relative py-20 md:py-32 px-4 bg-[var(--bg-primary)] overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-40 w-96 h-96 bg-[#00d9ff]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 mb-6 bg-gradient-to-r from-[#00d9ff]/10 to-purple-500/10 backdrop-blur-sm border border-[#00d9ff]/20 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Code2 className="w-5 h-5 text-[#00d9ff]" />
            <span className="text-sm font-medium text-[#00d9ff]">FEATURED WORK</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-[#00d9ff] to-purple-400 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            Explore my latest work — from AI-powered platforms to enterprise solutions
          </p>
        </motion.div>

        {/* Projects Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ProjectsCarousel projects={projects} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-[var(--text-secondary)] mb-6">
            Want to see more? Check out my GitHub for open-source contributions
          </p>
          <a
            href="https://github.com/irozedev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black font-bold rounded-xl hover:from-[#00b8dd] hover:to-cyan-300 transition-all shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.5)]"
          >
            <Sparkles className="w-5 h-5" />
            <span>View GitHub Profile</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
