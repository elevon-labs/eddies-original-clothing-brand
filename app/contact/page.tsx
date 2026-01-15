"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Instagram, Loader2 } from "lucide-react"
import { TikTok } from "@/components/icons"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Failed to submit")
      
      toast({
        title: "Message sent",
        description: "Thank you for contacting us. We'll get back to you soon.",
      })
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      
      <div className="pt-8 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 lg:mb-16 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 tracking-tighter">Get In Touch</h1>
            <p className="text-base sm:text-lg text-black/60 max-w-2xl mx-auto">
              Have questions about our products, need styling advice, or want to collaborate? We'd love to hear from
              you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 min-w-0">
            {/* Contact Form */}
            <div className="w-full max-w-xl mx-auto min-w-0">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold tracking-wider mb-2">
                    NAME
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold tracking-wider mb-2">
                    EMAIL
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-bold tracking-wider mb-2">
                    SUBJECT
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="What is this about?"
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label htmlFor="message" className="block text-sm font-bold tracking-wider mb-2">
                    MESSAGE
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more..."
                    required
                    className="resize-none flex-1 min-h-[200px] text-base"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-black text-white hover:bg-black/90 font-semibold tracking-wide h-14"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  SEND MESSAGE
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="w-full max-w-xl mx-auto mt-10 lg:mt-0 min-w-0">
              <div className="bg-neutral-50 p-6 lg:p-8 rounded-lg border border-black/5 mb-8">
                <h2 className="text-2xl font-bold mb-6 tracking-tight">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold mb-1">Email</h3>
                      <p className="text-black/60 break-words">eddieorginalsdepartement@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold mb-1">Phone</h3>
                      <p className="text-black/60 break-words">+234 907 430 9055</p>
                      <p className="text-sm text-black/50">Mon-Fri: 9AM - 6PM WAT</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Location</h3>
                      <p className="text-black/60">Ejigbo, Lagos Nigeria</p>
                      <p className="text-sm text-black/50">Shipping worldwide</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black text-white p-6 lg:p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 tracking-tight">Follow Us</h2>
                <p className="text-white/70 mb-6">
                  Stay connected with us on social media for the latest drops, exclusive content, and community vibes.
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="text-white border-white/20 hover:bg-white/10 bg-transparent"
                  >
                    <Link href="https://instagram.com/eddie_originals_" target="_blank">
                      <Instagram className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="text-white border-white/20 hover:bg-white/10 bg-transparent"
                  >
                    <Link href="https://tiktok.com/@eddie_originals" target="_blank">
                      <TikTok className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
