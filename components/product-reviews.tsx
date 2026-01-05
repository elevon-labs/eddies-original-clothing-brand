"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Lock, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock Data
interface Review {
  id: string
  user: {
    name: string | null
    image: string | null
  }
  rating: number
  createdAt: string
  title: string | null
  content: string
}

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isWriting, setIsWriting] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, title: "", content: "" })
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  useEffect(() => {
    async function fetchReviews() {
      if (!productId) return
      try {
        const res = await fetch(`/api/products/${productId}/reviews`)
        if (res.ok) {
          const data = await res.json()
          setReviews(data)
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReviews()
  }, [productId])

  // Stats
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0"
  
  const totalReviews = reviews.length
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length
  }))

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newReview.title || !newReview.content) {
      toast({
        title: "Missing fields",
        description: "Please provide a title and review content.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingReview(true)
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      })

      if (!res.ok) throw new Error("Failed to submit review")

      const savedReview = await res.json()
      
      // Add user details for immediate display (API might return review without user join initially if we just return the insert result, 
      // but usually we want to re-fetch or construct it manually. 
      // The API returns `newReview[0]` which is just the review row. 
      // We need to attach user info to update UI optimistically or fetch again.
      // Let's construct it manually for UI update.)
      
      const reviewWithUser: Review = {
        ...savedReview,
        user: {
          name: session?.user?.name || "User",
          image: session?.user?.image || null,
        }
      }

      setReviews([reviewWithUser, ...reviews])
      setCurrentPage(1)
      setIsWriting(false)
      setNewReview({ rating: 5, title: "", content: "" })
      
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your feedback!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  if (!session) {
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
                <span className="text-5xl font-bold tracking-tighter">{averageRating}</span>
                <span className="text-neutral-500 font-medium">/ 5</span>
              </div>
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(Number(averageRating)) ? "fill-black text-black" : "text-black/10"
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
          </div>

          {/* Locked State */}
          <div className="md:col-span-8 lg:col-span-9 relative">
            <div className="space-y-8 opacity-30 blur-[2px] pointer-events-none select-none" aria-hidden="true">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-black/5 pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-neutral-200"></div>
                      <div>
                        <div className="h-4 w-28 bg-neutral-200 rounded mb-2"></div>
                        <div className="h-3 w-20 bg-neutral-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="h-16 bg-neutral-100 rounded"></div>
                </div>
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-0">
              <div className="bg-white/90 backdrop-blur-md border border-black/10 p-8 sm:p-10 md:p-12 rounded-3xl shadow-xl text-center w-full max-w-md">
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

  return (
    <section className="py-12 border-t border-black/10" id="reviews">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Reviews ({totalReviews})</h2>
        {!isWriting && (
          <Button onClick={() => setIsWriting(true)} className="bg-black text-white hover:bg-black/80">
            Write a Review
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-12 gap-12">
        {/* Rating Summary */}
        <div className="md:col-span-4 lg:col-span-3 space-y-8">
          <div className="bg-neutral-50 p-6 rounded-2xl sticky top-24">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold tracking-tighter">{averageRating}</span>
              <span className="text-neutral-500 font-medium">/ 5</span>
            </div>
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(Number(averageRating)) ? "fill-black text-black" : "text-black/10"
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
                      style={{ width: totalReviews > 0 ? `${(item.count / totalReviews) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="w-8 text-right text-neutral-400">
                    {totalReviews > 0 ? Math.round((item.count / totalReviews) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List & Form */}
        <div className="md:col-span-8 lg:col-span-9 space-y-8">
          
          {/* Write Review Form */}
          {isWriting && (
            <div className="bg-neutral-50 p-6 rounded-2xl border border-black/5 animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Write your review</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsWriting(false)}>Cancel</Button>
              </div>
              
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="focus:outline-none transition-transform hover:scale-110"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= (hoveredStar || newReview.rating)
                              ? "fill-black text-black"
                              : "text-black/10"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input 
                    placeholder="Summarize your experience" 
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="bg-white"
                    disabled={isSubmittingReview}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Review</label>
                  <Textarea 
                    placeholder="What did you like or dislike? How was the fit?" 
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    className="min-h-[120px] bg-white"
                    disabled={isSubmittingReview}
                  />
                </div>

                <Button type="submit" className="w-full bg-black text-white hover:bg-black/80" disabled={isSubmittingReview}>
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting review...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-8">
            {reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((review) => (
              <div key={review.id} className="border-b border-black/5 pb-8 last:border-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-black/10">
                      <AvatarImage src={review.user.image || undefined} />
                      <AvatarFallback className="bg-neutral-100 font-medium">
                        {review.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-sm">{review.user.name || "Anonymous User"}</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < review.rating ? "fill-black text-black" : "text-black/10"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-neutral-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h5 className="font-bold mb-2">{review.title}</h5>
                <p className="text-neutral-600 leading-relaxed text-sm mb-4">
                  {review.content}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span className="text-neutral-400">Verified Purchase</span>
                </div>
              </div>
            ))}
          </div>
          
          {reviews.length > pageSize && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-neutral-500">
                Page {currentPage} of {Math.ceil(reviews.length / pageSize)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(Math.ceil(reviews.length / pageSize), p + 1)
                    )
                  }
                  disabled={currentPage >= Math.ceil(reviews.length / pageSize)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
