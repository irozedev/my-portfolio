import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// ПОВНИЙ КОНТЕКСТ ПОРТФОЛІО STEPAN ROZE
const PORTFOLIO_CONTEXT = `
# STEPAN ROZE - FULL-STACK DEVELOPER PORTFOLIO

## BASIC INFO
- Name: Stepan Roze
- Title: Full-Stack Developer
- Experience: 10+ years (2015-2025)
- Location: Belgium (Brussels area)
- Timezone: CET (Europe/Brussels)
- Email: stepan@roze.live
- LinkedIn: linkedin.com/in/rozestepan
- GitHub: github.com/irozedev
- Upwork: upwork.com/freelancers/rozestepan

## LANGUAGES
- Ukrainian: Native
- English: Fluent (C1)
- Dutch: Fluent (B2+)
- Russian: Native

## TECHNICAL SKILLS (EXPERT LEVEL)
### Frontend
- React: 95% - 10+ years, expert in hooks, context, performance optimization
- JavaScript (ES6+): 98% - Deep knowledge, async/await, closures, prototypes
- Tailwind CSS: 92% - Modern utility-first styling, responsive design
- Vue.js: 90% - 3+ years, Vue 2 & 3, Composition API
- TypeScript: 85% - Type safety, interfaces, generics
- HTML5/CSS3: 95% - Semantic markup, flexbox, grid, animations

### Backend
- Node.js: 80% - Express, REST APIs, middleware
- PHP: 85% - Laravel, custom frameworks
- Python: 70% - Django basics, scripting
- MongoDB: 75% - NoSQL, aggregation pipelines
- MySQL/PostgreSQL: 80% - Complex queries, optimization

### E-commerce
- Magento 2: 88% - Theme development, custom modules, performance
- WooCommerce: 85% - Custom plugins, payment gateways
- Shopify: 75% - Theme customization, Liquid templating

### AI & Modern Tools
- OpenAI API: 80% - GPT-4, embeddings, function calling
- Claude API: 75% - Anthropic AI integration
- Supabase: 70% - Authentication, database, edge functions
- Git/GitHub: 90% - Version control, CI/CD workflows

## CAREER TIMELINE

### 2025-Present: AI Learning & Upskilling
- Focus: Mastering AI integration in web apps
- Technologies: OpenAI, Claude, LangChain, vector databases
- Projects: AI chatbots, automated workflows, RAG systems
- Status: Available for freelance projects

### 2022-2024: eConsulting (Senior Full-Stack Developer)
- Role: Lead developer for enterprise e-commerce solutions
- Achievements:
  * Led team of 5 developers
  * Reduced page load time by 60% through optimization
  * Implemented CI/CD pipeline, reducing deployment time by 70%
  * Built custom CRM integration with Magento 2
- Technologies: Magento 2, React, Vue.js, Node.js, Docker
- Projects: 30+ e-commerce websites, 15+ custom integrations

### 2019-2022: Ronis (Frontend Developer)
- Role: Frontend specialist for web applications
- Achievements:
  * Reduced bugs by 40% through TypeScript adoption
  * Improved UI/UX consistency across 10+ projects
  * Mentored 3 junior developers
  * Built reusable component library
- Technologies: React, TypeScript, Styled Components, Redux
- Projects: 40+ web applications, SaaS dashboards

### 2015-2019: Freelance Web Developer
- Role: Independent contractor for various clients
- Achievements:
  * Built personal brand with 50+ completed projects
  * Achieved 100% client satisfaction rate
  * Specialized in landing pages and small business websites
- Technologies: HTML, CSS, JavaScript, WordPress, jQuery
- Projects: 50+ landing pages, 20+ WordPress sites

## STATISTICS
- Total Projects Completed: 150+
- Total Clients: 50+
- Client Satisfaction: 100%
- Response Time: Within 24 hours
- Availability: Mon-Sun, 6:00-12:00 CET

## SERVICES & PRICING

### 1. Full-Stack Web Development
- Price: €45-€75/hour or €3,000-€10,000 per project
- Timeline: 4-12 weeks
- Includes: React/Vue frontend, Node.js backend, database design, API integration
- Technologies: React, Node.js, TypeScript, PostgreSQL, MongoDB
- Ideal for: SaaS platforms, web applications, admin dashboards

### 2. E-Commerce Solutions
- Price: €5,000-€15,000 per project
- Timeline: 6-16 weeks
- Includes: Store setup, custom theme, payment integration, inventory management
- Technologies: Magento 2, WooCommerce, Shopify
- Ideal for: Online stores, B2B marketplaces, dropshipping sites

### 3. AI Chatbot Development
- Price: €2,000-€8,000 per project
- Timeline: 2-6 weeks
- Includes: Custom chatbot, OpenAI/Claude integration, training, deployment
- Technologies: OpenAI API, Claude, LangChain, vector databases
- Ideal for: Customer support, lead generation, internal tools

### 4. Landing Page Design
- Price: €800-€2,500 per page
- Timeline: 1-3 weeks
- Includes: Modern design, responsive layout, SEO optimization, analytics
- Technologies: React, Tailwind, Next.js
- Ideal for: Product launches, marketing campaigns, lead capture

### 5. Mobile App Development
- Price: €8,000-€20,000 per app
- Timeline: 8-20 weeks
- Includes: iOS & Android apps, backend API, admin panel
- Technologies: React Native, Node.js, Firebase
- Ideal for: Startups, business apps, social platforms

### 6. Consulting & Code Review
- Price: €60-€90/hour
- Timeline: Flexible
- Includes: Architecture review, performance audit, best practices, mentoring
- Ideal for: Existing projects, team guidance, technical leadership

## PROJECT CATEGORIES

### E-Commerce (45 projects)
- Magento 2 stores with custom themes
- WooCommerce integrations with ERP systems
- Shopify apps for inventory management
- Multi-vendor marketplaces
- B2B wholesale platforms

### Web Applications (60 projects)
- SaaS dashboards with real-time data
- Admin panels with role-based access
- Project management tools
- CRM systems
- Booking and scheduling platforms

### AI Integration (20 projects)
- Customer support chatbots
- Content generation tools
- Document analysis systems
- Automated email responders
- Lead qualification bots

### Landing Pages (25 projects)
- Product launch pages
- Event registration sites
- Lead capture funnels
- Portfolio websites
- Coming soon pages

## AVAILABILITY

### Current Status: AVAILABLE ✅
- Accepting new projects
- Freelance contracts
- Part-time collaborations
- Consulting sessions

### Schedule
- Monday-Sunday: 6:00-12:00 CET
- Timezone: Europe/Brussels (CET/CEST)
- Response time: Within 24 hours
- Meeting availability: Book via calendar

### Booking
- Free 30-minute consultation
- No login required
- Timezone auto-detection
- Calendar sync available

## PORTFOLIO HIGHLIGHTS

### Recent Projects:
1. **AI SaaS Platform** (2024)
   - Tech: React, Node.js, OpenAI GPT-4
   - Features: AI content generation, user dashboard, subscription billing
   - Price: €8,000
   - Timeline: 10 weeks

2. **E-commerce Multi-vendor Marketplace** (2023)
   - Tech: Magento 2, Vue.js, ElasticSearch
   - Features: Vendor management, advanced search, payment gateway
   - Price: €12,000
   - Timeline: 14 weeks

3. **Real Estate CRM** (2023)
   - Tech: React, TypeScript, PostgreSQL
   - Features: Lead management, property listings, email automation
   - Price: €7,500
   - Timeline: 12 weeks

## CORE VALUES
- Clean, maintainable code
- Performance optimization
- Security best practices
- Regular communication
- On-time delivery
- Client satisfaction

## CONTACT METHODS
1. Email: stepan@roze.live (fastest)
2. LinkedIn: Direct message
3. GitHub: Open an issue
4. Upwork: Send proposal
5. Website: Contact form (this site)
6. Calendar: Book a call directly

## IMPORTANT NOTES
- All projects include 30 days free support
- Source code ownership transferred to client
- NDA available upon request
- Agile methodology with weekly sprints
- Regular progress updates
- Quality assurance and testing included
`;

