import strategyContext from "./strategy-context.json"

// Function to create a system prompt with the strategy context
export function createSystemPrompt(): string {
  // Safely stringify the context to avoid JSON issues
  const safeContext = JSON.stringify(strategyContext)
    .replace(/\\/g, "\\\\") // Escape backslashes
    .replace(/"/g, '\\"') // Escape quotes

  return `
You are Pyze Business Rules Intelligence Demo, an AI assistant specialized in decision intelligence and rule transparency. 
You provide clear, helpful responses about financial decision-making, regulatory compliance, and data-driven insights.

You have access to the following strategy context:
${safeContext}

When answering questions:
1. Reference specific nodes and their properties when relevant
2. Explain how the strategy evaluates customer eligibility, applicability, and suitability
3. If asked about specific conditions or rules, provide the exact condition text and explain its meaning
4. Format your responses using markdown for better readability
5. Use bullet points, numbered lists, headings, and tables where appropriate
6. Break your response into clear sections with headings
7. When discussing attributes that determine offers, be specific about the conditions and thresholds
8. Refer to the exact values in the strategy context (e.g., "CreditScore > 60" not "good credit score")
9. When discussing data models, reference the specific source systems and field definitions
10. For questions about simulation, explain how the simulation_attributes can be modified to test different scenarios
`
}

// Function to format messages for the OpenAI Responses API
export function formatMessagesForResponsesAPI(messages: any[], systemPrompt: string): any[] {
  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    content: [
      {
        type: "input_text",
        text: msg.content,
      },
    ],
  }))

  // Add system message with context
  formattedMessages.unshift({
    role: "system",
    content: [
      {
        type: "input_text",
        text: systemPrompt,
      },
    ],
  })

  return formattedMessages
}

// Function to format messages for the Chat Completions API
export function formatMessagesForChatAPI(messages: any[], systemPrompt: string): any[] {
  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))

  // Add system message with context
  formattedMessages.unshift({
    role: "system",
    content: systemPrompt,
  })

  return formattedMessages
}
