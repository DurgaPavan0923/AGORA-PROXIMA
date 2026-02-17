"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  animate?: boolean
}

const sizeMap = {
  sm: { width: 32, height: 32, text: "text-lg" },
  md: { width: 48, height: 48, text: "text-xl" },
  lg: { width: 64, height: 64, text: "text-2xl" },
  xl: { width: 96, height: 96, text: "text-4xl" },
}

export function Logo({ size = "md", showText = true, className = "", animate = false }: LogoProps) {
  const dimensions = sizeMap[size]

  const LogoWrapper = animate ? motion.div : "div"
  const TextWrapper = animate ? motion.span : "span"

  return (
    <LogoWrapper
      className={`flex items-center gap-3 ${className}`}
      {...(animate
        ? {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.5, ease: "easeOut" },
          }
        : {})}
    >
      {/* Agora Logo House Icon */}
      <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-lg"
        >
          {/* Orange Left Side */}
          <path
            d="M98 197L250 120L250 270L103 347L98 197Z"
            fill="#FF9933"
            stroke="#FF9933"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          {/* Orange Pillar Lines */}
          <line x1="125" y1="220" x2="125" y2="320" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <line x1="155" y1="210" x2="155" y2="310" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <line x1="185" y1="200" x2="185" y2="300" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <line x1="215" y1="190" x2="215" y2="290" stroke="white" strokeWidth="8" strokeLinecap="round" />
          {/* Orange Circuit */}
          <circle cx="248" cy="145" r="8" fill="white" />
          <circle cx="188" cy="280" r="8" fill="white" />
          <line x1="248" y1="145" x2="188" y2="280" stroke="white" strokeWidth="3" />

          {/* Green Right Side */}
          <path
            d="M302 197L250 120L250 270L297 347L302 197Z"
            fill="#138808"
            stroke="#138808"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          {/* Green Pillar Lines */}
          <line x1="275" y1="220" x2="275" y2="320" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <line x1="305" y1="210" x2="305" y2="310" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <line x1="335" y1="200" x2="335" y2="300" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <line x1="365" y1="190" x2="365" y2="290" stroke="white" strokeWidth="8" strokeLinecap="round" />
          {/* Green Circuit */}
          <circle cx="328" cy="280" r="8" fill="white" />
          <line x1="248" y1="145" x2="328" y2="280" stroke="white" strokeWidth="3" />

          {/* Center Ballot Box */}
          <rect x="215" y="295" width="70" height="60" rx="4" fill="#003366" stroke="#003366" strokeWidth="4" />
          <path d="M230 310 L240 325 L260 305" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Top Roof */}
          <path d="M98 197 L250 120 L402 197" stroke="#FF9933" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M250 120 L402 197" stroke="#138808" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Base */}
          <rect x="103" y="347" width="194" height="15" rx="4" fill="#FF9933" />
          <rect x="297" y="347" width="105" height="15" rx="4" fill="#138808" />
        </svg>
      </div>

      {showText && (
        <TextWrapper
          className={`font-bold bg-gradient-to-r from-orange-600 via-blue-700 to-green-700 bg-clip-text text-transparent ${dimensions.text}`}
          {...(animate
            ? {
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.5, delay: 0.2, ease: "easeOut" },
              }
            : {})}
        >
          AGORA
        </TextWrapper>
      )}
    </LogoWrapper>
  )
}
