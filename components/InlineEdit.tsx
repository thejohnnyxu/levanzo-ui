'use client'
import { useState, useRef, useEffect } from 'react'

interface InlineEditProps {
  value: string
  onSave: (val: string) => void
  style?: React.CSSProperties
  inputStyle?: React.CSSProperties
  className?: string
}

/**
 * Click to edit inline. Save on blur or Enter, cancel on Escape.
 * Renders a <span> normally; swaps to a borderless <input> on click.
 */
export default function InlineEdit({ value, onSave, style, inputStyle, className }: InlineEditProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setDraft(value) }, [value])

  function startEdit(e: React.MouseEvent) {
    e.stopPropagation()
    setDraft(value)
    setEditing(true)
  }

  function commit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== value) onSave(trimmed)
    setEditing(false)
  }

  function cancel() {
    setDraft(value)
    setEditing(false)
  }

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); commit() }
          if (e.key === 'Escape') { e.preventDefault(); cancel() }
          e.stopPropagation()
        }}
        onClick={e => e.stopPropagation()}
        style={{
          border: 'none', outline: 'none', background: 'transparent',
          font: 'inherit', color: 'inherit', width: '100%',
          borderBottom: '2px solid var(--terracotta)',
          padding: '0 2px', margin: 0,
          ...inputStyle,
        }}
      />
    )
  }

  return (
    <span
      className={className}
      style={{ cursor: 'text', ...style }}
      onClick={startEdit}
      title="Click to rename"
    >
      {value}
    </span>
  )
}
