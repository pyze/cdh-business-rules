import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatMessage } from "@/utils/format-message"

export type MessageRole = "user" | "assistant" | "system"

export interface MessageProps {
  role: MessageRole
  content: string
  isLoading?: boolean
}

export function ChatMessage({ role, content, isLoading }: MessageProps) {
  // Format the content if it's from the assistant
  const formattedContent = role === "assistant" ? formatMessage(content) : content

  return (
    <div className={cn("flex w-full items-start gap-4 py-4", role === "user" ? "justify-end" : "justify-start")}>
      {role === "assistant" && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          <Bot className="h-4 w-4 text-brand" />
        </div>
      )}

      <div className={cn("flex-1 max-w-[80%] space-y-2", role === "user" ? "text-right" : "text-left")}>
        <div
          className={cn(
            role === "user" ? "chat-message-user ml-auto" : "chat-message-assistant mr-auto",
            "prose-sm max-w-none",
          )}
        >
          {role === "assistant" ? (
            <div dangerouslySetInnerHTML={{ __html: formattedContent }} className="message-content" />
          ) : (
            content
          )}

          {isLoading && (
            <div className="typing-indicator mt-2">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
      </div>

      {role === "user" && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
