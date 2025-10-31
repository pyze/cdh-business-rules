"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, HelpCircle, MessageSquare, Lightbulb, X, ChevronDown, ChevronUp } from "lucide-react"
import { ResearchChatMessage } from "./research-chat-message"
import type { MessageProps } from "@/components/chat-message"
import { getCurrentPageContext, createUIContext, type UIContext, type DashboardContext, type RulesContext, type SimulationContext } from "@/utils/ui-context"

// Research-focused suggested questions organized by category
const RESEARCH_SUGGESTED_QUESTIONS = {
  "🔍 Transparency & Governance": [
    "Which business rules rely on external data systems like Interaction History or Prediction Engines, and what are the implications for rule accuracy and data latency?",
    "Which nodes have overlapping or redundant eligibility and applicability checks (e.g., Region, CreditScore), and how can we consolidate them to reduce rule sprawl?",
    "Are business rules consistently implemented across nodes and strategies (e.g., Propensity thresholds), or are there discrepancies that may affect decision outcomes?",
    "What are the most common decision paths for high-value customer segments, and how transparent are the conditions at each stage?"
  ],
  "⚙️ Performance & Resiliency": [
    "Which rules or nodes have the longest execution times or highest resource utilization, and where can we optimize logic or caching strategies?",
    "How frequently do nodes raise runtime exceptions (e.g., ComponentExecutionException), and what is the downstream impact on decisioning accuracy or rule failover?",
    "Are performance optimizations (like SSA caching) being utilized consistently across all nodes, or are there inefficiencies that need remediation?"
  ],
  "📊 Offer Optimization & Strategy Refinement": [
    "Which conditions or thresholds (e.g., Propensity > 0.7) most often determine offer type selection, and how sensitive is the logic to customer attribute changes?",
    "How do offer acceptance rates vary by condition type or logic path (e.g., applicability checks vs. suitability checks), and what adjustments can improve yield?",
    "Which decision nodes disproportionately filter out high-value customers, and could the criteria be adjusted to increase eligible volume without raising risk?",
    "How can we simulate adjustments to input attributes (like Segment or CreditScore) using available runtime methods to test offer logic outcomes in real time?"
  ],
  "📈 Analytics & Reporting Enablement": [
    "What reporting metrics can be developed per node (e.g., execution count, average runtime, error rate), and how can these inform ongoing governance reviews?",
    "Are certain strategies or nodes overly reliant on hardcoded thresholds versus dynamically driven business data (e.g., real-time Propensity), and can this be rebalanced?"
  ],
  "🔄 Data Schema & Simulation Intelligence": [
    "Which attributes from Customer Metadata are most frequently used in business rule conditions?",
    "Are any attributes used in multiple nodes with conflicting thresholds (e.g., CreditScore in eligibility vs suitability)?",
    "How can we simulate how a change in Segment or Region (Atlantic, Central, Prairie Provinces, West Coast, North) would affect the final offer selected?",
    "What fields from Interaction History influence offer prioritization or acceptance rate calculations?",
    "Which rules depend on static thresholds rather than model-driven inputs like pyModelPropensity?",
    "How can we trace data lineage from a final outcome back through the pyNodeID to the originating rule and input values?",
    "What percentage of current strategies use dynamic prediction scores (from Decision Results) vs hard-coded logic?",
    "Are all required fields in the decision schema (Segment, CreditScore, pyOutcome) reliably populated across runs?"
  ]
}

// Simple function to create a message object
const createMessage = (role: "user" | "assistant" | "system", content: string, isLoading = false): MessageProps => ({
  role,
  content,
  isLoading,
})

// Use the enhanced context API endpoint
const API_ENDPOINT = "/api/chat-context"

