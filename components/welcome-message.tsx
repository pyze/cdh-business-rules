import { Bot } from "lucide-react"

interface WelcomeMessageProps {
  brandName: string
  welcomeMessage?: string
  tagline?: string
  logoUrl?: string
}

export function WelcomeMessage({ brandName, welcomeMessage, tagline, logoUrl }: WelcomeMessageProps) {
  const defaultMessage = `Welcome to ${brandName}! How can I help you today?`

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
      {logoUrl ? (
        <img src={logoUrl || "/placeholder.svg"} alt="CIBC Logo" className="h-12 w-auto object-contain mb-2" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
          <Bot className="h-8 w-8 text-brand" />
        </div>
      )}
      <h2 className="text-2xl font-bold">{brandName}</h2>
      {tagline && <p className="text-sm text-muted-foreground">{tagline}</p>}
      <p className="text-muted-foreground max-w-md">{welcomeMessage || defaultMessage}</p>
    </div>
  )
}
