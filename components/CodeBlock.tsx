'use client'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  showCopy?: boolean
}

export default function CodeBlock({ code, language, showCopy = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  return (
    <div className="code-block">
      <div className="code-header">
        {language && <span className="code-lang">{language}</span>}
        {showCopy && (
          <button className="code-copy" onClick={copy}>
            {copied ? 'copied' : 'copy'}
          </button>
        )}
      </div>
      <pre className="code-body">
        <code>{code}</code>
      </pre>
    </div>
  )
}
