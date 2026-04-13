'use client'
import { useState } from 'react'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  action?: { label: string; onClick: () => void }
  dismissible?: boolean
}

export default function Alert({ variant = 'info', title, children, action, dismissible }: AlertProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div className={`alert alert-${variant}`} role="alert">
      <div className="alert-spine" />
      <div className="alert-body">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-msg">{children}</div>
        {action && (
          <div className="alert-actions">
            <button className="alert-link" onClick={action.onClick}>{action.label}</button>
          </div>
        )}
      </div>
      {dismissible && (
        <button className="alert-dismiss" onClick={() => setDismissed(true)} aria-label="Dismiss">✕</button>
      )}
    </div>
  )
}
