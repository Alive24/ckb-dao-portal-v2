"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Shield,
  Key,
  Globe,
  Copy,
  Download,
  ExternalLink,
  CheckCircle,
  QrCode
} from "lucide-react"
import Link from "next/link"

export default function DIDSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [didDocument, setDidDocument] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState("")

  const steps = [
    { number: 1, title: "Create DID Document", description: "Generate your unique decentralized identifier" },
    { number: 2, title: "Link Verifications", description: "Connect your existing KYC and Telegram verifications" },
    { number: 3, title: "Publish & Verify", description: "Publish to decentralized network and complete setup" }
  ]

  const handleCreateDID = async () => {
    setIsLoading(true)
    // Simulate DID creation
    setTimeout(() => {
      setDidDocument("did:ckb:1234567890abcdef1234567890abcdef12345678")
      setIsLoading(false)
      setCurrentStep(2)
    }, 2000)
  }

  const handleLinkVerifications = async () => {
    setIsLoading(true)
    // Simulate verification linking
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep(3)
    }, 1500)
  }

  const handlePublishDID = async () => {
    setIsLoading(true)
    // Simulate publishing to network
    setTimeout(() => {
      setIsLoading(false)
      // Could redirect to profile or show success message
    }, 2000)
  }

  // Mock user data for context
  const mockUser = {
    pubkey: "0x8e4d2c5f7a9b3c6e8d1f2a5b8c9e0d3f6a7b4c5d8e1f2a5b8c9e0d3f6a7b4c5d",
    metadata: {
      name: "John Dao",
      email: "john.dao@example.com"
    },
    verifications: {
      kyc: { verified: true, provider: "Civic" },
      telegram: { verified: false, username: null }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">DID Setup</h1>
            <p className="text-gray-600">Complete your decentralized identity verification</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep > step.number
                        ? "bg-green-500 border-green-500 text-white"
                        : currentStep === step.number
                        ? "bg-[#00d4aa] border-[#00d4aa] text-white"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.number}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${currentStep >= step.number ? "text-gray-800" : "text-gray-500"}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 max-w-[120px]">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-[#00d4aa]" />
              <span>Create DID Document</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your DID (Decentralized Identifier) will be generated using cryptographic keys and published to the CKB network.
                This creates a permanent, verifiable identity that you control.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Create Your Decentralized Identity</h2>
                <p className="text-gray-600 mt-2">
                  We'll create a DID tied to your public key for secure, verifiable identity
                </p>
              </div>

              {/* User Context */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900">Identity Foundation</h3>
                    <p className="text-sm text-blue-700">Your DID will be cryptographically linked to your public key</p>
                  </div>
                </div>
                <div className="bg-white rounded border p-3">
                  <div className="text-xs text-gray-600 mb-1">Primary Identity (Public Key)</div>
                  <div className="font-mono text-sm break-all text-gray-800">
                    {mockUser.pubkey}
                  </div>
                </div>
                <div className="mt-3 text-xs text-blue-600">
                  ✓ Display Name: {mockUser.metadata.name} | ✓ Email: {mockUser.metadata.email}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="did-name">DID Name (Optional)</Label>
                  <Input 
                    id="did-name" 
                    placeholder="Enter a memorable name for your DID"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">This helps you identify your DID in the future</p>
                </div>

                <div>
                  <Label>Key Generation Method</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="hardware" name="keyMethod" defaultChecked className="rounded" />
                      <label htmlFor="hardware" className="text-sm">Hardware Security Key (Recommended)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="software" name="keyMethod" className="rounded" />
                      <label htmlFor="software" className="text-sm">Software Generated</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Cryptographic key pair will be generated</li>
                <li>• DID document will be created with your public key</li>
                <li>• Document will be prepared for network publication</li>
                <li>• You'll receive your unique DID identifier</li>
              </ul>
            </div>

            <Button 
              onClick={handleCreateDID} 
              className="w-full bg-[#00d4aa] hover:bg-[#00b896] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating DID...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Create DID Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-[#00d4aa]" />
              <span>Link Existing Verifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>DID Created Successfully!</strong> Your DID: <code className="bg-gray-100 px-1 rounded">{didDocument}</code>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h4 className="font-medium">Available Verifications</h4>
              
              {/* KYC Verification */}
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800">KYC Verification</div>
                      <div className="text-sm text-green-600">Civic • Verified 1/20/2024</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Ready to Link</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Link your KYC verification to your DID for enhanced trust and compliance.
                </p>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="link-kyc" defaultChecked className="rounded" />
                  <label htmlFor="link-kyc" className="text-sm">Include KYC verification in DID</label>
                </div>
              </div>

              {/* Telegram Verification */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-800">Telegram Account</div>
                      <div className="text-sm text-blue-600">@johndao • Linked 1/16/2024</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Ready to Link</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Link your Telegram account to enable DID-based notifications and community features.
                </p>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="link-telegram" defaultChecked className="rounded" />
                  <label htmlFor="link-telegram" className="text-sm">Include Telegram verification in DID</label>
                </div>
              </div>

              {/* Address Binding */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-800">Address Bindings</div>
                      <div className="text-sm text-gray-600">3 addresses • 1,234.56 CKB total</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Auto-Linked</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Your verified CKB addresses will be automatically linked to your DID.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Privacy Notice</h4>
              <p className="text-sm text-yellow-700">
                Your DID will only contain public verification proofs. Private information remains encrypted 
                and under your control. You can revoke access at any time.
              </p>
            </div>

            <Button 
              onClick={handleLinkVerifications} 
              className="w-full bg-[#00d4aa] hover:bg-[#00b896] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Linking Verifications...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Link Verifications
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-[#00d4aa]" />
              <span>Publish & Verify</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Verifications linked successfully! Ready to publish your DID to the decentralized network.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label>Network Publication</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">CKB Network</span>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    Your DID will be published to the CKB blockchain for permanent verification
                  </p>
                </div>
              </div>

              <div>
                <Label>Final Verification Code</Label>
                <div className="mt-2 space-y-2">
                  <Input 
                    placeholder="Enter verification code from your authenticator app"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Use your Telegram bot or hardware security key to generate the verification code
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">DID Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">DID:</span>
                    <span className="font-mono">{didDocument}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Linked Verifications:</span>
                    <span>KYC, Telegram, 3 Addresses</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <span>CKB Mainnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Gas:</span>
                    <span>~0.1 CKB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  const didData = JSON.stringify({
                    did: didDocument,
                    verifications: ["KYC", "Telegram"],
                    addresses: 3,
                    created: new Date().toISOString()
                  }, null, 2)
                  const blob = new Blob([didData], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'did-backup.json'
                  a.click()
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Backup DID
              </Button>
              <Button 
                onClick={handlePublishDID} 
                className="flex-1 bg-[#00d4aa] hover:bg-[#00b896] text-white"
                disabled={isLoading || !verificationCode}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Publish DID
                  </>
                )}
              </Button>
            </div>

            {isLoading && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Publishing your DID to the CKB network... This may take a few moments.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Help & Resources */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <QrCode className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium text-sm">DID Documentation</div>
                <div className="text-xs text-gray-500">Learn about decentralized identity</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ExternalLink className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium text-sm">CKB Network Info</div>
                <div className="text-xs text-gray-500">View network status and fees</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium text-sm">Security Best Practices</div>
                <div className="text-xs text-gray-500">Keep your identity secure</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 