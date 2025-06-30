"use client";

import type React from "react";

import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";

/**
 * Animated Layout Component
 * Provides consistent page transitions and animations throughout the application
 *
 * Features:
 * - Smooth page transitions
 * - Customizable animation variants
 * - Responsive design support
 * - Accessibility considerations
 *
 * @example
 * ```tsx
 * <AnimatedLayout>
 *   <h1>Page Content</h1>
 * </AnimatedLayout>
 *
 * // With custom animation
 * <AnimatedLayout
 *   initial={{ opacity: 0, scale: 0.95 }}
 *   animate={{ opacity: 1, scale: 1 }}
 *   transition={{ duration: 0.3 }}
 * >
 *   <div>Custom animated content</div>
 * </AnimatedLayout>
 * ```
 */

interface AnimatedLayoutProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedLayout({
  children,
  className,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  exit = { opacity: 0, y: -20 },
  transition = { duration: 0.3, ease: "easeInOut" },
  ...props
}: AnimatedLayoutProps) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Container Component
 * Creates staggered animations for child elements
 */
interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Item Component
 * Individual items within a stagger container
 */
interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({
  children,
  className,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fade In Component
 * Simple fade in animation
 */
interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  className,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide In Component
 * Slide in animation from specified direction
 */
interface SlideInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  distance?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction = "up",
  distance = 50,
  className,
  ...props
}: SlideInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "left":
        return { x: -distance, opacity: 0 };
      case "right":
        return { x: distance, opacity: 0 };
      case "up":
        return { y: distance, opacity: 0 };
      case "down":
        return { y: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
