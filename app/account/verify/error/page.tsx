import Link from "next/link"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function VerificationErrorPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/urban-streetwear-fashion-model-leaning-on-wall.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 blur-sm scale-110 grayscale"
        />
        <div className="absolute inset-0 bg-white/60 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-md w-full bg-white p-8 md:p-12 rounded-[32px] shadow-2xl text-center overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-600" />

        {/* Centered Logo Branding */}
        <div className="flex flex-col items-center mb-8 mt-4">
          <Link href="/" className="group flex flex-col items-center gap-3 transition-opacity hover:opacity-80">
            <div className="p-1 border border-black/10 rounded-full">
              <img 
                src="/logo.jpg" 
                alt="Eddie Originals" 
                className="h-16 w-16 rounded-full object-cover" 
              />
            </div>
            <span className="font-bold tracking-widest text-lg uppercase text-black">EDDIE ORIGINALS</span>
          </Link>
        </div>

        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-3">Verification Failed</h1>
        <p className="text-black/60 mb-8 leading-relaxed">
          We couldn't verify your email address. The link may have expired or is invalid. Please try again or contact support.
        </p>

        <div className="space-y-3">
          <Button className="w-full h-12 bg-black hover:bg-black/70 text-white font-medium tracking-wide rounded-lg cursor-pointer transition-colors">
            RESEND VERIFICATION EMAIL
          </Button>

          <div className="text-center text-xs text-black/30 mt-2 mb-2">
            <Link href="/privacy-policy" className="underline hover:text-black/60">Privacy Policy</Link>{" "}
            &bull;{" "}
            <Link href="/terms" className="underline hover:text-black/60">Terms</Link>
          </div>
          
          <Button variant="outline" asChild className="w-full h-12 border-black/10 hover:bg-black/5 font-medium rounded-lg cursor-pointer transition-colors">
            <Link href="/contact">
              CONTACT SUPPORT
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm space-y-4">
          <div>
            <Link href="/account/login" className="font-medium text-black hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
