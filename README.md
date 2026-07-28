# @hanzo/stats

SQL-powered stats dashboard library with client-side SQLite, chart configurations, and data providers.

## Features

- **Client-side SQLite**: Run SQL queries directly in the browser using sql.js
- **Chart Configurations**: Pre-built chart configs for common stats (commits, LOC, etc.)
- **Data Providers**: Fetch data from GitHub, AI usage APIs, StackOverflow, and more
- **React Hooks**: Easy-to-use hooks for stats data fetching
- **Components**: Ready-to-use stat cards, query console, and embed components

## Installation

```bash
npm install @hanzo/stats sql.js
# or
pnpm add @hanzo/stats sql.js
```

## Quick Start

### Using the Database

```tsx
import { StatsDB, createStatsDB } from '@hanzo/stats'

// Create from URL
const db = await createStatsDB('/stats.db')

// Execute queries
const results = await db.query('SELECT * FROM commits LIMIT 10')

// Get typed results
const commits = await db.query<{ sha: string; message: string }>(
  'SELECT sha, message FROM commits'
)
```

### React Hooks

```tsx
import { useStatsDB, useQuery, useGitHubStats } from '@hanzo/stats'

function Dashboard() {
  // Load database
  const { db, loading } = useStatsDB('/stats.db')

  // Execute query
  const { data, error } = useQuery(db, 'SELECT COUNT(*) as total FROM commits')

  // Fetch GitHub stats
  const { stats } = useGitHubStats('/api/github')

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <p>Total commits: {data?.values[0][0]}</p>
      <p>GitHub repos: {stats?.repos}</p>
    </div>
  )
}
```

### Components

```tsx
import { StatCard, StatsGrid, SQLConsole, QueryResults } from '@hanzo/stats'

function StatsPage() {
  return (
    <StatsGrid columns={4}>
      <StatCard value={37106} label="Commits" />
      <StatCard value={895} label="Repositories" />
      <StatCard value={54300000} label="Lines of Code" format={{ format: 'short' }} />
    </StatsGrid>
  )
}
```

### Chart Configuration

```tsx
import { defaultCharts, processSqlTemplate, getDarkPlotlyLayout } from '@hanzo/stats'

// Get pre-built chart configs
const charts = defaultCharts

// Process SQL with user filter
const sql = processSqlTemplate(charts[0].sql, { users: ['zeekay'] })

// Get Plotly layout for dark theme
const layout = getDarkPlotlyLayout({ title: 'Commits Over Time' })
```

### Data Providers

```tsx
import { createProviders } from '@hanzo/stats'

const providers = createProviders({
  github: { apiBase: '/api/github' },
  stackoverflow: { userId: '641766' },
  soundcloud: { username: 'zeekay' }
})

// Get GitHub stats
const stats = await providers.github?.getStats()

// Get SoundCloud embed URL
const embedUrl = providers.soundcloud?.getLikesEmbedUrl()
```

## API Reference

### Database

- `StatsDB` - Main database class
- `createStatsDB(url)` - Create database from URL
- `createStatsDBFromBuffer(buffer)` - Create from ArrayBuffer
- `initSqlJs(wasmUrl?)` - Initialize sql.js

### Charts

- `defaultCharts` - Pre-built GitHub chart configs
- `aiCharts` - AI usage chart configs
- `processSqlTemplate(sql, options)` - Process SQL templates
- `transformChartData(result, config)` - Transform query results for charts
- `getDarkPlotlyLayout(options)` - Get Plotly layout for dark theme
- `getRechartsTheme()` - Get Recharts theme config

### Providers

- `GitHubProvider` - GitHub API provider
- `AIProvider` - AI usage API provider
- `StackOverflowProvider` - StackOverflow API provider
- `SpotifyProvider` - Spotify embed URLs
- `SoundCloudProvider` - SoundCloud embed URLs

### Hooks

- `useStatsDB(url)` - Load and manage database
- `useQuery(db, sql)` - Execute SQL query
- `useTypedQuery<T>(db, sql)` - Execute typed SQL query
- `useGitHubStats(apiBase)` - Fetch GitHub stats
- `useAIStats(apiBase)` - Fetch AI usage stats
- `useStackOverflowStats(userId)` - Fetch StackOverflow stats

### Components

- `StatCard` - Display a stat value with label
- `StatsGrid` - Grid layout for stat cards
- `SQLConsole` - Interactive SQL query console
- `QueryResults` - Table display for query results
- `SocialEmbed` - Embed component for music services
- `Badge` - StackOverflow badge display

## License

BSD-3-Clause © Hanzo AI, Inc.
