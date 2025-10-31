"use client"

import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatMessage } from "@/utils/format-message"
import { ChartRenderer } from "./chart-renderer"
import type { MessageProps } from "@/components/chat-message"

// Function to extract chart specifications from markdown
function extractCharts(content: string) {
  const chartRegex = /```chart\n([\s\S]*?)\n```/g
  const charts: Array<{ spec: any; placeholder: string }> = []
  let match

  while ((match = chartRegex.exec(content)) !== null) {
    try {
      const chartSpec = JSON.parse(match[1])
      charts.push({
        spec: chartSpec,
        placeholder: match[0]
      })
    } catch (e) {
      console.error('Failed to parse chart specification:', e)
    }
  }

  return charts
}

// Function to remove chart blocks from content
function removeChartBlocks(content: string): string {
  return content.replace(/```chart\n[\s\S]*?\n```/g, '').trim()
}

export function ResearchChatMessage({ role, content, isLoading }: MessageProps) {
  // Extract charts from assistant messages
  const charts = role === "assistant" ? extractCharts(content) : []
  
  // Remove chart blocks from content for formatting
  const textContent = role === "assistant" ? removeChartBlocks(content) : content
  
  // Format the remaining content if it's from the assistant
  const formattedContent = role === "assistant" ? formatMessage(textContent) : textContent

  return (
    <div className={cn("flex w-full items-start gap-4 py-4", role === "user" ? "justify-end" : "justify-start")}>
      {role === "assistant" && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          <Bot className="h-4 w-4 text-brand" />
        </div>
      )}

      <div className={cn("flex-1 max-w-[90%] space-y-4", role === "user" ? "text-right" : "text-left")}>
        {/* Text Content */}
        {(textContent || isLoading) && (
          <div
            className={cn(
              role === "user" ? "chat-message-user ml-auto" : "chat-message-assistant mr-auto",
              "prose-sm max-w-none",
            )}
          >
            {role === "assistant" ? (
              <div dangerouslySetInnerHTML={{ __html: formattedContent }} className="message-content" />
            ) : (
              textContent
            )}

            {isLoading && (
              <div className="typing-indicator mt-2">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>
        )}

        {/* Chart Renderings */}
        {charts.map((chart, index) => (
          <div key={index} className="w-full">
            <ChartRenderer chartSpec={chart.spec} />
          </div>
        ))}
      </div>

      {role === "user" && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}