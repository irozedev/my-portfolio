import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface LazySectionProps {
  children: ReactNode;
  threshold?: number;
  className?: string;
}

export function LazySection({ 
  children, 
  threshold = 0.1,
  className = '' 
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        });
      },
      {
        threshold,
        rootMargin: '50px',
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, hasAnimated]);

  return (
    <div ref={sectionRef} className={className}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      ) : (
        <div className="min-h-[200px]" /> // Placeholder to maintain layout
      )}
    </div>
  );
}
