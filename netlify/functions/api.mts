import { NetlifyRouter, corsMiddleware, jsonBodyParser, errorHandlingMiddleware, json } from 'netlify-api-framework'

const router = new NetlifyRouter()

// Add global middleware  
router.use(corsMiddleware)
router.use(jsonBodyParser)
router.use(errorHandlingMiddleware)

// Define routes
router.get('/hello', async (req, context) => {
  return json({
    message: 'Hello World!',
    timestamp: new Date().toISOString()
  })
})

router.get('/hello/:name', async (req, context, params) => {
  return json({
    message: `Hello, ${params?.name}!`,
    timestamp: new Date().toISOString()
  })
})

// Public routes
router.get('/health', async (req, context) => {
  return json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Export handler for Netlify
export const handler = router.handler()