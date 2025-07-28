# Netlify API Framework - Przewodnik Integracji

## 📋 Przegląd Frameworka

**Netlify API Framework** to nowoczesny, type-safe framework dedykowany do Netlify Functions z pełnym wsparciem TypeScript i comprehensive middleware system. Framework został zaprojektowany specjalnie dla serverless funkcji Netlify z naciskiem na bezpieczeństwo, wydajność i łatwość użycia.

## 🚀 Kluczowe Funkcjonalności

### Core Features
- **TypeScript-First** - Pełne wsparcie TypeScript z comprehensive type definitions
- **Modern Fetch API** - Zbudowany na web standards, bez legacy dependencies
- **Zero Dependencies** - Lightweight z minimal external dependencies
- **ES Modules** - Nowoczesna architektura modułowa

### Middleware System
- **Comprehensive Middleware** - Authentication, CORS, rate limiting, security headers
- **Custom Middleware** - Easy creation of custom middleware functions
- **Middleware Composition** - Flexible middleware stacking and ordering
- **Built-in Security** - Security headers, request validation, error handling

### Routing & Performance
- **Dynamic Route Parameters** - Automatic parsing z type safety
- **Performance Monitoring** - Built-in metrics i logging
- **Error Handling** - Comprehensive error handling i validation
- **Testing Support** - Full test suite z Vitest integration

## 📦 Instalacja i Konfiguracja

### Podstawowa Instalacja
```bash
npm install netlify-api-framework
```

### Konfiguracja TypeScript
```json
// tsconfig.netlify.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### Konfiguracja Netlify
```toml
# netlify.toml
[build]
  functions = "netlify/functions"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

## 🏗️ Podstawowe Użycie

### Minimalna Konfiguracja
```typescript
// netlify/functions/api.mts
import { NetlifyRouter, corsMiddleware, jsonBodyParser, errorHandlingMiddleware, json } from 'netlify-api-framework'

const router = new NetlifyRouter()

// Global middleware
router.use(corsMiddleware)
router.use(jsonBodyParser)
router.use(errorHandlingMiddleware)

// Basic routes
router.get('/hello', async (req, context) => {
  return json({ 
    message: 'Hello World!',
    timestamp: new Date().toISOString()
  })
})

router.get('/health', async (req, context) => {
  return json({ 
    status: 'healthy',
    version: '1.0.0'
  })
})

export const handler = router.handler()
```

### Zaawansowana Konfiguracja z Middleware Stack
```typescript
import { 
  NetlifyRouter, 
  corsMiddleware, 
  jsonBodyParser, 
  errorHandlingMiddleware,
  authMiddleware,
  rateLimitMiddleware,
  requestIdMiddleware,
  securityHeadersMiddleware,
  performanceMiddleware,
  json
} from 'netlify-api-framework'

const router = new NetlifyRouter()

// Complete middleware stack
router.use(requestIdMiddleware)      // Request tracking
router.use(securityHeadersMiddleware) // Security headers
router.use(corsMiddleware)           // CORS handling
router.use(rateLimitMiddleware)      // Rate limiting
router.use(jsonBodyParser)           // JSON parsing
router.use(performanceMiddleware)    // Performance monitoring
router.use(errorHandlingMiddleware)  // Error handling

// Public routes
router.get('/api/health', async (req, context) => {
  return json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Protected routes with sub-router
const protectedRouter = new NetlifyRouter()
protectedRouter.use(authMiddleware)

protectedRouter.get('/profile', async (req, context) => {
  const user = (req as any).user // Added by auth middleware
  return json({ 
    user: {
      id: user.id,
      email: user.email
    }
  })
})

// Mount protected routes
router.use('/api/protected', protectedRouter)

export const handler = router.handler()
```

## 🛠️ API Reference

### NetlifyRouter Class

#### HTTP Methods
```typescript
const router = new NetlifyRouter()

// Standard HTTP methods
router.get(path, handler)
router.post(path, handler)
router.put(path, handler)
router.delete(path, handler)
router.patch(path, handler)
router.options(path, handler)

// Middleware registration
router.use(middleware)
router.use(path, subRouter)

// Handler generation
const handler = router.handler()
```

