import { useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

const pdfOptions = [
  'Safety Spectrum London fsc',
  'Legionella',
  'Asbestos managment survey',
  'Safety Spectrum London elc',
  'fet safety spectrum london',
  'pat Safety spectrum london',
  'fdi safety spectrum london',
]

const elcPdfName = 'Safety Spectrum London elc'

type ElcFormData = {
  inspectionDate: string
  certificateReference: string
  postcode: string
  clientName: string
  clientAddress: string
  purposeText: string
  extentLine1: string
  extentLine2: string
  installationAddress: string
  tradingTitle: string
  contractorAddress: string
  inspectorName: string
  signedDate: string
  nextInspectionInterval: string
  notes: string[]
}

const toPdfDate = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) {
    return value
  }
  const [, yyyy, mm, dd] = match
  return `${dd}/${mm}/${yyyy}`
}

const defaultElcForm: ElcFormData = {
  inspectionDate: '2025-12-22',
  certificateReference: '665397',
  postcode: 'SE17 1DX',
  clientName: 'City Relay',
  clientAddress: '1, 1 Townley Street and Elephant Houses SE17 1DX',
  purposeText: 'To certify continued compliance of an existing installation',
  extentLine1: '> 75 Emergency Lights Tested',
  extentLine2: 'All the Emergency Lights are working fine',
  installationAddress: '1, 1 Townley Street and Elephant Houses SE17 1DX',
  tradingTitle: 'Safety Spectrum London',
  contractorAddress: '58A Tudor Road Hayes UB3 2QD',
  inspectorName: 'Shahzil Pal',
  signedDate: '2025-12-22',
  nextInspectionInterval: '6 Months',
  notes: [
    '1 emergency light present in main entrance',
    '1 emergency light present in kitchen',
    '1 emergency light present in living area',
    '2 emergency lights present in second floor',
    '3 emergency lights present in third floor',
  ],
}

