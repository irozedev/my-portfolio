/**
 * Universal scroll lock utility for modals and popups
 * Uses overflow: hidden on desktop and position: fixed on mobile (iOS Safari fix)
 */

let scrollPosition = 0;

export function lockScroll() {
  // Save current scroll position
  scrollPosition = window.scrollY;
  
  // Detect mobile devices (iOS Safari needs position: fixed)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Mobile: Use position fixed to prevent iOS Safari scroll issues
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
  } else {
    // Desktop: Simple overflow hidden (no content jump)
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${getScrollbarWidth()}px`; // Prevent layout shift
  }
}

export function unlockScroll() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Mobile: Restore all styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
  } else {
    // Desktop: Just restore overflow and padding
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}

/**
 * Get scrollbar width to prevent layout shift on desktop
 */
function getScrollbarWidth(): number {
  // Create temporary element to measure scrollbar
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);
  
  const inner = document.createElement('div');
  outer.appendChild(inner);
  
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  
  outer.parentNode?.removeChild(outer);
  
  return scrollbarWidth;
}
