"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface TypingEffectProps {
  text: string
  speed?: number
  className?: string
  showCursor?: boolean
  cursorClassName?: string
  onComplete?: () => void
}

export function TypingEffect({
  text,
  speed = 50,
  className = "",
  showCursor = true,
  cursorClassName = "",
  onComplete,
}: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <motion.span
          className={`inline-block ${cursorClassName}`}
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          |
        </motion.span>
      )}
    </span>
  )
}

interface AnimatedTextProps {
  text: string
  className?: string
  staggerDelay?: number
  once?: boolean
}

export function AnimatedText({
  text,
  className = "",
  staggerDelay = 0.03,
  once = true,
}: AnimatedTextProps) {
  const words = text.split(" ")

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-1"
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                ease: [0.25, 0.25, 0, 1],
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}
