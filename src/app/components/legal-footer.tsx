import { motion } from "motion/react";
import { Shield, FileText, Info } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { useState } from "react";
import { LegalModal } from "./legal-modal";

export function LegalFooter() {
  const { t } = useLanguage();
  const [activeLegal, setActiveLegal] = useState<'privacy' | 'terms' | 'imprint' | null>(null);
  
  const handleLegalClick = (type: 'privacy' | 'terms' | 'imprint') => {
    setActiveLegal(type);
  };

  return (
    <>
      <div className="mt-12 border-t border-[var(--border-color)] pt-8 pb-4 relative z-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Legal Links - Single Line on Mobile */}
            <div className="flex items-center justify-center flex-nowrap gap-3 md:gap-6 text-xs md:text-sm relative z-50 overflow-x-auto w-full md:w-auto">
              <motion.button
                onClick={() => handleLegalClick('privacy')}
                className="flex items-center gap-1.5 md:gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer bg-transparent border-none p-0 relative z-50 whitespace-nowrap"
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {t('privacy_policy')}
              </motion.button>
              <span className="text-[var(--border-color)] px-1">•</span>
              <motion.button
                onClick={() => handleLegalClick('terms')}
                className="flex items-center gap-1.5 md:gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer bg-transparent border-none p-0 relative z-50 whitespace-nowrap"
                whileTap={{ scale: 0.95 }}
              >
                <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {t('terms_conditions')}
              </motion.button>
              <span className="text-[var(--border-color)] px-1">•</span>
              <motion.button
                onClick={() => handleLegalClick('imprint')}
                className="flex items-center gap-1.5 md:gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer bg-transparent border-none p-0 relative z-50 whitespace-nowrap"
                whileTap={{ scale: 0.95 }}
              >
                <Info className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {t('imprint')}
              </motion.button>
            </div>

            {/* Compliance Notice */}
            <div className="text-xs text-[var(--text-muted)] text-center md:text-right">
              <p>🇪🇺 GDPR Compliant • Based in Belgium</p>
              <p className="mt-1">VAT: BE 0123.456.789 • KvK: 12345678</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      <LegalModal type={activeLegal} onClose={() => setActiveLegal(null)} />
    </>
  );
}