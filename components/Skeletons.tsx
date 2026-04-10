'use client'

// ── Base skeleton block ───────────────────────────────────────
function Bone({ w = '100%', h = 14, radius = 2, mb = 0 }: {
  w?: string | number; h?: number; radius?: number; mb?: number
}) {
  return (
    <div className="skeleton-pulse" style={{
      width: w, height: h, borderRadius: radius,
      background: 'var(--cream-dark)',
      marginBottom: mb || undefined,
      flexShrink: 0,
    }} />
  )
}

// ── Recipe card skeleton — v2 spine style ────────────────────
function RecipeCardSkeleton({ i = 0 }: { i?: number }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'row',
      border: '2px solid var(--border-strong)',
      borderRadius: 6, overflow: 'hidden',
      background: 'var(--paper)',
      animationDelay: `${i * 40}ms`,
    }}>
      {/* Spine */}
      <div className="skeleton-pulse" style={{ width: 22, flexShrink: 0, background: 'var(--parchment)' }} />
      {/* Body */}
      <div style={{ flex: 1, borderLeft: '2px solid var(--border-strong)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '7px 8px 5px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Bone h={14} w="65%" radius={2} />
          <Bone h={10} w="80%" radius={2} />
          <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
            <Bone h={10} w={32} radius={2} />
            <Bone h={10} w={44} radius={2} />
          </div>
        </div>
        <div style={{ height: 2, background: 'var(--border-strong)' }} />
        <div style={{ padding: '4px 8px 5px', display: 'flex', justifyContent: 'space-between' }}>
          <Bone h={9} w={56} radius={2} />
          <Bone h={9} w={18} radius={2} />
        </div>
      </div>
    </div>
  )
}

export function RecipesSkeleton() {
  return (
    <div className="recipes-grid">
      {Array.from({ length: 6 }).map((_, i) => <RecipeCardSkeleton key={i} i={i} />)}
    </div>
  )
}

// ── Pantry item skeleton — brutalist v2 ──────────────────────
function PantryItemSkeleton({ i = 0 }: { i?: number }) {
  return (
    <div className="pantry-item-card" style={{ animationDelay: `${i * 30}ms` }}>
      {/* Accent stripe */}
      <div className="card-accent-stripe skeleton-pulse" style={{ background: 'var(--parchment)' }} />
      {/* Body */}
      <div style={{ flex: 1, padding: '0.55rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <Bone h={13} w="58%" />
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <Bone h={10} w={52} radius={2} />
          <Bone h={10} w={44} radius={2} />
        </div>
      </div>
      {/* Action column */}
      <div style={{ width: 38, borderLeft: '2px solid var(--border-strong)', flexShrink: 0 }} className="skeleton-pulse" />
    </div>
  )
}

export function PantrySkeleton() {
  return (
    <div className="pantry-grid">
      {Array.from({ length: 8 }).map((_, i) => <PantryItemSkeleton key={i} i={i} />)}
    </div>
  )
}

// ── Shopping list skeleton — brutalist v2 ────────────────────
function ShoppingRowSkeleton({ i = 0 }: { i?: number }) {
  return (
    <div style={{
      display: 'flex',
      border: '2px solid var(--border-strong)',
      borderRadius: 4,
      overflow: 'hidden',
      background: 'var(--paper)',
      animationDelay: `${i * 25}ms`,
    }}>
      {/* Checkbox col */}
      <div className="skeleton-pulse" style={{ width: 40, flexShrink: 0, borderRight: '2px solid var(--border-strong)', background: 'var(--cream-dark)' }} />
      {/* Content col */}
      <div style={{ flex: 1, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Bone h={13} w={`${45 + (i % 3) * 14}%`} radius={2} />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem' }}>
          <Bone h={10} w={36} radius={2} />
          <Bone h={10} w={44} radius={2} />
        </div>
      </div>
    </div>
  )
}

export function ShoppingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      {Array.from({ length: 6 }).map((_, i) => <ShoppingRowSkeleton key={i} i={i} />)}
    </div>
  )
}

// ── Task kanban skeleton ──────────────────────────────────────
function TaskCardSkeleton({ i = 0 }: { i?: number }) {
  return (
    <div className="card" style={{ padding: '0.85rem', animationDelay: `${i * 35}ms` }}>
      <Bone h={13} w={`${55 + (i % 3) * 12}%`} mb={8} />
      <Bone h={10} w="40%" mb={6} />
      <Bone h={10} w="30%" />
    </div>
  )
}

function TaskColumnSkeleton({ i = 0 }: { i?: number }) {
  const cardCount = 2 + (i % 2)
  return (
    <div style={{ minWidth: 260, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ padding: '0.65rem 0.9rem', borderRadius: 4, background: 'var(--cream-dark)', border: '2px solid var(--border-strong)', marginBottom: 4 }}>
        <Bone h={13} w="50%" />
      </div>
      {Array.from({ length: cardCount }).map((_, j) => <TaskCardSkeleton key={j} i={j} />)}
    </div>
  )
}

export function TasksSkeleton() {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      {Array.from({ length: 3 }).map((_, i) => <TaskColumnSkeleton key={i} i={i} />)}
    </div>
  )
}

// ── Generic list row skeleton ─────────────────────────────────
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', animationDelay: `${i * 30}ms` }}>
          <Bone h={12} w={`${40 + (i % 4) * 12}%`} />
          <div style={{ marginLeft: 'auto' }}><Bone h={10} w={60} /></div>
        </div>
      ))}
    </div>
  )
}
