import { createSystemPrompt, formatMessagesForChatAPI } from "@/utils/context-handler"

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

    // Make sure we have a valid OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OpenAI API key is missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Create system prompt with expanded context
    const systemPrompt = createSystemPrompt()

    try {
      // Format messages for the Chat Completions API
      const chatMessages = formatMessagesForChatAPI(messages, systemPrompt)

      // Call the Chat Completions API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: chatMessages,
          stream: true,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error?.message || `OpenAI API error: ${response.status}`)
      }

      // Return the streaming response from the API with proper headers
      return new Response(response.body, {
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
