import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Mail, Sparkles } from "lucide-react";
import { useEffect } from "react";

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
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-lg bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] backdrop-blur-xl border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--text-secondary)] hover:text-white transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[var(--accent-primary)]/20 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative p-8 md:p-10 space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 rounded-2xl shadow-lg mb-4"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]"
              >
                Get Started with
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-[var(--accent-primary)] font-semibold"
              >
                {service.title}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-[var(--text-secondary)] max-w-md mx-auto"
              >
                Choose how you'd like to proceed with your project
              </motion.p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* ChatBot Option */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onChatBot}
                className="group relative p-6 bg-gradient-to-br from-[var(--accent-primary)]/10 to-purple-500/10 hover:from-[var(--accent-primary)]/20 hover:to-purple-500/20 border border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)]/50 rounded-2xl transition-all duration-300"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-[var(--accent-primary)]/0 group-hover:bg-[var(--accent-primary)]/5 rounded-2xl transition-all duration-300" />
                
                <div className="relative space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[var(--accent-primary)] to-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    Chat with AI
                  </h4>
                  
                  <p className="text-sm text-[var(--text-secondary)]">
                    Get instant answers and discuss your project with our AI assistant
                  </p>

                  <div className="pt-2 text-xs text-[var(--accent-primary)] font-medium">
                    Quick & Interactive →
                  </div>
                </div>
              </motion.button>

              {/* Contact Form Option */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onContact}
                className="group relative p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 rounded-2xl transition-all duration-300"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 rounded-2xl transition-all duration-300" />
                
                <div className="relative space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-purple-400 transition-colors">
                    Contact Form
                  </h4>
                  
                  <p className="text-sm text-[var(--text-secondary)]">
                    Send a detailed message and get a personalized response
                  </p>

                  <div className="pt-2 text-xs text-purple-400 font-medium">
                    Professional & Direct →
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Footer Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xs text-center text-[var(--text-muted)]"
            >
              Both options will help you get started quickly with your project
            </motion.p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--accent-primary)]/20 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </>
  );
}