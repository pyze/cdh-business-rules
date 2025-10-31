'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Search, ChevronDown, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DashboardSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  
  const isRuntimeDashboard = pathname === '/'
  const isRulesExplorer = pathname === '/rules-explorer'
  const isResearch = pathname === '/research'
  
  const currentDashboard = isRuntimeDashboard ? 'Runtime Dashboard' : 
                          isRulesExplorer ? 'Rules Explorer' : 
                          isResearch ? 'Research' : 'Dashboard'
  const currentIcon = isRuntimeDashboard ? <BarChart3 className="h-4 w-4" /> : 
                     isRulesExplorer ? <Search className="h-4 w-4" /> :
                     isResearch ? <MessageSquare className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-white/90 to-white/95 backdrop-blur-sm border shadow-lg hover:shadow-xl hover:from-white/95 hover:to-white/100 transition-all"
        >
          {currentIcon}
          <span className="ml-2 font-medium">{currentDashboard}</span>
          <ChevronDown className={`h-3 w-3 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-gradient-to-br from-white via-white to-gray-50/50 border rounded-lg shadow-xl overflow-hidden">
            <div className="p-2 space-y-1">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <div className={`flex items-center gap-3 p-3 rounded-md transition-all ${
                  isRuntimeDashboard ? 'bg-gradient-to-r from-primary/20 to-primary/30 text-primary shadow-sm border border-primary/20' : 'hover:bg-gradient-to-r hover:from-muted hover:to-muted/80 hover:shadow-sm'
                }`}>
                  <BarChart3 className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Runtime Dashboard</div>
                    <div className="text-xs opacity-70">Live metrics and performance monitoring</div>
                  </div>
                  {isRuntimeDashboard && (
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border border-primary/20">
                      Current
                    </Badge>
                  )}
                </div>
              </Link>

              <Link href="/rules-explorer" onClick={() => setIsOpen(false)}>
                <div className={`flex items-center gap-3 p-3 rounded-md transition-all ${
                  isRulesExplorer ? 'bg-gradient-to-r from-primary/20 to-primary/30 text-primary shadow-sm border border-primary/20' : 'hover:bg-gradient-to-r hover:from-muted hover:to-muted/80 hover:shadow-sm'
                }`}>
                  <Search className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Rules Explorer</div>
                    <div className="text-xs opacity-70">Rule definitions and what-if scenarios</div>
                  </div>
                  {isRulesExplorer && (
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border border-primary/20">
                      Current
                    </Badge>
                  )}
                </div>
              </Link>

              <Link href="/research" onClick={() => setIsOpen(false)}>
                <div className={`flex items-center gap-3 p-3 rounded-md transition-all ${
                  isResearch ? 'bg-gradient-to-r from-primary/20 to-primary/30 text-primary shadow-sm border border-primary/20' : 'hover:bg-gradient-to-r hover:from-muted hover:to-muted/80 hover:shadow-sm'
                }`}>
                  <MessageSquare className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">Research</div>
                    <div className="text-xs opacity-70">AI-powered insights and analysis</div>
                  </div>
                  {isResearch && (
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border border-primary/20">
                      Current
                    </Badge>
                  )}
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 -z-10" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}