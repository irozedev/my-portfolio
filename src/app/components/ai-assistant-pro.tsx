import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { 
  Bot, X, Send, MapPin, ArrowUp, Star, Code, Briefcase, Mail, 
  Calendar, Zap, ChevronRight, ExternalLink, Sparkles, Clock,
  Eye, MessageCircle, Heart, Package, TrendingUp, Award, Users,
  Phone, CheckCircle
} from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { Button } from "./ui/button";
import { getCurrentAvailability } from "../config/availability";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  actions?: QuickAction[];
  showSection?: string;
  showData?: any;
}

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  color: string;
  action: () => void;
}

interface ConversationState {
  stage: 'initial' | 'showing_info' | 'collecting_project' | 'showing_prices' | 'collecting_contact' | 'complete';
  projectType?: string;
  userLocation?: string;
  contactInfo?: string;
  currentSection?: string;
  hasScrolled?: boolean;
}

const siteData = {
  en: {
    sections: {
      hero: "Hero Section - Introduction",
      about: "About Me - Background & Skills",
      experience: "Experience - Work History",
      projects: "Portfolio Projects",
      services: "Services & Pricing",
      contact: "Contact Form"
    },
    projects: [
      { title: "AI SaaS Platform", tech: "React, Node.js, OpenAI", price: "€8,000" },
      { title: "E-commerce Dashboard", tech: "Vue.js, MongoDB", price: "€5,500" },
      { title: "Portfolio Website", tech: "React, Tailwind", price: "€1,200" }
    ],
    services: [
      { name: "Landing Page", price: "€800-€1,500", timeline: "1-2 weeks" },
      { name: "Web Application", price: "€3,000-€8,000", timeline: "4-8 weeks" },
      { name: "E-commerce", price: "€5,000-€12,000", timeline: "6-12 weeks" },
      { name: "Consulting", price: "€60-€90/hour", timeline: "Flexible" }
    ],
    skills: {
      expert: ["React (95%)", "JavaScript (98%)", "Tailwind (92%)"],
      advanced: ["Vue.js (90%)", "TypeScript (85%)", "Magento (88%)"],
      intermediate: ["Node.js (80%)", "MongoDB (75%)"]
    },
    stats: {
      experience: "5+ years",
      projects: "50+ completed",
      satisfaction: "100%",
      clients: "Happy clients worldwide"
    }
  },
  uk: {
    sections: {
      hero: "Головна секція - Вступ",
      about: "Про мене - Досвід та навички",
      experience: "Досвід роботи",
      projects: "Портфоліо проектів",
      services: "Послуги та ціни",
      contact: "Контактна форма"
    },
    projects: [
      { title: "AI SaaS Платформа", tech: "React, Node.js, OpenAI", price: "€8,000" },
      { title: "E-commerce Дашборд", tech: "Vue.js, MongoDB", price: "€5,500" },
      { title: "Сайт-портфоліо", tech: "React, Tailwind", price: "€1,200" }
    ],
    services: [
      { name: "Лендінг", price: "€800-€1,500", timeline: "1-2 тижні" },
      { name: "Веб-додаток", price: "€3,000-€8,000", timeline: "4-8 тижнів" },
      { name: "E-commerce", price: "€5,000-€12,000", timeline: "6-12 тижнів" },
      { name: "Консалтинг", price: "€60-€90/год", timeline: "Гнучко" }
    ],
    skills: {
      expert: ["React (95%)", "JavaScript (98%)", "Tailwind (92%)"],
      advanced: ["Vue.js (90%)", "TypeScript (85%)", "Magento (88%)"],
      intermediate: ["Node.js (80%)", "MongoDB (75%)"]
    },
    stats: {
      experience: "5+ років",
      projects: "50+ завершено",
      satisfaction: "100%",
      clients: "Задоволені клієнти по всьому світу"
    }
  },
  nl: {
    sections: {
      hero: "Hero Sectie - Introductie",
      about: "Over Mij - Achtergrond & Vaardigheden",
      experience: "Werkervaring",
      projects: "Portfolio Projecten",
      services: "Diensten & Prijzen",
      contact: "Contactformulier"
    },
    projects: [
      { title: "AI SaaS Platform", tech: "React, Node.js, OpenAI", price: "€8,000" },
      { title: "E-commerce Dashboard", tech: "Vue.js, MongoDB", price: "€5,500" },
      { title: "Portfolio Website", tech: "React, Tailwind", price: "€1,200" }
    ],
    services: [
      { name: "Landing Page", price: "€800-€1,500", timeline: "1-2 weken" },
      { name: "Webapplicatie", price: "€3,000-€8,000", timeline: "4-8 weken" },
      { name: "E-commerce", price: "€5,000-€12,000", timeline: "6-12 weken" },
      { name: "Advies", price: "€60-€90/uur", timeline: "Flexibel" }
    ],
    skills: {
      expert: ["React (95%)", "JavaScript (98%)", "Tailwind (92%)"],
      advanced: ["Vue.js (90%)", "TypeScript (85%)", "Magento (88%)"],
      intermediate: ["Node.js (80%)", "MongoDB (75%)"]
    },
    stats: {
      experience: "5+ jaar",
      projects: "50+ voltooid",
      satisfaction: "100%",
      clients: "Tevreden klanten wereldwijd"
    }
  }
};