#### Route Parameters
```typescript
// Dynamic route parameters
router.get('/users/:id', async (req, context, params) => {
  const userId = params?.id
  return json({ userId })
})

// Multiple parameters
router.get('/users/:userId/posts/:postId', async (req, context, params) => {
  const { userId, postId } = params || {}
  return json({ userId, postId })
})

// Query parameters
router.get('/search', async (req, context) => {
  const queryParams = parseQueryParams(req)
  const { q, limit, offset } = queryParams
  return json({ query: q, limit, offset })
})
```

### Built-in Middleware

#### Core Middleware
```typescript
import { 
  corsMiddleware,           // CORS handling
  jsonBodyParser,           // JSON body parsing
  errorHandlingMiddleware,  // Error handling
  authMiddleware,          // Authentication
  rateLimitMiddleware,     // Rate limiting
  requestIdMiddleware,     // Request ID generation
  securityHeadersMiddleware, // Security headers
  performanceMiddleware,   // Performance monitoring
  cacheMiddleware,         // Response caching
  compressionMiddleware,   // Response compression
  requestSizeLimitMiddleware, // Request size limits
  loggingMiddleware        // Request logging
} from 'netlify-api-framework'
```

#### Custom Middleware Creation
```typescript
import { Middleware } from 'netlify-api-framework'

const customAuthMiddleware: Middleware = async (req, context, next) => {
  const authHeader = req.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const token = authHeader.substring(7)
  
  try {
    // Validate token (implement your logic)
    const user = await validateToken(token)
    
    // Add user to request context
    (req as any).user = user
    
    return next()
  } catch (error) {
    return new Response('Invalid token', { status: 401 })
  }
}

router.use('/api/protected', customAuthMiddleware)
```

### Utility Functions

#### Response Helpers
```typescript
import { json, text, html, createErrorResponse } from 'netlify-api-framework'

// JSON responses
return json({ data: 'value' }, 200)
return json({ error: 'Not found' }, 404)

// Text responses
return text('Hello World', 200)

// HTML responses
return html('<h1>Hello World</h1>', 200)

// Error responses
return createErrorResponse(400, 'Bad Request', { 
  field: 'Missing required field' 
})
```

#### Request Processing
```typescript
import { parseQueryParams, validateFields } from 'netlify-api-framework'

// Parse query parameters
const params = parseQueryParams(req)
const { search, page, limit } = params

// Validate request body fields
const body = (req as any).parsedBody
const validation = validateFields(body, ['name', 'email', 'password'])

if (!validation.isValid) {
  return createErrorResponse(400, 'Missing required fields', { 
    missing: validation.missing 
  })
}
```

#### Logging Utilities
```typescript
import { consoleFormat } from 'netlify-api-framework'

// Structured logging
console.log(consoleFormat('info', 'Request processed', { 
  requestId: '123',
  userId: 'user456',
  duration: '150ms'
}))

console.error(consoleFormat('error', 'Database connection failed', {
  error: error.message,
  stack: error.stack
}))
```

## 📚 Wzorce Implementacji

