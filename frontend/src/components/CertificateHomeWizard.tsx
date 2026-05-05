import { mediaUrl } from '../api/config'
import { CERTIFICATE_TEMPLATES } from '../config/certificateCatalog'
import { DEFAULT_CERTIFICATE_BRAND_NAME } from '../context/CertificateSessionContext'
import type { Company } from '../services/companiesStore'
import { CertificateStepper } from './CertificateStepper'

const DEFAULT_LOGO_SRC = '/src/assets/safety-spectrum-logo.png'

export type HomeWizardStep = 1 | 2 | 3

type Props = {
  homeStep: HomeWizardStep
  setHomeStep: (s: HomeWizardStep) => void
  companies: Company[]
  companiesLoading: boolean
  useDefaultBranding: boolean
  setUseDefaultBranding: (v: boolean) => void
  issuerCompany: Company | null
  setIssuerCompany: (c: Company | null) => void
  selectedPdf: string
  setSelectedPdf: (name: string) => void
  onOpenForm: () => void
}

export function CertificateHomeWizard({
  homeStep,
  setHomeStep,
  companies,
  companiesLoading,
  useDefaultBranding,
  setUseDefaultBranding,
  issuerCompany,
  setIssuerCompany,
  selectedPdf,
  setSelectedPdf,
  onOpenForm,
}: Props) {
  const stepperIndex =
    homeStep === 1 ? 0 : homeStep === 2 ? 1 : 2

  const canProceedCompanyStep = useDefaultBranding || !!issuerCompany

  return (
    <main className="page-shell cert-wizard-shell">
      <CertificateStepper activeIndex={stepperIndex} />

      {homeStep === 1 && (
        <section className="cert-wizard-card" aria-labelledby="cert-co-title">
          <div className="cert-wizard-card-head">
            <h1 id="cert-co-title">Select company for this certificate</h1>
            <p className="cert-wizard-sub">
              Use the original <strong>{DEFAULT_CERTIFICATE_BRAND_NAME}</strong> layout and logos, or pick a saved
              company to brand the PDF with its name and logo.
            </p>
          </div>
          {companiesLoading ? (
            <p className="cert-wizard-muted">Loading saved companies…</p>
          ) : null}
          <div className="cert-co-grid" role="list">
            <button
              type="button"
              role="listitem"
              className={`cert-co-card cert-co-card--default${useDefaultBranding ? ' cert-co-card--selected' : ''}`}
              onClick={() => setUseDefaultBranding(true)}
              aria-pressed={useDefaultBranding}
            >
              {useDefaultBranding ? <span className="cert-co-check" aria-hidden="true">✓</span> : null}
              <img
                className="cert-co-logo"
                src={mediaUrl(DEFAULT_LOGO_SRC)}
                alt=""
                width={48}
                height={48}
              />
              <span className="cert-co-name">{DEFAULT_CERTIFICATE_BRAND_NAME}</span>
              <span className="cert-co-default-tag">Template default</span>
            </button>
            {companies.map((c) => {
              const selected = !useDefaultBranding && issuerCompany?.id === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  role="listitem"
                  className={`cert-co-card${selected ? ' cert-co-card--selected' : ''}`}
                  onClick={() => setIssuerCompany(c)}
                  aria-pressed={selected}
                >
                  {selected ? <span className="cert-co-check" aria-hidden="true">✓</span> : null}
                  <img className="cert-co-logo" src={mediaUrl(c.logoUrl)} alt="" width={48} height={48} />
                  <span className="cert-co-name">{c.name}</span>
                </button>
              )
            })}
          </div>
          {!companies.length && !companiesLoading ? (
            <p className="cert-wizard-muted">
              No saved companies yet. Use <strong>Companies</strong> in the header to add some, or continue with the
              template default above.
            </p>
          ) : null}
          {(useDefaultBranding || issuerCompany) ? (
            <div className="cert-selected-row">
              <span className="cert-selected-label">Selection</span>
              {useDefaultBranding ? (
                <span className="cert-selected-chip">
                  <img src={mediaUrl(DEFAULT_LOGO_SRC)} alt="" width={24} height={24} />
                  {DEFAULT_CERTIFICATE_BRAND_NAME} (default)
                </span>
              ) : issuerCompany ? (
                <span className="cert-selected-chip">
                  <img src={mediaUrl(issuerCompany.logoUrl)} alt="" width={24} height={24} />
                  {issuerCompany.name}
                </span>
              ) : null}
            </div>
          ) : null}
          <div className="cert-wizard-footer">
            <span />
            <button
              type="button"
              className="primary-action"
              disabled={!canProceedCompanyStep}
              onClick={() => setHomeStep(2)}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {homeStep === 2 && (
        <section className="cert-wizard-card" aria-labelledby="cert-pdf-title">
          <div className="cert-wizard-card-head">
            <h1 id="cert-pdf-title">Select certificate template</h1>
            <p className="cert-wizard-sub">Pick the certificate type, then customize fields in the next step.</p>
          </div>
          <div className="cert-pdf-grid" role="list">
            {CERTIFICATE_TEMPLATES.map((t) => {
              const selected = selectedPdf === t.label
              return (
                <button
                  key={t.id}
                  type="button"
                  role="listitem"
                  className={`cert-pdf-card${selected ? ' cert-pdf-card--selected' : ''}`}
                  onClick={() => setSelectedPdf(t.label)}
                  aria-pressed={selected}
                >
                  {selected ? <span className="cert-co-check" aria-hidden="true">✓</span> : null}
                  <span className="cert-pdf-badge">PDF</span>
                  <span className="cert-pdf-name">{t.label}</span>
                  <span className="cert-pdf-action">{selected ? 'Selected' : 'Select'}</span>
                </button>
              )
            })}
          </div>
          <div className="cert-wizard-footer">
            <button type="button" className="secondary-action" onClick={() => setHomeStep(1)}>
              Back
            </button>
            <button
              type="button"
              className="primary-action"
              disabled={!selectedPdf}
              onClick={() => setHomeStep(3)}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {homeStep === 3 && (
        <section className="cert-wizard-card" aria-labelledby="cert-go-title">
          <div className="cert-wizard-card-head">
            <h1 id="cert-go-title">Customize &amp; download</h1>
            <p className="cert-wizard-sub">
              Open the form to fill certificate fields. On the last step, use <strong>Download</strong> to export your
              PDF {useDefaultBranding ? 'with the original template branding.' : 'with your selected company branding.'}
            </p>
          </div>
          <div className="cert-summary-panel">
            <div>
              <p className="eyebrow">Company</p>
              <p className="cert-summary-value">
                {useDefaultBranding ? `${DEFAULT_CERTIFICATE_BRAND_NAME} (template default)` : issuerCompany?.name ?? '—'}
              </p>
            </div>
            <div>
              <p className="eyebrow">Template</p>
              <p className="cert-summary-value">{selectedPdf}</p>
            </div>
          </div>
          <div className="cert-wizard-footer">
            <button type="button" className="secondary-action" onClick={() => setHomeStep(2)}>
              Back
            </button>
            <button type="button" className="primary-action" onClick={onOpenForm}>
              Open form
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
