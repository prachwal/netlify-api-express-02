/**
 * @fileoverview Main Netlify Functions API entry point
 * @packageDocumentation
 */

import { NetlifyRouter, corsMiddleware, errorHandlingMiddleware, jsonBodyParser } from 'netlify-api-framework'
import { createBasicRouter, createDatabaseRouter } from './routers/index.mts'

const router = new NetlifyRouter()

// Add global middleware
router.use(corsMiddleware)
router.use(jsonBodyParser)
router.use(errorHandlingMiddleware)

// Mount basic routes (hello, health)
const basicRouter = createBasicRouter()
router.use('/', basicRouter)

// Mount database router under /database path
const databaseRouter = createDatabaseRouter()
router.use('/database', databaseRouter)

// Export handler for Netlify
export const handler = router.handler()
