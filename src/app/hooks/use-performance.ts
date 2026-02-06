import { useState, useEffect, useRef } from 'react';

/**
 * Hook to detect if device prefers reduced motion
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to detect if device is mobile/low-end
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check if mobile based on screen width AND user agent
      const mobileWidth = window.innerWidth < 768;
      const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(mobileWidth || mobileUA);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

/**
 * Hook to check if device is low-end (limited hardware)
 */
export function useIsLowEndDevice() {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 4;
    
    // Check device memory (if available)
    const memory = (navigator as any).deviceMemory || 4;
    
    // Check if connection is slow
    const connection = (navigator as any).connection;
    const slowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
    
    // Consider low-end if:
    // - Less than 4 CPU cores
    // - Less than 4GB RAM
    // - Slow connection
    const isLow = cores < 4 || memory < 4 || slowConnection;
    
    setIsLowEnd(isLow);
  }, []);

  return isLowEnd;
}

/**
 * Combined hook for performance settings
 */
export function usePerformanceMode() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const isLowEnd = useIsLowEndDevice();

  // Determine if we should use performance mode
  const performanceMode = reducedMotion || isLowEnd || isMobile;

  return {
    reducedMotion,
    isMobile,
    isLowEnd,
    performanceMode,
    // Settings based on performance mode
    shouldReduceAnimations: performanceMode,
    shouldReduceBlur: isMobile || isLowEnd,
    shouldLazyLoadImages: true,
    shouldDisableParallax: performanceMode,
  };
}

/**
 * Debounce hook for scroll events
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for frequent events
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdatedRef = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdatedRef.current;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (timeSinceLastUpdate >= interval) {
      // Enough time has passed, update immediately
      setThrottledValue(value);
      lastUpdatedRef.current = now;
    } else {
      // Schedule update after remaining interval time
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastUpdatedRef.current = Date.now();
      }, interval - timeSinceLastUpdate);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, interval]);

  return throttledValue;
}

/**
 * Hook to check if element is in viewport (for lazy loading)
 */
export function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<Element | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, isInView] as const;
}