import type { Variants } from "motion/react";

/**
 * Shared motion vocabulary.
 *
 * The site had 384 hand-written motion props and no shared language, which is
 * why the entrances read as cheap rather than considered. Three habits did the
 * damage, and the tokens here exist to replace each of them:
 *
 *  1. Too much travel. Entrances ran `y: 20…50` with `scale: 0.9`, so elements
 *     flew and grew at once. Restraint reads as confidence: 14px and no scale.
 *     Scale is reserved for things that genuinely pop — a dialog appearing.
 *
 *  2. Cascades timed in tenths. `delay: index * 0.1` meant the sixth card in a
 *     row started 0.6s after the row entered view. Scroll at any speed and the
 *     animation is still playing catch-up somewhere above the fold you have
 *     already left. Stagger belongs in the parent, measured in hundredths.
 *
 *  3. Triggering at the very edge. Every one of the 54 `viewport` props was a
 *     bare `{ once: true }`, firing at 0px intersection — the element starts
 *     moving the instant its first pixel appears, so the motion happens at the
 *     bottom edge of the screen where it is least legible. `VIEWPORT` pulls the
 *     trigger line up the screen instead, so the entrance finishes about where
 *     the eye lands.
 */

/**
 * One curve for everything that enters.
 *
 * A fast start that settles gently — the standard "decelerate" shape. The
 * library default (`easeOut`) is flatter and reads as slightly floaty at these
 * short durations.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Entrances are quick. Anything slower starts to feel like waiting. */
export const DURATION = 0.45;

/**
 * Scroll trigger — a line across the screen, not a fraction of the element.
 *
 * This used to be `amount: 0.2`, which waits for a fifth of the element to be
 * showing. That is unreachable for anything taller than five viewports: the
 * most of an element you can ever see at once is `viewport / element`, so a
 * 4208px section on a 720px phone tops out at 0.171 and the entrance simply
 * never fires. The section stays at `opacity: 0` for the whole visit. Measured
 * on the live site at 390x720: #about never appeared, and #experience cleared
 * the threshold by 0.009 — one browser toolbar away from the same fate.
 *
 * `amount: "some"` fires on any intersection, so height drops out of it
 * entirely. The negative bottom margin then does the job the fraction was
 * really there for: it moves the trigger line 20% up the screen, so an element
 * reveals once its top has climbed to comfortable reading height rather than at
 * the very bottom edge. Same intent, no dependency on how tall the thing is.
 */
export const VIEWPORT = { once: true, amount: "some", margin: "0px 0px -20% 0px" } as const;

/** The default entrance: rise and fade. No scale. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
};

/** For things that belong to the left/right edge of a layout, e.g. a split hero. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION, ease: EASE } },
};

/**
 * Parent wrapper that walks its children in.
 *
 * Put this on the list and `fadeUp` on each item — no per-item `delay` maths,
 * and the total never runs away with the item count because the gap is small.
 */
export const stagger = (gap = 0.05, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren } },
});

/** Convenience: the three props every scroll-entrance repeats. */
export const enterOnScroll = {
  initial: "hidden",
  whileInView: "show",
  viewport: VIEWPORT,
} as const;
