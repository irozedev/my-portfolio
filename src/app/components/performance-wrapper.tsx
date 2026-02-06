import { ReactNode } from 'react';
import { usePerformanceMode } from '../hooks/use-performance';

interface PerformanceWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  condition?: 'animation' | 'blur' | 'parallax' | 'all';
}

/**
 * Wrapper that conditionally renders children based on device performance
 */
export function PerformanceWrapper({ 
  children, 
  fallback, 
  condition = 'all' 
}: PerformanceWrapperProps) {
  const { 
    shouldReduceAnimations, 
    shouldReduceBlur, 
    shouldDisableParallax,
    performanceMode 
  } = usePerformanceMode();

  let shouldSimplify = false;

  switch (condition) {
    case 'animation':
      shouldSimplify = shouldReduceAnimations;
      break;
    case 'blur':
      shouldSimplify = shouldReduceBlur;
      break;
    case 'parallax':
      shouldSimplify = shouldDisableParallax;
      break;
    case 'all':
      shouldSimplify = performanceMode;
      break;
  }

  return shouldSimplify && fallback ? <>{fallback}</> : <>{children}</>;
}

/**
 * Conditional backdrop blur class
 */
export function useBackdropBlur() {
  const { shouldReduceBlur } = usePerformanceMode();
  return shouldReduceBlur ? '' : 'backdrop-blur-xl';
}

/**
 * Conditional animation settings
 */
export function useAnimationSettings() {
  const { shouldReduceAnimations, performanceMode } = usePerformanceMode();
  
  return {
    // Reduce or disable animations
    transition: shouldReduceAnimations 
      ? { duration: 0.2 }
      : { duration: 0.6, type: 'spring' },
    
    // Disable infinite animations
    repeat: shouldReduceAnimations ? 0 : Infinity,
    
    // Reduce motion
    reduceMotion: shouldReduceAnimations,
    
    // Performance mode
    performanceMode,
  };
}
