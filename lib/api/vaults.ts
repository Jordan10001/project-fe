const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export type Vault = {
  id: string
  owner_user_id: string
  name: string
  description: string
}

export async function fetchVaults(ownerId: string): Promise<Vault[]> {
  if (!ownerId) {
    return []
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/v1/vaults?owner_id=${encodeURIComponent(ownerId)}`
    )
    if (!res.ok) {
      let body = "<failed to read response body>"
      try {
        body = await res.text()
      } catch (e) {
        body = `<failed to read response body: ${(e as Error).message}>`
      }
      console.error("List vaults failed", {
        status: res.status,
        statusText: res.statusText,
        body,
      })
      throw new Error(`Failed to load vaults: ${res.status} ${res.statusText}`)
    }
    const data = await res.json()
    console.log("Vaults loaded:", data.data)
    return data.data || []
  } catch (e) {
    console.error("Fetch error:", e)
    throw new Error("Failed to load vaults: network error")
  }
}

export async function createVault(
  ownerId: string,
  name: string,
  description: string
): Promise<Vault> {
  if (!ownerId) {
    throw new Error(
      "Cannot create vault: you must be logged in (owner id missing). Please login first."
    )
  }

  try {
    const body = { owner_user_id: ownerId, name, description }
    const res = await fetch(`${API_BASE}/api/v1/vaults`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      let text = "<failed to read response body>"
      try {
        text = await res.text()
      } catch (e) {
        text = `<failed to read response body: ${(e as Error).message}>`
      }
      console.error("Create vault failed", {
        status: res.status,
        statusText: res.statusText,
        body: text,
      })
      throw new Error(`Create vault failed: ${res.status} ${res.statusText}`)
    }
    const json = await res.json()
    return json.data
  } catch (e) {
    console.error("Create vault request failed", e)
    throw e
  }
}

export async function deleteVault(vaultId: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/vaults/${vaultId}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      throw new Error("Failed to delete vault")
    }
  } catch (e) {
    console.error("Delete vault failed:", e)
    throw e
  }
}
