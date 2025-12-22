import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TruckIcon, Shield, Sparkles, Instagram } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Newsletter } from "@/components/newsletter"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      name: "Signature Oversized Tee",
      price: 45000,
      originalPrice: 65000,
      image: "/black-oversized-tee-luxury-streetwear.jpg",
      category: "Essentials",
      badge: "NEW",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: "Premium Cargo Pants",
      price: 85000,
      image: "/black-cargo-streetwear.png",
      category: "Bottoms",
      badge: "TRENDING",
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 3,
      name: "Statement Hoodie",
      price: 95000,
      originalPrice: 120000,
      image: "/black-hoodie-luxury-street-fashion.jpg",
      category: "Tops",
      badge: "SALE",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 4,
      name: "Essential Track Jacket",
      price: 120000,
      image: "/black-track-jacket-modern-streetwear.jpg",
      category: "Outerwear",
      rating: 4.6,
      reviews: 73,
    },
    {
      id: 5,
      name: "Urban Bomber Jacket",
      price: 145000,
      image: "/black-bomber-streetwear.png",
      category: "Outerwear",
      badge: "EXCLUSIVE",
      rating: 4.9,
      reviews: 45,
    },
    {
      id: 6,
      name: "Classic Joggers",
      price: 65000,
      image: "/black-joggers-streetwear.jpg",
      category: "Bottoms",
      rating: 4.5,
      reviews: 198,
    },
    {
      id: 7,
      name: "Graphic Crewneck",
      price: 55000,
      originalPrice: 75000,
      image: "/black-crewneck-graphic-streetwear.jpg",
      category: "Essentials",
      badge: "SALE",
      rating: 4.8,
      reviews: 142,
    },
    {
      id: 8,
      name: "Premium Windbreaker",
      price: 135000,
      image: "/black-windbreaker-premium-streetwear.jpg",
      category: "Outerwear",
      badge: "NEW",
      rating: 4.7,
      reviews: 67,
    },
  ]

  const collections = [
    {
      title: "WINTER ESSENTIALS",
      description: "Premium hoodies, jackets, and layering pieces for the cold season",
      image: "/winter-streetwear-collection-black.jpg",
      link: "/collections/winter",
    },
    {
      title: "STREET CLASSICS",
      description: "Timeless streetwear staples that never go out of style",
      image: "/classic-streetwear-black-white.jpg",
      link: "/collections/classics",
    },
    {
      title: "PREMIUM OUTERWEAR",
      description: "Luxury jackets and coats crafted for maximum style and comfort",
      image: "/luxury-outerwear-black-streetwear.jpg",
      link: "/collections/outerwear",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-100 via-white to-neutral-50">
        <div className="absolute inset-0 opacity-[0.07]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/luxury-streetwear-model-black-clothing-urban-fashi.jpg')",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="inline-block mb-6 px-4 py-2 bg-black text-white text-xs tracking-[0.3em] font-semibold rounded-full">
            SPRING/SUMMER 2025
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tighter text-balance leading-[0.95]">
            WEAR YOUR
            <br />
            CONFIDENCE
          </h1>
          <p className="text-lg md:text-xl text-black/70 mb-12 max-w-2xl mx-auto text-balance leading-relaxed">
            Eddie Originals brings you premium streetwear designed for the bold, the confident, and those who refuse to
            blend in. Every piece tells a story of quality, style, and attitude.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-black text-white hover:bg-black/90 text-sm tracking-wider px-10 h-14 font-semibold"
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
              className="border-2 border-black text-black hover:bg-black hover:text-white text-sm tracking-wider px-10 h-14 font-semibold bg-transparent"
            >
              <Link href="/about">DISCOVER OUR STORY</Link>
            </Button>
          </div>
        </div>


      </section>

      {/* Trust Badges */}
      <section className="py-16 border-y border-black/10 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center">
                  <TruckIcon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide mb-1">FREE SHIPPING</h3>
                <p className="text-xs text-black/60 leading-relaxed">On orders over ₦50,000</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide mb-1">SECURE PAYMENT</h3>
                <p className="text-xs text-black/60 leading-relaxed">100% secure transactions</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide mb-1">PREMIUM QUALITY</h3>
                <p className="text-xs text-black/60 leading-relaxed">Crafted with excellence</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide mb-1">EASY RETURNS</h3>
                <p className="text-xs text-black/60 leading-relaxed">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1 bg-black/5 text-black text-xs tracking-[0.25em] font-semibold rounded-full">
              NEW ARRIVALS
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 text-balance">
              Fresh Drops, Bold Looks
            </h2>
            <p className="text-lg text-black/60 max-w-2xl mx-auto leading-relaxed text-balance">
              Discover our latest collection of premium streetwear. Each piece is designed to make a statement and
              elevate your wardrobe with confidence and style.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-black text-black hover:bg-black hover:text-white font-semibold tracking-wide px-12 bg-transparent"
            >
              <Link href="/shop">
                VIEW ALL PRODUCTS
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-32 px-6 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-6 px-4 py-1 bg-white/10 text-white text-xs tracking-[0.25em] font-semibold rounded-full">
                OUR STORY
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight text-balance leading-tight">
                More Than Just Clothing. It's Identity.
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-6 text-balance">
                Eddie Originals was born from a simple belief: your clothes should reflect who you are. Founded in
                Lagos, Nigeria, we create luxury streetwear that blends bold design with premium craftsmanship.
              </p>
              <p className="text-lg text-white/70 leading-relaxed mb-8 text-balance">
                Every piece in our collection is carefully designed for those who move differently, think boldly, and
                dress with purpose. We don't follow trends—we create them.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-white text-black hover:bg-white/90 font-semibold tracking-wide px-10"
              >
                <Link href="/about">
                  READ OUR STORY
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              <img
                src="/luxury-streetwear-fashion-editorial-black-and-whit.jpg"
                alt="Eddie Originals Brand"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1 bg-black/5 text-black text-xs tracking-[0.25em] font-semibold rounded-full">
              COLLECTIONS
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 text-balance">
              Curated For You
            </h2>
            <p className="text-lg text-black/60 max-w-2xl mx-auto leading-relaxed text-balance">
              Explore our carefully curated collections, each telling a unique story through premium fabrics, bold
              designs, and timeless style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <Link
                key={index}
                href={collection.link}
                className="group relative h-[500px] rounded-xl overflow-hidden bg-black"
              >
                <img
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">{collection.title}</h3>
                  <p className="text-white/80 mb-6 text-balance leading-relaxed">{collection.description}</p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide group-hover:gap-4 transition-all">
                    EXPLORE COLLECTION
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1 bg-black/5 text-black text-xs tracking-[0.25em] font-semibold rounded-full">
              TESTIMONIALS
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 text-balance">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Chidi Okafor",
                role: "Creative Director",
                content:
                  "Eddie Originals has completely transformed my wardrobe. The quality is unmatched, and every piece I wear gets compliments. This is what premium streetwear should be.",
                rating: 5,
              },
              {
                name: "Amara Johnson",
                role: "Fashion Blogger",
                content:
                  "I've been wearing Eddie Originals for months now, and I'm obsessed. The designs are bold, the fit is perfect, and the confidence boost is real. 10/10 recommend!",
                rating: 5,
              },
              {
                name: "Tunde Adeyemi",
                role: "Entrepreneur",
                content:
                  "Finally found a brand that understands luxury streetwear. Eddie Originals delivers on quality, style, and exclusivity. Worth every naira.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-neutral-50 p-8 rounded-xl border border-black/5">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-black/80 mb-6 leading-relaxed text-balance">{testimonial.content}</p>
                <div>
                  <div className="font-bold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-black/50">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* Instagram Feed */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Follow Us @eddieoriginals</h2>
            <p className="text-lg text-black/60">Join the community and see how others style Eddie Originals</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Link
                key={i}
                href="https://instagram.com/eddieoriginals"
                target="_blank"
                className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden group"
              >
                <img
                  src={`/streetwear-instagram-post-.jpg?height=400&width=400&query=streetwear+instagram+post+${i}`}
                  alt={`Instagram post ${i}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              asChild
              className="bg-black text-white hover:bg-black/90 font-semibold tracking-wide px-10"
            >
              <Link href="https://instagram.com/eddieoriginals" target="_blank">
                <Instagram className="mr-2 h-5 w-5" />
                FOLLOW US ON INSTAGRAM
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
