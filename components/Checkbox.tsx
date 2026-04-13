'use client'

// ── Single checkbox ───────────────────────────────────────────
interface CheckboxProps {
  checked: boolean
  indeterminate?: boolean
  disabled?: boolean
  label?: string
  sublabel?: string
  onChange: (checked: boolean) => void
}

export function Checkbox({ checked, indeterminate, disabled, label, sublabel, onChange }: CheckboxProps) {
  return (
    <div
      className={`checkbox-item${checked ? ' checked' : ''}${indeterminate ? ' indeterminate' : ''}${disabled ? ' checkbox-disabled' : ''}`}
      onClick={() => !disabled && onChange(!checked)}
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); !disabled && onChange(!checked) }}}
    >
      <div className="checkbox-box" />
      {(label || sublabel) && (
        <div style={{ flex: 1 }}>
          {label && <div className="checkbox-label">{label}</div>}
          {sublabel && <div className="checkbox-sub">{sublabel}</div>}
        </div>
      )}
    </div>
  )
}

// ── Checkbox group ────────────────────────────────────────────
export interface CheckboxGroupItem {
  id: string
  label: string
  sublabel?: string
  disabled?: boolean
}

interface CheckboxGroupProps {
  items: CheckboxGroupItem[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function CheckboxGroup({ items, selected, onChange }: CheckboxGroupProps) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])
  }
  return (
    <div className="checkbox-group">
      {items.map(item => (
        <Checkbox
          key={item.id}
          checked={selected.includes(item.id)}
          disabled={item.disabled}
          label={item.label}
          sublabel={item.sublabel}
          onChange={() => toggle(item.id)}
        />
      ))}
    </div>
  )
}

// Standalone (no group border) — default export
export default Checkbox
