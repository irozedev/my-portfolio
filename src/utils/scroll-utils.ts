/**
 * Universal smooth scroll navigation utility
 * Handles scroll to sections with proper header offset
 */

export const smoothScrollToSection = (sectionId: string) => {
  const targetId = sectionId.replace('#', '');
  const element = targetId === 'home' ? document.body : document.getElementById(targetId);
  
  if (element) {
    // Get header height dynamically
    const nav = document.querySelector('nav');
    const headerOffset = nav ? nav.offsetHeight : 80;
    
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
