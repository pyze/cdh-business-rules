"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Generate mock data for demonstration
const generateAcceptanceRateData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((month, index) => ({
    month,
    Premium: Math.round(35 + index * 0.5 + (Math.random() * 3 - 1.5)),
    Standard: Math.round(25 + index * 0.4 + (Math.random() * 3 - 1.5)),
    Basic: Math.round(18 + index * 0.3 + (Math.random() * 3 - 1.5)),
  }))
}

const generateOfferDistributionData = () => [
  { name: "Platinum Card", value: 124500, percentage: 18.9, color: "#c41f3e" },
  { name: "Gold Card", value: 198000, percentage: 30.1, color: "#ff9800" },
  { name: "Travel Rewards", value: 165000, percentage: 25.0, color: "#2196f3" },
  { name: "Cash Back", value: 112500, percentage: 17.0, color: "#4caf50" },
  { name: "Low Interest", value: 60000, percentage: 9.1, color: "#9c27b0" },
]

const generateChannelData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((month, index) => ({
    month,
    Mobile: Math.round(40 + index * 0.6 + (Math.random() * 4 - 2)),
    Web: Math.round(30 + index * 0.4 + (Math.random() * 4 - 2)),
    Email: Math.round(25 + index * 0.2 + (Math.random() * 4 - 2)),
    Branch: Math.round(20 + index * 0.1 + (Math.random() * 4 - 2)),
  }))
}

// Simple table-based visualization component
function SimpleLineChart({ data, title }: { data: any[], title: string }) {
  if (!data || data.length === 0) return <div>No data available</div>

  const keys = Object.keys(data[0]).filter(key => key !== 'month')
  const colors = ['#c41f3e', '#ff9800', '#2196f3', '#4caf50']

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {keys.map((key, index) => (
          <div key={key} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm">{key}</span>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Month</th>
              {keys.map((key) => (
                <th key={key} className="text-right py-2">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 font-medium">{item.month}</td>
                {keys.map((key) => (
                  <td key={key} className="text-right py-2">
                    {typeof item[key] === 'number' ? `${item[key]}%` : item[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Simple bar chart visualization
function SimpleBarChart({ data, title }: { data: any[], title: string }) {
  if (!data || data.length === 0) return <div>No data available</div>

  const maxValue = Math.max(...data.map(item => item.value))

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span className="font-medium">{item.value.toLocaleString()} ({item.percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SimpleTrendAnalysis() {
  const [acceptanceData] = useState(generateAcceptanceRateData())
  const [distributionData] = useState(generateOfferDistributionData())
  const [channelData] = useState(generateChannelData())

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Acceptance Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Acceptance Rate by Segment</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLineChart data={acceptanceData} title="" />
        </CardContent>
      </Card>

      {/* Offer Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Offer Distribution by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleBarChart data={distributionData} title="" />
        </CardContent>
      </Card>

      {/* Channel Effectiveness Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Channel Effectiveness Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLineChart data={channelData} title="" />
        </CardContent>
      </Card>
    </div>
  )
}