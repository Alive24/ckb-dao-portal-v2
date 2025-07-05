"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Info } from "lucide-react"

export default function CreatePoll() {
  const [options, setOptions] = useState(["", ""])
  const [pollTitle, setPollTitle] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("7")

  const addOption = () => {
    setOptions([...options, ""])
  }

  const updateOption = (index: number, value: string) => {
    const updated = options.map((option, i) => (i === index ? value : option))
    setOptions(updated)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <span>Polls</span>
          <span>›</span>
          <span>Create</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Poll</h1>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm text-blue-900">
              All polls must be reviewed and approved by content moderators before being published.
            </p>
            <p className="text-sm text-blue-800">
              Moderators may make necessary modifications to ensure compliance with community guidelines.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Poll Title</Label>
                <Input
                  id="title"
                  placeholder="Enter the poll title"
                  value={pollTitle}
                  onChange={(e) => setPollTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about the poll"
                  className="min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Poll Options</Label>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                    />
                  ))}
                  <Button type="button" variant="outline" onClick={addOption} className="w-full bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button className="flex-1 bg-[#00D4AA] hover:bg-[#00B894]">Create Poll</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{pollTitle || "Your Poll Title"}</h3>
                  <Badge variant="outline">Draft</Badge>
                </div>
                <p className="text-sm text-gray-600">{description || "Your poll description will appear here"}</p>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                      <div className="w-4 h-4 border rounded-sm"></div>
                      <span className="text-sm">{option || `Option ${index + 1}`}</span>
                      <span className="ml-auto text-sm text-gray-500">0%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
