"use client"

import { useState, type FormEvent, useRef, useEffect } from "react"
import { SendHorizontal, Mic, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  onSubmit: (message: string) => void
  isLoading: boolean
  placeholder?: string
}

export function ChatInput({ onSubmit, isLoading, placeholder = "Type your message..." }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (input.trim() && !isLoading) {
      onSubmit(input.trim())
      setInput("")

      // Focus the textarea after submission
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
        }
      }, 0)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "60px" // Reset height
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = `${Math.min(scrollHeight, 200)}px`
    }
  }, [input])

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 border-t bg-background">
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          className="w-full p-3 pr-10 resize-none border rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent min-h-[60px] max-h-[200px]"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <div className="absolute right-3 bottom-3 flex space-x-1">
          <Button type="button" size="icon" variant="ghost" className="h-6 w-6 rounded-full">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button type="button" size="icon" variant="ghost" className="h-6 w-6 rounded-full">
            <Mic className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
      <Button type="submit" disabled={isLoading || !input.trim()} className="bg-brand hover:bg-brand-dark text-white">
        <SendHorizontal className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
}