### REST API z CRUD Operations
```typescript
import { NetlifyRouter, json, jsonBodyParser, errorHandlingMiddleware, parseQueryParams } from 'netlify-api-framework'

const router = new NetlifyRouter()
router.use(jsonBodyParser)
router.use(errorHandlingMiddleware)

// In-memory store (use database in production)
const posts = new Map()

// GET /api/posts - List all posts
router.get('/api/posts', async (req, context) => {
  const queryParams = parseQueryParams(req)
  const limit = parseInt(queryParams.limit || '10')
  const offset = parseInt(queryParams.offset || '0')
  
  const allPosts = Array.from(posts.values())
  const paginatedPosts = allPosts.slice(offset, offset + limit)
  
  return json({
    posts: paginatedPosts,
    total: allPosts.length,
    pagination: { limit, offset }
  })
})

// GET /api/posts/:id - Get single post
router.get('/api/posts/:id', async (req, context, params) => {
  const post = posts.get(params?.id)
  
  if (!post) {
    return json({ error: 'Post not found' }, 404)
  }
  
  return json({ post })
})

// POST /api/posts - Create new post
router.post('/api/posts', async (req, context) => {
  const body = (req as any).parsedBody
  
  const validation = validateFields(body, ['title', 'content'])
  if (!validation.isValid) {
    return createErrorResponse(400, 'Missing required fields', {
      missing: validation.missing
    })
  }
  
  const post = {
    id: Date.now().toString(),
    title: body.title,
    content: body.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  posts.set(post.id, post)
  
  return json({ post }, 201)
})

// PUT /api/posts/:id - Update post
router.put('/api/posts/:id', async (req, context, params) => {
  const post = posts.get(params?.id)
  
  if (!post) {
    return json({ error: 'Post not found' }, 404)
  }
  
  const body = (req as any).parsedBody
  const updatedPost = {
    ...post,
    ...body,
    updatedAt: new Date().toISOString()
  }
  
  posts.set(post.id, updatedPost)
  
  return json({ post: updatedPost })
})

// DELETE /api/posts/:id - Delete post
router.delete('/api/posts/:id', async (req, context, params) => {
  const exists = posts.has(params?.id)
  
  if (!exists) {
    return json({ error: 'Post not found' }, 404)
  }
  
  posts.delete(params?.id)
  
  return json({ message: 'Post deleted successfully' })
})

export const handler = router.handler()
```

### Authentication & Authorization
```typescript
import { NetlifyRouter, authMiddleware, json } from 'netlify-api-framework'
import jwt from 'jsonwebtoken'

const router = new NetlifyRouter()

// JWT-based authentication middleware
const jwtAuthMiddleware: Middleware = async (req, context, next) => {
  const authHeader = req.headers.get('Authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Missing or invalid authorization header' }, 401)
  }
  
  const token = authHeader.substring(7)
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    (req as any).user = decoded
    return next()
  } catch (error) {
    return json({ error: 'Invalid or expired token' }, 401)
  }
}

// Role-based authorization
const requireRole = (role: string): Middleware => {
  return async (req, context, next) => {
    const user = (req as any).user
    
    if (!user || user.role !== role) {
      return json({ error: 'Insufficient permissions' }, 403)
    }
    
    return next()
  }
}

// Public authentication endpoint
router.post('/api/auth/login', async (req, context) => {
  const { email, password } = (req as any).parsedBody
  
  // Validate credentials (implement your logic)
  const user = await validateCredentials(email, password)
  
  if (!user) {
    return json({ error: 'Invalid credentials' }, 401)
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  )
  
  return json({ token, user })
})

// Protected routes
const protectedRouter = new NetlifyRouter()
protectedRouter.use(jwtAuthMiddleware)

protectedRouter.get('/profile', async (req, context) => {
  const user = (req as any).user
  return json({ user })
})

// Admin-only routes
const adminRouter = new NetlifyRouter()
adminRouter.use(jwtAuthMiddleware)
adminRouter.use(requireRole('admin'))

adminRouter.get('/users', async (req, context) => {
  // Admin-only endpoint
  const users = await getAllUsers()
  return json({ users })
})

// Mount routers
router.use('/api/auth', protectedRouter)
router.use('/api/admin', adminRouter)

export const handler = router.handler()
```

### File Upload & Processing
```typescript
import { NetlifyRouter, json, createErrorResponse } from 'netlify-api-framework'

const router = new NetlifyRouter()

// File upload middleware
const fileUploadMiddleware: Middleware = async (req, context, next) => {
  if (req.method !== 'POST' || !req.body) {
    return next()
  }
  
  const contentType = req.headers.get('content-type')
  
  if (contentType?.includes('multipart/form-data')) {
    try {
      const formData = await req.formData()
      (req as any).formData = formData
    } catch (error) {
      return createErrorResponse(400, 'Invalid form data')
    }
  }
  
  return next()
}

router.use(fileUploadMiddleware)

// File upload endpoint
router.post('/api/upload', async (req, context) => {
  const formData = (req as any).formData
  
  if (!formData) {
    return createErrorResponse(400, 'No form data provided')
  }
  
  const file = formData.get('file') as File
  
  if (!file) {
    return createErrorResponse(400, 'No file provided')
  }
  
  // Validate file type and size
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return createErrorResponse(400, 'Invalid file type')
  }
  
  if (file.size > maxSize) {
    return createErrorResponse(400, 'File too large')
  }
  
  try {
    // Process file (save to storage, resize, etc.)
    const fileBuffer = await file.arrayBuffer()
    const fileName = `${Date.now()}-${file.name}`
    
    // Save to Netlify Blobs or external storage
    // const savedFile = await saveFile(fileName, fileBuffer)
    
    return json({
      message: 'File uploaded successfully',
      file: {
        name: fileName,
        size: file.size,
        type: file.type
      }
    })
  } catch (error) {
    console.error('File upload error:', error)
    return createErrorResponse(500, 'File upload failed')
  }
})

export const handler = router.handler()
```

