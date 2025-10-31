"use client"

import { useState, useEffect } from "react"
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

type Credential = {
  id: string
  vault_id: string
  username: string
  password: string
  url?: string
}

interface EditCredentialModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  credential: Credential
  onUpdateCredential: (
    credentialId: string,
    username: string,
    password: string,
    url: string
  ) => Promise<void>
  isLoading?: boolean
}

export function EditCredentialModal({
  open,
  onOpenChange,
  credential,
  onUpdateCredential,
  isLoading = false,
}: EditCredentialModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [url, setUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Initialize form with credential data when modal opens
  useEffect(() => {
    if (open && credential) {
      setUsername(credential.username)
      setPassword(credential.password)
      setUrl(credential.url || "")
    }
  }, [open, credential])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      alert("Please fill in all required fields (username, password)")
      return
    }

    setSubmitting(true)
    try {
      await onUpdateCredential(credential.id, username, password, url)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating credential:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            Edit Credential
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Update this credential's information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <label htmlFor="edit-cred-username" className="text-xs sm:text-sm font-medium">
              Username *
            </label>
            <Input
              id="edit-cred-username"
              placeholder="e.g., user@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting || isLoading}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-cred-password" className="text-xs sm:text-sm font-medium">
              Password *
            </label>
            <Input
              id="edit-cred-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting || isLoading}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-cred-url" className="text-xs sm:text-sm font-medium">
              URL (Optional)
            </label>
            <Input
              id="edit-cred-url"
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
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
