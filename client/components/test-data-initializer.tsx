"use client"

import { useEffect } from "react"
import { initializeTestData } from "@/lib/init-test-data"

/**
 * Component to initialize test data on app load
 * Only runs in development mode
 */
export function TestDataInitializer() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      initializeTestData()
    }
  }, [])

  return null
}
