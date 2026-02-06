import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, Sparkles, LogIn, X } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { useState } from "react";

export function DashboardButton() {
  const { user, signInWithGoogle } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleClick = () => {
    if (user) {
      window.location.href = '/dashboard';
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowLoginPrompt(false);
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        className="relative p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={user ? "Go to Dashboard" : "Sign in to Dashboard"}
      >
        {user ? (
          <>
            <LayoutDashboard className="w-5 h-5 text-[var(--accent-primary)]" />
            {/* User indicator dot */}
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-[var(--bg-primary)]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </>
        ) : (
          <div className="relative">
            <LayoutDashboard className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 text-yellow-500" />
            </motion.div>
          </div>
        )}
      </motion.button>

      {/* Simple Login Prompt */}
      <AnimatePresence>
        {showLoginPrompt && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginPrompt(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100000]"
            />

            {/* Login Prompt */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-0 flex items-center justify-center z-[100001] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[var(--bg-primary)] border-2 border-[#00d9ff]/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,217,255,0.3)] relative">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>

                <div className="text-center mb-6">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-[#00d9ff] to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
                    Welcome to Dashboard
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)]">
                    Sign in to access exclusive features
                  </p>
                </div>

                <motion.button
                  onClick={handleSignIn}
                  className="w-full py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                  Continue with Google
                </motion.button>

                <p className="text-xs text-[var(--text-secondary)] text-center mt-4">
                  By signing in, you agree to our Terms & Privacy Policy
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}