import type { Company } from '../services/companiesStore'

/** Keys read by certificate HTML templates for branding overrides */
export const ISSUER_NAME_KEY = 'issuerName'
export const ISSUER_LOGO_KEY = 'issuerLogoUrl'

export function mergeIssuerIntoPayload<T extends Record<string, unknown>>(
  payload: T,
  issuer: Company | null,
): T & Partial<Record<typeof ISSUER_NAME_KEY | typeof ISSUER_LOGO_KEY, string>> {
  if (!issuer?.name || !issuer?.logoUrl) {
    return payload
  }
  return {
    ...payload,
    [ISSUER_NAME_KEY]: issuer.name,
    [ISSUER_LOGO_KEY]: issuer.logoUrl,
  }
}
