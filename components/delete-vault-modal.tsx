"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteVaultModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDelete: () => Promise<void>
  isLoading?: boolean
}

export function DeleteVaultModal({
  open,
  onOpenChange,
  onConfirmDelete,
  isLoading = false,
}: DeleteVaultModalProps) {
  const handleDelete = async () => {
    try {
      await onConfirmDelete()
    } catch (error) {
      console.error("Error deleting vault:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Delete Vault
          </DialogTitle>
          <DialogDescription className="text-sm">
            Are you sure you want to delete this vault? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 flex-col-reverse sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-36"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-36"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
