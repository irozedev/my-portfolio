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

// Smart local fallback — keeps the chat useful (with current pricing, stack,
// availability and contact) whenever the AI backend is unavailable or returns
// its generic fallback (e.g. ANTHROPIC_API_KEY not configured on Supabase).
function localAnswer(input: string, language: string): string {
  const s = input.toLowerCase();
  const L = (en: string, uk: string, nl: string, ar: string, es: string) =>
    language === "uk" ? uk : language === "nl" ? nl : language === "ar" ? ar : language === "es" ? es : en;

  if (/(^|\b)(hi|hello|hey|прив|hallo|hoi|hola|مرحبا|salut)/.test(s))
    return L(
      "Hi! 👋 I can help with pricing, timelines, my stack, availability or contact. What do you need?",
      "Привіт! 👋 Допоможу з цінами, строками, стеком, доступністю чи контактами. Що цікавить?",
      "Hoi! 👋 Ik help met prijzen, planning, stack, beschikbaarheid of contact. Wat heb je nodig?",
      "مرحباً! 👋 أساعدك في الأسعار، المدة، الأدوات، التوفر أو التواصل. ماذا تريد؟",
      "¡Hola! 👋 Puedo ayudarte con precios, plazos, stack, disponibilidad o contacto. ¿Qué necesitas?",
    );

  if (/(price|cost|rate|budget|pricing|quote|how much|цін|цена|скільки|prijs|kost|precio|cuánto|سعر|كم)/.test(s))
    return L(
      "💶 Starting prices (no VAT — small-business scheme):\n• Landing page — from €650\n• Website 4–6 pages — €1,500–2,500\n• Telegram bot — from €350\n• Automation — €45/h\n• Web app / dashboard — €60/h\n• E-commerce — from €1,200\n• Consulting — €55/h\n\nTell me what you need and I'll narrow it down.",
      "💶 Стартові ціни (без ПДВ — спецрежим):\n• Лендінг — від €650\n• Сайт 4–6 стор. — €1 500–2 500\n• Telegram-бот — від €350\n• Автоматизація — €45/год\n• Веб-застосунок — €60/год\n• E-commerce — від €1 200\n• Консалтинг — €55/год\n\nОпишіть задачу — уточню.",
      "💶 Vanafprijzen (geen btw — vrijstellingsregeling):\n• Landingspagina — vanaf €650\n• Website 4–6 pagina's — €1.500–2.500\n• Telegram-bot — vanaf €350\n• Automatisering — €45/u\n• Webapp — €60/u\n• E-commerce — vanaf €1.200\n• Consulting — €55/u\n\nVertel wat je nodig hebt.",
      "💶 أسعار البداية (بدون ضريبة — نظام المنشآت الصغيرة):\n• صفحة هبوط — من €650\n• موقع 4–6 صفحات — €1,500–2,500\n• بوت تيليجرام — من €350\n• أتمتة — €45/س\n• تطبيق ويب — €60/س\n• متجر — من €1,200\n• استشارة — €55/س\n\nأخبرني بما تحتاج.",
      "💶 Precios iniciales (sin IVA — régimen de pequeñas empresas):\n• Landing — desde €650\n• Web 4–6 páginas — €1.500–2.500\n• Bot de Telegram — desde €350\n• Automatización — €45/h\n• Web app — €60/h\n• E-commerce — desde €1.200\n• Consultoría — €55/h\n\nCuéntame qué necesitas.",
    );

  if (/(time|timeline|how long|deadline|deliver|строк|термін|скільки часу|termijn|hoelang|plazo|cuánto tiempo|مدة|وقت)/.test(s))
    return L(
      "⏱ Realistic timelines (I build mornings, ~20h/week):\n• Landing — 1–1.5 weeks\n• Website 4–6 pages — 2.5–3.5 weeks\n• Telegram bot — ~1 week\n• Automation — 3–5 mornings\n• Web app (MVP) — 4–6 weeks\n• E-commerce — 3–5 weeks",
      "⏱ Реальні строки (працюю зранку, ~20 год/тиждень):\n• Лендінг — 1–1.5 тижня\n• Сайт 4–6 стор. — 2.5–3.5 тижня\n• Бот — ~1 тиждень\n• Автоматизація — 3–5 ранків\n• Веб-застосунок (MVP) — 4–6 тижнів\n• E-commerce — 3–5 тижнів",
      "⏱ Realistische planning (ik bouw 's ochtends, ~20u/week):\n• Landing — 1–1.5 week\n• Website 4–6 pagina's — 2.5–3.5 week\n• Bot — ~1 week\n• Automatisering — 3–5 ochtenden\n• Webapp (MVP) — 4–6 weken\n• E-commerce — 3–5 weken",
      "⏱ مواعيد واقعية (أعمل صباحاً، ~20 ساعة/أسبوع):\n• صفحة هبوط — 1–1.5 أسبوع\n• موقع 4–6 صفحات — 2.5–3.5 أسبوع\n• بوت — ~أسبوع\n• أتمتة — 3–5 صباحات\n• تطبيق (MVP) — 4–6 أسابيع\n• متجر — 3–5 أسابيع",
      "⏱ Plazos realistas (trabajo por las mañanas, ~20h/semana):\n• Landing — 1–1.5 semanas\n• Web 4–6 páginas — 2.5–3.5 semanas\n• Bot — ~1 semana\n• Automatización — 3–5 mañanas\n• Web app (MVP) — 4–6 semanas\n• E-commerce — 3–5 semanas",
    );

  if (/(available|availability|when.*(free|start)|hire|busy|доступ|коли|beschikbaar|wanneer|disponible|cuándo|متاح|متوفر)/.test(s))
    return L(
      "🌅 I work on projects every morning, 06:00–12:00 CET (I have a main job too). I reply within the day and take only 1–2 projects at a time, so yours gets real attention.",
      "🌅 Працюю над проектами щоранку, 06:00–12:00 CET (є й основна робота). Відповідаю того ж дня, беру лише 1–2 проекти водночас.",
      "🌅 Ik werk elke ochtend aan projecten, 06:00–12:00 CET (ik heb ook een hoofdbaan). Ik reageer binnen de dag en neem 1–2 projecten tegelijk.",
      "🌅 أعمل على المشاريع كل صباح، 06:00–12:00 بتوقيت وسط أوروبا. أرد خلال اليوم وأتولى مشروعين فقط في المرة.",
      "🌅 Trabajo en proyectos cada mañana, 06:00–12:00 CET (también tengo trabajo principal). Respondo el mismo día y tomo solo 1–2 proyectos a la vez.",
    );

  if (/(contact|email|reach|mail|write|telegram|контакт|звʼяз|звяз|пошта|contacto|correo|تواصل|بريد)/.test(s))
    return L(
      "📧 Best way to reach me:\n• Email: rozedev095@gmail.com\n• GitHub: github.com/irozedev\n• LinkedIn: linkedin.com/in/rozestepan\n\nOr use the contact form below — I reply within the day.",
      "📧 Найкраще звʼязатися:\n• Email: rozedev095@gmail.com\n• GitHub: github.com/irozedev\n• LinkedIn: linkedin.com/in/rozestepan\n\nАбо форма нижче — відповідаю того ж дня.",
      "📧 Zo bereik je me:\n• E-mail: rozedev095@gmail.com\n• GitHub: github.com/irozedev\n• LinkedIn: linkedin.com/in/rozestepan\n\nOf het formulier hieronder — ik reageer binnen de dag.",
      "📧 أفضل طريقة للتواصل:\n• البريد: rozedev095@gmail.com\n• GitHub: github.com/irozedev\n• LinkedIn: linkedin.com/in/rozestepan\n\nأو نموذج التواصل أدناه.",
      "📧 Mejor forma de contactarme:\n• Email: rozedev095@gmail.com\n• GitHub: github.com/irozedev\n• LinkedIn: linkedin.com/in/rozestepan\n\nO el formulario de abajo — respondo el mismo día.",
    );

  if (/(skill|tech|stack|experience|expertise|react|vue|next|typescript|magento|навич|досвід|стек|ervaring|vaardig|habilidad|experiencia|خبرة|مهارات)/.test(s))
    return L(
      "🛠 8+ years, front-end / JavaScript. Stack: React, Vue, Next.js, TypeScript, Node.js, Magento. Built e-commerce (childrensalon.com, vogacloset.com) and banking systems (Oschadbank CRM). Based in Belgium.",
      "🛠 8+ років, front-end / JavaScript. Стек: React, Vue, Next.js, TypeScript, Node.js, Magento. E-commerce (childrensalon.com, vogacloset.com) та банкінг (CRM Ощадбанку). Бельгія.",
      "🛠 8+ jaar, front-end / JavaScript. Stack: React, Vue, Next.js, TypeScript, Node.js, Magento. E-commerce (childrensalon.com, vogacloset.com) en banksystemen (Oschadbank). België.",
      "🛠 خبرة 8+ سنوات، Front-End / JavaScript. الأدوات: React, Vue, Next.js, TypeScript, Node.js, Magento. تجارة إلكترونية وأنظمة مصرفية. مقيم في بلجيكا.",
      "🛠 8+ años, front-end / JavaScript. Stack: React, Vue, Next.js, TypeScript, Node.js, Magento. E-commerce (childrensalon.com, vogacloset.com) y banca (Oschadbank). En Bélgica.",
    );

  if (/(start|begin|hire|work with|project|почати|проект|starten|beginnen|empezar|proyecto|بدء|مشروع)/.test(s))
    return L(
      "🚀 Great! Tell me briefly: what you want to build, rough budget and deadline. Then email rozedev095@gmail.com or use the form below — I'll send a fixed quote + timeline.",
      "🚀 Чудово! Коротко: що потрібно, орієнтовний бюджет і дедлайн. Пишіть на rozedev095@gmail.com або форму нижче — надішлю фікс-ціну + строки.",
      "🚀 Top! Vertel kort: wat je wil bouwen, budget en deadline. Mail rozedev095@gmail.com of gebruik het formulier — je krijgt een vaste offerte + planning.",
      "🚀 رائع! أخبرني باختصار: ما تريد بناءه، الميزانية والموعد. راسلني على rozedev095@gmail.com أو عبر النموذج، وسأرسل عرضاً ثابتاً + جدولاً.",
      "🚀 ¡Genial! Cuéntame: qué quieres construir, presupuesto y plazo. Escribe a rozedev095@gmail.com o usa el formulario y te envío presupuesto fijo + plazo.",
    );

  return L(
    "I can help with pricing, timelines, my stack, availability or how to start. Ask away — or email rozedev095@gmail.com directly.",
    "Допоможу з цінами, строками, стеком, доступністю чи стартом. Питайте — або пишіть на rozedev095@gmail.com.",
    "Ik help met prijzen, planning, stack, beschikbaarheid of hoe te starten. Vraag maar — of mail rozedev095@gmail.com.",
    "أساعدك في الأسعار، المدة، الأدوات، التوفر أو كيفية البدء. اسأل — أو راسل rozedev095@gmail.com.",
    "Puedo ayudarte con precios, plazos, stack, disponibilidad o cómo empezar. Pregunta — o escribe a rozedev095@gmail.com.",
  );
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
  const rafRef = useRef<number>(0);

  const MAX_REQUESTS = 8;

  const quickQuestions = [
    { emoji: "💰", text: language === 'uk' ? "Оцінити ціну" : language === 'nl' ? "Prijs schatten" : language === 'ar' ? "تقدير السعر" : language === 'es' ? "Estimar precio" : "Estimate price", label: language === 'uk' ? "Ціна" : language === 'nl' ? "Prijs" : language === 'ar' ? "السعر" : language === 'es' ? "Precio" : "Price" },
    { emoji: "🚀", text: language === 'uk' ? "Почати проект" : language === 'nl' ? "Start project" : language === 'ar' ? "بدء مشروع" : language === 'es' ? "Iniciar proyecto" : "Start project", label: language === 'uk' ? "Старт" : language === 'nl' ? "Start" : language === 'ar' ? "بدء" : language === 'es' ? "Inicio" : "Start" },
    { emoji: "📩", text: language === 'uk' ? "Контакт" : language === 'nl' ? "Contact" : language === 'ar' ? "تواصل" : language === 'es' ? "Contacto" : "Contact", label: language === 'uk' ? "Контакт" : language === 'nl' ? "Contact" : language === 'ar' ? "تواصل" : language === 'es' ? "Contacto" : "Contact" },
  ];

  // Scroll tracking - optimized with rAF
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          setScrollProgress(progress);
          setIsVisible(scrollTop > 200);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
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
      const welcomeMessages: Record<string, string> = {
        en: "👋 Hey there! I'm Roze Bot — Stepan's AI assistant.\n\nI can help you with:\n💰 Project rates & pricing\n🛠️ Technical skills & expertise\n🚀 Portfolio & past projects\n⏰ Availability & timelines\n📧 Contact information\n\nWhat would you like to know? 👇",
        uk: "👋 Привіт! Я Roze Bot — AI асистент Степана.\n\nМожу допомогти з:\n💰 Ціни та тарифи\n🛠️ Технічні навички\n🚀 Портфоліо та проекти\n⏰ Доступність та терміни\n📧 Контактна інформація\n\nЩо вас цікавить? 👇",
        nl: "👋 Hallo! Ik ben Roze Bot — Stepan's AI-assistent.\n\nIk kan helpen met:\n💰 Tarieven & prijzen\n🛠️ Technische vaardigheden\n🚀 Portfolio & projecten\n⏰ Beschikbaarheid & tijdlijnen\n📧 Contactgegevens\n\nWat wilt u weten? 👇",
        ar: "👋 مرحباً! أنا Roze Bot — مساعد ستيبان الذكي.\n\nيمكنني المساعدة في:\n💰 الأسعار والتكاليف\n🛠️ المهارات التقنية\n🚀 المشاريع السابقة\n⏰ التوفر والجداول الزمنية\n📧 معلومات الاتصال\n\nماذا تريد أن تعرف؟ 👇",
        es: "👋 ¡Hola! Soy Roze Bot — asistente AI de Stepan.\n\nPuedo ayudarte con:\n💰 Tarifas y precios\n🛠️ Habilidades técnicas\n🚀 Portfolio y proyectos\n⏰ Disponibilidad y plazos\n📧 Información de contacto\n\n¿Qué te gustaría saber? 👇",
      };
      setTimeout(() => {
        setMessages([{
          id: Date.now(),
          text: welcomeMessages[language] || welcomeMessages.en,
          sender: "bot",
          timestamp: new Date(),
        }]);
        setShowQuickQuestions(true);
      }, 500);
    }
  }, [isChatOpen, messages.length, hasServiceContext, language]);

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
        text: "You've reached the message limit. Please contact me directly at rozedev095@gmail.com",
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
      // Use the real AI answer only when it's genuine; otherwise fall back to
      // the on-brand local knowledge base (backend returns model:"fallback"
      // when ANTHROPIC_API_KEY isn't configured).
      const isRealAI = data && data.message && data.model && data.model !== 'fallback';
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: isRealAI ? data.message : localAnswer(trimmedValue, language),
        sender: "bot",
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    })
    .catch(error => {
      console.error('AI Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: localAnswer(trimmedValue, language),
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
      <div className="fixed bottom-6 right-4 sm:right-6 z-[99900] flex flex-col gap-3 items-center">
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

        {/* Chat Bot Button - visible in all modes */}
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
      </div>
    </>
  );
}