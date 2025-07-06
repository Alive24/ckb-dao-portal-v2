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
  Edit,
  Plus,
  MessageSquare,
  Settings,
  Download,
  AlertTriangle,
  RefreshCw,
  Lock as LockIcon,
  Key,
  Copy
} from "lucide-react"
import Link from "next/link"

// Mock data for prototype
const mockUser = {
  // Primary identifier
  pubkey: "0x8e4d2c5f7a9b3c6e8d1f2a5b8c9e0d3f6a7b4c5d8e1f2a5b8c9e0d3f6a7b4c5d",
  
  // User metadata (changeable)
  metadata: {
    name: "John Dao",
    email: "john.dao@example.com",
    avatar: "/placeholder-user.jpg",
    bio: "Blockchain enthusiast and community builder with 5+ years experience in DeFi governance. Passionate about decentralized decision-making and ecosystem growth."
  },
  
  // Account info
  joinDate: "2024-01-15",
  
  // Verification status (tied to pubkey)
  verifications: {
    kyc: { verified: true, status: "verified", provider: "Civic", date: "2024-01-20" },
    telegram: { verified: false, status: "pending", username: null, date: null },
    did: { verified: false, status: "not_started", identifier: null },
    addresses: [
      { address: "ckb1qyq...a2b3c4", balance: "1,000.00 CKB", primary: true, verified: true },
      { address: "ckb1qyq...d5e6f7", balance: "234.56 CKB", primary: false, verified: false }
    ]
  },
  stats: {
    votingPower: "1,234.56 CKB",
    proposalsVoted: 47,
    delegationsReceived: 8,
    repScore: 92
  },
  activities: [
    {
      type: "vote",
      title: "Voted on Proposal #24: Developer Grant Program",
      date: "2024-01-25",
      status: "For"
    },
    {
      type: "delegate",
      title: "Received delegation from @crypto_alice",
      date: "2024-01-24",
      status: "Active"
    },
    {
      type: "vote",
      title: "Voted on Proposal #23: Marketing Campaign",
      date: "2024-01-23",
      status: "Against"
    }
  ],
  notifications: {
    email: true,
    browser: true,
    telegram: false,
    sms: false
  }
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockUser.metadata.avatar} alt={mockUser.metadata.name} />
              <AvatarFallback className="bg-[#00d4aa] text-white text-lg">
                {mockUser.metadata.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{mockUser.metadata.name}</h1>
                  <p className="text-gray-600">{mockUser.metadata.email}</p>
                  <p className="text-sm text-gray-500">Member since {new Date(mockUser.joinDate).toLocaleDateString()}</p>
                </div>
                <Button variant="outline" className="shrink-0">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              {/* Primary Identity (Pubkey) */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Key className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-900">Primary Identity</h3>
                      <p className="text-sm text-blue-700">Cryptographic identifier (immutable)</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="mt-3 p-3 bg-white rounded border font-mono text-sm break-all">
                  {mockUser.pubkey}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 max-w-2xl">{mockUser.metadata.bio}</p>
              
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
                <div className="text-3xl font-bold text-gray-800">{mockUser.stats.votingPower}</div>
                <p className="text-xs text-[#00d4aa] mt-1">Rank #23</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Proposals Voted</span>
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{mockUser.stats.proposalsVoted}</div>
                <p className="text-xs text-[#00d4aa] mt-1">{mockUser.stats.repScore}% participation</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Delegations</span>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{mockUser.stats.delegationsReceived}</div>
                <p className="text-xs text-[#00d4aa] mt-1">{mockUser.stats.votingPower} delegated</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Rep Score</span>
                  <Shield className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-800">{mockUser.stats.repScore}/100</div>
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
                {mockUser.activities.map((activity, index) => {
                  const Icon = activity.type === "vote" ? Vote : Users
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-[#00d4aa]/20 rounded-full flex items-center justify-center">
                        <Icon className="h-4 w-4 text-[#00d4aa]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">
                              {activity.title}
                              {activity.status && (
                                <span className="text-gray-600"> ({activity.status})</span>
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
          {/* Verification Progress Overview */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Identity Verification Progress</span>
                <Badge className="bg-blue-100 text-blue-800">
                  1/3 Complete
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Steps */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">KYC Verification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Telegram Linking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">DID Setup</span>
                  </div>
                </div>

                {/* Benefits Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Complete Your Verification</h4>
                  <p className="text-sm text-blue-600 mb-3">
                    Full verification unlocks enhanced features and increases your governance participation weight.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>Higher delegation trust</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>Priority proposal review</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>Representative eligibility</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>Enhanced security</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Verification Status */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle>Verification Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* KYC Verification */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-800">KYC Verification</h4>
                      <p className="text-sm text-green-600">Identity verified and compliant</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Provider:</span>
                    <span className="ml-2 font-medium">{mockUser.verifications.kyc.provider}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Verified:</span>
                    <span className="ml-2 font-medium">{new Date(mockUser.verifications.kyc.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Level:</span>
                    <span className="ml-2 font-medium">Level 2 (Enhanced)</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Valid Until:</span>
                    <span className="ml-2 font-medium">2025-01-15</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Certificate
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Renew
                  </Button>
                </div>
              </div>

              {/* Telegram Verification */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-blue-800">Telegram Account</h4>
                      <p className="text-sm text-blue-600">Connected for notifications and community</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Linked</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Username:</span>
                    <span className="ml-2 font-medium">{mockUser.verifications.telegram.username || 'Not linked'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Linked:</span>
                    <span className="ml-2 font-medium">
                      {mockUser.verifications.telegram.date ? new Date(mockUser.verifications.telegram.date).toLocaleDateString() : 'Not yet linked'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-medium text-orange-600">Pending Setup</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Notifications:</span>
                    <span className="ml-2 font-medium text-gray-500">Disabled</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Connect Telegram
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>

              {/* DID Setup - Incomplete */}
              <div className="border rounded-lg p-4 bg-orange-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                    <div>
                      <h4 className="font-medium text-orange-800">Decentralized Identity (DID)</h4>
                      <p className="text-sm text-orange-600">Complete setup for enhanced cross-platform verification</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
                </div>
                
                {/* DID Setup Steps */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">1</span>
                    </div>
                    <span className="text-sm">Create DID document</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">2</span>
                    </div>
                    <span className="text-sm">Link to existing verifications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">3</span>
                    </div>
                    <span className="text-sm">Publish to decentralized network</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Link href="/did-setup">
                      <Plus className="h-4 w-4 mr-2" />
                      Start DID Setup
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Address Management */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Address Management</span>
                <div className="flex space-x-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/address-binding">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/address-binding">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage All
                    </Link>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Address Stats */}
                <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{mockUser.verifications.addresses.length}</div>
                    <div className="text-sm text-gray-600">Total Addresses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00d4aa]">
                      {mockUser.verifications.addresses.filter(addr => addr.verified).length}
                    </div>
                    <div className="text-sm text-gray-600">Verified</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {mockUser.verifications.addresses.reduce((sum, addr) => sum + parseFloat(addr.balance.replace(/[^0-9.]/g, '')), 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Total CKB</div>
                  </div>
                </div>

                {/* Address List */}
                <div className="space-y-3">
                  {mockUser.verifications.addresses.map((addr, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Wallet className="h-4 w-4 text-gray-600" />
                          {addr.verified && (
                            <CheckCircle2 className="h-3 w-3 text-green-600 absolute -top-1 -right-1" />
                          )}
                        </div>
                        <div>
                          <p className="font-mono text-sm">{addr.address}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{addr.balance}</span>
                            <span>•</span>
                            <span>Last used: 2 days ago</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {addr.primary && <Badge variant="secondary">Primary</Badge>}
                        {addr.verified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Two-Factor Auth</span>
                  </div>
                  <p className="text-xs text-green-600">Enabled via Telegram</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <LockIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">WebAuthn</span>
                  </div>
                  <p className="text-xs text-blue-600">Hardware key registered</p>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <h4 className="font-medium mb-2">Verification Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Audit Log
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Status
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {/* Primary Identity (Immutable) */}
          <div className="space-y-4">
            <h4 className="font-medium">Primary Identity (Immutable)</h4>
            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Public Key</label>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-200">
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-3 bg-white rounded border font-mono text-xs break-all text-gray-800">
                {mockUser.pubkey}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This is your unique cryptographic identifier. It cannot be changed.
              </p>
            </div>
          </div>
          
          {/* Profile Metadata (Changeable) */}
          <div className="space-y-4">
            <h4 className="font-medium">Profile Metadata (Changeable)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Display Name</label>
                <input 
                  type="text" 
                  defaultValue={mockUser.metadata.name}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="How others see you"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email (Optional)</label>
                <input 
                  type="email" 
                  defaultValue={mockUser.metadata.email}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="For notifications only"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea 
                rows={3}
                defaultValue={mockUser.metadata.bio}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Tell the community about yourself"
              />
            </div>
            <p className="text-xs text-gray-500">
              This information is stored as metadata and can be updated anytime. Your identity remains tied to your public key.
            </p>
            <Button className="bg-[#00d4aa] hover:bg-[#00b393] text-white">
              Save Metadata Changes
            </Button>
          </div>

          {/* Governance Preferences */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Vote className="h-4 w-4 text-gray-400" />
                <span>Governance Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-500">Receive updates about proposals and votes</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Telegram Notifications</div>
                    <div className="text-sm text-gray-500">Get instant notifications via Telegram</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto-Delegation</div>
                    <div className="text-sm text-gray-500">Allow trusted representatives to vote on your behalf</div>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Public Profile</div>
                    <div className="text-sm text-gray-500">Make your voting history publicly visible</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Voting Reminders</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="reminder-daily" name="reminders" defaultChecked className="rounded" />
                    <label htmlFor="reminder-daily" className="text-sm">Daily digest</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="reminder-weekly" name="reminders" className="rounded" />
                    <label htmlFor="reminder-weekly" className="text-sm">Weekly summary</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="reminder-none" name="reminders" className="rounded" />
                    <label htmlFor="reminder-none" className="text-sm">No reminders</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span>Security & Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Security Features */}
                <div className="space-y-4">
                  <h4 className="font-medium">Security Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <LockIcon className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium text-sm">Two-Factor Authentication</div>
                          <div className="text-xs text-gray-500">Enabled via Telegram</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium text-sm">Hardware Security Key</div>
                          <div className="text-xs text-gray-500">WebAuthn registered</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <div>
                          <div className="font-medium text-sm">Recovery Phrases</div>
                          <div className="text-xs text-gray-500">Backup your account access</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Setup</Button>
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium">Privacy Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Hide Voting Power</div>
                        <div className="text-xs text-gray-500">Don't show your CKB balance publicly</div>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Anonymous Voting</div>
                        <div className="text-xs text-gray-500">Hide your identity in vote records</div>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Hide Delegations</div>
                        <div className="text-xs text-gray-500">Keep delegation relationships private</div>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Contact Privacy</div>
                        <div className="text-xs text-gray-500">Allow representatives to contact you</div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Actions */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span>Advanced Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data Management */}
                <div className="space-y-3">
                  <h4 className="font-medium">Data Management</h4>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Verification Status
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    View Activity Log
                  </Button>
                </div>

                {/* Account Actions */}
                <div className="space-y-3">
                  <h4 className="font-medium">Account Actions</h4>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/apply-representative">
                      <Users className="h-4 w-4 mr-2" />
                      Apply as Representative
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Request Data Correction
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Deactivate Account
                  </Button>
                </div>
              </div>

              {/* Help & Support */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Help & Support</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" size="sm" className="justify-start">
                    <MessageSquare className="h-3 w-3 mr-2" />
                    Help Center
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <FileText className="h-3 w-3 mr-2" />
                    Documentation
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Community Forum
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <MessageSquare className="h-3 w-3 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Developer Settings */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-gray-400" />
                <span>Developer Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">API Access</div>
                  <div className="text-sm text-gray-500">Generate API keys for integrations</div>
                </div>
                <Button variant="outline" size="sm">Manage API Keys</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Webhook Endpoints</div>
                  <div className="text-sm text-gray-500">Configure notifications for external systems</div>
                </div>
                <Button variant="outline" size="sm">Configure Webhooks</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Debug Mode</div>
                  <div className="text-sm text-gray-500">Enable detailed logging and diagnostics</div>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 