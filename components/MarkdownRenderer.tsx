'use client'
import { marked } from 'marked'

function markdownToHtml(md: string): string {
  if (!md) return ''
  const withTasks = md.replace(
    /^- \[( |x)\] (.+)$/gm,
    (_: string, check: string, text: string) =>
      `<li data-type="taskItem" data-checked="${check === 'x'}">${text}</li>`
  )
  return marked.parse(withTasks) as string
}

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  if (!markdown) return null
  return (
    <div
      className="tiptap-renderer"
      dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
    />
  )
}
