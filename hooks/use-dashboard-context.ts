import { useState, useEffect } from 'react'
import { createDashboardContext, type DashboardContext } from '@/utils/ui-context'

// Hook to track dashboard state for contextual chat
export function useDashboardContext() {
  const [context, setContext] = useState<DashboardContext>(
    createDashboardContext(
      ['acceptance_rate', 'execution_count', 'offer_distribution', 'performance_trends', 'governance_metrics', 'node_performance'],
      ['node_execution_chart', 'offer_distribution_chart', 'trend_analysis'],
      {
        // Summary Metrics
        total_customers: '11.2M',
        total_rules: '8.4K',
        monthly_offers: '660K',
        active_strategies: '42',
        
        // Governance Metrics
        overlapping_rules: 1842,
        overlapping_rules_percent: '21.9%',
        external_system_rules: 2436,
        external_system_percent: '29%',
        raci_coverage: '78%',
        
        // Performance Metrics
        avg_execution_time: '245ms',
        runtime_exceptions: 3724,
        cache_effectiveness: '67%',
        total_executions: '8.2B',
        
        // Optimization Metrics
        top_path_conversion: '23%',
        offer_acceptance_rate: '31%',
        total_acceptances: '204.6K',
        
        // Segment Performance
        premium_segment_performance: '38%',
        standard_segment_performance: '25.5%',
        high_value_segment_performance: '89%',
        
        // Node-level Performance
        nba_allissues_exec_time: '320ms',
        nba_allissues_exceptions: 842,
        nba_allissues_cache_hit: '62%',
        offer_collector_exec_time: '350ms',
        offer_collector_exceptions: 1205,
        offer_collector_cache_hit: '58%',
        suitability_check_exec_time: '280ms',
        suitability_check_exceptions: 624,
        suitability_check_cache_hit: '71%',
        nba_allgroups_exec_time: '210ms',
        nba_allgroups_exceptions: 412,
        nba_allgroups_cache_hit: '75%',
        best_result_exec_time: '230ms',
        best_result_exceptions: 641,
        best_result_cache_hit: '64%',
        
        // Rule Performance Insights
        high_exception_rules: ['Offer Collector (1205)', 'NBA_AllIssues_E_Account (842)', 'Best Result (641)'],
        low_performance_rules: ['Offer Collector (350ms)', 'NBA_AllIssues_E_Account (320ms)'],
        poor_cache_rules: ['Offer Collector (58%)', 'NBA_AllIssues_E_Account (62%)'],
        
        // Regional Performance
        central_acceptance_rate: '38%',
        west_coast_acceptance_rate: '32%',
        atlantic_acceptance_rate: '27%',
        prairie_acceptance_rate: '24%',
        north_acceptance_rate: '22%'
      },
      'last_30_days'
    )
  )

  // Function to update specific metrics
  const updateMetrics = (newMetrics: Record<string, number | string>) => {
    setContext(prev => ({
      ...prev,
      metricValues: {
        ...prev.metricValues,
        ...newMetrics
      }
    }))
  }

  // Function to update active charts
  const updateActiveCharts = (charts: string[]) => {
    setContext(prev => ({
      ...prev,
      activeCharts: charts
    }))
  }

  // Function to update time range
  const updateTimeRange = (timeRange: string) => {
    setContext(prev => ({
      ...prev,
      currentTimeRange: timeRange
    }))
  }

  // Function to update visible metrics
  const updateVisibleMetrics = (metrics: string[]) => {
    setContext(prev => ({
      ...prev,
      visibleMetrics: metrics
    }))
  }

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate changing metrics
      const randomFactor = Math.random()
      const newMetrics = {
        // Update key performance metrics
        offer_acceptance_rate: `${Math.floor(28 + randomFactor * 8)}%`,
        avg_execution_time: `${Math.floor(230 + randomFactor * 30)}ms`,
        runtime_exceptions: Math.floor(3500 + randomFactor * 500),
        cache_effectiveness: `${Math.floor(65 + randomFactor * 10)}%`,
        
        // Update segment performance
        premium_segment_performance: `${Math.floor(35 + randomFactor * 8)}%`,
        standard_segment_performance: `${Math.floor(23 + randomFactor * 6)}%`,
        
        // Update node execution times
        nba_allissues_exec_time: `${Math.floor(300 + randomFactor * 40)}ms`,
        offer_collector_exec_time: `${Math.floor(330 + randomFactor * 40)}ms`,
        
        // Update offers count
        monthly_offers: `${Math.floor(640 + randomFactor * 40)}K`
      }
      
      updateMetrics(newMetrics)
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return {
    context,
    updateMetrics,
    updateActiveCharts,
    updateTimeRange,
    updateVisibleMetrics
  }
}