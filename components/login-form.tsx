"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  function handleGoogleLogin() {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_BASE}/auth/google`;
  }

  return (
    <div className={cn("flex flex-col gap-4 sm:gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-lg">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Sign in
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
              Sign in using your Google account
            </p>
            <Button 
              onClick={handleGoogleLogin} 
              className="mt-3 sm:mt-4 w-full sm:w-auto min-w-[180px]"
              size="lg"
            >
              Login with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
