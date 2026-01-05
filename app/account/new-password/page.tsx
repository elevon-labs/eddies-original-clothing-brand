"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9!@#$%^&*]/, "Password must contain at least one number or special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>

function NewPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
  })

  const onSubmit = async (data: NewPasswordFormValues) => {
    if (!token) {
      toast.error("Error", { description: "Missing token!" })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/new-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: data.password,
          token,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong")
      }

      toast.success("Success", {
        description: "Password updated successfully!",
      })
      
      router.push("/account/login")
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center text-red-500">
        Missing or invalid token. Please request a new password reset link.
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
        <p className="text-sm text-gray-500">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            disabled={isLoading}
            className={`h-11 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            disabled={isLoading}
            className={`h-11 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 bg-black text-white hover:bg-black/90 rounded-none"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              RESETTING...
            </>
          ) : (
            "RESET PASSWORD"
          )}
        </Button>
      </form>
    </div>
  )
}

export default function NewPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <NewPasswordForm />
      </Suspense>
    </div>
  )
}
