import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipBack, SkipForward, Grid3x3 } from "lucide-react";
import { useState } from "react";

interface SliderControlsProps {
  currentSlide: number;
  totalSlides: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onGoToSlide: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function SliderControls({
  currentSlide,
  totalSlides,
  isPlaying,
  onTogglePlay,
  onGoToSlide,
  onPrev,
  onNext,
}: SliderControlsProps) {
  const [showGrid, setShowGrid] = useState(false);

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {/* Previous Button */}
      <motion.button
        onClick={onPrev}
        className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[#00d9ff]/50 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Previous slide"
      >
        <SkipBack className="w-4 h-4 text-[var(--text-secondary)]" />
      </motion.button>

      {/* Play/Pause Button */}
      <motion.button
        onClick={onTogglePlay}
        className="p-3 bg-gradient-to-r from-[#00d9ff]/20 to-cyan-500/20 border border-[#00d9ff]/30 rounded-xl hover:from-[#00d9ff]/30 hover:to-cyan-500/30 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-[#00d9ff]" />
        ) : (
          <Play className="w-5 h-5 text-[#00d9ff]" />
        )}
      </motion.button>

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[#00d9ff]/50 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Next slide"
      >
        <SkipForward className="w-4 h-4 text-[var(--text-secondary)]" />
      </motion.button>

      {/* Grid View Toggle */}
      <motion.button
        onClick={() => setShowGrid(!showGrid)}
        className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-purple-500/50 transition-all relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle grid view"
      >
        <Grid3x3 className="w-4 h-4 text-[var(--text-secondary)]" />
      </motion.button>

      {/* Grid Popup */}
      <AnimatePresence>
        {showGrid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute bottom-16 bg-[var(--bg-primary)] backdrop-blur-xl border-2 border-[#00d9ff]/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,217,255,0.2)] z-50"
          >
            <div className="grid grid-cols-3 gap-2 mb-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    onGoToSlide(idx);
                    setShowGrid(false);
                  }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    currentSlide === idx
                      ? 'bg-gradient-to-r from-[#00d9ff] to-cyan-400 text-black'
                      : 'bg-white/5 border border-white/10 text-[var(--text-secondary)] hover:border-[#00d9ff]/50'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {idx + 1}
                </motion.button>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] text-center">
              Jump to any slide
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
