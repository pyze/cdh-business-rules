"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface SuggestedQuestionsBarProps {
  onSelectQuestion: (question: string) => void
}

export function SuggestedQuestionsBar({ onSelectQuestion }: SuggestedQuestionsBarProps) {
  const [currentCategory, setCurrentCategory] = useState(0)

  const categories = [
    {
      title: "Transparency & Governance",
      questions: [
        "Which business rules rely on external data systems?",
        "Which nodes have overlapping eligibility checks?",
        "Are business rules consistently implemented?",
      ],
    },
    {
      title: "Performance & Resiliency",
      questions: [
        "Which nodes have the longest execution times?",
        "How frequently do nodes raise exceptions?",
        "Are caching optimizations used consistently?",
      ],
    },
    {
      title: "Offer Optimization",
      questions: [
        "Which conditions determine offer selection?",
        "How do acceptance rates vary by condition?",
        "Which nodes filter out high-value customers?",
      ],
    },
    {
      title: "Analytics & Reporting",
      questions: ["What metrics can be developed per node?", "Are nodes reliant on hardcoded thresholds?"],
    },
    {
      title: "Data Schema & Simulation",
      questions: [
        "Which Customer Metadata attributes are most used?",
        "Are attributes used with conflicting thresholds?",
        "How would changes in different Canadian regions affect offers?",
      ],
    },
  ]

  const nextCategory = () => {
    setCurrentCategory((prev) => (prev + 1) % categories.length)
  }

  const prevCategory = () => {
    setCurrentCategory((prev) => (prev - 1 + categories.length) % categories.length)
  }

  const currentQuestions = categories[currentCategory].questions

  return (
    <div className="w-full border-b bg-gray-50 py-2 px-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-700">{categories[currentCategory].title}</h3>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevCategory}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-gray-500">
            {currentCategory + 1}/{categories.length}
          </span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextCategory}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {currentQuestions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="whitespace-nowrap text-xs"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
