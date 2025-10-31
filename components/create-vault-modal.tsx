"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface CreateVaultModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateVault: (name: string, description: string) => Promise<void>
  isLoading?: boolean
}

export function CreateVaultModal({
  open,
  onOpenChange,
  onCreateVault,
  isLoading = false,
}: CreateVaultModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      alert("Please enter a vault name")
      return
    }

    setSubmitting(true)
    try {
      await onCreateVault(name, description)
      setName("")
      setDescription("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating vault:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            Create New Vault
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Add a new vault to store your secrets
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="vault-name"
              className="text-xs sm:text-sm font-medium"
            >
              Vault Name
            </label>
            <Input
              id="vault-name"
              placeholder="e.g., Production Secrets"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting || isLoading}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="vault-description"
              className="text-xs sm:text-sm font-medium"
            >
              Description
            </label>
            <Textarea
              id="vault-description"
              placeholder="e.g., Secrets for production environment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              disabled={submitting || isLoading || !name.trim()}
              className="w-full sm:w-36"
            >
              {submitting ? "Creating..." : "Create Vault"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
