'use client'

import { DashboardSwitcher } from '@/components/dashboard-switcher'
import { ResearchChat } from '@/components/research/research-chat'

export default function ResearchPage() {
  return (
    <div className="h-screen bg-background flex flex-col">
      <DashboardSwitcher />
      
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Research Dashboard</h1>
            <p className="text-muted-foreground">
              Ask questions and explore insights about your business rules and data
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Research Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ResearchChat />
      </div>
    </div>
  )
}