## 🧪 Testing Framework

### Podstawowa Konfiguracja Testów
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['netlify/functions/**/*.{ts,mts}'],
      exclude: ['**/*.test.ts', '**/*.spec.ts']
    }
  }
})
```

### Przykłady Testów API
```typescript
// tests/api.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { NetlifyRouter, json, jsonBodyParser } from 'netlify-api-framework'

describe('API Routes', () => {
  let router: NetlifyRouter
  let handler: Function

  beforeEach(() => {
    router = new NetlifyRouter()
    router.use(jsonBodyParser)
    
    router.get('/test', async (req, context) => {
      return json({ message: 'test' })
    })
    
    router.post('/echo', async (req, context) => {
      const body = (req as any).parsedBody
      return json({ echo: body })
    })
    
    handler = router.handler()
  })

  it('should handle GET request', async () => {
    const request = new Request('http://localhost/.netlify/functions/api/test')
    const context = {} as any
    
    const response = await handler(request, context)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.message).toBe('test')
  })

  it('should handle POST request with JSON body', async () => {
    const request = new Request('http://localhost/.netlify/functions/api/echo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hello: 'world' })
    })
    const context = {} as any
    
    const response = await handler(request, context)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.echo.hello).toBe('world')
  })

  it('should handle route parameters', async () => {
    router.get('/users/:id', async (req, context, params) => {
      return json({ userId: params?.id })
    })
    
    const handler = router.handler()
    const request = new Request('http://localhost/.netlify/functions/api/users/123')
    const context = {} as any
    
    const response = await handler(request, context)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.userId).toBe('123')
  })
})
```

### Middleware Testing
```typescript
// tests/middleware.test.ts
import { describe, it, expect } from 'vitest'
import { NetlifyRouter, json, Middleware } from 'netlify-api-framework'

describe('Middleware', () => {
  it('should execute middleware in order', async () => {
    const router = new NetlifyRouter()
    const executionOrder: string[] = []
    
    const middleware1: Middleware = async (req, context, next) => {
      executionOrder.push('middleware1')
      return next()
    }
    
    const middleware2: Middleware = async (req, context, next) => {
      executionOrder.push('middleware2')
      return next()
    }
    
    router.use(middleware1)
    router.use(middleware2)
    
    router.get('/test', async (req, context) => {
      executionOrder.push('handler')
      return json({ order: executionOrder })
    })
    
    const handler = router.handler()
    const request = new Request('http://localhost/.netlify/functions/api/test')
    const context = {} as any
    
    const response = await handler(request, context)
    const data = await response.json()
    
    expect(data.order).toEqual(['middleware1', 'middleware2', 'handler'])
  })

  it('should handle middleware errors', async () => {
    const router = new NetlifyRouter()
    
    const errorMiddleware: Middleware = async (req, context, next) => {
      return new Response('Middleware Error', { status: 400 })
    }
    
    router.use(errorMiddleware)
    router.get('/test', async (req, context) => {
      return json({ message: 'should not reach here' })
    })
    
    const handler = router.handler()
    const request = new Request('http://localhost/.netlify/functions/api/test')
    const context = {} as any
    
    const response = await handler(request, context)
    const text = await response.text()
    
    expect(response.status).toBe(400)
    expect(text).toBe('Middleware Error')
  })
})
```

## 🔐 Security Best Practices

### Input Validation
```typescript
import { validateFields, createErrorResponse } from 'netlify-api-framework'

