import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText, Info } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';
import { useModalA11y } from '../hooks/use-modal-a11y';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'imprint' | null;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const { t } = useLanguage();
  const dialogRef = useModalA11y({ isOpen: type !== null, onClose });

  if (!type) return null;

  const getIcon = () => {
    switch (type) {
      case 'privacy': return Shield;
      case 'terms': return FileText;
      case 'imprint': return Info;
      default: return Shield;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'privacy': return t('privacy_policy');
      case 'terms': return t('terms_conditions');
      case 'imprint': return t('imprint');
      default: return '';
    }
  };

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return (
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">1. Data Collection</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We collect minimal data necessary for portfolio functionality. This includes comments, reactions, and contact form submissions. All data is processed in accordance with GDPR regulations.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">2. Cookies</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We use essential cookies for theme preferences and language selection. No tracking cookies are used without your explicit consent.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">3. Data Storage</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Your data is securely stored on EU-based servers (Supabase) and is never shared with third parties. You have the right to request data deletion at any time.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">4. Your Rights (GDPR)</h3>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure (&ldquo;right to be forgotten&rdquo;)</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">5. Contact</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                For privacy concerns, contact: <a href="mailto:rozedev095@gmail.com" className="text-[var(--accent-primary)] hover:underline">rozedev095@gmail.com</a>
              </p>
            </section>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">1. Acceptance of Terms</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                By accessing this portfolio website, you agree to these terms and conditions. If you disagree with any part, please discontinue use.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">2. Intellectual Property</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                All content, including code examples, designs, and text, is owned by Stepan Roze unless otherwise stated. Unauthorized reproduction is prohibited.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">3. User Contributions</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Comments and reactions submitted on projects are moderated. We reserve the right to remove inappropriate content. By submitting, you grant us a license to display your contribution.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">4. Disclaimer</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                This portfolio is provided &ldquo;as is&rdquo; without warranties. Project showcases are for demonstration purposes and may not reflect current live implementations.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">5. Limitation of Liability</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Stepan Roze is not liable for any damages arising from the use of this website or reliance on the information provided.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">6. Governing Law</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                These terms are governed by Belgian law. Any disputes shall be resolved in Belgian courts.
              </p>
            </section>
          </div>
        );

      case 'imprint':
        return (
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Legal Information</h3>
              <div className="text-[var(--text-secondary)] space-y-3">
                <p><strong>Name:</strong> Stepan Roze</p>
                <p><strong>Business:</strong> Software Development Services</p>
                <p><strong>Location:</strong> Belgium, European Union</p>
                <p><strong>Email:</strong> <a href="mailto:rozedev095@gmail.com" className="text-[var(--accent-primary)] hover:underline">rozedev095@gmail.com</a></p>
                <p><strong>Website:</strong> <a href="https://roze.live" className="text-[var(--accent-primary)] hover:underline">roze.live</a></p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Business Registration</h3>
              <div className="text-[var(--text-secondary)] space-y-2">
                <p className="opacity-50"><strong>VAT Number:</strong> Registration pending</p>
                <p className="opacity-50"><strong>Chamber of Commerce:</strong> Registration pending</p>
                <p className="text-sm italic">🇪🇺 Belgian business registration in progress</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Professional Responsibility</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                As a freelance software developer, I adhere to professional standards and ethical guidelines in all client engagements. All services are provided in compliance with EU regulations.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Dispute Resolution</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                For any complaints or disputes, please contact <a href="mailto:rozedev095@gmail.com" className="text-[var(--accent-primary)] hover:underline">rozedev095@gmail.com</a>. We aim to resolve issues amicably within 14 days.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Technical Information</h3>
              <div className="text-[var(--text-secondary)] space-y-2">
                <p><strong>Hosting:</strong> Netlify (USA, GDPR-compliant)</p>
                <p><strong>Database:</strong> Supabase (EU region)</p>
                <p><strong>Analytics:</strong> Privacy-friendly, no personal data tracking</p>
              </div>
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  const Icon = getIcon();

  return (
    <AnimatePresence>
      {/* Transparent Backdrop */}
      <motion.div
        key="legal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100000]"
        style={{ position: 'fixed' }}
      />

      {/* Modal - Scrollable */}
      <div key="legal-modal" className="fixed inset-0 z-[100001] overflow-y-auto" style={{ position: 'fixed' }}>
        <div className="min-h-full flex items-start justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)]/30 rounded-3xl w-full max-w-4xl shadow-[0_0_24px_rgba(0,217,255,0.18)] my-8 relative"
          >
            {/* Gradient Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)]/10 via-transparent to-purple-500/10 pointer-events-none" />

            {/* Close Button */}
            <button aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all z-10 group"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors" />
            </button>

            {/* Content */}
            <div className="p-6 sm:p-8 lg:p-10 relative">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--border-color)]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 flex items-center justify-center shadow-lg">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 id="legal-modal-title" className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-purple-500 bg-clip-text text-transparent">
                    {getTitle()}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Last updated: February 8, 2026
                  </p>
                </div>
              </div>

              {/* Content Sections */}
              <div className="prose prose-invert max-w-none">
                {getContent()}
              </div>

              {/* Footer */}
              <div className="mt-10 pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-[var(--text-muted)]">
                  🇪🇺 GDPR Compliant • Based in Belgium
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 text-white font-bold rounded-xl hover:from-[var(--accent-primary)]/90 hover:to-purple-500/90 transition-all shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}