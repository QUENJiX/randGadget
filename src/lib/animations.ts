/* ============================================================================
   GADGETBD — Framer Motion Animation Presets  (Flat 2.0)
   ============================================================================
   Functional, understated motion. Animations should clarify hierarchy and
   provide feedback — never distract from product content.
   All animations use GPU-accelerated properties (transform, opacity).
   ============================================================================ */

import type { Variants, Transition } from 'framer-motion'

// --- Easing Curves ---
export const easing = {
  smooth: [0.33, 1, 0.68, 1] as const,          // ease-out
  snappy: [0.65, 0, 0.35, 1] as const,          // ease in-out
  bounce: [0.34, 1.56, 0.64, 1] as const,       // slight overshoot (rarely used)
  gentle: [0.25, 0.1, 0.25, 1] as const,        // standard ease
}

// --- Standard Transitions ---
export const transitions = {
  fast: { duration: 0.15, ease: easing.smooth } satisfies Transition,
  normal: { duration: 0.3, ease: easing.smooth } satisfies Transition,
  slow: { duration: 0.45, ease: easing.smooth } satisfies Transition,
  spring: { type: 'spring', stiffness: 400, damping: 35 } satisfies Transition,
  springGentle: { type: 'spring', stiffness: 250, damping: 28 } satisfies Transition,
}

// --- Fade In ---
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
}

// --- Fade Up (scroll reveal) ---
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
}

// --- Fade Down ---
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
}

// --- Scale In (for cards, modals) ---
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
}

// --- Slide In from Left ---
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
}

// --- Slide In from Right ---
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
}

// --- Stagger Container (for lists/grids) ---
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

// --- Stagger Item (child of stagger container) ---
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
}

// --- Page Transition ---
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.15, ease: easing.snappy },
  },
}

// --- Navbar Slide ---
export const navbarSlide: Variants = {
  hidden: { y: -40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: easing.smooth },
  },
}

// --- Mobile Menu ---
export const mobileMenuOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export const mobileMenuPanel: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.25, ease: easing.smooth },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.2, ease: easing.snappy },
  },
}

// --- Search Modal ---
export const searchModalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -10,
    transition: transitions.fast,
  },
}

// --- Product Card Hover ---
export const cardHover = {
  rest: { y: 0 },
  hover: {
    y: -2,
    transition: transitions.fast,
  },
}

// --- Button Press ---
export const buttonPress = {
  whileTap: { scale: 0.97 },
  whileHover: { scale: 1.02 },
  transition: transitions.fast,
}

// --- Scroll-linked parallax helper ---
export const parallaxY = (scrollProgress: number, distance: number = 50) => ({
  y: scrollProgress * distance,
})

// --- Text reveal (character by character) ---
export const textRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02,
    },
  },
}

export const textRevealChar: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: easing.smooth },
  },
}

// --- Bento grid item animations ---
export const bentoItem = (index: number): Variants => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: index * 0.06,
      ease: easing.smooth,
    },
  },
})
