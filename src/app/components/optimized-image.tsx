import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  blur?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  quality = 80,
  blur = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  // Optimize Unsplash URLs
  const optimizeSrc = (url: string) => {
    if (!url.includes('unsplash.com')) return url;

    const urlObj = new URL(url);
    
    // Add optimization parameters for Unsplash
    if (width) urlObj.searchParams.set('w', Math.min(width, 1920).toString());
    if (height) urlObj.searchParams.set('h', Math.min(height, 1080).toString());
    urlObj.searchParams.set('q', quality.toString());
    urlObj.searchParams.set('fm', 'webp'); // Use WebP format
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('auto', 'format'); // Auto-format based on browser support
    
    return urlObj.toString();
  };

  // Generate low-quality placeholder
  const placeholderSrc = (url: string) => {
    if (!url.includes('unsplash.com')) return url;
    
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', '20');
    urlObj.searchParams.set('q', '10');
    urlObj.searchParams.set('blur', '200');
    
    return urlObj.toString();
  };

  const optimizedSrc = optimizeSrc(src);
  const placeholder = blur ? placeholderSrc(src) : undefined;

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Blur image */}
      {blur && placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
          aria-hidden="true"
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && !blur && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
      )}

      {/* Main image */}
      {isInView && (
        <motion.img
          src={optimizedSrc}
          alt={alt}
          className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  );
}
