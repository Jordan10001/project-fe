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

interface LogoutConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmLogout: () => void
  isLoading?: boolean
}

export function LogoutConfirmationModal({
  open,
  onOpenChange,
  onConfirmLogout,
  isLoading = false,
}: LogoutConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Logout
          </DialogTitle>
          <DialogDescription className="text-sm">
            Are you sure you want to logout?
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
            onClick={onConfirmLogout}
            disabled={isLoading}
            className="w-full sm:w-36"
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
