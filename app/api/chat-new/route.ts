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
    const { messages } = await req.json()

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

    // Add system message if not present
    const formattedMessages = [...messages]
    if (!formattedMessages.some((msg) => msg.role === "system")) {
      formattedMessages.unshift({
        role: "system",
        content:
          "You are Veritas Discovery Co-Pilot, an AI assistant specialized in decision intelligence and rule transparency for CIBC. Provide clear, helpful responses about financial decision-making, regulatory compliance, and data-driven insights. Format your responses using markdown for better readability. Use bullet points, numbered lists, headings, and code blocks where appropriate. Break your response into clear paragraphs.",
      })
    }

    // Initialize Gemini client
    const ai = createGeminiClient()

    // Convert messages to Gemini format
    const { systemMessage, history, lastMessage } = formatMessagesForGemini(formattedMessages)

    // Create streaming response
    const geminiStream = await createGeminiStream(
      ai,
      "gemini-2.5-flash",
      systemMessage,
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
