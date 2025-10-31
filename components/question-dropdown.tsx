"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface QuestionDropdownProps {
  onSelectQuestion: (question: string) => void
}

export function QuestionDropdown({ onSelectQuestion }: QuestionDropdownProps) {
  const questionCategories = {
    transparency: {
      label: "🔍 Transparency & Governance",
      questions: [
        "Which business rules rely on external data systems like Interaction History or Prediction Engines, and what are the implications for rule accuracy and data latency?",
        "Which nodes have overlapping or redundant eligibility and applicability checks (e.g., Region, CreditScore), and how can we consolidate them to reduce rule sprawl?",
        "Are business rules consistently implemented across nodes and strategies (e.g., Propensity thresholds), or are there discrepancies that may affect decision outcomes?",
        "What are the most common decision paths for high-value customer segments, and how transparent are the conditions at each stage?",
      ],
    },
    performance: {
      label: "⚙️ Performance & Resiliency",
      questions: [
        "Which rules or nodes have the longest execution times or highest resource utilization, and where can we optimize logic or caching strategies?",
        "How frequently do nodes raise runtime exceptions (e.g., ComponentExecutionException), and what is the downstream impact on decisioning accuracy or rule failover?",
        "Are performance optimizations (like SSA caching) being utilized consistently across all nodes, or are there inefficiencies that need remediation?",
      ],
    },
    optimization: {
      label: "📊 Offer Optimization & Strategy Refinement",
      questions: [
        "Which conditions or thresholds (e.g., Propensity > 0.7) most often determine offer type selection, and how sensitive is the logic to customer attribute changes?",
        "How do offer acceptance rates vary by condition type or logic path (e.g., applicability checks vs. suitability checks), and what adjustments can improve yield?",
        "Which decision nodes disproportionately filter out high-value customers, and could the criteria be adjusted to increase eligible volume without raising risk?",
        "How can we simulate adjustments to input attributes (like Segment or CreditScore) using available runtime methods to test offer logic outcomes in real time?",
      ],
    },
    analytics: {
      label: "📈 Analytics & Reporting Enablement",
      questions: [
        "What reporting metrics can be developed per node (e.g., execution count, average runtime, error rate), and how can these inform ongoing governance reviews?",
        "Are certain strategies or nodes overly reliant on hardcoded thresholds versus dynamically driven business data (e.g., real-time Propensity), and can this be rebalanced?",
      ],
    },
  }

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Select a business question</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[400px]" align="center">
          {Object.entries(questionCategories).map(([key, category], index) => (
            <div key={key}>
              {index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel>{category.label}</DropdownMenuLabel>
              <DropdownMenuGroup>
                {category.questions.map((question, qIndex) => (
                  <DropdownMenuItem key={qIndex} className="cursor-pointer" onClick={() => onSelectQuestion(question)}>
                    {question}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
