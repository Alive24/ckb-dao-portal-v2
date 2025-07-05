import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, TrendingUp, Wallet, ArrowRight, Calendar, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}


      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active Proposals</span>
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800">5</div>
            <p className="text-xs text-[#00d4aa] mt-1">+2 this week</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Representatives</span>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800">12</div>
            <p className="text-xs text-[#00d4aa] mt-1">89% active</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Voting Participation</span>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800">89%</div>
            <p className="text-xs text-[#00d4aa] mt-1">+5% vs last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Fund Allocation</span>
              <Wallet className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800">30.2M</div>
            <p className="text-xs text-gray-500 mt-1">CKB committed</p>
          </CardContent>
        </Card>
      </div>

      {/* Newest Proposal - Full Width */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-[#00d4aa]" />
            <CardTitle className="text-lg font-semibold text-gray-800">Newest Proposal</CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-[#00d4aa] hover:bg-[#00d4aa]/10">
            <Link href="/proposals" className="flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Community Vote</Badge>
              <Badge className="bg-[#00d4aa]/20 text-[#00d4aa] border-[#00d4aa]/30">Active</Badge>
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Regional Community Ambassador Program</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              This proposal aims to establish a network of regional ambassadors who will serve as the local 
              representatives of our DAO across different geographic regions. These ambassadors will organize 
              local meetups, provide language-specific resources, and act as the first point of contact for 
              community members in their regions.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Approval Rate</span>
              <span className="text-sm font-semibold text-[#00d4aa]">86.0%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#00d4aa] h-2 rounded-full" style={{ width: "86%" }}></div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>8.6B votes for</span>
              <span>2 days remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Latest News and Active Polls - Side by Side */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Latest News */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-[#00d4aa]" />
              <CardTitle className="text-lg font-semibold text-gray-800">Latest News</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-l-4 border-[#00d4aa] pl-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">New Milestone Achieved</h4>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-sm text-gray-600">
                  The community development fund has reached its first milestone with successful completion of 10 
                  grant proposals. This achievement marks a significant step forward in our mission.
                </p>
                <Button variant="ghost" size="sm" className="text-[#00d4aa] hover:bg-[#00d4aa]/10 p-0">
                  Read More
                </Button>
              </div>

              <div className="border-l-4 border-[#00d4aa]/70 pl-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">Upcoming Town Hall</h4>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <p className="text-sm text-gray-600">
                  Join us for the monthly town hall meeting to discuss the latest proposals and community updates. 
                  The agenda includes a review of recently completed projects.
                </p>
                <Button variant="ghost" size="sm" className="text-[#00d4aa] hover:bg-[#00d4aa]/10 p-0">
                  Read More
                </Button>
              </div>

              <div className="border-l-4 border-[#00d4aa]/50 pl-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">Q1 2025 Strategy Overview</h4>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
                <p className="text-sm text-gray-600">
                  The DAO's strategic focus for Q1 2025 has been published, outlining key priorities in DeFi 
                  integration, cross-chain development, and community growth initiatives.
                </p>
                <Button variant="ghost" size="sm" className="text-[#00d4aa] hover:bg-[#00d4aa]/10 p-0">
                  Read More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Polls */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-[#00d4aa]" />
              <CardTitle className="text-lg font-semibold text-gray-800">Active Polls</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3 text-gray-800">Should we extend the voting period for technical proposals?</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Yes, extend to 14 days</span>
                    <span className="text-sm font-medium text-[#00d4aa]">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#00d4aa] h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">No, keep current 7 days</span>
                    <span className="text-sm font-medium text-gray-500">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>156 total votes</span>
                  <span>2 days remaining</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3 text-gray-800">What should be our next infrastructure focus?</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cross-chain bridges</span>
                    <span className="text-sm font-medium text-[#00d4aa]">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#00d4aa] h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Developer tools</span>
                    <span className="text-sm font-medium text-[#00d4aa]">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#00d4aa] h-2 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">DeFi protocols</span>
                    <span className="text-sm font-medium text-[#00d4aa]">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#00d4aa] h-2 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>234 total votes</span>
                  <span>5 days remaining</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
