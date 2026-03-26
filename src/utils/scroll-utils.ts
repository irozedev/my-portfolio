/**
 * Universal smooth scroll navigation utility
 * Handles scroll to sections with proper header offset
 */

export const smoothScrollToSection = (sectionId: string) => {
  const targetId = sectionId.replace('#', '');
  const element = (targetId === 'home' || targetId === 'hero') ? document.body : document.getElementById(targetId);
  
  if (element) {
    // Get header height dynamically with additional padding
    const nav = document.querySelector('nav');
    const navHeight = nav ? nav.offsetHeight : 80;
    
    // Add beta banner height + view mode toggle
    const isMobile = window.innerWidth < 768;
    const betaBannerHeight = isMobile ? 40 : 48; // Beta banner h-10 = 40px, h-12 = 48px
    const viewModeToggleHeight = 56; // Toggle height
    const extraPadding = isMobile ? 20 : 30;
    
    const totalOffset = betaBannerHeight + navHeight + extraPadding;
    
    // Calculate position
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

    // Smooth scroll
    window.scrollTo({
      top: (targetId === 'home' || targetId === 'hero') ? 0 : offsetPosition,
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