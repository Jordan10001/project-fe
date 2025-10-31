"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = params.get("token")
    const userId = params.get("user_id")
    if (userId) {
      try {
        localStorage.setItem("user_id", userId)
        
      } catch (e) {
        console.error(e)
      }
    }
    // If token or user_id present, redirect to vaults page
    if (token || userId) {
      router.replace("/vault")
    }
  }, [params, router])

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-3 sm:p-6 md:p-10">
      <div className="w-full max-w-sm px-2">
        <LoginForm />
      </div>
    </div>
  )
}
