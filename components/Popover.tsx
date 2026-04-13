'use client'
import { useState, useRef, useEffect } from 'react'

interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  title?: string
  footer?: React.ReactNode
}

export default function Popover({ trigger, children, title, footer }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="popover-wrap" ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <div onClick={() => setOpen(v => !v)}>{trigger}</div>
      {open && (
        <div className="popover" role="dialog">
          {title && <div className="popover-header">{title}</div>}
          <div className="popover-body">{children}</div>
          {footer && <div className="popover-footer">{footer}</div>}
        </div>
      )}
    </div>
  )
}
