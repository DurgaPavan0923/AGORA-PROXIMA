import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { TestDataInitializer } from "@/components/test-data-initializer"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Agora - Citizen Governance Platform",
  description:
    "Transparent, secure, and inclusive digital governance powered by blockchain. Participate in local decisions with verified voting.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <CHANGE> Voice assistant support */}
        <script async src="https://cdn.jsdelivr.net/npm/web-speech-api@0.0.1/speech.js"></script>
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <TestDataInitializer />
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
