"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"

import { AccountPolicyInfo } from "@/components/account-policy-info"

export default function ForgotPasswordPage() {
  // Ensure content is visible/centered on mobile mount
  useEffect(() => {
    // Small delay to ensure render is complete before scrolling
    const timer = setTimeout(() => {
      const scrollContainer = document.getElementById('scroll-container');
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {/* Fixed Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/black-hoodie-luxury-street-fashion.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 blur-sm scale-110 grayscale"
        />
        <div className="absolute inset-0 bg-white/60 mix-blend-overlay" />
      </div>

      {/* Scrollable Container - Hides scrollbar & prevents X overflow */}
      <div 
        id="scroll-container"
        className="absolute inset-0 z-10 w-full h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      >
        {/* Inner Layout Wrapper - Provides height and centering */}
        <div className="w-full min-h-[120vh] flex flex-col items-center justify-center p-4 py-24 relative">
          
          {/* Main Card Container */}
          <div className="w-full max-w-[1000px] bg-white rounded-[24px] shadow-2xl overflow-hidden shrink-0 grid grid-cols-1 md:grid-cols-2">
            
            <div className="flex flex-col w-full p-8 md:p-12">
              
              <div className="flex-1 flex flex-col justify-center w-full max-w-sm mx-auto">
                {/* Centered Logo Branding */}
                <div className="flex flex-col items-center mb-6">
                  <Link href="/" className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-80">
                    <div className="p-0.5 border border-black/10 rounded-full">
                      <img 
                        src="/logo.jpg" 
                        alt="Eddie Originals" 
                        className="h-12 w-12 rounded-full object-cover" 
                      />
                    </div>
                    <span className="font-bold tracking-widest text-base uppercase text-black">EDDIE ORIGINALS</span>
                  </Link>
                </div>

                <Link 
                  href="/account/login" 
                  className="inline-flex items-center justify-center text-xs font-medium text-black/60 hover:text-black mb-6 transition-colors"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Back to Login
                </Link>
                
                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-bold tracking-tighter mb-2">Recover Access</h1>
                  <p className="text-base text-black/60 leading-relaxed">
                    Enter your email address to reset your password.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-semibold text-black ml-1">Email Address</Label>
                    <Input 
                      id="email" 
                      placeholder="name@example.com" 
                      type="email"
                      className="h-11 border-black/10 focus-visible:ring-black bg-neutral-50 text-black placeholder:text-black/50 text-base"
                    />
                  </div>

                  <Button className="w-full h-11 bg-black hover:bg-black/70 text-white font-medium tracking-wide rounded-lg cursor-pointer transition-colors text-base mt-2">
                    SEND RESET LINK
                  </Button>

                  <div className="text-center text-sm text-black/30 mt-4">
                    By continuing, you agree to our{" "}
                    <Link href="/privacy-policy" className="underline hover:text-black/60">Privacy Policy</Link>{" "}
                    and{" "}
                    <Link href="/terms" className="underline hover:text-black/60">Terms of Service</Link>.
                  </div>
                </div>
                
                 <div className="mt-4 text-center">
                   <Link href="/" className="text-xs font-medium text-black/40 hover:text-black transition-colors uppercase tracking-wider">
                      Back to Store
                    </Link>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <AccountPolicyInfo />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
