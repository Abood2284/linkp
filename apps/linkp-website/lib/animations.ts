// lib/animations.ts
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
}

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { 
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: { scale: 0.9, opacity: 0 },
}

export const formTransition = {
  type: "spring",
  stiffness: 500,
  damping: 50,
  mass: 1,
}