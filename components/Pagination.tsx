'use client'

interface PaginationProps {
  page: number
  total: number       // total pages
  onChange: (page: number) => void
  siblings?: number   // pages shown either side of current
}

export default function Pagination({ page, total, onChange, siblings = 1 }: PaginationProps) {
  const pages: (number | '...')[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page - siblings > 2) pages.push('...')
    for (let i = Math.max(2, page - siblings); i <= Math.min(total - 1, page + siblings); i++) {
      pages.push(i)
    }
    if (page + siblings < total - 1) pages.push('...')
    pages.push(total)
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="page-btn page-btn-prev"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >‹</button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="page-btn page-btn-ellipsis">…</span>
        ) : (
          <button
            key={p}
            className={`page-btn${p === page ? ' active' : ''}`}
            onClick={() => onChange(p as number)}
            aria-current={p === page ? 'page' : undefined}
          >{p}</button>
        )
      )}
      <button
        className="page-btn page-btn-next"
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        aria-label="Next page"
      >›</button>
    </nav>
  )
}
