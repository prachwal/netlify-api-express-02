import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DatabaseService, getDatabaseService } from './databaseService'
import { neon } from '@netlify/neon'

// Mock the neon function
vi.mock('@netlify/neon', () => ({
  neon: vi.fn()
}))

describe('DatabaseService', () => {
  let mockSql: any
  let databaseService: DatabaseService

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
    
    // Create a mock SQL function
    mockSql = vi.fn()
    ;(neon as any).mockReturnValue(mockSql)
    
    // Create a new instance for each test
    databaseService = new DatabaseService()
  })

  describe('constructor', () => {
    it('should initialize with neon connection', () => {
      expect(neon).toHaveBeenCalledTimes(1)
      expect(neon).toHaveBeenCalledWith()
    })

    it('should initialize unpooled connection when environment variable exists', () => {
      process.env.NETLIFY_DATABASE_URL_UNPOOLED = 'test-unpooled-url'
      
      const serviceWithUnpooled = new DatabaseService()
      
      expect(neon).toHaveBeenCalledTimes(2)
      expect(neon).toHaveBeenCalledWith('test-unpooled-url')
      expect(serviceWithUnpooled).toBeDefined()
      
      // Clean up
      delete process.env.NETLIFY_DATABASE_URL_UNPOOLED
    })
  })

  describe('query', () => {
    it('should execute query with parameters', async () => {
      const mockResult = [{ id: 1, name: 'test' }]
      mockSql.mockResolvedValue(mockResult)

      const result = await databaseService.query('SELECT * FROM users WHERE id = $1', [1])

      expect(mockSql).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [1])
      expect(result).toEqual(mockResult)
    })

    it('should execute query without parameters using template literal', async () => {
      const mockResult = [{ id: 1, name: 'test' }]
      mockSql.mockImplementation((_strings: TemplateStringsArray) => {
        return Promise.resolve(mockResult)
      })

      const result = await databaseService.query('SELECT * FROM users')

      expect(result).toEqual(mockResult)
    })

    it('should handle query errors', async () => {
      const error = new Error('Database connection failed')
      mockSql.mockRejectedValue(error)

      await expect(databaseService.query('SELECT * FROM users')).rejects.toThrow(
        'Database query failed: Database connection failed'
      )
    })
  })

  describe('queryOne', () => {
    it('should return single record when results exist', async () => {
      const mockResult = [{ id: 1, name: 'test' }, { id: 2, name: 'test2' }]
      mockSql.mockResolvedValue(mockResult)

      const result = await databaseService.queryOne('SELECT * FROM users')

      expect(result).toEqual({ id: 1, name: 'test' })
    })

    it('should return null when no results', async () => {
      mockSql.mockResolvedValue([])

      const result = await databaseService.queryOne('SELECT * FROM users WHERE id = 999')

      expect(result).toBeNull()
    })
  })

  describe('insert', () => {
    it('should insert record and return result', async () => {
      const insertData = { name: 'John', email: 'john@example.com' }
      const mockResult = [{ id: 1, ...insertData }]
      mockSql.mockResolvedValue(mockResult)

      const result = await databaseService.insert('users', insertData)

      expect(mockSql).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        ['John', 'john@example.com']
      )
      expect(result).toEqual({ id: 1, ...insertData })
    })
  })

  describe('update', () => {
    it('should update record and return result', async () => {
      const updateData = { name: 'Jane' }
      const whereClause = { id: 1 }
      const mockResult = [{ id: 1, name: 'Jane', email: 'john@example.com' }]
      mockSql.mockResolvedValue(mockResult)

      const result = await databaseService.update('users', updateData, whereClause)

      expect(mockSql).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        ['Jane', 1]
      )
      expect(result).toEqual(mockResult[0])
    })
  })

  describe('delete', () => {
    it('should delete record successfully', async () => {
      mockSql.mockResolvedValue([])

      const result = await databaseService.delete('users', { id: 1 })

      expect(mockSql).toHaveBeenCalledWith(
        'DELETE FROM users WHERE id = $1',
        [1]
      )
      expect(result).toBe(true)
    })

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed')
      mockSql.mockRejectedValue(error)

      const result = await databaseService.delete('users', { id: 1 })

      expect(result).toBe(false)
    })
  })

  describe('listTables', () => {
    it('should return list of table names', async () => {
      const mockResult = [
        { table_name: 'users' },
        { table_name: 'posts' },
        { table_name: 'comments' }
      ]
      mockSql.mockResolvedValue(mockResult)

      const result = await databaseService.listTables()

      expect(mockSql).toHaveBeenCalledWith(
        expect.stringContaining('SELECT table_name'),
        []
      )
      expect(result).toEqual(['users', 'posts', 'comments'])
    })
  })

  describe('getTableSchema', () => {
    it('should return table schema information', async () => {
      const mockResult = [
        {
          column_name: 'id',
          data_type: 'integer',
          is_nullable: 'NO',
          column_default: 'nextval(\'users_id_seq\'::regclass)',
          character_maximum_length: null
        },
        {
          column_name: 'name',
          data_type: 'character varying',
          is_nullable: 'NO',
          column_default: null,
          character_maximum_length: 255
        }
      ]
      mockSql.mockResolvedValue(mockResult)

      const result = await databaseService.getTableSchema('users')

      expect(mockSql).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['users']
      )
      expect(result).toEqual(mockResult)
    })
  })

  describe('healthCheck', () => {
    it('should return healthy status with timestamp and tables', async () => {
      const mockTimeResult = [{ now: '2023-01-01T00:00:00.000Z' }]
      const mockTablesResult = [
        { table_name: 'users' },
        { table_name: 'posts' }
      ]
      
      mockSql
        .mockResolvedValueOnce(mockTimeResult)
        .mockResolvedValueOnce(mockTablesResult)

      const result = await databaseService.healthCheck()

      expect(result).toEqual({
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00.000Z',
        tables: ['users', 'posts']
      })
    })

    it('should return error status when database fails', async () => {
      const error = new Error('Connection failed')
      mockSql.mockRejectedValue(error)

      const result = await databaseService.healthCheck()

      expect(result.status).toBe('error')
      expect(result.timestamp).toBeDefined()
      expect(result.tables).toBeUndefined()
    })
  })

  describe('transaction', () => {
    it('should execute callback within transaction', async () => {
      process.env.NETLIFY_DATABASE_URL_UNPOOLED = 'test-unpooled-url'
      
      const mockUnpooledSql = vi.fn()
      ;(neon as any).mockReturnValue(mockUnpooledSql)
      
      const databaseService = new DatabaseService()
      const callback = vi.fn().mockResolvedValue('success')

      const result = await databaseService.transaction(callback)

      expect(mockUnpooledSql).toHaveBeenCalledWith(['BEGIN'])
      expect(callback).toHaveBeenCalledWith(mockUnpooledSql)
      expect(mockUnpooledSql).toHaveBeenCalledWith(['COMMIT'])
      expect(result).toBe('success')

      // Clean up
      delete process.env.NETLIFY_DATABASE_URL_UNPOOLED
    })

    it('should rollback on error', async () => {
      process.env.NETLIFY_DATABASE_URL_UNPOOLED = 'test-unpooled-url'
      
      const mockUnpooledSql = vi.fn()
      ;(neon as any).mockReturnValue(mockUnpooledSql)
      
      const databaseService = new DatabaseService()
      const error = new Error('Transaction failed')
      const callback = vi.fn().mockRejectedValue(error)

      await expect(databaseService.transaction(callback)).rejects.toThrow('Transaction failed')

      expect(mockUnpooledSql).toHaveBeenCalledWith(['BEGIN'])
      expect(mockUnpooledSql).toHaveBeenCalledWith(['ROLLBACK'])

      // Clean up
      delete process.env.NETLIFY_DATABASE_URL_UNPOOLED
    })

    it('should throw error when unpooled connection not available', async () => {
      await expect(databaseService.transaction(vi.fn())).rejects.toThrow(
        'Unpooled connection not available for transactions'
      )
    })
  })

  describe('getDatabaseService singleton', () => {
    it('should return same instance on multiple calls', () => {
      const instance1 = getDatabaseService()
      const instance2 = getDatabaseService()

      expect(instance1).toBe(instance2)
    })
  })
})
