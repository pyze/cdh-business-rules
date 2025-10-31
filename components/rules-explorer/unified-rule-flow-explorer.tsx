'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { 
  ArrowDown, 
  ArrowRight, 
  Database, 
  ExternalLink, 
  GitBranch, 
  Layers,
  Filter,
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
  Percent,
  Play,
  RotateCcw,
  TestTube,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

import strategyData from '@/utils/strategy-context.json'
import WhatIfSimulator from './what-if-simulator'

interface NodeDetail {
  node_name: string
  node_type: string
  condition_rule: string
  data_sources: string[]
  external_systems: string
  runtime_method: string
  performance_optimization: string
  error_handling: string
}

interface FlowStageStats {
  passRate: number
  avgExecutionTime: number
  errorRate: number
  volume: number
}

interface CustomerProfile {
  segment: string
  region: string
  age: number
  creditScore: number
  propensity: number
  accountBalance: number
}

interface SimulationResult {
  nodesPassed: string[]
  nodesFailed: string[]
  finalOutcome: string
  offerSelected: string | null
  executionPath: string[]
  timestamp: string
  ruleResults: Array<{
    nodeName: string
    ruleCondition: string
    status: 'passed' | 'failed' | 'not_evaluated'
    actualValue?: any
    requiredValue?: any
    reason?: string
  }>
}

// Mock performance data - in real implementation, this would come from the runtime dashboard
const mockPerformanceData: Record<string, FlowStageStats> = {
  'External Input': { passRate: 100, avgExecutionTime: 5, errorRate: 0, volume: 1000 },
  'Eligibility_Check_Primary': { passRate: 85, avgExecutionTime: 45, errorRate: 2, volume: 1000 },
  'Applicability Check': { passRate: 78, avgExecutionTime: 32, errorRate: 1, volume: 850 },
  'Applicability_Check_Primary': { passRate: 92, avgExecutionTime: 28, errorRate: 0.5, volume: 663 },
  'Suitability Check': { passRate: 67, avgExecutionTime: 55, errorRate: 3, volume: 610 },
  'Suitability_Check_Primary': { passRate: 89, avgExecutionTime: 38, errorRate: 1, volume: 409 },
  'Offer Collector': { passRate: 94, avgExecutionTime: 62, errorRate: 2, volume: 364 },
  'Eligibility_Extension': { passRate: 96, avgExecutionTime: 25, errorRate: 0.5, volume: 342 },
  'Best Result': { passRate: 88, avgExecutionTime: 48, errorRate: 1.5, volume: 328 },
  'Results': { passRate: 100, avgExecutionTime: 15, errorRate: 0, volume: 289 }
}

interface UnifiedRuleFlowExplorerProps {
  onSimulationComplete?: (profile: any, result: any) => void
}

