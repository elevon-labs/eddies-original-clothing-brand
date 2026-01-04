import { Shield, Sparkles, RotateCcw } from "lucide-react"

export function AccountPolicyInfo() {
  return (
    <div className="bg-neutral-50 p-8 md:p-12 flex flex-col justify-center h-full border-l border-black/5">
      <div className="space-y-10">
        <div>
           <h3 className="font-bold text-lg mb-6 tracking-tight text-black">Why Shop With Us?</h3>
           <p className="text-black/70 mb-8">Experience luxury streetwear defined by quality, exclusivity, and bold identity.</p>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2.5 rounded-full border border-black/10 bg-transparent">
            <Shield className="h-5 w-5 text-black" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide mb-1 text-black">SECURE PAYMENT</h3>
            <p className="text-sm text-black/60 leading-relaxed">100% secure transactions with top-tier encryption.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2.5 rounded-full border border-black/10 bg-transparent">
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide mb-1 text-black">PREMIUM QUALITY</h3>
            <p className="text-sm text-black/60 leading-relaxed">Crafted with excellence using the finest materials.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2.5 rounded-full border border-black/10 bg-transparent">
            <RotateCcw className="h-5 w-5 text-black" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide mb-1 text-black">NO REFUND POLICY</h3>
            <p className="text-sm text-black/60 leading-relaxed">All sales are final. Please review your order carefully.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
