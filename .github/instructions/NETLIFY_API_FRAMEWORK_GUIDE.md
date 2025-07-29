# Netlify API Framework - Przewodnik Integracji

## 📋 Przegląd Frameworka

**Netlify API Framework** to nowoczesny, type-safe framework dedykowany do Netlify Functions z pełnym wsparciem TypeScript i comprehensive middleware system. Framework został zaprojektowany specjalnie dla serverless funkcji Netlify z naciskiem na bezpieczeństwo, wydajność i łatwość użycia.

## 🚀 Kluczowe Funkcjonalności

### Core Features
- **TypeScript-First** - Pełne wsparcie TypeScript z comprehensive type definitions
- **Modern Web Standards** - Zbudowany na Request/Response API z automatyczną konwersją do Netlify
- **Zero External Dependencies** - Lightweight framework bez dodatkowych zależności
- **ES Modules** - Nowoczesna architektura modułowa z .js imports

### Router System
- **NetlifyRouter Class** - Główna klasa routera z middleware support
- **HTTP Methods** - GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Sub-router Mounting** - Montowanie sub-routerów z path prefixes
- **Automatic Path Handling** - Obsługa lokalnych (/api) i Netlify (/.netlify/functions/api) ścieżek

### Middleware System
- **Comprehensive Middleware** - CORS, authentication, JSON parsing, error handling
- **Custom Middleware** - Easy creation of custom middleware functions
- **Middleware Composition** - Flexible middleware stacking w reverse order
- **Built-in Security** - Security headers, request validation, error handling

### Dynamic Routes & Performance
- **Dynamic Route Parameters** - Automatic parsing z type safety (:id, :name)
- **Query Parameters** - Built-in parsing z parseQueryParams utility
- **Performance Monitoring** - Built-in request/response timing
- **Error Handling** - Comprehensive error handling z proper HTTP status codes

## 📦 Instalacja i Konfiguracja

### Framework Structure
Framework składa się z następujących komponentów:
```
framework/
├── index.ts              # Main exports
├── router/
│   └── router.ts         # NetlifyRouter class
├── middleware/
│   ├── index.ts          # Middleware exports
│   ├── cors.ts           # CORS middleware
│   ├── json-body-parser.ts # JSON parsing
│   ├── auth.ts           # Authentication
│   ├── rate-limit.ts     # Rate limiting
│   └── advanced/         # Advanced middleware
│       ├── error-handling.ts
│       ├── cache.ts
│       ├── compression.ts
│       ├── performance.ts
│       ├── request-id.ts
│       ├── security-headers.ts
│       └── request-size-limit.ts
├── utils/
│   ├── utils.ts          # Utility functions
│   ├── logger.ts         # Logging utilities
│   └── jwtUtils.ts       # JWT utilities
└── types/
    └── index.ts          # TypeScript definitions
```

### Podstawowa Instalacja
Framework jest dostępny lokalnie w projekcie:
```typescript
// Import głównych komponentów
import { 
  NetlifyRouter, 
  json, 
  corsMiddleware, 
  jsonBodyParser, 
  errorHandlingMiddleware 
} from './framework/index.js'
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
import { NetlifyRouter, corsMiddleware, jsonBodyParser, errorHandlingMiddleware, json } from './framework/index.js'

const router = new NetlifyRouter()

// Global middleware - kolejność ma znaczenie!
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

// Route z parametrami
router.get('/hello/:name', async (req, context, params) => {
  return json({
    message: `Hello, ${params?.name}!`,
    timestamp: new Date().toISOString()
  })
})

// Health check
router.get('/health', async (req, context) => {
  return json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Export handler dla Netlify
export const handler = router.handler()
```

### Zaawansowana Konfiguracja z Sub-routerami
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
  json,
  createResourceRouter
} from './framework/index.js'

const router = new NetlifyRouter()

// Complete middleware stack - order matters!
router.use(requestIdMiddleware)      // Request tracking
router.use(securityHeadersMiddleware) // Security headers
router.use(corsMiddleware)           // CORS handling
router.use(rateLimitMiddleware)      // Rate limiting
router.use(jsonBodyParser)           // JSON parsing
router.use(performanceMiddleware)    // Performance monitoring
router.use(errorHandlingMiddleware)  // Error handling

