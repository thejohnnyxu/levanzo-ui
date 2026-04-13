'use client'

export type SpinnerSize = 'sm' | 'md' | 'lg'
export type SpinnerColor = 'terracotta' | 'sage' | 'gold' | 'ink'

interface SpinnerProps {
  size?: SpinnerSize
  color?: SpinnerColor
  label?: string
}

export default function Spinner({ size = 'md', color = 'terracotta', label }: SpinnerProps) {
  return (
    <div className="spinner-wrap">
      <div className={`spinner spinner-${size} spinner-${color}`} role="status" aria-label={label ?? 'Loading'} />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  )
}
