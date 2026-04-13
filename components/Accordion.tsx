'use client'
import { useState } from 'react'

export interface AccordionItem {
  id: string
  label: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  defaultOpen?: string[]
  multiple?: boolean  // allow multiple open at once
}

export default function Accordion({ items, defaultOpen = [], multiple = false }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen)

  const toggle = (id: string) => {
    if (open.includes(id)) {
      setOpen(open.filter(o => o !== id))
    } else {
      setOpen(multiple ? [...open, id] : [id])
    }
  }

  return (
    <div className="accordion">
      {items.map(item => {
        const isOpen = open.includes(item.id)
        return (
          <div key={item.id} className={`accordion-item${isOpen ? ' open' : ''}`}>
            <button
              className="accordion-trigger"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              <span className="accordion-trigger-label">{item.label}</span>
              <span className="accordion-caret" aria-hidden>▾</span>
            </button>
            {isOpen && (
              <div className="accordion-body">{item.content}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
