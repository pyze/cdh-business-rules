import { GoogleGenAI } from "@google/genai"

/**
 * Initialize Gemini client with API key
 */
export function createGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing")
  }
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  })
}

/**
 * Convert OpenAI message format to Gemini format
 *
 * OpenAI format: { role: "user"|"assistant"|"system", content: string }
 * Gemini format: { role: "user"|"model", parts: [{ text: string }] }
 *
 * @param messages Array of messages in OpenAI format
 * @returns Object containing systemMessage, history, and lastMessage
 */
export function formatMessagesForGemini(messages: any[]) {
  // Separate system message from chat history
  const systemMessage = messages.find((msg) => msg.role === "system")
  const chatMessages = messages.filter((msg) => msg.role !== "system")

  // Convert to Gemini format: { role, parts: [{ text }] }
  // Gemini uses "model" instead of "assistant"
  const history = chatMessages.slice(0, -1).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }))

  const lastMessage = chatMessages[chatMessages.length - 1]?.content || ""

  return {
    systemMessage: systemMessage?.content,
    history,
    lastMessage,
  }
}

/**
 * Create a streaming chat session with Gemini
 *
 * @param ai Gemini client instance
 * @param model Model name (e.g., "gemini-2.5-flash")
 * @param systemPrompt System instruction/prompt
 * @param history Previous messages in Gemini format
 * @param message Current user message
 * @returns Async generator for streaming response
 */
export async function createGeminiStream(
  ai: any,
  model: string,
  systemPrompt: string | undefined,
  history: any[],
  message: string
) {
  const chatConfig: any = {
    model,
    history,
  }

  // Add system instruction if provided
  if (systemPrompt) {
    chatConfig.systemInstruction = systemPrompt
  }

  const chat = ai.chats.create(chatConfig)

  return await chat.sendMessageStream({ message })
}

/**
 * Convert Gemini streaming response to Web ReadableStream
 * This is compatible with Next.js streaming responses
 *
 * @param geminiStream Gemini async generator stream
 * @returns ReadableStream for HTTP response
 */
export function geminiStreamToWebStream(geminiStream: AsyncGenerator<any>) {
  const textEncoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of geminiStream) {
          const text = chunk.text || ""
          if (text) {
            controller.enqueue(textEncoder.encode(text))
          }
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}

/**
 * Convert Gemini streaming response to SSE (Server-Sent Events) format
 * This is compatible with OpenAI's SSE streaming format
 *
 * @param geminiStream Gemini async generator stream
 * @returns ReadableStream with SSE formatting
 */
export function geminiStreamToSSE(geminiStream: AsyncGenerator<any>) {
  const textEncoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of geminiStream) {
          const text = chunk.text || ""
          if (text) {
            // Format as SSE: data: {...}\n\n
            const sseData = `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`
            controller.enqueue(textEncoder.encode(sseData))
          }
        }
        // Send done signal
        controller.enqueue(textEncoder.encode("data: [DONE]\n\n"))
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}
