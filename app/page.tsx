import { ClientDashboardWrapper } from "@/components/dashboard/client-dashboard-wrapper"
import { DashboardSwitcher } from "@/components/dashboard-switcher"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSwitcher />
      <div className="container mx-auto py-6">
        <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Pyze Business Rules Intelligence Demo
          </h1>
          <p className="text-muted-foreground">
            Your trusted partner for navigating decision intelligence and rule transparency
          </p>
        </div>

        <div className="shadow-lg rounded-lg overflow-hidden">
          <ClientDashboardWrapper />
        </div>
      </div>
    </div>
  )
}
