"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

    if (!isValidEmail) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          toast({
            title: "Already Subscribed",
            description: "You are already on our newsletter list!",
            variant: "default",
          })
          setEmail("")
          return
        }
        throw new Error(data.error || "Failed to subscribe")
      }

      toast({
        title: "Success",
        description: "You have been subscribed to our newsletter.",
      })
      setEmail("")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again."
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 md:py-32 px-4 md:px-6 bg-white text-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tighter text-balance">JOIN THE MOVEMENT</h2>
        <p className="text-base md:text-lg text-black/60 mb-8 md:mb-12 max-w-2xl mx-auto text-balance">
          Subscribe to get special offers, free giveaways, and exclusive drops.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto w-full">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-black/20 text-black placeholder:text-black/40 focus:border-black h-12 w-full"
              required
            />
            <Button
              type="submit"
              className="bg-black text-white hover:bg-black/90 h-12 px-8 tracking-wider whitespace-nowrap w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              SUBSCRIBE
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
