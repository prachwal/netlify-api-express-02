/**
 * @fileoverview Tests for bas        it('should retu        it('should return health status', async () => {
            const request = new Request('http://localhost/.netlify/functions/api/health')
            const context = {} as any

            const response = await handler(request, context)
            const data = JSON.parse(response.body)

            expect(response.statusCode).toBe(200)
            expect(data.status).toBe('healthy')
            expect(data.version).toBe('1.0.0')
            expect(data.timestamp).toBeDefined()
        })zed hello message', async () => {
            const request = new Request('http://localhost/.netlify/functions/api/hello/John')
            const context = {} as any

            const response = await handler(request, context)
            const data = JSON.parse(response.body)

            expect(response.statusCode).toBe(200)
            expect(data.message).toBe('Hello, John!')
            expect(data.timestamp).toBeDefined()
        })*/

import { NetlifyRouter } from 'netlify-api-framework'
import { beforeEach, describe, expect, it } from 'vitest'
import { createBasicRouter } from './basicRouter.mts'

describe('BasicRouter', () => {
    let router: NetlifyRouter

    beforeEach(() => {
        router = createBasicRouter()
    })

    describe('GET /hello', () => {
        it('should return hello world message', async () => {
            const mockEvent = {
                httpMethod: 'GET',
                path: '/api/hello',
                headers: {},
                body: '',
                url: 'http://localhost/api/hello',
                method: 'GET',
            }
            const context = {} as any

            const response = await router.handle(mockEvent as any, context)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.message).toBe('Hello World!')
            expect(data.timestamp).toBeDefined()
        })
    })

    describe('GET /hello/:name', () => {
        it('should return personalized hello message', async () => {
            const mockEvent = {
                httpMethod: 'GET',
                path: '/api/hello/John',
                headers: {},
                body: '',
                url: 'http://localhost/api/hello/John',
                method: 'GET',
            }
            const context = {} as any

            const response = await router.handle(mockEvent as any, context)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.message).toBe('Hello, John!')
            expect(data.timestamp).toBeDefined()
        })
    })

    describe('GET /health', () => {
        it('should return health status', async () => {
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
            expect(data.version).toBe('1.0.0')
            expect(data.timestamp).toBeDefined()
        })
    })
})
