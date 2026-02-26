import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Bot, User, ArrowUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/language-context";
import { getPortfolioStats } from "../../utils/stats-calculator";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasServiceContext, setHasServiceContext] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language, setLanguage } = useLanguage();

  // Rate limit: max 8 messages per session
  const MAX_REQUESTS = 8;

  // Listen for service selection event
  useEffect(() => {
    const handleOpenChatBot = (event?: CustomEvent) => {
      const serviceName = sessionStorage.getItem('chatbotServiceName');
      const experience = sessionStorage.getItem('chatbotExperience');
      const experienceRole = sessionStorage.getItem('chatbotExperienceRole');
      const experiencePeriod = sessionStorage.getItem('chatbotExperiencePeriod');
      
      // If event is triggered from hero section, just open the chat
      if (event && !serviceName && !experience) {
        setIsOpen(true);
        if (messages.length === 0) {
          setMessages([
            {
              id: Date.now(),
              text: `👋 Hi! I'm Stepan's AI assistant. I'm here to answer your questions about my services, experience, and projects. How can I help you today?`,
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
        }
        return;
      }
      
      if (serviceName) {
        setHasServiceContext(true);
        setIsOpen(true);
        
        // Service-specific welcome message
        setTimeout(() => {
          setMessages([
            {
              id: Date.now(),
              text: `👋 Hi! I see you're interested in ${serviceName}. I'm Stepan's AI assistant and I'd love to help you with this project! What would you like to know?`,
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
          
          // Clear the session storage
          sessionStorage.removeItem('chatbotService');
          sessionStorage.removeItem('chatbotServiceName');
        }, 500);
      } else if (experience) {
        setHasServiceContext(true);
        setIsOpen(true);
        
        // Experience-specific welcome message
        setTimeout(() => {
          setMessages([
            {
              id: Date.now(),
              text: `👋 Hi! I noticed you're interested in my work at ${experience} as ${experienceRole} (${experiencePeriod}).\n\nI'd be happy to share more details about:\n\n• 🚀 Projects I worked on\n• 💡 Technologies I used\n• 📈 Challenges I solved\n• 🎯 What I learned\n\nWhat would you like to know?`,
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
          
          // Clear the session storage
          sessionStorage.removeItem('chatbotExperience');
          sessionStorage.removeItem('chatbotExperienceRole');
          sessionStorage.removeItem('chatbotExperiencePeriod');
        }, 500);
      }
    };

    window.addEventListener('openChatBot', handleOpenChatBot);
    return () => window.removeEventListener('openChatBot', handleOpenChatBot);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Only show default welcome if no service context and bot just opened
    if (isOpen && messages.length === 0 && !hasServiceContext) {
      setTimeout(() => {
        setMessages([
          {
            id: Date.now(),
            text: `👋 Hi! I'm Stepan's AI assistant. How can I help you today?`,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }, 500);
    }
  }, [isOpen, messages.length, hasServiceContext]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Detect language from user input
  const detectLanguage = (text: string): string => {
    // Arabic - contains Arabic characters
    if (/[\u0600-\u06FF]/.test(text)) {
      return 'ar';
    }
    
    // Ukrainian - contains Cyrillic with Ukrainian specific characters
    if (/[а-яёіїєґА-ЯЁІЇЄҐ]/.test(text)) {
      return 'uk';
    }
    
    // Dutch common words
    if (/\b(hallo|hoi|dank|graag|bent|heeft|waar|wat|wanneer|hoe|waarom|dag|goedemorgen|goedemiddag|goedenavond)\b/i.test(text)) {
      return 'nl';
    }
    
    // Spanish common words
    if (/\b(hola|gracias|cómo|qué|dónde|cuándo|por qué|buenos días|buenas tardes|buenas noches|sí|no)\b/i.test(text)) {
      return 'es';
    }
    
    // Default to English
    return 'en';
  };

  const handleSend = () => {
    // Allow messages with spaces - only check if completely empty
    if (!inputValue || inputValue.length === 0) return;
    
    // Trim only for checking if it's just spaces
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    // Detect language and auto-switch if different
    const detectedLang = detectLanguage(trimmedValue);
    if (detectedLang !== language && ['en', 'uk', 'nl', 'ar', 'es'].includes(detectedLang)) {
      setLanguage(detectedLang as 'en' | 'uk' | 'nl' | 'ar' | 'es');
    }

    // Increase request count
    setRequestCount(prev => prev + 1);

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Check if rate limited
    if (requestCount >= MAX_REQUESTS) {
      setIsRateLimited(true);
      const rateLimitMessage: Message = {
        id: Date.now() + 1,
        text: t.rateLimitMessage || "You've reached the message limit. Please try again later or contact me directly at stepan@roze.live",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, rateLimitMessage]);
      return;
    }

    // Call AI endpoint
    setIsTyping(true);
    
    // Determine user's language for AI context
    const userLanguage = language === 'uk' ? 'Ukrainian' : 
                        language === 'nl' ? 'Dutch' : 
                        language === 'ar' ? 'Arabic' : 
                        language === 'es' ? 'Spanish' : 'English';
    
    fetch(`https://saeohtefpfuzzajfduad.supabase.co/functions/v1/make-server-a62f57c7/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZW9odGVwZnB1enphamZkdWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxOTgzNjEsImV4cCI6MjA4NDc3NDM2MX0.bxKkFIXrqVzRVU72E_zZHVGkWuVF_hyJVqvdYrRls9U`
      },
      body: JSON.stringify({
        message: trimmedValue,
        context: hasServiceContext ? 'service_selected' : 'general',
        language: userLanguage
      })
    })
    .then(res => res.json())
    .then(data => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.message || data.error || t.errorMessage || 'Sorry, I encountered an error. Please try again.',
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    })
    .catch(error => {
      console.error('AI Chat error:', error);
      // Fallback to static responses
      const botResponse = getBotResponse(trimmedValue.toLowerCase());
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    });
  };

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Multilingual greetings
    if (lowerInput.match(/\b(hello|hi|hey|привіт|привет|hallo|hoi|hola|مرحبا)\b/)) {
      return "Hello! 👋 I'm Stepan's AI assistant. I can help you with:\n\n• Project pricing & rates 💰\n• Technical expertise & skills 🛠️\n• Portfolio & past work 🚀\n• Availability & scheduling ⏰\n• Contact information 📧\n\nWhat would you like to know?";
    }

    // Price & Rates - More detailed
    if (lowerInput.match(/\b(price|cost|rate|budget|charging|fee|pricing|money|payment|pay)\b/)) {
      return "💰 **Hourly Rates (EUR, incl. Belgian VAT):**\n\n" +
        "• Frontend Development: €45/hr\n" +
        "• E-commerce Solutions: €60/hr\n" +
        "• JavaScript Consulting: €55/hr\n" +
        "• Full-Stack Development: €75/hr\n\n" +
        "📦 **Project-based pricing available** for longer engagements.\n" +
        "🎯 Rates may vary based on complexity and timeline.\n\n" +
        "Want a custom quote? Let's discuss your project!";
    }

    // Contact info - Enhanced
    if (lowerInput.match(/\b(contact|email|reach|call|message|telegram|whatsapp|phone|write)\b/)) {
      return "📧 **Get in Touch:**\n\n" +
        "• Email: stepan@roze.live\n" +
        "• Response time: Within 24 hours\n" +
        "• LinkedIn: linkedin.com/in/rozestepan\n" +
        "• GitHub: github.com/irozedev\n\n" +
        "💬 Prefer to use the contact form? Scroll down to the Contact section!";
    }

    // Experience & Skills - More comprehensive
    if (lowerInput.match(/\b(experience|skill|tech|technology|stack|expertise|know|proficient|language|framework)\b/)) {
      const stats = getPortfolioStats();
      return "🛠️ **Technical Expertise:**\n\n" +
        "**Frontend:** React, Vue.js, TypeScript, Next.js, Tailwind CSS\n" +
        "**Backend:** Node.js, MongoDB, Express, PHP, Symfony\n" +
        "**E-commerce:** Magento 2, Shopify, WooCommerce\n" +
        "**Tools:** Git, Docker, Linux, Figma, Webpack, Vite\n\n" +
        "📊 **Experience:**\n" +
        `• ${stats.yearsExperience}+ years in web development\n` +
        `• ${stats.projectsCompleted}+ completed projects\n` +
        `• ${stats.happyClients}+ happy clients\n` +
        `• ${stats.successRate}% client satisfaction rate\n\n` +
        "Based in Belgium 🇧🇪 | Available worldwide 🌍";
    }

    // Availability - Dynamic
    if (lowerInput.match(/\b(availability|available|hire|hiring|free|start|when|schedule|busy|time)\b/)) {
      const now = new Date();
      const cetHour = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Brussels" })).getHours();
      const isWorkingHours = cetHour >= 6 && cetHour < 12;
      
      return `⏰ **Current Availability:**\n\n` +
        `Status: ${isWorkingHours ? '🟢 Online & Available' : '🟡 Limited Availability'}\n` +
        `Timezone: CET (Europe/Brussels)\n` +
        `Working Hours: 06:00 - 12:00 CET\n\n` +
        `📅 **Open for:**\n` +
        `• Full-time contracts\n` +
        `• Freelance projects\n` +
        `• Consulting & code reviews\n\n` +
        `Ready to start your project? Book a call or send me an email at stepan@roze.live!`;
    }

    // Portfolio & Projects - More engaging
    if (lowerInput.match(/\b(portfolio|project|work|showcase|example|demo|built|created|show|see)\b/)) {
      const stats = getPortfolioStats();
      return "🚀 **Featured Projects:**\n\n" +
        "Check out the **Projects section** above to see:\n\n" +
        "• E-commerce platforms (Magento, Shopify)\n" +
        "• SaaS applications (React, TypeScript)\n" +
        "• Real-time dashboards (Vue.js, WebSocket)\n" +
        "• Custom web solutions\n\n" +
        "Each project includes:\n" +
        "✅ Live demo links\n" +
        "✅ Tech stack details\n" +
        "✅ Key features & results\n\n" +
        ` **My track record:**\n` +
        `• ${stats.yearsExperience}+ years of experience\n` +
        `• ${stats.projectsCompleted}+ completed projects\n` +
        `• ${stats.happyClients}+ happy clients\n` +
        `• ${stats.successRate}% success rate\n\n` +
        "Want to discuss a similar project? Let's talk!";
    }

    // Services - What can be done
    if (lowerInput.match(/\b(service|offer|provide|do|help|build|develop|create|make)\b/)) {
      return "🎯 **Services I Offer:**\n\n" +
        "**Web Development:**\n" +
        "• Custom web applications\n" +
        "• Responsive websites\n" +
        "• Progressive Web Apps (PWA)\n\n" +
        "**E-commerce:**\n" +
        "• Online store development\n" +
        "• Payment integration\n" +
        "• Magento customization\n\n" +
        "**Consulting:**\n" +
        "• Code reviews\n" +
        "• Performance optimization\n" +
        "• Tech stack selection\n\n" +
        "Need something specific? Describe your project!";
    }

    // Location
    if (lowerInput.match(/\b(location|where|based|from|live|country|city|belgium)\b/)) {
      return "📍 **Location:**\n\n" +
        "Based in Belgium 🇧🇪\n" +
        "Timezone: CET (UTC+1/+2)\n\n" +
        "🌍 Working with clients worldwide\n" +
        "💼 Remote-first approach\n" +
        "🕐 Flexible meeting times\n\n" +
        "Distance is not an issue - I've worked with teams across Europe, US, and Asia!";
    }

    // Languages spoken
    if (lowerInput.match(/\b(language|speak|fluent|communicate|talk|understand)\b/)) {
      return "🗣️ **Languages I Speak:**\n\n" +
        "• **Ukrainian** - Native 🇺🇦\n" +
        "• **English** - B1 (Intermediate) 🇬🇧\n" +
        "• **Dutch** - A2 (Elementary) 🇳🇱\n" +
        "• **Spanish** - A1 (Beginner) 🇪🇸\n\n" +
        "I can communicate effectively in English for:\n" +
        "• Project discussions and technical requirements\n" +
        "• Code reviews and documentation\n" +
        "• Client meetings and presentations\n\n" +
        "Effective communication is guaranteed! ✅";
    }

    // Thank you
    if (lowerInput.match(/\b(thank|thanks|appreciate|grateful)\b/)) {
      return "You're very welcome! 😊\n\n" +
        "Feel free to ask anything else, or:\n" +
        "• 📧 Send me an email at stepan@roze.live\n" +
        "• 📞 Book a call\n" +
        "• 📝 Use the contact form below\n\n" +
        "Looking forward to working together! 🚀";
    }

    // About Stepan
    if (lowerInput.match(/\b(who|about|tell me|describe|yourself|background|story)\b/)) {
      return "👨‍💻 **About Stepan Roze:**\n\n" +
        "I'm a Frontend Developer & AI Enthusiast based in Belgium with 5+ years of experience building modern web applications.\n\n" +
        "**What I love:**\n" +
        "• Creating pixel-perfect UIs ✨\n" +
        "• Solving complex problems 🧩\n" +
        "• Learning new technologies 📚\n" +
        "• Helping businesses grow 📈\n\n" +
        "**Fun fact:** I'm passionate about AI and integrating intelligent features into web apps!\n\n" +
        "Want to know more? Check the About section!";
    }

    // Timeline / How long
    if (lowerInput.match(/\b(timeline|how long|duration|time|deadline|deliver|fast|quick)\b/)) {
      return "⏱️ **Project Timelines:**\n\n" +
        "Typical delivery times:\n" +
        "• Landing page: 3-5 days\n" +
        "• Corporate website: 1-2 weeks\n" +
        "• E-commerce store: 2-4 weeks\n" +
        "• Custom SaaS app: 4-12 weeks\n\n" +
        "⚡ **Rush delivery available** for urgent projects\n" +
        "📅 Timelines depend on scope & complexity\n\n" +
        "Share your deadline and I'll let you know if it's feasible!";
    }

    // Process / How it works
    if (lowerInput.match(/\b(process|how|workflow|steps|method|approach|procedure)\b/)) {
      return "🔄 **My Work Process:**\n\n" +
        "**1. Discovery** 🔍\n" +
        "• Understand your goals\n" +
        "• Define requirements\n" +
        "• Plan architecture\n\n" +
        "**2. Design** 🎨\n" +
        "• Create wireframes/mockups\n" +
        "• Get your feedback\n" +
        "• Refine until perfect\n\n" +
        "**3. Development** 💻\n" +
        "• Clean, maintainable code\n" +
        "• Regular updates\n" +
        "• Testing & QA\n\n" +
        "**4. Deployment** 🚀\n" +
        "• Launch & monitoring\n" +
        "• Documentation\n" +
        "• Post-launch support\n\n" +
        "Transparent, collaborative, and results-driven!";
    }

    // React/Vue specific
    if (lowerInput.match(/\b(react|vue|next|nuxt|angular|svelte)\b/)) {
      return "⚛️ **JavaScript Frameworks:**\n\n" +
        "I specialize in:\n" +
        "• **React** - My primary framework\n" +
        "• **Vue.js** - 3+ years experience\n" +
        "• **Next.js** - For SSR/SSG projects\n" +
        "• **TypeScript** - Type-safe development\n\n" +
        "💡 I can help with:\n" +
        "• Migrating between frameworks\n" +
        "• Performance optimization\n" +
        "• Architecture planning\n" +
        "• Best practices implementation\n\n" +
        "Have a specific framework question? Ask away!";
    }

    // E-commerce specific
    if (lowerInput.match(/\b(magento|shopify|woocommerce|store|shop|ecommerce|e-commerce)\b/)) {
      return "🛒 **E-commerce Expertise:**\n\n" +
        "**Platforms:**\n" +
        "• Magento 2 - Advanced customization\n" +
        "• Shopify - Theme development\n" +
        "• WooCommerce - WordPress integration\n\n" +
        "**Services:**\n" +
        "• Custom theme development\n" +
        "• Payment gateway integration\n" +
        "• Performance optimization\n" +
        "• Multi-store setup\n" +
        "• Migration services\n\n" +
        "I've built stores serving 50K+ monthly users!\n\n" +
        "Need an e-commerce solution? Let's talk!";
    }

    // Design/UI/UX
    if (lowerInput.match(/\b(design|ui|ux|figma|interface|layout|responsive)\b/)) {
      return "🎨 **Design & UI/UX:**\n\n" +
        "**Tools I use:**\n" +
        "• Figma - For design & prototyping\n" +
        "• Tailwind CSS - Rapid styling\n" +
        "• Motion/Framer - Animations\n\n" +
        "**Approach:**\n" +
        "• Mobile-first responsive design\n" +
        "• Accessibility (WCAG 2.1)\n" +
        "• Performance-optimized\n" +
        "• Pixel-perfect implementation\n\n" +
        "I can work from your designs or create UI from scratch!\n\n" +
        "Have designs ready? Share them and let's build!";
    }

    // Default fallback - more helpful
    return "🤔 I'm not sure about that specific question, but I'm here to help!\n\n" +
      "**Popular topics:**\n" +
      "• 💰 Pricing & rates\n" +
      "• 🛠️ Skills & expertise\n" +
      "• 🚀 Portfolio & projects\n" +
      "• ⏰ Availability\n" +
      "• 📧 Contact info\n\n" +
      "Try asking about any of these, or **email me directly** at stepan@roze.live for detailed answers!";
  };

  const quickActions = [
    { label: "💰 Pricing", value: "What are your rates?" },
    { label: "📧 Contact", value: "How can I contact you?" },
    { label: "🚀 Projects", value: "Show me your projects" },
    { label: "⏰ Availability", value: "Are you available?" },
  ];

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[99989]"
            />
            
            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[95vw] sm:max-w-[420px] h-[calc(100dvh-160px)] sm:h-[600px] max-h-[600px] bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)] rounded-3xl shadow-2xl z-[99990] flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-[var(--accent-primary)]" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Stepan's AI Assistant</h3>
                    <p className="text-xs text-white/80">Online • Typically replies instantly</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-secondary)]/30">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400"
                          : "bg-[var(--bg-secondary)]"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-[var(--accent-primary)]" />
                      )}
                    </div>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black"
                          : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]"
                      }`}
                    >
                      <p className="text-sm md:text-base leading-relaxed" style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif" }}>{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-black/60"
                            : "text-[var(--text-muted)]"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 flex-row"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--bg-secondary)]"
                    >
                      <Bot className="w-4 h-4 text-[var(--accent-primary)]" />
                    </div>
                    <div
                      className="rounded-2xl px-4 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]"
                    >
                      <div className="flex gap-1 items-center">
                        <motion.div
                          className="w-2 h-2 bg-[var(--accent-primary)] rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-[var(--accent-primary)] rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-[var(--accent-primary)] rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
                  <p className="text-xs text-[var(--text-muted)] mb-2">Quick questions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => {
                          setInputValue(action.value);
                          setTimeout(() => handleSend(), 100);
                        }}
                        className="text-xs px-3 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)]/10 border border-[var(--border-color)] rounded-lg transition-colors text-left"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isRateLimited}
                    className="px-4 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-[99991] flex flex-col gap-3 items-end">
        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-12 h-12 md:w-14 md:h-14 bg-[var(--bg-secondary)] backdrop-blur-sm border-2 border-[var(--accent-primary)] rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--accent-primary)] transition-all group"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ArrowUp className="w-6 h-6 text-[var(--accent-primary)] group-hover:text-black transition-colors" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Button - Always visible */}
        <motion.button
          id="chat-bot-button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] transition-all group relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6 text-black" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <MessageCircle className="w-6 h-6 text-black group-hover:rotate-12 transition-transform" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Notification Badge */}
          {!isOpen && messages.length === 0 && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                !
              </motion.span>
            </motion.div>
          )}
        </motion.button>
      </div>
    </>
  );
}