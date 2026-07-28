/**
 * Type declarations for sql.js
 */
declare module 'sql.js' {
  export interface SqlValue {
    [key: string]: any
  }

  export interface QueryExecResult {
    columns: string[]
    values: any[][]
  }

  export interface Statement {
    bind(params?: SqlValue | any[]): boolean
    step(): boolean
    getAsObject(params?: any): SqlValue
    run(params?: any[]): void
    free(): void
  }

  export interface Database {
    run(sql: string, params?: any[]): Database
    exec(sql: string, params?: any[]): QueryExecResult[]
    prepare(sql: string): Statement
    export(): Uint8Array
    close(): void
  }

  export interface SqlJsConfig {
    locateFile?: (file: string) => string
  }

  export interface SqlJsStatic {
    Database: new (data?: ArrayLike<number>) => Database
  }

  export default function initSqlJs(config?: SqlJsConfig): Promise<SqlJsStatic>
}
