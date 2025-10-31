"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

// Generate month names for the last 12 months
const getLastTwelveMonths = () => {
  const months = []
  const currentDate = new Date()

  for (let i = 11; i >= 0; i--) {
    const date = new Date()
    date.setMonth(currentDate.getMonth() - i)
    months.push(date.toLocaleString("default", { month: "short", year: "2-digit" }))
  }

  return months
}

// Mock data for the last 12 months of offer distribution
const generateOfferDistributionData = () => {
  const lastTwelveMonths = getLastTwelveMonths()
  return lastTwelveMonths.map((month, index) => {
    // Base values that increase over time
    const baseOffersMade = 600000 + index * 5000
    const baseOffersAccepted = 180000 + index * 8000 // Increasing faster than offers made

    // Add some randomness
    const offersMade = Math.round(baseOffersMade + (Math.random() * 20000 - 10000))
    const offersAccepted = Math.round(baseOffersAccepted + (Math.random() * 10000 - 5000))

    return {
      month,
      offersMade,
      offersAccepted,
      acceptanceRate: ((offersAccepted / offersMade) * 100).toFixed(1) + "%",
    }
  })
}

export function OfferDistributionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [chartData] = useState(generateOfferDistributionData())
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [isInitialized, setIsInitialized] = useState(false)
  const [renderAttempts, setRenderAttempts] = useState(0)

  // Function to measure container and set canvas dimensions
  const measureContainer = () => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    console.log("Offer Distribution Chart - Container dimensions:", rect)

    setContainerSize({ width: rect.width, height: rect.height })

    if (canvasRef.current) {
      canvasRef.current.width = rect.width || 300 // Fallback width
      canvasRef.current.height = rect.height || 200 // Fallback height
      console.log("Offer Distribution Chart - Canvas dimensions set to:", {
        width: canvasRef.current.width,
        height: canvasRef.current.height,
      })
    }
  }

  // Function to draw the chart
  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error("Offer Distribution Chart - Canvas ref is null")
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("Offer Distribution Chart - Could not get 2D context")
      return
    }

    // Ensure canvas dimensions are set
    if (canvas.width === 0 || canvas.height === 0) {
      console.warn("Offer Distribution Chart - Canvas has zero dimensions, measuring container")
      measureContainer()
      if (canvas.width === 0 || canvas.height === 0) {
        console.error("Offer Distribution Chart - Canvas still has zero dimensions after measuring")

        // Force minimum dimensions as a fallback
        canvas.width = 300
        canvas.height = 200
        console.log("Offer Distribution Chart - Forced minimum dimensions:", {
          width: canvas.width,
          height: canvas.height,
        })
      }
    }

    // Draw chart
    const months = chartData.map((d) => d.month)
    const offersMade = chartData.map((d) => d.offersMade)
    const offersAccepted = chartData.map((d) => d.offersAccepted)

    const maxValue = Math.max(...offersMade) * 1.1
    const chartHeight = canvas.height - 100 // Increased bottom margin for legend
    const chartWidth = canvas.width - 60
    const barWidth = (chartWidth / months.length / 3) * 0.8

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw a background to verify the canvas is active
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(40, 20)
    ctx.lineTo(40, chartHeight + 30)
    ctx.lineTo(canvas.width - 20, chartHeight + 30)
    ctx.strokeStyle = "#d1d5db" // Light gray
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw grid lines
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb" // Lighter gray
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 5; i++) {
      const y = chartHeight + 30 - (chartHeight / 5) * i
      ctx.moveTo(40, y)
      ctx.lineTo(canvas.width - 20, y)
    }
    ctx.stroke()

    // Draw bars for offers made
    offersMade.forEach((value, i) => {
      const x = 50 + i * (chartWidth / months.length)
      const barHeight = (value / maxValue) * chartHeight

      // Highlight hovered bar
      if (hoveredBar === i) {
        ctx.fillStyle = "#e11d48" // Brighter red for hover
      } else {
        ctx.fillStyle = "#c41f3e" // Default red
      }

      ctx.fillRect(x, chartHeight + 30 - barHeight, barWidth, barHeight)

      // Draw tooltip if hovered
      if (hoveredBar === i) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.fillRect(x - 40, chartHeight + 30 - barHeight - 30, 100, 25)
        ctx.fillStyle = "#ffffff"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`Offers: ${value.toLocaleString()}`, x + barWidth / 2, chartHeight + 30 - barHeight - 15)
      }
    })

    // Draw bars for offers accepted
    offersAccepted.forEach((value, i) => {
      const x = 50 + i * (chartWidth / months.length) + barWidth + 2
      const barHeight = (value / maxValue) * chartHeight

      // Highlight hovered bar
      if (hoveredBar === i) {
        ctx.fillStyle = "#16a34a" // Brighter green for hover
      } else {
        ctx.fillStyle = "#2e7d32" // Default green
      }

      ctx.fillRect(x, chartHeight + 30 - barHeight, barWidth, barHeight)

      // Draw tooltip if hovered
      if (hoveredBar === i) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.fillRect(x - 40, chartHeight + 30 - barHeight - 30, 100, 25)
        ctx.fillStyle = "#ffffff"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`Accepted: ${value.toLocaleString()}`, x + barWidth / 2, chartHeight + 30 - barHeight - 15)
      }
    })

    // Draw x-axis labels
    ctx.fillStyle = "#6b7280" // Gray
    ctx.font = "10px Arial"
    ctx.textAlign = "center"
    months.forEach((month, i) => {
      const x = 50 + i * (chartWidth / months.length) + barWidth
      ctx.fillText(month, x, chartHeight + 45)
    })

    // Draw y-axis labels
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxValue / 5) * i)
      const y = chartHeight + 30 - (value / maxValue) * chartHeight
      ctx.fillText(value.toLocaleString(), 35, y + 5)
    }

    // Draw legend at the bottom
    const legendY = chartHeight + 60
    const legendWidth = 200
    const legendHeight = 30
    const legendX = (canvas.width - legendWidth) / 2

    // Draw legend background
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight)
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight)

    // Offers Made legend
    ctx.fillStyle = "#c41f3e"
    ctx.fillRect(legendX + 20, legendY + 10, 15, 10)
    ctx.fillStyle = "#374151" // Dark gray
    ctx.textAlign = "left"
    ctx.font = "10px Arial"
    ctx.fillText("Offers Made", legendX + 40, legendY + 18)

    // Offers Accepted legend
    ctx.fillStyle = "#2e7d32"
    ctx.fillRect(legendX + 110, legendY + 10, 15, 10)
    ctx.fillStyle = "#374151"
    ctx.fillText("Offers Accepted", legendX + 130, legendY + 18)

    console.log("Offer Distribution Chart - Chart drawn successfully")
  }

  // Handle mouse move for hover effects
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const chartHeight = canvas.height - 100
    const chartWidth = canvas.width - 60
    const barGroupWidth = chartWidth / chartData.length

    // Check if mouse is over a bar
    if (x >= 50 && x <= canvas.width - 20 && y >= 20 && y <= chartHeight + 30) {
      const barIndex = Math.floor((x - 50) / barGroupWidth)
      if (barIndex >= 0 && barIndex < chartData.length) {
        setHoveredBar(barIndex)
      } else {
        setHoveredBar(null)
      }
    } else {
      setHoveredBar(null)
    }
  }

  const handleMouseLeave = () => {
    setHoveredBar(null)
  }

  // Initial setup
  useEffect(() => {
    console.log("Offer Distribution Chart - Initial setup")

    // Measure container and initialize canvas
    measureContainer()
    setIsInitialized(true)

    // Draw chart after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      console.log("Offer Distribution Chart - Initial draw attempt")
      drawChart()
      setRenderAttempts(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Set up resize observer
  useEffect(() => {
    if (!isInitialized) return

    console.log("Offer Distribution Chart - Setting up resize observer")

    const resizeObserver = new ResizeObserver(() => {
      console.log("Offer Distribution Chart - Container resized")
      measureContainer()
      drawChart()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Clean up
    return () => {
      resizeObserver.disconnect()
    }
  }, [isInitialized])

  // Redraw when hover state or container size changes
  useEffect(() => {
    if (isInitialized) {
      console.log("Offer Distribution Chart - Redrawing due to state change")
      drawChart()
    }
  }, [hoveredBar, containerSize, isInitialized])

  // Multiple render attempts as a fallback
  useEffect(() => {
    if (isInitialized && renderAttempts < 5) {
      const timer = setTimeout(() => {
        console.log(`Offer Distribution Chart - Render attempt ${renderAttempts + 1}`)
        measureContainer()
        drawChart()
        setRenderAttempts((prev) => prev + 1)
      }, 500 * renderAttempts) // Increasing delay for each attempt

      return () => clearTimeout(timer)
    }
  }, [renderAttempts, isInitialized])

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Offer Distribution (Last 12 Months)</h3>
        <div ref={containerRef} className="h-80 relative" style={{ minHeight: "320px" }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ display: "block" }} // Ensure canvas is displayed as block
          />
        </div>
      </CardContent>
    </Card>
  )
}
