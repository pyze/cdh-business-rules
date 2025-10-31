import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  trendSentiment?: "positive" | "negative" | "neutral"
}

export function MetricCard({ title, value, description, trend, trendValue, trendSentiment }: MetricCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border-0 bg-gradient-to-br from-white via-white to-gray-50/30">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/8 to-secondary/8 border-b border-primary/10">
        <CardTitle className="text-sm font-semibold text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-3xl font-bold text-foreground mb-2">{value}</div>
        {description && <p className="text-xs text-muted-foreground/80 leading-relaxed mb-3">{description}</p>}
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full w-fit ${
              trendSentiment === "positive" ? "text-green-600 bg-green-50 border border-green-200" : 
              trendSentiment === "negative" ? "text-red-600 bg-red-50 border border-red-200" : 
              "text-gray-600 bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="text-sm">{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
