/**
 * Client-side helpers: active company in localStorage, logo validation.
 * Company list is loaded from the backend API (JSON file on disk, not a database).
 */

export type Company = {
  id: string
  name: string
  logoUrl: string
}

export const BRANDING_STORAGE_KEY = 'certificate_workspace_company'
export const MAX_LOGO_BYTES = 1_500_000

function isCompany(value: unknown): value is Company {
  if (!value || typeof value !== 'object') return false
  const o = value as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    typeof o.logoUrl === 'string' &&
    o.id.length > 0 &&
    o.name.length > 0
  )
}

/** Read persisted “current” company (full record). */
export function readSelectedFromStorage(): Company | null {
  try {
    const raw = localStorage.getItem(BRANDING_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (isCompany(parsed) && parsed.logoUrl) return parsed
  } catch {
    localStorage.removeItem(BRANDING_STORAGE_KEY)
  }
  return null
}

/** Persist “current” company (or clear). */
export function writeSelectedToStorage(company: Company | null): void {
  if (company) {
    localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(company))
  } else {
    localStorage.removeItem(BRANDING_STORAGE_KEY)
  }
}

/** After loading `companies` from the API, choose which row should be active. */
export function pickSelectedAfterLoad(companies: Company[]): Company | null {
  const saved = readSelectedFromStorage()
  if (saved && companies.some((c) => c.id === saved.id)) return saved
  // No saved selection → stay on template default (null).
  return null
}

export async function readLogoFileAsDataUrl(file: File): Promise<string> {
  if (file.size > MAX_LOGO_BYTES) {
    throw new Error(`Logo must be under ${Math.round(MAX_LOGO_BYTES / 1000)} KB.`)
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') resolve(result)
      else reject(new Error('Could not read logo file.'))
    }
    reader.onerror = () => reject(new Error('Could not read logo file.'))
    reader.readAsDataURL(file)
  })
}
