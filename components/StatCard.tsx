'use client'

export type StatCardColor = 'terracotta' | 'sage' | 'gold' | 'teal'
export type TrendDirection = 'up' | 'down' | 'flat'

interface StatCardProps {
  label: string
  value: string | number
  trend?: string
  trendDirection?: TrendDirection
  color?: StatCardColor
}

export default function StatCard({ label, value, trend, trendDirection = 'flat', color = 'terracotta' }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className={`stat-card-spine stat-card-spine-${color}`} />
      <div className="stat-card-body">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
        {trend && (
          <div className={`stat-card-trend trend-${trendDirection}`}>
            {trendDirection === 'up' && '↑ '}
            {trendDirection === 'down' && '↓ '}
            {trendDirection === 'flat' && '· '}
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}
