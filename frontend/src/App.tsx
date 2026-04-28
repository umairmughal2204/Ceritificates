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

function App() {
  const [selectedPdf, setSelectedPdf] = useState(pdfOptions[0])
  const openSelectedLayout = () => {
    if (selectedPdf !== elcPdfName) {
      window.alert('Layout is currently available only for Safety Spectrum London elc.')
      return
    }

    window.open('/src/templates/safety-spectrum-london-elc.html', '_blank', 'noopener,noreferrer')
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
          Open Layout
        </button>
      </section>
    </main>
  )
}

export default App
