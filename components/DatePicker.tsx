'use client'
import { useState, useRef, useEffect } from 'react'

export type PickerMode = 'date' | 'time' | 'datetime'

interface DateTimePickerProps {
  mode?: PickerMode
  value: Date | null
  onChange: (date: Date | null) => void
  label?: string
  placeholder?: string
}

const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']
const HOURS  = Array.from({length:12},(_,i)=>i+1)
const MINS   = Array.from({length:12},(_,i)=>i*5)

function sameDay(a: Date, b: Date) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate()
}

function formatDate(d: Date)     { return `${MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}` }
function formatTime(d: Date)     { const h=d.getHours(); const m=d.getMinutes(); return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}` }
function formatDatetime(d: Date) { return `${formatDate(d)} · ${formatTime(d)}` }

function formatDisplay(d: Date, mode: PickerMode) {
  if (mode==='date')     return formatDate(d)
  if (mode==='time')     return formatTime(d)
  return formatDatetime(d)
}

function getPlaceholder(mode: PickerMode) {
  if (mode==='date')     return 'e.g. Apr 13, 2026'
  if (mode==='time')     return 'e.g. 2:30 PM'
  return 'e.g. Apr 13, 2026 · 2:30 PM'
}

function parseInput(s: string, mode: PickerMode): Date | null {
  if (!s.trim()) return null
  if (mode === 'time') {
    const m = s.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i)
    if (m) {
      const h = parseInt(m[1]) + (m[3]?.toLowerCase()==='pm' && parseInt(m[1])!==12 ? 12 : 0)
      const d = new Date(); d.setHours(h, parseInt(m[2]), 0, 0)
      return d
    }
    return null
  }
  const d = new Date(s)
  if (!isNaN(d.getTime())) return d
  const mdy = s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})$/)
  if (mdy) {
    const yr = mdy[3].length===2 ? 2000+parseInt(mdy[3]) : parseInt(mdy[3])
    const p = new Date(yr, parseInt(mdy[1])-1, parseInt(mdy[2]))
    if (!isNaN(p.getTime())) return p
  }
  return null
}

export default function DatePicker({ mode='date', value, onChange, label, placeholder }: DateTimePickerProps) {
  const today    = new Date()
  const [open,       setOpen]       = useState(false)
  const [cursor,     setCursor]     = useState(value ?? today)
  const [inputVal,   setInputVal]   = useState(value ? formatDisplay(value, mode) : '')
  const [inputError, setInputError] = useState(false)
  // Time state (hour 1-12, minute 0-59, ampm)
  const [hour,  setHour]  = useState(value ? (value.getHours()%12||12) : 12)
  const [min,   setMin]   = useState(value ? Math.round(value.getMinutes()/5)*5 : 0)
  const [ampm,  setAmpm]  = useState<'AM'|'PM'>(value ? (value.getHours()>=12?'PM':'AM') : 'AM')
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputVal(value ? formatDisplay(value, mode) : '')
    setInputError(false)
    if (value) {
      setCursor(value)
      setHour(value.getHours()%12||12)
      setMin(Math.round(value.getMinutes()/5)*5)
      setAmpm(value.getHours()>=12?'PM':'AM')
    }
  }, [value, mode])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        setInputVal(value ? formatDisplay(value, mode) : '')
        setInputError(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, value, mode])

  // Build calendar cells
  const year  = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month+1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()
  const cells: { date: Date; thisMonth: boolean }[] = []
  for (let i=0; i<firstDow; i++) cells.push({ date: new Date(year, month-1, daysInPrev-firstDow+i+1), thisMonth: false })
  for (let i=1; i<=daysInMonth; i++) cells.push({ date: new Date(year, month, i), thisMonth: true })
  while (cells.length<42) cells.push({ date: new Date(year, month+1, cells.length-daysInMonth-firstDow+1), thisMonth: false })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputVal(val)
    setInputError(false)
    const parsed = parseInput(val, mode)
    if (parsed) setCursor(parsed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key==='Enter') {
      const parsed = parseInput(inputVal, mode)
      if (parsed) { onChange(parsed); setInputError(false); setOpen(false) }
      else if (inputVal.trim()) setInputError(true)
    }
    if (e.key==='Escape') { setOpen(false); setInputVal(value ? formatDisplay(value, mode) : ''); setInputError(false) }
  }

  const selectDay = (date: Date) => {
    setCursor(date)
    const d = new Date(date)
    if (mode !== 'date') {
      const h24 = ampm==='PM' ? (hour===12?12:hour+12) : (hour===12?0:hour)
      d.setHours(h24, min, 0, 0)
    }
    setInputVal(formatDisplay(d, mode))
    setInputError(false)
  }

  const buildResult = (): Date => {
    const base = (mode==='time') ? new Date() : cursor
    const d = new Date(base)
    if (mode !== 'date') {
      const h24 = ampm==='PM' ? (hour===12?12:hour+12) : (hour===12?0:hour)
      d.setHours(h24, min, 0, 0)
    }
    return d
  }

  const apply = () => {
    const parsed = parseInput(inputVal, mode)
    if (parsed) { onChange(parsed); setInputError(false); setOpen(false); return }
    if (inputVal.trim()) { setInputError(true); return }
    const result = buildResult()
    onChange(result)
    setInputVal(formatDisplay(result, mode))
    setOpen(false)
  }

  const clear = () => { onChange(null); setInputVal(''); setInputError(false); setOpen(false) }

  const ph = placeholder ?? getPlaceholder(mode)
  const showCalendar = mode === 'date' || mode === 'datetime'
  const showTime     = mode === 'time' || mode === 'datetime'

  return (
    <div className="dp-wrap" ref={wrapRef}>
      {label && <div className="dp-label">{label}</div>}
      <div className={`dp-trigger${open?' open':''}${inputError?' error':''}`}>
        <input
          className="dp-input"
          value={inputVal}
          placeholder={ph}
          onFocus={() => setOpen(true)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        <button className="dp-caret" onClick={() => setOpen(v=>!v)} tabIndex={-1}>▾</button>
      </div>
      {inputError && <div className="dp-error">✕ invalid format</div>}

      {open && (
        <div className="dp-calendar">

          {/* ── Date grid ── */}
          {showCalendar && (
            <>
              <div className="dp-cal-header">
                <button className="dp-nav-btn" onClick={() => setCursor(new Date(year, month-1, 1))}>‹</button>
                <span className="dp-month-label">{MONTHS[month]} {year}</span>
                <button className="dp-nav-btn" onClick={() => setCursor(new Date(year, month+1, 1))}>›</button>
              </div>
              <div className="dp-grid">
                <div className="dp-day-names">
                  {DAYS.map(d => <div key={d} className="dp-day-name">{d}</div>)}
                </div>
                <div className="dp-days">
                  {cells.map((cell, i) => {
                    const isToday    = sameDay(cell.date, today)
                    const isSelected = value ? sameDay(cell.date, value) : false
                    const isCursor   = sameDay(cell.date, cursor) && !isSelected
                    return (
                      <div
                        key={i}
                        className={['dp-day', !cell.thisMonth?'other-month':'', isToday?'today':'', isSelected?'selected':'', isCursor&&cell.thisMonth?'cursor':''].filter(Boolean).join(' ')}
                        onClick={() => cell.thisMonth && selectDay(cell.date)}
                      >{cell.date.getDate()}</div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* ── Time picker ── */}
          {showTime && (
            <div className={`dp-time${showCalendar ? ' dp-time-border' : ''}`}>
              {!showCalendar && (
                <div className="dp-time-label">Time</div>
              )}
              <div className="dp-time-row">
                <div className="dp-time-col">
                  <button className="dp-time-arrow" onClick={() => setHour(h => h===12?1:h+1)}>▲</button>
                  <div className="dp-time-val">{String(hour).padStart(2,'0')}</div>
                  <button className="dp-time-arrow" onClick={() => setHour(h => h===1?12:h-1)}>▼</button>
                </div>
                <div className="dp-time-sep">:</div>
                <div className="dp-time-col">
                  <button className="dp-time-arrow" onClick={() => setMin(m => (m+5)%60)}>▲</button>
                  <div className="dp-time-val">{String(min).padStart(2,'0')}</div>
                  <button className="dp-time-arrow" onClick={() => setMin(m => (m-5+60)%60)}>▼</button>
                </div>
                <div className="dp-ampm-wrap">
                  <button className={`dp-ampm${ampm==='AM'?' active':''}`} onClick={() => setAmpm('AM')}>AM</button>
                  <button className={`dp-ampm${ampm==='PM'?' active':''}`} onClick={() => setAmpm('PM')}>PM</button>
                </div>
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="dp-footer">
            {showCalendar && (
              <button className="dp-today-btn" onClick={() => { selectDay(today); setInputVal(formatDisplay(mode==='date'?today:buildResult(), mode)) }}>today</button>
            )}
            {!showCalendar && <div />}
            <div style={{display:'flex',gap:5}}>
              <button className="dp-btn" onClick={clear}>clear</button>
              <button className="dp-btn dp-btn-confirm" onClick={apply}>apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Named exports for convenience
export function TimePicker(props: Omit<DateTimePickerProps,'mode'>) {
  return <DatePicker {...props} mode="time" />
}
export function DateTimePicker(props: Omit<DateTimePickerProps,'mode'>) {
  return <DatePicker {...props} mode="datetime" />
}
