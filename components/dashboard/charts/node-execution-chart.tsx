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

// Mock data for the last 12 months of node execution time
const generateNodeExecutionTimeData = () => {
  const lastTwelveMonths = getLastTwelveMonths()
  return lastTwelveMonths.map((month, index) => {
    // Base execution time that decreases over time (optimization)
    const baseExecutionTime = 320 - index * 5

    // Add some randomness but ensure the trend is downward
    const executionTime = Math.max(180, Math.round(baseExecutionTime + (Math.random() * 20 - 10)))

    return {
      month,
      NBA_AllIssues_E_Account: executionTime,
      "Offer Collector": executionTime - 20 + (Math.random() * 40 - 20),
      "Suitability Check": executionTime - 40 + (Math.random() * 30 - 15),
      "Best Result": executionTime - 60 + (Math.random() * 20 - 10),
      average: executionTime - 30 + (Math.random() * 15 - 7.5),
    }
  })
}

export function NodeExecutionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [chartData] = useState(generateNodeExecutionTimeData())
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; nodeType: string } | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [isInitialized, setIsInitialized] = useState(false)

  const nodeTypes = ["NBA_AllIssues_E_Account", "Offer Collector", "Suitability Check", "Best Result", "average"]
  const colors = ["#c41f3e", "#ff9800", "#2196f3", "#9c27b0", "#000000"]
  const maxValue = 350 // ms

  // Function to measure container and set canvas dimensions
  const measureContainer = () => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    setContainerSize({ width: rect.width, height: rect.height })

    if (canvasRef.current) {
      canvasRef.current.width = rect.width
      canvasRef.current.height = rect.height
    }
  }

  // Function to draw the chart
  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ensure canvas dimensions are set
    if (canvas.width === 0 || canvas.height === 0) {
      measureContainer()
      if (canvas.width === 0 || canvas.height === 0) return // Still not ready
    }

    // Draw chart
    const months = chartData.map((d) => d.month)
    const chartHeight = canvas.height - 100 // Increased bottom margin for legend
    const chartWidth = canvas.width - 60

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

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
    for (let i = 0; i <= 7; i++) {
      const y = chartHeight + 30 - (chartHeight / 7) * i
      ctx.moveTo(40, y)
      ctx.lineTo(canvas.width - 20, y)
    }
    ctx.stroke()

    // Draw lines for each node type
    nodeTypes.forEach((nodeType, typeIndex) => {
      ctx.strokeStyle = colors[typeIndex]
      ctx.lineWidth = nodeType === "average" ? 3 : 2
      ctx.beginPath()

      chartData.forEach((item, i) => {
        const x = 50 + i * (chartWidth / (months.length - 1))
        const y = chartHeight + 30 - (Number(item[nodeType as keyof typeof item]) / maxValue) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw points
      chartData.forEach((item, i) => {
        const x = 50 + i * (chartWidth / (months.length - 1))
        const y = chartHeight + 30 - (Number(item[nodeType as keyof typeof item]) / maxValue) * chartHeight

        ctx.fillStyle = colors[typeIndex]
        ctx.beginPath()

        // Highlight hovered point
        const isHovered = hoveredPoint && hoveredPoint.index === i && hoveredPoint.nodeType === nodeType
        const pointRadius = isHovered ? 6 : nodeType === "average" ? 4 : 3

        ctx.arc(x, y, pointRadius, 0, Math.PI * 2)
        ctx.fill()

        // Draw tooltip if hovered
        if (isHovered) {
          const value = item[nodeType as keyof typeof item]
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
          ctx.fillRect(x - 50, y - 30, 100, 25)
          ctx.fillStyle = "#ffffff"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          ctx.fillText(`${nodeType}: ${Math.round(value as number)} ms`, x, y - 15)
        }
      })
    })

    // Draw x-axis labels
    ctx.fillStyle = "#6b7280" // Gray
    ctx.font = "10px Arial"
    ctx.textAlign = "center"
    months.forEach((month, i) => {
      if (i % 2 === 0) {
        // Show every other month to avoid crowding
        const x = 50 + i * (chartWidth / (months.length - 1))
        ctx.fillText(month, x, chartHeight + 45)
      }
    })

    // Draw y-axis labels
    ctx.textAlign = "right"
    for (let i = 0; i <= 7; i++) {
      const value = (maxValue / 7) * i
      const y = chartHeight + 30 - (value / maxValue) * chartHeight
      ctx.fillText(`${Math.round(value)} ms`, 35, y + 5)
    }

    // Draw legend in two rows at the bottom to prevent overlapping
    const legendY = chartHeight + 55
    const legendWidth = canvas.width - 80
    const legendHeight = 50 // Increased height for two rows
    const legendX = 40

    // Draw legend background
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight)
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight)

    // First row: first 3 items
    const firstRowItems = nodeTypes.slice(0, 3)
    const firstRowItemWidth = legendWidth / firstRowItems.length

    firstRowItems.forEach((nodeType, i) => {
      const x = legendX + i * firstRowItemWidth + 10
      const displayName = nodeType === "NBA_AllIssues_E_Account" ? "NBA_AllIssues" : nodeType

      // Draw line
      ctx.strokeStyle = colors[i]
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, legendY + 15)
      ctx.lineTo(x + 15, legendY + 15)
      ctx.stroke()

      // Draw point
      ctx.fillStyle = colors[i]
      ctx.beginPath()
      ctx.arc(x + 7.5, legendY + 15, 3, 0, Math.PI * 2)
      ctx.fill()

      // Draw label
      ctx.fillStyle = "#374151" // Dark gray
      ctx.textAlign = "left"
      ctx.font = "9px Arial"
      ctx.fillText(displayName, x + 20, legendY + 18)
    })

    // Second row: remaining items
    const secondRowItems = nodeTypes.slice(3)
    const secondRowItemWidth = legendWidth / secondRowItems.length

    secondRowItems.forEach((nodeType, i) => {
      const x = legendX + i * secondRowItemWidth + 10
      const displayName = nodeType === "average" ? "Average (All Nodes)" : nodeType

      // Draw line
      ctx.strokeStyle = colors[i + 3]
      ctx.lineWidth = nodeType === "average" ? 3 : 2
      ctx.beginPath()
      ctx.moveTo(x, legendY + 35)
      ctx.lineTo(x + 15, legendY + 35)
      ctx.stroke()

      // Draw point
      ctx.fillStyle = colors[i + 3]
      ctx.beginPath()
      ctx.arc(x + 7.5, legendY + 35, nodeType === "average" ? 4 : 3, 0, Math.PI * 2)
      ctx.fill()

      // Draw label
      ctx.fillStyle = "#374151" // Dark gray
      ctx.textAlign = "left"
      ctx.font = "9px Arial"
      ctx.fillText(displayName, x + 20, legendY + 38)
    })
  }

  // Handle mouse move for hover effects
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const chartHeight = canvas.height - 100
    const chartWidth = canvas.width - 60

    // Check if mouse is over a point
    if (mouseX >= 50 && mouseX <= canvas.width - 20 && mouseY >= 20 && mouseY <= chartHeight + 30) {
      // Find the closest month index
      const monthWidth = chartWidth / (chartData.length - 1)
      const closestMonthIndex = Math.round((mouseX - 50) / monthWidth)

      if (closestMonthIndex >= 0 && closestMonthIndex < chartData.length) {
        // Find the closest node type
        let closestNodeType = nodeTypes[0]
        let closestDistance = Number.POSITIVE_INFINITY

        nodeTypes.forEach((nodeType) => {
          const item = chartData[closestMonthIndex]
          const x = 50 + closestMonthIndex * (chartWidth / (chartData.length - 1))
          const y = chartHeight + 30 - (Number(item[nodeType as keyof typeof item]) / maxValue) * chartHeight

          const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2))

          if (distance < closestDistance && distance < 20) {
            // Only consider points within 20px
            closestDistance = distance
            closestNodeType = nodeType
          }
        })

        if (closestDistance < 20) {
          setHoveredPoint({ index: closestMonthIndex, nodeType: closestNodeType })
        } else {
          setHoveredPoint(null)
        }
      } else {
        setHoveredPoint(null)
      }
    } else {
      setHoveredPoint(null)
    }
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
  }

  // Initial setup
  useEffect(() => {
    // Measure container and initialize canvas
    measureContainer()
    setIsInitialized(true)

    // Draw chart after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      drawChart()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Set up resize observer
  useEffect(() => {
    if (!isInitialized) return

    const resizeObserver = new ResizeObserver(() => {
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
      drawChart()
    }
  }, [hoveredPoint, containerSize, isInitialized])

  // Add console logging for debugging
  useEffect(() => {
    console.log("Node Execution Chart - Container size:", containerSize)
    console.log("Node Execution Chart - Is initialized:", isInitialized)
    if (canvasRef.current) {
      console.log("Node Execution Chart - Canvas dimensions:", {
        width: canvasRef.current.width,
        height: canvasRef.current.height,
      })
    }
  }, [containerSize, isInitialized])

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Node Execution Time Trend (Last 12 Months)</h3>
        <div ref={containerRef} className="h-80 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </CardContent>
    </Card>
  )
}
