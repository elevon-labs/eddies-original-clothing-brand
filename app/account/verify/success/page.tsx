import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function VerificationSuccessPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gray-50">
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight mb-3">Account Verified!</h1>
        <p className="text-black/60 mb-8 leading-relaxed">
          Your email has been successfully verified. You can now access all features of your Eddie Originals account.
        </p>

        <div className="space-y-4">
          <Button asChild className="w-full h-11 bg-black hover:bg-black/80 text-white font-medium rounded-lg cursor-pointer transition-colors">
            <Link href="/account/login">
              CONTINUE TO LOGIN
            </Link>
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-black/40 text-xs">
            <p>Thank you for joining Eddie Originals.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
