/**
 * Single catalog for certificate templates (labels + routing keys used in App).
 */

export const CERTIFICATE_TEMPLATES = [
  { id: 'fsc', label: 'Safety Spectrum London fsc' },
  { id: 'legionella', label: 'Legionella' },
  { id: 'asbestos', label: 'Asbestos managment survey' },
  { id: 'elc', label: 'Safety Spectrum London elc' },
  { id: 'fet', label: 'fet safety spectrum london' },
  { id: 'pat', label: 'pat Safety spectrum london' },
  { id: 'fdi', label: 'fdi safety spectrum london' },
] as const

export const CERTIFICATE_LABELS = CERTIFICATE_TEMPLATES.map((t) => t.label) as unknown as string[]
