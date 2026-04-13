'use client'

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarColor = 'default' | 'terracotta' | 'sage' | 'teal' | 'gold'

interface AvatarProps {
  initials: string
  size?: AvatarSize
  color?: AvatarColor
}

export function Avatar({ initials, size = 'md', color = 'default' }: AvatarProps) {
  return (
    <div className={`avatar avatar-${size} avatar-${color}`} aria-label={initials}>
      {initials}
    </div>
  )
}

interface UserChipProps {
  initials: string
  name: string
  role?: string
  color?: AvatarColor
  onClick?: () => void
}

export function UserChip({ initials, name, role, color = 'terracotta', onClick }: UserChipProps) {
  return (
    <div className="user-chip" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <Avatar initials={initials} size="sm" color={color} />
      <div>
        <div className="user-chip-name">{name}</div>
        {role && <div className="user-chip-role">{role}</div>}
      </div>
    </div>
  )
}

interface AvatarStackProps {
  avatars: { initials: string; color?: AvatarColor }[]
  max?: number
}

export function AvatarStack({ avatars, max = 4 }: AvatarStackProps) {
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max
  return (
    <div className="avatar-stack">
      {visible.map((a, i) => (
        <Avatar key={i} initials={a.initials} size="sm" color={a.color ?? 'default'} />
      ))}
      {overflow > 0 && (
        <div className="avatar avatar-sm avatar-overflow">+{overflow}</div>
      )}
    </div>
  )
}
