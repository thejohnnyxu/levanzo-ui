'use client'
import { useState } from 'react'

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  label?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December']

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate()
}

export default function DatePicker({ value, onChange, label }: DatePickerProps) {
  const today = new Date()
  const [cursor, setCursor] = useState(value ?? today)
  const [open, setOpen] = useState(false)

  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  // First day-of-week for month, and total days
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  // Build grid: 6 weeks × 7 days
  const cells: { date: Date; thisMonth: boolean }[] = []
  for (let i = 0; i < firstDow; i++) {
    cells.push({ date: new Date(year, month - 1, daysInPrev - firstDow + i + 1), thisMonth: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(year, month, i), thisMonth: true })
  }
  while (cells.length < 42) {
    cells.push({ date: new Date(year, month + 1, cells.length - daysInMonth - firstDow + 1), thisMonth: false })
  }

  const prevMonth = () => setCursor(new Date(year, month - 1, 1))
  const nextMonth = () => setCursor(new Date(year, month + 1, 1))

  const select = (date: Date) => {
    onChange(date)
    setCursor(date)
  }

  // Trigger display
  const displayValue = value
    ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Select date'

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {label && <div className="field-label" style={{ marginBottom: 4 }}>{label}</div>}
      <div
        className={`field-input${open ? ' focused' : ''}`}
        style={{ width: 200, cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setOpen(v => !v)}
      >
        <input
          readOnly
          className="combobox-input"
          value={displayValue}
          style={{ cursor: 'pointer' }}
        />
        <div className="field-suffix" style={{ cursor: 'pointer' }}>▾</div>
      </div>

      {open && (
        <div className="date-picker" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50 }}>
          <div className="dp-header">
            <button className="dp-nav-btn" onClick={prevMonth}>‹</button>
            <span className="dp-month">{MONTHS[month]} {year}</span>
            <button className="dp-nav-btn" onClick={nextMonth}>›</button>
          </div>
          <div className="dp-grid">
            <div className="dp-day-names">
              {DAYS.map(d => <div key={d} className="dp-day-name">{d}</div>)}
            </div>
            <div className="dp-days">
              {cells.map((cell, i) => {
                const isToday = sameDay(cell.date, today)
                const isSelected = value ? sameDay(cell.date, value) : false
                return (
                  <div
                    key={i}
                    className={[
                      'dp-day',
                      !cell.thisMonth ? 'other-month' : '',
                      isToday ? 'today' : '',
                      isSelected ? 'selected' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => { select(cell.date); setOpen(false) }}
                  >
                    {cell.date.getDate()}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="dp-footer">
            <button className="dp-btn" onClick={() => { select(today); setOpen(false) }}>today</button>
            <button className="dp-btn" onClick={() => { onChange(null); setOpen(false) }}>clear</button>
            <button className="dp-btn confirm" onClick={() => setOpen(false)}>apply</button>
          </div>
        </div>
      )}
    </div>
  )
}
