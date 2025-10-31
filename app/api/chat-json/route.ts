import { createSystemPrompt, formatMessagesForChatAPI } from "@/utils/context-handler"
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

    // Create system prompt with expanded context
    const systemPrompt = createSystemPrompt()

    try {
      // Format messages for the Chat API
      const chatMessages = formatMessagesForChatAPI(messages, systemPrompt)

      // Initialize Gemini client
      const ai = createGeminiClient()

      // Convert messages to Gemini format
      const { systemMessage, history, lastMessage } = formatMessagesForGemini(chatMessages)

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
  } catch (error: any) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: `Failed to process chat request: ${error.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
