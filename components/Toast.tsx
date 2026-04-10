'use client'
import { useState, useEffect, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  undoLabel?: string
  onUndo?: () => void
  onDismiss?: () => void
}

type Listener = (toasts: Toast[]) => void
const listeners: Listener[] = []
let toasts: Toast[] = []

function notify() {
  listeners.forEach(l => l([...toasts]))
}

function addToast(message: string, type: ToastType = 'success', duration = 2800, undoLabel?: string, onUndo?: () => void, onDismiss?: () => void) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
  const t: Toast = { id, message, type, undoLabel, onUndo, onDismiss }
  toasts = [...toasts, t]
  notify()
  setTimeout(() => {
    toasts = toasts.filter(x => x.id !== id)
    notify()
    onDismiss?.()
  }, duration)
  return id
}

function removeToast(id: string) {
  toasts = toasts.filter(t => t.id !== id)
  notify()
}

// ── Public API ──────────────────────────────────────────────
export const toast = Object.assign(
  (message: string, type: ToastType = 'success', duration = 2800) =>
    addToast(message, type, duration),
  {
    success: (message: string, duration = 2800) =>
      addToast(message, 'success', duration),
    error: (message: string, duration = 3500) =>
      addToast(message, 'error', duration),
    info: (message: string, duration = 2800) =>
      addToast(message, 'info', duration),
    undo: (message: string, onUndo: () => void, onDismiss?: () => void, duration = 4000) =>
      addToast(message, 'success', duration, 'Undo', onUndo, onDismiss),
  }
)

// ── Container ───────────────────────────────────────────────
export function ToastContainer() {
  const [items, setItems] = useState<Toast[]>([])

  useEffect(() => {
    listeners.push(setItems)
    return () => { const i = listeners.indexOf(setItems); if (i > -1) listeners.splice(i, 1) }
  }, [])

  if (!items.length) return null

  const stripeColor = (type: ToastType) => {
    if (type === 'error') return 'var(--terracotta)'
    if (type === 'info') return 'var(--teal, #3A7A80)'
    return 'var(--sage)'
  }

  return (
    <div style={{
      position: 'fixed', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column', gap: '0.45rem',
      zIndex: 99999, pointerEvents: 'none', alignItems: 'center',
    }}>
      {items.map(t => (
        <div key={t.id} style={{
          pointerEvents: 'auto',
          display: 'flex',
          border: '2px solid var(--border-strong)',
          borderRadius: 6,
          overflow: 'hidden',
          background: 'var(--paper)',
          animation: 'toastIn 0.2s cubic-bezier(0.34,1.4,0.64,1)',
          minWidth: 240,
          maxWidth: '90vw',
        }}>
          {/* Colored stripe */}
          <div style={{ width: 5, flexShrink: 0, background: stripeColor(t.type) }} />
          {/* Body */}
          <div style={{
            flex: 1, padding: '8px 12px',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink)' }}>{t.message}</span>
            {t.undoLabel && t.onUndo && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
                <button onClick={() => { t.onUndo!(); removeToast(t.id) }} style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.52rem',
                  padding: '2px 7px',
                  border: '2px solid var(--border-strong)',
                  borderRadius: 2,
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--ink)',
                  letterSpacing: '0.04em',
                }}>
                  {t.undoLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
