"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import Image from "next/image"

import { AccountPolicyInfo } from "@/components/account-policy-info"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Password validation rules
    const passwordSchema = z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9!@#$%^&*]/, "Password must contain at least one number or special character")

    try {
      passwordSchema.parse(password)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Weak Password",
          description: error.errors[0].message,
          variant: "destructive",
        })
        return
      }
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      })

      router.push("/account/check-email")
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
      <div className="absolute inset-0 z-0">
        <Image 
          src="/luxury-streetwear-model-black-clothing-urban-fashi.jpg" 
          alt="Background" 
          fill
          sizes="100vw"
          className="object-cover opacity-30 blur-sm scale-110 grayscale"
          priority={false}
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
                      <Image 
                        src="/logo.jpg" 
                        alt="Eddie Originals" 
                        width={48}
                        height={48}
                        className="rounded-full object-cover" 
                        priority={false}
                      />
                    </div>
                    <span className="font-bold tracking-widest text-base uppercase text-black">EDDIE ORIGINALS</span>
                  </Link>
                </div>

                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-bold tracking-tighter mb-2">Create Account</h1>
                  <p className="text-base text-black/60 leading-relaxed">
                    Join Eddie Originals today.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-semibold text-black ml-1">Full Name</Label>
                    <Input  
                      id="name" 
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-11 border-black/10 focus-visible:ring-black bg-neutral-50 text-black placeholder:text-black/50 text-base"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-semibold text-black ml-1">Email Address</Label>
                    <Input 
                      id="email" 
                      placeholder="name@example.com" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 border-black/10 focus-visible:ring-black bg-neutral-50 text-base"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-sm font-semibold text-black ml-1">Password</Label>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-11 border-black/10 focus-visible:ring-black bg-neutral-50 pr-8 text-black placeholder:text-black/50 text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirm-password" className="text-sm font-semibold text-black ml-1">Confirm</Label>
                      <div className="relative">
                        <Input 
                          id="confirm-password" 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="h-11 border-black/10 focus-visible:ring-black bg-neutral-50 pr-8 text-black placeholder:text-black/50 text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button disabled={loading} className="w-full h-11 bg-black hover:bg-black/70 text-white font-medium tracking-wide rounded-lg cursor-pointer transition-colors text-base mt-2">
                    {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                  </Button>
                </form>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full bg-black/5" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-black/40 font-medium">Or sign up with</span>
                    </div>
                  </div>

                  <Button variant="outline" onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full h-11 border-black/10 hover:bg-black/5 hover:text-black font-medium rounded-lg text-base">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                </div>

                <div className="text-center text-sm text-black/60 mt-6">
                  Already have an account?{" "}
                  <Link href="/account/login" className="font-semibold text-black hover:underline">
                    Log in
                  </Link>
                </div>

                <div className="text-center text-xs text-black/30 mt-4">
                  By continuing, you agree to our{" "}
                  <Link href="/privacy-policy" className="underline hover:text-black/60">Privacy Policy</Link>{" "}
                  and{" "}
                  <Link href="/terms" className="underline hover:text-black/60">Terms of Service</Link>.
                </div>

                 <div className="mt-4 text-center">
                   <Link href="/" className="text-xs font-medium text-black/40 hover:text-black transition-colors uppercase tracking-wider">
                      Back to Store
                    </Link>
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
