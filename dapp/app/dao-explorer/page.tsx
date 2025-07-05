import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

export default function DAOExplorer() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Proposals</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">8</span>
              <span className="text-sm text-gray-600">Active</span>
              <span className="text-3xl font-bold">14</span>
              <span className="text-sm text-gray-600">Total</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Representatives</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">9</span>
              <span className="text-sm text-gray-600">Active</span>
              <span className="text-3xl font-bold">13</span>
              <span className="text-sm text-gray-600">Total</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Participation</span>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold">92%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Growth metrics chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle>Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Activity chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle>Proposal Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Grant</span>
                  <div className="w-32 bg-gray-200 rounded-full h-6">
                    <div className="bg-[#00D4AA] h-6 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rule Change</span>
                  <div className="w-32 bg-gray-200 rounded-full h-6">
                    <div className="bg-[#00D4AA] h-6 rounded-full" style={{ width: "40%" }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Community Vote</span>
                  <div className="w-32 bg-gray-200 rounded-full h-6">
                    <div className="bg-[#00D4AA] h-6 rounded-full" style={{ width: "40%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle>Proposal Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active</span>
                  <div className="w-32 bg-gray-200 rounded-full h-6">
                    <div className="bg-[#00D4AA] h-6 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed</span>
                  <div className="w-32 bg-gray-200 rounded-full h-6">
                    <div className="bg-[#00D4AA] h-6 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold mb-4">DAO Governance</h3>
            <p className="text-sm text-gray-600 mb-4">
              A comprehensive DAO governance platform providing deep insights into representative profiles, voting
              dynamics, and community engagement.
            </p>
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Dashboard</li>
              <li>Proposals</li>
              <li>Representatives</li>
              <li>Explorer</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Documentation</li>
              <li>Support</li>
              <li>API</li>
              <li>Changelog</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
              <li>Communication Preferences</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
