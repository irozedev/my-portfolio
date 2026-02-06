import { motion } from "motion/react";
import { Home, Search, ArrowLeft, Terminal } from "lucide-react";
import { useLanguage } from "../contexts/language-context";
import { Button } from "./ui/button";

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00d9ff08_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-[#00d9ff]/10 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 404 Number with Animation */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Glitch Effect Background */}
          <motion.div
            className="absolute inset-0 text-[12rem] md:text-[20rem] font-black text-[#00d9ff]/20 blur-sm"
            animate={{
              x: [0, -2, 2, -2, 0],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            404
          </motion.div>

          {/* Main 404 Text */}
          <motion.h1
            className="relative text-[12rem] md:text-[20rem] font-black leading-none"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundImage: "linear-gradient(90deg, #00d9ff, #a855f7, #00d9ff)",
              backgroundSize: "200% 100%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </motion.h1>

          {/* Scan Line Effect */}
          <motion.div
            className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent"
            animate={{
              y: [0, 400],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
            {t("notFound.title")}
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            {t("notFound.description")}
          </p>
        </motion.div>

        {/* Terminal-style Error Box */}
        <motion.div
          className="mb-10 mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]/50 border-b border-[var(--card-border)]">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <Terminal className="w-4 h-4 text-[var(--text-secondary)] ml-2" />
            </div>
            <div className="p-4 md:p-6 text-left font-mono text-sm md:text-base">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-red-500">Error:</span>
                <span className="text-[var(--text-secondary)]">
                  {t("notFound.errorMessage")}
                </span>
              </div>
              <div className="flex items-start gap-2 text-[var(--text-secondary)]/60">
                <span>$</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  _
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-[#00d9ff] to-cyan-400 hover:from-[#00b8dd] hover:to-cyan-300 text-black px-8 py-6 text-base shadow-[0_0_20px_rgba(0,217,255,0.5)] hover:shadow-[0_0_40px_rgba(0,217,255,0.8)] transition-all duration-300 w-full sm:w-auto"
          >
            <Home className="w-5 h-5 mr-2" />
            {t("notFound.backHome")}
          </Button>

          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-2 border-[#00d9ff] text-[#00d9ff] hover:bg-[#00d9ff] hover:text-black px-8 py-6 text-base transition-all duration-300 w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("notFound.goBack")}
          </Button>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-10 opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <Search className="w-16 h-16 md:w-24 md:h-24 text-[#00d9ff]" />
        </motion.div>
      </div>
    </section>
  );
}
