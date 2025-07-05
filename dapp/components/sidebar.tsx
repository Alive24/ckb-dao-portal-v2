"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  Search,
  MessageSquare,
  BookOpen,
  Menu,
  Plus,
  Vote,
  User
} from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Representatives",
    href: "/representatives",
    icon: Users,
  },
  {
    name: "Proposals",
    href: "/proposals",
    icon: FileText,
  },
  {
    name: "DAO Explorer",
    href: "/dao-explorer",
    icon: Search,
  },
  {
    name: "Communication",
    href: "/communication",
    icon: MessageSquare,
  },
  {
    name: "DAO Rules",
    href: "/dao-rules",
    icon: BookOpen,
  },
]

const actionButtons = [
  {
    name: "Submit Proposal",
    href: "/submit-proposal",
    icon: Plus,
    variant: "outline" as const,
  },
  {
    name: "Create Poll",
    href: "/create-poll",
    icon: Vote,
    variant: "outline" as const,
  },
]

function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-gray-200 px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00d4aa] text-white font-bold text-lg">
            C
          </div>
          <div>
            <div className="text-lg font-bold">CKB DAO</div>
            <div className="text-xs text-gray-600">v2.0</div>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-gray-900 hover:bg-gray-100",
                  pathname === item.href && "bg-[#00d4aa] text-white font-medium"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        {/* Action Buttons Section */}
        <div className="mt-6 px-2 lg:px-4">
          <div className="text-xs font-medium text-gray-500 mb-2 px-3">ACTIONS</div>
          <div className="space-y-2">
            {actionButtons.map((button) => {
              const Icon = button.icon
              const isActive = pathname === button.href
              return (
                <Button
                  key={button.name}
                  asChild
                  variant="outline"
                  className={cn(
                    "w-full justify-start gap-3 h-auto py-2.5",
                    isActive 
                      ? "bg-[#00d4aa] text-white border-[#00d4aa] hover:bg-[#00b894] hover:border-[#00b894]"
                      : "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
                  )}
                >
                  <Link href={button.href}>
                    <Icon className="h-4 w-4" />
                    {button.name}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="hidden md:block sidebar-gradient">
        <div className="flex h-full max-h-screen flex-col">
          <SidebarContent />
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 sidebar-gradient">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
