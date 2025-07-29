/**
 * @fileoverview Tests for database router
 */

import { NetlifyRouter } from 'netlify-api-framework'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createDatabaseRouter } from './databaseRouter.mts'

// Mock database service
vi.mock('../../../src/services/databaseService.js', () => ({
    getDatabaseService: () => ({
        healthCheck: vi.fn().mockResolvedValue({ status: 'healthy', connected: true }),
        listTables: vi.fn().mockResolvedValue(['users', 'posts']),
        getTableSchema: vi.fn().mockResolvedValue([
            { column_name: 'id', data_type: 'integer' },
            { column_name: 'name', data_type: 'text' }
        ]),
        query: vi.fn().mockResolvedValue([{ id: 1, name: 'John' }]),
        queryOne: vi.fn().mockResolvedValue({ count: 10 }),
        insert: vi.fn().mockResolvedValue({ id: 1, name: 'John' }),
        update: vi.fn().mockResolvedValue({ id: 1, name: 'John Updated' }),
        delete: vi.fn().mockResolvedValue(true)
    })
}))

describe('DatabaseRouter', () => {
    let router: NetlifyRouter

    beforeEach(() => {
        router = createDatabaseRouter()
    })

    describe('GET /health', () => {
        it('should return database health status', async () => {
            const mockEvent = {
                httpMethod: 'GET',
                path: '/api/health',
                headers: {},
                body: '',
                url: 'http://localhost/api/health',
                method: 'GET',
            }
            const context = {} as any

            const response = await router.handle(mockEvent as any, context)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.status).toBe('healthy')
            expect(data.connected).toBe(true)
        })
    })

    describe('GET /tables', () => {
        it('should return list of tables', async () => {
            const mockEvent = {
                httpMethod: 'GET',
                path: '/api/tables',
                headers: {},
                body: '',
                url: 'http://localhost/api/tables',
                method: 'GET',
            }
            const context = {} as any

            const response = await router.handle(mockEvent as any, context)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.tables).toEqual(['users', 'posts'])
        })
    })

    describe('POST /tables/:tableName', () => {
        it('should insert new record', async () => {
            const requestData = { data: { name: 'John' } }
            const mockEvent = {
                httpMethod: 'POST',
                path: '/api/tables/users',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
                url: 'http://localhost/api/tables/users',
                method: 'POST',
                parsedBody: requestData // Add the parsed body that middleware would normally provide
            }
            const context = {} as any

            const response = await router.handle(mockEvent as any, context)
            const data = await response.json()

            expect(response.status).toBe(201)
            expect(data.table).toBe('users')
            expect(data.inserted).toEqual({ id: 1, name: 'John' })
        })

        it('should return error when data is missing', async () => {
            const mockEvent = {
                httpMethod: 'POST',
                path: '/api/tables/users',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
                url: 'http://localhost/api/tables/users',
                method: 'POST',
                parsedBody: {} // Missing data property
            }
            const context = {} as any

            const response = await router.handle(mockEvent as any, context)
            const data = await response.json()

            expect(response.status).toBe(400)
            expect(data.error).toBe('Data object is required')
        })
    })

    describe('PUT /tables/:tableName/:id', () => {
        it('should update record', async () => {
            const requestData = { data: { name: 'John Updated' } }
            const mockEvent = {
                httpMethod: 'PUT',
                path: '/api/tables/users/1',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
                url: 'http://localhost/api/tables/users/1',
                method: 'PUT',
                parsedBody: requestData
            }
            const context = {} as any

            const response = await router.handle(mockEvent as any, context)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.table).toBe('users')
            expect(data.id).toBe('1')
            expect(data.updated).toEqual({ id: 1, name: 'John Updated' })
        })
    })

    describe('DELETE /tables/:tableName/:id', () => {
        it('should delete record', async () => {
            const mockEvent = {
                httpMethod: 'DELETE',
                path: '/api/tables/users/1',
                headers: {},
                body: '',
                url: 'http://localhost/api/tables/users/1',
                method: 'DELETE',
            }
            const context = {} as any

            const response = await router.handle(mockEvent as any, context)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.table).toBe('users')
            expect(data.id).toBe('1')
            expect(data.deleted).toBe(true)
        })
    })

    describe('GET /tables/:tableName/schema', () => {
        it('should return table schema', async () => {
            const mockEvent = {
                httpMethod: 'GET',
                path: '/api/tables/users/schema',
                headers: {},
                body: '',
                url: 'http://localhost/api/tables/users/schema',
                method: 'GET',
            }
            const context = {} as any

            const response = await router.handle(mockEvent as any, context)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.table).toBe('users')
            expect(data.schema).toEqual([
                { column_name: 'id', data_type: 'integer' },
                { column_name: 'name', data_type: 'text' }
            ])
        })
    })

    describe('Error handling', () => {
        it('should handle PUT request without data', async () => {
            const mockEvent = {
                httpMethod: 'PUT',
                path: '/api/tables/users/1',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
                url: 'http://localhost/api/tables/users/1',
                method: 'PUT',
                parsedBody: {} // Missing data property
            }
            const context = {} as any

            const response = await router.handle(mockEvent as any, context)
            const data = await response.json()

            expect(response.status).toBe(400)
            expect(data.error).toBe('Data object is required')
        })
    })
})
