import { useState } from 'react'
import { mediaUrl } from '../api/config'
import { useCompanyBranding } from '../context/CompanyBrandingContext'
import { CompaniesDialog } from './CompaniesDialog'

const DEFAULT_HEADER_LOGO_SRC = '/src/assets/safety-spectrum-logo.png'

export function BrandBar() {
  const { selected, companies, setSelected } = useCompanyBranding()
  const [manageOpen, setManageOpen] = useState(false)

  return (
    <>
      <header className="app-brand-bar">
        <div className="app-brand-left">
          <img
            className="app-brand-logo"
            src={mediaUrl(selected?.logoUrl ?? DEFAULT_HEADER_LOGO_SRC)}
            alt=""
            width={36}
            height={36}
          />
          <div className="app-brand-text">
            <span className="app-brand-name">{selected?.name ?? 'Safety Spectrum London'}</span>
            <span className="app-brand-tag">Certificate workspace</span>
          </div>
        </div>
        <div className="app-brand-actions">
          {companies.length > 1 ? (
            <label className="app-brand-switch">
              <span className="visually-hidden">Active company</span>
              <select
                value={selected?.id ?? ''}
                onChange={(e) => {
                  if (!e.target.value) {
                    setSelected(null)
                    return
                  }
                  const next = companies.find((c) => c.id === e.target.value)
                  if (next) setSelected(next)
                }}
              >
                <option value="">Template default</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <button type="button" className="secondary-action app-brand-add" onClick={() => setManageOpen(true)}>
            Companies
          </button>
        </div>
      </header>
      <CompaniesDialog open={manageOpen} onClose={() => setManageOpen(false)} />
    </>
  )
}
