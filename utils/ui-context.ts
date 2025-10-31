// Enhanced UI Context Manager for Contextual Chatbot
import { formatContextForPrompt } from './strategy-context'

// Type definitions for different context types
export interface PageContext {
  currentPage: '/dashboard' | '/rules-explorer' | '/' | '/research'
  pageTitle: string
  activeSection?: string
}

export interface DashboardContext {
  visibleMetrics: string[]
  currentTimeRange?: string
  activeCharts: string[]
  metricValues: Record<string, number | string>
}

export interface RulesContext {
  selectedNodes: string[]
  visibleNodeDetails?: {
    nodeName: string
    nodeType: string
    condition: string
    dataSource: string[]
  }
  flowPath: string[]
}

export interface SimulationRuleResult {
  nodeName: string
  ruleCondition: string
  status: 'passed' | 'failed' | 'not_evaluated'
  actualValue?: any
  requiredValue?: any
  reason?: string
}

export interface SimulationContext {
  isSimulationActive: boolean
  currentSimulation?: {
    inputs: Record<string, any>
    results: {
      executionPath: string[]
      finalResult: any
      ruleResults: SimulationRuleResult[]
      summary: {
        totalRules: number
        rulesPassed: number
        rulesFailed: number
        rulesNotEvaluated: number
      }
      timestamp: string
    }
  }
  simulationHistory?: Array<{
    inputs: Record<string, any>
    results: {
      executionPath: string[]
      finalResult: any
      ruleResults: SimulationRuleResult[]
      summary: {
        totalRules: number
        rulesPassed: number
        rulesFailed: number
        rulesNotEvaluated: number
      }
      timestamp: string
    }
  }>
}

export interface UIContext {
  pageContext: PageContext
  dashboardContext?: DashboardContext
  rulesContext?: RulesContext
  simulationContext?: SimulationContext
}

// Helper function to get current page context
export function getCurrentPageContext(): PageContext {
  if (typeof window === 'undefined') {
    return { currentPage: '/', pageTitle: 'Dashboard' }
  }

  const pathname = window.location.pathname as PageContext['currentPage']
  
  switch (pathname) {
    case '/rules-explorer':
      return {
        currentPage: '/rules-explorer',
        pageTitle: 'Business Rules Explorer',
        activeSection: 'flow_visualization'
      }
    case '/research':
      return {
        currentPage: '/research',
        pageTitle: 'Research Dashboard',
        activeSection: 'chat_interface'
      }
    case '/dashboard':
      return {
        currentPage: '/dashboard',
        pageTitle: 'Dashboard',
        activeSection: 'metrics'
      }
    default:
      return {
        currentPage: '/',
        pageTitle: 'Runtime Dashboard',
        activeSection: 'overview'
      }
  }
}

