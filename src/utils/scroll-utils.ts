/**
 * Universal smooth scroll navigation utility
 * Handles scroll to sections with proper header offset
 */

export const smoothScrollToSection = (sectionId: string) => {
  const targetId = sectionId.replace('#', '');
  const element = targetId === 'home' ? document.body : document.getElementById(targetId);
  
  if (element) {
    // Get header height dynamically with additional padding
    const nav = document.querySelector('nav');
    let headerOffset = nav ? nav.offsetHeight : 80;
    
    // Add extra padding for better visibility (mobile vs desktop)
    const isMobile = window.innerWidth < 768;
    const extraPadding = isMobile ? 20 : 30; // Extra space for visual comfort
    headerOffset += extraPadding;
    
    // Calculate position
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    // Smooth scroll
    window.scrollTo({
      top: targetId === 'home' ? 0 : offsetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Create onClick handler for navigation links
 */
export const createNavClickHandler = (href: string, callback?: () => void) => {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollToSection(href);
    callback?.();
  };
};