/**
 * @hanzo/stats - React components
 */

import React from 'react'
import type { FormatOptions } from '../types'

/**
 * Format a number for display
 */
export function formatNumber(n: number, options: FormatOptions = {}): string {
  const { format = 'short', decimals = 1, prefix = '', suffix = '' } = options

  let formatted: string
  if (format === 'long') {
    formatted = n.toLocaleString()
  } else if (format === 'percent') {
    formatted = (n * 100).toFixed(decimals) + '%'
  } else {
    // short/compact format
    if (n >= 1e9) formatted = (n / 1e9).toFixed(decimals) + 'B'
    else if (n >= 1e6) formatted = (n / 1e6).toFixed(decimals) + 'M'
    else if (n >= 1e3) formatted = (n / 1e3).toFixed(decimals) + 'K'
    else formatted = n.toString()
  }

  return prefix + formatted + suffix
}

/**
 * Stat Card Component
 */
export interface StatCardProps {
  value: number | string
  label: string
  format?: FormatOptions
  className?: string
  valueClassName?: string
  labelClassName?: string
}

export function StatCard({
  value,
  label,
  format,
  className = '',
  valueClassName = '',
  labelClassName = ''
}: StatCardProps) {
  const displayValue = typeof value === 'number' ? formatNumber(value, format) : value

  return (
    <div className={`stat-card ${className}`}>
      <div className={`stat-value ${valueClassName}`}>{displayValue}</div>
      <div className={`stat-label ${labelClassName}`}>{label}</div>
    </div>
  )
}

/**
 * Stats Grid Component
 */
export interface StatsGridProps {
  children: React.ReactNode
  columns?: number
  className?: string
}

export function StatsGrid({ children, columns = 4, className = '' }: StatsGridProps) {
  return (
    <div
      className={`stats-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${100 / columns}%, 1fr))`,
        gap: '1rem'
      }}
    >
      {children}
    </div>
  )
}

/**
 * SQL Console Component
 */
export interface SQLConsoleProps {
  onExecute: (sql: string) => Promise<void>
  defaultQuery?: string
  placeholder?: string
  className?: string
}

export function SQLConsole({
  onExecute,
  defaultQuery = '',
  placeholder = 'SELECT * FROM commits LIMIT 10;',
  className = ''
}: SQLConsoleProps) {
  const [query, setQuery] = React.useState(defaultQuery)
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      await onExecute(query)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`sql-console ${className}`}>
      <textarea
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        rows={4}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Running...' : 'Run Query'}
      </button>
    </form>
  )
}

/**
 * Query Results Table Component
 */
export interface QueryResultsProps {
  columns: string[]
  values: any[][]
  className?: string
  maxRows?: number
}

export function QueryResults({
  columns,
  values,
  className = '',
  maxRows = 100
}: QueryResultsProps) {
  const displayValues = maxRows ? values.slice(0, maxRows) : values

  return (
    <div className={`query-results ${className}`}>
      <table>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayValues.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {values.length > maxRows && (
        <p className="truncated">
          Showing {maxRows} of {values.length} rows
        </p>
      )}
    </div>
  )
}

/**
 * Social Embed Component
 */
export interface SocialEmbedProps {
  type: 'soundcloud' | 'spotify'
  src: string
  height?: number
  className?: string
}

export function SocialEmbed({
  type,
  src,
  height = 352,
  className = ''
}: SocialEmbedProps) {
  return (
    <div className={`social-embed ${type}-embed ${className}`}>
      <iframe
        src={src}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  )
}

/**
 * Badge Component for StackOverflow
 */
export interface BadgeProps {
  type: 'gold' | 'silver' | 'bronze'
  count: number
  className?: string
}

export function Badge({ type, count, className = '' }: BadgeProps) {
  const colors = {
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32'
  }

  const icons = {
    gold: '🥇',
    silver: '🥈',
    bronze: '🥉'
  }

  return (
    <span className={`badge badge-${type} ${className}`} style={{ color: colors[type] }}>
      {icons[type]} {count}
    </span>
  )
}

export default {
  formatNumber,
  StatCard,
  StatsGrid,
  SQLConsole,
  QueryResults,
  SocialEmbed,
  Badge
}
