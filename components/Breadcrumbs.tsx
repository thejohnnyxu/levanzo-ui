'use client'

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <div
            key={i}
            className={`breadcrumb-item${isLast ? ' breadcrumb-item-current' : ''}`}
            onClick={!isLast ? item.onClick : undefined}
            role={item.href || item.onClick ? 'link' : undefined}
            tabIndex={!isLast && (item.href || item.onClick) ? 0 : undefined}
            aria-current={isLast ? 'page' : undefined}
          >
            {item.href && !isLast ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              item.label
            )}
          </div>
        )
      })}
    </nav>
  )
}
