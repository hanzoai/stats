/**
 * @hanzo/stats - Type definitions
 */

// Chart configuration types
export interface ChartConfig {
  id: string
  title: string
  type: 'bar' | 'line' | 'scatter' | 'pie' | 'area' | 'radar'
  sql: string
  x: string
  y: string | string[]
  orientation?: 'h' | 'v'
  colors?: string[]
  showLegend?: boolean
}

export interface ChartsConfig {
  charts: ChartConfig[]
  customCharts?: ChartConfig[]
}

// Stats configuration
export interface StatsConfig {
  title: string
  subtitle?: string
  database: string
  port?: number
  users?: string[]
  since?: string
  links?: Record<string, string>
  features?: {
    github?: boolean
    ai?: boolean
    spotify?: boolean
    stackoverflow?: boolean
  }
}

// Data provider types
export interface GitHubCommit {
  sha: string
  username: string
  email?: string
  date: string
  datetime?: string
  repo: string
  message: string
  additions?: number
  deletions?: number
}

export interface GitHubStats {
  total_commits: number
  repos: number
  additions: number
  deletions: number
  first_commit?: string
  last_commit?: string
}

export interface AIUsage {
  date: string
  model: string
  input_tokens: number
  output_tokens: number
  interaction_hash?: string
}

export interface AIStats {
  interactions: number
  input_tokens: number
  output_tokens: number
  active_days: number
}

export interface StackOverflowUser {
  reputation: number
  answer_count: number
  question_count: number
  badge_counts: {
    gold: number
    silver: number
    bronze: number
  }
  profile_image?: string
  display_name: string
}

// Query result types
export interface QueryResult {
  columns: string[]
  values: any[][]
}

export interface QueryError {
  message: string
  query?: string
}

// Database types
export interface Database {
  exec(sql: string): QueryResult[]
  run(sql: string, params?: any[]): void
  close(): void
}

export interface DatabaseOptions {
  wasmUrl?: string
  dbUrl?: string
  dbBuffer?: ArrayBuffer
}

// Hook return types
export interface UseQueryResult<T = QueryResult> {
  data: T | null
  loading: boolean
  error: QueryError | null
  refetch: () => Promise<void>
}

export interface UseStatsResult<T> {
  stats: T | null
  loading: boolean
  error: Error | null
}

// Format utilities
export type NumberFormat = 'short' | 'long' | 'compact' | 'percent'

export interface FormatOptions {
  format?: NumberFormat
  decimals?: number
  suffix?: string
  prefix?: string
}
