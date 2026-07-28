/**
 * @hanzo/stats - React hooks for stats data
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { QueryResult, UseQueryResult, UseStatsResult, GitHubStats, AIStats, StackOverflowUser } from '../types'
import { StatsDB } from '../db'
import { GitHubProvider, AIProvider, StackOverflowProvider } from '../providers'

/**
 * Hook to manage a StatsDB instance
 */
export function useStatsDB(dbUrl?: string) {
  const [db, setDb] = useState<StatsDB | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!dbUrl) {
      setLoading(false)
      return
    }

    const initDb = async () => {
      try {
        setLoading(true)
        const database = new StatsDB({ dbUrl })
        await database.waitReady()
        setDb(database)
        setError(null)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    initDb()

    return () => {
      db?.close()
    }
  }, [dbUrl])

  return { db, loading, error }
}

/**
 * Hook to execute a SQL query
 */
export function useQuery(
  db: StatsDB | null,
  sql: string,
  deps: any[] = []
): UseQueryResult {
  const [data, setData] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ message: string; query?: string } | null>(null)

  const fetchData = useCallback(async () => {
    if (!db || !sql) return

    try {
      setLoading(true)
      const results = await db.exec(sql)
      setData(results[0] || null)
      setError(null)
    } catch (e: any) {
      setError({ message: e.message, query: sql })
    } finally {
      setLoading(false)
    }
  }, [db, sql, ...deps])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

/**
 * Hook to execute a SQL query and return typed objects
 */
export function useTypedQuery<T>(
  db: StatsDB | null,
  sql: string,
  deps: any[] = []
): UseQueryResult<T[]> {
  const [data, setData] = useState<T[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ message: string; query?: string } | null>(null)

  const fetchData = useCallback(async () => {
    if (!db || !sql) return

    try {
      setLoading(true)
      const results = await db.query<T>(sql)
      setData(results)
      setError(null)
    } catch (e: any) {
      setError({ message: e.message, query: sql })
    } finally {
      setLoading(false)
    }
  }, [db, sql, ...deps])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

/**
 * Hook to fetch GitHub stats
 */
export function useGitHubStats(apiBase?: string): UseStatsResult<GitHubStats> {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const providerRef = useRef(new GitHubProvider(apiBase))

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await providerRef.current.getStats()
        setStats(data)
        setError(null)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [apiBase])

  return { stats, loading, error }
}

/**
 * Hook to fetch AI stats
 */
export function useAIStats(apiBase?: string): UseStatsResult<AIStats> {
  const [stats, setStats] = useState<AIStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const providerRef = useRef(new AIProvider(apiBase))

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await providerRef.current.getStats()
        setStats(data)
        setError(null)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [apiBase])

  return { stats, loading, error }
}

/**
 * Hook to fetch StackOverflow user stats
 */
export function useStackOverflowStats(
  userId: string,
  apiKey?: string
): UseStatsResult<StackOverflowUser> {
  const [stats, setStats] = useState<StackOverflowUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchStats = async () => {
      try {
        setLoading(true)
        const provider = new StackOverflowProvider(userId, apiKey)
        const data = await provider.getUser()
        setStats(data)
        setError(null)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId, apiKey])

  return { stats, loading, error }
}

/**
 * Hook to format numbers
 */
export function useFormatNumber() {
  return useCallback((n: number, format: 'short' | 'long' = 'short'): string => {
    if (format === 'long') {
      return n.toLocaleString()
    }

    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
    return n.toString()
  }, [])
}

export default {
  useStatsDB,
  useQuery,
  useTypedQuery,
  useGitHubStats,
  useAIStats,
  useStackOverflowStats,
  useFormatNumber
}
