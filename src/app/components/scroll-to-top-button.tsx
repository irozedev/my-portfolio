import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/language-context";
import { useViewMode } from "../contexts/view-mode-context";
import { lockScroll, unlockScroll } from "../../utils/scroll-lock";
import { projectId, publicAnonKey } from "@/utils/supabase/info";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasServiceContext, setHasServiceContext] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language, setLanguage } = useLanguage();
  const { isClientMode } = useViewMode();

  const MAX_REQUESTS = 8;

  const quickQuestions = [
    { emoji: "💰", text: "Estimate price", label: "Estimate price" },
    { emoji: "🚀", text: "Start project", label: "Start project" },
    { emoji: "📩", text: "Contact", label: "Contact" },
  ];

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsVisible(scrollTop > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when chat open
  useEffect(() => {
    if (isChatOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => unlockScroll();
  }, [isChatOpen]);

  // Listen for openChatBot event
  useEffect(() => {
    const handleOpenChatBot = (event: Event) => {
      const serviceName = sessionStorage.getItem('chatbotServiceName');
      const experience = sessionStorage.getItem('chatbotExperience');
      const experienceRole = sessionStorage.getItem('chatbotExperienceRole');
      const experiencePeriod = sessionStorage.getItem('chatbotExperiencePeriod');

      if (event && !serviceName && !experience) {
        setIsChatOpen(true);
        if (messages.length === 0) {
          setMessages([{
            id: Date.now(),
            text: `Hey 👋\nI can estimate your project price & timeline in seconds.\nWhat do you want to build?`,
            sender: "bot",
            timestamp: new Date(),
          }]);
        }
        return;
      }

      if (serviceName) {
        setHasServiceContext(true);
        setIsChatOpen(true);
        setTimeout(() => {
          setMessages([{
            id: Date.now(),
            text: `👋 Hi! I see you're interested in **${serviceName}**.\n\nI can help you with:\n• 💰 Get a price estimate\n• ⏱️ Timeline & delivery\n• 🛠️ Technical details\n• 🚀 Start the project\n\nWhat would you like to know?`,
            sender: "bot",
            timestamp: new Date(),
          }]);
          sessionStorage.removeItem('chatbotService');
          sessionStorage.removeItem('chatbotServiceName');
        }, 300);
      } else if (experience) {
        setHasServiceContext(true);
        setIsChatOpen(true);
        setTimeout(() => {
          setMessages([{
            id: Date.now(),
            text: `👋 Hi! I noticed you're interested in my work at ${experience} as ${experienceRole} (${experiencePeriod}).\n\nI'd be happy to share more details about:\n• 🚀 Projects I worked on\n• 🛠️ Technologies I used\n• 📈 Challenges I solved\n\nWhat would you like to know?`,
            sender: "bot",
            timestamp: new Date(),
          }]);
          sessionStorage.removeItem('chatbotExperience');
          sessionStorage.removeItem('chatbotExperienceRole');
          sessionStorage.removeItem('chatbotExperiencePeriod');
        }, 300);
      }
    };

    window.addEventListener('openChatBot', handleOpenChatBot);
    return () => window.removeEventListener('openChatBot', handleOpenChatBot);
  }, [messages.length]);

  // Default welcome message
  useEffect(() => {
    if (isChatOpen && messages.length === 0 && !hasServiceContext) {
      setTimeout(() => {
        setMessages([{
          id: Date.now(),
          text: `👋 Hey there! I'm Roze Bot — Stepan's AI assistant.\n\nI can help you with:\n💰 Project rates & pricing\n🛠️ Technical skills & expertise\n🚀 Portfolio & past projects\n⏰ Availability & timelines\n📧 Contact information\n\nWhat would you like to know? 👇`,
          sender: "bot",
          timestamp: new Date(),
        }]);
        setShowQuickQuestions(true);
      }, 500);
    }
  }, [isChatOpen, messages.length, hasServiceContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Detect language
  const detectLanguage = (text: string): string => {
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/[а-яёіїєґА-ЯЁІЇЄҐ]/.test(text)) return 'uk';
    if (/\b(hallo|hoi|dank|graag|bent|heeft|waar|wat|wanneer|hoe|waarom)\b/i.test(text)) return 'nl';
    if (/\b(hola|gracias|cómo|qué|dónde|cuándo|buenos días)\b/i.test(text)) return 'es';
    return 'en';
  };

  const handleSend = (overrideMessage?: string) => {
    const messageToSend = overrideMessage || inputValue;
    if (!messageToSend || !messageToSend.trim()) return;
    const trimmedValue = messageToSend.trim();

    const detectedLang = detectLanguage(trimmedValue);
    if (detectedLang !== language && ['en', 'uk', 'nl', 'ar', 'es'].includes(detectedLang)) {
      setLanguage(detectedLang as any);
    }

    setRequestCount(prev => prev + 1);

    const userMessage: Message = {
      id: Date.now(),
      text: messageToSend,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    if (requestCount >= MAX_REQUESTS) {
      setIsRateLimited(true);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "You've reached the message limit. Please contact me directly at stepan@roze.live",
        sender: "bot",
        timestamp: new Date(),
      }]);
      return;
    }

    setIsTyping(true);
    setShowQuickQuestions(false);

    const userLanguage = language === 'uk' ? 'Ukrainian' :
      language === 'nl' ? 'Dutch' :
      language === 'ar' ? 'Arabic' :
      language === 'es' ? 'Spanish' : 'English';

    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a62f57c7/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({
        message: trimmedValue,
        context: hasServiceContext ? 'service_selected' : 'general',
        language: userLanguage
      })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API request failed');
      return data;
    })
    .then(data => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.message || 'Sorry, I encountered an error.',
        sender: "bot",
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    })
    .catch(error => {
      console.error('AI Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "⚠️ AI service temporarily unavailable. Please email stepan@roze.live directly.",
        sender: "bot",
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99989]"
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] h-[calc(100dvh-120px)] sm:h-[600px] max-h-[700px] bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/50 rounded-2xl shadow-[0_0_60px_rgba(0,217,255,0.3)] z-[99990] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center">
                      <Bot className="w-6 h-6 text-[var(--accent-primary)]" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-sm">Roze AI Assistant</h3>
                    <p className="text-[10px] text-black/60 font-mono">POWERED BY CLAUDE • ONLINE</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-black/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--bg-secondary)]/20">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.sender === "user"
                        ? "bg-gradient-to-br from-[var(--accent-primary)] to-cyan-400"
                        : "bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                    }`}>
                      {message.sender === "user" ? (
                        <User className="w-3.5 h-3.5 text-black" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      )}
                    </div>
                    <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black"
                        : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]"
                    }`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}>
                      <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                        {message.text}
                      </p>
                      <p className={`text-[10px] mt-1 ${
                        message.sender === "user" ? "text-black/50" : "text-[var(--text-muted)]"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                      <Bot className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    </div>
                    <div className="rounded-xl px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                      <div className="flex gap-1">
                        {[0, 0.15, 0.3].map((delay, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-[var(--accent-primary)] rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length <= 1 && showQuickQuestions && (
                <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
                  <div className="flex gap-2">
                    {quickQuestions.map((q) => (
                      <button
                        key={q.label}
                        onClick={() => {
                          setShowQuickQuestions(false);
                          handleSend(q.text);
                        }}
                        className="flex-1 text-xs px-2 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)]/10 border border-[var(--border-color)] hover:border-[var(--accent-primary)]/30 rounded-lg transition-all font-medium"
                      >
                        {q.emoji} {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-primary)] flex-shrink-0">
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
                    placeholder="Ask about services, pricing, skills..."
                    className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/30 text-sm"
                    disabled={isRateLimited}
                  />
                  <motion.button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isRateLimited}
                    className="px-4 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 text-black rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-[9px] text-[var(--text-muted)] text-center mt-1.5 font-mono">
                  AI-powered by Claude • {MAX_REQUESTS - requestCount} messages left
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-[9900] flex flex-col gap-3 items-center">
        {/* Scroll to Top with Progress Ring */}
        <AnimatePresence>
          {isVisible && (
            <motion.button
              onClick={scrollToTop}
              className="relative w-12 h-12 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-2 border-[var(--accent-primary)]/40 rounded-full flex items-center justify-center shadow-lg hover:border-[var(--accent-primary)] hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all group"
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to top"
            >
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(0,217,255,0.15)" strokeWidth="2" />
                <circle
                  cx="24" cy="24" r="22" fill="none"
                  stroke="#00d9ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200"
                />
              </svg>

              <ArrowUp className="w-5 h-5 text-[var(--accent-primary)] group-hover:text-[var(--accent-primary)] relative z-10" strokeWidth={2.5} />

              {/* Progress percentage on hover */}
              <div className="absolute -left-12 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-[var(--accent-primary)] bg-[var(--bg-primary)]/90 border border-[var(--border-color)] rounded px-1.5 py-0.5 pointer-events-none">
                {Math.round(scrollProgress)}%
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Bot Button - only in client mode */}
        {isClientMode && (
          <motion.button
            id="chat-bot-button"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="relative w-14 h-14 bg-gradient-to-br from-[var(--accent-primary)] to-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,217,255,0.4)] hover:shadow-[0_0_40px_rgba(0,217,255,0.6)] transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <AnimatePresence mode="wait">
              {isChatOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X className="w-6 h-6 text-black" />
                </motion.div>
              ) : (
                <motion.div key="open" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <MessageCircle className="w-6 h-6 text-black" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notification Badge */}
            {!isChatOpen && messages.length === 0 && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2 }}
              >
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  1
                </motion.span>
              </motion.div>
            )}

            {/* Pulse */}
            <motion.div
              className="absolute inset-0 rounded-full bg-[var(--accent-primary)]"
              animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </div>
    </>
  );
}