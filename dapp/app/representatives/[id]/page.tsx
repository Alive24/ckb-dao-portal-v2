import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Github,
  Twitter,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const representative = {
  id: 1,
  name: "Lisa Thompson",
  title: "Representative since 2025",
  avatar: "/placeholder.svg?height=120&width=120",
  valuesBeliefs:
    "Pushes for environmentally conscious blockchain development and governance decisions. Advocates for sustainable practices in protocol design and believes in balancing technological advancement with ecological responsibility. Believes in transparent and accountable governance structures that prioritize environmental stewardship. Promotes the use of renewable energy sources for blockchain operations and advocates for carbon offsetting initiatives to minimize environmental footprint.",
  experience:
    "PhD in Environmental Science with 8 years focusing on blockchain sustainability. Led development of energy-efficient consensus mechanisms that reduced protocol energy consumption by 90%. Pioneer in implementing carbon credit systems on-chain. Regular contributor to blockchain environmental impact studies. Developed frameworks for measuring and optimizing protocol energy usage.",
  disclosures:
    "Member of Blockchain Environmental Sustainability Board. Research funded by climate action grants. All relationships and holdings publicly disclosed. Leading multiple initiatives for sustainable blockchain development.",
  votingActivity: {
    total: 8,
    approved: 6,
    rejected: 2,
  },
  recentVotes: [
    {
      id: 1,
      title: "Community Grant Proposal #45",
      date: "2/28/2025",
      vote: "approved",
      icon: CheckCircle,
    },
    {
      id: 2,
      title: "Protocol Upgrade v2.1",
      date: "2/27/2025",
      vote: "rejected",
      icon: XCircle,
    },
    {
      id: 3,
      title: "Treasury Reallocation",
      date: "2/24/2025",
      vote: "approved",
      icon: CheckCircle,
    },
  ],
}

export default function RepresentativeDetails({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Representatives</span>
        <span>›</span>
        <span>Details</span>
      </div>

      {/* Profile Header */}
      <div className="flex items-start space-x-6">
        <Avatar className="w-32 h-32">
          <AvatarImage src={representative.avatar || "/placeholder.svg"} alt={representative.name} />
          <AvatarFallback className="text-2xl">
            {representative.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{representative.name}</h1>
          <p className="text-gray-600 mb-4">{representative.title}</p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Values & Beliefs */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle>Values & Beliefs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 leading-relaxed">{representative.valuesBeliefs}</p>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 leading-relaxed">{representative.experience}</p>
        </CardContent>
      </Card>

      {/* Disclosures */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle>Disclosures</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 leading-relaxed">{representative.disclosures}</p>
        </CardContent>
      </Card>

      {/* Voting Activity */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle>Voting Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{representative.votingActivity.total}</div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{representative.votingActivity.approved}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{representative.votingActivity.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Votes */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle>Recent Votes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {representative.recentVotes.map((vote) => (
              <div key={vote.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <vote.icon className={`h-5 w-5 ${vote.vote === "approved" ? "text-green-500" : "text-red-500"}`} />
                  <span className="font-medium">{vote.title}</span>
                </div>
                <span className="text-sm text-gray-500">{vote.date}</span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">1</span>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delegations */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle>Delegations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Delegation information would be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
