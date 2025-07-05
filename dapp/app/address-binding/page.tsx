"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Wallet, 
  Shield, 
  Key, 
  Copy, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ExternalLink,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react"
import { useState } from "react"

// Mock data for prototype
const mockAddresses = [
  { 
    address: "ckb1qyqd53x...a2b3c4d5e6", 
    balance: "1,000.00 CKB", 
    status: "verified", 
    bindingDate: "2024-01-20",
    primary: true
  },
  { 
    address: "ckb1qyqd53x...f7g8h9i0j1", 
    balance: "234.56 CKB", 
    status: "verified", 
    bindingDate: "2024-01-18",
    primary: false
  },
  { 
    address: "ckb1qyqd53x...k2l3m4n5o6", 
    balance: "0.00 CKB", 
    status: "pending", 
    bindingDate: "2024-01-25",
    primary: false
  }
]

const mockApiKey = "dao_api_key_1234567890abcdef1234567890abcdef12345678"

export default function AddressBindingPage() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [bindingStep, setBindingStep] = useState(1)
  const [webAuthnEnabled, setWebAuthnEnabled] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You would typically show a toast notification here
  }

  const enableWebAuthn = async () => {
    // Mock WebAuthn implementation
    try {
      // In real implementation, this would use navigator.credentials.create()
      setWebAuthnEnabled(true)
      setBindingStep(2)
    } catch (error) {
      console.error("WebAuthn setup failed:", error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="enhanced-card">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#00d4aa]/20 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-[#00d4aa]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Address Binding</h1>
              <p className="text-gray-600 max-w-2xl mx-auto mt-2">
                Link your CKB addresses to your DAO account to participate in governance. 
                This process ensures your voting power is accurately represented.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="binding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="binding">Address Binding</TabsTrigger>
          <TabsTrigger value="manage">Manage Addresses</TabsTrigger>
          <TabsTrigger value="verification">Verification Status</TabsTrigger>
        </TabsList>

        {/* Address Binding Tab */}
        <TabsContent value="binding" className="space-y-6">
          {/* Process Overview */}
          <Card className="enhanced-card border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-medium text-blue-800">How Address Binding Works</h3>
                  <p className="text-sm text-blue-700">
                    Address binding links your on-chain CKB addresses to your off-chain DAO identity. 
                    This allows you to vote using your CKB holdings while maintaining a user-friendly experience.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                      <p className="text-xs text-blue-700">Setup WebAuthn Security</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                      <p className="text-xs text-blue-700">Get API Key</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                      <p className="text-xs text-blue-700">Connect Wallet</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: WebAuthn Setup */}
          <Card className="enhanced-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${webAuthnEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {webAuthnEnabled ? <CheckCircle2 className="h-4 w-4" /> : '1'}
                </div>
                <span>WebAuthn Security Setup</span>
                {webAuthnEnabled && <Badge className="bg-green-100 text-green-800">Completed</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                WebAuthn provides secure authentication using your device's built-in security features 
                (fingerprint, Face ID, hardware keys). This creates a secure connection between your device and your DAO account.
              </p>
              
              {!webAuthnEnabled ? (
                <div className="space-y-3">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your browser supports WebAuthn. Click below to set up secure authentication.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={enableWebAuthn} className="bg-[#00d4aa] hover:bg-[#00b894]">
                    <Shield className="h-4 w-4 mr-2" />
                    Enable WebAuthn
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">WebAuthn Enabled</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Your device security is now linked to your DAO account.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: API Key Generation */}
          <Card className="enhanced-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${webAuthnEnabled ? 'bg-[#00d4aa] text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {webAuthnEnabled ? <CheckCircle2 className="h-4 w-4" /> : '2'}
                </div>
                <span>API Key for Wallet Integration</span>
                {webAuthnEnabled && <Badge className="bg-blue-100 text-blue-800">Available</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {webAuthnEnabled ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    This API key allows supported wallets to connect directly to your DAO account. 
                    Copy this key and paste it into your wallet's DAO binding feature.
                  </p>
                  
                  <div className="space-y-3">
                    <Label htmlFor="apiKey">Your DAO API Key</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="apiKey"
                        type={showApiKey ? "text" : "password"}
                        value={mockApiKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(mockApiKey)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Keep this API key secure. Anyone with access to it can bind addresses to your account.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate Key
                    </Button>
                    <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Revoke Key
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Complete WebAuthn setup first to generate your API key.</p>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Wallet Instructions */}
          <Card className="enhanced-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <span>Connect Your Wallet</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Use your API key in a supported wallet to bind your CKB addresses. 
                The wallet will guide you through selecting addresses and generating the required signatures.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Supported Wallets</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Neuron Wallet</span>
                      <Badge variant="secondary">Full Support</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">JoyID</span>
                      <Badge variant="secondary">Full Support</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CKB CLI</span>
                      <Badge variant="outline">Manual Process</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Manual Binding</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    For unsupported wallets, you can manually bind addresses using transaction signatures.
                  </p>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Manual Binding Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Addresses Tab */}
        <TabsContent value="manage" className="space-y-6">
          <Card className="enhanced-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Linked Addresses</span>
                <div className="text-sm text-gray-500">
                  Total Voting Power: <span className="font-bold text-[#00d4aa]">1,234.56 CKB</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAddresses.map((addr, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <Wallet className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-mono text-sm font-medium">{addr.address}</p>
                          {addr.primary && <Badge variant="secondary">Primary</Badge>}
                          <Badge 
                            className={
                              addr.status === 'verified' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }
                          >
                            {addr.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Balance: {addr.balance}</span>
                          <span>Bound: {new Date(addr.bindingDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!addr.primary && (
                        <Button variant="outline" size="sm">
                          Set Primary
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <Button className="bg-[#00d4aa] hover:bg-[#00b894]">
                  <Wallet className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Status Tab */}
        <TabsContent value="verification" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Security Status */}
            <Card className="enhanced-card">
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">WebAuthn Enabled</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">API Key Generated</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Valid</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Addresses Verified</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">2 of 3</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Voting Power Breakdown */}
            <Card className="enhanced-card">
              <CardHeader>
                <CardTitle>Voting Power Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Nervos DAO Locked</span>
                    <span className="font-medium">800.00 CKB</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Unlocked CKB (Aged)</span>
                    <span className="font-medium">434.56 CKB</span>
                  </div>
                  <Progress value={35} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Verification</span>
                    <span className="font-medium text-orange-600">0.00 CKB</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Voting Power</span>
                    <span className="font-bold text-[#00d4aa]">1,234.56 CKB</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Rank #23 among all DAO members
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="enhanced-card">
            <CardHeader>
              <CardTitle>Recent Binding Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium">Address ckb1qyq...a2b3c4 verified</p>
                    <p className="text-sm text-gray-500">January 20, 2024</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Key className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">API key regenerated</p>
                    <p className="text-sm text-gray-500">January 19, 2024</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-[#00d4aa]" />
                  <div className="flex-1">
                    <p className="font-medium">WebAuthn security enabled</p>
                    <p className="text-sm text-gray-500">January 15, 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 