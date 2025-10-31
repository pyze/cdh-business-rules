"use client"
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"

interface ChartData {
  [key: string]: any
}

interface ChartSpec {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area'
  title: string
  data: ChartData[]
  xAxis?: string
  yAxis?: string
  description?: string
  colors?: string[]
}

interface ChartRendererProps {
  chartSpec: ChartSpec
}

// Default colors for charts
const DEFAULT_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

// Fallback colors if CSS variables not available
const FALLBACK_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red  
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
]

export function ChartRenderer({ chartSpec }: ChartRendererProps) {
  const { type, title, data, xAxis, yAxis, description, colors } = chartSpec

  // Generate chart config from data
  const generateChartConfig = (): ChartConfig => {
    const config: ChartConfig = {}
    
    if (data && data.length > 0) {
      const sampleData = data[0]
      const keys = Object.keys(sampleData).filter(key => key !== 'name')
      
      keys.forEach((key, index) => {
        config[key] = {
          label: key.charAt(0).toUpperCase() + key.slice(1),
          color: colors?.[index] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
        }
      })
    }
    
    return config
  }

  const chartConfig = generateChartConfig()

  // Render different chart types
  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available for chart
        </div>
      )
    }

    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={data.length > 8 ? -45 : 0}
              textAnchor={data.length > 8 ? "end" : "middle"}
              height={data.length > 8 ? 80 : 60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {Object.keys(chartConfig).map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                fill={chartConfig[key].color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        )

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={data.length > 8 ? -45 : 0}
              textAnchor={data.length > 8 ? "end" : "middle"}
              height={data.length > 8 ? 80 : 60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {Object.keys(chartConfig).map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={chartConfig[key].color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        )

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={data.length > 8 ? -45 : 0}
              textAnchor={data.length > 8 ? "end" : "middle"}
              height={data.length > 8 ? 80 : 60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {Object.keys(chartConfig).map((key, index) => (
              <Area 
                key={key}
                type="monotone" 
                dataKey={key} 
                stackId="1"
                stroke={chartConfig[key].color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                fill={chartConfig[key].color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        )

      case 'pie':
        const pieData = data.map((item, index) => ({
          ...item,
          fill: colors?.[index] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
        }))
        
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        )

      case 'scatter':
        return (
          <ScatterChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              type="number"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              type="number" 
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            {Object.keys(chartConfig).map((key, index) => (
              <Scatter 
                key={key}
                dataKey={key} 
                fill={chartConfig[key].color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
              />
            ))}
          </ScatterChart>
        )

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Unsupported chart type: {type}
          </div>
        )
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Chart Title */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>

      {/* Chart Container */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <ChartContainer
          config={chartConfig}
          className="h-[400px] w-full"
        >
          {renderChart()}
        </ChartContainer>
      </div>

      {/* Axis Labels */}
      {(xAxis || yAxis) && (
        <div className="flex justify-between text-xs text-gray-500 px-6">
          {xAxis && <span>X-Axis: {xAxis}</span>}
          {yAxis && <span>Y-Axis: {yAxis}</span>}
        </div>
      )}
    </div>
  )
}