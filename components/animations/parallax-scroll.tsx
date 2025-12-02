"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ReactNode, useRef, useState, useEffect } from "react"

interface ParallaxScrollProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: "up" | "down"
}

export function ParallaxScroll({
  children,
  className = "",
  speed = 0.5,
  direction = "up",
}: ParallaxScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up" ? [100 * speed, -100 * speed] : [-100 * speed, 100 * speed]
  )

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
}

export function ScrollReveal({
  children,
  className = "",
  threshold = 0.1,
  rootMargin = "0px 0px -100px 0px",
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold, margin: rootMargin }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.25, 0, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

interface ScrollProgressProps {
  className?: string
  color?: string
  height?: number
}

export function ScrollProgress({
  className = "",
  color = "#3b82f6",
  height = 4,
}: ScrollProgressProps) {
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      style={{
        scaleX: scrollYProgress,
        height,
        backgroundColor: color,
        transformOrigin: "0%",
      }}
    />
  )
}
