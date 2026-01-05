import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gray-50">
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        
        <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8 text-black" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight mb-3">Check your email</h1>
        <p className="text-black/60 mb-8 leading-relaxed">
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>

        <div className="space-y-4">
          <Button variant="outline" asChild className="w-full h-11 border-black/10 hover:bg-black/5 font-medium rounded-lg cursor-pointer transition-colors">
            <Link href="/account/login">
              RETURN TO LOGIN
            </Link>
          </Button>

          <div className="text-center text-xs text-black/30">
             Didn't receive the email? Check your spam folder or{" "}
            <Link href="/contact" className="underline hover:text-black/60">Contact Support</Link>.
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-black/40 text-xs">
            <p>Verification link expires in 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
