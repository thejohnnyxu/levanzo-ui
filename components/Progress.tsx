'use client'

interface ProgressProps {
  label?: string
  value?: number        // 0–100, omit for indeterminate
  displayValue?: string // e.g. "$186 / $250", overrides auto %
  color?: 'terracotta' | 'sage' | 'gold' | 'teal'
}

export default function Progress({ label, value, displayValue, color = 'terracotta' }: ProgressProps) {
  const indeterminate = value === undefined
  return (
    <div className="progress-wrap">
      {(label || !indeterminate) && (
        <div className="progress-header">
          {label && <span className="progress-label">{label}</span>}
          {!indeterminate && (
            <span className="progress-value">
              {displayValue ?? `${Math.round(value!)}%`}
            </span>
          )}
        </div>
      )}
      <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`progress-fill progress-fill-${color}${indeterminate ? ' progress-fill-indeterminate' : ''}`}
          style={!indeterminate ? { width: `${value}%` } : undefined}
        />
      </div>
    </div>
  )
}
