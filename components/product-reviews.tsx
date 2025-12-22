"use client"

import { Star, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ProductReviews() {
  // Mock data for the "glimpse"
  const rating = 4.8
  const totalReviews = 124
  const ratingDistribution = [
    { stars: 5, count: 85 },
    { stars: 4, count: 25 },
    { stars: 3, count: 10 },
    { stars: 2, count: 3 },
    { stars: 1, count: 1 },
  ]

  return (
    <section className="py-12 border-t border-black/10" id="reviews">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Reviews ({totalReviews})</h2>
      </div>

      <div className="grid md:grid-cols-12 gap-12">
        {/* Rating Summary - Always Visible */}
        <div className="md:col-span-4 lg:col-span-3 space-y-8">
          <div className="bg-neutral-50 p-6 rounded-2xl">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold tracking-tighter">{rating}</span>
              <span className="text-neutral-500 font-medium">/ 5</span>
            </div>
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(rating) ? "fill-black text-black" : "text-black/10"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-neutral-500 mb-6">
              Based on {totalReviews} verified reviews
            </p>

            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-3 font-medium">{item.stars}</span>
                  <Star className="h-3 w-3 fill-black text-black" />
                  <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black rounded-full" 
                      style={{ width: `${(item.count / totalReviews) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-neutral-400">{Math.round((item.count / totalReviews) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center p-6 border border-dashed border-black/20 rounded-2xl">
            <p className="text-sm font-medium mb-4">Own this product?</p>
            <Button className="w-full bg-black text-white" disabled>
              Write a Review
            </Button>
            <p className="text-[10px] text-neutral-400 mt-2">
              Login required to submit reviews
            </p>
          </div>
        </div>

        {/* Reviews List - Locked State */}
        <div className="md:col-span-8 lg:col-span-9 relative">
          
          {/* Blurred/Mock Content */}
          <div className="space-y-6 opacity-30 blur-[2px] pointer-events-none select-none" aria-hidden="true">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-black/5 pb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-neutral-400" />
                    </div>
                    <div>
                      <div className="h-4 w-24 bg-neutral-200 rounded mb-1"></div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="h-3 w-3 fill-black text-black" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-3 w-20 bg-neutral-100 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-neutral-100 rounded"></div>
                  <div className="h-4 w-3/4 bg-neutral-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Locked Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white/90 backdrop-blur-md border border-black/10 p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-md mx-4">
              <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Unlock Reviews</h3>
              <p className="text-neutral-500 mb-8 leading-relaxed">
                Join the Eddie Originals community to view full reviews, ratings, and share your own experience.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/account/login">
                  <Button className="w-full h-12 bg-black text-white hover:bg-black/80 rounded-xl text-base">
                    Sign In
                  </Button>
                </Link>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-neutral-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/90 px-2 text-neutral-500">New to Eddie Originals?</span>
                  </div>
                </div>
                <Link href="/account/signup">
                  <Button variant="outline" className="w-full h-12 bg-white text-black border-black/20 hover:bg-neutral-50 hover:text-black rounded-xl text-base">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
