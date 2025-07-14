"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

interface FloatingParticlesProps {
  count?: number
  className?: string
  particleColor?: string
  minSize?: number
  maxSize?: number
  minDuration?: number
  maxDuration?: number
}

export function FloatingParticles({
  count = 50,
  className = "",
  particleColor = "rgba(255, 255, 255, 0.1)",
  minSize = 2,
  maxSize = 6,
  minDuration = 10,
  maxDuration = 20,
}: FloatingParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (maxSize - minSize) + minSize,
      duration: Math.random() * (maxDuration - minDuration) + minDuration,
      delay: Math.random() * 5,
    }))
  }, [count, minSize, maxSize, minDuration, maxDuration])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particleColor,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

interface GlowEffectProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  intensity?: number
}

export function GlowEffect({
  children,
  className = "",
  glowColor = "rgba(59, 130, 246, 0.5)",
  intensity = 1,
}: GlowEffectProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        filter: `drop-shadow(0 0 ${20 * intensity}px ${glowColor})`,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}
