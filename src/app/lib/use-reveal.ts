import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll without a animation library.
 *
 * `motion` is 42 kB gzipped and it sits in the critical path only because three
 * components that render before any scroll import it — the view-mode toggle,
 * the stat row and the cookie banner. Everything below the fold can keep using
 * it; these three cannot, or the chunk can never be deferred.
 *
 * Same trigger geometry as lib/motion's VIEWPORT: fire once, and pull the
 * bottom edge in by 20% so a section animates when it is properly on screen
 * rather than as its first pixel appears.
 *
 * Honours prefers-reduced-motion by revealing immediately — the CSS does the
 * same on its side, but a reader with that preference should not have content
 * gated behind an observer at all.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return { ref, shown };
}
