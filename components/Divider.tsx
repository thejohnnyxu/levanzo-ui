'use client'

interface DividerProps {
  label?: string
}

export default function Divider({ label }: DividerProps) {
  if (!label) return <div className="divider-plain" />
  return (
    <div className="divider-labeled">
      <div className="divider-line" />
      <span className="divider-text">{label}</span>
      <div className="divider-line" />
    </div>
  )
}
