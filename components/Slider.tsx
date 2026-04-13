'use client'

interface SliderProps {
  label?: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  formatValue?: (value: number) => string
  ticks?: string[]
  color?: 'terracotta' | 'sage' | 'gold'
}

export default function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  formatValue,
  ticks,
  color = 'terracotta',
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  const display = formatValue ? formatValue(value) : String(value)

  return (
    <div className="slider-wrap">
      {(label || true) && (
        <div className="slider-header">
          {label && <span className="slider-label">{label}</span>}
          <span className="slider-value">{display}</span>
        </div>
      )}
      <div className="slider-track">
        <div className="slider-fill" style={{ width: `${pct}%`, background: `var(--${color})` }} />
        <div className="slider-thumb" style={{ left: `${pct}%`, borderColor: `var(--${color})` }} />
        <input
          type="range"
          className="slider-native"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          aria-label={label}
        />
      </div>
      {ticks && (
        <div className="slider-ticks">
          {ticks.map((t, i) => <span key={i} className="slider-tick">{t}</span>)}
        </div>
      )}
    </div>
  )
}
