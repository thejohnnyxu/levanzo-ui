'use client'
import { useState, useRef, KeyboardEvent } from 'react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  label?: string
  maxTags?: number
}

export default function TagInput({ tags, onChange, placeholder = 'Add tag…', label, maxTags }: TagInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || tags.includes(trimmed)) return
    if (maxTags && tags.length >= maxTags) return
    onChange([...tags, trimmed])
    setInput('')
  }

  const removeTag = (tag: string) => onChange(tags.filter(t => t !== tag))

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="tag-input-field-wrap">
      {label && <div className="field-label">{label}</div>}
      <div className="tag-input-wrap" onClick={() => inputRef.current?.focus()}>
        {tags.map(tag => (
          <div key={tag} className="tag-chip">
            {tag}
            <button
              className="tag-chip-remove"
              onClick={e => { e.stopPropagation(); removeTag(tag) }}
              aria-label={`Remove ${tag}`}
            >✕</button>
          </div>
        ))}
        <input
          ref={inputRef}
          className="tag-input-field"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addTag(input)}
          placeholder={tags.length === 0 ? placeholder : ''}
        />
      </div>
    </div>
  )
}
