'use client'
import { useState, useRef, useEffect } from 'react'

export interface ComboboxOption {
  value: string
  label: string
  sublabel?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  label?: string
  emptyMessage?: string
}

export default function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Search…',
  label,
  emptyMessage = 'No results',
}: ComboboxProps) {
  const selected = options.find(o => o.value === value) ?? null
  const [query, setQuery] = useState(selected?.label ?? '')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(selected?.label ?? '')
  }, [value])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const filtered = query
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  const highlight = (text: string) => {
    if (!query) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <span className="combobox-match">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    )
  }

  return (
    <div className="combobox-wrap" ref={ref}>
      {label && <div className="field-label" style={{ marginBottom: 4 }}>{label}</div>}
      <div className={`combobox-input-row${open ? ' open' : ''}`}>
        <input
          className="combobox-input"
          value={query}
          placeholder={placeholder}
          onFocus={() => { setOpen(true); setQuery('') }}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onKeyDown={e => {
            if (e.key === 'Escape') { setOpen(false); setQuery(selected?.label ?? '') }
            if (e.key === 'Enter' && filtered.length > 0) {
              onChange(filtered[0].value)
              setQuery(filtered[0].label)
              setOpen(false)
            }
          }}
          autoComplete="off"
        />
        {value && (
          <button
            className="combobox-clear"
            onClick={() => { onChange(null); setQuery(''); setOpen(false) }}
            aria-label="Clear"
          >✕</button>
        )}
      </div>
      {open && (
        <div className="combobox-menu">
          {filtered.length === 0 ? (
            <div className="combobox-hint">{emptyMessage}</div>
          ) : (
            <>
              {filtered.map(opt => (
                <div
                  key={opt.value}
                  className={`combobox-item${opt.value === value ? ' selected' : ''}`}
                  onMouseDown={() => { onChange(opt.value); setQuery(opt.label); setOpen(false) }}
                >
                  <span>{highlight(opt.label)}</span>
                  {opt.value === value && <span style={{ color: 'var(--terracotta)', fontFamily: 'var(--font-mono)' }}>✓</span>}
                </div>
              ))}
              <div className="combobox-hint">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
