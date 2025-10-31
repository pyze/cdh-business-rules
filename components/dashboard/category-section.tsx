import { MetricCard } from "./metric-card"

interface CategorySectionProps {
  title: string
  metrics: {
    title: string
    value: string | number
    description?: string
    trend?: "up" | "down" | "neutral"
    trendValue?: string
    trendSentiment?: "positive" | "negative" | "neutral"
  }[]
}

export function CategorySection({ title, metrics }: CategorySectionProps) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-6 text-primary">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            trend={metric.trend}
            trendValue={metric.trendValue}
            trendSentiment={metric.trendSentiment}
          />
        ))}
      </div>
    </div>
  )
}
