import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, User, UserPlus, BarChart3, Search, Filter, Star, ExternalLink } from "lucide-react"
import Link from "next/link"

const representatives = [
  {
    id: 1,
    name: "Lisa Thompson",
    votes: "234.5M votes",
    description:
      "Pushes for environmentally conscious blockchain development and governance decisions. Advocates for sustainable practices in protocol design and believes in balancing technological advancement with ecological responsibility.",
    votingActivity: 8,
    status: "New",
    activeSince: "March 1, 2025",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Raj Kumar",
    votes: "156.7M votes",
    description:
      "blockchain good make money fast!!! voting is cool and stuff... like really into crypto since last week when friend told me about it... TO THE MOON!!! 🚀🚀🚀",
    votingActivity: 12,
    status: "New",
    activeSince: "February 28, 2025",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 2.1,
  },
  {
    id: 3,
    name: "Marcus Johnson",
    votes: "445.8M votes",
    description:
      "Leverages extensive traditional finance experience to bridge the gap with DeFi. Believes in pragmatic governance approaches that balance innovation with stability and risk management.",
    votingActivity: 15,
    status: "New",
    activeSince: "January 15, 2025",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
  },
  {
    id: 4,
    name: "Elena Petrova",
    votes: "127.5K votes",
    description:
      "Dedicated to advancing cross-chain interoperability while maintaining robust security standards. Emphasizes the importance of thorough technical review and evidence-based decision making.",
    votingActivity: 63,
    status: "Active",
    activeSince: "December 12, 2024",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
  },
  {
    id: 5,
    name: "James Wilson",
    votes: "892.3M votes",
    description:
      "Advocates for the harmonious integration of traditional finance with DeFi innovations. Strong proponent of regulatory compliance while maintaining core principles of decentralization.",
    votingActivity: 41,
    status: "Retiring",
    activeSince: "April 1, 2024",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
  },
  {
    id: 6,
    name: "Aisha Patel",
    votes: "245.8M votes",
    description:
      "Committed to dismantling barriers in blockchain adoption through education and inclusive governance. Advocates for transparent decision-making processes and community-driven initiatives.",
    votingActivity: 33,
    status: "Active",
    activeSince: "March 15, 2024",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 4.5,
  },
]

export default function Representatives() {
  return (
    <div className="space-y-8">

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Representatives</span>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800">13</div>
            <p className="text-xs text-[#00d4aa] mt-1">+3 this quarter</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active Representatives</span>
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800">6</div>
            <p className="text-xs text-[#00d4aa] mt-1">46% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">New Representatives</span>
              <UserPlus className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800">3</div>
            <p className="text-xs text-[#00d4aa] mt-1">23% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Voting Power</span>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800">6.8B</div>
            <p className="text-xs text-[#00d4aa] mt-1">CKB delegated</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">Showing 13 Representatives</p>
          <p className="text-xs text-gray-500">Updated 5 minutes ago</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-gray-300 hover:border-[#00d4aa] hover:text-[#00d4aa]">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm" className="border-gray-300 hover:border-[#00d4aa] hover:text-[#00d4aa]">
            <Filter className="h-4 w-4 mr-2" />
            Filter & Sort
          </Button>
        </div>
      </div>

      {/* Representatives Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {representatives.map((rep) => (
          <Card 
            key={rep.id} 
            className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 group border-l-4 border-l-[#00d4aa]"
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <Avatar className="w-16 h-16 ring-2 ring-[#00d4aa]/20">
                  <AvatarImage src={rep.avatar || "/placeholder.svg"} alt={rep.name} />
                  <AvatarFallback className="bg-[#00d4aa] text-white font-semibold">
                    {rep.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Link 
                      href={`/representatives/${rep.id}`} 
                      className="font-semibold text-lg hover:text-[#00d4aa] transition-colors group-hover:text-[#00d4aa]"
                    >
                      {rep.name}
                    </Link>
                    <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[#00d4aa] font-medium text-sm">{rep.votes}</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{rep.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">{rep.description}</p>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">Voting Activity</span>
                    <span className="text-xs text-gray-600 font-medium">{rep.votingActivity} votes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-[#00d4aa] h-1 rounded-full"
                      style={{ width: `${Math.min(rep.votingActivity * 1.5, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Status</span>
                    <Badge
                      className={`text-xs ${
                        rep.status === "New"
                          ? "bg-green-100 text-green-800"
                          : rep.status === "Active"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {rep.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Active Since</p>
                    <p className="text-xs text-gray-700 font-medium">{rep.activeSince}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Interested in Becoming a Representative?</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Join our governance community and help shape the future of the CKB ecosystem. 
            Representatives play a crucial role in decision-making and community leadership.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-[#00d4aa] hover:bg-[#00b894] text-white">
              <Link href="/apply-representative">
                <UserPlus className="h-4 w-4 mr-2" />
                Apply as Representative
              </Link>
            </Button>
            <Button variant="outline" className="border-gray-300 hover:border-[#00d4aa] hover:text-[#00d4aa]">
              Learn More About Representative Roles
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