export function AIAssistantPro() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const [conversationState, setConversationState] = useState<ConversationState>({
    stage: 'initial'
  });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'experience', 'projects', 'services', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            setConversationState(prev => ({ ...prev, currentSection: section }));
            break;
          }
        }
      }
    }; // Throttle scroll handler to prevent overheating on mobile
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 200); // Only update every 200ms
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      detectUserLocation();
      setTimeout(() => {
        sendInitialGreeting();
      }, 500);
    }
  }, [isOpen, language]);

  // Listen for openChatBot event
  useEffect(() => {
    const handleOpenChatBot = () => {
      setIsOpen(true);
    };

    window.addEventListener('openChatBot', handleOpenChatBot);
    return () => window.removeEventListener('openChatBot', handleOpenChatBot);
  }, []);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const chatRef = document.querySelector('.chat-window');
      if (chatRef && !chatRef.contains(event.target as Node) && isOpen) {
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const nav = document.querySelector('nav');
      const headerOffset = nav ? nav.offsetHeight : 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setConversationState(prev => ({ ...prev, hasScrolled: true, currentSection: sectionId }));
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendInitialGreeting = () => {
    const availability = getCurrentAvailability();
    const data = siteData[language as keyof typeof siteData] || siteData.en;
    
    const greetings = {
      en: `👋 Hi! I'm Stepan's AI Assistant!\n\n${conversationState.userLocation ? `I see you're from ${conversationState.userLocation}! ` : ''}I can help you explore this portfolio and answer questions.\n\n🎯 Quick Actions:`,
      uk: `👋 Привіт! Я AI-помічник Stepan!\n\n${conversationState.userLocation ? `Бачу, ви з ${conversationState.userLocation}! ` : ''}Можу допомогти дослідити портфоліо та відповісти на питання.\n\n🎯 Швидкі дії:`,
      nl: `👋 Hallo! Ik ben Stepan's AI Assistent!\n\n${conversationState.userLocation ? `Ik zie dat u uit ${conversationState.userLocation} komt! ` : ''}Ik kan u helpen om het portfolio te verkennen en vragen te beantwoorden.\n\n🎯 Snelle acties:`
    };

    const quickActions: QuickAction[] = [
      {
        id: 'view-projects',
        label: language === 'uk' ? '📁 Проекти' : language === 'nl' ? '📁 Projecten' : '📁 Projects',
        icon: Briefcase,
        color: '#00d9ff',
        action: () => handleQuickAction('projects')
      },
      {
        id: 'view-services',
        label: language === 'uk' ? '💼 Послуги' : language === 'nl' ? '💼 Diensten' : '💼 Services',
        icon: Package,
        color: '#a78bfa',
        action: () => handleQuickAction('services')
      },
      {
        id: 'view-pricing',
        label: language === 'uk' ? '💰 Ціни' : language === 'nl' ? '💰 Prijzen' : '💰 Pricing',
        icon: TrendingUp,
        color: '#22c55e',
        action: () => handleQuickAction('pricing')
      },
      {
        id: 'contact',
        label: language === 'uk' ? '📧 Контакт' : language === 'nl' ? '📧 Contact' : '📧 Contact',
        icon: Mail,
        color: '#f59e0b',
        action: () => handleQuickAction('contact')
      }
    ];

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: greetings[language as keyof typeof greetings] || greetings.en,
      isBot: true,
      timestamp: new Date(),
      actions: quickActions
    };
    
    setMessages([welcomeMessage]);
    setConversationState({ stage: 'initial' });
  };

  const handleQuickAction = (action: string) => {
    const lang = language as keyof typeof siteData;
    // Fallback to 'en' if current language is not available in siteData
    const data = siteData[lang] || siteData.en;
    
    switch (action) {
      case 'projects':
        scrollToSection('projects');
        sendBotMessage(
          language === 'uk' 
            ? `📁 Переходжу до секції проектів!\n\nОсь деякі з останніх робіт:\n\n${data.projects.map(p => `• ${p.title}\n  Технології: ${p.tech}\n  Вартість: ${p.price}`).join('\n\n')}\n\nХочете дізнатися більше про якийсь проект?`
            : language === 'nl'
            ? `📁 Navigeren naar projecten sectie!\n\nHier zijn enkele recente werken:\n\n${data.projects.map(p => `• ${p.title}\n  Technologieën: ${p.tech}\n  Prijs: ${p.price}`).join('\n\n')}\n\nWilt u meer weten over een project?`
            : `📁 Navigating to projects section!\n\nHere are some recent works:\n\n${data.projects.map(p => `• ${p.title}\n  Tech: ${p.tech}\n  Price: ${p.price}`).join('\n\n')}\n\nWant to know more about any project?`,
          'projects'
        );
        break;
      
      case 'services':
        scrollToSection('services');
        sendBotMessage(
          language === 'uk'
            ? `💼 Показую доступні послуги!\n\n${data.services.map(s => `${s.name}:\n💰 ${s.price}\n⏱️ ${s.timeline}`).join('\n\n')}\n\nВсі ціни включають бельгійський ПДВ (21%). Цікавить якась послуга?`
            : language === 'nl'
            ? `💼 Tonen van beschikbare diensten!\n\n${data.services.map(s => `${s.name}:\n💰 ${s.price}\n⏱️ ${s.timeline}`).join('\n\n')}\n\nAlle prijzen inclusief Belgische BTW (21%). Geïnteresseerd in een dienst?`
            : `💼 Showing available services!\n\n${data.services.map(s => `${s.name}:\n💰 ${s.price}\n⏱️ ${s.timeline}`).join('\n\n')}\n\nAll prices include Belgian VAT (21%). Interested in any service?`,
          'services'
        );
        break;
      
      case 'pricing':
        sendBotMessage(
          language === 'uk'
            ? `💰 Ціноутворення Stepan:\n\n${data.services.map(s => `${s.name}: ${s.price}`).join('\n')}\n\n✨ Ціна залежить від:\n• Складності проекту\n• Термінів виконання\n• Додаткових функцій\n• Підтримки після запуску\n\nХочете отримати персональну оцінку?`
            : language === 'nl'
            ? `💰 Stepan's prijzen:\n\n${data.services.map(s => `${s.name}: ${s.price}`).join('\n')}\n\n✨ Prijs hangt af van:\n• Projectcomplexiteit\n• Deadline\n• Extra functionaliteiten\n• Ondersteuning na lancering\n\nWilt u een gepersonaliseerde offerte?`
            : `💰 Stepan's Pricing:\n\n${data.services.map(s => `${s.name}: ${s.price}`).join('\n')}\n\n✨ Price depends on:\n• Project complexity\n• Timeline requirements\n• Additional features\n• Post-launch support\n\nWant a personalized quote?`,
          'pricing'
        );
        break;
      
      case 'contact':
        scrollToSection('contact');
        return language === 'uk'
          ? `✅ Переходжу до контактів! Email: hello@roze.live`
          : language === 'nl'
          ? `✅ Navigeren naar contact! Email: hello@roze.live`
          : `✅ Going to contact! Email: hello@roze.live`;
    }
  };

  const sendBotMessage = (text: string, section?: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
      showSection: section
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const lang = language as keyof typeof siteData;
    const data = siteData[lang];

    // Check for complex/specific questions that need Stepan's attention
    const needsStepanAttention = 
      input.includes('custom') || input.includes('specific') || input.includes('detailed quote') ||
      input.includes('нестандартн') || input.includes('особлив') || input.includes('детальн') ||
      input.includes('aangepast') || input.includes('specifiek') || input.includes('gedetailleerde') ||
      input.includes('partnership') || input.includes('партнер') || input.includes('samenwer') ||
      input.includes('long-term') || input.includes('довгостроков') || input.includes('langdurig') ||
      input.includes('contract') || input.includes('контракт') || input.includes('deal') ||
      input.includes('discount') || input.includes('знижк') || input.includes('korting') ||
      input.includes('team') || input.includes('команд') || input.includes('hiring') || input.includes('найм') ||
      input.includes('technical details') || input.includes('технічні деталі') || input.includes('technische details');

    if (needsStepanAttention) {
      scrollToSection('contact');
      return language === 'uk'
        ? `🎯 Це важливе питання!\n\nВаш запит потребує особистого обговорення зі Stepan. Я переспрямовую вас до контактної форми.\n\n📧 Найкращі способи зв'язку:\n• Email: hello@roze.live (відповідь протягом 24 год)\n• LinkedIn: linkedin.com/in/rozestepan\n• Upwork: для бізнес пропозицій\n\nStepan особисто розгляне ваш запит і надасть детальну відповідь!`
        : language === 'nl'
        ? `🎯 Dit is een belangrijk vraag!\n\nUw verzoek vereist een persoonlijk gesprek met Stepan. Ik verwijs u door naar het contactformulier.\n\n📧 Beste contactmogelijkheden:\n• Email: hello@roze.live (antwoord binnen 24 uur)\n• LinkedIn: linkedin.com/in/rozestepan\n• Upwork: voor zakelijke voorstellen\n\nStepan zal uw verzoek persoonlijk bekijken en een gedetailleerd antwoord geven!`
        : `🎯 This is an important question!\n\nYour request requires personal discussion with Stepan. I'm redirecting you to the contact form.\n\n📧 Best ways to reach out:\n• Email: hello@roze.live (reply within 24 hours)\n• LinkedIn: linkedin.com/in/rozestepan\n• Upwork: for business inquiries\n\nStepan will personally review your request and provide a detailed response!`;
    }

    // Navigation requests
    if (input.includes('show') || input.includes('покаж') || input.includes('toon') ||
        input.includes('go to') || input.includes('перейди') || input.includes('ga naar')) {
      
      if (input.includes('project') || input.includes('проект') || input.includes('portfolio')) {
        scrollToSection('projects');
        return language === 'uk' 
          ? `✅ Показую проекти! Прокручую до секції портфоліо...`
          : language === 'nl'
          ? `✅ Tonen van projecten! Scrollen naar portfolio sectie...`
          : `✅ Showing projects! Scrolling to portfolio section...`;
      }
      
      if (input.includes('service') || input.includes('послуг') || input.includes('dienst')) {
        scrollToSection('services');
        return language === 'uk'
          ? `✅ Показую послуги! Прокручую до секції сервісів...`
          : language === 'nl'
          ? `✅ Tonen van diensten! Scrollen naar diensten sectie...`
          : `✅ Showing services! Scrolling to services section...`;
      }
      
      if (input.includes('contact') || input.includes('контакт')) {
        scrollToSection('contact');
        return language === 'uk'
          ? `✅ Переходжу до контактів! Email: hello@roze.live`
          : language === 'nl'
          ? `✅ Navigeren naar contact! Email: hello@roze.live`
          : `✅ Going to contact! Email: hello@roze.live`;
      }
      
      if (input.includes('about') || input.includes('про') || input.includes('over')) {
        scrollToSection('about');
        return language === 'uk'
          ? `✅ Розповідаю про Stepan! Прокручую до секції "Про мене"...`
          : language === 'nl'
          ? `✅ Vertellen over Stepan! Scrollen naar "Over mij" sectie...`
          : `✅ Telling about Stepan! Scrolling to About section...`;
      }
      
      if (input.includes('experience') || input.includes('досвід') || input.includes('ervaring')) {
        scrollToSection('experience');
        return language === 'uk'
          ? `✅ Показую досвід роботи! ${data.stats.experience} у розробці, ${data.stats.projects} проектів!`
          : language === 'nl'
          ? `✅ Tonen van werkervaring! ${data.stats.experience} in ontwikkeling, ${data.stats.projects} projecten!`
          : `✅ Showing experience! ${data.stats.experience} in development, ${data.stats.projects} projects!`;
      }
    }

    // Skills inquiry
    if (input.includes('skill') || input.includes('навичк') || input.includes('vaardighe') ||
        input.includes('tech') || input.includes('технолог')) {
      return language === 'uk'
        ? `💻 Технічні навички Stepan:\n\n🌟 Експертний рівень:\n${data.skills.expert.join('\n')}\n\n⭐ Просунутий рівень:\n${data.skills.advanced.join('\n')}\n\n📊 Середній рівень:\n${data.skills.intermediate.join('\n')}\n\nХочете побачити приклади робіт з певною технологією?`
        : language === 'nl'
        ? `💻 Stepan's technische vaardigheden:\n\n🌟 Expert niveau:\n${data.skills.expert.join('\n')}\n\n⭐ Gevorderd niveau:\n${data.skills.advanced.join('\n')}\n\n📊 Gemiddeld niveau:\n${data.skills.intermediate.join('\n')}\n\nWilt u voorbeelden zien met een specifieke technologie?`
        : `💻 Stepan's Technical Skills:\n\n🌟 Expert Level:\n${data.skills.expert.join('\n')}\n\n⭐ Advanced Level:\n${data.skills.advanced.join('\n')}\n\n📊 Intermediate Level:\n${data.skills.intermediate.join('\n')}\n\nWant to see examples with a specific technology?`;
    }

    // Pricing inquiry
    if (input.includes('price') || input.includes('cost') || input.includes('ціна') ||
        input.includes('вартість') || input.includes('prijs') || input.includes('kosten') ||
        input.includes('how much') || input.includes('скільки')) {
      return language === 'uk'
        ? `💰 Ціни на послуги (з бельгійським ПДВ 21%):\n\n${data.services.map(s => `${s.name}:\n  ${s.price} | ${s.timeline}`).join('\n\n')}\n\n✨ Фактори що впливають на ціну:\n• Складність\n• Терміни\n• Додаткові функції\n• Підтримка\n\n📧 Для точної оцінки напишіть Stepan: hello@roze.live`
        : language === 'nl'
        ? `💰 Dienstenprijzen (incl. Belgische BTW 21%):\n\n${data.services.map(s => `${s.name}:\n  ${s.price} | ${s.timeline}`).join('\n\n')}\n\n✨ Prijsfactoren:\n• Complexiteit\n• Deadline\n• Extra features\n• Ondersteuning\n\n📧 Voor een exacte offerte, schrijf Stepan: hello@roze.live`
        : `💰 Service Pricing (incl. Belgian VAT 21%):\n\n${data.services.map(s => `${s.name}:\n  ${s.price} | ${s.timeline}`).join('\n\n')}\n\n✨ Price factors:\n• Complexity\n• Timeline\n• Additional features\n• Support\n\n📧 For accurate quote, write to Stepan: hello@roze.live`;
    }

    // Availability inquiry
    if (input.includes('available') || input.includes('доступн') || input.includes('beschikbaar') ||
        input.includes('when') || input.includes('коли') || input.includes('wanneer')) {
      const availability = getCurrentAvailability();
      return language === 'uk'
        ? `📅 Поточна доступність: ${availability.status}\n\n⏰ Робочий графік:\nПН-ПТ: 9:00 - 18:00 CET\n\n💼 Статус: ${availability.isAvailable ? 'Відкритий для нових проектів' : 'Зайнятий, обмежена доступність'}\n\nХочете забронювати дзвінок? Натисніть на віджет доступності у правому верхньому куті!`
        : language === 'nl'
        ? `📅 Huidige beschikbaarheid: ${availability.status}\n\n⏰ Werkuren:\nMa-Vr: 9:00 - 18:00 CET\n\n💼 Status: ${availability.isAvailable ? 'Open voor nieuwe projecten' : 'Bezet, beperkte beschikbaarheid'}\n\nWilt u een gesprek boeken? Klik op de beschikbaarheidswidget rechtsboven!`
        : `📅 Current availability: ${availability.status}\n\n⏰ Working hours:\nMon-Fri: 9:00 - 18:00 CET\n\n💼 Status: ${availability.isAvailable ? 'Open for new projects' : 'Busy, limited availability'}\n\nWant to book a call? Click the availability widget in the top right!`;
    }

    // Location inquiry
    if (input.includes('where') || input.includes('location') || input.includes('де') ||
        input.includes('waar') || input.includes('based')) {
      return language === 'uk'
        ? `📍 Локація: Бельгія, Європа\n\n🌍 Робота:\n• Віддалено по всьому світу\n• Часовий пояс: CET (UTC+1)\n• Досвід оботи з клієнтами з Європи, США, Азії\n\n✈️ Можливі поїздки для проектів у Європі`
        : language === 'nl'
        ? `📍 Locatie: België, Europa\n\n🌍 Werk:\n• Remote wereldwijd\n• Tijdzone: CET (UTC+1)\n• Ervaring met klanten uit Europa, VS, Azië\n\n✈️ Reizen mogelijk voor projecten in Europa`
        : `📍 Location: Belgium, Europe\n\n🌍 Work:\n• Remote worldwide\n• Timezone: CET (UTC+1)\n• Experience with clients from Europe, US, Asia\n\n✈️ Travel possible for projects in Europe`;
    }

    // Stats and achievements
    if (input.includes('stat') || input.includes('number') || input.includes('achievement') ||
        input.includes('статист') || input.includes('досягнен')) {
      return language === 'uk'
        ? `📊 Статистика та досягнення:\n\n⭐ ${data.stats.experience} досвіду\n🚀 ${data.stats.projects}\n😊 ${data.stats.satisfaction} задоволеність клієнтів\n🌍 ${data.stats.clients}\n\n🏆 Ключові досягнення:\n• 100% виконаних проектів вчасно\n• Top-rated на Upwork\n• Експертний рівень у React та JavaScript\n• Міжнародний досвід`
        : language === 'nl'
        ? `📊 Statistieken en prestaties:\n\n⭐ ${data.stats.experience} ervaring\n🚀 ${data.stats.projects}\n😊 ${data.stats.satisfaction} klanttevredenheid\n🌍 ${data.stats.clients}\n\n🏆 Belangrijkste prestaties:\n• 100% projecten op tijd afgerond\n• Top-rated op Upwork\n• Expert niveau in React en JavaScript\n• Internationale ervaring`
        : `📊 Stats and Achievements:\n\n⭐ ${data.stats.experience} of experience\n🚀 ${data.stats.projects}\n😊 ${data.stats.satisfaction} client satisfaction\n ${data.stats.clients}\n\n🏆 Key achievements:\n• 100% projects delivered on time\n• Top-rated on Upwork\n• Expert level in React and JavaScript\n• International experience`;
    }

    // If question is unclear or not covered - redirect to Stepan
    const questionWords = ['how', 'why', 'what', 'when', 'where', 'can', 'do you', 'are you',
                          'як', 'чому', 'що', 'коли', 'де', 'чи можете', 'чи ви',
                          'hoe', 'waarom', 'wat', 'wanneer', 'waar', 'kan je', 'ben je'];
    
    const isQuestion = questionWords.some(word => input.includes(word));
    
    if (isQuestion && input.length > 50) {
      // Complex question - redirect to Stepan
      scrollToSection('contact');
      return language === 'uk'
        ? `🤔 Це складне питання!\n\nЯ AI-помічник і можу відповісти на базові питання. Для детальної відповіді краще зв'язатися безпосередньо зі Stepan.\n\n📧 Напишіть на: hello@ro3e.io\n💼 LinkedIn: linkedin.com/in/stepanroze\n\nStepan особисто відвість на ваше питання!`
        : language === 'nl'
        ? `🤔 Dit is een complexe vraag!\n\nIk ben een AI-assistent en kan basisvragen beantwoorden. Voor een gedetailleerd antwoord is het beter om direct contact op te nemen met Stepan.\n\n📧 Schrijf naar: hello@ro3e.io\n💼 LinkedIn: linkedin.com/in/stepanroze\n\nStepan zal persoonlijk uw vraag beantwoorden!`
        : `🤔 That's a complex question!\n\nI'm an AI assistant and can answer basic questions. For a detailed response, it's better to contact Stepan directly.\n\n📧 Write to: hello@ro3e.io\n💼 LinkedIn: linkedin.com/in/stepanroze\n\nStepan will personally answer your question!`;
    }

    // Default response with suggestions
    return language === 'uk'
      ? `Я можу допомогти вам з:\n\n🔍 Навігацією по сайту:\n• "Покажи проекти"\n• "Перейди до послуг"\n• "Відкрий контакти"\n\n💡 Інформацією:\n• "Які навички?"\n• "Скільки коштує?"\n• "Коли доступний?"\n• "Де знаходиться?"\n\n📊 Даними:\n• "Покажи статистику"\n• "Розкажи про досвід"\n\n❓ Для складних питань краще написати Stepan напряму: hello@ro3e.io`
      : language === 'nl'
      ? `Ik kan u helpen met:\n\n🔍 Website navigatie:\n• "Toon projecten"\n• "Ga naar diensten"\n• "Open contact"\n\n💡 Informatie:\n• "Welke vaardigheden?"\n• "Wat zijn de prijzen?"\n• "Wanneer beschikbaar?"\n• "Waar gevestigd?"\n\n📊 Gegevens:\n• "Toon statistieken"\n• "Vertel over ervaring"\n\n❓ Voor complexe vragen, schrijf direct naar Stepan: hello@ro3e.io`
      : `I can help you with:\n\n🔍 Site navigation:\n• "Show projects"\n• "Go to services"\n• "Open contact"\n\n💡 Information:\n• "What skills?"\n• "What are the prices?"\n• "When available?"\n• "Where located?"\n\n📊 Data:\n• "Show statistics"\n• "Tell about experience"\n\n❓ For complex questions, write directly to Stepan: hello@ro3e.io`;
  };

  const handleSend = async () => {
    if (!input || input.trim().length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    // 🧠 SMART THINKING - Variable delay based on complexity
    const wordCount = currentInput.trim().split(/\s+/).length;
    const hasQuestion = currentInput.includes('?') || 
                       currentInput.toLowerCase().includes('how') || 
                       currentInput.toLowerCase().includes('what') ||
                       currentInput.toLowerCase().includes('why') ||
                       currentInput.toLowerCase().includes('when');
    
    // Calculate thinking time:
    // - Short questions (1-5 words): 600-1000ms
    // - Medium (6-15 words): 1000-1800ms  
    // - Long/complex (16+ words): 1800-2500ms
    const baseDelay = hasQuestion ? 800 : 600;
    const complexityDelay = Math.min(wordCount * 80, 1500);
    const thinkingTime = baseDelay + complexityDelay;
    
    console.log(`[AI Thinking] Words: ${wordCount}, HasQuestion: ${hasQuestion}, ThinkingTime: ${thinkingTime}ms`);

    try {
      // 🔥 CALL REAL AI API WITH SECURITY
      const { projectId, publicAnonKey } = await import('/utils/supabase/info');
      
      const apiResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7/ai/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            message: currentInput,
            language: language === 'uk' ? 'Ukrainian' : language === 'nl' ? 'Dutch' : language === 'ar' ? 'Arabic' : language === 'es' ? 'Spanish' : 'English',
            context: conversationState.currentSection || 'general'
          })
        }
      );

      const result = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(result.error || 'API request failed');
      }

      // Add artificial thinking delay for UX (API is too fast!)
      await new Promise(resolve => setTimeout(resolve, Math.max(0, thinkingTime - 500)));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.message || result.response || generateResponse(currentInput),
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      console.log(`[AI Response] Model: ${result.model || 'fallback'}, Cached: ${result.cached || false}`);
      
    } catch (error) {
      console.error('[AI Error]', error);
      
      // Fallback to local responses if API fails
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(currentInput),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && !isOpen && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-24 right-4 sm:right-6 z-[100] w-12 h-12 md:w-14 md:h-14 bg-[var(--card-bg)] border-2 border-[var(--accent-primary)] rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--accent-primary)] hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] transition-all group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent-primary)] group-hover:text-black transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-4 sm:right-6 z-[100] w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-full shadow-[0_0_30px_rgba(0,217,255,0.4)] flex items-center justify-center group hover:shadow-[0_0_40px_rgba(0,217,255,0.6)] transition-all"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bot className="w-6 h-6 md:w-7 md:h-7 text-black" />
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed z-[99999] bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/30 rounded-2xl md:rounded-3xl shadow-[0_0_50px_rgba(0,217,255,0.3)] flex flex-col overflow-hidden
              bottom-0 right-0 left-0
              md:bottom-6 md:right-6 md:left-auto md:w-[420px] md:max-w-[calc(100vw-3rem)]
              h-[100dvh] md:h-[650px] md:max-h-[calc(100vh-100px)]"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            ref={chatRef}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 p-4 md:p-5 flex items-center justify-between shrink-0 relative z-10">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Bot className="w-6 h-6 text-[var(--accent-primary)]" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-black text-lg">AI Assistant</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-black/70">Online</span>
                    </div>
                    {conversationState.currentSection && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-black/70" />
                        <span className="text-xs text-black/70 capitalize">{conversationState.currentSection}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 md:p-2.5 hover:bg-white/20 rounded-full transition-colors touch-manipulation"
              >
                <X className="w-6 h-6 md:w-6 md:h-6 text-black" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]" style={{ WebkitOverflowScrolling: 'touch' }}>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: isMobile ? 0.2 : 0.3 }}
                >
                  <div className={`max-w-[85%] ${message.isBot ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`p-3 md:p-4 rounded-2xl ${
                        message.isBot
                          ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-tl-sm'
                          : 'bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black rounded-tr-sm'
                      }`}
                    >
                      <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      <span className="text-xs opacity-60 mt-2 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    {/* Quick Actions */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {message.actions.map((action) => (
                          <button
                            key={action.id}
                            onClick={action.action}
                            className="flex items-center gap-2 p-3 bg-[var(--bg-secondary)] active:bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl transition-colors group touch-manipulation"
                          >
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${action.color}20` }}
                            >
                              <action.icon className="w-4 h-4" style={{ color: action.color }} />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-[var(--text-primary)] group-active:text-[var(--accent-primary)] transition-colors">
                              {action.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1.5">
                      <motion.div
                        className="w-2.5 h-2.5 bg-[var(--accent-primary)] rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2.5 h-2.5 bg-[var(--accent-primary)] rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2.5 h-2.5 bg-[var(--accent-primary)] rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 md:p-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)] shrink-0">
              <div className="flex gap-2 items-end">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={
                    language === 'uk' 
                      ? 'Напишіть повідомлення...' 
                      : language === 'nl' 
                      ? 'Typ een bericht...' 
                      : 'Type a message...'
                  }
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  style={{ fontSize: '16px' }}
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all min-h-[48px]"
                />
                <Button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 hover:from-[var(--accent-secondary)] hover:to-cyan-500 text-black p-3 rounded-xl min-w-[48px] h-[48px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
                  disabled={!input.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Suggestion chips */}
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                {['Projects', 'Pricing', 'Contact'].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setInput(
                        language === 'uk' 
                          ? chip === 'Projects' ? 'Покажи проекти' : chip === 'Pricing' ? 'Скільки коштує?' : 'Як зв\'язатися?'
                          : language === 'nl'
                          ? chip === 'Projects' ? 'Toon projecten' : chip === 'Pricing' ? 'Wat zijn de prijzen?' : 'Hoe contact?'
                          : chip === 'Projects' ? 'Show projects' : chip === 'Pricing' ? 'What are the prices?' : 'How to contact?'
                      );
                    }}
                    className="px-3 py-1.5 bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)]/10 border border-[var(--border-color)] rounded-full text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all whitespace-nowrap"
                  >
                    {language === 'uk' 
                      ? chip === 'Projects' ? '📁 Проекти' : chip === 'Pricing' ? '💰 Ціни' : '📧 Контакт'
                      : language === 'nl'
                      ? chip === 'Projects' ? '📁 Projecten' : chip === 'Pricing' ? '💰 Prijzen' : '📧 Contact'
                      : chip === 'Projects' ? '📁 Projects' : chip === 'Pricing' ? '💰 Pricing' : '📧 Contact'
                    }
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}