"use client"

import { useEffect, useRef } from "react"

export function FallbackChart({ title }: { title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw a simple loading indicator
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    // Draw loading indicator
    const drawLoadingIndicator = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      ctx.fillStyle = "#f9fafb"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw loading text
      ctx.fillStyle = "#6b7280"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`Loading ${title}...`, canvas.width / 2, canvas.height / 2 - 20)

      // Draw animated dots
      const now = Date.now()
      const numDots = Math.floor((now % 1000) / 250) + 1
      let dots = ""
      for (let i = 0; i < numDots; i++) {
        dots += "."
      }
      ctx.fillText(dots, canvas.width / 2, canvas.height / 2 + 10)

      // Draw progress bar
      const progress = (now % 3000) / 3000
      const barWidth = canvas.width * 0.6
      const barHeight = 6
      const barX = (canvas.width - barWidth) / 2
      const barY = canvas.height / 2 + 40

      // Bar background
      ctx.fillStyle = "#e5e7eb"
      ctx.fillRect(barX, barY, barWidth, barHeight)

      // Bar progress
      ctx.fillStyle = "#c41f3e"
      ctx.fillRect(barX, barY, barWidth * progress, barHeight)

      // Request next frame
      requestAnimationFrame(drawLoadingIndicator)
    }

    // Start animation
    drawLoadingIndicator()
  }, [title])

  return (
    <div className="h-80 flex flex-col items-center justify-center bg-gray-50 rounded-md border border-gray-200">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
