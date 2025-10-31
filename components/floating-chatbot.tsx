"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, X, Send, HelpCircle } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import type { MessageProps } from "@/components/chat-message"
import { getCurrentPageContext, createUIContext, type UIContext, type DashboardContext, type RulesContext, type SimulationContext } from "@/utils/ui-context"

// Brand configuration
const BRAND_CONFIG = {
  name: "Pyze Business Rules Intelligence Demo",
  logoUrl: "/cibc-logo.png",
  welcomeMessage:
    "I'm your AI assistant for navigating decision intelligence and rule transparency. Ask me about the NBA_AllIssues_AllGroups_Account strategy!",
  tagline: "Your trusted partner for navigating decision intelligence and rule transparency",
}

// Suggested questions from existing QuestionList component
const SUGGESTED_QUESTIONS = [
  "What is the NBA_AllIssues_AllGroups_Account strategy?",
  "How does the decision engine handle rule conflicts?",
  "What are the key performance indicators for this strategy?",
  "Can you explain the rule transparency framework?",
  "How do I interpret the decision intelligence metrics?",
  "What triggers the NBA strategy execution?",
  "How are business rules prioritized in the system?",
  "What data sources feed into the decision engine?",
]

// Simple function to create a message object
const createMessage = (role: "user" | "assistant" | "system", content: string, isLoading = false): MessageProps => ({
  role,
  content,
  isLoading,
})

// Use the enhanced context API endpoint
const API_ENDPOINT = "/api/chat-context"

interface FloatingChatbotProps {}

