'use client'
import { useRef, useState } from 'react'
import { Trash2, Pencil } from 'lucide-react'

const SWIPE_THRESHOLD = 60   // px to reveal action
const SWIPE_COMMIT    = 120  // px to auto-trigger

interface SwipeRowProps {
  children: React.ReactNode
  onDelete?: () => void
  onEdit?: () => void
  /** Disable on desktop (pointer is not touch) */
  touchOnly?: boolean
}

/**
 * Wrap any row with SwipeRow to get native swipe-to-delete / swipe-to-edit.
 * Swipe left  → red Delete  action
 * Swipe right → blue Edit   action (if onEdit provided)
 *
 * On non-touch devices renders children as-is (no swipe behaviour).
 */
export default function SwipeRow({ children, onDelete, onEdit, touchOnly = true }: SwipeRowProps) {
  const startX = useRef(0)
  const startY = useRef(0)
  const [dx, setDx] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const committed = useRef(false)

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    committed.current = false
    setSwiping(false)
  }

  function onTouchMove(e: React.TouchEvent) {
    const deltaX = e.touches[0].clientX - startX.current
    const deltaY = e.touches[0].clientY - startY.current

    // Cancel if primarily vertical scroll
    if (!swiping && Math.abs(deltaY) > Math.abs(deltaX) + 5) return

    setSwiping(true)
    // Left swipe only if no onEdit, both directions if onEdit
    if (!onEdit && deltaX > 0) { setDx(0); return }
    setDx(deltaX)
    e.preventDefault()
  }

  function onTouchEnd() {
    if (!swiping) return
    setSwiping(false)

    if (dx < -SWIPE_COMMIT && onDelete) {
      onDelete()
    } else if (dx > SWIPE_COMMIT && onEdit) {
      onEdit()
    }
    setDx(0)
  }

  const showDelete = dx < -SWIPE_THRESHOLD && onDelete
  const showEdit   = dx > SWIPE_THRESHOLD  && onEdit

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'inherit' }}>
      {/* Delete backing */}
      {onDelete && (
        <div style={{
          position: 'absolute', inset: 0, right: 0,
          background: 'var(--terracotta)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 1.25rem',
          opacity: showDelete ? 1 : 0,
          transition: swiping ? 'none' : 'opacity 0.15s',
        }}>
          <Trash2 size={18} color="#fff" />
        </div>
      )}
      {/* Edit backing */}
      {onEdit && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#3a8fe8',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
          padding: '0 1.25rem',
          opacity: showEdit ? 1 : 0,
          transition: swiping ? 'none' : 'opacity 0.15s',
        }}>
          <Pencil size={16} color="#fff" />
        </div>
      )}
      {/* Content */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(${Math.max(-SWIPE_COMMIT - 10, Math.min(SWIPE_COMMIT + 10, dx))}px)`,
          transition: swiping ? 'none' : 'transform 0.2s cubic-bezier(0.25,1,0.5,1)',
          willChange: 'transform',
          touchAction: swiping ? 'none' : 'pan-y',
        }}
      >
        {children}
      </div>
    </div>
  )
}
