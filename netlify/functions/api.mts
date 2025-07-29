import { NetlifyRouter, corsMiddleware, createErrorResponse, errorHandlingMiddleware, json, jsonBodyParser } from 'netlify-api-framework'
import { getDatabaseService } from '../../src/services/databaseService'

const router = new NetlifyRouter()

// Add global middleware
router.use(corsMiddleware)
router.use(jsonBodyParser)
router.use(errorHandlingMiddleware)

// Define basic routes
router.get('/hello', async (_req, _context) => {
  return json({
    message: 'Hello World!',
    timestamp: new Date().toISOString()
  })
})

router.get('/hello/:name', async (_req, _context, params) => {
  return json({
    message: `Hello, ${params?.name}!`,
    timestamp: new Date().toISOString()
  })
})

// Public routes
router.get('/health', async (_req, _context) => {
  return json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Database sub-router
const databaseRouter = new NetlifyRouter()
const db = getDatabaseService()

// Health check endpoint
databaseRouter.get('/health', async (_req, _context) => {
  try {
    const health = await db.healthCheck()
    return json(health)
  } catch (error) {
    return createErrorResponse('Database health check failed', 500, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// List all tables
databaseRouter.get('/tables', async (_req, _context) => {
  try {
    const tables = await db.listTables()
    return json({ tables })
  } catch (error) {
    return createErrorResponse('Failed to list tables', 500, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Get table schema
databaseRouter.get('/tables/:tableName/schema', async (_req, _context, params) => {
  try {
    const schema = await db.getTableSchema(params?.tableName || '')
    return json({
      table: params?.tableName,
      schema
    })
  } catch (error) {
    return createErrorResponse('Failed to get table schema', 500, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Query table data with pagination
databaseRouter.get('/tables/:tableName/data', async (req, _context, params) => {
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
      return createErrorResponse('Table not found', 404)
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
    return createErrorResponse('Failed to query table data', 500, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Execute custom SQL query (GET for SELECT only)
databaseRouter.get('/query', async (req, _context) => {
  try {
    const url = new URL(req.url)
    const sql = url.searchParams.get('sql')

    if (!sql) {
      return createErrorResponse('SQL query parameter is required', 400)
    }

    // Only allow SELECT queries for security
    const trimmedSql = sql.trim().toLowerCase()
    if (!trimmedSql.startsWith('select')) {
      return createErrorResponse('Only SELECT queries are allowed via GET', 400)
    }

    const results = await db.query(sql)

    return json({
      sql,
      results,
      count: results.length
    })
  } catch (error) {
    return createErrorResponse('Query execution failed', 500, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Execute custom SQL query (POST for all operations)
databaseRouter.post('/query', async (req, _context) => {
  try {
    const body = (req as any).parsedBody

    if (!body.sql) {
      return createErrorResponse('SQL query is required', 400)
    }

    const results = await db.query(body.sql, body.params || [])

    return json({
      sql: body.sql,
      results,
      count: results.length
    })
  } catch (error) {
    return createErrorResponse('Query execution failed', 500, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Insert record into table
databaseRouter.post('/tables/:tableName', async (req, _context, params) => {
  try {
    const tableName = params?.tableName || ''
    const body = (req as any).parsedBody

    if (!body.data) {
      return createErrorResponse('Data object is required', 400)
    }

    const result = await db.insert(tableName, body.data)

    return json({
      table: tableName,
      inserted: result
    }, 201)
  } catch (error) {
    return createErrorResponse('Insert operation failed', 500, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Update record in table
databaseRouter.put('/tables/:tableName/:id', async (req, _context, params) => {
  try {
    const tableName = params?.tableName || ''
    const id = params?.id || ''
    const body = (req as any).parsedBody

    if (!body.data) {
      return createErrorResponse('Data object is required', 400)
    }

    const result = await db.update(tableName, body.data, { id })

    return json({
      table: tableName,
      updated: result
    })
  } catch (error) {
    return createErrorResponse('Update operation failed', 500, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Delete record from table
databaseRouter.delete('/tables/:tableName/:id', async (_req, _context, params) => {
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
      return createErrorResponse('Record not found or delete failed', 404)
    }
  } catch (error) {
    return createErrorResponse('Delete operation failed', 500, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Mount database router under /database path
router.use('/database', databaseRouter)

// Export handler for Netlify
export const handler = router.handler()
