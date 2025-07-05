import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Shield, 
  Heart, 
  Target, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Upload,
  ExternalLink,
  Star
} from "lucide-react"
import Link from "next/link"

// Requirements from documentation
const representativeRequirements = [
  "Active participation in the CKB ecosystem",
  "Demonstrated commitment to community governance",
  "Technical understanding of blockchain and CKB",
  "Ability to review and evaluate proposals",
  "Time commitment for DAO participation",
  "Strong communication and interpersonal skills"
]

export default function ApplyRepresentativePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="enhanced-card">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#00d4aa]/20 rounded-full flex items-center justify-center mx-auto">
              <User className="h-8 w-8 text-[#00d4aa]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Apply as Representative</h1>
              <p className="text-gray-600 max-w-2xl mx-auto mt-2">
                Become a community representative and help shape the future of the CKB DAO. 
                Representatives are elected community members who vote on behalf of delegating token holders.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="enhanced-card border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-blue-800">What is a Representative?</h3>
              <p className="text-sm text-blue-700">
                Representatives are community members who take a more active role in DAO governance. 
                Other community members can delegate their voting power to representatives they trust. 
                There is no formal approval process - you declare yourself as a representative and market 
                yourself to gain delegate votes.
              </p>
              <div className="flex items-center space-x-4 text-xs text-blue-600">
                <Link href="/dao-rules" className="flex items-center space-x-1 hover:text-blue-800">
                  <ExternalLink className="h-3 w-3" />
                  <span>Read DAO Rules</span>
                </Link>
                <Link href="/representatives" className="flex items-center space-x-1 hover:text-blue-800">
                  <ExternalLink className="h-3 w-3" />
                  <span>View Current Representatives</span>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Check */}
      <Card className="enhanced-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-[#00d4aa]" />
            <span>Representative Requirements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Please review the requirements below. While these are not strict requirements, 
            they represent the qualities that make successful representatives.
          </p>
          <div className="grid gap-3">
            {representativeRequirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full border-2 border-[#00d4aa] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#00d4aa]"></div>
                </div>
                <span className="text-sm text-gray-700">{requirement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <form className="space-y-6">
        {/* Basic Information */}
        <Card className="enhanced-card">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" placeholder="Enter your full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input id="displayName" placeholder="How you want to be known" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" placeholder="your@email.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biography *</Label>
              <Textarea 
                id="bio" 
                placeholder="Tell us about yourself, your background, and your experience with blockchain/governance..."
                className="min-h-[100px]"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gray-100">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values and Vision */}
        <Card className="enhanced-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-[#00d4aa]" />
              <span>Values and Vision</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="values">Core Values *</Label>
              <Textarea 
                id="values" 
                placeholder="Describe your core values and what principles guide your decision-making..."
                className="min-h-[80px]"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vision">Vision for CKB DAO *</Label>
              <Textarea 
                id="vision" 
                placeholder="What is your vision for the future of the CKB DAO and ecosystem?"
                className="min-h-[80px]"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priorities">Key Priorities</Label>
              <Textarea 
                id="priorities" 
                placeholder="What areas would you focus on as a representative? (e.g., DeFi development, education, community growth...)"
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Experience and Qualifications */}
        <Card className="enhanced-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-[#00d4aa]" />
              <span>Experience and Qualifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Relevant Experience *</Label>
              <Textarea 
                id="experience" 
                placeholder="Describe your experience with blockchain, governance, community management, or related fields..."
                className="min-h-[100px]"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ckbInvolvement">CKB Ecosystem Involvement</Label>
              <Textarea 
                id="ckbInvolvement" 
                placeholder="How have you been involved with the CKB ecosystem? (development, community participation, etc.)"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="daoExperience">DAO Experience</Label>
              <RadioGroup defaultValue="none" className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="extensive" id="extensive" />
                  <Label htmlFor="extensive" className="text-sm">Extensive - I've been active in multiple DAOs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="some" id="some" />
                  <Label htmlFor="some" className="text-sm">Some - I've participated in 1-2 DAOs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="limited" />
                  <Label htmlFor="limited" className="text-sm">Limited - This is my first DAO experience</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeCommitment">Time Commitment</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="How much time can you dedicate weekly?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-5">2-5 hours per week</SelectItem>
                  <SelectItem value="5-10">5-10 hours per week</SelectItem>
                  <SelectItem value="10-20">10-20 hours per week</SelectItem>
                  <SelectItem value="20+">20+ hours per week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contact and Verification */}
        <Card className="enhanced-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-[#00d4aa]" />
              <span>Contact and Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram Username</Label>
                <Input id="telegram" placeholder="@username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X Handle</Label>
                <Input id="twitter" placeholder="@handle" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Personal Website/LinkedIn</Label>
              <Input id="website" placeholder="https://" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input id="location" placeholder="City, Country" />
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-800">KYC Verification Recommended</h4>
                  <p className="text-sm text-orange-700">
                    While not mandatory, KYC verification is strongly recommended for representatives 
                    to build trust with the community. You can complete this process after submission.
                  </p>
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    Start KYC Process
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card className="enhanced-card">
          <CardHeader>
            <CardTitle>Terms and Acknowledgments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox id="understand" className="mt-1" />
                <Label htmlFor="understand" className="text-sm leading-relaxed">
                  I understand that being a representative is a voluntary role and there is no guaranteed compensation 
                  beyond specific DAO tasks I may be assigned.
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox id="commitment" className="mt-1" />
                <Label htmlFor="commitment" className="text-sm leading-relaxed">
                  I commit to acting in the best interests of the CKB DAO and the community members who delegate to me.
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox id="transparency" className="mt-1" />
                <Label htmlFor="transparency" className="text-sm leading-relaxed">
                  I agree to maintain transparency in my voting decisions and provide rationale for my votes when requested.
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox id="rules" className="mt-1" />
                <Label htmlFor="rules" className="text-sm leading-relaxed">
                  I have read and agree to follow the{" "}
                  <Link href="/dao-rules" className="text-[#00d4aa] hover:underline">
                    DAO Rules and Constitution
                  </Link>
                  .
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Card className="enhanced-card">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-800">Ready to Apply?</h3>
                <p className="text-sm text-gray-600">
                  Your application will be published to the community for review. You can edit your profile at any time.
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <Button variant="outline" size="lg">
                  Save as Draft
                </Button>
                <Button size="lg" className="bg-[#00d4aa] hover:bg-[#00b894]">
                  Submit Application
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                By submitting, you agree to make your profile public for community members to review and consider for delegation.
              </p>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
} 