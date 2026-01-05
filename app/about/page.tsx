import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* Hero */}
      <section className="pt-20 pb-32 px-6 bg-gradient-to-br from-neutral-100 via-white to-neutral-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1 bg-black text-white text-xs tracking-[0.25em] font-semibold rounded-full">
            OUR STORY
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-8 tracking-tighter text-balance leading-[0.95]">
            More Than Clothing.
            <br />
            It's Identity.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-black/70 leading-relaxed text-balance max-w-3xl mx-auto">
            Eddie Originals is a luxury streetwear brand built on confidence, creativity, and presence. Every piece
            tells a story of quality, style, and bold expression.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              <img
                src="/luxury-streetwear-fashion-editorial-black-and-whit.jpg"
                alt="Eddie Originals Story"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Born from Lagos, Designed for the World
              </h2>
              <div className="space-y-4 text-base sm:text-lg text-black/70 leading-relaxed">
                <p>
                  Eddie Originals was born from a simple belief: your clothes should reflect who you are. Founded in
                  Ejigbo, Lagos Nigeria, we create luxury streetwear that blends bold design with premium craftsmanship.
                </p>
                <p>
                  Every piece in our collection is carefully designed for those who move differently, think boldly, and
                  dress with purpose. We don't follow trends—we create them.
                </p>
                <p>
                  Our commitment to quality means every garment is crafted with the finest materials, attention to
                  detail, and a dedication to excellence that you can feel the moment you put it on.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">For Those Who Stand Out</h2>
              <div className="space-y-4 text-base sm:text-lg text-black/70 leading-relaxed">
                <p>
                  Eddie Originals represents individuals who know who they are and don't need permission to express it.
                  Our designs balance bold street energy with premium quality.
                </p>
                <p>
                  We believe fashion is more than what you wear—it's how you carry yourself, how you move through the
                  world, and how you make others feel. Our pieces are designed to elevate your confidence and amplify
                  your presence.
                </p>
                <p>
                  Join a community of creatives, innovators, and tastemakers who refuse to blend in. This is streetwear
                  with substance. This is Eddie Originals.
                </p>
              </div>
            </div>
            <div className="relative h-[600px] rounded-2xl overflow-hidden order-1 md:order-2">
              <img
                src="/luxury-streetwear-model-black-clothing-urban-fashi.jpg"
                alt="Eddie Originals Community"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">Our Values</h2>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">The principles that guide everything we create</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <span className="text-3xl">🔥</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Quality First</h3>
              <p className="text-white/70 leading-relaxed">
                Every piece is crafted with premium materials and meticulous attention to detail. No compromises.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Bold Design</h3>
              <p className="text-white/70 leading-relaxed">
                We create pieces that make statements. Streetwear that demands attention and commands respect.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Authenticity</h3>
              <p className="text-white/70 leading-relaxed">
                We stay true to our vision and our community. Real products for real people who refuse to follow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight text-balance">
            Ready to Join the Movement?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-black/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Explore our collection and discover pieces that reflect your confidence, style, and identity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-black text-white hover:bg-black/90 font-semibold tracking-wide px-10 h-14"
            >
              <Link href="/shop">
                SHOP COLLECTION
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-black text-black hover:bg-black hover:text-white font-semibold tracking-wide px-10 h-14 bg-transparent"
            >
              <Link href="/contact">CONTACT US</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
