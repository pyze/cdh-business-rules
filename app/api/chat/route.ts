import OpenAI from "openai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Create a server-side only OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    // Add system message if not present
    const formattedMessages = [...messages]
    if (!formattedMessages.some((msg) => msg.role === "system")) {
      formattedMessages.unshift({
        role: "system",
        content:
          "You are Veritas Discovery Co-Pilot, an AI assistant specialized in decision intelligence and rule transparency for CIBC. Provide clear, helpful responses about financial decision-making, regulatory compliance, and data-driven insights.",
      })
    }

    // Create a streaming response
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: formattedMessages,
      stream: true,
    })

    // Convert the OpenAI stream to a Web stream
    const textEncoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ""
          if (content) {
            controller.enqueue(textEncoder.encode(content))
          }
        }
        controller.close()
      },
    })

    // Return the streaming response
    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain",
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
