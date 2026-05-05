import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrandBar } from './components/BrandBar'
import { CertificateSessionProvider } from './context/CertificateSessionContext'
import { CompanyBrandingProvider } from './context/CompanyBrandingContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CompanyBrandingProvider>
      <CertificateSessionProvider>
        <div className="app-root">
          <BrandBar />
          <App />
        </div>
      </CertificateSessionProvider>
    </CompanyBrandingProvider>
  </StrictMode>,
)
