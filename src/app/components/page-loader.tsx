import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const duration = 1800;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => setIsLoading(false), 300);
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
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#050510] to-[#0a0a0a]"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0 grid-pattern opacity-10" />
            
            {/* Animated Orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px]"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 60, 0],
                y: [0, -40, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px]"
              animate={{
                scale: [1, 1.4, 1],
                x: [0, -50, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </div>

          {/* Loader Content */}
          <div className="relative z-10 flex flex-col items-center gap-10">
            {/* Animated Logo */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'backOut' }}
            >
              {/* Outer Ring */}
              <motion.div
                className="absolute w-28 h-28 rounded-full border-4 border-transparent"
                style={{
                  borderTopColor: '#00d9ff',
                  borderRightColor: '#00d9ff',
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              
              {/* Middle Ring */}
              <motion.div
                className="absolute w-20 h-20 rounded-full border-[3px] border-transparent"
                style={{
                  borderBottomColor: '#00b8ff',
                  borderLeftColor: '#00b8ff',
                }}
                animate={{ rotate: -360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              
              {/* Inner Glow */}
              <motion.div
                className="absolute w-28 h-28 rounded-full bg-cyan-500/30 blur-2xl"
                animate={{
                  scale: [0.8, 1.1, 0.8],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Logo Text */}
              <motion.div
                className="relative text-5xl font-black text-white tracking-tighter"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(0, 217, 255, 0.5)',
                    '0 0 40px rgba(0, 217, 255, 0.8)',
                    '0 0 20px rgba(0, 217, 255, 0.5)',
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

            {/* Loading Text */}
            <motion.div
              className="text-center space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Loading Portfolio
              </h2>
              
              {/* Animated Dots */}
              <div className="flex items-center justify-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-cyan-400"
                    animate={{
                      scale: [0.8, 1.5, 0.8],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.25,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-72 space-y-2">
              <div className="h-1.5 bg-gray-900/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-800/50">
                <motion.div
                  className="h-full relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400" />
                  
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              </div>

              {/* Progress Percentage */}
              <div className="flex justify-between items-center px-1">
                <motion.span
                  className="text-cyan-400 font-mono text-xs font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {Math.round(progress)}%
                </motion.span>
                <motion.span
                  className="text-gray-500 font-mono text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Please wait...
                </motion.span>
              </div>
            </div>
          </div>

          {/* Scan Line Effect */}
          <motion.div
            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
            animate={{
              y: ['-10%', '110vh'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Export default as well for compatibility
export default PageLoader;
