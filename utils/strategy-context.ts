import strategyData from "./strategy-context.json"

// Use the data from the JSON file
export const strategyContext = {
  strategy_name: strategyData.strategy_overview.strategy_name,
  strategy_purpose: strategyData.strategy_overview.strategy_purpose,
  primary_data_sources: strategyData.strategy_overview.primary_data_sources,
  external_integrations: strategyData.strategy_overview.key_external_integrations,
  execution_methods: [
    "pzExecuteLegacyComponent",
    "pzCreatePredictionMarkers",
    "pega_decisionengine_publishing.publishStrategyResults",
  ],
  simulation_attributes: ["Segment", "Region", "CreditScore", "Propensity"],
  nodes: strategyData.node_details,
}

// Helper function to get relevant nodes for a specific query
export function getRelevantNodes(query: string): any[] {
  // Simple implementation - in a real app, you might use NLP or keyword matching
  // to find the most relevant nodes based on the query
  const lowercaseQuery = query.toLowerCase()

  return strategyContext.nodes.filter((node) => {
    return (
      node.node_name.toLowerCase().includes(lowercaseQuery) ||
      node.node_type.toLowerCase().includes(lowercaseQuery) ||
      (node.condition_rule !== "None" && node.condition_rule.toLowerCase().includes(lowercaseQuery))
    )
  })
}

// Format the context for injection into the system prompt
export function formatContextForPrompt(query: string): string {
  const relevantNodes = getRelevantNodes(query)

  let contextPrompt = `
### NBA Strategy Context ###
Strategy Name: ${strategyContext.strategy_name}
Purpose: ${strategyContext.strategy_purpose}

`

  if (relevantNodes.length > 0) {
    contextPrompt += `
### Relevant Strategy Nodes ###
${relevantNodes
  .map(
    (node) => `
Node: ${node.node_name} (${node.node_type})
Condition: ${node.condition_rule}
Data Sources: ${node.data_sources.join(", ")}
Runtime Method: ${node.runtime_method}
`,
  )
  .join("\n")}
`
  }
  
  // Always include all nodes with their conditions for comprehensive analysis
  contextPrompt += `
### All Strategy Nodes with Conditions ###
${strategyContext.nodes
  .map(
    (node) => `
Node: ${node.node_name}
Type: ${node.node_type}
Condition: ${node.condition_rule}
Data Sources: ${node.data_sources.join(", ")}
External Systems: ${node.external_systems}
Performance Optimization: ${node.performance_optimization}
`,
  )
  .join("\n")}

### Strategy Overview ###
Primary Data Sources: ${strategyContext.primary_data_sources.join(", ")}
External Integrations: ${strategyContext.external_integrations.join(", ")}
Execution Methods: ${strategyContext.execution_methods.join(", ")}
Simulation Attributes: ${strategyContext.simulation_attributes.join(", ")}
`

  return contextPrompt
}