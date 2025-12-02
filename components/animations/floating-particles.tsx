"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface FloatingParticlesProps {
  count?: number
  className?: string
  particleColor?: string
  minSize?: number
  maxSize?: number
  minDuration?: number
  maxDuration?: number
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  animationX: number
}

// Seeded random number generator for consistent values
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

// Generate particles with fixed seed - only called on client
function generateParticles(
  count: number,
  minSize: number,
  maxSize: number,
  minDuration: number,
  maxDuration: number
): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.round(seededRandom(i * 1) * 10000) / 100,
    y: Math.round(seededRandom(i * 2) * 10000) / 100,
    size: Math.round((seededRandom(i * 3) * (maxSize - minSize) + minSize) * 100) / 100,
    duration: Math.round((seededRandom(i * 4) * (maxDuration - minDuration) + minDuration) * 100) / 100,
    delay: Math.round(seededRandom(i * 5) * 500) / 100,
    animationX: Math.round((seededRandom(i * 6) * 20 - 10) * 100) / 100,
  }))
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
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Only generate particles on the client side to avoid hydration mismatch
    setParticles(generateParticles(count, minSize, maxSize, minDuration, maxDuration))
  }, [count, minSize, maxSize, minDuration, maxDuration])

  // Render empty container on server, particles only appear after hydration
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
            x: [0, particle.animationX, 0],
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
