'use client'

export interface Step {
  label: string
  description?: string
}

interface StepsProps {
  steps: Step[]
  current: number   // 0-indexed, current active step
}

export default function Steps({ steps, current }: StepsProps) {
  return (
    <div className="steps" role="list" aria-label="Progress">
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <div
            key={i}
            className={`step${done ? ' done' : ''}${active ? ' active' : ''}`}
            role="listitem"
            aria-current={active ? 'step' : undefined}
          >
            <div className="step-node">
              <div className="step-dot">{done ? '✓' : i + 1}</div>
              <div className="step-label">{step.label}</div>
            </div>
            {i < steps.length - 1 && <div className="step-line" />}
          </div>
        )
      })}
    </div>
  )
}
