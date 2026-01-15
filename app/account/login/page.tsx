"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Suspense, useState, useEffect } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { resendVerificationEmail } from "@/lib/actions/verify"

import { AccountPolicyInfo } from "@/components/account-policy-info"

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [verificationNeeded, setVerificationNeeded] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setVerificationNeeded(false)

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        if (res.error === "Please verify your email address before logging in.") {
          setVerificationNeeded(true)
          toast({
            title: "Verification Required",
            description: res.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: "Invalid email or password",
            variant: "destructive",
          })
        }
      } else {
        const callbackUrl = searchParams.get("callbackUrl") || "/"
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onResendVerification = async () => {
    try {
      const res = await resendVerificationEmail(email)
      if (res.error) {
         toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Email Sent",
          description: "Check your inbox for the verification link.",
        })
        setVerificationNeeded(false)
      }
    } catch {
       toast({
        title: "Error",
        description: "Failed to send email.",
        variant: "destructive",
      })
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

                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-bold tracking-tighter mb-2">Welcome Back</h1>
                  <p className="text-base text-black/60 leading-relaxed">
                    Enter your details to access your account.
                  </p>
                </div>

                <div className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-semibold text-black ml-1">Email Address</Label>
                      <Input 
                        id="email" 
                        placeholder="name@example.com" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11 border-black/10 focus-visible:ring-black bg-neutral-50 text-black placeholder:text-black/50 text-base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between ml-1">
                        <Label htmlFor="password" className="text-sm font-semibold text-black">Password</Label>
                        <Link 
                          href="/account/forgot-password"  
                          className="text-xs font-medium text-black/60 hover:text-black hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-11 border-black/10 focus-visible:ring-black bg-neutral-50 pr-10 text-black placeholder:text-black/50 text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button disabled={loading} className="w-full h-11 bg-black hover:bg-black/70 text-white font-medium tracking-wide rounded-lg cursor-pointer transition-colors text-base mt-2">
                    {loading ? "SIGNING IN..." : "SIGN IN"}
                  </Button>
                </form>
                  
                {verificationNeeded && (
                  <Button 
                    variant="outline" 
                    onClick={onResendVerification}
                    className="w-full h-11 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-medium rounded-lg text-base"
                  >
                    Resend Verification Email
                  </Button>
                )}
                </div>

                <div className="text-center text-sm text-black/60 mt-6">
                  Don't have an account?{" "}
                  <Link href="/account/signup" className="font-semibold text-black hover:underline">
                    Sign up
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-black"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
