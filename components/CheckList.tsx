'use client'
import { useState } from 'react'

export interface CheckListItem {
  id: string
  label: string
  meta?: string          // e.g. "½ gal", "2 oz", "3 ct"
  tag?: string           // e.g. store name, category
  tagColor?: 'sage' | 'gold' | 'teal' | 'terracotta' | 'ink'
}

interface CheckListProps {
  items: CheckListItem[]
  checked?: string[]                          // controlled
  defaultChecked?: string[]                   // uncontrolled
  onChange?: (checked: string[]) => void
}

export default function CheckList({ items, checked: controlledChecked, defaultChecked = [], onChange }: CheckListProps) {
  const [internalChecked, setInternalChecked] = useState<string[]>(defaultChecked)
  const checked = controlledChecked ?? internalChecked

  const toggle = (id: string) => {
    const next = checked.includes(id)
      ? checked.filter(c => c !== id)
      : [...checked, id]
    setInternalChecked(next)
    onChange?.(next)
  }

  return (
    <div className="checklist">
      {items.map(item => {
        const isChecked = checked.includes(item.id)
        return (
          <div
            key={item.id}
            className={`checklist-row${isChecked ? ' checklist-row-checked' : ''}`}
            onClick={() => toggle(item.id)}
            role="checkbox"
            aria-checked={isChecked}
            tabIndex={0}
            onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(item.id) } }}
          >
            <div className="checklist-check">
              <div className={`checklist-box${isChecked ? ' checklist-box-checked' : ''}`}>
                {isChecked && <span className="checklist-check-mark">✓</span>}
              </div>
            </div>
            <div className="checklist-content">
              <span className={`checklist-label${isChecked ? ' checklist-label-done' : ''}`}>
                {item.label}
              </span>
              <div className="checklist-chips">
                {item.meta && (
                  <span className="checklist-meta">{item.meta}</span>
                )}
                {item.tag && (
                  <span className={`checklist-tag checklist-tag-${item.tagColor ?? 'ink'}`}>
                    {item.tag}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
