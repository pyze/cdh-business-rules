"use client"

import React, { useState, useEffect, useRef } from "react"
import { Dashboard } from "@/components/dashboard/dashboard"
import { DetailedMetrics } from "@/components/dashboard/detailed-metrics"
import { TrendAnalysis } from "@/components/dashboard/trend-analysis"
import { FallbackChart } from "@/components/dashboard/fallback-chart"
import { FloatingChatbot } from "@/components/floating-chatbot"
import { useDashboardContext } from "@/hooks/use-dashboard-context"

export function ClientDashboardWrapper() {
  const [isLoaded, setIsLoaded] = useState(false)
  const mountedRef = useRef(false)

  // Use dynamic dashboard context that updates automatically
  const { context: dashboardContext, updateActiveCharts, updateVisibleMetrics } = useDashboardContext()
  
  // Store dashboard context in localStorage for chatbot
  React.useEffect(() => {
    try {
      localStorage.setItem('dashboardContext', JSON.stringify(dashboardContext))
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [dashboardContext])

  // Use a more robust approach to ensure charts render properly
  useEffect(() => {
    // Mark component as mounted
    mountedRef.current = true

    // First delay to ensure DOM is ready
    const initialTimer = setTimeout(() => {
      if (mountedRef.current) {
        console.log("Initial timer completed, preparing to load charts")

        // Second delay to ensure browser has time to calculate layout
        const loadTimer = setTimeout(() => {
          if (mountedRef.current) {
            console.log("Load timer completed, setting isLoaded to true")
            setIsLoaded(true)
          }
        }, 500)

        return () => clearTimeout(loadTimer)
      }
    }, 300)

    return () => {
      clearTimeout(initialTimer)
      mountedRef.current = false
    }
  }, [])

  // Force a re-render after window resize
  useEffect(() => {
    const handleResize = () => {
      if (isLoaded) {
        console.log("Window resized, forcing chart re-render")
        setIsLoaded(false)
        setTimeout(() => {
          if (mountedRef.current) {
            setIsLoaded(true)
          }
        }, 300)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isLoaded])

  // Add direct DOM manipulation as a fallback
  useEffect(() => {
    if (isLoaded) {
      console.log("Charts loaded, checking if they rendered properly")

      // Check if charts are visible after a delay
      const checkTimer = setTimeout(() => {
        const charts = document.querySelectorAll("canvas")
        charts.forEach((canvas, index) => {
          const rect = canvas.getBoundingClientRect()
          console.log(`Chart ${index} dimensions:`, { width: rect.width, height: rect.height })

          // If canvas has no dimensions, try to force a redraw
          if (rect.width === 0 || rect.height === 0) {
            console.log(`Chart ${index} has no dimensions, forcing redraw`)
            const ctx = canvas.getContext("2d")
            if (ctx) {
              // Force a redraw by setting dimensions
              canvas.width = canvas.parentElement?.clientWidth || 300
              canvas.height = canvas.parentElement?.clientHeight || 200

              // Draw a simple indicator to show the canvas is active
              ctx.fillStyle = "#f0f0f0"
              ctx.fillRect(0, 0, canvas.width, canvas.height)
              ctx.fillStyle = "#c41f3e"
              ctx.font = "14px Arial"
              ctx.textAlign = "center"
              ctx.fillText("Chart is loading...", canvas.width / 2, canvas.height / 2)
            }
          }
        })
      }, 1000)

      return () => clearTimeout(checkTimer)
    }
  }, [isLoaded])

  return (
    <>
      <Dashboard isLoaded={isLoaded} />

      {/* Trend Analysis moved to Dashboard component */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <DetailedMetrics category="performance" />
        <DetailedMetrics category="optimization" />
      </div>

      {/* Add floating chatbot */}
      <FloatingChatbot />
    </>
  )
}
