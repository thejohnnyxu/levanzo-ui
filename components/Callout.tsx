'use client'

export type CalloutVariant = 'note' | 'tip' | 'warn' | 'danger'

interface CalloutProps {
  variant?: CalloutVariant
  title?: string
  children: React.ReactNode
}

export default function Callout({ variant = 'note', title, children }: CalloutProps) {
  return (
    <div className={`callout callout-${variant}`}>
      <div className="callout-spine" />
      <div className="callout-body">
        {title && <div className="callout-title">{title}</div>}
        <div className="callout-text">{children}</div>
      </div>
    </div>
  )
}