export function AIAssistantSmart() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      sendWelcomeMessage();
    }
  }, [isOpen, language]);

  const sendWelcomeMessage = () => {
    const welcomeMessages: Record<string, string> = {
      en: "👋 Hi! I'm Roze AI Assistant. I have full knowledge about Stepan Roze's portfolio, skills, projects, and services. Ask me anything about his experience, pricing, availability, or technical expertise!",
      uk: "👋 Привіт! Я Roze AI Асистент. Я маю повні знання про портфоліо Stepan Roze, навички, проекти та послуги. Запитуй мене про його досвід, ціни, доступність або технічну експертизу!",
      nl: "👋 Hoi! Ik ben Roze AI Assistent. Ik heb volledige kennis over Stepan Roze's portfolio, vaardigheden, projecten en diensten. Vraag me alles over zijn ervaring, prijzen, beschikbaarheid of technische expertise!",
      ar: "👋 مرحبا! أنا Roze AI المساعد. لدي معرفة كاملة بمحفظة ومهارات ومشاريع وخدمات Stepan Roze. اسألني أي شيء عن خبرته أو الأسعار أو التوفر أو الخبرة التقنية!",
      es: "👋 ¡Hola! Soy Roze AI Asistente. Tengo conocimiento completo sobre el portafolio, habilidades, proyectos y servicios de Stepan Roze. ¡Pregúntame cualquier cosa sobre su experiencia, precios, disponibilidad o experiencia técnica!"
    };

    addMessage(welcomeMessages[language] || welcomeMessages.en, true);
  };

  const addMessage = (text: string, isBot: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessageToClaude = async (userMessage: string) => {
    setIsLoading(true);
    addMessage(userMessage, false);

    try {
      const systemPrompt = `You are Roze AI Assistant, an expert AI helper for Stepan Roze's portfolio website.

CRITICAL RULES:
1. You MUST ONLY answer questions about Stepan Roze, his portfolio, skills, projects, services, and career
2. If user asks about ANYTHING ELSE (weather, math, general knowledge, other topics), politely redirect them back to portfolio topics
3. Use the portfolio context below to provide accurate, detailed answers
4. Be friendly, professional, and concise
5. Always answer in ${language === 'en' ? 'English' : language === 'uk' ? 'Ukrainian' : language === 'nl' ? 'Dutch' : language === 'ar' ? 'Arabic' : 'Spanish'}
6. If user tries to chat off-topic, say: "I'm specialized in Stepan Roze's portfolio. Please ask about his skills, projects, services, pricing, or availability!"

PORTFOLIO CONTEXT:
${PORTFOLIO_CONTEXT}

When user asks about pricing, provide specific ranges from the context.
When user asks about projects, mention the categories and examples.
When user asks about availability, confirm he's available and provide scheduling options.`;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7/chat`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.response) {
        addMessage(data.response, true);
      } else {
        throw new Error("No response from AI");
      }
    } catch (error) {
      console.error("[AI Assistant] Error:", error);
      const errorMessages: Record<string, string> = {
        en: "Sorry, I'm having trouble connecting. Please try again or contact Stepan directly at stepan@roze.live",
        uk: "Вибачте, у мене проблеми зі з'єднанням. Спробуйте ще раз або зв'яжіться з Stepan напряму: stepan@roze.live",
        nl: "Sorry, ik heb verbindingsproblemen. Probeer opnieuw of neem direct contact op met Stepan: stepan@roze.live",
        ar: "عذرا، أواجه مشكلة في الاتصال. حاول مرة أخرى أو اتصل بـ Stepan مباشرة: stepan@roze.live",
        es: "Lo siento, tengo problemas de conexión. Inténtalo de nuevo o contacta directamente a Stepan: stepan@roze.live"
      };
      addMessage(errorMessages[language] || errorMessages.en, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput("");
    sendMessageToClaude(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const translations: Record<string, any> = {
    en: {
      title: "Roze AI Assistant",
      subtitle: "Ask about portfolio, skills, projects",
      placeholder: "Ask about Stepan's experience, pricing, projects...",
      send: "Send"
    },
    uk: {
      title: "Roze AI Асистент",
      subtitle: "Запитай про портфоліо, навички, проекти",
      placeholder: "Запитай про досвід, ціни, проекти Stepan...",
      send: "Відправити"
    },
    nl: {
      title: "Roze AI Assistent",
      subtitle: "Vraag over portfolio, vaardigheden, projecten",
      placeholder: "Vraag over Stepan's ervaring, prijzen, projecten...",
      send: "Verzenden"
    },
    ar: {
      title: "Roze AI المساعد",
      subtitle: "اسأل عن المحفظة والمهارات والمشاريع",
      placeholder: "اسأل عن خبرة Stepan والأسعار والمشاريع...",
      send: "إرسال"
    },
    es: {
      title: "Roze AI Asistente",
      subtitle: "Pregunta sobre portafolio, habilidades, proyectos",
      placeholder: "Pregunta sobre experiencia, precios, proyectos de Stepan...",
      send: "Enviar"
    }
  };

  const t = translations[language] || translations.en;

  return (
    <>
      {/* FLOATING BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[100] w-16 h-16 bg-gradient-to-br from-[#00d9ff] to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,217,255,0.6)] hover:shadow-[0_0_60px_rgba(0,217,255,0.8)] transition-all"
          >
            <Bot className="w-8 h-8 text-white" />
            
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/50"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            
            {/* Notification dot */}
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-2 h-2 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[100] w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-[var(--bg-primary)] border-2 border-[#00d9ff] rounded-2xl shadow-[0_20px_80px_rgba(0,217,255,0.5)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#00d9ff] to-purple-500 p-4 flex items-center justify-between">
              <div className="absolute inset-0 opacity-10">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-[2px] bg-white mb-2" />
                ))}
              </div>
              
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold font-mono text-sm">{t.title}</h3>
                  <p className="text-white/80 text-xs">{t.subtitle}</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="relative p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-xl ${
                      msg.isBot
                        ? 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)]'
                        : 'bg-gradient-to-r from-[#00d9ff] to-purple-500 text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] px-4 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#00d9ff]" />
                      <span className="text-sm text-[var(--text-secondary)]">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[var(--glass-border)]">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t.placeholder}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#00d9ff] resize-none min-h-[44px] max-h-[120px]"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-[#00d9ff] to-purple-500 text-white rounded-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