function App() {
  const [activeView, setActiveView] = useState<'home' | 'elc-form'>('home')
  const [selectedPdf, setSelectedPdf] = useState(pdfOptions[0])
  const [activeSection, setActiveSection] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [form, setForm] = useState<ElcFormData>(defaultElcForm)

  const openSelectedLayout = () => {
    if (selectedPdf !== elcPdfName) {
      window.alert('Layout is currently available only for Safety Spectrum London elc.')
      return
    }

    setActiveSection(0)
    setActiveView('elc-form')
  }

  const updateField = (field: keyof ElcFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateNote = (index: number, value: string) => {
    setForm((current) => {
      const next = [...current.notes]
      next[index] = value
      return { ...current, notes: next }
    })
  }

  const downloadElcPdf = async () => {
    const payload = {
      inspectionDate: toPdfDate(form.inspectionDate),
      certificateReference: form.certificateReference,
      postcode: form.postcode,
      clientName: form.clientName,
      clientAddress: form.clientAddress,
      purposeText: form.purposeText,
      extentLine1: form.extentLine1,
      extentLine2: form.extentLine2,
      installationAddress: form.installationAddress,
      tradingTitle: form.tradingTitle,
      contractorAddress: form.contractorAddress,
      inspectorName: form.inspectorName,
      signedDate: toPdfDate(form.signedDate),
      nextInspectionInterval: form.nextInspectionInterval,
      notes: form.notes,
    }

    setIsGenerating(true)
    localStorage.setItem('elc_form_data', JSON.stringify(payload))
    window.open('/src/templates/safety-spectrum-london-elc.html?autodownload=1', '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setIsGenerating(false), 800)
  }

  if (activeView === 'elc-form') {
    const sections = ['Page 1: Main details', 'Page 1: Certification', 'Page 3: Notes', 'Review']
    const isLast = activeSection === sections.length - 1

    return (
      <main className="page-shell wizard-page">
        <section className="wizard-header-panel">
          <button type="button" className="text-action" onClick={() => setActiveView('home')}>
            Back to templates
          </button>
          <p className="eyebrow">ELC 4-page form</p>
          <h1>{sections[activeSection]}</h1>
          <p className="lede">Fill page 1 and page 3 fields, then download the completed PDF.</p>
        </section>

        <section className="wizard-progress" aria-label="Form sections">
          {sections.map((title, idx) => (
            <button
              key={title}
              type="button"
              className={`wizard-step${idx === activeSection ? ' active' : ''}`}
              onClick={() => setActiveSection(idx)}
            >
              <span>{idx + 1}</span>
              <small>{title}</small>
            </button>
          ))}
        </section>

        <section className="form-panel">
          {activeSection === 0 && (
            <div className="form-grid">
              <label>Inspection Date<input type="date" value={form.inspectionDate} onChange={(e) => updateField('inspectionDate', e.target.value)} /></label>
              <label>Certificate Reference<input value={form.certificateReference} onChange={(e) => updateField('certificateReference', e.target.value)} /></label>
              <label>Postcode<input value={form.postcode} onChange={(e) => updateField('postcode', e.target.value)} /></label>
              <label>Client Name<input value={form.clientName} onChange={(e) => updateField('clientName', e.target.value)} /></label>
              <label className="wide">Client Address<input value={form.clientAddress} onChange={(e) => updateField('clientAddress', e.target.value)} /></label>
              <label className="wide">Purpose of Certificate<input value={form.purposeText} onChange={(e) => updateField('purposeText', e.target.value)} /></label>
              <label className="wide">Extent Line 1<input value={form.extentLine1} onChange={(e) => updateField('extentLine1', e.target.value)} /></label>
              <label className="wide">Extent Line 2<input value={form.extentLine2} onChange={(e) => updateField('extentLine2', e.target.value)} /></label>
              <label className="wide">Installation Address<input value={form.installationAddress} onChange={(e) => updateField('installationAddress', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 1 && (
            <div className="form-grid">
              <label>Trading Title<input value={form.tradingTitle} onChange={(e) => updateField('tradingTitle', e.target.value)} /></label>
              <label>Inspector Name<input value={form.inspectorName} onChange={(e) => updateField('inspectorName', e.target.value)} /></label>
              <label className="wide">Contractor Address<input value={form.contractorAddress} onChange={(e) => updateField('contractorAddress', e.target.value)} /></label>
              <label>Signed Date<input type="date" value={form.signedDate} onChange={(e) => updateField('signedDate', e.target.value)} /></label>
              <label>Next Inspection Interval<input value={form.nextInspectionInterval} onChange={(e) => updateField('nextInspectionInterval', e.target.value)} /></label>
            </div>
          )}

          {activeSection === 2 && (
            <div className="appliance-table">
              <h3>Page 3 notes</h3>
              {form.notes.map((value, idx) => (
                <label key={`note-${idx}`}>
                  Note {idx + 1}
                  <input value={value} onChange={(e) => updateNote(idx, e.target.value)} />
                </label>
              ))}
            </div>
          )}

          {activeSection === 3 && (
            <div className="review-card">
              <p>Client: <strong>{form.clientName}</strong></p>
              <p>Reference: <strong>{form.certificateReference}</strong></p>
              <p>Notes filled: <strong>{form.notes.filter((n) => n.trim()).length}</strong></p>
              <button type="button" className="primary-action" onClick={downloadElcPdf} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Download Filled PDF'}
              </button>
            </div>
          )}

          <div className="wizard-footer">
            <button
              type="button"
              className="secondary-action"
              onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
              disabled={activeSection === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={() => (isLast ? downloadElcPdf() : setActiveSection((s) => s + 1))}
              disabled={isGenerating}
            >
              {isLast ? (isGenerating ? 'Generating...' : 'Download Filled PDF') : 'Next'}
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Certificates</p>
          <h1>Create the PDF</h1>
          <p className="lede">
            Pick the certificate template you want to create from the options
            below.
          </p>
        </div>

        <div className="hero-art">
          <img src={heroImg} alt="Certificate preview" />
        </div>
      </section>

      <section className="picker-panel" aria-labelledby="pdf-picker-title">
        <div className="picker-header">
          <div>
            <p className="eyebrow">Step 1</p>
            <h2 id="pdf-picker-title">Choose a PDF template</h2>
          </div>
          <p className="picker-note">7 templates available</p>
        </div>

        <div className="pdf-grid" role="list" aria-label="PDF templates">
          {pdfOptions.map((pdfName) => {
            const isSelected = pdfName === selectedPdf

            return (
              <button
                key={pdfName}
                type="button"
                className={`pdf-card${isSelected ? ' selected' : ''}`}
                onClick={() => setSelectedPdf(pdfName)}
                aria-pressed={isSelected}
              >
                <span className="pdf-index">PDF</span>
                <span className="pdf-name">{pdfName}</span>
                <span className="pdf-action">
                  {isSelected ? 'Selected' : 'Select'}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="selection-panel">
        <div>
          <p className="eyebrow">Current selection</p>
          <h2>{selectedPdf}</h2>
          <p className="selection-copy">
            Click the button to open the ELC layout and download as PDF.
          </p>
        </div>
        <button type="button" className="primary-action" onClick={openSelectedLayout}>
          Open Form
        </button>
      </section>
    </main>
  )
}

export default App