// Format UI context for inclusion in chat system prompt
export function formatUIContextForPrompt(uiContext: UIContext, userQuery: string): string {
  let contextPrompt = ''

  // Add page context
  contextPrompt += `\n### Current User Context ###\n`
  contextPrompt += `Page: ${uiContext.pageContext.pageTitle} (${uiContext.pageContext.currentPage})\n`
  
  if (uiContext.pageContext.activeSection) {
    contextPrompt += `Active Section: ${uiContext.pageContext.activeSection}\n`
  }

  // Add dashboard context if available
  if (uiContext.dashboardContext) {
    contextPrompt += `\n### Runtime Dashboard Metrics ###\n`
    
    if (uiContext.dashboardContext.currentTimeRange) {
      contextPrompt += `Time Range: ${uiContext.dashboardContext.currentTimeRange}\n`
    }
    
    if (Object.keys(uiContext.dashboardContext.metricValues).length > 0) {
      const metrics = uiContext.dashboardContext.metricValues
      
      // Summary Metrics
      contextPrompt += `\n**Summary Metrics:**\n`
      if (metrics.total_customers) contextPrompt += `  - Total Customers: ${metrics.total_customers}\n`
      if (metrics.total_rules) contextPrompt += `  - Total Business Rules: ${metrics.total_rules}\n`
      if (metrics.monthly_offers) contextPrompt += `  - Monthly Offers: ${metrics.monthly_offers}\n`
      if (metrics.active_strategies) contextPrompt += `  - Active Strategies: ${metrics.active_strategies}\n`
      
      // Governance Metrics
      contextPrompt += `\n**Governance Metrics:**\n`
      if (metrics.overlapping_rules) contextPrompt += `  - Overlapping Rules: ${metrics.overlapping_rules} (${metrics.overlapping_rules_percent})\n`
      if (metrics.external_system_rules) contextPrompt += `  - External System Rules: ${metrics.external_system_rules} (${metrics.external_system_percent})\n`
      if (metrics.raci_coverage) contextPrompt += `  - RACI Coverage: ${metrics.raci_coverage}\n`
      
      // Performance Metrics
      contextPrompt += `\n**Performance Metrics:**\n`
      if (metrics.avg_execution_time) contextPrompt += `  - Average Execution Time: ${metrics.avg_execution_time}\n`
      if (metrics.runtime_exceptions) contextPrompt += `  - Runtime Exceptions: ${metrics.runtime_exceptions}\n`
      if (metrics.cache_effectiveness) contextPrompt += `  - Cache Effectiveness: ${metrics.cache_effectiveness}\n`
      if (metrics.total_executions) contextPrompt += `  - Total Executions: ${metrics.total_executions}\n`
      
      // Optimization Metrics
      contextPrompt += `\n**Optimization Metrics:**\n`
      if (metrics.top_path_conversion) contextPrompt += `  - Top Path Conversion: ${metrics.top_path_conversion}\n`
      if (metrics.offer_acceptance_rate) contextPrompt += `  - Overall Offer Acceptance Rate: ${metrics.offer_acceptance_rate}\n`
      if (metrics.total_acceptances) contextPrompt += `  - Total Acceptances: ${metrics.total_acceptances}\n`
      
      // Segment Performance
      contextPrompt += `\n**Segment Performance:**\n`
      if (metrics.premium_segment_performance) contextPrompt += `  - Premium Segment: ${metrics.premium_segment_performance}\n`
      if (metrics.standard_segment_performance) contextPrompt += `  - Standard Segment: ${metrics.standard_segment_performance}\n`
      if (metrics.high_value_segment_performance) contextPrompt += `  - High-Value Segment: ${metrics.high_value_segment_performance}\n`
      
      // Regional Performance
      contextPrompt += `\n**Regional Acceptance Rates:**\n`
      if (metrics.central_acceptance_rate) contextPrompt += `  - Central: ${metrics.central_acceptance_rate}\n`
      if (metrics.west_coast_acceptance_rate) contextPrompt += `  - West Coast: ${metrics.west_coast_acceptance_rate}\n`
      if (metrics.atlantic_acceptance_rate) contextPrompt += `  - Atlantic: ${metrics.atlantic_acceptance_rate}\n`
      if (metrics.prairie_acceptance_rate) contextPrompt += `  - Prairie Provinces: ${metrics.prairie_acceptance_rate}\n`
      if (metrics.north_acceptance_rate) contextPrompt += `  - North: ${metrics.north_acceptance_rate}\n`
      
      // Node-level Performance (if available)
      contextPrompt += `\n**SPECIFIC RULE PERFORMANCE DATA:**\n`
      contextPrompt += `Rule Name | Execution Time | Exceptions | Cache Hit Rate\n`
      contextPrompt += `--------- | -------------- | ---------- | --------------\n`
      if (metrics.offer_collector_exec_time) {
        contextPrompt += `Offer Collector | ${metrics.offer_collector_exec_time} | ${metrics.offer_collector_exceptions} | ${metrics.offer_collector_cache_hit}\n`
      }
      if (metrics.nba_allissues_exec_time) {
        contextPrompt += `Eligibility_Check_Primary | ${metrics.nba_allissues_exec_time} | ${metrics.nba_allissues_exceptions} | ${metrics.nba_allissues_cache_hit}\n`
      }
      if (metrics.suitability_check_exec_time) {
        contextPrompt += `Suitability Check | ${metrics.suitability_check_exec_time} | ${metrics.suitability_check_exceptions} | ${metrics.suitability_check_cache_hit}\n`
      }
      if (metrics.best_result_exec_time) {
        contextPrompt += `Best Result | ${metrics.best_result_exec_time} | ${metrics.best_result_exceptions} | ${metrics.best_result_cache_hit}\n`
      }
      if (metrics.nba_allgroups_exec_time) {
        contextPrompt += `Applicability_Check_Primary | ${metrics.nba_allgroups_exec_time} | ${metrics.nba_allgroups_exceptions} | ${metrics.nba_allgroups_cache_hit}\n`
      }
    }
    
    if (uiContext.dashboardContext.activeCharts.length > 0) {
      contextPrompt += `\nActive Charts: ${uiContext.dashboardContext.activeCharts.join(', ')}\n`
    }
  }

  // Add rules context if available
  if (uiContext.rulesContext) {
    contextPrompt += `\n### Rules Explorer State ###\n`
    
    if (uiContext.rulesContext.selectedNodes.length > 0) {
      contextPrompt += `Selected Nodes: ${uiContext.rulesContext.selectedNodes.join(', ')}\n`
    }
    
    if (uiContext.rulesContext.visibleNodeDetails) {
      const details = uiContext.rulesContext.visibleNodeDetails
      contextPrompt += `\nNode Details Currently Visible:\n`
      contextPrompt += `  - Name: ${details.nodeName}\n`
      contextPrompt += `  - Type: ${details.nodeType}\n`
      contextPrompt += `  - Condition: ${details.condition}\n`
      contextPrompt += `  - Data Sources: ${details.dataSource.join(', ')}\n`
    }
    
    if (uiContext.rulesContext.flowPath.length > 0) {
      contextPrompt += `Current Flow Path: ${uiContext.rulesContext.flowPath.join(' → ')}\n`
    }
  }

  // Add simulation context if available
  if (uiContext.simulationContext?.isSimulationActive) {
    contextPrompt += `\n### Active Simulation ###\n`
    
    // Current simulation
    if (uiContext.simulationContext.currentSimulation) {
      const current = uiContext.simulationContext.currentSimulation
      
      contextPrompt += `Current Simulation Customer Profile:\n`
      Object.entries(current.inputs).forEach(([key, value]) => {
        const friendlyKey = key === 'creditScore' ? 'Credit Score' : 
                           key === 'accountBalance' ? 'Account Balance' : 
                           key.charAt(0).toUpperCase() + key.slice(1)
        contextPrompt += `  - ${friendlyKey}: ${value}\n`
      })
      
      contextPrompt += `\nCurrent Simulation Results:\n`
      contextPrompt += `  - Final Result: ${current.results.finalResult}\n`
      contextPrompt += `  - Execution Path: ${current.results.executionPath.join(' → ')}\n`
      
      if (current.results.summary) {
        contextPrompt += `  - Rules Summary: ${current.results.summary.rulesPassed}/${current.results.summary.totalRules} passed, ${current.results.summary.rulesFailed} failed, ${current.results.summary.rulesNotEvaluated} not evaluated\n`
      }
      
      if (current.results.ruleResults.length > 0) {
        contextPrompt += `\nDetailed Rule Results:\n`
        current.results.ruleResults.forEach(rule => {
          const status = rule.status === 'passed' ? '✅' : rule.status === 'failed' ? '❌' : '⏸️'
          contextPrompt += `  ${status} ${rule.nodeName}: ${rule.ruleCondition}\n`
          
          if (rule.actualValue !== undefined) {
            contextPrompt += `     Actual: ${rule.actualValue}, Required: ${rule.requiredValue}\n`
          }
          
          if (rule.reason) {
            contextPrompt += `     Reason: ${rule.reason}\n`
          }
        })
      }
      
      contextPrompt += `  - Timestamp: ${current.results.timestamp}\n`
    }
    
    // Simulation history for comparison
    if (uiContext.simulationContext.simulationHistory && uiContext.simulationContext.simulationHistory.length > 0) {
      contextPrompt += `\n### Previous Simulations (for comparison) ###\n`
      contextPrompt += `Total previous simulations: ${uiContext.simulationContext.simulationHistory.length}\n`
      
      // Show summary of recent simulations (last 3)
      const recentSimulations = uiContext.simulationContext.simulationHistory.slice(-3)
      const totalSimulations = uiContext.simulationContext.simulationHistory.length
      recentSimulations.forEach((sim, index) => {
        const simNumber = totalSimulations - recentSimulations.length + index + 1
        contextPrompt += `\nSimulation #${simNumber}:\n`
        contextPrompt += `  - Inputs: ${Object.entries(sim.inputs).map(([k, v]) => `${k}=${v}`).join(', ')}\n`
        contextPrompt += `  - Result: ${sim.results.finalResult}\n`
        contextPrompt += `  - Rules Passed: ${sim.results.summary.rulesPassed}/${sim.results.summary.totalRules}\n`
        contextPrompt += `  - Timestamp: ${sim.results.timestamp}\n`
      })
    }
  }

  return contextPrompt
}

