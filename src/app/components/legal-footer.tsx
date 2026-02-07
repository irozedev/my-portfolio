import { motion } from "motion/react";
import { Shield, FileText, Info } from "lucide-react";
import { useLanguage } from "../contexts/language-context";

export function LegalFooter() {
  const { t } = useLanguage();
  
  const handleLegalClick = (type: string) => {
    console.log('Legal link clicked:', type);
    
    // Update URL hash
    window.location.hash = type;
  };

  return (
    <div className="mt-12 border-t border-[var(--border-color)] pt-8 pb-4 relative z-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm relative z-50">
            <motion.button
              onClick={() => handleLegalClick('privacy')}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer bg-transparent border-none p-0 relative z-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="w-4 h-4" />
              {t('privacy_policy')}
            </motion.button>
            <span className="text-[var(--border-color)]">•</span>
            <motion.button
              onClick={() => handleLegalClick('terms')}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer bg-transparent border-none p-0 relative z-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-4 h-4" />
              {t('terms_conditions')}
            </motion.button>
            <span className="text-[var(--border-color)]">•</span>
            <motion.button
              onClick={() => handleLegalClick('imprint')}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer bg-transparent border-none p-0 relative z-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Info className="w-4 h-4" />
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
  );
}