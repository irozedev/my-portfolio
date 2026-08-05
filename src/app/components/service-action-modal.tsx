import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Mail, Sparkles, Zap, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/language-context";
import { useModalA11y } from "../hooks/use-modal-a11y";

interface ServiceActionModalProps {
  isOpen?: boolean;
  service: {
    key: string;
    title: string;
    description?: string;
  };
  onClose: () => void;
  onChatBot: () => void;
  onContact: () => void;
}

export function ServiceActionModal({ service, onClose, onChatBot, onContact }: ServiceActionModalProps) {
  const { language } = useLanguage();
  
  // Detect mobile for performance optimizations
  const [, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const translations = {
    title: {
      en: "Get Started with",
      nl: "Begin met",
      ar: "ابدأ مع",
      es: "Comienza con",
    },
    subtitle: {
      en: "Choose how you'd like to proceed with your project",
      nl: "Kies hoe je verder wilt met je project",
      ar: "اختر كيف تريد متابعة مشروعك",
      es: "Elige cómo proceder con tu proyecto",
    },
    chatTitle: {
      en: "Chat with AI",
      nl: "Chat met AI",
      ar: "الدردشة مع الذكاء الاصطناعي",
      es: "Chat con IA",
    },
    chatDescription: {
      en: "Get instant answers and discuss your project with our AI assistant",
      nl: "Krijg directe antwoorden en bespreek je project met onze AI-assistent",
      ar: "احصل على إجابات فورية وناقش مشروعك مع مساعد الذكاء الاصطناعي",
      es: "Obtén respuestas instantáneas y discute tu proyecto con nuestro asistente IA",
    },
    chatButton: {
      en: "Quick & Interactive",
      nl: "Snel & Interactief",
      ar: "سريع وتفاعلي",
      es: "Rápido e Interactivo",
    },
    contactTitle: {
      en: "Contact Form",
      nl: "Contactformulier",
      ar: "نموذج الاتصال",
      es: "Formulario de Contacto",
    },
    contactDescription: {
      en: "Send a detailed message and get a personalized response",
      nl: "Stuur een gedetailleerd bericht en ontvang een gepersonaliseerd antwoord",
      ar: "أرسل رسالة مفصلة واحصل على رد مخصص",
      es: "Envía un mensaje detallado y obtén una respuesta personalizada",
    },
    contactButton: {
      en: "Professional & Direct",
      nl: "Professioneel & Direct",
      ar: "محترف ومباشر",
      es: "Profesional y Directo",
    },
    footer: {
      en: "Both options will help you get started quickly with your project",
      nl: "Beide opties helpen je snel aan de slag met je project",
      ar: "كلا الخيارين سيساعدك على البدء بسرعة في مشروعك",
      es: "Ambas opciones te ayudarán a comenzar rápidamente con tu proyecto",
    },
  };

  const t = (key: keyof typeof translations) => {
    return translations[key][language as keyof typeof translations[typeof key]] || translations[key].en;
  };
  
  // Escape, focus trap and focus restore all live in the shared hook now — this
  // component only kept the Escape half and left focus loose behind the modal.
  const dialogRef = useModalA11y({ isOpen: true, onClose });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="service-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999998]"
      />

      {/* Modal */}
      <div key="service-modal-container" className="fixed inset-0 flex items-center justify-center z-[999999] p-4 sm:p-6 md:p-8 pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          tabIndex={-1}
          className="relative bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/30 rounded-3xl w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] max-h-[85vh] overflow-y-auto shadow-[0_20px_80px_rgba(0,217,255,0.4)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-primary)]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          {/* Close Button */}
          <button aria-label="Close"
            onClick={onClose}
            className="absolute top-5 right-5 w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--bg-secondary)]/80 hover:bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all z-10 backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="relative p-8 md:p-12 space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="inline-flex items-center justify-center mb-4"
              >
                <div className="relative">
                  <div className="p-5 bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 rounded-2xl shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-[var(--accent-primary)] rounded-2xl blur-xl -z-10"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [0.9, 1.1, 0.9],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] font-mono"
              >
                {t("title")}
              </motion.h3>

              <motion.p
                id="service-modal-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-[var(--accent-primary)] font-bold"
              >
                {service.title}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-[var(--text-secondary)] max-w-md mx-auto"
              >
                {t("subtitle")}
              </motion.p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* ChatBot Option */}
              <motion.button aria-label="Discuss in chat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onChatBot}
                className="group relative p-7 bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/10 hover:from-[var(--accent-primary)]/20 hover:to-purple-500/20 border-2 border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)]/60 rounded-2xl transition-all duration-300 backdrop-blur-sm"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-[var(--accent-primary)]/0 group-hover:bg-[var(--accent-primary)]/10 rounded-2xl transition-all duration-300 blur-sm" />
                
                <div className="relative space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[var(--accent-primary)] to-cyan-500 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  
                  <h4 className="text-xl font-black text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors font-mono">
                    {t("chatTitle")}
                  </h4>
                  
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed min-h-[60px]">
                    {t("chatDescription")}
                  </p>

                  <div className="flex items-center gap-2 pt-2 text-sm text-[var(--accent-primary)] font-bold">
                    <Zap className="w-4 h-4" />
                    {t("chatButton")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.button>

              {/* Contact Form Option */}
              <motion.button aria-label="Contact by email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onContact}
                className="group relative p-7 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-2 border-purple-500/30 hover:border-purple-500/60 rounded-2xl transition-all duration-300 backdrop-blur-sm"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 rounded-2xl transition-all duration-300 blur-sm" />
                
                <div className="relative space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  
                  <h4 className="text-xl font-black text-[var(--text-primary)] group-hover:text-purple-400 transition-colors font-mono">
                    {t("contactTitle")}
                  </h4>
                  
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed min-h-[60px]">
                    {t("contactDescription")}
                  </p>

                  <div className="flex items-center gap-2 pt-2 text-sm text-purple-400 font-bold">
                    <Mail className="w-4 h-4" />
                    {t("contactButton")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Footer Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-center text-[var(--text-muted)] p-4 bg-[var(--bg-secondary)]/50 rounded-xl border border-[var(--border-color)] backdrop-blur-sm"
            >
              {t("footer")}
            </motion.p>
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--accent-primary)]/20 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}