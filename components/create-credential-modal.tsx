"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface CreateCredentialModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateCredential: (
    username: string,
    password: string,
    url: string
  ) => Promise<void>
  isLoading?: boolean
}

export function CreateCredentialModal({
  open,
  onOpenChange,
  onCreateCredential,
  isLoading = false,
}: CreateCredentialModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [url, setUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      alert("Please fill in all required fields (username, password)")
      return
    }

    setSubmitting(true)
    try {
      await onCreateCredential(username, password, url)
      setUsername("")
      setPassword("")
      setUrl("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating credential:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            Add New Credential
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Create a new credential for this vault
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <label htmlFor="cred-username" className="text-xs sm:text-sm font-medium">
              Username *
            </label>
            <Input
              id="cred-username"
              placeholder="e.g., user@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting || isLoading}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cred-password" className="text-xs sm:text-sm font-medium">
              Password *
            </label>
            <Input
              id="cred-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting || isLoading}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cred-url" className="text-xs sm:text-sm font-medium">
              URL (Optional)
            </label>
            <Input
              id="cred-url"
              type="url"
              placeholder="e.g., https://gmail.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={submitting || isLoading}
              className="text-sm"
            />
          </div>

          <DialogFooter className="gap-2 flex-col-reverse sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting || isLoading}
              className="w-full sm:w-36"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                submitting ||
                isLoading ||
                !username.trim() ||
                !password.trim()
              }
              className="w-full sm:w-36"
            >
              {submitting ? "Creating..." : "Add Credential"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