// Public routes
router.get('/health', async (req, context) => {
  return json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Protected sub-router
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

// Resource router for CRUD operations
const postsRouter = createResourceRouter({
  index: async (req, context) => {
    // GET /posts
    return json({ posts: [] })
  },
  show: async (req, context, params) => {
    // GET /posts/:id
    return json({ post: { id: params?.id } })
  },
  create: async (req, context) => {
    // POST /posts
    const body = (req as any).parsedBody
    return json({ post: body }, 201)
  },
  update: async (req, context, params) => {
    // PUT /posts/:id
    const body = (req as any).parsedBody
    return json({ post: { id: params?.id, ...body } })
  },
  destroy: async (req, context, params) => {
    // DELETE /posts/:id
    return json({ message: 'Post deleted successfully' })
  }
})

// Mount sub-routers
router.use('/protected', protectedRouter)
router.use('/posts', postsRouter)

export const handler = router.handler()
```

## 🛠️ API Reference

### NetlifyRouter Class

#### Constructor i Podstawowe Metody
```typescript
const router = new NetlifyRouter()

// HTTP Methods
router.get(path: string, handler: RouteHandler): void
router.post(path: string, handler: RouteHandler): void
router.put(path: string, handler: RouteHandler): void
router.delete(path: string, handler: RouteHandler): void
router.patch(path: string, handler: RouteHandler): void
router.options(path: string, handler: RouteHandler): void

// Middleware registration
router.use(middleware: Middleware): void
router.use(path: string, subRouter: NetlifyRouter): void

// Handler generation
const handler = router.handler()
```

#### Route Handler Signature
```typescript
export interface RouteHandler {
  (
    req: RequestWithParsedBody, 
    context: Context, 
    params?: Record<string, string>
  ): Promise<Response> | Response
}

export interface Middleware {
  (
    req: RequestWithParsedBody, 
    context: Context, 
    next: () => Promise<Response>
  ): Promise<Response> | Response
}
```

#### Route Parameters
```typescript
// Dynamic route parameters - automatyczne parsowanie
router.get('/users/:id', async (req, context, params) => {
  const userId = params?.id  // string | undefined
  return json({ userId })
})

// Multiple parameters
router.get('/users/:userId/posts/:postId', async (req, context, params) => {
  const { userId, postId } = params || {}
  return json({ userId, postId })
})

// Query parameters z parseQueryParams
import { parseQueryParams } from './framework/utils/utils.js'

router.get('/search', async (req, context) => {
  const queryParams = parseQueryParams(req)
  const { q, limit, offset } = queryParams
  return json({ query: q, limit, offset })
})
```

#### Path Handling
Router automatycznie obsługuje różne formaty ścieżek:
- **Local development**: `/api/endpoint`
- **Netlify Functions**: `/.netlify/functions/api/endpoint`
- **Trailing slashes**: Automatycznie ignorowane

### Built-in Middleware

#### Core Middleware
```typescript
import { 
  corsMiddleware,           // CORS handling z automatic OPTIONS
  jsonBodyParser,           // JSON body parsing z error handling
  errorHandlingMiddleware,  // Comprehensive error handling
  authMiddleware,          // JWT-based authentication
  rateLimitMiddleware,     // Request rate limiting
  loggingMiddleware        // Request/response logging
} from './framework/middleware/index.js'

// Advanced middleware
import {
  requestIdMiddleware,     // Request ID generation
  securityHeadersMiddleware, // Security headers (HSTS, CSP, etc.)
  performanceMiddleware,   // Performance monitoring
  cacheMiddleware,         // Response caching
  compressionMiddleware,   // Response compression
  requestSizeLimitMiddleware, // Request size limits
} from './framework/middleware/index.js'
```

#### Middleware Implementation Details

##### CORS Middleware
```typescript
// Automatycznie obsługuje OPTIONS preflight
// Dodaje headers do wszystkich responses
export const corsMiddleware: Middleware = async (req, _context, next) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
      }
    })
  }
  // ... adds headers to response
}
```

##### JSON Body Parser
```typescript
// Automatycznie parsuje JSON dla POST/PUT/PATCH
// Dodaje parsedBody do request object
export const jsonBodyParser: Middleware = async (req, _context, next) => {
  if (req.method !== 'GET' && req.method !== 'DELETE') {
    try {
      const contentType = req.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const requestClone = req.clone()
        const text = await requestClone.text()
        if (text.trim()) {
          const body = JSON.parse(text)
          ;(req as RequestWithParsedBody).parsedBody = body
        }
      }
    } catch (error) {
      // Returns 400 error for invalid JSON
    }
  }
  return await next()
}
```

##### Error Handling Middleware
```typescript
// Catch-all error handler z logging
export const errorHandlingMiddleware: Middleware = async (req, context, next) => {
  try {
    return await next()
  } catch (error) {
    const requestId = (context as any).requestId || `req_${Date.now()}`
    // Logs error with context
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      requestId,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
```

#### Custom Middleware Creation
```typescript
import { Middleware } from './framework/router/router.js'

const customAuthMiddleware: Middleware = async (req, context, next) => {
  const authHeader = req.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ 
      error: 'Unauthorized' 
    }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  const token = authHeader.substring(7)
  
  try {
    // Validate token (implement your logic)
    const user = await validateToken(token)
    
    // Add user to request context
    ;(req as any).user = user
    
    return next()
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Invalid token' 
    }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Usage
router.use('/protected', customAuthMiddleware)
```

### Utility Functions

#### Response Helpers
```typescript
import { json, text, html } from './framework/router/router.js'
import { createErrorResponse } from './framework/utils/utils.js'

// JSON responses - główna metoda
return json({ data: 'value' }, 200)
return json({ error: 'Not found' }, 404)

// Text responses
return text('Hello World', 200)

// HTML responses  
return html('<h1>Hello World</h1>', 200)

// Error responses z dodatkowym kontekstem
return createErrorResponse('Bad Request', 400, { 
  field: 'Missing required field',
  details: 'Name is required' 
})
```

#### Request Processing
```typescript
import { 
  parseQueryParams, 
  validateFields, 
  isValidEmail, 
  isValidId,
  sanitizeString,
  parsePaginationParams 
} from './framework/utils/utils.js'

// Parse query parameters
const params = parseQueryParams(req)
const { search, page, limit } = params

// Validate email
if (!isValidEmail(body.email)) {
  return createErrorResponse('Invalid email format', 400)
}

// Validate ID (number or UUID)
if (!isValidId(params?.id)) {
  return createErrorResponse('Invalid ID format', 400)
}

// Sanitize string input
const name = sanitizeString(body.name, 100) // max 100 chars

// Parse pagination
const { page, limit } = parsePaginationParams(params)

// Validate request body fields
const body = (req as any).parsedBody
const validation = validateFields(body, ['name', 'email', 'password'])

if (!validation.isValid) {
  return createErrorResponse('Missing required fields', 400, { 
    missing: validation.missing 
  })
}
```

#### Logging Utilities
```typescript
import { 
  logger, 
  log, 
  logRequest, 
  logPerformance, 
  logError,
  consoleFormat 
} from './framework/utils/logger.js'

// Structured logging z levels
log('info', 'Request processed', { 
  requestId: '123',
  userId: 'user456',
  duration: '150ms'
})

// Request logging
logRequest(req, context, 'GET /api/users')

// Performance logging
const start = Date.now()
// ... operation
logPerformance('Database query', Date.now() - start, { table: 'users' })

// Error logging z stack trace
logError(error, 'Database connection failed', {
  requestId: context.requestId,
  userId: req.user?.id
})

// Console formatting dla development
console.log(consoleFormat('info', 'User logged in', { 
  userId: 'user123',
  timestamp: new Date().toISOString()
}))
```

#### ID Generation & Validation
```typescript
import { generateId, generateStringId } from './framework/utils/utils.js'

// Generate unique ID
const id = generateId() // "id_1643723400000_abc123def"

// Generate string-based ID
const stringId = generateStringId() // "id_1643723400000_xyz789"

// Both functions generate time-based unique identifiers
```

## 📚 Wzorce Implementacji

### REST API z CRUD Operations
```typescript
import { 
  NetlifyRouter, 
  json, 
  jsonBodyParser, 
  errorHandlingMiddleware,
  createResourceRouter 
} from './framework/index.js'
import { 
  parseQueryParams, 
  validateFields, 
  createErrorResponse,
  parsePaginationParams 
} from './framework/utils/utils.js'

const router = new NetlifyRouter()
router.use(jsonBodyParser)
router.use(errorHandlingMiddleware)

// In-memory store (use database in production)
const posts = new Map()

// Resource router approach (recommended)
const postsRouter = createResourceRouter({
  // GET /posts - List all posts with pagination
  index: async (req, context) => {
    const queryParams = parseQueryParams(req)
    const { page, limit } = parsePaginationParams(queryParams)
    
    const allPosts = Array.from(posts.values())
    const offset = (page - 1) * limit
    const paginatedPosts = allPosts.slice(offset, offset + limit)
    
    return json({
      posts: paginatedPosts,
      total: allPosts.length,
      pagination: { page, limit, totalPages: Math.ceil(allPosts.length / limit) }
    })
  },

  // GET /posts/:id - Get single post
  show: async (req, context, params) => {
    const post = posts.get(params?.id)
    
    if (!post) {
      return createErrorResponse('Post not found', 404)
    }
    
    return json({ post })
  },

  // POST /posts - Create new post
  create: async (req, context) => {
    const body = (req as any).parsedBody
    
    const validation = validateFields(body, ['title', 'content'])
    if (!validation.isValid) {
      return createErrorResponse('Missing required fields', 400, {
        missing: validation.missing
      })
    }
    
    const post = {
      id: Date.now().toString(),
      title: sanitizeString(body.title, 200),
      content: sanitizeString(body.content, 5000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    posts.set(post.id, post)
    
    return json({ post }, 201)
  },

  // PUT /posts/:id - Update post
  update: async (req, context, params) => {
    const post = posts.get(params?.id)
    
    if (!post) {
      return createErrorResponse('Post not found', 404)
    }
    
    const body = (req as any).parsedBody
    const updatedPost = {
      ...post,
      ...body,
      id: post.id, // Prevent ID change
      updatedAt: new Date().toISOString()
    }
    
    posts.set(post.id, updatedPost)
    
    return json({ post: updatedPost })
  },

  // DELETE /posts/:id - Delete post
  destroy: async (req, context, params) => {
    const exists = posts.has(params?.id)
    
    if (!exists) {
      return createErrorResponse('Post not found', 404)
    }
    
    posts.delete(params?.id)
    
    return json({ message: 'Post deleted successfully' })
  }
})

// Mount resource router
router.use('/posts', postsRouter)

export const handler = router.handler()
```

### Manual CRUD Implementation (alternative)
```typescript
// If you prefer manual route definitions
router.get('/api/posts', async (req, context) => {
  const queryParams = parseQueryParams(req)
  const { page, limit } = parsePaginationParams(queryParams)
  const search = queryParams.search
  
  let allPosts = Array.from(posts.values())
  
  // Search filtering
  if (search) {
    allPosts = allPosts.filter(post => 
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  const offset = (page - 1) * limit
  const paginatedPosts = allPosts.slice(offset, offset + limit)
  
  return json({
    posts: paginatedPosts,
    total: allPosts.length,
    pagination: { 
      page, 
      limit, 
      totalPages: Math.ceil(allPosts.length / limit),
      hasNext: offset + limit < allPosts.length,
      hasPrev: page > 1
    },
    search
  })
})
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
- **Local Framework**: Dostępny w `tmp/netlify/framework/`
- **TypeScript Support**: Built-in type definitions w `types/index.ts`
- **ESM Modules**: Wszystkie importy używają `.js` extensions
- **Testing**: Framework ready dla Vitest integration

### Implementation Guidelines
- **Middleware Order**: Kolejność ma znaczenie - error handling na końcu
- **ESM Imports**: Używaj `.js` extensions w importach TypeScript
- **Type Safety**: Wykorzystuj interface definitions z `types/index.ts`
- **Error Handling**: Zawsze używaj `createErrorResponse` dla consistent error format
- **Logging**: Używaj structured logging z framework utilities
- **Security**: Implementuj input validation i sanitization

### Performance Best Practices
- **Middleware Composition**: Unikaj nadmiernego stackowania middleware
- **Response Caching**: Używaj cache middleware dla statycznych responses
- **Request Size Limits**: Implementuj limits dla upload endpoints
- **Database Connections**: Używaj connection pooling w production

---

**Framework zaprojektowany dla production-ready Netlify Functions z focus na type safety, performance i developer experience.**
