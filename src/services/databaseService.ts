import { neon } from '@netlify/neon'

export interface DatabaseRecord {
    id: string
    [key: string]: any
}

export interface QueryResult<T = any> {
    data: T[]
    count: number
    error?: string
}

export interface DatabaseConnection {
    query: <T = any>(sql: string, params?: any[]) => Promise<T[]>
    queryOne: <T = any>(sql: string, params?: any[]) => Promise<T | null>
    insert: <T = any>(table: string, data: Record<string, any>) => Promise<T>
    update: <T = any>(table: string, data: Record<string, any>, where: Record<string, any>) => Promise<T>
    delete: (table: string, where: Record<string, any>) => Promise<boolean>
}

/**
 * Database Service for Netlify Neon integration
 * Automatically uses NETLIFY_DATABASE_URL environment variable
 */
export class DatabaseService {
    private sql: ReturnType<typeof neon>
    private sqlUnpooled?: ReturnType<typeof neon>

    constructor() {
        // Main pooled connection for regular operations
        this.sql = neon() // Uses NETLIFY_DATABASE_URL automatically

        // Unpooled connection for transactions (if needed)
        if (process.env.NETLIFY_DATABASE_URL_UNPOOLED) {
            this.sqlUnpooled = neon(process.env.NETLIFY_DATABASE_URL_UNPOOLED)
        }
    }

    /**
     * Execute raw SQL query
     */
    async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
        try {
            if (params !== undefined && Array.isArray(params)) {
                // Use parameterized query for safety (even with empty params array)
                return await this.sql(sql, params) as T[]
            } else {
                // Template literal for simple queries when no params provided at all
                return await this.sql`${sql}` as T[]
            }
        } catch (error) {
            console.error('Database query error:', error)
            throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    /**
     * Execute query and return single record
     */
    async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
        const results = await this.query<T>(sql, params)
        return results.length > 0 ? results[0] : null
    }

    /**
     * Generic insert operation
     */
    async insert<T = any>(table: string, data: Record<string, any>): Promise<T> {
        const keys = Object.keys(data)
        const values = Object.values(data)
        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')

        const sql = `
      INSERT INTO ${table} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `

        const results = await this.query<T>(sql, values)
        return results[0]
    }

    /**
     * Generic update operation
     */
    async update<T = any>(
        table: string,
        data: Record<string, any>,
        where: Record<string, any>
    ): Promise<T> {
        const dataKeys = Object.keys(data)
        const dataValues = Object.values(data)
        const whereKeys = Object.keys(where)
        const whereValues = Object.values(where)

        const setClause = dataKeys.map((key, index) => `${key} = $${index + 1}`).join(', ')
        const whereClause = whereKeys.map((key, index) => `${key} = $${dataValues.length + index + 1}`).join(' AND ')

        const sql = `
      UPDATE ${table}
      SET ${setClause}
      WHERE ${whereClause}
      RETURNING *
    `

        const results = await this.query<T>(sql, [...dataValues, ...whereValues])
        return results[0]
    }

    /**
     * Generic delete operation
     */
    async delete(table: string, where: Record<string, any>): Promise<boolean> {
        const whereKeys = Object.keys(where)
        const whereValues = Object.values(where)
        const whereClause = whereKeys.map((key, index) => `${key} = $${index + 1}`).join(' AND ')

        const sql = `DELETE FROM ${table} WHERE ${whereClause}`

        try {
            await this.query(sql, whereValues)
            return true
        } catch (error) {
            console.error('Delete operation failed:', error)
            return false
        }
    }

    /**
     * List tables in database
     */
    async listTables(): Promise<string[]> {
        const results = await this.query<{ table_name: string }>(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
            []
        )

        return results.map(row => row.table_name)
    }

    /**
     * Get table schema information
     */
    async getTableSchema(tableName: string): Promise<any[]> {
        return await this.query(`
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [tableName])
    }

    /**
     * Execute query with transaction (uses unpooled connection)
     */
    async transaction<T>(callback: (sql: ReturnType<typeof neon>) => Promise<T>): Promise<T> {
        if (!this.sqlUnpooled) {
            throw new Error('Unpooled connection not available for transactions')
        }

        try {
            await this.sqlUnpooled`BEGIN`
            const result = await callback(this.sqlUnpooled)
            await this.sqlUnpooled`COMMIT`
            return result
        } catch (error) {
            await this.sqlUnpooled`ROLLBACK`
            throw error
        }
    }

    /**
     * Check database connection
     */
    async healthCheck(): Promise<{ status: string; timestamp: string; tables?: string[] }> {
        try {
            const result = await this.query<{ now: string }>('SELECT NOW() as now')
            const tables = await this.listTables()

            return {
                status: 'healthy',
                timestamp: result[0].now,
                tables
            }
        } catch (error) {
            return {
                status: 'error',
                timestamp: new Date().toISOString()
            }
        }
    }
}

// Singleton instance
let databaseInstance: DatabaseService | null = null

export const getDatabaseService = (): DatabaseService => {
    if (!databaseInstance) {
        databaseInstance = new DatabaseService()
    }
    return databaseInstance
}

export default DatabaseService
