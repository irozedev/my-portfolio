import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, ArrowDown, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  action?: 'scroll' | 'open' | 'booking';
  target?: string;
  bookingData?: {
    service?: string;
    date?: string;
    time?: string;
  };
}

interface BookingState {
  isBooking: boolean;
  step: 'service' | 'datetime' | 'contact' | 'confirm' | null;
  service?: string;
  date?: string;
  time?: string;
  name?: string;
  email?: string;
}

export function AIAssistantSmart() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [bookingState, setBookingState] = useState<BookingState>({
    isBooking: false,
    step: null
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_FREE_MESSAGES = 10;
  const remainingMessages = Math.max(0, MAX_FREE_MESSAGES - messageCount);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Scroll to bottom when new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = 
        language === 'uk' ? '👋 Привіт! Я AI асистент Stepan Roze.\n\nМожу допомогти:\n✅ Показати проекти та портфоліо\n✅ Розказати про послуги та ціни\n✅ Забукати консультацію\n✅ Відповісти на запитання\n✅ Відкрити потрібну секцію сайту\n\nПросто напишіть що вас цікавить!' :
        language === 'nl' ? '👋 Hallo! Ik ben Stepan Roze AI assistent.\n\nIk kan helpen:\n✅ Projecten en portfolio tonen\n✅ Over diensten en prijzen vertellen\n✅ Consultatie boeken\n✅ Vragen beantwoorden\n✅ Naar juiste sectie gaan\n\nSchrijf gewoon wat je wilt!' :
        '👋 Hi! I\'m Stepan Roze AI assistant.\n\nI can help you:\n✅ Show projects and portfolio\n✅ Tell about services and pricing\n✅ Book a consultation\n✅ Answer your questions\n✅ Navigate to any section\n\nJust write what you need!';
      
      setMessages([{
        id: '1',
        text: welcomeText,
        isBot: true
      }]);
    }
  }, [isOpen, language]);

  // SCROLL TO SECTION WITH FLASH
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Flash effect
      section.style.transition = 'box-shadow 0.3s ease';
      section.style.boxShadow = '0 0 0 4px var(--accent-primary)';
      setTimeout(() => {
        section.style.boxShadow = '';
      }, 2000);
      
      // Auto-close chat after 1.5s
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    }
  };

  // DETECT INTENT - SMART AI UNDERSTANDING
  const detectIntent = (text: string): { action?: 'scroll' | 'open' | 'booking'; target?: string } => {
    const lower = text.toLowerCase();
    
    // BOOKING KEYWORDS
    const bookingKeywords = [
      'book', 'schedule', 'appointment', 'consultation', 'meeting', 'call',
      'бук', 'записат', 'консультац', 'зустріч', 'дзвінок', 'розмов',
      'boek', 'afspraak', 'consult', 'gesprek',
      'reserva', 'cita', 'consulta'
    ];
    
    if (bookingKeywords.some(kw => lower.includes(kw))) {
      return { action: 'booking' };
    }
    
    // PROJECTS
    const projectKeywords = ['project', 'portfolio', 'work', 'case', 'example', 'проект', 'портфоліо', 'роботи', 'приклад', 'werk', 'ejemplo'];
    if (projectKeywords.some(kw => lower.includes(kw))) {
      return { action: 'scroll', target: 'projects' };
    }
    
    // CONTACT
    const contactKeywords = ['contact', 'email', 'reach', 'touch', 'write', 'контакт', 'пошта', 'написат', 'зв\'язат'];
    if (contactKeywords.some(kw => lower.includes(kw))) {
      return { action: 'scroll', target: 'contact' };
    }
    
    // ABOUT
    const aboutKeywords = ['about', 'who', 'bio', 'background', 'про', 'хто', 'біографія', 'over'];
    if (aboutKeywords.some(kw => lower.includes(kw))) {
      return { action: 'scroll', target: 'about' };
    }
    
    // EXPERIENCE
    const expKeywords = ['experience', 'career', 'history', 'досвід', 'кар\'єра', 'історія', 'ervaring'];
    if (expKeywords.some(kw => lower.includes(kw))) {
      return { action: 'scroll', target: 'experience' };
    }
    
    // SERVICES/PRICING
    const serviceKeywords = ['service', 'price', 'cost', 'offer', 'rate', 'послуг', 'ціна', 'вартість', 'діенст', 'prijs', 'precio'];
    if (serviceKeywords.some(kw => lower.includes(kw))) {
      return { action: 'scroll', target: 'services' };
    }
    
    // HERO/TOP
    const topKeywords = ['top', 'hero', 'start', 'beginning', 'home', 'початок', 'вгору', 'головна', 'boven', 'inicio'];
    if (topKeywords.some(kw => lower.includes(kw))) {
      return { action: 'scroll', target: 'hero' };
    }
    
    return {};
  };

  // GET AI RESPONSE FROM API
  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const { projectId, publicAnonKey } = await import('/utils/supabase/info');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7/ai/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            message: userMessage,
            language: language === 'uk' ? 'Ukrainian' : language === 'nl' ? 'Dutch' : language === 'ar' ? 'Arabic' : language === 'es' ? 'Spanish' : 'English',
            context: bookingState.isBooking ? 'booking_flow' : 'general_help'
          })
        }
      );

      if (!response.ok) {
        throw new Error('API failed');
      }

      const data = await response.json();
      return data.message || data.response || getFallbackResponse(userMessage);
      
    } catch (error) {
      console.error('[AI Error]', error);
      return getFallbackResponse(userMessage);
    }
  };

  // FALLBACK RESPONSES
  const getFallbackResponse = (text: string): string => {
    const lower = text.toLowerCase();
    
    // BOOKING
    if (lower.includes('book') || lower.includes('бук') || lower.includes('записат')) {
      return language === 'uk'
        ? '📅 Чудово! Давайте заплануємо консультацію.\n\nОберіть послугу:\n1️⃣ Лендінг (€800-€1,500)\n2️⃣ Веб-додаток (€3,000-€8,000)\n3️⃣ E-commerce (€5,000-€12,000)\n4️⃣ Безкоштовна консультація (30 хв)\n\nНапишіть номер або назву послуги!'
        : language === 'nl'
        ? '📅 Geweldig! Laten we een consult plannen.\n\nKies een dienst:\n1️⃣ Landing (€800-€1,500)\n2️⃣ Web app (€3,000-€8,000)\n3️⃣ E-commerce (€5,000-€12,000)\n4️⃣ Gratis consult (30 min)\n\nSchrijf nummer of naam!'
        : '📅 Great! Let\'s schedule a consultation.\n\nChoose a service:\n1️⃣ Landing Page (€800-€1,500)\n2️⃣ Web Application (€3,000-€8,000)\n3️⃣ E-commerce (€5,000-€12,000)\n4️⃣ Free Consultation (30 min)\n\nWrite number or service name!';
    }
    
    // PROJECTS
    if (lower.includes('project') || lower.includes('проект') || lower.includes('work')) {
      return language === 'uk'
        ? '🚀 У моєму портфоліо:\n\n• AI SaaS платформи\n• E-commerce рішення\n• Корпоративні веб-додатки\n• Landing pages\n• CMS системи\n\nПрокручую до секції проектів! 👇'
        : language === 'nl'
        ? '🚀 In mijn portfolio:\n\n• AI SaaS platforms\n• E-commerce oplossingen\n• Zakelijke web apps\n• Landing pages\n• CMS systemen\n\nScrollen naar projecten! 👇'
        : '🚀 In my portfolio:\n\n• AI SaaS platforms\n• E-commerce solutions\n• Corporate web apps\n• Landing pages\n• CMS systems\n\nScrolling to projects section! 👇';
    }
    
    // PRICING
    if (lower.includes('price') || lower.includes('cost') || lower.includes('ціна') || lower.includes('вартість')) {
      return language === 'uk'
        ? '💰 Мої ціни:\n\n🔹 Лендінг: €800-€1,500 (1-2 тижні)\n🔹 Веб-додаток: €3,000-€8,000 (4-8 тижнів)\n🔹 E-commerce: €5,000-€12,000 (6-12 тижнів)\n🔹 Консалтинг: €60-€90/год\n\nБажаєте забукати консультацію? 📅'
        : language === 'nl'
        ? '💰 Mijn prijzen:\n\n🔹 Landing: €800-€1,500 (1-2 weken)\n🔹 Web app: €3,000-€8,000 (4-8 weken)\n🔹 E-commerce: €5,000-€12,000 (6-12 weken)\n🔹 Consulting: €60-€90/uur\n\nWil je een consult boeken? 📅'
        : '💰 My pricing:\n\n🔹 Landing Page: €800-€1,500 (1-2 weeks)\n🔹 Web App: €3,000-€8,000 (4-8 weeks)\n🔹 E-commerce: €5,000-€12,000 (6-12 weeks)\n🔹 Consulting: €60-€90/hour\n\nWant to book a consultation? 📅';
    }
    
    // SKILLS
    if (lower.includes('skill') || lower.includes('tech') || lower.includes('навичк') || lower.includes('технолог')) {
      return language === 'uk'
        ? '💻 Мій tech stack:\n\n⭐ Expert:\n• React (95%) - 5+ років\n• JavaScript (98%) - native знання\n• Tailwind CSS (92%)\n\n🔥 Advanced:\n• Vue.js (90%)\n• TypeScript (85%)\n• Node.js (80%)\n• Magento (88%)\n\nТакож працюю з MongoDB, PostgreSQL, Supabase, AWS!'
        : language === 'nl'
        ? '💻 Mijn tech stack:\n\n⭐ Expert:\n• React (95%) - 5+ jaar\n• JavaScript (98%) - native kennis\n• Tailwind CSS (92%)\n\n🔥 Advanced:\n• Vue.js (90%)\n• TypeScript (85%)\n• Node.js (80%)\n• Magento (88%)\n\nOok werk ik met MongoDB, PostgreSQL, Supabase, AWS!'
        : '💻 My tech stack:\n\n⭐ Expert:\n• React (95%) - 5+ years\n• JavaScript (98%) - native knowledge\n• Tailwind CSS (92%)\n\n🔥 Advanced:\n• Vue.js (90%)\n• TypeScript (85%)\n• Node.js (80%)\n• Magento (88%)\n\nAlso work with MongoDB, PostgreSQL, Supabase, AWS!';
    }
    
    // CONTACT
    if (lower.includes('contact') || lower.includes('email') || lower.includes('контакт')) {
      return language === 'uk'
        ? '📧 Зв\'яжіться зі мною:\n\n• Email: stepan@roze.live\n• LinkedIn: /in/stepanroze\n• GitHub: /stepanroze\n\nАбо заповніть форму - прокручую до контактів! 📬'
        : language === 'nl'
        ? '📧 Neem contact op:\n\n• Email: stepan@roze.live\n• LinkedIn: /in/stepanroze\n• GitHub: /stepanroze\n\nOf vul het formulier in - scrollen naar contact! 📬'
        : '📧 Get in touch:\n\n• Email: stepan@roze.live\n• LinkedIn: /in/stepanroze\n• GitHub: /stepanroze\n\nOr fill the form - scrolling to contacts! 📬';
    }
    
    // DEFAULT - HELPFUL
    return language === 'uk'
      ? '🤔 Цікаве питання! Я можу:\n\n📂 Показати проекти\n💰 Розказати про ціни\n📅 Забукати консультацію\n💻 Описати навички\n📧 Відкрити контакти\n\nНапишіть що саме вас цікавить, і я допоможу!'
      : language === 'nl'
      ? '🤔 Interessante vraag! Ik kan:\n\n📂 Projecten tonen\n💰 Over prijzen vertellen\n📅 Consult boeken\n💻 Skills beschrijven\n📧 Contact openen\n\nSchrijf wat je wilt en ik help je!'
      : '🤔 Interesting question! I can:\n\n📂 Show projects\n💰 Tell about pricing\n📅 Book consultation\n💻 Describe skills\n📧 Open contacts\n\nWrite what interests you and I\'ll help!';
  };

  // START BOOKING FLOW
  const startBooking = () => {
    setBookingState({
      isBooking: true,
      step: 'service'
    });
    
    const bookingMsg: Message = {
      id: Date.now().toString(),
      text: language === 'uk'
        ? '📅 Чудово! Давайте заплануємо консультацію.\n\nОберіть послугу:\n1️⃣ Лендінг (€800-€1,500)\n2️⃣ Веб-додаток (€3,000-€8,000)\n3️⃣ E-commerce (€5,000-€12,000)\n4️⃣ Безкоштовна консультація (30 хв)\n\nНапишіть номер або назву!'
        : language === 'nl'
        ? '📅 Geweldig! Laten we plannen.\n\nKies dienst:\n1️⃣ Landing (€800-€1,500)\n2️⃣ Web app (€3,000-€8,000)\n3️⃣ E-commerce (€5,000-€12,000)\n4️⃣ Gratis consult (30 min)\n\nSchrijf nummer of naam!'
        : '📅 Great! Let\'s schedule.\n\nChoose service:\n1️⃣ Landing (€800-€1,500)\n2️⃣ Web App (€3,000-€8,000)\n3️⃣ E-commerce (€5,000-€12,000)\n4️⃣ Free Consultation (30 min)\n\nWrite number or name!',
      isBot: true,
      action: 'booking'
    };
    
    setMessages(prev => [...prev, bookingMsg]);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    // Check message limit
    if (messageCount >= MAX_FREE_MESSAGES) {
      const limitMsg: Message = {
        id: Date.now().toString(),
        text: language === 'uk'
          ? '⚠️ Ви досягли ліміту безкоштовних повідомлень (10).\n\nДля продовження роботи з AI, будь ласка:\n• Заповніть форму контактів\n• Або напишіть на stepan@roze.live\n\nЯ з радістю допоможу вам особисто! 🚀'
          : language === 'nl'
          ? '⚠️ Je hebt de limiet van gratis berichten bereikt (10).\n\nOm door te gaan met AI:\n• Vul contactformulier in\n• Of email stepan@roze.live\n\nIk help je graag persoonlijk! 🚀'
          : '⚠️ You\'ve reached the free message limit (10).\n\nTo continue with AI:\n• Fill contact form\n• Or email stepan@roze.live\n\nI\'ll be happy to help you personally! 🚀',
        isBot: true
      };
      setMessages(prev => [...prev, limitMsg]);
      return;
    }

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: trimmed,
      isBot: false
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setMessageCount(prev => prev + 1);

    // Detect intent
    const intent = detectIntent(trimmed);

    // Handle booking flow
    if (intent.action === 'booking' && !bookingState.isBooking) {
      setIsTyping(false);
      startBooking();
      return;
    }

    try {
      // Get AI response
      const responseText = await getAIResponse(trimmed);
      
      // Add bot message
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isBot: true,
        action: intent.action,
        target: intent.target
      };
      setMessages(prev => [...prev, botMsg]);
      
      // Execute action
      if (intent.action === 'scroll' && intent.target) {
        setTimeout(() => {
          scrollToSection(intent.target!);
        }, 800);
      }
      
    } catch (error) {
      console.error('[Chat Error]', error);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: language === 'uk' ? '❌ Помилка. Спробуйте ще!' : language === 'nl' ? '❌ Fout. Probeer opnieuw!' : '❌ Error. Try again!',
        isBot: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isTyping) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-4 sm:right-6 z-[100] w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-full shadow-[0_0_30px_rgba(0,217,255,0.4)] flex items-center justify-center hover:shadow-[0_0_40px_rgba(0,217,255,0.6)] hover:scale-110 transition-all active:scale-95"
        aria-label="Open AI Assistant"
      >
        <Bot className="w-6 h-6 md:w-7 md:h-7 text-black" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <div
      className="fixed z-[99999] bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/30 rounded-2xl md:rounded-3xl shadow-[0_0_50px_rgba(0,217,255,0.3)] flex flex-col
        bottom-0 right-0 left-0
        md:bottom-6 md:right-6 md:left-auto md:w-[420px] md:max-w-[calc(100vw-3rem)]
        h-[100dvh] md:h-[650px] md:max-h-[calc(100vh-100px)]"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative">
            <Bot className="w-5 h-5 text-[var(--accent-primary)]" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-black text-base">Roze AI</h3>
            <p className="text-xs text-black/70 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {remainingMessages > 0 
                ? `${remainingMessages} ${language === 'uk' ? 'повідомлень' : language === 'nl' ? 'berichten' : 'messages'}`
                : language === 'uk' ? 'Ліміт' : language === 'nl' ? 'Limiet' : 'Limit reached'
              }
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-black/10 rounded-lg transition-colors active:scale-95"
          aria-label="Close chat"
        >
          <X className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl ${
                msg.isBot
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--accent-primary)]/20'
                  : 'bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black'
              }`}
            >
              <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
              {msg.action === 'scroll' && msg.target && (
                <div className="mt-2 flex items-center gap-1 text-xs opacity-70">
                  <ArrowDown className="w-3 h-3 animate-bounce" />
                  <span>
                    {language === 'uk' ? 'Прокручую...' : language === 'nl' ? 'Scrollen...' : 'Scrolling...'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[var(--bg-secondary)] border border-[var(--accent-primary)]/20 p-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)] shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'uk' 
                ? 'Напишіть повідомлення...' 
                : language === 'nl' 
                ? 'Typ een bericht...' 
                : 'Type a message...'
            }
            disabled={isTyping || messageCount >= MAX_FREE_MESSAGES}
            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontSize: '16px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping || messageCount >= MAX_FREE_MESSAGES}
            className="bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 hover:from-[var(--accent-secondary)] hover:to-cyan-500 text-black px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-mono font-bold active:scale-95 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Quick commands */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
          {[
            { 
              emoji: '📂', 
              label: language === 'uk' ? 'Проекти' : language === 'nl' ? 'Projecten' : 'Projects',
              value: language === 'uk' ? 'Покажи проекти' : language === 'nl' ? 'Toon projecten' : 'Show projects'
            },
            { 
              emoji: '💰', 
              label: language === 'uk' ? 'Ціни' : language === 'nl' ? 'Prijzen' : 'Pricing',
              value: language === 'uk' ? 'Скільки коштує' : language === 'nl' ? 'Wat zijn de prijzen' : 'What are prices'
            },
            { 
              emoji: '📅', 
              label: language === 'uk' ? 'Забукати' : language === 'nl' ? 'Boeken' : 'Book',
              value: language === 'uk' ? 'Забукати консультацію' : language === 'nl' ? 'Boek een consult' : 'Book consultation'
            },
            { 
              emoji: '📧', 
              label: language === 'uk' ? 'Контакти' : language === 'nl' ? 'Contact' : 'Contact',
              value: language === 'uk' ? 'Відкрий контакти' : language === 'nl' ? 'Open contact' : 'Open contacts'
            }
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => setInput(chip.value)}
              disabled={isTyping || messageCount >= MAX_FREE_MESSAGES}
              className="px-3 py-1.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-secondary)] whitespace-nowrap transition-colors disabled:opacity-50 active:scale-95 flex items-center gap-1.5"
            >
              <span>{chip.emoji}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
