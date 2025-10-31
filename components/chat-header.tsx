import { MessageSquare } from "lucide-react"
import type { ReactNode } from "react"

interface ChatHeaderProps {
  brandName: string
  logoUrl?: string
  tagline?: string
  children?: ReactNode
}

export function ChatHeader({ brandName, logoUrl, tagline, children }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex flex-col px-4 py-3 border-b bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {logoUrl ? (
            <img src={logoUrl || "/placeholder.svg"} alt="Company Logo" className="h-8 w-auto object-contain" />
          ) : (
            <MessageSquare className="w-6 h-6 text-brand" />
          )}
          <h1 className="text-xl font-bold">{brandName}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {children}
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-muted-foreground">Online</span>
        </div>
      </div>
      {tagline && <p className="text-sm text-muted-foreground mt-1">{tagline}</p>}
    </header>
  )
}
