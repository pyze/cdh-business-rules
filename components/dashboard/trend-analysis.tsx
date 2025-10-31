"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

// Category-specific data generators
const generateCategoryData = (category?: string) => {
  const lastTwelveMonths = getLastTwelveMonths()
  
  switch (category) {
    case 'governance':
      return {
        lineChart: lastTwelveMonths.map((month, index) => ({
          month,
          "Rules Overlap": 22 - index * 0.3 + (Math.random() * 2 - 1),
          "External Dependencies": 28 + index * 0.4 + (Math.random() * 2 - 1),
          "RACI Coverage": 65 + index * 1.2 + (Math.random() * 3 - 1.5),
        })),
        pieChart: [
          { name: "Well Documented", value: 6372, color: "#4caf50" },
          { name: "Partially Documented", value: 1856, color: "#ff9800" },
          { name: "Missing Documentation", value: 572, color: "#f44336" },
        ],
        title1: "Governance Metrics Over Time (%)",
        title2: "Documentation Status Distribution"
      }
    
    case 'performance':
      return {
        lineChart: lastTwelveMonths.map((month, index) => ({
          month,
          "Execution Time": 280 - index * 3 + (Math.random() * 10 - 5),
          "Cache Hit Rate": 62 + index * 0.8 + (Math.random() * 3 - 1.5),
          "Error Rate": 0.8 - index * 0.05 + (Math.random() * 0.2 - 0.1),
        })),
        pieChart: [
          { name: "Cache Hits", value: 5494000, color: "#4caf50" },
          { name: "Cache Misses", value: 2706000, color: "#ff9800" },
        ],
        title1: "Performance Metrics Over Time",
        title2: "Cache Performance Distribution"
      }

    case 'optimization':
      return {
        lineChart: lastTwelveMonths.map((month, index) => ({
          month,
          "Conversion Rate": 22 + index * 0.3 + (Math.random() * 2 - 1),
          "Acceptance Rate": 30 + index * 0.2 + (Math.random() * 2 - 1),
          "Propensity Score": 0.72 + index * 0.02 + (Math.random() * 0.05 - 0.025),
        })),
        pieChart: [
          { name: "Accepted Offers", value: 204600, color: "#4caf50" },
          { name: "Declined Offers", value: 455400, color: "#f44336" },
        ],
        title1: "Optimization Metrics Over Time (%)",
        title2: "Offer Acceptance Distribution"
      }

    case 'compliance':
      return {
        lineChart: lastTwelveMonths.map((month, index) => ({
          month,
          "Simulation Coverage": 58 + index * 0.8 + (Math.random() * 3 - 1.5),
          "Static Rules": 75 - index * 0.1 + (Math.random() * 2 - 1),
          "Dynamic Rules": 25 + index * 0.1 + (Math.random() * 2 - 1),
        })),
        pieChart: [
          { name: "Static Rules", value: 6300, color: "#2196f3" },
          { name: "Dynamic Rules", value: 2100, color: "#ff9800" },
        ],
        title1: "Compliance Metrics Over Time (%)",
        title2: "Rule Type Distribution"
      }

    default:
      // All categories - original data
      return {
        lineChart: lastTwelveMonths.map((month, index) => ({
          month,
          Premium: 35 + index * 0.5 + (Math.random() * 3 - 1.5),
          Standard: 25 + index * 0.4 + (Math.random() * 3 - 1.5),
          Basic: 18 + index * 0.3 + (Math.random() * 3 - 1.5),
        })),
        pieChart: [
          { name: "Platinum Card", value: 124500, color: "#c41f3e" },
          { name: "Gold Card", value: 198000, color: "#ff9800" },
          { name: "Travel Rewards", value: 165000, color: "#2196f3" },
          { name: "Cash Back", value: 112500, color: "#4caf50" },
          { name: "Low Interest", value: 60000, color: "#9c27b0" },
        ],
        title1: "Acceptance Rate by Segment (%)",
        title2: "Offer Distribution by Type"
      }
  }
}

