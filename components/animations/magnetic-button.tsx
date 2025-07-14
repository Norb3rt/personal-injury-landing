"use client"

import { motion } from "framer-motion"
import { ReactNode, useRef, useState } from "react"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  disabled?: boolean
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return

    const { clientX, clientY } = e
    const { width, height, left, top } = ref.current.getBoundingClientRect()
    const x = (clientX - (left + width / 2)) * strength
    const y = (clientY - (top + height / 2)) * strength

    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {children}
    </motion.div>
  )
}

interface FloatingButtonProps {
  children: ReactNode
  className?: string
  hoverScale?: number
  tapScale?: number
}

export function FloatingButton({
  children,
  className = "",
  hoverScale = 1.05,
  tapScale = 0.95,
}: FloatingButtonProps) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      whileHover={{
        scale: hoverScale,
        y: -2,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      }}
      whileTap={{ scale: tapScale }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedButtonProps {
  children: ReactNode
  className?: string
  magneticStrength?: number
  hoverScale?: number
  tapScale?: number
  disabled?: boolean
}

export function AnimatedButton({
  children,
  className = "",
  magneticStrength = 0.2,
  hoverScale = 1.05,
  tapScale = 0.95,
  disabled = false,
}: AnimatedButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return

    const { clientX, clientY } = e
    const { width, height, left, top } = ref.current.getBoundingClientRect()
    const x = (clientX - (left + width / 2)) * magneticStrength
    const y = (clientY - (top + height / 2)) * magneticStrength

    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      whileHover={{
        scale: hoverScale,
        y: -2,
      }}
      whileTap={{ scale: tapScale }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.1,
      }}
    >
      {children}
    </motion.div>
  )
}
