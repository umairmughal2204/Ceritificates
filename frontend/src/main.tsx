import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="app-root">
      <header className="app-brand-bar">
        <span className="app-brand-mark" aria-hidden="true">
          SSL
        </span>
        <span className="app-brand-name">Safety Spectrum London</span>
        <span className="app-brand-tag">Certificate workspace</span>
      </header>
      <App />
    </div>
  </StrictMode>,
)
