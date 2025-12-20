"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Contact form submitted:", formData)
    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      <div className="pt-8 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">Get In Touch</h1>
            <p className="text-lg text-black/60 max-w-2xl mx-auto">
              Have questions about our products, need styling advice, or want to collaborate? We'd love to hear from
              you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="h-12"
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
                    className="h-12"
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
                    className="h-12"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold tracking-wider mb-2">
                    MESSAGE
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more..."
                    required
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-black text-white hover:bg-black/90 font-semibold tracking-wide h-14"
                >
                  SEND MESSAGE
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-neutral-50 p-8 rounded-lg border border-black/5 mb-8">
                <h2 className="text-2xl font-bold mb-6 tracking-tight">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <p className="text-black/60">info@eddieoriginals.com</p>
                      <p className="text-black/60">support@eddieoriginals.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Phone</h3>
                      <p className="text-black/60">+234 XXX XXX XXXX</p>
                      <p className="text-sm text-black/50">Mon-Fri: 9AM - 6PM WAT</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Location</h3>
                      <p className="text-black/60">Lagos, Nigeria</p>
                      <p className="text-sm text-black/50">Shipping worldwide</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black text-white p-8 rounded-lg">
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
                    <Link href="https://instagram.com/eddieoriginals" target="_blank">
                      <Instagram className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="text-white border-white/20 hover:bg-white/10 bg-transparent"
                  >
                    <Link href="https://twitter.com/eddieoriginals" target="_blank">
                      <Twitter className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="text-white border-white/20 hover:bg-white/10 bg-transparent"
                  >
                    <Link href="https://facebook.com/eddieoriginals" target="_blank">
                      <Facebook className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
