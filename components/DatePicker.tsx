'use client'
import { useState, useRef, useEffect } from 'react'

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  label?: string
  placeholder?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

function sameDay(a: Date, b: Date) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate()
}

function formatDisplay(d: Date) {
  return `${MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`
}

// Try to parse a typed string into a Date — accepts:
// Apr 13, 2026 / 04/13/2026 / 4-13-26 / 2026-04-13 / April 13 2026
function parseInput(s: string): Date | null {
  if (!s.trim()) return null
  const d = new Date(s)
  if (!isNaN(d.getTime())) return d
  // Try MM/DD/YYYY or MM-DD-YYYY
  const mdy = s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})$/)
  if (mdy) {
    const yr = mdy[3].length === 2 ? 2000 + parseInt(mdy[3]) : parseInt(mdy[3])
    const parsed = new Date(yr, parseInt(mdy[1]) - 1, parseInt(mdy[2]))
    if (!isNaN(parsed.getTime())) return parsed
  }
  return null
}

export default function DatePicker({ value, onChange, label, placeholder = 'e.g. Apr 13, 2026' }: DatePickerProps) {
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(value ?? today)
  const [inputVal, setInputVal] = useState(value ? formatDisplay(value) : '')
  const [inputError, setInputError] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Sync input when value changes externally
  useEffect(() => {
    setInputVal(value ? formatDisplay(value) : '')
    setInputError(false)
  }, [value])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        // Restore display value on close without confirm
        setInputVal(value ? formatDisplay(value) : '')
        setInputError(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, value])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: { date: Date; thisMonth: boolean }[] = []
  const daysInPrev = new Date(year, month, 0).getDate()
  for (let i = 0; i < firstDow; i++) {
    cells.push({ date: new Date(year, month - 1, daysInPrev - firstDow + i + 1), thisMonth: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(year, month, i), thisMonth: true })
  }
  while (cells.length < 42) {
    cells.push({ date: new Date(year, month + 1, cells.length - daysInMonth - firstDow + 1), thisMonth: false })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputVal(val)
    setInputError(false)
    // Live parse as user types
    const parsed = parseInput(val)
    if (parsed) setCursor(parsed)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const parsed = parseInput(inputVal)
      if (parsed) {
        onChange(parsed)
        setCursor(parsed)
        setInputError(false)
        setOpen(false)
      } else if (inputVal.trim()) {
        setInputError(true)
      }
    }
    if (e.key === 'Escape') {
      setOpen(false)
      setInputVal(value ? formatDisplay(value) : '')
      setInputError(false)
    }
  }

  const selectDay = (date: Date) => {
    setCursor(date)
    setInputVal(formatDisplay(date))
    setInputError(false)
  }

  const apply = () => {
    const parsed = parseInput(inputVal)
    if (parsed) {
      onChange(parsed)
      setInputError(false)
    } else if (inputVal.trim()) {
      setInputError(true)
      return
    } else {
      onChange(null)
    }
    setOpen(false)
  }

  const clear = () => {
    onChange(null)
    setInputVal('')
    setInputError(false)
    setOpen(false)
  }

  return (
    <div className="dp-wrap" ref={wrapRef}>
      {label && <div className="dp-label">{label}</div>}
      <div className={`dp-trigger${open ? ' open' : ''}${inputError ? ' error' : ''}`}>
        <input
          className="dp-input"
          value={inputVal}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          className="dp-caret"
          onClick={() => setOpen(v => !v)}
          tabIndex={-1}
          aria-label="Open calendar"
        >▾</button>
      </div>
      {inputError && <div className="dp-error">✕ invalid date format</div>}

      {open && (
        <div className="dp-calendar">
          <div className="dp-cal-header">
            <button className="dp-nav-btn" onClick={() => setCursor(new Date(year, month - 1, 1))}>‹</button>
            <span className="dp-month-label">{MONTHS[month]} {year}</span>
            <button className="dp-nav-btn" onClick={() => setCursor(new Date(year, month + 1, 1))}>›</button>
          </div>
          <div className="dp-grid">
            <div className="dp-day-names">
              {DAYS.map(d => <div key={d} className="dp-day-name">{d}</div>)}
            </div>
            <div className="dp-days">
              {cells.map((cell, i) => {
                const isToday = sameDay(cell.date, today)
                const isSelected = value ? sameDay(cell.date, value) : false
                const isCursor = sameDay(cell.date, cursor) && !isSelected
                return (
                  <div
                    key={i}
                    className={[
                      'dp-day',
                      !cell.thisMonth ? 'other-month' : '',
                      isToday ? 'today' : '',
                      isSelected ? 'selected' : '',
                      isCursor && cell.thisMonth ? 'cursor' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => cell.thisMonth && selectDay(cell.date)}
                  >
                    {cell.date.getDate()}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="dp-footer">
            <button className="dp-today-btn" onClick={() => { selectDay(today); setInputVal(formatDisplay(today)) }}>today</button>
            <div style={{ display: 'flex', gap: 5 }}>
              <button className="dp-btn" onClick={clear}>clear</button>
              <button className="dp-btn dp-btn-confirm" onClick={apply}>apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
