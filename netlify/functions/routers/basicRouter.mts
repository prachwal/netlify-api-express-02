/**
 * @fileoverview Basic API endpoints router
 * @packageDocumentation
 */

import { NetlifyRouter, json } from 'netlify-api-framework'

/**
 * Creates and configures basic API router with health and hello endpoints
 * @returns {NetlifyRouter} Configured basic router
 */
export function createBasicRouter(): NetlifyRouter {
    const router = new NetlifyRouter()

    // Hello world endpoint
    router.get('/hello', async (_req, _context) => {
        return json({
            message: 'Hello World!',
            timestamp: new Date().toISOString()
        })
    })

    // Hello with name parameter
    router.get('/hello/:name', async (_req, _context, params) => {
        return json({
            message: `Hello, ${params?.name}!`,
            timestamp: new Date().toISOString()
        })
    })

    // Health check endpoint
    router.get('/health', async (_req, _context) => {
        return json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        })
    })

    return router
}
