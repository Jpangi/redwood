"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, TrendingUp, Receipt, Target, BarChart3, Wallet, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/wealth", icon: TrendingUp, label: "Wealth" },
  { href: "/accounts", icon: Wallet, label: "Accounts" },
  { href: "/transactions", icon: Receipt, label: "Transactions" },
  { href: "/budgets", icon: Target, label: "Budgets" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
]

export function Navigation() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:left-auto md:top-0 md:bottom-auto md:w-20 md:border-t-0 md:border-r md:flex md:flex-col md:justify-between">
      <div className="flex justify-around md:flex-col md:items-center md:py-4 md:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 px-4 transition-colors md:w-full md:py-3 md:rounded-lg md:mx-2",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
      <div className="hidden md:block md:pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => logout()}
          className="w-full flex flex-col items-center gap-1 py-3 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-6 w-6" />
          <span className="text-xs font-medium">Logout</span>
        </Button>
      </div>
    </nav>
  )
}
