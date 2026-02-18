/**
 * Smooth scroll to section with proper header offset
 * Takes into account both navigation and beta banner heights
 */
export function smoothScrollToSection(href: string) {
  const targetId = href.replace('#', '');
  const element = document.getElementById(targetId);
  
  if (!element) return;

  // Calculate offsets
  const betaBannerHeight = window.innerWidth < 768 ? 56 : 64; // h-14 = 56px (mobile), h-16 = 64px (desktop)
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
