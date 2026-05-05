import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Company } from '../services/companiesStore'

export const DEFAULT_CERTIFICATE_BRAND_NAME = 'Safety Spectrum London'

export type CertificateSessionValue = {
  /** When true, PDFs use original template logos/names (no custom issuer fields). */
  useDefaultBranding: boolean
  setUseDefaultBranding: (value: boolean) => void
  /** When useDefaultBranding is false, this company supplies issuer name/logo on export. */
  issuerCompany: Company | null
  setIssuerCompany: (company: Company | null) => void
}

const CertificateSessionContext = createContext<CertificateSessionValue | null>(null)

export function CertificateSessionProvider({ children }: { children: ReactNode }) {
  const [useDefaultBranding, setUseDefaultBrandingState] = useState(true)
  const [issuerCompany, setIssuerCompanyState] = useState<Company | null>(null)

  const setUseDefaultBranding = useCallback((value: boolean) => {
    setUseDefaultBrandingState(value)
    if (value) {
      setIssuerCompanyState(null)
    }
  }, [])

  const setIssuerCompany = useCallback((company: Company | null) => {
    if (!company) {
      setUseDefaultBrandingState(true)
      setIssuerCompanyState(null)
      return
    }
    setIssuerCompanyState(company)
    setUseDefaultBrandingState(false)
  }, [])

  const value = useMemo(
    () => ({
      useDefaultBranding,
      setUseDefaultBranding,
      issuerCompany,
      setIssuerCompany,
    }),
    [useDefaultBranding, setUseDefaultBranding, issuerCompany, setIssuerCompany],
  )

  return <CertificateSessionContext.Provider value={value}>{children}</CertificateSessionContext.Provider>
}

export function useCertificateSession(): CertificateSessionValue {
  const ctx = useContext(CertificateSessionContext)
  if (!ctx) {
    throw new Error('useCertificateSession must be used within CertificateSessionProvider')
  }
  return ctx
}
