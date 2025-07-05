"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  Moon, 
  Sun, 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from "lucide-react"
import { useState } from "react"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/representatives": "Representatives", 
  "/proposals": "Proposals",
  "/dao-explorer": "DAO Explorer",
  "/communication": "Communication",
  "/dao-rules": "DAO Rules",
  "/submit-proposal": "Submit Proposal",
  "/create-poll": "Create Poll",
  "/apply-representative": "Apply as Representative",
  "/profile": "Profile",
  "/address-binding": "Address Binding"
}

// Mock user data for prototype
const mockUser = {
  name: "John Dao",
  email: "john.dao@example.com",
  avatar: "/placeholder-user.jpg",
  verifications: {
    kyc: { verified: true, provider: "Civic" },
    telegram: { verified: true, username: "@johndao" },
    did: { verified: false, identifier: null },
    addresses: 3
  },
  votingPower: "1,234.56 CKB",
  delegations: 2
}

export function Header() {
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] || "CKB DAO"
  const [isDark, setIsDark] = useState(false)

  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-white px-4 lg:px-6 shadow-sm">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-800 md:text-xl">{pageTitle}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="h-9 w-9"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="bg-[#00d4aa] text-white">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{mockUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {mockUser.email}
                </p>
              </div>
            </div>
            
            {/* Verification Status */}
            <div className="px-2 py-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">Verification Status</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    KYC Verified
                  </span>
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {mockUser.verifications.kyc.provider}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Telegram Linked
                  </span>
                  <span className="text-muted-foreground">
                    {mockUser.verifications.telegram.username}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-orange-500" />
                    DID Pending
                  </span>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-[#00d4aa]">
                    Setup
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="px-2 py-2 border-t">
              <div className="text-xs font-medium text-muted-foreground mb-2">Quick Stats</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="font-medium">Voting Power</div>
                  <div className="text-muted-foreground">{mockUser.votingPower}</div>
                </div>
                <div>
                  <div className="font-medium">Addresses</div>
                  <div className="text-muted-foreground">{mockUser.verifications.addresses} linked</div>
                </div>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href="/address-binding" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                <span>Address Binding</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