// Combined context formatter that includes both strategy and UI context
export function formatCompleteContextForPrompt(uiContext: UIContext, userQuery: string): string {
  // Get existing strategy context
  const strategyContext = formatContextForPrompt(userQuery)
  
  // Get UI context
  const uiContextPrompt = formatUIContextForPrompt(uiContext, userQuery)
  
  // Combine both contexts
  return `${strategyContext}${uiContextPrompt}`
}

// Helper functions for creating context objects

export function createDashboardContext(
  visibleMetrics: string[] = [],
  activeCharts: string[] = [],
  metricValues: Record<string, number | string> = {},
  currentTimeRange?: string
): DashboardContext {
  return {
    visibleMetrics,
    activeCharts,
    metricValues,
    currentTimeRange
  }
}

export function createRulesContext(
  selectedNodes: string[] = [],
  visibleNodeDetails?: RulesContext['visibleNodeDetails'],
  flowPath: string[] = []
): RulesContext {
  return {
    selectedNodes,
    visibleNodeDetails,
    flowPath
  }
}

export function createSimulationContext(
  isActive: boolean = false,
  currentSimulation?: SimulationContext['currentSimulation'],
  simulationHistory?: SimulationContext['simulationHistory']
): SimulationContext {
  return {
    isSimulationActive: isActive,
    currentSimulation,
    simulationHistory
  }
}

export function createUIContext(
  pageContext: PageContext,
  dashboardContext?: DashboardContext,
  rulesContext?: RulesContext,
  simulationContext?: SimulationContext
): UIContext {
  return {
    pageContext,
    dashboardContext,
    rulesContext,
    simulationContext
  }
}