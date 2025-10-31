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
          "You are Veritas Discovery Co-Pilot, an AI assistant specialized in decision intelligence and rule transparency for CIBC. Provide clear, helpful responses about financial decision-making, regulatory compliance, and data-driven insights. Format your responses using markdown for better readability. Use bullet points, numbered lists, headings, and code blocks where appropriate. Break your response into clear paragraphs.",
      })
    }

    // Call OpenAI API directly using fetch
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: formattedMessages,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || `OpenAI API error: ${response.status}`)
    }

    // Return the streaming response directly
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
}
