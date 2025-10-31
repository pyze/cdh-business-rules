import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for detailed metrics
const nodePerformanceData = [
  { node: "Eligibility_Check_Primary", execTime: 320, exceptions: 842, cacheHitRate: "62%" },
  { node: "Offer Collector", execTime: 350, exceptions: 1205, cacheHitRate: "58%" },
  { node: "Suitability Check", execTime: 280, exceptions: 624, cacheHitRate: "71%" },
  { node: "Applicability_Check_Primary", execTime: 210, exceptions: 412, cacheHitRate: "75%" },
  { node: "Best Result", execTime: 230, exceptions: 641, cacheHitRate: "64%" },
]

// Offer acceptance data by region
const offerAcceptanceData = [
  { segment: "Premium", region: "Region Central", offers: 245000, acceptanceRate: "38%" },
  { segment: "Premium", region: "Region West", offers: 124000, acceptanceRate: "32%" },
  { segment: "Standard", region: "Region East", offers: 186000, acceptanceRate: "27%" },
  { segment: "Standard", region: "Region Midwest", offers: 105000, acceptanceRate: "24%" },
  { segment: "Premium", region: "Region North", offers: 65000, acceptanceRate: "22%" },
]

interface DetailedMetricsProps {
  category: "performance" | "optimization"
}

export function DetailedMetrics({ category }: DetailedMetricsProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>
          {category === "performance" ? "Node Performance Details" : "Offer Acceptance by Segment & Region"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {category === "performance" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Node</TableHead>
                <TableHead className="text-right">Execution Time (ms)</TableHead>
                <TableHead className="text-right">Exceptions</TableHead>
                <TableHead className="text-right">Cache Hit Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodePerformanceData.map((row) => (
                <TableRow key={row.node}>
                  <TableCell className="font-medium">{row.node}</TableCell>
                  <TableCell className="text-right">{row.execTime}</TableCell>
                  <TableCell className="text-right">{row.exceptions}</TableCell>
                  <TableCell className="text-right">{row.cacheHitRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Offers</TableHead>
                <TableHead className="text-right">Acceptance Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offerAcceptanceData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.segment}</TableCell>
                  <TableCell>{row.region}</TableCell>
                  <TableCell className="text-right">{row.offers.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.acceptanceRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
