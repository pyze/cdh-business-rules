"use client"

import { useState } from "react"
import { CategorySection } from "./category-section"
import { TrendAnalysis } from "./trend-analysis"
import { FallbackChart } from "./fallback-chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

// Generate month names for the last 12 months
const getLastTwelveMonths = () => {
  const months = []
  const currentDate = new Date()

  for (let i = 11; i >= 0; i--) {
    const date = new Date()
    date.setMonth(currentDate.getMonth() - i)
    months.push(date.toLocaleString("default", { month: "short", year: "2-digit" }))
  }

  return months
}

// Mock data for the dashboard based on the provided metrics
// - 11.2M overall customers
// - 8.4K business rules
// - 660K new offers monthly
const mockData = {
  summary: {
    totalCustomers: "11.2M",
    totalRules: "8.4K",
    monthlyOffers: "660K",
    activeStrategies: "42",
  },
  governance: [
    {
      title: "Rules with Overlapping Conditions",
      value: "1,842",
      description: "21.9% of total business rules have overlapping conditions",
      trend: "down" as const,
      trendValue: "3.2% decrease from last quarter",
      trendSentiment: "positive" as const, // Decrease in overlapping rules is good
    },
    {
      title: "Rules Linked to External Systems",
      value: "2,436",
      description: "29% of rules depend on Prediction Engine or other external systems",
      trend: "up" as const,
      trendValue: "5.7% increase from last quarter",
      trendSentiment: "negative" as const, // More external dependencies can be concerning
    },
    {
      title: "Node-level RACI Coverage",
      value: "78%",
      description: "Percentage of nodes with complete RACI assignments",
      trend: "up" as const,
      trendValue: "12% improvement year-over-year",
      trendSentiment: "positive" as const, // Better RACI coverage is good
    },
  ],
  performance: [
    {
      title: "Avg. Execution Time",
      value: "245ms",
      description: "Average execution time across all nodes",
      trend: "down" as const,
      trendValue: "12% faster than previous month",
      trendSentiment: "positive" as const, // Faster execution is good
    },
    {
      title: "Runtime Exceptions",
      value: "3,724",
      description: "Number of ComponentExecutionExceptions in the last 30 days",
      trend: "up" as const,
      trendValue: "15% increase from baseline",
      trendSentiment: "negative" as const, // More exceptions is bad
    },
    {
      title: "Cache Effectiveness",
      value: "67%",
      description: "Ratio of cache hits to total runs (8.2B executions)",
      trend: "up" as const,
      trendValue: "3% improvement month-over-month",
      trendSentiment: "positive" as const, // Better cache effectiveness is good
    },
  ],
  optimization: [
    {
      title: "Top Path Conversion",
      value: "23%",
      description: "Conversion rate for the most common decision path (152K offers)",
      trend: "up" as const,
      trendValue: "2.3% increase from previous month",
      trendSentiment: "positive" as const, // Higher conversion is good
    },
    {
      title: "Offer Acceptance Rate",
      value: "31%",
      description: "Overall acceptance rate across all segments (204.6K acceptances)",
      trend: "neutral" as const,
      trendValue: "No significant change",
      trendSentiment: "neutral" as const, // No change is neutral
    },
    {
      title: "Propensity Threshold Variance",
      value: "0.15",
      description: "Standard deviation in propensity thresholds across nodes",
      trend: "down" as const,
      trendValue: "More consistent decisioning",
      trendSentiment: "positive" as const, // Less variance/more consistency is good
    },
  ],
  compliance: [
    {
      title: "Rules Missing Documentation",
      value: "1,428",
      description: "17% of rules lack proper documentation or data lineage",
      trend: "down" as const,
      trendValue: "6% improvement since documentation initiative",
      trendSentiment: "positive" as const, // Fewer missing docs is good
    },
    {
      title: "Static vs Dynamic Rule Ratio",
      value: "3:1",
      description: "6,300 static rules vs 2,100 dynamic rules",
      trend: "neutral" as const,
      trendValue: "No change from baseline",
      trendSentiment: "neutral" as const, // Ratio stability is neutral
    },
    {
      title: "Simulation Coverage",
      value: "62%",
      description: "Percentage of attribute permutations tested in simulations",
      trend: "up" as const,
      trendValue: "8% increase from previous quarter",
      trendSentiment: "positive" as const, // Better simulation coverage is good
    },
  ],
}

export function Dashboard({ isLoaded = true }: { isLoaded?: boolean }) {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined)

  const categories = [
    { id: "governance", label: "Governance" },
    { id: "performance", label: "Performance & Resiliency" },
    { id: "optimization", label: "Offer Optimization" },
    { id: "compliance", label: "Compliance & Transparency" },
  ]

  const filteredCategories = activeCategory ? categories.filter((cat) => cat.id === activeCategory) : categories

  return (
    <div className="p-6 bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-primary">Business Rules Simplification Dashboard</h1>
        
        {/* Tabs Layout - Reorganized for better hierarchy */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Filter by category:</span>
          <Tabs defaultValue="" onValueChange={setActiveCategory} value={activeCategory || ""}>
            <TabsList className="bg-gradient-to-r from-muted/50 to-muted/30 border shadow-sm flex-wrap h-auto">
              <TabsTrigger 
                value="" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/30 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-primary/20 min-w-fit"
              >
                All Categories
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id} 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/30 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-primary/20 min-w-fit text-xs sm:text-sm"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardContent className="pt-6">
            <div className="text-sm font-semibold text-primary mb-2">Total Customers</div>
            <div className="text-3xl font-bold text-foreground">{mockData.summary.totalCustomers}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/30">
          <CardContent className="pt-6">
            <div className="text-sm font-semibold text-primary mb-2">Business Rules</div>
            <div className="text-3xl font-bold text-foreground">{mockData.summary.totalRules}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/30">
          <CardContent className="pt-6">
            <div className="text-sm font-semibold text-primary mb-2">Monthly Offers</div>
            <div className="text-3xl font-bold text-foreground">{mockData.summary.monthlyOffers}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/30">
          <CardContent className="pt-6">
            <div className="text-sm font-semibold text-primary mb-2">Active Strategies</div>
            <div className="text-3xl font-bold text-foreground">{mockData.summary.activeStrategies}</div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis Section - Moved to top */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-primary">Trend Analysis</h2>
        {isLoaded ? (
          <TrendAnalysis category={activeCategory} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <FallbackChart title="Acceptance Rate by Segment" />
            <FallbackChart title="Offer Distribution by Type" />
            <div className="lg:col-span-2">
              <FallbackChart title="Channel Effectiveness" />
            </div>
          </div>
        )}
      </div>

      {/* Metrics by Category */}
      {filteredCategories.map((category) => {
        const metrics = mockData[category.id as keyof typeof mockData]
        // Only render CategorySection if metrics is an array (not the summary object)
        if (Array.isArray(metrics)) {
          return <CategorySection key={category.id} title={category.label} metrics={metrics} />
        }
        return null
      })}
    </div>
  )
}
