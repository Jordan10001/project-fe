"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Vault } from "@/lib/api/vaults"

interface VaultListProps {
  vaults: Vault[]
  loading: boolean
  onDeleteVault: (vaultId: string) => void
}

export function VaultList({ vaults, loading, onDeleteVault }: VaultListProps) {
  const router = useRouter()

  return (
    <div className="w-full">
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {vaults.map((vault) => (
          <Card
            key={vault.id}
            className="p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              // Store vault data in sessionStorage before navigating
              if (typeof window !== "undefined") {
                sessionStorage.setItem(`vault_${vault.id}`, JSON.stringify(vault))
              }
              router.push(`/vault/${vault.id}`)
            }}
          >
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm sm:text-base truncate">
                    {vault.name}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {vault.description}
                  </div>
                </div>
                <div className="shrink-0">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteVault(vault.id)
                    }}
                    className="w-full sm:w-auto"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && vaults.length === 0 && (
        <div className="text-center py-8 sm:py-12 text-muted-foreground">
          <p className="text-sm sm:text-base">
            No vaults yet. Create one to get started!
          </p>
        </div>
      )}
    </div>
  )
}
