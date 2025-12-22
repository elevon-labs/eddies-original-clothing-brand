import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function VerificationSuccessPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/luxury-streetwear-fashion-editorial-black-and-whit.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 blur-sm scale-110 grayscale"
        />
        <div className="absolute inset-0 bg-white/60 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-md w-full bg-white p-8 md:p-12 rounded-[32px] shadow-2xl text-center overflow-hidden">
         {/* Decorative background element */}
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-green-600" />
         
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

        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-3">Account Verified!</h1>
        <p className="text-black/60 mb-8 leading-relaxed">
          Your email has been successfully verified. You can now access all features of your Eddie Originals account.
        </p>

        <Button asChild className="w-full h-12 bg-black hover:bg-black/70 text-white font-medium tracking-wide rounded-lg cursor-pointer transition-colors">
          <Link href="/account/login">
            CONTINUE TO LOGIN
          </Link>
        </Button>

        <div className="text-center text-xs text-black/30 mt-4 mb-4">
          <Link href="/privacy-policy" className="underline hover:text-black/60">Privacy Policy</Link>{" "}
          &bull;{" "}
          <Link href="/terms" className="underline hover:text-black/60">Terms</Link>
        </div>
      </div>
    </div>
  )
}
