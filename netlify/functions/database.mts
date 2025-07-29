import { NetlifyRouter, json, jsonBodyParser, errorHandlingMiddleware, createErrorResponse } from 'netlify-api-framework'
import { getDatabaseService } from '../../src/services/databaseService'

const router = new NetlifyRouter()

// Global middleware
router.use(jsonBodyParser)
router.use(errorHandlingMiddleware)

const db = getDatabaseService()

// Health check endpoint
router.get('/health', async (req, context) => {
  try {
    const health = await db.healthCheck()
    return json(health)
  } catch (error) {
    return createErrorResponse(500, 'Database health check failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// List all tables
router.get('/tables', async (req, context) => {
  try {
    const tables = await db.listTables()
    return json({ tables })
  } catch (error) {
    return createErrorResponse(500, 'Failed to list tables', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Get table schema
router.get('/tables/:tableName/schema', async (req, context, params) => {
  try {
    const schema = await db.getTableSchema(params?.tableName || '')
    return json({ 
      table: params?.tableName,
      schema 
    })
  } catch (error) {
    return createErrorResponse(500, 'Failed to get table schema', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Query table data with pagination
router.get('/tables/:tableName/data', async (req, context, params) => {
  try {
    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const orderBy = url.searchParams.get('orderBy') || 'id'
    const orderDir = url.searchParams.get('orderDir') || 'ASC'
    
    const tableName = params?.tableName || ''
    
    // Validate table name to prevent SQL injection
    const tables = await db.listTables()
    if (!tables.includes(tableName)) {
      return createErrorResponse(404, 'Table not found')
    }
    
    // Get data with pagination
    const data = await db.query(`
      SELECT * FROM ${tableName}
      ORDER BY ${orderBy} ${orderDir}
      LIMIT $1 OFFSET $2
    `, [limit, offset])
    
    // Get total count
    const countResult = await db.queryOne<{ count: number }>(`
      SELECT COUNT(*) as count FROM ${tableName}
    `)
    
    return json({
      table: tableName,
      data,
      pagination: {
        limit,
        offset,
        total: countResult?.count || 0
      }
    })
  } catch (error) {
    return createErrorResponse(500, 'Failed to query table data', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Execute custom SQL query (GET for SELECT only)
router.get('/query', async (req, context) => {
  try {
    const url = new URL(req.url)
    const sql = url.searchParams.get('sql')
    
    if (!sql) {
      return createErrorResponse(400, 'SQL query parameter is required')
    }
    
    // Only allow SELECT queries for security
    const trimmedSql = sql.trim().toLowerCase()
    if (!trimmedSql.startsWith('select')) {
      return createErrorResponse(400, 'Only SELECT queries are allowed via GET')
    }
    
    const results = await db.query(sql)
    
    return json({
      sql,
      results,
      count: results.length
    })
  } catch (error) {
    return createErrorResponse(500, 'Query execution failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Execute custom SQL query (POST for all operations)
router.post('/query', async (req, context) => {
  try {
    const body = (req as any).parsedBody
    
    if (!body.sql) {
      return createErrorResponse(400, 'SQL query is required')
    }
    
    const results = await db.query(body.sql, body.params || [])
    
    return json({
      sql: body.sql,
      results,
      count: results.length
    })
  } catch (error) {
    return createErrorResponse(500, 'Query execution failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Insert record into table
router.post('/tables/:tableName', async (req, context, params) => {
  try {
    const tableName = params?.tableName || ''
    const body = (req as any).parsedBody
    
    if (!body.data) {
      return createErrorResponse(400, 'Data object is required')
    }
    
    const result = await db.insert(tableName, body.data)
    
    return json({
      table: tableName,
      inserted: result
    }, 201)
  } catch (error) {
    return createErrorResponse(500, 'Insert operation failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Update record in table
router.put('/tables/:tableName/:id', async (req, context, params) => {
  try {
    const tableName = params?.tableName || ''
    const id = params?.id || ''
    const body = (req as any).parsedBody
    
    if (!body.data) {
      return createErrorResponse(400, 'Data object is required')
    }
    
    const result = await db.update(tableName, body.data, { id })
    
    return json({
      table: tableName,
      updated: result
    })
  } catch (error) {
    return createErrorResponse(500, 'Update operation failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Delete record from table
router.delete('/tables/:tableName/:id', async (req, context, params) => {
  try {
    const tableName = params?.tableName || ''
    const id = params?.id || ''
    
    const success = await db.delete(tableName, { id })
    
    if (success) {
      return json({
        table: tableName,
        deleted: { id },
        message: 'Record deleted successfully'
      })
    } else {
      return createErrorResponse(404, 'Record not found or delete failed')
    }
  } catch (error) {
    return createErrorResponse(500, 'Delete operation failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export const handler = router.handler()
