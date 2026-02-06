import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Faster, smoother loading
    const duration = 1500;
    const interval = 16;
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => setIsLoading(false), 200);
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a]"
        >
          {/* Minimal animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-5" />
            
            <motion.div
              className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Loader Content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Minimalist Logo Animation */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'backOut' }}
            >
              {/* Single Rotating Ring */}
              <motion.div
                className="w-20 h-20 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: '#00d9ff',
                  borderRightColor: '#00d9ff',
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              
              {/* Center Logo */}
              <motion.div
                className="absolute text-3xl font-black text-white tracking-tight"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(0, 217, 255, 0.3)',
                    '0 0 30px rgba(0, 217, 255, 0.5)',
                    '0 0 20px rgba(0, 217, 255, 0.3)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                SR
              </motion.div>
            </motion.div>

            {/* Minimal Progress Bar */}
            <motion.div
              className="w-48 h-0.5 bg-gray-900/50 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
