import { useEffect, useId, useState } from 'react'
import { mediaUrl } from '../api/config'
import { readLogoFileAsDataUrl, useCompanyBranding } from '../context/CompanyBrandingContext'
import type { Company } from '../services/companiesStore'

type Props = {
  open: boolean
  onClose: () => void
}

type Mode = { type: 'list' } | { type: 'add' } | { type: 'edit'; company: Company }

export function CompaniesDialog({ open, onClose }: Props) {
  const {
    companies,
    selected,
    setSelected,
    addCompany,
    updateCompany,
    deleteCompany,
    companiesLoading,
    companiesError,
    refreshCompanies,
  } = useCompanyBranding()
  const titleId = useId()
  const [mode, setMode] = useState<Mode>({ type: 'list' })

  useEffect(() => {
    if (!open) setMode({ type: 'list' })
  }, [open])

  const closeAll = () => {
    setMode({ type: 'list' })
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="dialog-overlay"
      role="presentation"
      onMouseDown={(ev) => {
        if (ev.target === ev.currentTarget) closeAll()
      }}
    >
      <div className="dialog-panel dialog-panel--wide" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="dialog-head">
          <h2 id={titleId}>Companies</h2>
          <button type="button" className="dialog-close" onClick={closeAll} aria-label="Close">
            ×
          </button>
        </div>

        {mode.type === 'list' && (
          <div className="companies-dialog-body">
            <p className="companies-dialog-hint">
              Companies are saved on the server as a JSON file (no database). Start the API with{' '}
              <code className="inline-code">npm run dev</code> in the <code className="inline-code">backend</code> folder
              while you run the Vite app.
            </p>
            {companiesError ? (
              <div className="companies-api-error" role="alert">
                <p>{companiesError}</p>
                <button type="button" className="secondary-action" onClick={() => void refreshCompanies()}>
                  Retry
                </button>
              </div>
            ) : null}
            {companiesLoading ? (
              <p className="companies-loading">Loading companies…</p>
            ) : (
              <ul className="company-list" aria-label="Saved companies">
                {companies.length === 0 ? (
                  <li className="company-list-empty">
                    No companies yet. Add one to show a name and logo in the header.
                  </li>
                ) : (
                  companies.map((c) => (
                    <li key={c.id} className="company-list-row">
                      <img className="company-list-thumb" src={mediaUrl(c.logoUrl)} alt="" width={40} height={40} />
                      <div className="company-list-main">
                        <span className="company-list-name">{c.name}</span>
                        {selected?.id === c.id ? <span className="company-list-badge">Active</span> : null}
                      </div>
                      <div className="company-list-actions">
                        {selected?.id !== c.id ? (
                          <button type="button" className="text-btn" onClick={() => setSelected(c)}>
                            Use
                          </button>
                        ) : null}
                        <button type="button" className="text-btn" onClick={() => setMode({ type: 'edit', company: c })}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-btn text-btn--danger"
                          onClick={() => {
                            void (async () => {
                              if (!window.confirm(`Delete “${c.name}”? This cannot be undone.`)) return
                              try {
                                await deleteCompany(c.id)
                              } catch (err) {
                                window.alert(err instanceof Error ? err.message : 'Could not delete company.')
                              }
                            })()
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
            <div className="companies-dialog-footer">
              <button
                type="button"
                className="primary-action"
                onClick={() => setMode({ type: 'add' })}
                disabled={companiesLoading}
              >
                Add company
              </button>
            </div>
          </div>
        )}

        {mode.type === 'add' && (
          <CompanyForm
            key="add"
            title="Add company"
            submitLabel="Create"
            onBack={() => setMode({ type: 'list' })}
            onCancel={closeAll}
            onSubmit={async (name, logoDataUrl) => {
              await addCompany(name, logoDataUrl)
              setMode({ type: 'list' })
            }}
          />
        )}

        {mode.type === 'edit' && (
          <CompanyForm
            key={mode.company.id}
            title="Edit company"
            submitLabel="Save"
            initialName={mode.company.name}
            initialLogoUrl={mode.company.logoUrl}
            onBack={() => setMode({ type: 'list' })}
            onCancel={closeAll}
            onSubmit={async (name, logoDataUrl) => {
              await updateCompany(mode.company.id, { name, logoDataUrl })
              setMode({ type: 'list' })
            }}
          />
        )}
      </div>
    </div>
  )
}

function CompanyForm({
  title,
  submitLabel,
  initialName = '',
  initialLogoUrl,
  onBack,
  onCancel,
  onSubmit,
}: {
  title: string
  submitLabel: string
  initialName?: string
  initialLogoUrl?: string
  onBack: () => void
  onCancel: () => void
  onSubmit: (name: string, logoDataUrl: string) => Promise<void>
}) {
  const formTitleId = useId()
  const fileInputId = useId()
  const [name, setName] = useState(initialName)
  const [file, setFile] = useState<File | null>(null)
  const [blobPreview, setBlobPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const revokeBlob = (url: string | null) => {
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
  }

  const onFileChange = (f: File | null) => {
    setFile(f)
    setError(null)
    setBlobPreview((prev) => {
      revokeBlob(prev)
      return null
    })
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please choose an image file (PNG, JPG, SVG, etc.).')
      setFile(null)
      return
    }
    setBlobPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Enter a company name.')
      return
    }
    let logoDataUrl: string
    if (file) {
      try {
        logoDataUrl = await readLogoFileAsDataUrl(file)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not read logo.')
        return
      }
    } else if (initialLogoUrl) {
      logoDataUrl = initialLogoUrl
    } else {
      setError('Choose a logo image.')
      return
    }

    setBusy(true)
    try {
      await onSubmit(trimmed, logoDataUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const previewSrc = blobPreview ?? (initialLogoUrl ? mediaUrl(initialLogoUrl) : null)

  return (
    <>
      <div className="dialog-subhead">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to list
        </button>
      </div>
      <form className="dialog-form" onSubmit={handleSubmit} aria-labelledby={formTitleId}>
        <h3 id={formTitleId} className="dialog-form-title">
          {title}
        </h3>
        <label className="dialog-field">
          Company name
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Safety Spectrum London"
            autoComplete="organization"
          />
        </label>
        <label className="dialog-field" htmlFor={fileInputId}>
          Logo {initialLogoUrl ? <span className="dialog-optional">(optional — leave empty to keep current)</span> : null}
          <input id={fileInputId} type="file" accept="image/*" onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} />
        </label>
        {previewSrc ? (
          <div className="dialog-preview">
            <img src={previewSrc} alt="" width={56} height={56} />
            <span>Preview</span>
          </div>
        ) : null}
        {error ? <p className="dialog-error">{error}</p> : null}
        <div className="dialog-actions">
          <button type="button" className="secondary-action" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="primary-action" disabled={busy}>
            {busy ? 'Saving…' : submitLabel}
          </button>
        </div>
      </form>
    </>
  )
}
