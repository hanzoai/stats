/**
 * @hanzo/stats - SQL.js database wrapper
 * Client-side SQLite database for stats queries
 */

import type { Database, DatabaseOptions, QueryResult, QueryError } from '../types'

// Default CDN for sql.js WASM file
const DEFAULT_WASM_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm'

let SQL: any = null
let initPromise: Promise<any> | null = null

/**
 * Initialize SQL.js library
 */
export async function initSqlJs(wasmUrl: string = DEFAULT_WASM_URL): Promise<any> {
  if (SQL) return SQL

  if (initPromise) return initPromise

  initPromise = (async () => {
    // Dynamic import for sql.js
    const initSqlJsLib = (await import('sql.js')).default
    SQL = await initSqlJsLib({
      locateFile: (file: string) => {
        if (file.endsWith('.wasm')) return wasmUrl
        return file
      }
    })
    return SQL
  })()

  return initPromise
}

/**
 * StatsDB - Client-side SQLite database wrapper
 */
export class StatsDB {
  private db: any = null
  private ready: Promise<void>

  constructor(options: DatabaseOptions = {}) {
    this.ready = this.init(options)
  }

  private async init(options: DatabaseOptions): Promise<void> {
    const sqljs = await initSqlJs(options.wasmUrl)

    if (options.dbBuffer) {
      // Initialize from buffer
      this.db = new sqljs.Database(new Uint8Array(options.dbBuffer))
    } else if (options.dbUrl) {
      // Fetch and load database from URL
      const response = await fetch(options.dbUrl)
      const buffer = await response.arrayBuffer()
      this.db = new sqljs.Database(new Uint8Array(buffer))
    } else {
      // Create empty database
      this.db = new sqljs.Database()
    }
  }

  /**
   * Wait for database to be ready
   */
  async waitReady(): Promise<void> {
    await this.ready
  }

  /**
   * Execute a SQL query and return results
   */
  async exec(sql: string): Promise<QueryResult[]> {
    await this.ready

    try {
      const results = this.db.exec(sql)
      return results.map((r: any) => ({
        columns: r.columns,
        values: r.values
      }))
    } catch (error: any) {
      throw { message: error.message, query: sql } as QueryError
    }
  }

  /**
   * Execute a SQL query and return first result set
   */
  async query<T = any>(sql: string): Promise<T[]> {
    const results = await this.exec(sql)
    if (results.length === 0) return []

    const { columns, values } = results[0]
    return values.map(row => {
      const obj: any = {}
      columns.forEach((col, i) => {
        obj[col] = row[i]
      })
      return obj
    })
  }

  /**
   * Execute SQL statement without returning results
   */
  async run(sql: string, params?: any[]): Promise<void> {
    await this.ready

    try {
      if (params) {
        this.db.run(sql, params)
      } else {
        this.db.run(sql)
      }
    } catch (error: any) {
      throw { message: error.message, query: sql } as QueryError
    }
  }

  /**
   * Get single value from query
   */
  async scalar<T = any>(sql: string): Promise<T | null> {
    const results = await this.exec(sql)
    if (results.length === 0 || results[0].values.length === 0) {
      return null
    }
    return results[0].values[0][0] as T
  }

  /**
   * Check if a table exists
   */
  async tableExists(name: string): Promise<boolean> {
    const result = await this.scalar<number>(
      `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='${name}'`
    )
    return result === 1
  }

  /**
   * Get list of tables in database
   */
  async getTables(): Promise<string[]> {
    const results = await this.query<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
    )
    return results.map(r => r.name)
  }

  /**
   * Get schema for a table
   */
  async getTableSchema(name: string): Promise<{ name: string; type: string }[]> {
    return this.query(`PRAGMA table_info(${name})`)
  }

  /**
   * Export database to Uint8Array
   */
  async export(): Promise<Uint8Array> {
    await this.ready
    return this.db.export()
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    await this.ready
    this.db.close()
    this.db = null
  }
}

/**
 * Create a StatsDB instance from a URL
 */
export async function createStatsDB(dbUrl: string): Promise<StatsDB> {
  const db = new StatsDB({ dbUrl })
  await db.waitReady()
  return db
}

/**
 * Create a StatsDB instance from a buffer
 */
export async function createStatsDBFromBuffer(buffer: ArrayBuffer): Promise<StatsDB> {
  const db = new StatsDB({ dbBuffer: buffer })
  await db.waitReady()
  return db
}

export default StatsDB
