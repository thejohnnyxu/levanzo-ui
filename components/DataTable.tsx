'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowUp, ArrowDown, LayoutGrid, LayoutList, Table2 } from 'lucide-react'

// ─── ViewToggle ───────────────────────────────────────────────

export type ViewMode = 'grid' | 'compact' | 'table'

export function ViewToggle({
  view,
  setView,
  storageKey,
}: {
  view: ViewMode
  setView: (v: ViewMode) => void
  storageKey: string
}) {
  function set(v: ViewMode) {
    setView(v)
    try { localStorage.setItem(storageKey, v) } catch {}
  }
  return (
    <div style={{ display: 'flex', border: '2px solid var(--border-strong)', borderRadius: 4, overflow: 'hidden', height: 'var(--ctrl-h, 36px)', boxSizing: 'border-box' }}>
      {([
        { id: 'grid' as ViewMode, icon: <LayoutGrid size={14} />, title: 'Grid' },
        { id: 'compact' as ViewMode, icon: <LayoutList size={14} />, title: 'Compact' },
        { id: 'table' as ViewMode, icon: <Table2 size={14} />, title: 'Table' },
      ] as const).map((v, i) => (
        <button
          key={v.id}
          title={v.title}
          onClick={() => set(v.id)}
          style={{
            padding: '0 0.55rem', border: 'none',
            borderLeft: i > 0 ? '2px solid var(--border-strong)' : 'none',
            cursor: 'pointer',
            background: view === v.id ? 'var(--terracotta)' : 'transparent',
            color: view === v.id ? '#fff' : 'var(--ink-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {v.icon}
        </button>
      ))}
    </div>
  )
}

export function useViewMode(storageKey: string, defaultView: ViewMode = 'grid'): [ViewMode, (v: ViewMode) => void] {
  const [view, setView] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved === 'grid' || saved === 'compact' || saved === 'table') return saved
    } catch {}
    return defaultView
  })
  return [view, setView]
}

// ─── DataTable ────────────────────────────────────────────────

export type ColDef<T> = {
  key: string
  label: string
  width?: number | string
  sortValue?: (row: T) => string | number | null
  render?: (row: T) => React.ReactNode
  defaultVisible?: boolean
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  storageKey,
  onRowClick,
  emptyMessage = 'No data',
}: {
  columns: ColDef<T>[]
  data: T[]
  storageKey: string
  onRowClick?: (row: T) => void
  emptyMessage?: string
}) {
  const colsStorageKey = `dt-cols:${storageKey}`

  const [visibleKeys, setVisibleKeys] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(colsStorageKey)
      if (saved) return JSON.parse(saved)
    } catch {}
    return columns.filter(c => c.defaultVisible !== false).map(c => c.key)
  })
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<1 | -1>(1)
  const [showColPicker, setShowColPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try { localStorage.setItem(colsStorageKey, JSON.stringify(visibleKeys)) } catch {}
  }, [visibleKeys, colsStorageKey])

  useEffect(() => {
    if (!showColPicker) return
    function handler(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setShowColPicker(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showColPicker])

  const visCols = visibleKeys.map(k => columns.find(c => c.key === k)).filter(Boolean) as ColDef<T>[]

  function toggleCol(key: string) {
    setVisibleKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 1 ? -1 : 1)
    else { setSortKey(key); setSortDir(1) }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const col = columns.find(c => c.key === sortKey)
    let va = col?.sortValue ? col.sortValue(a) : (a as any)[sortKey]
    let vb = col?.sortValue ? col.sortValue(b) : (b as any)[sortKey]
    if (va == null) va = ''
    if (vb == null) vb = ''
    if (typeof va === 'number' && typeof vb === 'number') return sortDir * (va - vb)
    return sortDir * String(va).localeCompare(String(vb))
  })

  const thStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--table-header-text)',
    textAlign: 'left',
    borderBottom: '2px solid var(--border-strong)',
    background: 'var(--table-header-bg)',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  }
  const tdStyle: React.CSSProperties = {
    padding: '0.6rem 0.75rem',
    fontSize: '0.83rem',
    borderBottom: '2px solid var(--border-strong)',
    verticalAlign: 'middle',
    color: 'var(--ink)',
  }

  return (
    <div>
      {/* Column picker */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem', position: 'relative' }}>
        <div ref={pickerRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowColPicker(v => !v)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
          >
            <Table2 size={12} /> Columns
          </button>
          {showColPicker && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 50,
              background: 'var(--paper)', border: '2px solid var(--border-strong)',
              borderRadius: 4, padding: '0.5rem', minWidth: 180
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', padding: '0 0.25rem' }}>
                Show / hide columns
              </div>
              {columns.map(col => {
                const on = visibleKeys.includes(col.key)
                return (
                  <label key={col.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.25rem', borderRadius: 4, cursor: 'pointer', background: on ? 'rgba(194,98,58,0.05)' : 'transparent' }}>
                    <input type="checkbox" checked={on} onChange={() => toggleCol(col.key)} style={{ accentColor: 'var(--terracotta)', margin: 0 }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: on ? 500 : 400, color: on ? 'var(--ink)' : 'var(--ink-muted)' }}>{col.label}</span>
                  </label>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ overflowX: 'auto', border: '2px solid var(--border-strong)', borderRadius: 6 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono, monospace)' }}>
          <thead>
            <tr>
              {visCols.map(col => (
                <th key={col.key} style={{ ...thStyle, width: col.width || 'auto' }} onClick={() => handleSort(col.key)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    {col.label}
                    {sortKey === col.key && (sortDir === 1 ? <ArrowDown size={11} /> : <ArrowUp size={11} />)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, ri) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                style={{
                  background: ri % 2 === 0 ? 'var(--paper)' : 'var(--cream)',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (onRowClick) (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(194,98,58,0.05)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = ri % 2 === 0 ? 'var(--paper)' : 'var(--cream)' }}
              >
                {visCols.map(col => (
                  <td key={col.key} style={tdStyle}>
                    {col.render ? col.render(row) : String((row as any)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', fontSize: '0.85rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  )
}
