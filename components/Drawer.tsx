'use client'
import { useEffect } from 'react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  width?: number
}

export default function Drawer({ open, onClose, title, children, footer, width = 360 }: DrawerProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="drawer-overlay" onClick={onClose} aria-modal role="dialog" aria-label={title}>
      <div
        className="drawer"
        style={{ width }}
        onClick={e => e.stopPropagation()}
      >
        <div className="drawer-header">
          <span className="drawer-title">{title}</span>
          <button className="drawer-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-footer">{footer}</div>}
      </div>
    </div>
  )
}
