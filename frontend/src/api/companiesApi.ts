import type { Company } from '../services/companiesStore'

/** In dev, Vite proxies `/api` to the backend. Set `VITE_API_BASE_URL` for preview or a remote API (no trailing slash). */
function apiUrl(path: string): string {
  const base = import.meta.env.VITE_API_BASE_URL
  if (typeof base === 'string' && base.trim() !== '') {
    return `${base.replace(/\/$/, '')}${path}`
  }
  return path
}

function isCompany(value: unknown): value is Company {
  if (!value || typeof value !== 'object') return false
  const o = value as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    typeof o.logoUrl === 'string' &&
    o.id.length > 0 &&
    o.name.length > 0 &&
    o.logoUrl.length > 0
  )
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string }
    if (data?.error) return data.error
  } catch {
    /* ignore */
  }
  return res.statusText || `Request failed (${res.status})`
}

export async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch(apiUrl('/api/companies'))
  if (!res.ok) throw new Error(await readErrorMessage(res))
  const data = (await res.json()) as { companies?: unknown }
  if (!Array.isArray(data.companies)) return []
  return data.companies.filter(isCompany)
}

export async function createCompany(input: { name: string; logoUrl: string }): Promise<Company> {
  const res = await fetch(apiUrl('/api/companies'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await readErrorMessage(res))
  const data = (await res.json()) as { company?: unknown }
  if (!isCompany(data.company)) throw new Error('Invalid response from server.')
  return data.company
}

export async function updateCompanyApi(
  id: string,
  input: { name?: string; logoUrl?: string },
): Promise<Company> {
  const res = await fetch(apiUrl(`/api/companies/${encodeURIComponent(id)}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await readErrorMessage(res))
  const data = (await res.json()) as { company?: unknown }
  if (!isCompany(data.company)) throw new Error('Invalid response from server.')
  return data.company
}

export async function deleteCompanyApi(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/companies/${encodeURIComponent(id)}`), {
    method: 'DELETE',
  })
  if (!res.ok && res.status !== 204) throw new Error(await readErrorMessage(res))
}
