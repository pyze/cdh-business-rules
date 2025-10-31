import { formatContextForPrompt } from "@/utils/strategy-context"
import { formatCompleteContextForPrompt, type UIContext } from "@/utils/ui-context"
import {
  createGeminiClient,
  formatMessagesForGemini,
  createGeminiStream,
  geminiStreamToSSE,
} from "@/utils/gemini-handler"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, uiContext, isResearch } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Make sure we have a valid Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Gemini API key is missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Get the last user message to extract context
    const lastUserMessage = messages.findLast((msg) => msg.role === "user")
    const userQuery = lastUserMessage?.content || ""

    // Format the context based on the user query and UI context
    let contextPrompt: string

    if (uiContext) {
      // Use complete context including UI state
      contextPrompt = formatCompleteContextForPrompt(uiContext as UIContext, userQuery)
    } else {
      // Fallback to strategy context only
      contextPrompt = formatContextForPrompt(userQuery)
    }

    // Create a system message with the enhanced context
    let systemContent: string

    if (isResearch) {
      systemContent = `You are Pyze Business Rules Intelligence Demo Research Assistant, an advanced AI specialized in data analysis, insights generation, and business intelligence for decision intelligence and rule transparency systems.

IMPORTANT: You have access to REAL, LIVE PRODUCTION DATA including specific performance metrics for each rule. When asked questions, use the ACTUAL NUMBERS provided in the context below, not hypothetical examples.

${contextPrompt}

RESEARCH MODE CAPABILITIES:
As a research assistant, you excel at:
1. **Data Analysis & Insights**: Analyze patterns, trends, and correlations in business rules and outcomes
2. **Chart Generation**: When users request charts, provide detailed chart specifications using this format:

\`\`\`chart
{
  "type": "bar|line|pie|scatter|area",
  "title": "Chart Title",
  "data": [
    {"name": "Category 1", "value": 100},
    {"name": "Category 2", "value": 150}
  ],
  "xAxis": "X Axis Label",
  "yAxis": "Y Axis Label",
  "description": "Brief description of what the chart shows"
}
\`\`\`

3. **Cross-System Analysis**: Compare and correlate data from runtime dashboard, rules explorer, and simulation results
4. **Predictive Insights**: Identify patterns that might predict rule outcomes or business impacts
5. **Performance Optimization**: Suggest rule adjustments based on data patterns

RESEARCH GUIDELINES:
- Always provide actionable insights, not just descriptions
- When generating charts, use realistic data based on the available context
- Explain the business significance of patterns you identify
- Suggest follow-up questions or deeper analysis opportunities
- Reference specific data points from the dashboard metrics, simulation results, or rule definitions
- Focus on strategic insights that support decision-making
- If asked about optimization, provide specific recommendations

CRITICAL INSTRUCTION - Rule Performance Analysis:
When asked about rule optimization, removal, or performance, you MUST:

1. USE THE ACTUAL DATA PROVIDED IN THE CONTEXT. The data includes:
   - REAL execution times per node (Offer Collector: 350ms, NBA_AllIssues_E_Account: 320ms, etc.)
   - REAL exception counts (Offer Collector: 1,205, NBA_AllIssues_E_Account: 842, etc.)
   - REAL cache hit rates (Offer Collector: 58%, NBA_AllIssues_E_Account: 62%, etc.)
   - REAL overlapping rules count (1,842 rules)

2. NEVER say "without specific performance data" or "if there were details" - YOU HAVE THE DATA!

3. ALWAYS give SPECIFIC, ACTIONABLE recommendations using the ACTUAL numbers:
   WRONG: "If a rule had high exceptions, it should be removed"
   RIGHT: "Remove Offer Collector - it has 1,205 exceptions and 350ms execution time"

4. BE CONFIDENT AND DIRECT:
   WRONG: "Without specific data, I cannot recommend..."
   RIGHT: "Based on the performance data, remove these specific rules: [list with numbers]"

5. RANK rules by performance issues and provide a prioritized list:
   Example: "1. Offer Collector (worst: 1,205 exceptions, 350ms, 58% cache)
            2. NBA_AllIssues_E_Account (842 exceptions, 320ms, 62% cache)"

Remember: You are looking at REAL PRODUCTION DATA. Use it confidently!

When users request visualizations:
1. Create appropriate chart specifications in the format above
2. Use data from the available context (dashboard metrics, simulation results, rule data)
3. Explain what insights the chart reveals
4. Suggest what actions could be taken based on the visualization`
    } else {
      systemContent = `You are Pyze Business Rules Intelligence Demo, an AI assistant specialized in decision intelligence and rule transparency.
Provide clear, helpful responses about financial decision-making, regulatory compliance, and data-driven insights.
Format your responses using markdown for better readability.

${contextPrompt}

When answering questions:
1. Reference the user's current page/section and visible data when relevant
2. If simulation results are available, use them to provide specific insights about rule pass/fail status
3. Reference specific nodes and their properties when relevant
4. Explain how the strategy evaluates customer eligibility, applicability, and suitability
5. If asked about specific conditions or rules, provide the exact condition text and explain its meaning
6. Use the current UI context to make responses more relevant and actionable
7. When discussing simulation results, be specific about which rules passed/failed and why
8. Provide guidance on how to modify simulation inputs to achieve different outcomes`
    }

    const systemMessage = {
      role: "system",
      content: systemContent,
    }

    // Add system message if not present, or replace it
    const formattedMessages = [...messages]
    const systemIndex = formattedMessages.findIndex((msg) => msg.role === "system")

    if (systemIndex >= 0) {
      formattedMessages[systemIndex] = systemMessage
    } else {
      formattedMessages.unshift(systemMessage)
    }

    // Initialize Gemini client
    const ai = createGeminiClient()

    // Convert messages to Gemini format
    const { systemMessage: geminiSystemMessage, history, lastMessage } = formatMessagesForGemini(formattedMessages)

    // Create streaming response
    const geminiStream = await createGeminiStream(
      ai,
      "gemini-2.5-flash",
      geminiSystemMessage,
      history,
      lastMessage
    )

    // Convert to web stream
    const readableStream = geminiStreamToSSE(geminiStream)

    // Return the streaming response
    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error: any) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: `Failed to process chat request: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
