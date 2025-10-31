export type Credential = {
  id: string
  vault_id: string
  name: string
  username: string
  password: string
  url?: string
  created_at?: string
  updated_at?: string
}

export type Vault = {
  id: string
  owner_user_id: string
  name: string
  description: string
}
