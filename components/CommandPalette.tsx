'use client'
import { useState, useEffect, useRef } from 'react'

export interface CommandItem {
  id: string
  label: string
  sublabel?: string
  group?: string
  kbd?: string
  icon?: string
  onSelect: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  items: CommandItem[]
  placeholder?: string
}

export default function CommandPalette({ open, onClose, items, placeholder = 'Search…' }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset and focus on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setFocusedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); setQuery('') }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  const filtered = query
    ? items.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.sublabel?.toLowerCase().includes(query.toLowerCase())
      )
    : items

  // Group items
  const grouped: { group: string; items: CommandItem[] }[] = []
  filtered.forEach(item => {
    const g = item.group ?? ''
    const existing = grouped.find(g2 => g2.group === g)
    if (existing) existing.items.push(item)
    else grouped.push({ group: g, items: [item] })
  })

  const flatItems = grouped.flatMap(g => g.items)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, flatItems.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && flatItems[focusedIndex]) {
      flatItems[focusedIndex].onSelect()
      onClose()
      setQuery('')
    }
  }

  if (!open) return null

  let flatIdx = 0

  return (
    <div className="cmd-overlay" onClick={onClose} role="dialog" aria-modal aria-label="Command palette">
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div className="cmd-search">
          <div className="cmd-search-icon">⌕</div>
          <input
            ref={inputRef}
            className="cmd-search-input"
            placeholder={placeholder}
            value={query}
            onChange={e => { setQuery(e.target.value); setFocusedIndex(0) }}
            onKeyDown={handleKeyDown}
          />
          <div className="cmd-search-esc">
            <kbd className="cmd-esc-key">esc</kbd>
          </div>
        </div>

        <div className="cmd-results">
          {grouped.length === 0 && (
            <div className="cmd-empty">No results for "{query}"</div>
          )}
          {grouped.map(g => (
            <div key={g.group}>
              {g.group && <div className="cmd-group-label">{g.group}</div>}
              {g.items.map(item => {
                const idx = flatIdx++
                const focused = idx === focusedIndex
                return (
                  <div
                    key={item.id}
                    className={`cmd-item${focused ? ' focused' : ''}`}
                    onClick={() => { item.onSelect(); onClose(); setQuery('') }}
                    onMouseEnter={() => setFocusedIndex(idx)}
                  >
                    {item.icon && <div className="cmd-item-icon">{item.icon}</div>}
                    <div className="cmd-item-text">
                      <div>{item.label}</div>
                      {item.sublabel && <div className="cmd-item-sub">{item.sublabel}</div>}
                    </div>
                    {item.kbd && <div className="cmd-item-kbd">{item.kbd}</div>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="cmd-footer">
          <span>↑↓ navigate</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>↵ select</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}
