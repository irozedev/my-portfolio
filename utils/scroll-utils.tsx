/**
 * Smooth scroll to section with proper header offset
 * Takes into account both navigation and beta banner heights
 */
export function smoothScrollToSection(href: string) {
  const targetId = href.replace('#', '');
  const element = document.getElementById(targetId);
  
  if (!element) return;

  // Calculate offsets
  const betaBannerHeight = window.innerWidth < 768 ? 40 : 48; // h-10 = 40px (mobile), h-12 = 48px (desktop)
  const navHeight = 80; // Approximate navigation height
  const extraPadding = window.innerWidth < 768 ? 20 : 30;
  const totalOffset = betaBannerHeight + navHeight + extraPadding;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}