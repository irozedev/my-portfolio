import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, MapPin, ArrowUp, Star, Code, Briefcase, Mail, Calendar, Zap, TrendingUp, ChevronRight, ExternalLink } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { Button } from "./ui/button";
import { availabilityConfig, getCurrentAvailability } from "../config/availability";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  actions?: QuickAction[];
  data?: any;
}

interface QuickAction {
  id: string;
  label: string;
  icon?: any;
  action: () => void;
}

interface ConversationState {
  stage: 'initial' | 'collecting_project' | 'showing_prices' | 'collecting_contact' | 'complete';
  projectType?: string;
  userLocation?: string;
  contactMethod?: string;
  contactInfo?: string;
  currentSection?: string;
}

const servicePackages = {
  en: {
    landing: {
      name: "Landing Page",
      price: "€800-€1,500",
      timeline: "1-2 weeks",
      features: ["Responsive design", "Modern UI/UX", "SEO optimization", "Contact forms"]
    },
    webapp: {
      name: "Web Application",
      price: "€3,000-€8,000",
      timeline: "4-8 weeks",
      features: ["Custom functionality", "Database integration", "User authentication", "Admin dashboard"]
    },
    ecommerce: {
      name: "E-commerce Solution",
      price: "€5,000-€12,000",
      timeline: "6-12 weeks",
      features: ["Product catalog", "Payment integration", "Inventory management", "Order tracking"]
    },
    consulting: {
      name: "Technical Consulting",
      price: "€60-€90/hour",
      timeline: "Flexible",
      features: ["Code reviews", "Architecture planning", "Performance optimization", "Best practices"]
    }
  },
  uk: {
    landing: {
      name: "Лендінг",
      price: "€800-€1,500",
      timeline: "1-2 тижні",
      features: ["Адаптивний дизайн", "Сучасний UI/UX", "SEO оптимізація", "Контактні форми"]
    },
    webapp: {
      name: "Веб-додаток",
      price: "€3,000-€8,000",
      timeline: "4-8 тижнів",
      features: ["Кастомна функціональність", "Інтеграція БД", "Автентифікація", "Панель адміністратора"]
    },
    ecommerce: {
      name: "E-commerce рішення",
      price: "€5,000-€12,000",
      timeline: "6-12 тижнів",
      features: ["Каталог продуктів", "Платіжні системи", "Управління складом", "Відстеження замовлень"]
    },
    consulting: {
      name: "Технічний консалтинг",
      price: "€60-€90/год",
      timeline: "Гнучко",
      features: ["Ревю коду", "Планування архітектури", "Оптимізація продуктивності", "Кращі практики"]
    }
  },
  nl: {
    landing: {
      name: "Landing Page",
      price: "€800-€1,500",
      timeline: "1-2 weken",
      features: ["Responsive ontwerp", "Modern UI/UX", "SEO optimalisatie", "Contactformulieren"]
    },
    webapp: {
      name: "Webapplicatie",
      price: "€3,000-€8,000",
      timeline: "4-8 weken",
      features: ["Aangepaste functionaliteit", "Database integratie", "Gebruikersauthenticatie", "Admin dashboard"]
    },
    ecommerce: {
      name: "E-commerce Oplossing",
      price: "€5,000-€12,000",
      timeline: "6-12 weken",
      features: ["Productcatalogus", "Betalingsintegratie", "Voorraadbeheer", "Ordertracking"]
    },
    consulting: {
      name: "Technisch Advies",
      price: "€60-€90/uur",
      timeline: "Flexibel",
      features: ["Code reviews", "Architectuurplanning", "Performance optimalisatie", "Best practices"]
    }
  }
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({ stage: 'initial' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      detectUserLocation();
      setTimeout(() => {
        sendInitialGreeting();
      }, 500);
    }
  }, [isOpen, language]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const detectUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setConversationState(prev => ({
        ...prev,
        userLocation: `${data.city}, ${data.country_name}`
      }));
    } catch (error) {
      console.log('Could not detect location');
    }
  };

  const sendInitialGreeting = () => {
    const greetings = {
      en: `Hi! 👋 I'm Stepan's AI Assistant.\n\n${conversationState.userLocation ? `I see you're from ${conversationState.userLocation}! ` : ''}I'm here to help you with:\n\n• Project estimates & pricing\n• Technical consulting\n• Service packages\n• Getting in touch with Stepan\n\nWhat brings you here today?`,
      uk: `Привіт! 👋 Я AI-помічник Stepan.\n\n${conversationState.userLocation ? `Бачу, ви з ${conversationState.userLocation}! ` : ''}Я можу допомогти з:\n\n• Оцінка проектів та ціни\n• Технічний консалтинг\n• Пакети послуг\n• Зв'язок зі Stepan\n\nЯк я можу вам допомогти?`,
      nl: `Hallo! 👋 Ik ben Stepan's AI Assistent.\n\n${conversationState.userLocation ? `Ik zie dat u uit ${conversationState.userLocation} komt! ` : ''}Ik kan u helpen met:\n\n• Project schattingen & prijzen\n• Technisch advies\n• Service pakketten\n• Contact met Stepan\n\nWat kan ik voor u doen?`
    };

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: greetings[language as keyof typeof greetings] || greetings.en,
      isBot: true,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setConversationState({ stage: 'initial' });
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const lang = language as keyof typeof servicePackages;
    const packages = servicePackages[lang] || servicePackages.en;

    // Enhanced knowledge base - portfolio information
    const portfolioKnowledge = {
      en: {
        intro: "I'm Stepan's AI assistant",
        availability: "Currently open for new projects and collaborations",
        contact: "Best ways to reach: Email (stepan@roze.live), LinkedIn, GitHub, or Upwork",
        experience: "5+ years in Frontend Development, 50+ successful projects, specializing in modern web applications with React, Vue.js, and AI integration"
      },
      uk: {
        intro: "Я AI-помічник Stepan",
        skills: "Експерт у React, TypeScript, Vue.js, Node.js, Python та веб-дизайні",
        projects: "50+ успішних проектів: e-commerce, SaaS, корпоративні вебсайти, додатки з AI",
        availability: "Зараз відкритий для нових проектів та співпраці",
        contact: "Кращі способи зв'язку: Email (stepan@roze.live), LinkedIn, GitHub, або Upwork",
        pricing: "Тарифи: Frontend розробка €45/год, E-commerce €60/год, JavaScript консультації €55/год, Full-stack €75/год (всі ціни включають бельгійський ПДВ)"
      },
      nl: {
        intro: "Ik ben Stepan's AI-assistent",
        skills: "Expert in React, TypeScript, Vue.js, Node.js, Python en webdesign",
        projects: "50+ succesvolle projecten: e-commerce, SaaS, zakelijke websites, AI-applicaties",
        availability: "Momenteel open voor nieuwe projecten en samenwerkingen",
        contact: "Beste manieren om contact op te nemen: Email (stepan@roze.live), LinkedIn, GitHub, of Upwork",
        experience: "8+ jaar in Software Development, 150+ succesvolle projecten, gespecialiseerd in moderne webapplicaties met React, Vue.js en AI-integratie"
      }
    };

    const knowledge = portfolioKnowledge[lang] || portfolioKnowledge.en;

    // Enhanced keyword detection for portfolio questions
    if (input.includes('who') || input.includes('хто') || input.includes('wie') || 
        input.includes('about') || input.includes('про') || input.includes('over')) {
      return knowledge.about;
    }

    if (input.includes('skill') || input.includes('technology') || input.includes('tech') || 
        input.includes('навичк') || input.includes('технолог') || input.includes('vaardighe')) {
      return knowledge.skills;
    }

    if (input.includes('language') || input.includes('speak') || input.includes('мов') || 
        input.includes('говор') || input.includes('taal') || input.includes('spreek')) {
      return knowledge.languages;
    }

    if (input.includes('where') || input.includes('location') || input.includes('де') || 
        input.includes('локаці') || input.includes('waar') || input.includes('locatie')) {
      return knowledge.location;
    }

    if (input.includes('available') || input.includes('hire') || input.includes('work') || 
        input.includes('доступн') || input.includes('найня') || input.includes('beschikbaar')) {
      return knowledge.availability;
    }

    if (input.includes('contact') || input.includes('reach') || input.includes('email') || 
        input.includes('контакт') || input.includes('зв\'яза') || input.includes('bereik')) {
      return knowledge.contact;
    }

    if (input.includes('experience') || input.includes('досвід') || input.includes('ervaring') ||
        input.includes('portfolio') || input.includes('портфоліо') || input.includes('work')) {
      return knowledge.experience;
    }

    if (input.includes('price') || input.includes('cost') || input.includes('ціна') || 
        input.includes('вартість') || input.includes('prijs') || input.includes('kosten')) {
      if (lang === 'uk') {
        return "Орієнтовні ціни:\n\n💰 Лендінг: €800-€1,500\n💰 Веб-додаток: €3,000-€8,000\n💰 E-commerce: €5,000-€12,000\n💰 Консалтинг: €60-€90/год\n\nВсі ціни в євро з бельгійським ПДВ (21%). Точна ціна залежить від вимог проекту. Розкажіть про ваш проект для детальної оцінки!";
      } else if (lang === 'nl') {
        return "Richtprijzen:\n\n💰 Landing page: €800-€1,500\n💰 Webapplicatie: €3,000-€8,000\n💰 E-commerce: €5,000-€12,000\n💰 Consulting: €60-€90/uur\n\nAlle prijzen in euro met Belgische BTW (21%). Exacte prijs hangt af van projectvereisten. Vertel over uw project voor een gedetailleerde offerte!";
      } else {
        return "Approximate pricing:\n\n💰 Landing Page: €800-€1,500\n💰 Web App: €3,000-€8,000\n💰 E-commerce: €5,000-€12,000\n💰 Consulting: €60-€90/hour\n\nAll prices in EUR with Belgian VAT (21%). Exact price depends on project requirements. Tell me about your project for a detailed quote!";
      }
    }

    // Determine conversation flow
    switch (conversationState.stage) {
      case 'initial':
        // User mentions project type
        if (input.includes('landing') || input.includes('website') || input.includes('site') || input.includes('сайт') || input.includes('лендіг')) {
          setConversationState({ ...conversationState, stage: 'showing_prices', projectType: 'landing' });
          return formatPricing('landing', packages.landing);
        }
        if (input.includes('app') || input.includes('application') || input.includes('dashboard') || input.includes('додаток') || input.includes('дашборд')) {
          setConversationState({ ...conversationState, stage: 'showing_prices', projectType: 'webapp' });
          return formatPricing('webapp', packages.webapp);
        }
        if (input.includes('shop') || input.includes('store') || input.includes('ecommerce') || input.includes('e-commerce') || input.includes('магазин')) {
          setConversationState({ ...conversationState, stage: 'showing_prices', projectType: 'ecommerce' });
          return formatPricing('ecommerce', packages.ecommerce);
        }
        if (input.includes('consult') || input.includes('advice') || input.includes('help') || input.includes('консульт') || input.includes('порада')) {
          setConversationState({ ...conversationState, stage: 'showing_prices', projectType: 'consulting' });
          return formatPricing('consulting', packages.consulting);
        }

        // General inquiry
        if (lang === 'uk') {
          return "Розкажіть мені про ваш проект! Вам потрібен:\n\n1. Лендінг/сайт\n2. Веб-додаток\n3. E-commerce магазин\n4. Технічний консалтинг\n\nАбо запитайте мене про досвід, навички, ціни Stepan - я знаю все про портфоліо!";
        } else if (lang === 'nl') {
          return "Vertel me over uw project! Heeft u nodig:\n\n1. Landing page/website\n2. Webapplicatie\n3. E-commerce winkel\n4. Technisch advies\n\nOf vraag me over ervaring, vaardigheden, prijzen van Stepan - ik weet alles over het portfolio!";
        } else {
          return "Tell me about your project! Do you need:\n\n1. Landing page/website\n2. Web application\n3. E-commerce store\n4. Technical consulting\n\nOr ask me about Stepan's experience, skills, pricing - I know everything about the portfolio!";
        }

      case 'showing_prices':
        // After showing prices, ask for contact
        setConversationState({ ...conversationState, stage: 'collecting_contact' });
        if (lang === 'uk') {
          return "Чудово! Я передам вашу заявку Stepan.\n\nЯк вам зручніше зв'язатися?\n\n• Email\n• Telegram\n• WhatsApp\n\nВкажіть спосіб та ваш контакт (наприклад: telegram @username або email: your@email.com)";
        } else if (lang === 'nl') {
          return "Geweldig! Ik zal uw aanvraag doorsturen naar Stepan.\n\nHoe wilt u graag contact?\n\n• Email\n• Telegram\n• WhatsApp\n\nGeef uw voorkeur en contact (bijv: telegram @username of email: your@email.com)";
        } else {
          return "Great! I'll forward your inquiry to Stepan.\n\nHow would you prefer to be contacted?\n\n• Email\n• Telegram\n• WhatsApp\n\nPlease provide your preferred method and contact (e.g., telegram @username or email: your@email.com)";
        }

      case 'collecting_contact':
        // Collect contact and complete
        setConversationState({ ...conversationState, stage: 'complete', contactInfo: userInput });
        if (lang === 'uk') {
          return `✅ Дякую! Я передав вашу заявку Stepan.\n\n📋 Деталі:\n• Проект: ${conversationState.projectType}\n• Локація: ${conversationState.userLocation || 'Не визначено'}\n• Контакт: ${userInput}\n\nStepan зв'яжеться з вами протягом 24 годин. Гарного дня! 🚀`;
        } else if (lang === 'nl') {
          return `✅ Bedankt! Ik heb uw aanvraag doorgestuurd naar Stepan.\n\n📋 Details:\n• Project: ${conversationState.projectType}\n• Locatie: ${conversationState.userLocation || 'Niet gedetecteerd'}\n• Contact: ${userInput}\n\nStepan neemt binnen 24 uur contact met u op. Fijne dag! 🚀`;
        } else {
          return `✅ Thank you! I've forwarded your inquiry to Stepan.\n\n📋 Details:\n• Project: ${conversationState.projectType}\n• Location: ${conversationState.userLocation || 'Not detected'}\n• Contact: ${userInput}\n\nStepan will reach out within 24 hours. Have a great day! 🚀`;
        }

      case 'complete':
        if (lang === 'uk') {
          return "Ваша заявка вже була відправлена! Stepan зв'яжеться з вами найближчим часом. Чи можу я ще чимось допомогти?";
        } else if (lang === 'nl') {
          return "Uw aanvraag is al verzonden! Stepan neemt binnenkort contact met u op. Kan ik u nog ergens anders mee helpen?";
        } else {
          return "Your inquiry has already been submitted! Stepan will contact you soon. Is there anything else I can help with?";
        }

      default:
        return "I'm here to help! Ask me anything about Stepan's services.";
    }
  };

  const formatPricing = (type: string, pkg: any): string => {
    const lang = language as keyof typeof servicePackages;
    
    const templates = {
      en: `💰 **${pkg.name}**\n\nPrice: ${pkg.price}\nTimeline: ${pkg.timeline}\n\nWhat's included:\n${pkg.features.map((f: string) => `✓ ${f}`).join('\n')}\n\nAll prices are in EUR, including Belgian taxes (21% VAT).\n\nInterested? Let me know!`,
      uk: `💰 **${pkg.name}**\n\nЦіна: ${pkg.price}\nТермін: ${pkg.timeline}\n\nЩо входить:\n${pkg.features.map((f: string) => `✓ ${f}`).join('\n')}\n\nВсі ціни в EUR, включаючи бельгійські податки (21% ПДВ).\n\nЦікавить? Дайте знати!`,
      nl: `💰 **${pkg.name}**\n\nPrijs: ${pkg.price}\nTermijn: ${pkg.timeline}\n\nWat is inbegrepen:\n${pkg.features.map((f: string) => `✓ ${f}`).join('\n')}\n\nAlle prijzen zijn in EUR, inclusief Belgische belastingen (21% BTW).\n\nGeïnteresseerd? Laat het me weten!`
    };

    return templates[lang] || templates.en;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking
    setTimeout(() => {
      const response = generateResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-full shadow-[0_0_30px_rgba(0,217,255,0.4)] flex items-center justify-center group hover:shadow-[0_0_40px_rgba(0,217,255,0.6)] transition-all"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-7 h-7 text-black" />
            <motion.div
              className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed z-50 bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/30 rounded-2xl shadow-[0_0_50px_rgba(0,217,255,0.3)] flex flex-col overflow-hidden
              bottom-4 right-4 left-4
              md:bottom-6 md:right-6 md:left-auto md:w-96 md:max-w-[calc(100vw-3rem)]
              h-[calc(100vh-100px)] max-h-[500px]
              md:h-[600px] md:max-h-[70vh]
              landscape:h-[calc(100vh-20px)] landscape:max-h-[calc(100vh-20px)] landscape:w-[380px]"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            ref={chatRef}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <div>
                  <h3 className="font-bold text-black">AI Assistant</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-black/70">Online</span>
                    {conversationState.userLocation && (
                      <>
                        <MapPin className="w-3 h-3 text-black/70 ml-1" />
                        <span className="text-xs text-black/70">{conversationState.userLocation.split(',')[1]?.trim()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isBot
                        ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]'
                        : 'bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-[var(--accent-primary)] rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-[var(--accent-primary)] rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-[var(--accent-primary)] rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 md:p-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={language === 'uk' ? 'Напишіть повідомлення...' : language === 'nl' ? 'Typ een bericht...' : 'Type a message...'}
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all"
                />
                <Button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 hover:from-[var(--accent-secondary)] hover:to-cyan-500 text-black p-2.5 md:p-3 rounded-xl min-w-[44px] md:min-w-[48px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  disabled={!input.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}