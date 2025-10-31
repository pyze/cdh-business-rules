'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Play, 
  RotateCcw, 
  Save, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowRight,
  Copy
} from 'lucide-react'

import strategyData from '@/utils/strategy-context.json'

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

interface WhatIfSimulatorProps {
  onSimulationComplete?: (profile: CustomerProfile, result: SimulationResult) => void
}

export default function WhatIfSimulator({ onSimulationComplete }: WhatIfSimulatorProps) {
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>({
    segment: 'HighValue',
    region: 'Region Central',
    age: 35,
    creditScore: 75,
    propensity: 0.8,
    accountBalance: 5000
  })

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const { node_details } = strategyData
  const simulation_attributes = ['Segment', 'Region', 'CreditScore', 'Propensity']

  const segments = ['HighValue', 'Premium', 'Standard', 'Basic']
  const regions = ['Region East', 'Region Central', 'Region Midwest', 'Region West', 'Region North']

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
    setCustomerProfile({
      segment: 'HighValue',
      region: 'Region Central',
      age: 35,
      creditScore: 75,
      propensity: 0.8,
      accountBalance: 5000
    })
    setSimulationResult(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Profile Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Profile</CardTitle>
            <CardDescription>
              Adjust customer attributes to test different scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="segment">Customer Segment</Label>
                <Select 
                  value={customerProfile.segment} 
                  onValueChange={(value) => setCustomerProfile(prev => ({ ...prev, segment: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
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

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select 
                  value={customerProfile.region} 
                  onValueChange={(value) => setCustomerProfile(prev => ({ ...prev, region: value }))}
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label>Age: {customerProfile.age}</Label>
                <Slider
                  value={[customerProfile.age]}
                  onValueChange={(value) => setCustomerProfile(prev => ({ ...prev, age: value[0] }))}
                  max={80}
                  min={18}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Credit Score: {customerProfile.creditScore}</Label>
                <Slider
                  value={[customerProfile.creditScore]}
                  onValueChange={(value) => setCustomerProfile(prev => ({ ...prev, creditScore: value[0] }))}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Propensity: {customerProfile.propensity.toFixed(2)}</Label>
                <Slider
                  value={[customerProfile.propensity]}
                  onValueChange={(value) => setCustomerProfile(prev => ({ ...prev, propensity: value[0] }))}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Account Balance: ${customerProfile.accountBalance.toLocaleString()}</Label>
                <Slider
                  value={[customerProfile.accountBalance]}
                  onValueChange={(value) => setCustomerProfile(prev => ({ ...prev, accountBalance: value[0] }))}
                  max={50000}
                  min={0}
                  step={500}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={runSimulation} disabled={isSimulating} className="flex-1">
                {isSimulating ? (
                  <>Running...</>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetSimulation}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Simulation Results */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>
              Rule execution outcomes and decision path
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!simulationResult ? (
              <div className="text-center py-8 text-muted-foreground">
                Configure customer profile and run simulation to see results
              </div>
            ) : (
              <div className="space-y-4">
                {/* Final Outcome */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Final Outcome</h3>
                    <Badge variant={
                      simulationResult.finalOutcome === 'Offer Approved' ? 'default' :
                      simulationResult.finalOutcome === 'Qualified with Conditions' ? 'secondary' :
                      'destructive'
                    }>
                      {simulationResult.finalOutcome}
                    </Badge>
                  </div>
                  {simulationResult.offerSelected && (
                    <p className="text-sm text-muted-foreground">
                      Recommended: {simulationResult.offerSelected}
                    </p>
                  )}
                </div>

                {/* Rules Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Passed ({simulationResult.nodesPassed.length})
                    </h4>
                    <ScrollArea className="h-24">
                      <div className="space-y-1">
                        {simulationResult.nodesPassed.map((node, index) => (
                          <div key={index} className="text-xs p-1 bg-green-50 text-green-700 rounded">
                            {node}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Failed ({simulationResult.nodesFailed.length})
                    </h4>
                    <ScrollArea className="h-24">
                      <div className="space-y-1">
                        {simulationResult.nodesFailed.map((node, index) => (
                          <div key={index} className="text-xs p-1 bg-red-50 text-red-700 rounded">
                            {node}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                {/* Execution Path */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Execution Path</h4>
                  <div className="flex flex-wrap gap-1">
                    {simulationResult.executionPath.map((node, index) => (
                      <div key={index} className="flex items-center">
                        <Badge 
                          variant={simulationResult.nodesPassed.includes(node) ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {node}
                        </Badge>
                        {index < simulationResult.executionPath.length - 1 && (
                          <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Scenario
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Compare
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Scenario Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Scenarios</CardTitle>
          <CardDescription>
            Pre-configured customer profiles for common test cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => setCustomerProfile({
                segment: 'HighValue',
                region: 'Region Central',
                age: 45,
                creditScore: 85,
                propensity: 0.9,
                accountBalance: 25000
              })}
            >
              <div className="font-semibold">High-Value Customer</div>
              <div className="text-xs text-muted-foreground">
                Premium segment, excellent credit, high propensity
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => setCustomerProfile({
                segment: 'Standard',
                region: 'Region East',
                age: 28,
                creditScore: 65,
                propensity: 0.5,
                accountBalance: 2000
              })}
            >
              <div className="font-semibold">Average Customer</div>
              <div className="text-xs text-muted-foreground">
                Standard segment, fair credit, moderate propensity
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => setCustomerProfile({
                segment: 'Basic',
                region: 'Region North',
                age: 22,
                creditScore: 45,
                propensity: 0.2,
                accountBalance: 500
              })}
            >
              <div className="font-semibold">Entry-Level Customer</div>
              <div className="text-xs text-muted-foreground">
                Basic segment, poor credit, low propensity
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}