export function FloatingChatbot({}: FloatingChatbotProps = {}) {
  const pathname = usePathname()
  
  // Chat widget states: 'state1' | 'state2' | 'state3'
  // state1 = initial welcome tooltip, state2 = closed button, state3 = expanded chat
  const [chatState, setChatState] = useState<'state1' | 'state2' | 'state3'>('state1')
  
  // Chat functionality state
  const [messages, setMessages] = useState<MessageProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [showSuggestedQuestions, setShowSuggestedQuestions] = useState(false)
  
  const [contextUpdateIndicator, setContextUpdateIndicator] = useState(false)
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatWidgetRef = useRef<HTMLDivElement>(null)

  // Initial state transition: state1 -> state2 after 5 seconds
  useEffect(() => {
    if (chatState === 'state1') {
      const timer = setTimeout(() => {
        setChatState('state2')
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [chatState])

  // Focus input when chat opens
  useEffect(() => {
    if (chatState === 'state3' && inputRef.current) {
      // Small delay to ensure the element is rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [chatState])

  // Focus input when loading completes (after chat response)
  useEffect(() => {
    if (!isLoading && chatState === 'state3' && inputRef.current) {
      // Small delay to ensure any final UI updates complete
      setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
    }
  }, [isLoading, chatState])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    scrollToBottom()
  }, [messages])

  // Close chat when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        chatState === 'state3' &&
        chatWidgetRef.current &&
        !chatWidgetRef.current.contains(event.target as Node)
      ) {
        setChatState('state2')
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [chatState])

  // Create UI context from localStorage data
  const createCurrentUIContext = (): UIContext => {
    const pageContext = getCurrentPageContext()
    
    // Get dashboard context from localStorage
    let dashboardContext: DashboardContext | undefined
    try {
      const stored = localStorage.getItem('dashboardContext')
      if (stored) {
        dashboardContext = JSON.parse(stored)
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    
    // Get rules context from localStorage
    let rulesContext: RulesContext | undefined
    try {
      const stored = localStorage.getItem('rulesContext')
      if (stored) {
        rulesContext = JSON.parse(stored)
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    
    // Get simulation context from session-based localStorage
    let simulationContext: SimulationContext | undefined
    try {
      const sessionData = localStorage.getItem('simulationSession')
      console.log('Checking localStorage for simulation session:', sessionData ? 'found' : 'not found')
      if (sessionData) {
        const session = JSON.parse(sessionData)
        console.log(`Found session with ${session.simulations?.length || 0} simulations`)
        
        if (session.simulations && session.simulations.length > 0) {
          // Get the most recent simulation as current
          const currentSimulation = session.simulations[session.simulations.length - 1]
          
          simulationContext = {
            isSimulationActive: true,
            currentSimulation: currentSimulation,
            simulationHistory: session.simulations
          }
          console.log('Using session simulation data')
        }
      }
    } catch (e) {
      console.log('Error reading simulation session:', e)
    }
    
    const uiContext = createUIContext(
      pageContext,
      dashboardContext,
      rulesContext,
      simulationContext
    )
    return uiContext
  }

  // Handle sending messages
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      try {
        // Add user message
        const userMessage = createMessage("user", content)
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setShowSuggestedQuestions(false)

        // Set loading state
        setIsLoading(true)
        setError(null)

        // Add loading message for assistant
        setMessages((prev) => [...prev, createMessage("assistant", "", true)])

        // Prepare API request with UI context
        const apiMessages = messages.concat(userMessage).map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))

        // Create UI context lazily when sending message
        const uiContext = createCurrentUIContext()
        console.log('Chatbot sending context - simulation active:', uiContext.simulationContext?.isSimulationActive)

        // Prepare request body with error handling
        let requestBody
        try {
          requestBody = JSON.stringify({ 
            messages: apiMessages,
            uiContext: uiContext
          })
        } catch (serializationError) {
          console.error("Error serializing request body:", serializationError)
          // Fallback to sending just messages without UI context
          requestBody = JSON.stringify({ messages: apiMessages })
        }

        // Call API with enhanced context
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `API error: ${response.status}`)
        }

        // Handle streaming response
        const reader = response.body?.getReader()
        if (!reader) throw new Error("Failed to get response reader")

        let assistantResponse = ""
        const decoder = new TextDecoder()
        let buffer = "" // Buffer to handle partial lines

        // Read stream
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          // Decode chunk and add to buffer
          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk

          // Process complete lines only
          const lines = buffer.split("\n")
          buffer = lines.pop() || "" // Keep the last (potentially incomplete) line in buffer

          for (const line of lines) {
            // Skip empty lines
            if (!line.trim()) continue

            // Handle SSE format
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim()

              // Skip [DONE] message
              if (data === "[DONE]") continue

              // Skip empty data
              if (!data) continue

              try {
                // Parse the JSON data
                const parsedData = JSON.parse(data)

                // Extract content based on the API response format
                let content = ""

                // Handle chat completions API format
                if (parsedData.choices?.[0]?.delta?.content) {
                  content = parsedData.choices[0].delta.content
                }

                if (content) {
                  assistantResponse += content

                  // Update the assistant message
                  setMessages((prev) => {
                    const newMessages = [...prev]
                    const lastIndex = newMessages.length - 1

                    if (lastIndex >= 0 && newMessages[lastIndex].role === "assistant") {
                      newMessages[lastIndex] = createMessage("assistant", assistantResponse, true)
                    }

                    return newMessages
                  })
                }
              } catch (e) {
                // If parsing fails, check if this might be a partial JSON chunk
                if (data.startsWith("{") && !data.endsWith("}")) {
                  // This might be a partial JSON chunk, skip it
                  console.warn("Skipping partial JSON chunk:", data.substring(0, 50) + "...")
                  continue
                }
                
                // Log the error and the problematic data for debugging
                console.error("Error parsing chunk:", e)
                console.error("Problematic data length:", data.length)
                console.error("Problematic data preview:", data.substring(0, 200))
                
                // Skip this chunk and continue processing
                continue
              }
            }
          }
        }

        // Finalize assistant message
        setMessages((prev) => {
          const newMessages = [...prev]
          const lastIndex = newMessages.length - 1

          if (lastIndex >= 0 && newMessages[lastIndex].role === "assistant") {
            newMessages[lastIndex] = createMessage("assistant", assistantResponse)
          }

          return newMessages
        })

      } catch (err) {
        console.error("Error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")

        // Remove loading message if present
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage && lastMessage.role === "assistant" && lastMessage.isLoading) {
            return prev.slice(0, -1)
          }
          return prev
        })
      } finally {
        setIsLoading(false)
        // Focus input after response completes (success or error)
        setTimeout(() => {
          if (inputRef.current && chatState === 'state3') {
            inputRef.current.focus()
          }
        }, 100)
      }
    },
    [messages, isLoading, chatState],
  )

  // Handle chat toggle - clicking icon always goes to state3
  const handleChatToggle = () => {
    if (chatState === 'state1' || chatState === 'state2') {
      setChatState('state3')
    } else if (chatState === 'state3') {
      setChatState('state2')
      setShowSuggestedQuestions(false)
    }
  }

  // Handle expanding from welcome state
  const handleExpandChat = () => {
    setChatState('state3')
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(input)
  }

  // Handle suggested question selection
  const handleSelectQuestion = (question: string) => {
    handleSendMessage(question)
  }

  // Handle key press in textarea
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  // Don't show floating chatbot on research page
  if (pathname === '/research') {
    return null
  }

  return (
    <div ref={chatWidgetRef} className="fixed bottom-4 right-4 z-50">
      {/* Floating Chat Button */}
      <Button
        onClick={handleChatToggle}
        className={`rounded-full w-14 h-14 p-0 shadow-lg transition-all duration-300 ${
          chatState === 'state3' 
            ? 'bg-primary hover:bg-primary/90' 
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {chatState === 'state3' ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>

      {/* Welcome Tooltip */}
      {chatState === 'state1' && (
        <div className="absolute bottom-16 right-0 bg-white border border-primary/20 shadow-lg rounded-lg p-4 w-64 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start">
            <HelpCircle className="text-primary mr-2 mt-0.5 flex-shrink-0 h-5 w-5" />
            <div>
              <h4 className="font-medium text-sm">{BRAND_CONFIG.name}</h4>
              <p className="text-xs text-gray-600 mt-1">
                {BRAND_CONFIG.tagline}. Click to chat!
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0 h-auto p-1"
              onClick={() => setChatState('state2')}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Button
            onClick={handleExpandChat}
            className="w-full mt-2 bg-primary/90 hover:bg-primary text-xs h-8"
          >
            Ask me anything
          </Button>
        </div>
      )}

      {/* Expanded Chat Window */}
      {chatState === 'state3' && (
        <div className="absolute bottom-16 right-0 w-[30rem] md:w-[36rem] transition-all duration-300 transform">
          <div className="rounded-lg border bg-card text-card-foreground shadow-xl border-primary/10">
            {/* Header */}
            <div className="flex flex-col space-y-1.5 p-6 pb-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="font-semibold tracking-tight text-lg">
                    {BRAND_CONFIG.name}
                  </div>
                  {contextUpdateIndicator && (
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full animate-pulse">
                      Context updated
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={handleChatToggle}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-[30rem] overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <>
                    <div className="flex justify-start">
                      <div className="prose max-w-[80%] rounded-lg px-4 py-3 shadow-sm bg-white border border-gray-200 text-gray-800">
                        <p className="m-0">{BRAND_CONFIG.welcomeMessage}</p>
                      </div>
                    </div>
                    
                    {/* Always show suggested questions when no messages */}
                    <div className="mt-4 space-y-2">
                      <div className="text-sm font-medium text-gray-600 mb-2">✨ Try asking about:</div>
                      {SUGGESTED_QUESTIONS.slice(0, 4).map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-left h-auto p-3 text-xs w-full justify-start hover:bg-blue-50 hover:border-blue-300 border-gray-200 text-gray-700"
                          onClick={() => handleSelectQuestion(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  messages.map((message, index) => (
                    <ChatMessage key={index} {...message} />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions - shown on demand during conversation */}
              {showSuggestedQuestions && messages.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                  <div className="text-sm font-medium text-gray-600 mb-2 flex items-center justify-between">
                    <span>✨ Suggested Questions:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-xs text-gray-500 hover:bg-gray-100"
                      onClick={() => setShowSuggestedQuestions(false)}
                    >
                      Hide
                    </Button>
                  </div>
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-left h-auto p-2 text-xs w-full justify-start hover:bg-blue-50 hover:border-blue-300 border-gray-200 text-gray-700"
                      onClick={() => handleSelectQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex items-center border-t border-gray-200 p-3 bg-white">
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex w-full rounded-md border bg-white px-3 py-2 text-base ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-10 resize-none border-gray-300 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                  placeholder="Ask about NBA strategy..."
                  disabled={isLoading}
                />
                <div className="flex flex-col gap-1">
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="h-10 w-10 bg-gray-600 hover:bg-gray-700 border-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-10 px-2 border-gray-300 text-gray-500 hover:bg-gray-50"
                    onClick={() => setShowSuggestedQuestions(!showSuggestedQuestions)}
                  >
                    <HelpCircle className="h-3 w-3" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Error Display */}
            {error && (
              <div className="px-4 pb-2">
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
                  Error: {error}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}