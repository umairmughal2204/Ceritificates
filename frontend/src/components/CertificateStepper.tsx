const STEPS = ['Company', 'Certificate', 'Customize', 'Download'] as const

type Props = {
  /** 0-based index of the current step (0–3) */
  activeIndex: number
}

export function CertificateStepper({ activeIndex }: Props) {
  return (
    <nav className="cert-stepper" aria-label="Certificate progress">
      <ol className="cert-stepper-list">
        {STEPS.map((label, idx) => {
          const state = idx < activeIndex ? 'done' : idx === activeIndex ? 'current' : 'upcoming'
          return (
            <li key={label} className={`cert-step cert-step--${state}`}>
              <span className="cert-step-index" aria-hidden="true">
                {idx < activeIndex ? '✓' : idx + 1}
              </span>
              <span className="cert-step-label">{label}</span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
