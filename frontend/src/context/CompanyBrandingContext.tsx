import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as companiesApi from '../api/companiesApi'
import type { Company } from '../services/companiesStore'
import * as companiesStore from '../services/companiesStore'

/** @deprecated Use `Company` from `../services/companiesStore` */
export type SelectedCompany = Company

export type BrandingContextValue = {
  selected: Company | null
  companies: Company[]
  companiesLoading: boolean
  companiesError: string | null
  refreshCompanies: () => Promise<void>
  setSelected: (company: Company | null) => void
  addCompany: (name: string, logoDataUrl: string) => Promise<Company>
  updateCompany: (id: string, updates: { name?: string; logoDataUrl?: string }) => Promise<void>
  deleteCompany: (id: string) => Promise<void>
}

export const BrandingContext = createContext<BrandingContextValue | null>(null)

export const BRANDING_STORAGE_KEY = companiesStore.BRANDING_STORAGE_KEY

/** @deprecated Prefer `companiesStore.readSelectedFromStorage` */
export function readStoredCompany(): Company | null {
  return companiesStore.readSelectedFromStorage()
}

export function CompanyBrandingProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selected, setSelectedState] = useState<Company | null>(null)
  const [companiesLoading, setCompaniesLoading] = useState(true)
  const [companiesError, setCompaniesError] = useState<string | null>(null)

  const refreshCompanies = useCallback(async () => {
    setCompaniesLoading(true)
    setCompaniesError(null)
    try {
      const list = await companiesApi.fetchCompanies()
      setCompanies(list)
      setSelectedState((prev) => {
        const preferred =
          prev && list.some((c) => c.id === prev.id)
            ? prev
            : companiesStore.pickSelectedAfterLoad(list)
        return preferred
      })
    } catch (e) {
      setCompaniesError(e instanceof Error ? e.message : 'Could not load companies.')
      setCompanies([])
    } finally {
      setCompaniesLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshCompanies()
  }, [refreshCompanies])

  useEffect(() => {
    companiesStore.writeSelectedToStorage(selected)
  }, [selected])

  useEffect(() => {
    setSelectedState((sel) => {
      // `null` means "template default" and is a valid state.
      if (!sel) return null
      if (companies.some((c) => c.id === sel.id)) return sel
      // Previously-selected company no longer exists.
      return null
    })
  }, [companies])

  const setSelected = useCallback((company: Company | null) => {
    setSelectedState(company)
  }, [])

  const addCompany = useCallback(async (name: string, logoDataUrl: string) => {
    const trimmed = name.trim()
    if (!trimmed || !logoDataUrl) {
      throw new Error('Company name and logo are required.')
    }
    const company = await companiesApi.createCompany({ name: trimmed, logoUrl: logoDataUrl })
    setCompanies((prev) => [...prev, company])
    setSelectedState(company)
    return company
  }, [])

  const updateCompany = useCallback(async (id: string, updates: { name?: string; logoDataUrl?: string }) => {
    const body: { name?: string; logoUrl?: string } = {}
    if (updates.name !== undefined) body.name = updates.name.trim()
    if (updates.logoDataUrl !== undefined) body.logoUrl = updates.logoDataUrl
    const company = await companiesApi.updateCompanyApi(id, body)
    setCompanies((prev) => prev.map((c) => (c.id === id ? company : c)))
    setSelectedState((sel) => (sel?.id === id ? company : sel))
  }, [])

  const deleteCompany = useCallback(async (id: string) => {
    await companiesApi.deleteCompanyApi(id)
    setCompanies((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      selected,
      companies,
      companiesLoading,
      companiesError,
      refreshCompanies,
      setSelected,
      addCompany,
      updateCompany,
      deleteCompany,
    }),
    [
      selected,
      companies,
      companiesLoading,
      companiesError,
      refreshCompanies,
      setSelected,
      addCompany,
      updateCompany,
      deleteCompany,
    ],
  )

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>
}

export function useCompanyBranding(): BrandingContextValue {
  const ctx = useContext(BrandingContext)
  if (!ctx) {
    throw new Error('useCompanyBranding must be used within CompanyBrandingProvider')
  }
  return ctx
}

export { readLogoFileAsDataUrl } from '../services/companiesStore'
