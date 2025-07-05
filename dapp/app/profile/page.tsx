import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Shield, 
  Vote, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Calendar,
  Wallet,
  Users,
  FileText,
  Edit
} from "lucide-react"
import Link from "next/link"

// Mock data for prototype
const mockUser = {
  name: "John Dao",
  email: "john.dao@example.com",
  avatar: "/placeholder-user.jpg",
  joinDate: "2024-01-15",
  bio: "Blockchain enthusiast and community builder with 5+ years experience in DeFi governance. Passionate about decentralized decision-making and ecosystem growth.",
  verifications: {
    kyc: { verified: true, provider: "Civic", date: "2024-01-20" },
    telegram: { verified: true, username: "@johndao", date: "2024-01-16" },
    did: { verified: false, identifier: null },
    addresses: [
      { address: "ckb1qyq...a2b3c4", balance: "1,000.00 CKB", primary: true },
      { address: "ckb1qyq...d5e6f7", balance: "234.56 CKB", primary: false },
      { address: "ckb1qyq...g8h9i0", balance: "0.00 CKB", primary: false }
    ]
  },
  votingPower: {
    total: "1,234.56 CKB",
    delegated: "800.00 CKB",
    direct: "434.56 CKB"
  },
  statistics: {
    proposalsVoted: 42,
    delegationsReceived: 5,
    representativeScore: 4.8,
    participationRate: 89
  },
  recentActivity: [
    { type: "vote", proposal: "Regional Community Ambassador Program", action: "Voted Yes", date: "2024-01-25", icon: Vote },
    { type: "delegation", from: "alice.dao", amount: "500 CKB", date: "2024-01-24", icon: Users },
    { type: "proposal", title: "DeFi Integration Proposal", action: "Submitted", date: "2024-01-22", icon: FileText },
    { type: "verification", action: "KYC Verified", provider: "Civic", date: "2024-01-20", icon: Shield }
  ]
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback className="bg-[#00d4aa] text-white text-lg">
                {mockUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{mockUser.name}</h1>
                  <p className="text-gray-600">{mockUser.email}</p>
                  <p className="text-sm text-gray-500">Member since {new Date(mockUser.joinDate).toLocaleDateString()}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              <p className="text-sm text-gray-600 max-w-2xl">{mockUser.bio}</p>
              
              {/* Verification Badges */}
              <div className="flex items-center space-x-2 mt-3">
                {mockUser.verifications.kyc.verified && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    KYC Verified
                  </Badge>
                )}
                {mockUser.verifications.telegram.verified && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Telegram Linked
                  </Badge>
                )}
                {!mockUser.verifications.did.verified && (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    DID Pending
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="voting">Voting History</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Voting Power</span>
                  <Vote className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{mockUser.votingPower.total}</div>
                <p className="text-xs text-[#00d4aa] mt-1">Rank #23</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Proposals Voted</span>
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{mockUser.statistics.proposalsVoted}</div>
                <p className="text-xs text-[#00d4aa] mt-1">{mockUser.statistics.participationRate}% participation</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Delegations</span>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{mockUser.statistics.delegationsReceived}</div>
                <p className="text-xs text-[#00d4aa] mt-1">{mockUser.votingPower.delegated} delegated</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Rep Score</span>
                  <Shield className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{mockUser.statistics.representativeScore}/5.0</div>
                <p className="text-xs text-[#00d4aa] mt-1">Excellent rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-[#00d4aa]" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUser.recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-[#00d4aa]/20 rounded-full flex items-center justify-center">
                        <Icon className="h-4 w-4 text-[#00d4aa]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">
                              {activity.action}
                              {activity.proposal && (
                                <span className="text-gray-600"> on "{activity.proposal}"</span>
                              )}
                              {activity.title && (
                                <span className="text-gray-600"> "{activity.title}"</span>
                              )}
                              {activity.from && (
                                <span className="text-gray-600"> from {activity.from}</span>
                              )}
                              {activity.amount && (
                                <span className="text-[#00d4aa]"> ({activity.amount})</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voting History Tab */}
        <TabsContent value="voting" className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle>Voting History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Regional Community Ambassador Program</h4>
                    <Badge className="bg-green-100 text-green-800">Passed</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Your vote: <span className="font-medium text-green-600">Yes</span></span>
                    <span>2024-01-25</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">DeFi Integration Protocol</h4>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Your vote: <span className="font-medium text-green-600">Yes</span></span>
                    <span>2024-01-23</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Treasury Management Update</h4>
                    <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Your vote: <span className="font-medium text-red-600">No</span></span>
                    <span>2024-01-20</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle>Identity Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* KYC Verification */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">KYC Verification</h4>
                    <p className="text-sm text-green-600">Verified with {mockUser.verifications.kyc.provider} on {new Date(mockUser.verifications.kyc.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              </div>

              {/* Telegram Verification */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-800">Telegram Account</h4>
                    <p className="text-sm text-blue-600">Linked as {mockUser.verifications.telegram.username} on {new Date(mockUser.verifications.telegram.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Linked</Badge>
              </div>

              {/* DID Setup */}
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                  <div>
                    <h4 className="font-medium text-orange-800">Decentralized Identity (DID)</h4>
                    <p className="text-sm text-orange-600">Set up your DID for enhanced verification and cross-platform identity</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  Setup DID
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Address Binding */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Linked Addresses</span>
                <Button asChild size="sm">
                  <Link href="/address-binding">
                    <Wallet className="h-4 w-4 mr-2" />
                    Manage Addresses
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUser.verifications.addresses.map((addr, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Wallet className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="font-mono text-sm">{addr.address}</p>
                        <p className="text-xs text-gray-500">{addr.balance}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {addr.primary && <Badge variant="secondary">Primary</Badge>}
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <h4 className="font-medium mb-2">Notification Preferences</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Email notifications for new proposals</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Telegram notifications for voting deadlines</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Weekly governance summary</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Privacy Settings</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Public voting history</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Allow delegation requests</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 