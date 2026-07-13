import { useEffect, useRef } from 'react';

interface UseSliderNavigationProps {
  sliderRef: React.RefObject<any>;
  totalSlides: number;
  enableKeyboard?: boolean;
  enableSwipe?: boolean;
}

export function useSliderNavigation({
  sliderRef,
  totalSlides,
  enableKeyboard = true,
  enableSwipe = true,
}: UseSliderNavigationProps) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isScrolling = useRef(false);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sliderRef.current) return;

      // Never hijack keys while the user is typing in a field (chat input,
      // contact form, comments) — otherwise Space/arrows get eaten.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          sliderRef.current.slickPrev();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          sliderRef.current.slickNext();
          break;
        case 'Home':
          e.preventDefault();
          sliderRef.current.slickGoTo(0);
          break;
        case 'End':
          e.preventDefault();
          sliderRef.current.slickGoTo(totalSlides - 1);
          break;
        case ' ': // Space bar
          e.preventDefault();
          sliderRef.current.slickNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sliderRef, totalSlides, enableKeyboard]);

  // Touch swipe navigation
  useEffect(() => {
    if (!enableSwipe) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      isScrolling.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const diff = Math.abs(touchStartX.current - currentX);
      
      // If horizontal swipe is significant, prevent vertical scroll
      if (diff > 10) {
        isScrolling.current = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;
      handleSwipe();
    };

    const handleSwipe = () => {
      if (!sliderRef.current || !isScrolling.current) return;

      const swipeDistance = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 50;

      if (Math.abs(swipeDistance) < minSwipeDistance) return;

      if (swipeDistance > 0) {
        // Swipe left - next slide
        sliderRef.current.slickNext();
      } else {
        // Swipe right - previous slide
        sliderRef.current.slickPrev();
      }
    };

    const slider = sliderRef.current?.innerSlider?.list;
    if (slider) {
      slider.addEventListener('touchstart', handleTouchStart, { passive: true });
      slider.addEventListener('touchmove', handleTouchMove, { passive: true });
      slider.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        slider.removeEventListener('touchstart', handleTouchStart);
        slider.removeEventListener('touchmove', handleTouchMove);
        slider.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [sliderRef, enableSwipe]);

  return {
    // Methods are handled by react-slick, hook just adds keyboard/touch support
  };
}