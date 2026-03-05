import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
    withSlide?: boolean;
}

const slideVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

const transition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] } as const;

export default function PageTransition({ children, withSlide = true }: PageTransitionProps) {
    const prefersReducedMotion = useReducedMotion();
    const variants = prefersReducedMotion
        ? {
            initial: { opacity: 1 },
            animate: { opacity: 1 },
            exit: { opacity: 1 },
        }
        : withSlide
            ? slideVariants
            : fadeVariants;

    return (
        <motion.div
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={prefersReducedMotion ? { duration: 0 } : transition}
        >
            {children}
        </motion.div>
    );
}
