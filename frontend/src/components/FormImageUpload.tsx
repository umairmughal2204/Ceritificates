import { useId, useState } from 'react'
import { mediaUrl } from '../api/config'
import { readFormImageAsDataUrl } from '../lib/formImage'

type Props = {
  label: string
  value: string
  onChange: (next: string) => void
  wide?: boolean
}

export function FormImageUpload({ label, value, onChange, wide }: Props) {
  const reactId = useId()
  const inputId = `form-img-${reactId.replace(/:/g, '')}`
  const [error, setError] = useState<string | null>(null)

  return (
    <div className={`form-image-upload${wide ? ' form-image-upload--wide' : ''}`}>
      <label className="form-image-upload__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="form-image-upload__controls">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="form-image-upload__file"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (!file) return
            setError(null)
            try {
              const dataUrl = await readFormImageAsDataUrl(file)
              onChange(dataUrl)
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not load image.')
            }
          }}
        />
        {value ? (
          <button
            type="button"
            className="form-image-upload__clear secondary-action"
            onClick={() => {
              setError(null)
              onChange('')
            }}
          >
            Remove image
          </button>
        ) : null}
      </div>
      {value ? (
        <div className="form-image-upload__preview">
          <img src={mediaUrl(value)} alt="" />
        </div>
      ) : null}
      {error ? <p className="form-image-upload__error">{error}</p> : null}
    </div>
  )
}
