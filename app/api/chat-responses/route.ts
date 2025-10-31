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

    // Import the system prompt
    const { systemPrompt } = await import("@/utils/comprehensive-context")

    // Format messages for the Responses API
    const formattedInput = messages.map((msg) => ({
      role: msg.role,
      content: [
        {
          type: "input_text",
          text: msg.content,
        },
      ],
    }))

    // Add system message with comprehensive context
    formattedInput.unshift({
      role: "system",
      content: [
        {
          type: "input_text",
          text: systemPrompt,
        },
      ],
    })

    try {
      // Call the OpenAI Responses API
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1",
          input: formattedInput,
          text: {
            format: {
              type: "text",
            },
          },
          reasoning: {},
          tools: [],
          temperature: 1,
          max_output_tokens: 2048,
          top_p: 1,
          stream: true,
          store: true,
        }),
      })

      if (response.ok) {
        // Return the streaming response directly
        return new Response(response.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        })
      } else {
        console.log("Responses API failed, falling back to chat completions API")
        // If the Responses API fails, fall back to the chat completions API
        throw new Error("Responses API failed")
      }
    } catch (error) {
      console.log("Falling back to chat completions API:", error)

      // Format messages for the Chat Completions API
      const chatMessages = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ]

      // Call the Chat Completions API
      const fallbackResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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

      if (!fallbackResponse.ok) {
        const error = await fallbackResponse.json().catch(() => ({}))
        throw new Error(error.error?.message || `OpenAI API error: ${fallbackResponse.status}`)
      }

      // Return the streaming response from the fallback API
      return new Response(fallbackResponse.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
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