// Generate consistent channel effectiveness data for all categories
const generateChannelEffectivenessData = () => {
  const lastTwelveMonths = getLastTwelveMonths()
  return lastTwelveMonths.map((month, index) => {
    return {
      month,
      Mobile: 40 + index * 0.6 + (Math.random() * 4 - 2),
      Web: 30 + index * 0.4 + (Math.random() * 4 - 2),
      Email: 25 + index * 0.2 + (Math.random() * 4 - 2),
      Branch: 20 + index * 0.1 + (Math.random() * 4 - 2),
    }
  })
}

interface TrendAnalysisProps {
  category?: string | undefined
}

export function TrendAnalysis({ category }: TrendAnalysisProps = {}) {
  const acceptanceChartRef = useRef<HTMLCanvasElement>(null)
  const acceptanceContainerRef = useRef<HTMLDivElement>(null)
  const pieChartRef = useRef<HTMLCanvasElement>(null)
  const pieContainerRef = useRef<HTMLDivElement>(null)
  const channelChartRef = useRef<HTMLCanvasElement>(null)
  const channelContainerRef = useRef<HTMLDivElement>(null)

  // Generate category-specific data (reactive to category changes)
  const [acceptanceData, setAcceptanceData] = useState(() => generateCategoryData(category).lineChart)
  const [distributionData, setDistributionData] = useState(() => generateCategoryData(category).pieChart)
  const [channelData] = useState(generateChannelEffectivenessData())
  const [chartTitles, setChartTitles] = useState(() => {
    const categoryData = generateCategoryData(category)
    return { title1: categoryData.title1, title2: categoryData.title2 }
  })

  // Update data when category changes
  useEffect(() => {
    const categoryData = generateCategoryData(category)
    setAcceptanceData(categoryData.lineChart)
    setDistributionData(categoryData.pieChart)
    setChartTitles({ title1: categoryData.title1, title2: categoryData.title2 })
  }, [category])

  const [hoveredSegmentPoint, setHoveredSegmentPoint] = useState<{ index: number; segment: string } | null>(null)
  const [hoveredPieSlice, setHoveredPieSlice] = useState<number | null>(null)
  const [hoveredChannelPoint, setHoveredChannelPoint] = useState<{ index: number; channel: string } | null>(null)

  const [isInitialized, setIsInitialized] = useState(false)

  // Function to measure container and set canvas dimensions
  const measureContainers = () => {
    // Acceptance chart
    if (acceptanceContainerRef.current && acceptanceChartRef.current) {
      const rect = acceptanceContainerRef.current.getBoundingClientRect()
      acceptanceChartRef.current.width = rect.width
      acceptanceChartRef.current.height = rect.height
    }

    // Pie chart
    if (pieContainerRef.current && pieChartRef.current) {
      const rect = pieContainerRef.current.getBoundingClientRect()
      pieChartRef.current.width = rect.width
      pieChartRef.current.height = rect.height
    }

    // Channel chart
    if (channelContainerRef.current && channelChartRef.current) {
      const rect = channelContainerRef.current.getBoundingClientRect()
      channelChartRef.current.width = rect.width
      channelChartRef.current.height = rect.height
    }
  }

  // Draw acceptance rate chart
  const drawAcceptanceChart = () => {
    const canvas = acceptanceChartRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ensure canvas dimensions are set
    if (canvas.width === 0 || canvas.height === 0) {
      if (acceptanceContainerRef.current) {
        const rect = acceptanceContainerRef.current.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
      }
      if (canvas.width === 0 || canvas.height === 0) return // Still not ready
    }

    // Draw chart
    const months = acceptanceData.map((d) => d.month)
    const segments = Object.keys(acceptanceData[0] || {}).filter(key => key !== 'month')
    const colors = ["#c41f3e", "#ff9800", "#2196f3", "#4caf50", "#9c27b0"]

    // Calculate dynamic max value based on data
    const allValues = acceptanceData.flatMap(item => 
      segments.map(segment => Number(item[segment as keyof typeof item]) || 0)
    )
    const dataMax = Math.max(...allValues)
    const maxValue = category === 'performance' && segments.includes('Execution Time') 
      ? Math.ceil(dataMax / 50) * 50  // Round up to nearest 50 for execution time
      : Math.ceil(dataMax / 10) * 10  // Round up to nearest 10 for percentages
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
    for (let i = 0; i <= 5; i++) {
      const y = chartHeight + 30 - (chartHeight / 5) * i
      ctx.moveTo(40, y)
      ctx.lineTo(canvas.width - 20, y)
    }
    ctx.stroke()

    // Draw lines for each segment
    segments.forEach((segment, segmentIndex) => {
      ctx.strokeStyle = colors[segmentIndex]
      ctx.lineWidth = 2
      ctx.beginPath()

      acceptanceData.forEach((item, i) => {
        const x = 50 + i * (chartWidth / (months.length - 1))
        const y = chartHeight + 30 - (Number(item[segment as keyof typeof item]) / maxValue) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw points
      acceptanceData.forEach((item, i) => {
        const x = 50 + i * (chartWidth / (months.length - 1))
        const y = chartHeight + 30 - (Number(item[segment as keyof typeof item]) / maxValue) * chartHeight

        ctx.fillStyle = colors[segmentIndex]
        ctx.beginPath()

        // Highlight hovered point
        const isHovered =
          hoveredSegmentPoint && hoveredSegmentPoint.index === i && hoveredSegmentPoint.segment === segment
        const pointRadius = isHovered ? 5 : 3

        ctx.arc(x, y, pointRadius, 0, Math.PI * 2)
        ctx.fill()

        // Draw tooltip if hovered
        if (isHovered) {
          const value = item[segment as keyof typeof item]
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
          ctx.fillRect(x - 50, y - 30, 100, 25)
          ctx.fillStyle = "#ffffff"
          ctx.font = "10px Arial"
          ctx.textAlign = "center"
          ctx.fillText(`${segment}: ${(value as number).toFixed(1)}%`, x, y - 15)
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
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * i
      const y = chartHeight + 30 - (value / maxValue) * chartHeight
      ctx.fillText(`${value}%`, 35, y + 5)
    }

    // Draw legend at the bottom
    const legendY = chartHeight + 60
    const legendWidth = canvas.width - 80
    const legendHeight = 30
    const legendX = 40

    // Draw legend background
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight)
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight)

    // Calculate spacing for legend items
    const itemWidth = legendWidth / segments.length

    // Draw legend items
    segments.forEach((segment, i) => {
      const x = legendX + i * itemWidth + 10

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
      ctx.font = "10px Arial"
      ctx.fillText(segment, x + 20, legendY + 18)
    })
  }

  // Handle mouse move for acceptance chart
  const handleAcceptanceMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = acceptanceChartRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const chartHeight = canvas.height - 100
    const chartWidth = canvas.width - 60

    // Check if mouse is over a point
    if (mouseX >= 50 && mouseX <= canvas.width - 20 && mouseY >= 20 && mouseY <= chartHeight + 30) {
      // Find the closest month index
      const monthWidth = chartWidth / (acceptanceData.length - 1)
      const closestMonthIndex = Math.round((mouseX - 50) / monthWidth)

      if (closestMonthIndex >= 0 && closestMonthIndex < acceptanceData.length) {
        // Find the closest segment
        const segments = Object.keys(acceptanceData[0] || {}).filter(key => key !== 'month')
        let closestSegment = segments[0] || ""
        let closestDistance = Number.POSITIVE_INFINITY
        segments.forEach((segment) => {
          const item = acceptanceData[closestMonthIndex]
          const x = 50 + closestMonthIndex * (chartWidth / (acceptanceData.length - 1))
          // Calculate dynamic max value for mouse hover
          const allValues = acceptanceData.flatMap(dataItem => 
            Object.keys(dataItem).filter(key => key !== 'month').map(seg => Number(dataItem[seg as keyof typeof dataItem]) || 0)
          )
          const dataMax = Math.max(...allValues)
          const maxValue = category === 'performance' && Object.keys(acceptanceData[0] || {}).includes('Execution Time') 
            ? Math.ceil(dataMax / 50) * 50
            : Math.ceil(dataMax / 10) * 10
          
          const y = chartHeight + 30 - (Number(item[segment as keyof typeof item]) / maxValue) * chartHeight

          const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2))

          if (distance < closestDistance && distance < 20) {
            // Only consider points within 20px
            closestDistance = distance
            closestSegment = segment
          }
        })

        if (closestDistance < 20) {
          setHoveredSegmentPoint({ index: closestMonthIndex, segment: closestSegment })
        } else {
          setHoveredSegmentPoint(null)
        }
      } else {
        setHoveredSegmentPoint(null)
      }
    } else {
      setHoveredSegmentPoint(null)
    }
  }

  // Draw pie chart
  const drawPieChart = () => {
    const canvas = pieChartRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ensure canvas dimensions are set
    if (canvas.width === 0 || canvas.height === 0) {
      if (pieContainerRef.current) {
        const rect = pieContainerRef.current.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
      }
      if (canvas.width === 0 || canvas.height === 0) return // Still not ready
    }

    // Calculate total for percentages
    const total = distributionData.reduce((sum, item) => sum + item.value, 0)

    // Draw pie chart
    const centerX = canvas.width / 2
    const centerY = (canvas.height - 40) / 2 // Adjust for legend at bottom
    const radius = Math.min(centerX, centerY) - 40

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let startAngle = 0
    distributionData.forEach((item, index) => {
      // Calculate angle
      const angle = (item.value / total) * Math.PI * 2

      // Draw pie slice
      ctx.fillStyle =
        hoveredPieSlice === index
          ? adjustColor(item.color, 20)
          : // Lighten color when hovered
            item.color
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + angle)
      ctx.closePath()
      ctx.fill()

      // Calculate label position
      const labelAngle = startAngle + angle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      // Draw percentage label
      const percentage = Math.round((item.value / total) * 100)
      ctx.fillStyle = "#fff"
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      if (percentage > 5) {
        // Only show label if slice is big enough
        ctx.fillText(percentage + "%", labelX, labelY)
      }

      // Draw tooltip if hovered
      if (hoveredPieSlice === index) {
        const tooltipX = centerX + Math.cos(labelAngle) * (radius + 20)
        const tooltipY = centerY + Math.sin(labelAngle) * (radius + 20)

        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.fillRect(tooltipX - 70, tooltipY - 15, 140, 30)
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px Arial"
        ctx.fillText(`${item.name}: ${item.value.toLocaleString()}`, tooltipX, tooltipY)
      }

      startAngle += angle
    })

    // Draw legend at the bottom
    const legendY = canvas.height - 30
    const legendWidth = canvas.width - 40
    const legendHeight = 25
    const legendX = 20

    // Draw legend background
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight)
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight)

    // Calculate spacing for legend items
    const itemWidth = legendWidth / distributionData.length

    // Draw legend items
    distributionData.forEach((item, i) => {
      const x = legendX + i * itemWidth + 5

      // Draw color box
      ctx.fillStyle = hoveredPieSlice === i ? adjustColor(item.color, 20) : item.color
      ctx.fillRect(x, legendY + 7.5, 10, 10)

      // Draw label
      ctx.fillStyle = "#374151" // Dark gray
      ctx.font = "8px Arial"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      // Truncate name if too long
      const displayName = item.name.length > 10 ? item.name.substring(0, 8) + "..." : item.name
      ctx.fillText(displayName, x + 15, legendY + 12.5)
    })
  }

  // Handle mouse move for pie chart
  const handlePieMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = pieChartRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const centerX = canvas.width / 2
    const centerY = (canvas.height - 40) / 2
    const radius = Math.min(centerX, centerY) - 40

    // Calculate distance from center
    const distanceFromCenter = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2))

    // Check if mouse is over the pie
    if (distanceFromCenter <= radius) {
      // Calculate angle
      let angle = Math.atan2(mouseY - centerY, mouseX - centerX)
      if (angle < 0) angle += Math.PI * 2 // Convert to 0-2π range

      // Calculate total for percentages
      const total = distributionData.reduce((sum, item) => sum + item.value, 0)

      // Find which slice the angle corresponds to
      let startAngle = 0
      for (let i = 0; i < distributionData.length; i++) {
        const sliceAngle = (distributionData[i].value / total) * Math.PI * 2
        if (angle >= startAngle && angle < startAngle + sliceAngle) {
          setHoveredPieSlice(i)
          return
        }
        startAngle += sliceAngle
      }
    } else {
      // Check if mouse is over legend
      const legendY = canvas.height - 30
      const legendWidth = canvas.width - 40
      const legendX = 20
      const legendHeight = 25

      if (
        mouseY >= legendY &&
        mouseY <= legendY + legendHeight &&
        mouseX >= legendX &&
        mouseX <= legendX + legendWidth
      ) {
        // Calculate which legend item is hovered
        const itemWidth = legendWidth / distributionData.length
        const index = Math.floor((mouseX - legendX) / itemWidth)

        if (index >= 0 && index < distributionData.length) {
          setHoveredPieSlice(index)
          return
        }
      }

      setHoveredPieSlice(null)
    }
  }

  // Draw channel effectiveness chart
  const drawChannelChart = () => {
    const canvas = channelChartRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ensure canvas dimensions are set
    if (canvas.width === 0 || canvas.height === 0) {
      if (channelContainerRef.current) {
        const rect = channelContainerRef.current.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height
      }
      if (canvas.width === 0 || canvas.height === 0) return // Still not ready
    }

    // Draw chart
    const months = channelData.map((d) => d.month)
    const channels = ["Mobile", "Web", "Email", "Branch"]
    const colors = ["#c41f3e", "#ff9800", "#2196f3", "#4caf50"]

    const maxValue = 60 // %
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
    for (let i = 0; i <= 6; i++) {
      const y = chartHeight + 30 - (chartHeight / 6) * i
      ctx.moveTo(40, y)
      ctx.lineTo(canvas.width - 20, y)
    }
    ctx.stroke()

    // Draw stacked area chart
    channels.forEach((channel, channelIndex) => {
      ctx.fillStyle = colors[channelIndex]

      // Create path for this channel's area
      ctx.beginPath()

      // Start at the bottom left
      ctx.moveTo(50, chartHeight + 30)

      // Draw the bottom line (previous channel's top or x-axis)
      channelData.forEach((item, i) => {
        const x = 50 + i * (chartWidth / (months.length - 1))
        let y = chartHeight + 30

        // Subtract heights of previous channels
        for (let j = 0; j < channelIndex; j++) {
          y -= (Number(item[channels[j] as keyof typeof item]) / maxValue) * chartHeight
        }

        ctx.lineTo(x, y)
      })

      // Draw the top line (this channel's values)
      for (let i = channelData.length - 1; i >= 0; i--) {
        const x = 50 + i * (chartWidth / (months.length - 1))
        let y = chartHeight + 30

        // Subtract heights of previous channels and this channel
        for (let j = 0; j <= channelIndex; j++) {
          y -= (Number(channelData[i][channels[j] as keyof (typeof channelData)[0]]) / maxValue) * chartHeight
        }

        ctx.lineTo(x, y)
      }

      // Close the path and fill
      ctx.closePath()
      ctx.globalAlpha = 0.7 // Make it semi-transparent
      ctx.fill()
      ctx.globalAlpha = 1.0
    })

    // Draw hover indicators and tooltips
    if (hoveredChannelPoint) {
      const { index, channel } = hoveredChannelPoint
      const x = 50 + index * (chartWidth / (months.length - 1))

      // Draw vertical line at hovered month
      ctx.beginPath()
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
      ctx.setLineDash([5, 3])
      ctx.moveTo(x, 20)
      ctx.lineTo(x, chartHeight + 30)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw tooltip
      const item = channelData[index]
      let y = chartHeight + 30

      // Calculate y position for the specific channel
      for (let j = 0; j <= channels.indexOf(channel); j++) {
        y -= (Number(item[channels[j] as keyof typeof item]) / maxValue) * chartHeight
      }

      // Draw tooltip
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.fillRect(x - 60, y - 30, 120, 25)
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${channel}: ${(item[channel as keyof typeof item] as number).toFixed(1)}%`, x, y - 15)
    }

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
    for (let i = 0; i <= 6; i++) {
      const value = (maxValue / 6) * i
      const y = chartHeight + 30 - (value / maxValue) * chartHeight
      ctx.fillText(`${value}%`, 35, y + 5)
    }

    // Draw legend at the bottom
    const legendY = chartHeight + 60
    const legendWidth = canvas.width - 80
    const legendHeight = 30
    const legendX = 40

    // Draw legend background
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight)
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight)

    // Calculate spacing for legend items
    const itemWidth = legendWidth / channels.length

    // Draw legend items
    channels.forEach((channel, i) => {
      const x = legendX + i * itemWidth + 10

      // Draw color box
      ctx.fillStyle = colors[i]
      ctx.fillRect(x, legendY + 10, 15, 10)

      // Draw label
      ctx.fillStyle = "#374151" // Dark gray
      ctx.font = "10px Arial"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(channel, x + 20, legendY + 15)
    })
  }

  // Handle mouse move for channel chart
  const handleChannelMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = channelChartRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const chartHeight = canvas.height - 100
    const chartWidth = canvas.width - 60

    // Check if mouse is over the chart area
    if (mouseX >= 50 && mouseX <= canvas.width - 20 && mouseY >= 20 && mouseY <= chartHeight + 30) {
      // Find the closest month index
      const monthWidth = chartWidth / (channelData.length - 1)
      const closestMonthIndex = Math.round((mouseX - 50) / monthWidth)

      if (closestMonthIndex >= 0 && closestMonthIndex < channelData.length) {
        const item = channelData[closestMonthIndex]
        const channels = ["Mobile", "Web", "Email", "Branch"]

        // Find which channel area contains the mouse
        let y = chartHeight + 30
        let foundChannel = null

        for (let i = 0; i < channels.length; i++) {
          const channelHeight = (Number(item[channels[i] as keyof typeof item]) / 60) * chartHeight
          y -= channelHeight

          if (mouseY >= y) {
            foundChannel = channels[i]
            break
          }
        }

        if (foundChannel) {
          setHoveredChannelPoint({ index: closestMonthIndex, channel: foundChannel })
        } else {
          setHoveredChannelPoint(null)
        }
      } else {
        setHoveredChannelPoint(null)
      }
    } else {
      setHoveredChannelPoint(null)
    }
  }

  // Helper function to adjust color brightness
  const adjustColor = (color: string, amount: number) => {
    // Convert hex to RGB
    let r = Number.parseInt(color.substring(1, 3), 16)
    let g = Number.parseInt(color.substring(3, 5), 16)
    let b = Number.parseInt(color.substring(5, 7), 16)

    // Adjust brightness
    r = Math.min(255, Math.max(0, r + amount))
    g = Math.min(255, Math.max(0, g + amount))
    b = Math.min(255, Math.max(0, b + amount))

    // Convert back to hex
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }

  // Initial setup
  useEffect(() => {
    // Measure containers and initialize canvases
    measureContainers()
    setIsInitialized(true)

    // Draw charts after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      drawAcceptanceChart()
      drawPieChart()
      drawChannelChart()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Set up resize observer
  useEffect(() => {
    if (!isInitialized) return

    const resizeObserver = new ResizeObserver(() => {
      measureContainers()
      drawAcceptanceChart()
      drawPieChart()
      drawChannelChart()
    })

    if (acceptanceContainerRef.current) {
      resizeObserver.observe(acceptanceContainerRef.current)
    }
    if (pieContainerRef.current) {
      resizeObserver.observe(pieContainerRef.current)
    }
    if (channelContainerRef.current) {
      resizeObserver.observe(channelContainerRef.current)
    }

    // Clean up
    return () => {
      resizeObserver.disconnect()
    }
  }, [isInitialized])

  // Redraw charts when hover states change
  useEffect(() => {
    if (isInitialized) {
      drawAcceptanceChart()
    }
  }, [hoveredSegmentPoint, isInitialized, acceptanceData])

  useEffect(() => {
    if (isInitialized) {
      drawPieChart()
    }
  }, [hoveredPieSlice, isInitialized, distributionData])

  useEffect(() => {
    if (isInitialized) {
      drawChannelChart()
    }
  }, [hoveredChannelPoint, isInitialized])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>{chartTitles.title1}</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={acceptanceContainerRef} className="h-80 relative">
            <canvas
              ref={acceptanceChartRef}
              className="w-full h-full"
              onMouseMove={handleAcceptanceMouseMove}
              onMouseLeave={() => setHoveredSegmentPoint(null)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{chartTitles.title2}</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={pieContainerRef} className="h-80 relative">
            <canvas
              ref={pieChartRef}
              className="w-full h-full"
              onMouseMove={handlePieMouseMove}
              onMouseLeave={() => setHoveredPieSlice(null)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Channel Effectiveness (Acceptance Rate %)</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={channelContainerRef} className="h-80 relative">
            <canvas
              ref={channelChartRef}
              className="w-full h-full"
              onMouseMove={handleChannelMouseMove}
              onMouseLeave={() => setHoveredChannelPoint(null)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
