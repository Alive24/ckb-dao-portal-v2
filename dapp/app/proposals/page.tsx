import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, BarChart3, Target, Search, Filter } from "lucide-react"
import Link from "next/link"

const proposals = [
  {
    id: 1,
    title: "Regional Community Ambassador Program",
    description:
      "Regional Community Ambassador Program Summary This proposal aims to establish a network of regional ambassadors who will serve as the local representatives of our DAO across different geographic regions. These ambassadors will organize local meetups, provide language-specific resources, and act as the first point of contact for community members in their regions. Background While our DAO has grown globally, we face challenges in effectively engaging with community members across different time zones, languages, and cultural contexts. Many potential contributors miss opportunities to participate due to language barriers or lack of...",
    type: "Community Vote",
    status: "Active",
    approvalRate: 86.0,
    votesFor: "8,600,000,000",
    votesAgainst: "1,400,000,000",
    totalVotes: "10,000,000,000",
    threshold: "Community Vote Threshold",
  },
  {
    id: 2,
    title: "DeadBabies Meme Coin Integration",
    description:
      "Revolutionary meme coin project that will transform our ecosystem! 'DeadBabies' combines viral marketing potential with unique tokenomics to create unprecedented engagement.",
    type: "Community Vote",
    status: "Active",
    approvalRate: 3.0,
    votesFor: "123,400,000",
    votesAgainst: "3,987,600,000",
    totalVotes: "4,111,000,000",
    threshold: "Community Vote Threshold",
  },
  {
    id: 3,
    title: "Sustainability Initiative",
    description:
      "Launch a sustainability program to offset the environmental impact of network operations and promote eco-friendly blockchain practices.",
    type: "Community Vote",
    status: "Active",
    approvalRate: 61.3,
    votesFor: "2,450,000,000",
    votesAgainst: "1,550,000,000",
    totalVotes: "4,000,000,000",
    threshold: "Community Vote Threshold",
  },
]

export default function Proposals() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active Proposals</span>
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold">8</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Completed Proposals</span>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold">6</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Votes Cast</span>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold">62,734,000,000</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Grants Proposed</span>
              <Target className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold">6</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">Showing 14 of 14 Proposals</p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter & Sort
          </Button>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-6">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <Link href={`/proposals/${proposal.id}`} className="font-semibold text-lg hover:underline">
                      {proposal.title}
                    </Link>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{proposal.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Badge variant="outline">{proposal.type}</Badge>
                  <Badge className="bg-blue-100 text-blue-800">{proposal.status}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Approval Rate</span>
                    <span className="text-sm font-medium">{proposal.approvalRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#00D4AA] h-2 rounded-full" style={{ width: `${proposal.approvalRate}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{proposal.votesFor}</div>
                      <div className="text-xs text-gray-500">Votes For</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <div className="text-lg font-bold text-red-600">{proposal.votesAgainst}</div>
                      <div className="text-xs text-gray-500">Votes Against</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Total Votes Cast</span>
                    <span className="ml-2">{proposal.totalVotes}</span>
                  </div>
                  <div>
                    <span className="font-medium">Required Approval</span>
                    <span className="ml-2">{proposal.threshold}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
