"use client"
import { Button } from "@/components/ui/button"

interface QuestionListProps {
  onSelectQuestion: (question: string) => void
}

export function QuestionList({ onSelectQuestion }: QuestionListProps) {
  const categories = [
    {
      title: "🔍 Transparency & Governance",
      questions: [
        "Which business rules rely on external data systems like Interaction History or Prediction Engines, and what are the implications for rule accuracy and data latency?",
        "Which nodes have overlapping or redundant eligibility and applicability checks (e.g., Region, CreditScore), and how can we consolidate them to reduce rule sprawl?",
        "Are business rules consistently implemented across nodes and strategies (e.g., Propensity thresholds), or are there discrepancies that may affect decision outcomes?",
        "What are the most common decision paths for high-value customer segments, and how transparent are the conditions at each stage?",
      ],
    },
    {
      title: "⚙️ Performance & Resiliency",
      questions: [
        "Which rules or nodes have the longest execution times or highest resource utilization, and where can we optimize logic or caching strategies?",
        "How frequently do nodes raise runtime exceptions (e.g., ComponentExecutionException), and what is the downstream impact on decisioning accuracy or rule failover?",
        "Are performance optimizations (like SSA caching) being utilized consistently across all nodes, or are there inefficiencies that need remediation?",
      ],
    },
    {
      title: "📊 Offer Optimization & Strategy Refinement",
      questions: [
        "Which conditions or thresholds (e.g., Propensity > 0.7) most often determine offer type selection, and how sensitive is the logic to customer attribute changes?",
        "How do offer acceptance rates vary by condition type or logic path (e.g., applicability checks vs. suitability checks), and what adjustments can improve yield?",
        "Which decision nodes disproportionately filter out high-value customers, and could the criteria be adjusted to increase eligible volume without raising risk?",
        "How can we simulate adjustments to input attributes (like Segment or CreditScore) using available runtime methods to test offer logic outcomes in real time?",
      ],
    },
    {
      title: "📈 Analytics & Reporting Enablement",
      questions: [
        "What reporting metrics can be developed per node (e.g., execution count, average runtime, error rate), and how can these inform ongoing governance reviews?",
        "Are certain strategies or nodes overly reliant on hardcoded thresholds versus dynamically driven business data (e.g., real-time Propensity), and can this be rebalanced?",
      ],
    },
    {
      title: "🔄 Data Schema & Simulation Intelligence",
      questions: [
        "Which attributes from Customer Metadata are most frequently used in business rule conditions?",
        "Are any attributes used in multiple nodes with conflicting thresholds (e.g., CreditScore in eligibility vs suitability)?",
        "How can we simulate how a change in Segment or Region (Atlantic, Central, Prairie Provinces, West Coast, North) would affect the final offer selected?",
        "What fields from Interaction History influence offer prioritization or acceptance rate calculations?",
        "Which rules depend on static thresholds rather than model-driven inputs like pyModelPropensity?",
        "How can we trace data lineage from a final outcome back through the pyNodeID to the originating rule and input values?",
        "What percentage of current strategies use dynamic prediction scores (from Decision Results) vs hard-coded logic?",
        "Are all required fields in the decision schema (Segment, CreditScore, pyOutcome) reliably populated across runs?",
      ],
    },
  ]

  return (
    <div className="w-full">
      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-6">
          <h3 className="text-md font-medium mb-2">{category.title}</h3>
          <div className="grid gap-2">
            {category.questions.map((question, questionIndex) => (
              <Button
                key={questionIndex}
                variant="ghost"
                className="justify-start text-left h-auto py-2 px-3 text-sm hover:bg-gray-100 whitespace-normal break-words"
                onClick={() => onSelectQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
