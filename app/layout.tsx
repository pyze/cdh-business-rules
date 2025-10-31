import type { Metadata } from 'next'
import './globals.css'
import { FloatingChatbot } from '@/components/floating-chatbot'

export const metadata: Metadata = {
  title: 'Pyze Business Rules Intelligence Demo',
  description: 'Your trusted partner for navigating decision intelligence and rule transparency',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloatingChatbot />
      </body>
    </html>
  )
}