router.post('/api/users', async (req, context) => {
  const body = (req as any).parsedBody
  
  // Validate required fields
  const validation = validateFields(body, ['email', 'password', 'name'])
  if (!validation.isValid) {
    return createErrorResponse(400, 'Missing required fields', {
      missing: validation.missing
    })
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    return createErrorResponse(400, 'Invalid email format')
  }
  
  // Validate password strength
  if (body.password.length < 8) {
    return createErrorResponse(400, 'Password must be at least 8 characters')
  }
  
  // Sanitize input
  const sanitizedUser = {
    email: body.email.toLowerCase().trim(),
    name: body.name.trim(),
    password: body.password // Hash in production
  }
  
  // Process user creation
  return json({ message: 'User created', user: sanitizedUser })
})
```

### Rate Limiting & Security Headers
```typescript
import { 
  rateLimitMiddleware, 
  securityHeadersMiddleware,
  requestSizeLimitMiddleware 
} from 'netlify-api-framework'

const router = new NetlifyRouter()

// Security middleware stack
router.use(securityHeadersMiddleware)     // Security headers
router.use(rateLimitMiddleware)           // Rate limiting
router.use(requestSizeLimitMiddleware)    // Request size limits

// Custom rate limiting
const apiRateLimit: Middleware = async (req, context, next) => {
  const clientIP = context.clientContext?.ip || 'unknown'
  
  // Implement rate limiting logic (use external store)
  // const isRateLimited = await checkRateLimit(clientIP)
  
  // if (isRateLimited) {
  //   return new Response('Too Many Requests', { status: 429 })
  // }
  
  return next()
}

router.use('/api', apiRateLimit)
```

## 📈 Performance Optimization

### Caching Strategies
```typescript
import { cacheMiddleware, performanceMiddleware } from 'netlify-api-framework'

const router = new NetlifyRouter()

// Performance monitoring
router.use(performanceMiddleware)

// Response caching
router.use(cacheMiddleware)

// Custom caching middleware
const customCache: Middleware = async (req, context, next) => {
  if (req.method !== 'GET') {
    return next()
  }
  
  const cacheKey = `cache:${req.url}`
  
  // Check cache (implement with external cache store)
  // const cached = await getFromCache(cacheKey)
  // if (cached) {
  //   return new Response(cached, {
  //     headers: { 'X-Cache': 'HIT' }
  //   })
  // }
  
  const response = await next()
  
  // Cache successful responses
  if (response.status === 200) {
    // await setCache(cacheKey, await response.clone().text(), 300) // 5 min TTL
    response.headers.set('X-Cache', 'MISS')
  }
  
  return response
}

router.use('/api/data', customCache)
```

### Compression & Optimization
```typescript
import { compressionMiddleware } from 'netlify-api-framework'

const router = new NetlifyRouter()

// Response compression
router.use(compressionMiddleware)

// Custom optimization middleware
const optimizationMiddleware: Middleware = async (req, context, next) => {
  const start = Date.now()
  
  const response = await next()
  
  const duration = Date.now() - start
  
  // Add performance headers
  response.headers.set('X-Response-Time', `${duration}ms`)
  response.headers.set('X-Powered-By', 'netlify-api-framework')
  
  // Log slow requests
  if (duration > 1000) {
    console.warn(`Slow request: ${req.url} took ${duration}ms`)
  }
  
  return response
}

router.use(optimizationMiddleware)
```

## 📞 Support & Resources

### Troubleshooting
- **Cold Starts**: Minimize function size and dependencies
- **Memory Usage**: Monitor performance middleware outputs
- **Error Handling**: Use comprehensive error middleware
- **Debugging**: Enable logging middleware dla development

### Framework Resources
- **GitHub Repository**: [netlify-api-framework](https://github.com/prachwal/netlify-api-framework)
- **NPM Package**: [netlify-api-framework](https://www.npmjs.com/package/netlify-api-framework)
- **TypeScript Support**: Built-in type definitions
- **Testing**: Vitest integration examples

### Integration Guidelines
- Follow middleware composition patterns
- Use TypeScript strict mode
- Implement comprehensive error handling
- Add performance monitoring
- Maintain security best practices

---

**Framework zaprojektowany dla production-ready Netlify Functions z focus na bezpieczeństwo, wydajność i developer experience.**
