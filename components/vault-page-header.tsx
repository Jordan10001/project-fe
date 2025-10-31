"use client"

import { Button } from "@/components/ui/button"

interface VaultPageHeaderProps {
  onCreateVault: () => void
  onLogout: () => void
}

export function VaultPageHeader({
  onCreateVault,
  onLogout,
}: VaultPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Vaults</h2>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <Button 
          onClick={onCreateVault}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          <span className="hidden sm:inline">+ Create Vault</span>
          <span className="sm:hidden">+ Add</span>
        </Button>
        <Button 
          variant="destructive" 
          onClick={onLogout}
          className="w-full sm:w-auto order-1 sm:order-2"
        >
          Logout
        </Button>
      </div>
    </div>
  )
}
