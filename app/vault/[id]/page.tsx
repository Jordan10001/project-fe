"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CreateCredentialModal } from "@/components/create-credential-modal"
import { EditCredentialModal } from "@/components/edit-credential-modal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

type Credential = {
  id: string
  vault_id: string
  username: string
  password: string
  url?: string
  created_at?: string
  updated_at?: string
}

type Vault = {
  id: string
  owner_user_id: string
  name: string
  description: string
}

export default function VaultDetailPage() {
  const router = useRouter()
  const params = useParams()
  const vaultId = params.id as string

  const [vault, setVault] = useState<Vault | null>(null)
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null)
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedCredentialForDelete, setSelectedCredentialForDelete] = useState<string | null>(null)

  // Initialize vault data from sessionStorage or fetch from API
  useEffect(() => {
    if (typeof window === "undefined") return
    
    // Try to get vault data from sessionStorage first (passed from vault list page)
    const storedVault = sessionStorage.getItem(`vault_${vaultId}`)
    if (storedVault) {
      try {
        const vaultData = JSON.parse(storedVault)
        setVault(vaultData)
        sessionStorage.removeItem(`vault_${vaultId}`) // Clean up after use
      } catch (e) {
        console.error("Failed to parse vault data:", e)
      }
    } else {
      // If no stored vault data, fetch from API
      fetchVault()
    }
  }, [vaultId])

  // Fetch vault data from API
  async function fetchVault() {
    try {
      console.log("🔄 Fetching vault:", vaultId)
      const url = `${API_BASE}/api/v1/vaults/${vaultId}`
      const res = await fetch(url)
      
      if (!res.ok) {
        console.warn("❌ Failed to fetch vault:", res.status)
        return
      }
      const data = await res.json()
      console.log("✅ Vault fetched:", data.data)
      setVault(data.data)
    } catch (e) {
      console.warn("❌ Error fetching vault:", e)
    }
  }

  // Fetch credentials for vault
  async function fetchCredentials() {
    try {
      console.log("🔄 Fetching credentials for vault:", vaultId)
      const url = `${API_BASE}/api/v1/vaults/${vaultId}/credentials`
      console.log("📍 Request URL:", url)
      
      const res = await fetch(url)
      console.log("📊 Response status:", res.status)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.warn("❌ Failed to fetch credentials:", res.status, errorText)
        // Don't show error alert - just log it
        return
      }
      const data = await res.json()
      console.log("📦 Response data:", data)
      console.log("📋 data.data:", data.data)
      
      setCredentials(data.data || [])
      console.log("✅ Credentials set:", data.data)
    } catch (e) {
      console.warn("❌ Error fetching credentials:", e)
      // Don't show error alert for now - may not be implemented on backend yet
    } finally {
      setLoading(false)
    }
  }

  // Initialize - fetch credentials
  useEffect(() => {
    if (!vaultId) return
    void fetchCredentials()
  }, [vaultId])

  // Create credential
  async function handleCreateCredential(
    username: string,
    password: string,
    url: string
  ) {
    try {
      const body = {
        vault_id: vaultId,
        username,
        password,
        url: url || undefined,
      }
      const res = await fetch(`${API_BASE}/api/v1/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const error = await res.text()
        console.error("Create credential failed:", error)
        alert(`Failed to create credential: ${res.status}`)
        throw new Error(`Failed to create credential: ${res.status}`)
      }
      const json = await res.json()
      const created = json.data
      if (created) {
        setCredentials((prev) => [created, ...prev])
      }
    } catch (e) {
      console.error("Create credential error:", e)
      throw e
    }
  }

  // Update credential
  async function handleUpdateCredential(
    credentialId: string,
    username: string,
    password: string,
    url: string
  ) {
    try {
      const body = {
        username,
        password,
        url: url || undefined,
      }
      const res = await fetch(`${API_BASE}/api/v1/credentials/${credentialId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const error = await res.text()
        console.error("Update credential failed:", error)
        alert(`Failed to update credential: ${res.status}`)
        throw new Error(`Failed to update credential: ${res.status}`)
      }
      const json = await res.json()
      const updated = json.data
      if (updated) {
        setCredentials((prev) =>
          prev.map((c) => (c.id === credentialId ? updated : c))
        )
      }
    } catch (e) {
      console.error("Update credential error:", e)
      throw e
    }
  }

  // Delete credential
  async function handleDeleteCredential(credentialId: string) {
    if (!confirm("Delete this credential?")) return
    try {
      const res = await fetch(`${API_BASE}/api/v1/credentials/${credentialId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        console.error("Delete credential failed:", res.status)
        alert("Failed to delete credential")
        return
      }
      setCredentials((prev) => prev.filter((c) => c.id !== credentialId))
    } catch (e) {
      console.error("Delete credential error:", e)
      alert("Failed to delete credential")
    }
  }

  function handleDeleteCredentialClick(credentialId: string) {
    setSelectedCredentialForDelete(credentialId)
    setOpenDeleteModal(true)
  }

  async function handleConfirmDeleteCredential() {
    if (!selectedCredentialForDelete) return
    
    try {
      const res = await fetch(`${API_BASE}/api/v1/credentials/${selectedCredentialForDelete}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        console.error("Delete credential failed:", res.status)
        alert("Failed to delete credential")
        return
      }
      
      setOpenDeleteModal(false)
      setSelectedCredentialForDelete(null)
      setCredentials((prev) => prev.filter((c) => c.id !== selectedCredentialForDelete))
    } catch (e) {
      console.error("Delete credential error:", e)
      alert("Failed to delete credential")
    }
  }

  const handleEditClick = (credential: Credential) => {
    setSelectedCredential(credential)
    setOpenEditModal(true)
  }

  const togglePasswordVisibility = (credentialId: string) => {
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(credentialId)) {
        newSet.delete(credentialId)
      } else {
        newSet.add(credentialId)
      }
      return newSet
    })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => router.push("/vault")}
          >
            ← Back
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{vault?.name || "Vault"}</h1>
          {vault?.description && (
            <p className="text-muted-foreground mt-1">{vault.description}</p>
          )}
        </div>
      </div>

      {/* Credentials Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Credentials</h2>
          <Button onClick={() => setOpenCreateModal(true)}>+ Add Credential</Button>
        </div>

        {loading && <div>Loading credentials...</div>}

        <div className="grid gap-4">
          {credentials.map((cred) => (
            <Card key={cred.id} className="p-4">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{cred.username}</div>
                    <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Password: </span>
                      <span>
                        {visiblePasswords.has(cred.id) ? cred.password : "•".repeat(8)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePasswordVisibility(cred.id)}
                        className="h-6 px-2 text-xs"
                      >
                        {visiblePasswords.has(cred.id) ? "Hide" : "Show"}
                      </Button>
                    </div>
                    {cred.url && (
                      <div className="text-sm text-muted-foreground mt-1">
                        <a href={cred.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {cred.url}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEditClick(cred)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteCredentialClick(cred.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {!loading && credentials.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No credentials yet. Create one to get started!
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateCredentialModal
        open={openCreateModal}
        onOpenChange={setOpenCreateModal}
        onCreateCredential={handleCreateCredential}
      />

      {selectedCredential && (
        <EditCredentialModal
          open={openEditModal}
          onOpenChange={setOpenEditModal}
          credential={selectedCredential}
          onUpdateCredential={handleUpdateCredential}
        />
      )}

      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent className="w-[95vw] sm:w-full max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Credential</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this credential? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteModal(false)}
              className="w-full sm:w-36"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDeleteCredential}
              className="w-full sm:w-36"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
