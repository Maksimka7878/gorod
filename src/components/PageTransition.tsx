import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
    children: ReactNode;
    mode?: 'fade' | 'slide' | 'scale' | 'slideUp';
}

const variants: Record<string, Variants> = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    slide: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.05 },
    },
};

export default function PageTransition({
    children,
    mode = 'fade'
}: PageTransitionProps) {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants[mode]}
                transition={{
                    duration: 0.2,
                    ease: 'easeInOut',
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * Stagger children animation wrapper
 */
interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

export function StaggerContainer({
    children,
    className,
    staggerDelay = 0.05
}: StaggerContainerProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Stagger item for use inside StaggerContainer
 */
interface StaggerItemProps {
    children: ReactNode;
    className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Fade in on scroll animation
 */
interface FadeInViewProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function FadeInView({ children, className, delay = 0 }: FadeInViewProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Scale on tap/hover animation wrapper
 */
interface TapScaleProps {
    children: ReactNode;
    className?: string;
    scale?: number;
}

export function TapScale({ children, className, scale = 0.97 }: TapScaleProps) {
    return (
        <motion.div
            className={className}
            whileTap={{ scale }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            {children}
        </motion.div>
    );
}
