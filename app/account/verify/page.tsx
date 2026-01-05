"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { verifyEmail } from "@/lib/actions/verify"
import { Loader2 } from "lucide-react"

export default function VerifyPage() {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()

  const onSubmit = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError("Missing token!")
      return
    }

    verifyEmail(token)
      .then((data) => {
        if (data.error) {
          setError(data.error)
          router.push("/account/verify/error")
        }

        if (data.success) {
          setSuccess(data.success)
          router.push("/account/verify/success")
        }
      })
      .catch(() => {
        setError("Something went wrong!")
        router.push("/account/verify/error")
      })
  }, [token, success, error, router])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Verifying your email...</p>
      </div>
    </div>
  )
}
