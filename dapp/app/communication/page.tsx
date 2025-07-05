"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Info, AlertTriangle } from "lucide-react"

export default function Communication() {
  const [notifications, setNotifications] = useState({
    essential: true,
    newProposals: true,
    proposalResults: true,
    socialUpdates: true,
    weeklyDigest: true,
    educational: false,
    representative: true,
  })

  const updateNotification = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Communication Preferences</h1>
      </div>

      <div className="space-y-6">
        {/* Email Address */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="ckb.dao.member@gmail.com" className="max-w-md" />
              <p className="text-sm text-gray-600">
                This is the email address where you will receive all enabled notifications. Please ensure it is correct
                and accessible.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Essential Communications */}
            <div className="border border-[#00D4AA] bg-[#00D4AA]/5 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-[#00D4AA] mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-medium text-[#00D4AA]">Essential Communications</h4>
                    <p className="text-sm text-gray-700">
                      You will receive critical updates, security notifications, and important account-related messages.
                      These communications cannot be disabled for your security and continued safe access to the
                      platform.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications.essential}
                  onCheckedChange={(value) => updateNotification("essential", value)}
                  className="data-[state=checked]:bg-[#00D4AA]"
                />
              </div>
            </div>

            {/* New Proposals */}
            <div className="flex items-start justify-between py-4 border-b">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded"></div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">New Proposals</h4>
                  <p className="text-sm text-gray-600">
                    You will receive a notification when new governance proposals are submitted for review and voting.
                    This helps you stay informed about potential changes to the DAO.
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.newProposals}
                onCheckedChange={(value) => updateNotification("newProposals", value)}
                className="data-[state=checked]:bg-[#00D4AA]"
              />
            </div>

            {/* Proposal Results */}
            <div className="flex items-start justify-between py-4 border-b">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded"></div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Proposal Results</h4>
                  <p className="text-sm text-gray-600">
                    You will receive a notification when proposals you have participated in are finalized with voting
                    results. This ensures you are informed about the outcome of proposals that matter to you.
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.proposalResults}
                onCheckedChange={(value) => updateNotification("proposalResults", value)}
                className="data-[state=checked]:bg-[#00D4AA]"
              />
            </div>

            {/* Social Updates */}
            <div className="flex items-start justify-between py-4 border-b">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-purple-600 rounded"></div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Social Updates</h4>
                  <p className="text-sm text-gray-600">
                    You will receive community announcements, event invitations, and updates about the DAO ecosystem.
                    These communications help you stay connected with the broader community.
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.socialUpdates}
                onCheckedChange={(value) => updateNotification("socialUpdates", value)}
                className="data-[state=checked]:bg-[#00D4AA]"
              />
            </div>

            {/* Weekly Digest */}
            <div className="flex items-start justify-between py-4 border-b">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded"></div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Weekly Digest</h4>
                  <p className="text-sm text-gray-600">
                    You will receive a weekly summary of all governance activity, including new proposals, voting
                    results, and representative activity. This digest helps you stay informed without receiving multiple
                    individual notifications.
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={(value) => updateNotification("weeklyDigest", value)}
                className="data-[state=checked]:bg-[#00D4AA]"
              />
            </div>

            {/* Educational Content */}
            <div className="flex items-start justify-between py-4 border-b">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded"></div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Educational Content</h4>
                  <p className="text-sm text-gray-600">
                    You will receive occasional emails about governance best practices, blockchain technology updates,
                    and educational resources. These communications help you become a more informed participant in the
                    DAO ecosystem.
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.educational}
                onCheckedChange={(value) => updateNotification("educational", value)}
                className="data-[state=checked]:bg-[#00D4AA]"
              />
            </div>

            {/* Representative Messages */}
            <div className="flex items-start justify-between py-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded"></div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Representative Messages</h4>
                  <p className="text-sm text-gray-600">
                    You will receive direct communications from representatives you have delegated voting power to
                    regarding their voting decisions. This allows you to stay informed about how your voting power is
                    being used.
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.representative}
                onCheckedChange={(value) => updateNotification("representative", value)}
                className="data-[state=checked]:bg-[#00D4AA]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Unsubscribe Section */}
        <div className="border border-red-200 bg-red-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">Unsubscribe from all optional communications.</p>
            </div>
            <Button variant="destructive" size="sm">
              Unsubscribe All
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-[#00D4AA] hover:bg-[#00B894] px-8">Save Preferences</Button>
        </div>
      </div>
    </div>
  )
}
