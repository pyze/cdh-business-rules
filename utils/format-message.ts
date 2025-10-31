import { marked } from "marked"

export function formatMessage(text: string): string {
  // Configure marked options
  marked.setOptions({
    breaks: true, // Add line breaks
    gfm: true, // Enable GitHub Flavored Markdown
  })

  // Convert markdown to HTML synchronously
  return marked.parse(text) as string
}
