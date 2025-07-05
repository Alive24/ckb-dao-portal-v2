"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Send } from "lucide-react"

export default function DAORules() {
  const [chatMessage, setChatMessage] = useState("")

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setChatMessage("")
  }

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          This document outlines the governance structure of our Decentralized Autonomous Organization (DAO). It is
          divided into two key sections that work together to create a robust and adaptable governance framework.
        </p>
        <p className="text-gray-700 leading-relaxed">
          <strong>Constitutional Rules</strong> form the foundation of our governance system. They establish fundamental
          principles, rights, and power limitations that protect the core values of our ecosystem. These rules require a
          higher threshold of consensus (85% approval) to modify and serve as guardrails that ensure long-term stability
          and alignment with our founding vision.
        </p>
        <p className="text-gray-700 leading-relaxed">
          <strong>DAO Rules</strong> are operational guidelines governing day-to-day activities and can be updated
          through standard governance procedures. They implement the principles established in the Constitutional Rules
          and provide detailed frameworks for proposals, voting mechanisms, and community participation within our
          ecosystem.
        </p>
      </div>

      {/* AI Chat */}
      <Card className="bg-[#00D4AA]/5 border border-[#00D4AA]/20">
        <CardHeader>
          <CardTitle className="flex items-center text-[#00D4AA]">
            <Search className="mr-2 h-5 w-5" />
            Ask AI about DAO Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChatSubmit} className="flex space-x-2">
            <Input
              placeholder="Ask a question about DAO rules..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-[#00D4AA] hover:bg-[#00B894]">
              <Send className="h-4 w-4" />
              Ask
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Rules Tabs */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle>DAO Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-500 text-sm">
                This is AI-generated text for demonstration purposes and not final content.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle>Constitutional Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-red-500 text-sm">
                This is AI-generated text for demonstration purposes and not final content.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Section */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle>1. Proposal Types and Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Grant Proposals</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • All grant proposals require a 51% approval rate to pass successfully through the governance process.
              </li>
              <li>
                • Each proposal must include comprehensive budget breakdowns with fully itemized expenses for complete
                transparency.
              </li>
              <li>
                • The denomination (USD or CKB) must be fixed at the time of submission and cannot be changed afterward
                to ensure financial stability.
              </li>
              <li>
                • Proposals must define mandatory milestone deliverables with specific, measurable outcomes that can be
                verified objectively.
              </li>
              <li>
                • A standard 10-day voting period is required to allow sufficient time for community evaluation and
                participation.
              </li>
              <li>
                • All grant proposals must clearly outline tangible benefits to the ecosystem to justify the requested
                funding.
              </li>
              <li>
                • Any proposal exceeding 50,000 CKB requires a thorough technical review by at least 2 independent
                representatives.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Rule Changes</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • Rule change proposals require an 80% approval rate to pass due to their potential broad impact on
                governance.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
