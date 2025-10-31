'use client'

import React, { useState } from 'react'
import { DashboardSwitcher } from '@/components/dashboard-switcher'
import { FloatingChatbot } from '@/components/floating-chatbot'
// Import strategy data and components
import strategyData from '@/utils/strategy-context.json'
import UnifiedRuleFlowExplorer from '@/components/rules-explorer/unified-rule-flow-explorer'
import { createRulesContext, createSimulationContext } from '@/utils/ui-context'

export default function RulesExplorerPage() {
  const { strategy_overview, node_details } = strategyData
  
  // Track simulation state for chatbot context
  const [simulationHistory, setSimulationHistory] = useState<Array<{
    inputs: Record<string, any>
    results: any
  }>>([])
  const [currentSimulation, setCurrentSimulation] = useState<{
    inputs: Record<string, any>
    results: any
  } | null>(null)
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])

  // Initialize session-based simulation history on component mount
  React.useEffect(() => {
    // Clear simulation history on page load (new session)
    try {
      localStorage.removeItem('simulationSession')
      console.log('Cleared simulation session on page load')
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [])

  // Handle simulation completion from WhatIfSimulator
  const handleSimulationComplete = (profile: any, result: any) => {
    const simulationData = {
      inputs: profile,
      results: {
        executionPath: result.executionPath,
        finalResult: result.finalOutcome,
        ruleResults: result.ruleResults,
        summary: {
          totalRules: result.ruleResults.length,
          rulesPassed: result.nodesPassed.length,
          rulesFailed: result.nodesFailed.length,
          rulesNotEvaluated: 0
        },
        timestamp: result.timestamp
      }
    }
    
    // Update current simulation
    setCurrentSimulation(simulationData)
    
    // Add to history
    setSimulationHistory(prev => [...prev, simulationData])
    
    // Store all simulation runs for this session in localStorage
    try {
      const existingSession = localStorage.getItem('simulationSession')
      let sessionData = {
        sessionStart: new Date().toISOString(),
        simulations: []
      }
      
      if (existingSession) {
        sessionData = JSON.parse(existingSession)
      }
      
      // Add new simulation to session
      sessionData.simulations.push(simulationData)
      sessionData.lastUpdated = new Date().toISOString()
      
      localStorage.setItem('simulationSession', JSON.stringify(sessionData))
      console.log(`Stored simulation #${sessionData.simulations.length} in session`)
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  // Store rules context in localStorage for chatbot
  React.useEffect(() => {
    const rulesContext = createRulesContext(
      selectedNodes,
      selectedNodes.length > 0 ? {
        nodeName: selectedNodes[0],
        nodeType: node_details.find(n => n.node_name === selectedNodes[0])?.node_type || 'Unknown',
        condition: node_details.find(n => n.node_name === selectedNodes[0])?.condition_rule || 'Unknown',
        dataSource: node_details.find(n => n.node_name === selectedNodes[0])?.data_sources || []
      } : undefined,
      []
    )
    
    try {
      localStorage.setItem('rulesContext', JSON.stringify(rulesContext))
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [selectedNodes])
  

  return (
    <div className="h-screen bg-background flex flex-col">
      <DashboardSwitcher />
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Business Rules Explorer</h1>
            <p className="text-muted-foreground">
              Explore rule definitions, interactions, and test scenarios
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Unified Rule Flow Explorer */}
      <div className="flex-1 overflow-hidden">
        <UnifiedRuleFlowExplorer onSimulationComplete={handleSimulationComplete} />
      </div>

      {/* Add floating chatbot */}
      <FloatingChatbot />
    </div>
  )
}