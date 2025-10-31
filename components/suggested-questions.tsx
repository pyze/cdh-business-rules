"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void
}

export function SuggestedQuestions({ onSelectQuestion }: SuggestedQuestionsProps) {
  const [activeTab, setActiveTab] = useState("eligibility")

  const questionCategories = {
    eligibility: {
      label: "Eligibility & Targeting",
      questions: [
        "What attributes determine if a platinum card is offered to a customer?",
        "Which customer segments are eligible for our premium offers?",
        "How do we identify high-value customers in our strategy?",
        "What is the minimum credit score required for offer eligibility?",
      ],
    },
    performance: {
      label: "Performance & Optimization",
      questions: [
        "Which decision nodes create the most customer drop-offs?",
        "How would lowering the credit score threshold impact offer volume?",
        "What would happen if we expanded eligibility beyond North America?",
        "Which attributes have the biggest impact on final offer selection?",
      ],
    },
    governance: {
      label: "Governance & Compliance",
      questions: [
        "How do we ensure consistent decision-making across all customer segments?",
        "Which nodes depend on external systems that might create compliance risks?",
        "How are customer data privacy concerns addressed in the strategy?",
        "What audit trail exists for decisions made through this strategy?",
      ],
    },
    technical: {
      label: "Technical & Implementation",
      questions: [
        "Which nodes have the longest execution times in the strategy?",
        "How is caching implemented to improve performance?",
        "What error handling exists for system failures?",
        "How can we simulate changes to the strategy before implementation?",
      ],
    },
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 px-4">
      <h3 className="text-lg font-medium mb-3">Suggested Questions:</h3>
      <Tabs defaultValue="eligibility" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          {Object.entries(questionCategories).map(([key, category]) => (
            <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(questionCategories).map(([key, category]) => (
          <TabsContent key={key} value={key} className="mt-0">
            <div className="grid gap-2">
              {category.questions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-2 px-4 text-sm"
                  onClick={() => onSelectQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
