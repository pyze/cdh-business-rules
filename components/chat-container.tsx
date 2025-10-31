"use client"

import { useRef, useEffect } from "react"
import { ChatMessage, type MessageProps } from "./chat-message"

interface ChatContainerProps {
  messages: MessageProps[]
  isLoading: boolean
}

export function ChatContainer({ messages, isLoading }: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-2 scroll-smooth">
      {messages.map((message, index) => (
        <ChatMessage key={index} role={message.role} content={message.content} isLoading={message.isLoading} />
      ))}
    </div>
  )
}
