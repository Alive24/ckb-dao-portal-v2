"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function SubmitProposal() {
  const [proposalType, setProposalType] = useState("Grant Proposal")
  const [currency, setCurrency] = useState("Nervos CKB")

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Proposals</span>
        <span>›</span>
        <span>Submit</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Submit Proposal</h1>
        <p className="text-gray-600">
          Create a new proposal for the DAO community to consider. Please review our{" "}
          <Link href="/dao-rules" className="text-[#00D4AA] hover:underline">
            DAO Rules
          </Link>{" "}
          first.
        </p>
      </div>

      {/* Form */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-8 space-y-6">
          {/* Proposal Type */}
          <div className="space-y-2">
            <Label htmlFor="proposal-type">Proposal Type</Label>
            <Select value={proposalType} onValueChange={setProposalType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Grant Proposal">Grant Proposal</SelectItem>
                <SelectItem value="Rule Change">Rule Change</SelectItem>
                <SelectItem value="Community Vote">Community Vote</SelectItem>
              </SelectContent>
            </Select>
            {proposalType === "Grant Proposal" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                <p className="text-sm text-blue-800">
                  Request funding for community projects and initiatives. Requires 51% approval and normally runs for
                  7-30 days.
                </p>
              </div>
            )}
          </div>

          {/* Amount Requested */}
          <div className="space-y-2">
            <Label htmlFor="amount-currency">Amount Requested</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nervos CKB">Nervos CKB</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
            <Input id="amount" type="number" placeholder="Enter amount in CKB" className="mt-2" />
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-yellow-800">
                The accounting denomination cannot be changed after proposal submission. All grant payments are made in
                equivalent CKB. Please review the{" "}
                <Link href="/dao-rules" className="text-[#00D4AA] hover:underline">
                  DAO Rules
                </Link>{" "}
                for more information.
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter proposal title" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter proposal description. Use Markdown format for rich text."
              className="min-h-[200px]"
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" />
              <p className="text-xs text-gray-500">When should voting begin?</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" />
              <p className="text-xs text-gray-500">When should voting end?</p>
            </div>
          </div>

          {/* Submit Button */}
          <Button className="w-full bg-[#00D4AA] hover:bg-[#00B894] text-white py-3 text-lg font-medium">
            Submit Proposal
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
