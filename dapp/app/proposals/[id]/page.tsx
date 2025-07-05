import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const proposal = {
  id: 1,
  title: "Regional Community Ambassador Program",
  type: "Community Vote",
  approvalRequired: "51% approval",
  details: {
    summary:
      "This proposal aims to establish a network of regional ambassadors who will serve as the local representatives of our DAO across different geographic regions. These ambassadors will organize local meetups, provide language-specific resources, and act as the first point of contact for community members in their regions.",
    background:
      "While our DAO has grown globally, we face challenges in effectively engaging with community members across different time zones, languages, and cultural contexts. Many potential contributors miss opportunities to participate due to language barriers or lack of localized support.",
    objectives: [
      "1. Increase global participation in governance by 40% within 12 months",
      "2. Establish active community hubs in at least 10 regions worldwide",
      "3. Produce educational materials in at least 8 languages",
      "4. Organize a minimum of 5 local events per region annually",
    ],
    implementation: {
      selection:
        "- Open application process for community members with demonstrated commitment\n- Selection criteria: regional knowledge, communication skills, previous contributions\n- Initial cohort of 10-15 ambassadors with quarterly reviews",
      support:
        "- Monthly stipend of 2,000 CKB per ambassador\n- Regional event budget of 5,000 CKB per region annually\n- Translation budget for documentation and announcements\n- Ambassador onboarding and training program",
    },
    activities: [
      "- Organize monthly local meetups (virtual or in-person)",
      "- Translate key resources and announcements",
      "- Represent regional community concerns in governance discussions",
      "- Host regional educational workshops and onboarding sessions",
      "- Provide regular reports on regional activities and growth",
    ],
    budget:
      "Annual Budget Request: 450,000 CKB\n\n- Ambassador stipends: 360,000 CKB (15 ambassadors × 2,000 CKB × 12 months)",
  },
  voting: {
    approvalRate: 86.0,
    votesFor: "8,600,000,000",
    votesAgainst: "1,400,000,000",
    totalVotes: "10,000,000,000",
  },
  comments: [
    {
      id: 1,
      author: "Maria Rodriguez",
      date: "April 18, 2025",
      content:
        "This is exactly what our community needs! As someone from a non-English speaking region, I've often felt disconnected from the main governance discussions. Having dedicated ambassadors would make a huge difference.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      author: "Hiroshi Tanaka",
      date: "April 18, 2025",
      content:
        "I fully support this initiative. The budget seems reasonable given the scope and potential impact. I'm especially excited about the translation services - this would help tremendously in expanding our reach in Asia.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      author: "David Miller",
      date: "April 18, 2025",
      content:
        "While I like the concept, I'm concerned about the selection process for ambassadors. We need to ensure they truly represent their communities and aren't just the most vocal participants. Can we add more details about the vetting process?",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      author: "Aisha Patel",
      date: "April 18, 2025",
      content:
        "This is a great step toward true decentralization! I'd suggest adding specific KPIs for ambassadors to ensure accountability. Perhaps quarterly reviews based on concrete metrics?",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      author: "Carlos Santos",
      date: "April 18, 2025",
      content:
        "As someone who's been organizing unofficial meetups in South America, I'm excited about this. Having some funding and official recognition would help us grow these communities exponentially. Strong support from me!",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      author: "Emma Wilson",
      date: "April 19, 2025",
      content:
        "I have some concerns about the budget allocation. 360,000 CKB for stipends seems high. Could we start with a smaller pilot program in 5 key regions first and expand based on results?",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      author: "Liu Wei",
      date: "April 19, 2025",
      content:
        "The translation budget seems too low for 8 languages. Professional translation is expensive, and we want quality materials. I suggest increasing this allocation or reducing the number of supported languages initially.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      author: "Sarah Martinez",
      date: "April 19, 2025",
      content:
        "I love this proposal! I've felt we've been too centralized to English-speaking regions for too long. This would make a meaningful difference in how inclusive our governance actually is in practice.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 9,
      author: "Raj Kumar",
      date: "April 20, 2025",
      content:
        "One question: how will we ensure ambassadors are representing community interests rather than pushing their own agendas? I support the concept but want to make sure we have checks and balances in place.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
}

export default function ProposalDetails({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Proposals</span>
        <span>›</span>
        <span>Details</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{proposal.title}</h1>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">{proposal.type}</span>
          <span>•</span>
          <span className="text-gray-600">Requires {proposal.approvalRequired}</span>
        </div>
      </div>

      {/* Proposal Details */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle>Proposal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">{proposal.title}</h3>
          </div>

          <div>
            <h4 className="font-medium mb-2">Summary</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{proposal.details.summary}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Background</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{proposal.details.background}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Objectives</h4>
            <div className="space-y-1">
              {proposal.details.objectives.map((objective, index) => (
                <p key={index} className="text-sm text-gray-700">
                  {objective}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Implementation Plan</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-sm mb-1">Ambassador Selection</h5>
                <p className="text-sm text-gray-700 whitespace-pre-line">{proposal.details.implementation.selection}</p>
              </div>
              <div>
                <h5 className="font-medium text-sm mb-1">Resources and Support</h5>
                <p className="text-sm text-gray-700 whitespace-pre-line">{proposal.details.implementation.support}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Activities and Responsibilities</h4>
            <div className="space-y-1">
              {proposal.details.activities.map((activity, index) => (
                <p key={index} className="text-sm text-gray-700">
                  {activity}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Budget Breakdown</h4>
            <p className="text-sm text-gray-700 whitespace-pre-line">{proposal.details.budget}</p>
          </div>
        </CardContent>
      </Card>

      {/* Voting Progress */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Voting Progress</h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Approval Rate</span>
                <span className="text-sm font-medium">{proposal.voting.approvalRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#00D4AA] h-3 rounded-full"
                  style={{ width: `${proposal.voting.approvalRate}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Votes in Favor</div>
                <div className="text-2xl font-bold text-green-600">{proposal.voting.votesFor}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Votes Against</div>
                <div className="text-2xl font-bold text-red-600">{proposal.voting.votesAgainst}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
              <div>
                <span className="font-medium">Total Votes Cast</span>
                <span className="ml-8">{proposal.voting.totalVotes}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-6">Conversation</h3>

          <div className="space-y-6">
            {proposal.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                  <AvatarFallback>
                    {comment.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
