import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, MessageCircle } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

export function AIAssistantSimple() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom when new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = 
        language === 'uk' ? '👋 Привіт! Я AI асистент Stepan Roze. Чим можу допомогти?' :
        language === 'nl' ? '👋 Hallo! Ik ben Stepan Roze AI assistent. Waarmee kan ik helpen?' :
        '👋 Hi! I\'m Stepan Roze AI assistant. How can I help you?';
      
      setMessages([{
        id: '1',
        text: welcomeText,
        isBot: true
      }]);
    }
  }, [isOpen, language]);

  const getResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase();
    
    // Projects
    if (lower.includes('project') || lower.includes('проект') || lower.includes('portfolio')) {
      return language === 'uk' 
        ? '🚀 У моєму портфоліо є AI SaaS платформи, E-commerce рішення, та веб-додатки. Прокрутіть до секції "Projects" щоб побачити більше!'
        : language === 'nl'
        ? '🚀 In mijn portfolio zijn AI SaaS platforms, E-commerce oplossingen en web apps. Scroll naar "Projects" sectie voor meer!'
        : '🚀 My portfolio includes AI SaaS platforms, E-commerce solutions, and web apps. Scroll to "Projects" section to see more!';
    }
    
    // Pricing
    if (lower.includes('price') || lower.includes('cost') || lower.includes('ціна') || lower.includes('коштує') || lower.includes('prijs')) {
      return language === 'uk'
        ? '💰 Ціни:\n• Лендінг: €800-€1,500\n• Веб-додаток: €3,000-€8,000\n• E-commerce: €5,000-€12,000\n• Консалтинг: €60-€90/год'
        : language === 'nl'
        ? '💰 Prijzen:\n• Landing: €800-€1,500\n• Web app: €3,000-€8,000\n• E-commerce: €5,000-€12,000\n• Consulting: €60-€90/uur'
        : '💰 Pricing:\n• Landing Page: €800-€1,500\n• Web App: €3,000-€8,000\n• E-commerce: €5,000-€12,000\n• Consulting: €60-€90/hour';
    }
    
    // Contact
    if (lower.includes('contact') || lower.includes('email') || lower.includes('зв\'язатися') || lower.includes('контакт')) {
      return language === 'uk'
        ? '📧 Зв\'яжіться зі мною:\n• Email: stepan@roze.live\n• Або заповніть форму в секції "Contact"!'
        : language === 'nl'
        ? '📧 Neem contact op:\n• Email: stepan@roze.live\n• Of vul het formulier in bij "Contact"!'
        : '📧 Get in touch:\n• Email: stepan@roze.live\n• Or fill the form in "Contact" section!';
    }
    
    // Skills
    if (lower.includes('skill') || lower.includes('tech') || lower.includes('навички') || lower.includes('технології')) {
      return language === 'uk'
        ? '💻 Мої технології:\n• React (95%)\n• JavaScript (98%)\n• TypeScript (85%)\n• Vue.js (90%)\n• Tailwind CSS (92%)\n• Node.js (80%)'
        : language === 'nl'
        ? '💻 Mijn technologieën:\n• React (95%)\n• JavaScript (98%)\n• TypeScript (85%)\n• Vue.js (90%)\n• Tailwind CSS (92%)\n• Node.js (80%)'
        : '💻 My tech stack:\n• React (95%)\n• JavaScript (98%)\n• TypeScript (85%)\n• Vue.js (90%)\n• Tailwind CSS (92%)\n• Node.js (80%)';
    }
    
    // Experience
    if (lower.includes('experience') || lower.includes('досвід') || lower.includes('ervaring')) {
      return language === 'uk'
        ? '👨‍💼 Маю 5+ років досвіду в Full-Stack розробці, працював з React, Vue.js, Node.js та багато іншого!'
        : language === 'nl'
        ? '👨‍💼 Ik heb 5+ jaar ervaring in Full-Stack development, gewerkt met React, Vue.js, Node.js en meer!'
        : '👨‍💼 I have 5+ years of Full-Stack development experience, worked with React, Vue.js, Node.js and more!';
    }

    // Default
    return language === 'uk'
      ? '🤔 Цікаве питання! Спитайте мене про:\n• Проекти\n• Ціни\n• Навички\n• Контакти\n\nАбо прокрутіть сайт щоб дізнатися більше!'
      : language === 'nl'
      ? '🤔 Interessante vraag! Vraag me over:\n• Projecten\n• Prijzen\n• Vaardigheden\n• Contact\n\nOf scroll door de site voor meer info!'
      : '🤔 Interesting question! Ask me about:\n• Projects\n• Pricing\n• Skills\n• Contact\n\nOr scroll through the site to learn more!';
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: trimmed,
      isBot: false
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(trimmed),
        isBot: true
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-4 sm:right-6 z-[100] w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Open AI Assistant"
      >
        <Bot className="w-6 h-6 md:w-7 md:h-7 text-black" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </button>
    );
  }

  return (
    <div
      className="fixed z-[99999] bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/30 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col
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
            <p className="text-xs text-black/70">
              {language === 'uk' ? 'Онлайн' : language === 'nl' ? 'Online' : 'Online'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-black/10 rounded-lg transition-colors"
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
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.isBot
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                  : 'bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[var(--bg-secondary)] p-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all text-base"
            style={{ fontSize: '16px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 hover:from-[var(--accent-secondary)] hover:to-cyan-500 text-black px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-mono font-bold"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Quick chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {[
            language === 'uk' ? 'Проекти' : language === 'nl' ? 'Projecten' : 'Projects',
            language === 'uk' ? 'Ціни' : language === 'nl' ? 'Prijzen' : 'Pricing',
            language === 'uk' ? 'Контакти' : language === 'nl' ? 'Contact' : 'Contact'
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => setInput(chip)}
              className="px-3 py-1.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-secondary)] whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
