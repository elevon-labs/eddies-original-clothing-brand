import Link from "next/link"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function VerificationErrorPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gray-50">
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight mb-3">Verification Failed</h1>
        <p className="text-black/60 mb-8 leading-relaxed">
          We couldn't verify your email address. The link may have expired or is invalid. Please try again or contact support.
        </p>

        <div className="space-y-3">
          <Button asChild className="w-full h-11 bg-black hover:bg-black/80 text-white font-medium rounded-lg cursor-pointer transition-colors">
            <Link href="/account/login">
              RETURN TO LOGIN
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full h-11 border-black/10 hover:bg-black/5 font-medium rounded-lg cursor-pointer transition-colors">
            <Link href="/contact">
              CONTACT SUPPORT
            </Link>
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-black/40 text-xs">
            <p>Please try logging in again to request a new verification link.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
