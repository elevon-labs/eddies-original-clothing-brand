"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Newsletter signup:", email)
    // Handle newsletter signup
    setEmail("")
  }

  return (
    <section className="py-32 px-6 bg-white text-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-balance">JOIN THE MOVEMENT</h2>
        <p className="text-lg text-black/60 mb-12 max-w-2xl mx-auto text-balance">
          Subscribe to get special offers, free giveaways, and exclusive drops.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border-black/20 text-black placeholder:text-black/40 focus:border-black h-12"
            required
          />
          <Button
            type="submit"
            className="bg-black text-white hover:bg-black/90 h-12 px-8 tracking-wider whitespace-nowrap"
          >
            SUBSCRIBE
          </Button>
        </form>
      </div>
    </section>
  )
}
