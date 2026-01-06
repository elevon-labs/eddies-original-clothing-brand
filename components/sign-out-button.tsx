"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start h-10 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut className="mr-3 h-4 w-4" />
      Log out
    </Button>
  )
}