export default function UnifiedRuleFlowExplorer({ onSimulationComplete }: UnifiedRuleFlowExplorerProps) {
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set())
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>({
    segment: 'HighValue',
    region: 'Region Central',
    age: 35,
    creditScore: 75,
    propensity: 0.8,
    accountBalance: 5000
  })
  const [simulatorHeight, setSimulatorHeight] = useState(400) // Default height in pixels
  const [isDragging, setIsDragging] = useState(false)
  const [isSimulatorCollapsed, setIsSimulatorCollapsed] = useState(true)

  const { node_details, key_relationships } = strategyData
  const segments = ['HighValue', 'Premium', 'Standard', 'Basic']
  const regions = ['Region East', 'Region Central', 'Region Midwest', 'Region West', 'Region North']

  // Helper function to format node names for better display
  const formatNodeName = (nodeName: string) => {
    return nodeName.replace(/_/g, ' ')
  }


  const getNodeColor = (nodeType: string, isSelected: boolean, isHovered: boolean, isSearchMatch: boolean, nodeName?: string) => {
    let baseColor = 'bg-gray-50 border-gray-200'
    if (nodeType === 'Input' || nodeType === 'Output') baseColor = 'bg-slate-50 border-slate-200'
    else if (nodeType.includes('Eligibility')) baseColor = 'bg-red-50 border-red-200'
    else if (nodeType.includes('Applicability')) baseColor = 'bg-blue-50 border-blue-200'
    else if (nodeType.includes('Suitability')) baseColor = 'bg-green-50 border-green-200'
    else if (nodeType.includes('Offer')) baseColor = 'bg-purple-50 border-purple-200'
    
    // Override with simulation results if available
    if (simulationResult && nodeName) {
      if (simulationResult.nodesPassed.includes(nodeName)) {
        baseColor = 'bg-green-50 border-green-300'
      } else if (simulationResult.nodesFailed.includes(nodeName)) {
        baseColor = 'bg-red-50 border-red-300'
      }
    }
    
    if (isSelected) return baseColor + ' ring-2 ring-primary shadow-md'
    if (isSearchMatch) return baseColor + ' ring-2 ring-yellow-400 bg-yellow-50 shadow-lg animate-pulse'
    if (isHovered) return baseColor + ' shadow-md scale-105 transition-all duration-200'
    return baseColor + ' hover:shadow-sm transition-all duration-150'
  }

  const getNodeIcon = (nodeType: string) => {
    if (nodeType === 'Input' || nodeType === 'Output') return <Database className="h-4 w-4" />
    if (nodeType.includes('Eligibility')) return <GitBranch className="h-4 w-4" />
    if (nodeType.includes('Applicability')) return <Filter className="h-4 w-4" />
    if (nodeType.includes('Suitability')) return <Layers className="h-4 w-4" />
    return <GitBranch className="h-4 w-4" />
  }

  const getPerformanceColor = (passRate: number) => {
    if (passRate >= 90) return 'text-green-600'
    if (passRate >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const runSimulation = () => {
    setIsSimulating(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const result = simulateRuleExecution(customerProfile)
      setSimulationResult(result)
      
      // Notify parent component about simulation completion
      if (onSimulationComplete) {
        onSimulationComplete(customerProfile, result)
      }
      
      setIsSimulating(false)
    }, 1500)
  }

  const simulateRuleExecution = (profile: CustomerProfile): SimulationResult => {
    const nodesPassed: string[] = []
    const nodesFailed: string[] = []
    const executionPath: string[] = []
    const ruleResults: SimulationResult['ruleResults'] = []

    // Simulate rule evaluation based on actual conditions
    node_details.forEach(node => {
      executionPath.push(node.node_name)
      
      if (node.condition_rule === 'None') {
        nodesPassed.push(node.node_name)
        ruleResults.push({
          nodeName: node.node_name,
          ruleCondition: 'None',
          status: 'passed'
        })
        return
      }

      let passed = false
      let actualValue: any
      let requiredValue: any
      let reason: string | undefined
      const condition = node.condition_rule

      // Evaluate conditions based on customer profile
      if (condition.includes("Region = 'Region Central'")) {
        passed = profile.region === 'Region Central'
        actualValue = profile.region
        requiredValue = 'Region Central'
        if (!passed) reason = `Customer region '${profile.region}' does not match required 'Region Central'`
      } else if (condition.includes('Customer.Eligible = true')) {
        passed = true // Assume eligible for simulation
        actualValue = true
        requiredValue = true
      } else if (condition.includes("Customer.Group = 'Premium'")) {
        passed = profile.segment === 'Premium' || profile.segment === 'HighValue'
        actualValue = profile.segment
        requiredValue = 'Premium or HighValue'
        if (!passed) reason = `Customer segment '${profile.segment}' is not Premium or HighValue`
      } else if (condition.includes('Customer.Age > 25')) {
        const ageCheck = profile.age > 25
        const balanceCheck = profile.accountBalance > 1000
        passed = ageCheck && balanceCheck
        actualValue = `Age: ${profile.age}, Balance: ${profile.accountBalance}`
        requiredValue = 'Age > 25 and Balance > 1000'
        if (!passed) {
          const failedChecks = []
          if (!ageCheck) failedChecks.push(`age ${profile.age} ≤ 25`)
          if (!balanceCheck) failedChecks.push(`balance ${profile.accountBalance} ≤ 1000`)
          reason = `Failed: ${failedChecks.join(', ')}`
        }
      } else if (condition.includes('CreditScore > 60')) {
        passed = profile.creditScore > 60
        actualValue = profile.creditScore
        requiredValue = '> 60'
        if (!passed) reason = `Credit score ${profile.creditScore} is not greater than 60`
      } else if (condition.includes("Segment = 'HighValue'")) {
        const segmentCheck = profile.segment === 'HighValue'
        const propensityCheck = profile.propensity > 0.7
        passed = segmentCheck && propensityCheck
        actualValue = `Segment: ${profile.segment}, Propensity: ${profile.propensity}`
        requiredValue = "Segment: 'HighValue' and Propensity > 0.7"
        if (!passed) {
          const failedChecks = []
          if (!segmentCheck) failedChecks.push(`segment '${profile.segment}' ≠ 'HighValue'`)
          if (!propensityCheck) failedChecks.push(`propensity ${profile.propensity} ≤ 0.7`)
          reason = `Failed: ${failedChecks.join(', ')}`
        }
      } else if (condition.includes('PrioritizationScore > 90')) {
        const creditCheck = profile.creditScore > 70
        const propensityCheck = profile.propensity > 0.8
        passed = creditCheck && propensityCheck
        actualValue = `Credit: ${profile.creditScore}, Propensity: ${profile.propensity}`
        requiredValue = 'Credit > 70 and Propensity > 0.8'
        if (!passed) {
          const failedChecks = []
          if (!creditCheck) failedChecks.push(`credit ${profile.creditScore} ≤ 70`)
          if (!propensityCheck) failedChecks.push(`propensity ${profile.propensity} ≤ 0.8`)
          reason = `Failed: ${failedChecks.join(', ')}`
        }
      } else {
        passed = Math.random() > 0.3 // Random for unhandled conditions
        actualValue = 'Unknown'
        requiredValue = 'Unknown'
        if (!passed) reason = 'Random evaluation failed'
      }

      ruleResults.push({
        nodeName: node.node_name,
        ruleCondition: condition,
        status: passed ? 'passed' : 'failed',
        actualValue,
        requiredValue,
        reason
      })

      if (passed) {
        nodesPassed.push(node.node_name)
      } else {
        nodesFailed.push(node.node_name)
      }
    })

    // Determine final outcome
    const criticalNodesPassed = nodesPassed.filter(node =>
      ['Eligibility_Check_Primary', 'Applicability_Check_Primary', 'Suitability Check', 'Best Result'].includes(node)
    )

    let finalOutcome = 'No Offer'
    let offerSelected = null

    if (criticalNodesPassed.length >= 3) {
      finalOutcome = 'Offer Approved'
      offerSelected = profile.segment === 'HighValue' ? 'Premium Offer' :
                     profile.segment === 'Premium' ? 'Standard Plus Offer' :
                     'Basic Offer'
    } else if (criticalNodesPassed.length >= 2) {
      finalOutcome = 'Qualified with Conditions'
    } else {
      finalOutcome = 'Not Qualified'
    }

    return {
      nodesPassed,
      nodesFailed,
      finalOutcome,
      offerSelected,
      executionPath,
      timestamp: new Date().toISOString(),
      ruleResults
    }
  }

  const resetSimulation = () => {
    setSimulationResult(null)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const newHeight = window.innerHeight - e.clientY
    const minHeight = 250 // Minimum height
    const maxHeight = window.innerHeight * 0.7 // Maximum 70% of screen
    
    setSimulatorHeight(Math.max(minHeight, Math.min(newHeight, maxHeight)))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  const handleNodeClick = (node: NodeDetail) => {
    setSelectedNode(node)
    // Highlight related nodes based on shared data sources or conditions
    const related = new Set<string>()
    node_details.forEach(otherNode => {
      if (otherNode.node_name !== node.node_name) {
        // Check for shared data sources
        const sharedSources = node.data_sources.some(source => 
          otherNode.data_sources.includes(source)
        )
        if (sharedSources) {
          related.add(otherNode.node_name)
        }
      }
    })
    setHighlightedNodes(related)
  }


  // Check if a node matches the search term
  const nodeMatchesSearch = (node: NodeDetail) => {
    if (!searchTerm) return false
    const searchLower = searchTerm.toLowerCase().replace(/_/g, ' ')
    return (
      node.node_name.toLowerCase().replace(/_/g, ' ').includes(searchLower) ||
      node.condition_rule.toLowerCase().includes(searchLower) ||
      node.node_type.toLowerCase().replace(/_/g, ' ').includes(searchLower) ||
      node.data_sources.some(source => source.toLowerCase().replace(/_/g, ' ').includes(searchLower))
    )
  }

  // Get search results
  const searchResults = searchTerm ? 
    node_details.filter(nodeMatchesSearch).map(node => node.node_name) : 
    []

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/10">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center - Flow Visualization */}
        <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 border-b bg-gradient-to-r from-primary/8 to-secondary/8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-xl text-primary">Customer Decision Flow</h3>
              <p className="text-sm text-muted-foreground/80 mt-1">
                Click nodes to view details • Search to highlight rules
              </p>
            </div>
            <div className="flex items-center gap-3">
              {searchResults.length > 0 && (
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border border-primary/20">
                  {searchResults.length} match{searchResults.length !== 1 ? 'es' : ''}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search rules by name, condition, type, or data source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 shadow-sm hover:shadow-md focus:shadow-md transition-all border-primary/20 focus:border-primary/40"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 p-8">
          <div className="space-y-8">
            {/* Input Stage */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-medium text-primary mb-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full shadow-sm">INPUT</div>
              {node_details.filter(node => node.node_type === 'Input').map(node => {
                const stats = mockPerformanceData[node.node_name]
                const isSelected = selectedNode?.node_name === node.node_name
                const isHovered = hoveredNode === node.node_name
                const isSearchMatch = searchResults.includes(node.node_name)
                
                return (
                  <div key={node.node_name} className="relative">
                    <div 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all shadow-sm hover:shadow-md ${
                        getNodeColor(node.node_type, isSelected, isHovered, isSearchMatch, node.node_name)
                      }`}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={() => setHoveredNode(node.node_name)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getNodeIcon(node.node_type)}
                        <span className="font-medium text-sm">{formatNodeName(node.node_name)}</span>
                        {simulationResult && (
                          <div className="ml-auto">
                            {simulationResult.nodesPassed.includes(node.node_name) ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : simulationResult.nodesFailed.includes(node.node_name) ? (
                              <AlertCircle className="h-3 w-3 text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {stats && isHovered && (
                        <div className="absolute top-full left-0 mt-2 text-xs bg-white border rounded p-2 shadow-lg z-10 w-full">
                          <div>Volume: {stats.volume.toLocaleString()}</div>
                          <div>Pass Rate: {stats.passRate}%</div>
                          <div>Avg Time: {stats.avgExecutionTime}ms</div>
                        </div>
                      )}
                    </div>
                    <ArrowDown className="h-5 w-5 text-muted-foreground mx-auto mt-2" />
                  </div>
                )
              })}
            </div>

            {/* Eligibility Stage */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-medium text-primary mb-2 px-3 py-1 bg-gradient-to-r from-red-50 to-red-100 rounded-full shadow-sm">ELIGIBILITY CHECKS</div>
              <div className="flex gap-4 flex-wrap justify-center">
                {node_details.filter(node => node.node_type.includes('Eligibility')).map(node => {
                  const stats = mockPerformanceData[node.node_name]
                  const isSelected = selectedNode?.node_name === node.node_name
                  const isHovered = hoveredNode === node.node_name
                  const isSearchMatch = searchResults.includes(node.node_name)
                  
                  return (
                    <div key={node.node_name} className="relative">
                      <div 
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all w-48 shadow-sm hover:shadow-md ${
                          getNodeColor(node.node_type, isSelected, isHovered, isSearchMatch, node.node_name)
                        }`}
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={() => setHoveredNode(node.node_name)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {getNodeIcon(node.node_type)}
                          <span className="font-medium text-sm">{formatNodeName(node.node_name)}</span>
                          {simulationResult && (
                            <div className="ml-auto">
                              {simulationResult.nodesPassed.includes(node.node_name) ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : simulationResult.nodesFailed.includes(node.node_name) ? (
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              ) : null}
                            </div>
                          )}
                        </div>
                        {stats && (
                          <div className="flex items-center justify-between text-xs mt-2">
                            <div className="flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              <span className={getPerformanceColor(stats.passRate)}>
                                {stats.passRate}%
                              </span>
                            </div>
                            <div className="text-muted-foreground">
                              {stats.volume}
                            </div>
                          </div>
                        )}
                        {isHovered && (
                          <div className="absolute top-full left-0 mt-2 text-xs bg-white border rounded p-2 shadow-lg z-10 w-full">
                            <div>{node.condition_rule}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <ArrowDown className="h-5 w-5 text-muted-foreground mx-auto mt-2" />
            </div>

            {/* Applicability Stage */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-medium text-primary mb-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full shadow-sm">APPLICABILITY CHECKS</div>
              <div className="flex gap-4 flex-wrap justify-center">
                {node_details.filter(node => node.node_type.includes('Applicability')).map(node => {
                  const stats = mockPerformanceData[node.node_name]
                  const isSelected = selectedNode?.node_name === node.node_name
                  const isHovered = hoveredNode === node.node_name
                  const isSearchMatch = searchResults.includes(node.node_name)
                  
                  return (
                    <div key={node.node_name} className="relative">
                      <div 
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all w-48 shadow-sm hover:shadow-md ${
                          getNodeColor(node.node_type, isSelected, isHovered, isSearchMatch, node.node_name)
                        }`}
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={() => setHoveredNode(node.node_name)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {getNodeIcon(node.node_type)}
                          <span className="font-medium text-sm">{formatNodeName(node.node_name)}</span>
                          {simulationResult && (
                            <div className="ml-auto">
                              {simulationResult.nodesPassed.includes(node.node_name) ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : simulationResult.nodesFailed.includes(node.node_name) ? (
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              ) : null}
                            </div>
                          )}
                        </div>
                        {stats && (
                          <div className="flex items-center justify-between text-xs mt-2">
                            <div className="flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              <span className={getPerformanceColor(stats.passRate)}>
                                {stats.passRate}%
                              </span>
                            </div>
                            <div className="text-muted-foreground">
                              {stats.volume}
                            </div>
                          </div>
                        )}
                        {isHovered && (
                          <div className="absolute top-full left-0 mt-2 text-xs bg-white border rounded p-2 shadow-lg z-10 w-full">
                            <div>{node.condition_rule}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <ArrowDown className="h-5 w-5 text-muted-foreground mx-auto mt-2" />
            </div>

            {/* Suitability Stage */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-medium text-primary mb-2 px-3 py-1 bg-gradient-to-r from-green-50 to-green-100 rounded-full shadow-sm">SUITABILITY CHECKS</div>
              <div className="flex gap-4 flex-wrap justify-center">
                {node_details.filter(node => node.node_type.includes('Suitability')).map(node => {
                  const stats = mockPerformanceData[node.node_name]
                  const isSelected = selectedNode?.node_name === node.node_name
                  const isHovered = hoveredNode === node.node_name
                  const isSearchMatch = searchResults.includes(node.node_name)
                  
                  return (
                    <div key={node.node_name} className="relative">
                      <div 
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all w-48 shadow-sm hover:shadow-md ${
                          getNodeColor(node.node_type, isSelected, isHovered, isSearchMatch, node.node_name)
                        }`}
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={() => setHoveredNode(node.node_name)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {getNodeIcon(node.node_type)}
                          <span className="font-medium text-sm">{formatNodeName(node.node_name)}</span>
                          {simulationResult && (
                            <div className="ml-auto">
                              {simulationResult.nodesPassed.includes(node.node_name) ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : simulationResult.nodesFailed.includes(node.node_name) ? (
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              ) : null}
                            </div>
                          )}
                        </div>
                        {stats && (
                          <div className="flex items-center justify-between text-xs mt-2">
                            <div className="flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              <span className={getPerformanceColor(stats.passRate)}>
                                {stats.passRate}%
                              </span>
                            </div>
                            <div className="text-muted-foreground">
                              {stats.volume}
                            </div>
                          </div>
                        )}
                        {isHovered && (
                          <div className="absolute top-full left-0 mt-2 text-xs bg-white border rounded p-2 shadow-lg z-10 w-full">
                            <div>{node.condition_rule}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <ArrowDown className="h-5 w-5 text-muted-foreground mx-auto mt-2" />
            </div>

            {/* Offer Evaluation Stage */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-medium text-primary mb-2 px-3 py-1 bg-gradient-to-r from-purple-50 to-purple-100 rounded-full shadow-sm">OFFER EVALUATION</div>
              <div className="flex gap-4 flex-wrap justify-center">
                {node_details.filter(node => 
                  node.node_type.includes('Offer') || node.node_type.includes('Final') || node.node_type === 'Output'
                ).map(node => {
                  const stats = mockPerformanceData[node.node_name]
                  const isSelected = selectedNode?.node_name === node.node_name
                  const isHovered = hoveredNode === node.node_name
                  const isSearchMatch = searchResults.includes(node.node_name)
                  
                  return (
                    <div key={node.node_name} className="relative">
                      <div 
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all w-48 shadow-sm hover:shadow-md ${
                          getNodeColor(node.node_type, isSelected, isHovered, isSearchMatch, node.node_name)
                        }`}
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={() => setHoveredNode(node.node_name)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {getNodeIcon(node.node_type)}
                          <span className="font-medium text-sm">{formatNodeName(node.node_name)}</span>
                          {simulationResult && (
                            <div className="ml-auto">
                              {simulationResult.nodesPassed.includes(node.node_name) ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : simulationResult.nodesFailed.includes(node.node_name) ? (
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              ) : null}
                            </div>
                          )}
                        </div>
                        {node.external_systems !== 'None' && (
                          <Badge variant="outline" className="text-xs mb-2">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {node.external_systems}
                          </Badge>
                        )}
                        {stats && (
                          <div className="flex items-center justify-between text-xs mt-2">
                            <div className="flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              <span className={getPerformanceColor(stats.passRate)}>
                                {stats.passRate}%
                              </span>
                            </div>
                            <div className="text-muted-foreground">
                              {stats.volume}
                            </div>
                          </div>
                        )}
                        {isHovered && node.condition_rule !== 'None' && (
                          <div className="absolute top-full left-0 mt-2 text-xs bg-white border rounded p-2 shadow-lg z-10 w-full">
                            <div>{node.condition_rule}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

        {/* Right Sidebar - Node Details */}
        <div className="w-80 border-l bg-card overflow-hidden flex flex-col shadow-lg">
        <div className="p-4 border-b bg-gradient-to-r from-primary/20 to-secondary/20">
          <h3 className="font-semibold text-lg text-primary">Rule Details</h3>
        </div>

        {selectedNode ? (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-base mb-2">{selectedNode.node_name}</h4>
                <Badge variant="outline" className="mb-3">
                  {selectedNode.node_type}
                </Badge>
              </div>
              
              <Separator />

              {selectedNode.condition_rule !== 'None' && (
                <div>
                  <h5 className="font-medium text-sm text-muted-foreground mb-2">BUSINESS RULE</h5>
                  <p className="text-sm bg-muted p-3 rounded">
                    {selectedNode.condition_rule}
                  </p>
                </div>
              )}

              <div>
                <h5 className="font-medium text-sm text-muted-foreground mb-2">DATA SOURCES</h5>
                <div className="space-y-1">
                  {selectedNode.data_sources.map((source, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Database className="h-3 w-3" />
                      <span>{source}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedNode.external_systems !== 'None' && (
                <div>
                  <h5 className="font-medium text-sm text-muted-foreground mb-2">EXTERNAL SYSTEMS</h5>
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink className="h-3 w-3" />
                    <span>{selectedNode.external_systems}</span>
                  </div>
                </div>
              )}

              <div>
                <h5 className="font-medium text-sm text-muted-foreground mb-2">PERFORMANCE METRICS</h5>
                {(() => {
                  const stats = mockPerformanceData[selectedNode.node_name]
                  if (!stats) return <div className="text-sm text-muted-foreground">No data available</div>
                  
                  return (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-lg font-semibold text-green-600">{stats.passRate}%</div>
                          <div className="text-xs text-muted-foreground">Pass Rate</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-lg font-semibold text-blue-600">{stats.avgExecutionTime}ms</div>
                          <div className="text-xs text-muted-foreground">Avg Time</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-lg font-semibold text-purple-600">{stats.volume.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Volume</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 rounded shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-lg font-semibold text-red-600">{stats.errorRate}%</div>
                          <div className="text-xs text-muted-foreground">Error Rate</div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div>
                <h5 className="font-medium text-sm text-muted-foreground mb-2">TECHNICAL DETAILS</h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Method:</span> {selectedNode.runtime_method}
                  </div>
                  <div>
                    <span className="font-medium">Optimization:</span> {selectedNode.performance_optimization}
                  </div>
                  <div>
                    <span className="font-medium">Error Handling:</span> {selectedNode.error_handling}
                  </div>
                </div>
              </div>

              {highlightedNodes.size > 0 && (
                <div>
                  <h5 className="font-medium text-sm text-muted-foreground mb-2">RELATED RULES</h5>
                  <div className="space-y-1">
                    {Array.from(highlightedNodes).map(nodeName => (
                      <div key={nodeName} className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded">
                        {nodeName}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Rules sharing data sources with the selected rule
                  </p>
                </div>
              )}

            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-4">
            <div>
              <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a rule from the flow or list to view details</p>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Bottom Dock - Simulator */}
      <div 
        className="border-t bg-card flex-shrink-0 shadow-lg transition-all duration-300" 
        style={{ height: isSimulatorCollapsed ? '60px' : `${simulatorHeight}px` }}
      >
        {/* Drag Handle - only show when not collapsed */}
        {!isSimulatorCollapsed && (
          <div 
            className={`h-2 bg-border hover:bg-primary cursor-row-resize transition-colors flex items-center justify-center ${
              isDragging ? 'bg-primary' : ''
            }`}
            onMouseDown={handleMouseDown}
          >
            <div className="w-8 h-0.5 bg-muted-foreground rounded-full opacity-60" />
          </div>
        )}
        
        {/* Header with Toggle - Entire header clickable */}
        <div 
          className="px-4 py-3 border-b bg-gradient-to-r from-primary/5 to-secondary/5 flex items-center gap-3 cursor-pointer hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all duration-200"
          onClick={() => setIsSimulatorCollapsed(!isSimulatorCollapsed)}
        >
          <div className="text-primary p-1 h-8 w-8 flex items-center justify-center flex-shrink-0">
            {isSimulatorCollapsed ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
          <h3 className="font-semibold text-base flex items-center gap-2 text-primary">
            <TestTube className="h-4 w-4" />
            What-If Simulator
          </h3>
        </div>
        
        {/* Simulator Content - only show when not collapsed */}
        {!isSimulatorCollapsed && (
          <div 
            className="p-6 overflow-y-auto" 
            style={{ height: `${simulatorHeight - 70}px` }}
          >
            <div className="grid grid-cols-12 gap-8">
              {/* Customer Profile Controls */}
              <div className="col-span-4">
                <div className="bg-gradient-to-br from-white via-white to-primary/5 border border-primary/10 rounded-lg shadow-sm hover:shadow-md transition-all p-6 space-y-6">
                  <div className="border-b border-primary/10 pb-3">
                    <h4 className="font-bold text-lg text-primary">Customer Profile</h4>
                    <p className="text-xs text-muted-foreground/80 mt-1">Configure attributes for simulation</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold text-primary/80">Customer Segment</Label>
                      <Select 
                        value={customerProfile.segment} 
                        onValueChange={(value) => setCustomerProfile(prev => ({ ...prev, segment: value }))}
                      >
                        <SelectTrigger className="h-9 shadow-sm hover:shadow-md transition-all border-primary/30 focus:border-primary/50 bg-gradient-to-r from-white to-primary/5">
                          <SelectValue className="text-primary/90" />
                        </SelectTrigger>
                      <SelectContent>
                        {segments.map(segment => (
                          <SelectItem key={segment} value={segment}>
                            {segment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-semibold text-primary">Region</Label>
                      <Select 
                        value={customerProfile.region} 
                        onValueChange={(value) => setCustomerProfile(prev => ({ ...prev, region: value }))}
                      >
                        <SelectTrigger className="h-9 shadow-sm hover:shadow-md transition-all border-primary/20 focus:border-primary/40">
                          <SelectValue />
                        </SelectTrigger>
                      <SelectContent>
                        {regions.map(region => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-semibold text-primary">Age: {customerProfile.age}</Label>
                      <div className="px-2">
                        <Slider
                          value={[customerProfile.age]}
                          onValueChange={(value) => setCustomerProfile(prev => ({ ...prev, age: value[0] }))}
                          max={80}
                          min={18}
                          step={1}
                          className="w-full [&_[data-orientation=horizontal]]:bg-primary/20 [&_[role=slider]]:bg-primary/80 [&_[role=slider]]:border-primary/60"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-semibold text-primary">Credit Score: {customerProfile.creditScore}</Label>
                      <div className="px-2">
                        <Slider
                          value={[customerProfile.creditScore]}
                          onValueChange={(value) => setCustomerProfile(prev => ({ ...prev, creditScore: value[0] }))}
                          max={100}
                          min={0}
                          step={5}
                          className="w-full [&_[data-orientation=horizontal]]:bg-primary/20 [&_[role=slider]]:bg-primary/80 [&_[role=slider]]:border-primary/60"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 col-span-2">
                      <Label className="text-xs font-semibold text-primary">Propensity: {customerProfile.propensity.toFixed(2)}</Label>
                      <div className="px-2">
                        <Slider
                          value={[customerProfile.propensity]}
                          onValueChange={(value) => setCustomerProfile(prev => ({ ...prev, propensity: value[0] }))}
                          max={1}
                          min={0}
                          step={0.1}
                          className="w-full [&_[data-orientation=horizontal]]:bg-primary/20 [&_[role=slider]]:bg-primary/80 [&_[role=slider]]:border-primary/60"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Simulation Controls */}
                  <Button 
                    onClick={runSimulation} 
                    disabled={isSimulating} 
                    variant="outline"
                    className="w-full shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30 text-primary hover:from-primary/20 hover:to-primary/30 hover:border-primary/40" 
                    size="sm"
                  >
                    {isSimulating ? (
                      <>Running...</>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Simulation
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Simulation Results */}
              <div className="col-span-8">
                <div className="bg-gradient-to-br from-white via-white to-secondary/5 border border-secondary/10 rounded-lg shadow-sm hover:shadow-md transition-all p-6 h-full">
                  
                  {!simulationResult ? (
                    <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                      <div>
                        <TestTube className="h-16 w-16 mx-auto mb-6 opacity-40" />
                        <p className="text-lg font-medium mb-2">Ready to Simulate</p>
                        <p className="text-sm">Configure customer profile and run simulation to see results</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Final Outcome */}
                      <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-2 p-6 bg-gradient-to-br from-white to-gray-50/50 border border-primary/10 rounded-lg shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-bold text-base text-primary">Final Outcome</h5>
                            <Badge 
                              variant={
                                simulationResult.finalOutcome === 'Offer Approved' ? 'default' :
                                simulationResult.finalOutcome === 'Qualified with Conditions' ? 'secondary' :
                                'destructive'
                              }
                              className="shadow-sm"
                            >
                              {simulationResult.finalOutcome}
                            </Badge>
                          </div>
                          {simulationResult.offerSelected && (
                            <p className="text-sm text-muted-foreground/80 font-medium">
                              Recommended: <span className="text-primary">{simulationResult.offerSelected}</span>
                            </p>
                          )}
                        </div>

                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg shadow-sm hover:shadow-md transition-all">
                          <div className="text-3xl font-bold text-green-600">
                            {simulationResult.nodesPassed.length}
                          </div>
                          <div className="text-sm text-green-600 font-medium">Rules Passed</div>
                      </div>

                        <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-all">
                          <div className="text-3xl font-bold text-red-600">
                            {simulationResult.nodesFailed.length}
                          </div>
                          <div className="text-sm text-red-600 font-medium">Rules Failed</div>
                        </div>
                      </div>

                      {/* Execution Path */}
                      <div className="bg-gradient-to-br from-white to-gray-50/30 border border-primary/10 rounded-lg p-6 shadow-sm">
                        <h5 className="font-bold text-base text-primary mb-4">Execution Path</h5>
                        <div className="flex flex-wrap gap-3">
                          {simulationResult.executionPath.map((node, index) => {
                            const nodeDetail = node_details.find(n => n.node_name === node)
                            return (
                              <div key={index} className="flex items-center">
                                <Badge 
                                  variant="outline"
                                  className={`text-xs cursor-pointer hover:shadow-md transition-all shadow-sm font-medium ${
                                    simulationResult.nodesPassed.includes(node) 
                                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                  }`}
                                  onClick={() => nodeDetail && handleNodeClick(nodeDetail)}
                                >
                                  {node}
                                </Badge>
                              {index < simulationResult.executionPath.length - 1 && (
                                <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground" />
                              )}
                            </div>
                          )
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground/80 mt-4 font-medium">
                          Click any rule to view details in the sidebar
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}