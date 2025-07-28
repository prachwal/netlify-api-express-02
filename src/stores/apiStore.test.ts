import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useApiStore } from './apiStore'

// Mock fetch
global.fetch = vi.fn()

describe('useApiStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('should initialize with correct default state', () => {
        const store = useApiStore()

        expect(store.loading).toBe(false)
        expect(store.responses).toEqual({})
        expect(store.errors).toEqual({})
        expect(store.requestHistory).toEqual([])
        expect(store.isLoading).toBe(false)
    })

    it('should make successful API request', async () => {
        const store = useApiStore()
        const mockResponse = {
            message: 'Hello from API',
            timestamp: '2023-01-01T00:00:00.000Z',
            path: '/api/hello',
            method: 'GET'
        }

        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        } as Response)

        const result = await store.makeRequest('/api/hello')

        expect(fetch).toHaveBeenCalledWith('/api/hello', {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        expect(result).toEqual(mockResponse)
        expect(store.responses['/api/hello']).toEqual(mockResponse)
        expect(store.requestHistory).toHaveLength(1)
        expect(store.requestHistory[0].success).toBe(true)
        expect(store.requestHistory[0].endpoint).toBe('/api/hello')
    })

    it('should handle API request errors', async () => {
        const store = useApiStore()

        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        } as Response)

        await expect(store.makeRequest('/api/notfound')).rejects.toThrow('HTTP 404: Not Found')

        expect(store.errors['/api/notfound']).toBeDefined()
        expect(store.errors['/api/notfound'].message).toBe('HTTP 404: Not Found')
        expect(store.requestHistory).toHaveLength(1)
        expect(store.requestHistory[0].success).toBe(false)
    })

    it('should handle network errors', async () => {
        const store = useApiStore()

        vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

        await expect(store.makeRequest('/api/hello')).rejects.toThrow('Network error')

        expect(store.errors['/api/hello']).toBeDefined()
        expect(store.errors['/api/hello'].message).toBe('Network error')
    })

    it('should call hello API endpoint', async () => {
        const store = useApiStore()
        const mockResponse = {
            message: 'Hello',
            timestamp: '2023-01-01T00:00:00.000Z',
            path: '/api/hello',
            method: 'GET'
        }

        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        } as Response)

        const result = await store.callHelloApi()

        expect(fetch).toHaveBeenCalledWith('/api/hello', {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        expect(result).toEqual(mockResponse)
    })

    it('should make API request with custom method and body', async () => {
        const store = useApiStore()
        const requestBody = { data: 'test' }
        const mockResponse = {
            message: 'Created',
            timestamp: '2023-01-01T00:00:00.000Z',
            path: '/api/create',
            method: 'POST'
        }

        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        } as Response)

        const result = await store.callApiWithMethod('/api/create', 'POST', requestBody)

        expect(fetch).toHaveBeenCalledWith('/api/create', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        expect(result).toEqual(mockResponse)
    })

    it('should clear responses and errors', async () => {
        const store = useApiStore()

        // Add some mock data by making actual requests
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                message: 'test',
                timestamp: '2023-01-01T00:00:00.000Z',
                path: '/api/test',
                method: 'GET'
            }),
        } as Response)

        await store.makeRequest('/api/test')

        // Verify data exists
        expect(store.responses['/api/test']).toBeDefined()

        store.clearResponse('/api/test')

        expect(store.responses['/api/test']).toBeUndefined()
        expect(store.errors['/api/test']).toBeUndefined()
    })

    it('should clear all responses and errors', async () => {
        const store = useApiStore()

        // Add some mock data by making actual requests
        vi.mocked(fetch)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    message: 'test1',
                    timestamp: '2023-01-01T00:00:00.000Z',
                    path: '/api/test1',
                    method: 'GET'
                }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    message: 'test2',
                    timestamp: '2023-01-01T00:00:00.000Z',
                    path: '/api/test2',
                    method: 'GET'
                }),
            } as Response)

        await store.makeRequest('/api/test1')
        await store.makeRequest('/api/test2')

        expect(Object.keys(store.responses)).toHaveLength(2)

        store.clearAllResponses()

        expect(Object.keys(store.responses)).toHaveLength(0)
        expect(Object.keys(store.errors)).toHaveLength(0)
    })

    it('should clear request history', async () => {
        const store = useApiStore()

        // Add some mock history by making actual requests
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                message: 'test',
                timestamp: '2023-01-01T00:00:00.000Z',
                path: '/api/test',
                method: 'GET'
            }),
        } as Response)

        await store.makeRequest('/api/test')
        expect(store.requestHistory).toHaveLength(1)

        store.clearHistory()

        expect(store.requestHistory).toHaveLength(0)
    })

    it('should compute successful and failed requests correctly', async () => {
        const store = useApiStore()

        // Add mock history with successful and failed requests
        vi.mocked(fetch)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'test1', timestamp: '2023-01-01T00:00:00.000Z', path: '/api/test1', method: 'GET' }),
            } as Response)
            .mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'test3', timestamp: '2023-01-01T00:00:00.000Z', path: '/api/test3', method: 'GET' }),
            } as Response)

        await store.makeRequest('/api/test1')
        await expect(store.makeRequest('/api/test2')).rejects.toThrow()
        await store.makeRequest('/api/test3')

        expect(store.successfulRequests).toHaveLength(2)
        expect(store.failedRequests).toHaveLength(1)
    })

    it('should get response and error by endpoint', async () => {
        const store = useApiStore()

        // Make successful request
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                message: 'test',
                timestamp: '2023-01-01T00:00:00.000Z',
                path: '/api/test',
                method: 'GET'
            }),
        } as Response)

        await store.makeRequest('/api/test')

        // Make failing request
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        } as Response)

        await expect(store.makeRequest('/api/error')).rejects.toThrow()

        expect(store.getResponse('/api/test')).toBeDefined()
        expect(store.getResponse('/api/test')?.message).toBe('test')
        expect(store.getError('/api/error')).toBeDefined()
        expect(store.getError('/api/error')?.message).toBe('HTTP 404: Not Found')
        expect(store.getResponse('/api/nonexistent')).toBeUndefined()
    })

    it('should track loading state during request', async () => {
        const store = useApiStore()

        // Mock response
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                message: 'test',
                timestamp: '2023-01-01T00:00:00.000Z',
                path: '/api/test',
                method: 'GET'
            }),
        } as Response)

        const promise = store.makeRequest('/api/test')

        expect(store.loading).toBe(true)
        expect(store.isLoading).toBe(true)

        await promise

        expect(store.loading).toBe(false)
        expect(store.isLoading).toBe(false)
    })
})
