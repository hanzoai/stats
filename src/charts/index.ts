/**
 * @hanzo/stats - Chart configuration utilities
 */

import type { ChartConfig, ChartsConfig, QueryResult } from '../types'

/**
 * Default chart configurations for common stats
 */
export const defaultCharts: ChartConfig[] = [
  {
    id: 'commitsOverTime',
    title: 'Commits Over Time',
    type: 'bar',
    sql: `SELECT strftime('%Y-%m', date) as month, COUNT(*) as commits
          FROM commits \${userFilter} GROUP BY month ORDER BY month`,
    x: 'month',
    y: 'commits'
  },
  {
    id: 'locOverTime',
    title: 'Lines of Code Over Time',
    type: 'scatter',
    sql: `SELECT strftime('%Y-%m', date) as month,
          SUM(additions) as additions, SUM(deletions) as deletions
          FROM commits \${userFilter}
          WHERE additions IS NOT NULL GROUP BY month ORDER BY month`,
    x: 'month',
    y: ['additions', 'deletions']
  },
  {
    id: 'topRepos',
    title: 'Top Repositories',
    type: 'bar',
    sql: `SELECT repo, COUNT(*) as commits
          FROM commits \${userFilter}
          GROUP BY repo ORDER BY commits DESC LIMIT 15`,
    x: 'repo',
    y: 'commits',
    orientation: 'h'
  },
  {
    id: 'dayOfWeek',
    title: 'Commits by Day of Week',
    type: 'bar',
    sql: `SELECT CASE strftime('%w', date)
          WHEN '0' THEN 'Sun' WHEN '1' THEN 'Mon' WHEN '2' THEN 'Tue'
          WHEN '3' THEN 'Wed' WHEN '4' THEN 'Thu' WHEN '5' THEN 'Fri'
          WHEN '6' THEN 'Sat' END as day, COUNT(*) as commits
          FROM commits \${userFilter}
          GROUP BY strftime('%w', date) ORDER BY strftime('%w', date)`,
    x: 'day',
    y: 'commits'
  },
  {
    id: 'hourOfDay',
    title: 'Commits by Hour',
    type: 'bar',
    sql: `SELECT strftime('%H', datetime) as hour, COUNT(*) as commits
          FROM commits \${userFilter}
          WHERE datetime IS NOT NULL GROUP BY hour ORDER BY hour`,
    x: 'hour',
    y: 'commits'
  }
]

/**
 * AI usage charts
 */
export const aiCharts: ChartConfig[] = [
  {
    id: 'aiByModel',
    title: 'Usage by Model',
    type: 'pie',
    sql: `SELECT model, SUM(input_tokens + output_tokens) as tokens
          FROM ai_usage GROUP BY model ORDER BY tokens DESC`,
    x: 'model',
    y: 'tokens'
  },
  {
    id: 'aiDaily',
    title: 'Daily Token Usage',
    type: 'bar',
    sql: `SELECT date, SUM(input_tokens + output_tokens) as tokens
          FROM ai_usage GROUP BY date ORDER BY date`,
    x: 'date',
    y: 'tokens'
  }
]

/**
 * Load charts configuration from JSON
 */
export function loadChartsConfig(json: string | object): ChartsConfig {
  const config = typeof json === 'string' ? JSON.parse(json) : json
  return {
    charts: config.charts || defaultCharts,
    customCharts: config.customCharts || []
  }
}

/**
 * Merge chart configs
 */
export function mergeCharts(...configs: ChartConfig[][]): ChartConfig[] {
  const seen = new Set<string>()
  const result: ChartConfig[] = []

  for (const charts of configs) {
    for (const chart of charts) {
      if (!seen.has(chart.id)) {
        seen.add(chart.id)
        result.push(chart)
      }
    }
  }

  return result
}

/**
 * Process SQL template with user filter
 */
export function processSqlTemplate(
  sql: string,
  options: { users?: string[]; userFilter?: string } = {}
): string {
  let userFilter = ''

  if (options.userFilter) {
    userFilter = options.userFilter
  } else if (options.users && options.users.length > 0) {
    const userList = options.users.map(u => `'${u}'`).join(', ')
    userFilter = `WHERE username IN (${userList})`
  }

  return sql.replace(/\$\{userFilter\}/g, userFilter)
}

/**
 * Transform query results into chart data format
 */
export function transformChartData(
  result: QueryResult,
  config: ChartConfig
): { x: any[]; y: any[] | any[][] } {
  const { columns, values } = result
  const xIndex = columns.indexOf(config.x)

  const x = values.map(row => row[xIndex])

  if (Array.isArray(config.y)) {
    const y = config.y.map(yField => {
      const yIndex = columns.indexOf(yField)
      return values.map(row => row[yIndex])
    })
    return { x, y }
  } else {
    const yIndex = columns.indexOf(config.y)
    const y = values.map(row => row[yIndex])
    return { x, y }
  }
}

/**
 * Default dark theme colors
 */
export const darkThemeColors = {
  background: 'transparent',
  text: '#888',
  grid: '#222',
  primary: '#fff',
  secondary: '#ccc',
  tertiary: '#999',
  accent: ['#fff', '#ccc', '#999', '#666', '#444']
}

/**
 * Get Plotly layout for dark theme
 */
export function getDarkPlotlyLayout(options: { title?: string } = {}): object {
  return {
    paper_bgcolor: darkThemeColors.background,
    plot_bgcolor: darkThemeColors.background,
    font: { color: darkThemeColors.text, size: 11 },
    margin: { l: 50, r: 20, t: options.title ? 40 : 20, b: 50 },
    title: options.title ? { text: options.title, font: { size: 14 } } : undefined,
    xaxis: {
      gridcolor: darkThemeColors.grid,
      linecolor: darkThemeColors.grid,
      tickfont: { color: darkThemeColors.text }
    },
    yaxis: {
      gridcolor: darkThemeColors.grid,
      linecolor: darkThemeColors.grid,
      tickfont: { color: darkThemeColors.text }
    }
  }
}

/**
 * Get Recharts theme config
 */
export function getRechartsTheme() {
  return {
    colors: darkThemeColors.accent,
    background: darkThemeColors.background,
    textColor: darkThemeColors.text,
    gridColor: darkThemeColors.grid,
    tooltipStyle: {
      backgroundColor: '#111',
      border: '1px solid #333',
      borderRadius: 8
    }
  }
}

export default {
  defaultCharts,
  aiCharts,
  loadChartsConfig,
  mergeCharts,
  processSqlTemplate,
  transformChartData,
  darkThemeColors,
  getDarkPlotlyLayout,
  getRechartsTheme
}
