'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowDown, 
  ArrowRight, 
  Database, 
  ExternalLink, 
  GitBranch, 
  Layers,
  Filter,
  ZoomIn,
  Download
} from 'lucide-react'

import strategyData from '@/utils/strategy-context.json'

interface FlowNode {
  id: string
  name: string
  type: string
  condition: string
  dataSources: string[]
  externalSystems: string
  position: { x: number; y: number }
  connections: string[]
}

export default function FlowVisualization() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'full' | 'simplified'>('simplified')
  const [filterType, setFilterType] = useState<'all' | 'eligibility' | 'applicability' | 'suitability'>('all')

  const { node_details, key_relationships } = strategyData

  // Transform node data for visualization
  const flowNodes: FlowNode[] = node_details.map((node, index) => ({
    id: node.node_name,
    name: node.node_name,
    type: node.node_type,
    condition: node.condition_rule,
    dataSources: node.data_sources,
    externalSystems: node.external_systems,
    position: { x: 0, y: index * 120 }, // Simple vertical layout
    connections: [] // Will be populated based on relationships
  }))

  // Filter nodes based on selected type
  const filteredNodes = flowNodes.filter(node => {
    if (filterType === 'all') return true
    if (filterType === 'eligibility') return node.type.toLowerCase().includes('eligibility')
    if (filterType === 'applicability') return node.type.toLowerCase().includes('applicability')
    if (filterType === 'suitability') return node.type.toLowerCase().includes('suitability')
    return true
  })

  const getNodeColor = (nodeType: string) => {
    if (nodeType === 'Input') return 'bg-slate-100 border-slate-300'
    if (nodeType === 'Output') return 'bg-slate-100 border-slate-300'
    if (nodeType.includes('Eligibility')) return 'bg-red-50 border-red-200'
    if (nodeType.includes('Applicability')) return 'bg-blue-50 border-blue-200'
    if (nodeType.includes('Suitability')) return 'bg-green-50 border-green-200'
    if (nodeType.includes('Offer')) return 'bg-purple-50 border-purple-200'
    return 'bg-gray-50 border-gray-200'
  }

  const getNodeIcon = (nodeType: string) => {
    if (nodeType === 'Input' || nodeType === 'Output') return <Database className="h-4 w-4" />
    if (nodeType.includes('Eligibility')) return <GitBranch className="h-4 w-4" />
    if (nodeType.includes('Applicability')) return <Filter className="h-4 w-4" />
    if (nodeType.includes('Suitability')) return <Layers className="h-4 w-4" />
    return <GitBranch className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">View:</label>
            <Select value={viewMode} onValueChange={(value: 'full' | 'simplified') => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simplified">Simplified</SelectItem>
                <SelectItem value="full">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filter:</label>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Nodes</SelectItem>
                <SelectItem value="eligibility">Eligibility</SelectItem>
                <SelectItem value="applicability">Applicability</SelectItem>
                <SelectItem value="suitability">Suitability</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Flow Diagram */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Rule Execution Flow</CardTitle>
              <CardDescription>
                Customer journey through business rules and decision points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative min-h-[600px] p-4 bg-slate-50 rounded-lg overflow-auto">
                {/* Flow Steps */}
                <div className="space-y-6">
                  {/* Input Stage */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-muted-foreground mb-2">INPUT</div>
                    {filteredNodes.filter(node => node.type === 'Input').map(node => (
                      <div key={node.id} className="relative">
                        <div 
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                            getNodeColor(node.type)
                          } ${selectedNode === node.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => setSelectedNode(node.id)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {getNodeIcon(node.type)}
                            <span className="font-medium text-sm">{node.name}</span>
                          </div>
                          {viewMode === 'full' && node.condition !== 'None' && (
                            <div className="text-xs text-muted-foreground">
                              {node.condition}
                            </div>
                          )}
                        </div>
                        <ArrowDown className="h-5 w-5 text-muted-foreground mx-auto mt-2" />
                      </div>
                    ))}
                  </div>

                  {/* Eligibility Stage */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-muted-foreground mb-2">ELIGIBILITY CHECKS</div>
                    <div className="flex gap-4 flex-wrap justify-center">
                      {filteredNodes.filter(node => node.type.includes('Eligibility')).map(node => (
                        <div key={node.id} className="relative">
                          <div 
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md w-48 ${
                              getNodeColor(node.type)
                            } ${selectedNode === node.id ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => setSelectedNode(node.id)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {getNodeIcon(node.type)}
                              <span className="font-medium text-sm">{node.name}</span>
                            </div>
                            {viewMode === 'full' && (
                              <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">
                                  {node.condition}
                                </div>
                                {node.externalSystems !== 'None' && (
                                  <Badge variant="outline" className="text-xs">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    {node.externalSystems}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <ArrowDown className="h-5 w-5 text-muted-foreground mx-auto mt-2" />
                  </div>

                  {/* Applicability Stage */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-muted-foreground mb-2">APPLICABILITY CHECKS</div>
                    <div className="flex gap-4 flex-wrap justify-center">
                      {filteredNodes.filter(node => node.type.includes('Applicability')).map(node => (
                        <div key={node.id} className="relative">
                          <div 
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md w-48 ${
                              getNodeColor(node.type)
                            } ${selectedNode === node.id ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => setSelectedNode(node.id)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {getNodeIcon(node.type)}
                              <span className="font-medium text-sm">{node.name}</span>
                            </div>
                            {viewMode === 'full' && (
                              <div className="text-xs text-muted-foreground">
                                {node.condition}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <ArrowDown className="h-5 w-5 text-muted-foreground mx-auto mt-2" />
                  </div>

                  {/* Suitability Stage */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-muted-foreground mb-2">SUITABILITY CHECKS</div>
                    <div className="flex gap-4 flex-wrap justify-center">
                      {filteredNodes.filter(node => node.type.includes('Suitability')).map(node => (
                        <div key={node.id} className="relative">
                          <div 
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md w-48 ${
                              getNodeColor(node.type)
                            } ${selectedNode === node.id ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => setSelectedNode(node.id)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {getNodeIcon(node.type)}
                              <span className="font-medium text-sm">{node.name}</span>
                            </div>
                            {viewMode === 'full' && (
                              <div className="text-xs text-muted-foreground">
                                {node.condition}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <ArrowDown className="h-5 w-5 text-muted-foreground mx-auto mt-2" />
                  </div>

                  {/* Offer Evaluation Stage */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-muted-foreground mb-2">OFFER EVALUATION</div>
                    <div className="flex gap-4 flex-wrap justify-center">
                      {filteredNodes.filter(node => 
                        node.type.includes('Offer') || node.type.includes('Final') || node.type === 'Output'
                      ).map(node => (
                        <div key={node.id} className="relative">
                          <div 
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md w-48 ${
                              getNodeColor(node.type)
                            } ${selectedNode === node.id ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => setSelectedNode(node.id)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {getNodeIcon(node.type)}
                              <span className="font-medium text-sm">{node.name}</span>
                            </div>
                            {viewMode === 'full' && node.condition !== 'None' && (
                              <div className="text-xs text-muted-foreground">
                                {node.condition}
                              </div>
                            )}
                            {node.externalSystems !== 'None' && (
                              <Badge variant="outline" className="text-xs mt-1">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {node.externalSystems}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Node Details Sidebar */}
        <div className="space-y-4">
          {selectedNode ? (
            (() => {
              const node = flowNodes.find(n => n.id === selectedNode)
              if (!node) return null
              
              return (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{node.name}</CardTitle>
                    <Badge variant="outline">{node.type}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {node.condition !== 'None' && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">CONDITION</h4>
                        <p className="text-sm">{node.condition}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">DATA SOURCES</h4>
                      <div className="space-y-1">
                        {node.dataSources.map((source, index) => (
                          <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {node.externalSystems !== 'None' && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">EXTERNAL SYSTEMS</h4>
                        <Badge variant="outline" className="text-xs">
                          {node.externalSystems}
                        </Badge>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full">
                        Test This Node
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        View Dependencies
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })()
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Click on a node to view details
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-50 border border-red-200"></div>
                  <span className="text-xs">Eligibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-50 border border-blue-200"></div>
                  <span className="text-xs">Applicability</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-50 border border-green-200"></div>
                  <span className="text-xs">Suitability</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-50 border border-purple-200"></div>
                  <span className="text-xs">Offer Evaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-50 border border-slate-200"></div>
                  <span className="text-xs">Input/Output</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}