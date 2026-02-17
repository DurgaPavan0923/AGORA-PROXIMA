"use client"

import { motion } from "framer-motion"
import { Button, ButtonProps } from "@/components/ui/button"
import { forwardRef } from "react"

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
        <Button ref={ref} {...props}>
          {children}
        </Button>
      </motion.div>
    )
  }
)

AnimatedButton.displayName = "AnimatedButton"

export const PulseButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(({ children, ...props }, ref) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <Button ref={ref} {...props}>
        {children}
      </Button>
    </motion.div>
  )
})

PulseButton.displayName = "PulseButton"

export const ShimmerButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(({ children, ...props }, ref) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden"
    >
      <Button ref={ref} {...props} className={`relative overflow-hidden ${props.className || ""}`}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "linear",
          }}
        />
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  )
})

ShimmerButton.displayName = "ShimmerButton"