export function ResearchChat() {
  // Chat functionality state
  const [messages, setMessages] = useState<MessageProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [showSuggestedQuestions, setShowSuggestedQuestions] = useState(true)
  const [showSuggestedPanel, setShowSuggestedPanel] = useState(false)
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Focus input when loading completes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isLoading])

  // Create UI context from localStorage data and current page
  const createCurrentUIContext = (): UIContext => {
    const pageContext = getCurrentPageContext()
    
    // Get dashboard context from localStorage or use default data
    let dashboardContext: DashboardContext | undefined
    try {
      const stored = localStorage.getItem('dashboardContext')
      if (stored) {
        dashboardContext = JSON.parse(stored)
      } else {
        // If no stored context, use default runtime data
        dashboardContext = {
          visibleMetrics: ['acceptance_rate', 'execution_count', 'offer_distribution', 'performance_trends'],
          activeCharts: ['node_execution_chart', 'offer_distribution_chart', 'trend_analysis'],
          metricValues: {
            // Summary Metrics
            total_customers: '11.2M',
            total_rules: '8.4K',
            monthly_offers: '660K',
            active_strategies: '42',
            
            // Governance Metrics
            overlapping_rules: 1842,
            overlapping_rules_percent: '21.9%',
            external_system_rules: 2436,
            external_system_percent: '29%',
            raci_coverage: '78%',
            
            // Performance Metrics
            avg_execution_time: '245ms',
            runtime_exceptions: 3724,
            cache_effectiveness: '67%',
            total_executions: '8.2B',
            
            // Optimization Metrics
            top_path_conversion: '23%',
            offer_acceptance_rate: '31%',
            total_acceptances: '204.6K',
            
            // Segment Performance
            premium_segment_performance: '38%',
            standard_segment_performance: '25.5%',
            high_value_segment_performance: '89%',
            
            // Node-level Performance - THIS IS THE KEY DATA
            nba_allissues_exec_time: '320ms',
            nba_allissues_exceptions: 842,
            nba_allissues_cache_hit: '62%',
            offer_collector_exec_time: '350ms',
            offer_collector_exceptions: 1205,
            offer_collector_cache_hit: '58%',
            suitability_check_exec_time: '280ms',
            suitability_check_exceptions: 624,
            suitability_check_cache_hit: '71%',
            nba_allgroups_exec_time: '210ms',
            nba_allgroups_exceptions: 412,
            nba_allgroups_cache_hit: '75%',
            best_result_exec_time: '230ms',
            best_result_exceptions: 641,
            best_result_cache_hit: '64%',
            
            // Regional Performance
            central_acceptance_rate: '38%',
            west_coast_acceptance_rate: '32%',
            atlantic_acceptance_rate: '27%',
            prairie_acceptance_rate: '24%',
            north_acceptance_rate: '22%'
          },
          currentTimeRange: 'last_30_days'
        }
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
      if (sessionData) {
        const session = JSON.parse(sessionData)
        
        if (session.simulations && session.simulations.length > 0) {
          // Get the most recent simulation as current
          const currentSimulation = session.simulations[session.simulations.length - 1]
          
          simulationContext = {
            isSimulationActive: true,
            currentSimulation: currentSimulation,
            simulationHistory: session.simulations
          }
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

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

        // Update the page context to indicate this is research dashboard
        uiContext.pageContext.currentPage = '/research'
        uiContext.pageContext.pageTitle = 'Research Dashboard'

        // Prepare request body with error handling
        let requestBody
        try {
          requestBody = JSON.stringify({ 
            messages: apiMessages,
            uiContext: uiContext,
            isResearch: true  // Flag to indicate this is research mode
          })
        } catch (serializationError) {
          console.error("Error serializing request body:", serializationError)
          // Fallback to sending just messages without UI context
          requestBody = JSON.stringify({ messages: apiMessages, isResearch: true })
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
      }
    },
    [messages, isLoading],
  )

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

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <>
              {/* Welcome Message */}
              <div className="flex justify-center">
                <div className="text-center max-w-2xl">
                  <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">
                    <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Welcome to Research Dashboard
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Ask questions about your business rules, explore data insights, and generate visualizations. 
                      I have access to all your dashboard metrics, rules explorer data, and simulation results.
                    </p>
                    <div className="text-sm text-gray-500">
                      💡 Tip: Ask me to create charts, analyze patterns, or explain relationships in your data
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Suggested Questions */}
              {showSuggestedQuestions && (
                <div className="max-w-5xl mx-auto">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Lightbulb className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Research Questions</h3>
                        <p className="text-sm text-gray-600">Click any question to get started</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSuggestedQuestions(false)}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2"
                    >
                      Hide suggestions
                    </Button>
                  </div>
                  
                  <div className="space-y-8">
                    {/* All Questions Organized by Category */}
                    {Object.entries(RESEARCH_SUGGESTED_QUESTIONS).map(([category, questions]) => (
                      <div key={category} className="space-y-4">
                        {/* Category Header */}
                        <h4 className="text-lg font-semibold text-gray-900">{category}</h4>
                        
                        {/* Questions Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {questions.map((question, questionIndex) => (
                            <div
                              key={`${category}-${questionIndex}`}
                              onClick={() => handleSelectQuestion(question)}
                              className="group relative cursor-pointer"
                            >
                              <div className="relative p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                                {/* Question Content */}
                                <div>
                                  <p className="text-gray-800 font-medium leading-relaxed group-hover:text-blue-900 transition-colors text-sm">
                                    {question}
                                  </p>
                                </div>
                                
                                {/* Hover Indicator */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Send className="h-3 w-3 text-blue-600" />
                                  </div>
                                </div>
                                
                                {/* Gradient Border Effect */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Bottom CTA */}
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-full border border-gray-200">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Or type your own question below</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <ResearchChatMessage key={index} {...message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Floating Suggestions Button - Always visible when there are messages */}
      {messages.length > 0 && (
        <Button
          onClick={() => setShowSuggestedPanel(!showSuggestedPanel)}
          className={`fixed bottom-24 right-6 z-40 rounded-full w-14 h-14 p-0 shadow-xl transition-all duration-200 ${
            showSuggestedPanel 
              ? 'bg-blue-700 hover:bg-blue-800 rotate-12' 
              : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-110'
          }`}
          title="Research suggestions"
        >
          <Lightbulb className={`h-6 w-6 transition-colors ${showSuggestedPanel ? 'text-yellow-200' : 'text-white'}`} />
        </Button>
      )}

      {/* Floating Suggestions Panel */}
      {showSuggestedPanel && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[500px] bg-white border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in-0 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              Research Questions
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestedPanel(false)}
              className="h-8 w-8 p-0 hover:bg-white/50 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="max-h-96 overflow-y-auto p-3">
            <div className="space-y-4">
              {Object.entries(RESEARCH_SUGGESTED_QUESTIONS).map(([category, questions]) => (
                <div key={category} className="space-y-2">
                  {/* Category Header */}
                  <div className="sticky top-0 bg-white z-10 py-2 border-b border-gray-100">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-2">{category}</h4>
                  </div>
                  
                  {/* Questions */}
                  {questions.map((question, questionIndex) => (
                    <div
                      key={`${category}-${questionIndex}`}
                      onClick={() => {
                        handleSelectQuestion(question)
                        setShowSuggestedPanel(false)
                      }}
                      className="group relative cursor-pointer rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-all duration-150 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-800 leading-relaxed group-hover:text-blue-900">
                            {question}
                          </p>
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-200 group-hover:ring-blue-300" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-500 text-center">
              Click any question to ask it instantly
            </p>
          </div>
        </div>
      )}

      {/* Backdrop to close suggestions panel */}
      {showSuggestedPanel && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowSuggestedPanel(false)}
        />
      )}

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent resize-none min-h-[50px] max-h-32"
                placeholder="Ask about your business rules, request charts, or explore insights..."
                disabled={isLoading}
                rows={1}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="border-t bg-red-50 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm text-red-600 bg-red-100 border border-red-200 p-3 rounded-lg">
              Error: {error}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}