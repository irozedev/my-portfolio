import { motion, AnimatePresence } from 'motion/react';
import { X, Bot, Heart, MessageCircle, Star, Bell, Zap } from 'lucide-react';
import { useAuth } from '@/app/contexts/auth-context';
import { useState, useEffect } from 'react';

interface EnhancedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EnhancedAuthModal({ isOpen, onClose, onSuccess }: EnhancedAuthModalProps) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'benefits' | 'signing'>('benefits');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setStep('signing');
      await signInWithGoogle();
      onSuccess?.();
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
      setStep('benefits');
    }
  };

  const benefits = [
    {
      icon: MessageCircle,
      title: 'Comment',
      description: 'Share feedback',
      color: '#00d9ff',
    },
    {
      icon: Heart,
      title: 'Like & Save',
      description: 'Build favorites',
      color: '#ec4899',
    },
    {
      icon: Star,
      title: 'Rate',
      description: 'Help discover',
      color: '#fbbf24',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Stay updated',
      color: '#a78bfa',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100000]"
          />

          {/* Modal Container - Responsive positioning */}
          <div className="fixed inset-0 z-[100001] flex items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full md:h-auto md:max-h-[85vh] md:max-w-2xl bg-[var(--bg-primary)] md:rounded-3xl border-0 md:border-2 md:border-[#00d9ff]/30 shadow-[0_0_100px_rgba(0,217,255,0.3)] overflow-hidden flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20 backdrop-blur-sm"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>

              {step === 'benefits' ? (
                <>
                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto overscroll-contain modal-scroll">
                    <div className="p-6 md:p-8 lg:p-10">
                      {/* Header - Compact */}
                      <div className="text-center mb-6 md:mb-8">
                        <motion.div
                          className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#00d9ff] via-purple-500 to-pink-500 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 relative"
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <Bot className="w-8 h-8 md:w-10 md:h-10 text-white" />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-[#00d9ff] via-purple-500 to-pink-500 rounded-2xl md:rounded-3xl blur-xl opacity-50"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </motion.div>
                        
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                          <span className="bg-gradient-to-r from-[#00d9ff] via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Join the Community
                          </span>
                        </h2>
                        <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-md mx-auto">
                          Unlock features and engage with portfolio
                        </p>
                      </div>

                      {/* Benefits Grid - Compact 2x2 */}
                      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                        {benefits.map((benefit, index) => {
                          const Icon = benefit.icon;
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#00d9ff]/50 transition-all duration-300 group"
                            >
                              <div 
                                className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
                                style={{ 
                                  background: `linear-gradient(135deg, ${benefit.color}40, ${benefit.color}20)`,
                                }}
                              >
                                <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: benefit.color }} />
                              </div>
                              <h3 className="text-sm md:text-base font-bold text-[var(--text-primary)] mb-1">
                                {benefit.title}
                              </h3>
                              <p className="text-xs text-[var(--text-secondary)]">
                                {benefit.description}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Community Stats - Compact single row */}
                      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8 p-4 md:p-5 bg-gradient-to-r from-[#00d9ff]/10 to-purple-500/10 rounded-xl md:rounded-2xl border border-[#00d9ff]/20">
                        <div className="text-center">
                          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#00d9ff] to-cyan-400 bg-clip-text text-transparent mb-1">
                            2.5K+
                          </div>
                          <p className="text-[10px] md:text-xs text-[var(--text-secondary)]">Users</p>
                        </div>
                        <div className="text-center border-x border-white/10">
                          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-1">
                            12K+
                          </div>
                          <p className="text-[10px] md:text-xs text-[var(--text-secondary)]">Comments</p>
                        </div>
                        <div className="text-center">
                          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-1">
                            35K+
                          </div>
                          <p className="text-[10px] md:text-xs text-[var(--text-secondary)]">Likes</p>
                        </div>
                      </div>

                      {/* Sign In Button */}
                      <motion.button
                        onClick={handleSignIn}
                        disabled={loading}
                        className="w-full py-4 md:py-5 bg-white hover:bg-gray-100 text-black font-bold text-base md:text-lg rounded-xl md:rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span className="hidden sm:inline">{loading ? 'Signing in...' : 'Continue with Google'}</span>
                        <span className="sm:hidden">{loading ? 'Signing in...' : 'Sign in with Google'}</span>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Zap className="w-5 h-5 text-yellow-600" />
                        </motion.div>
                      </motion.button>

                      {/* Terms - Compact */}
                      <p className="text-[10px] md:text-xs text-center text-[var(--text-secondary)] mt-4 md:mt-6">
                        By signing in, you agree to our{' '}
                        <a href="#terms" className="text-[#00d9ff] hover:underline">Terms</a>
                        {' '}and{' '}
                        <a href="#privacy" className="text-[#00d9ff] hover:underline">Privacy Policy</a>
                      </p>

                      {/* Trust Badges - Mobile only */}
                      <div className="md:hidden mt-6 flex items-center justify-center gap-4 text-[var(--text-secondary)] text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span>Secure</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span>Fast</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span>Private</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Gradient Border - Desktop only */}
                  <div className="hidden md:block h-1 w-full bg-gradient-to-r from-[#00d9ff] via-purple-500 to-pink-500"></div>
                </>
              ) : (
                /* Signing In State */
                <div className="flex-1 flex items-center justify-center p-10">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 md:w-20 md:h-20 border-4 border-[#00d9ff]/30 border-t-[#00d9ff] rounded-full mx-auto mb-6"
                    />
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2">
                      Signing you in...
                    </h3>
                    <p className="text-sm md:text-base text-[var(--text-secondary)]">
                      Please wait
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}