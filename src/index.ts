/**
 * @hanzo/stats
 * SQL-powered stats dashboard library
 *
 * @example
 * ```tsx
 * import { StatsDB, useStatsDB, useQuery, StatCard } from '@hanzo/stats'
 *
 * function Dashboard() {
 *   const { db, loading } = useStatsDB('/stats.db')
 *   const { data } = useQuery(db, 'SELECT COUNT(*) as total FROM commits')
 *
 *   if (loading) return <div>Loading...</div>
 *
 *   return (
 *     <StatCard
 *       value={data?.values[0][0] || 0}
 *       label="Total Commits"
 *     />
 *   )
 * }
 * ```
 */

// Database
export { StatsDB, createStatsDB, createStatsDBFromBuffer, initSqlJs } from './db'

// Charts
export {
  defaultCharts,
  aiCharts,
  loadChartsConfig,
  mergeCharts,
  processSqlTemplate,
  transformChartData,
  darkThemeColors,
  getDarkPlotlyLayout,
  getRechartsTheme
} from './charts'

// Providers
export {
  GitHubProvider,
  AIProvider,
  StackOverflowProvider,
  SpotifyProvider,
  SoundCloudProvider,
  createProviders,
  type StatsProviders
} from './providers'

// Hooks
export {
  useStatsDB,
  useQuery,
  useTypedQuery,
  useGitHubStats,
  useAIStats,
  useStackOverflowStats,
  useFormatNumber
} from './hooks'

// Components
export {
  formatNumber,
  StatCard,
  StatsGrid,
  SQLConsole,
  QueryResults,
  SocialEmbed,
  Badge
} from './components'

// Types
export type {
  ChartConfig,
  ChartsConfig,
  StatsConfig,
  GitHubCommit,
  GitHubStats,
  AIUsage,
  AIStats,
  StackOverflowUser,
  QueryResult,
  QueryError,
  Database,
  DatabaseOptions,
  UseQueryResult,
  UseStatsResult,
  NumberFormat,
  FormatOptions
} from './types'

// Version
export const VERSION = '0.1.0'
