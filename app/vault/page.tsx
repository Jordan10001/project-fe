"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CreateVaultModal } from "@/components/create-vault-modal"
import { DeleteVaultModal } from "@/components/delete-vault-modal"
import { LogoutConfirmationModal } from "@/components/logout-confirmation-modal"
import { VaultList } from "@/components/vault-list"
import { VaultPageHeader } from "@/components/vault-page-header"
import { fetchVaults, createVault, deleteVault, type Vault } from "@/lib/api/vaults"

export default function VaultsPage() {
  const router = useRouter()
  const [vaults, setVaults] = useState<Vault[]>([])
  const [loading, setLoading] = useState(false)
  const [ownerId, setOwnerId] = useState<string>("")
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openLogoutModal, setOpenLogoutModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedVaultForDelete, setSelectedVaultForDelete] = useState<string | null>(null)

  // Initialize owner ID and load vaults
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check for user_id in URL params first
    const params = new URLSearchParams(window.location.search)
    const incomingUserId = params.get("user_id")

    if (incomingUserId) {
      localStorage.setItem("user_id", incomingUserId)
      setOwnerId(incomingUserId)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
      loadVaults(incomingUserId)
    } else {
      // Fall back to localStorage
      const savedOwnerId = localStorage.getItem("user_id")
      if (savedOwnerId) {
        setOwnerId(savedOwnerId)
        loadVaults(savedOwnerId)
      }
    }
  }, [])

  async function loadVaults(ownerIdToUse: string) {
    if (!ownerIdToUse) {
      setVaults([])
      return
    }
    setLoading(true)
    try {
      const data = await fetchVaults(ownerIdToUse)
      setVaults(data)
    } catch (e) {
      console.error("Failed to load vaults:", e)
      alert(e instanceof Error ? e.message : "Failed to load vaults")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(name: string, description: string) {
    if (!ownerId) {
      throw new Error(
        "Cannot create vault: you must be logged in. Please login first."
      )
    }

    try {
      const created = await createVault(ownerId, name, description)
      setVaults((prev) => [created, ...prev])
    } catch (e) {
      console.error("Create vault failed:", e)
      alert(e instanceof Error ? e.message : "Failed to create vault")
      throw e
    }
  }

  function handleDeleteClick(vaultId: string) {
    setSelectedVaultForDelete(vaultId)
    setOpenDeleteModal(true)
  }

  async function handleConfirmDelete() {
    if (!selectedVaultForDelete) return

    try {
      await deleteVault(selectedVaultForDelete)
      setOpenDeleteModal(false)
      setSelectedVaultForDelete(null)
      await loadVaults(ownerId)
    } catch (e) {
      console.error("Delete vault failed:", e)
      alert(e instanceof Error ? e.message : "Failed to delete vault")
    }
  }

  function handleConfirmLogout() {
    // Clear localStorage
    localStorage.removeItem("user_id")

    // Redirect to login
    setOpenLogoutModal(false)
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <VaultPageHeader
          onCreateVault={() => setOpenCreateModal(true)}
          onLogout={() => setOpenLogoutModal(true)}
        />

        <div className="mt-6 sm:mt-8">
          {loading && (
            <div className="text-center py-12 sm:py-16">
              <p className="text-sm sm:text-base text-muted-foreground">
                Loading...
              </p>
            </div>
          )}

          {!loading && (
            <VaultList
              vaults={vaults}
              loading={loading}
              onDeleteVault={handleDeleteClick}
            />
          )}
        </div>

        <CreateVaultModal
          open={openCreateModal}
          onOpenChange={setOpenCreateModal}
          onCreateVault={handleCreate}
          isLoading={loading}
        />

        <LogoutConfirmationModal
          open={openLogoutModal}
          onOpenChange={setOpenLogoutModal}
          onConfirmLogout={handleConfirmLogout}
          isLoading={loading}
        />

        <DeleteVaultModal
          open={openDeleteModal}
          onOpenChange={setOpenDeleteModal}
          onConfirmDelete={handleConfirmDelete}
          isLoading={loading}
        />
      </div>
    </div>
  )
}
