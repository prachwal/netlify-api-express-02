# Vue + Netlify Blobs API Express 02 - Dokumentacja Projektu

## 📋 Przegląd Projektu

Nowoczesna aplikacja Vue.js 3 z kompleksowym stackiem technologicznym, wykorzystująca Netlify Functions jako backend API oraz Netlify Blobs do przechowywania danych. Projekt implementuje najlepsze praktyki developmentu z pełnym pokryciem testowym, systemem motywów i profesjonalnym UI.

## 🏗️ Architektura Systemu

### Frontend Stack
- **Vue 3.5.18** - Progressive JavaScript Framework z Composition API
- **TypeScript 5.8.3** - Pełne typowanie z strict configuration
- **Vite 7.0.6** - Next Generation Frontend Tooling z HMR
- **Tailwind CSS 4.1.11** - Utility-first CSS Framework z custom dark mode variant
- **Headless UI Vue** - Unstyled, accessible UI components
- **Vue Router 4** - Multi-page routing z lazy loading
- **Pinia 3.0.3** - Vue State Management z comprehensive API store
- **Vitest 3.2.4** - Testing framework z 100% business logic coverage

### Backend & Deployment
- **Netlify Functions** - Serverless API endpoints z router framework
- **Netlify Blobs** - Key-value storage dla unstructured data
- **Netlify Deployment** - Production hosting z automatic SPA routing

### UI & Design System
- **Glassmorphism Design** - Transparent header z backdrop-blur effects
- **Responsive Layout** - Mobile-first approach z Headless UI components
- **Advanced Theme System** - Light/Dark/System z trzema trybami selektora
- **Heroicons** - Professional icon set z SVG components

## 🗂️ Struktura Projektu

```
netlify-api-express-02/
├── public/                          # Static assets
│   ├── vite.svg                     # Vite logo
│   └── _redirects                   # SPA routing configuration
├── src/
│   ├── components/                  # Vue components (TYLKO prezentacja)
│   │   ├── FeatureCard.vue          # Feature showcase cards
│   │   ├── ThemeSelector.vue        # Advanced theme selector (3 modes)
│   │   ├── ApiDemo.vue              # Basic API demo component
│   │   ├── PiniaApiDemo.vue         # Advanced Pinia integration demo
│   │   └── HelloWorld.vue           # Original Vite component
│   ├── layouts/                     # Layout components
│   │   └── MainLayout.vue           # Main app layout z fixed transparent header
│   ├── pages/                       # Page components
│   │   ├── HomePage.vue             # Landing page z features
│   │   ├── ApiDemoPage.vue          # API demonstrations
│   │   ├── ComponentsPage.vue       # Components showcase
│   │   ├── AboutPage.vue            # Project information
│   │   └── NotFoundPage.vue         # 404 error page
│   ├── stores/                      # Pinia stores (logika biznesowa)
│   │   ├── apiStore.ts              # Comprehensive API management
│   │   └── apiStore.test.ts         # 100% test coverage
│   ├── composables/                 # Vue composables (logika stanu)
│   │   ├── useTheme.ts              # Theme management system
│   │   └── useApi.ts                # Reactive API composable
│   ├── router/                      # Vue Router configuration
│   │   └── index.ts                 # Routes z lazy loading
│   ├── assets/                      # Asset files
│   │   └── vue.svg                  # Vue logo
│   ├── App.vue                      # Root component (router-view only)
│   ├── main.ts                      # App entry point z Pinia + Router
│   ├── style.css                    # Tailwind imports z custom variants
│   └── vite-env.d.ts               # Vite type definitions
├── netlify/
│   └── functions/                   # Netlify Functions
│       └── api.mts                  # API router z multiple endpoints
├── .github/
│   └── instructions/                # Project documentation
│       ├── config.instructions.md   # AI coding guidelines
│       └── PROJECT_DOCUMENTATION.md # Ten plik
├── docs/                           # Generated documentation
│   └── api/                        # TypeDoc generated API docs
├── Configuration Files:
│   ├── package.json                # Dependencies i scripts
│   ├── vite.config.ts              # Vite configuration z Vitest
│   ├── tsconfig.json               # TypeScript base config
│   ├── tsconfig.app.json           # App-specific TS config
│   ├── tsconfig.node.json          # Node.js TS config
│   ├── tsconfig.netlify.json       # Netlify Functions TS config (.mts support)
│   ├── typedoc.json                # TypeDoc configuration
│   ├── tsdoc.json                  # TSDoc tags configuration
│   ├── postcss.config.cjs          # PostCSS config (empty for conflicts resolution)
│   └── netlify.toml                # Netlify deployment configuration
└── PINIA_API_GUIDE.md              # Complete Pinia API architecture guide
```

## 🔧 Konfiguracja Technologiczna

### Netlify Blobs Integration

#### Podstawowe Koncepty
- **Stores**: Namespaces dla blob storage (np. `file-uploads`, `json-uploads`)
- **Site-wide stores**: Dane dzielone między wszystkimi deployami
- **Deploy-specific stores**: Dane scoped do konkretnego deploy
- **Consistency Models**: `eventual` (default, fast reads) vs `strong` (immediate consistency)

#### API Methods
```typescript
import { getStore, getDeployStore, listStores } from '@netlify/blobs'

// Site-wide store (persistent across deploys)
const store = getStore('my-store')

// Deploy-specific store (scoped to deploy)
const deployStore = getDeployStore('deploy-data')

// CRUD Operations
await store.set(key, value, { metadata })       // Create/Update
await store.setJSON(key, object, { metadata })  // JSON convenience method
const data = await store.get(key, { type })     // Read
const { data, metadata, etag } = await store.getWithMetadata(key)
await store.delete(key)                         // Delete

// Listing and metadata
const { blobs, directories } = await store.list({ prefix, directories })
const { stores } = await listStores()
const { metadata, etag } = await store.getMetadata(key)
```

#### Use Cases dla Projektu
1. **User Data Storage**: Profile preferences, theme settings
2. **API Response Caching**: Cache external API responses z TTL metadata
3. **File Uploads**: User-generated content z metadata validation
4. **Session Storage**: Temporary user session data
5. **Analytics Data**: User interactions i statistics
6. **Configuration**: Dynamic app configuration z environment-specific stores

### Tailwind CSS 4 Configuration

#### Custom Dark Mode Variant
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

#### Glassmorphism Classes
- `bg-white/80 dark:bg-gray-800/80` - 80% transparency
- `backdrop-blur-md` - Medium blur effect
- `border-gray-200/50` - 50% border transparency

### Pinia Store Architecture

#### API Store Pattern
```typescript
// stores/apiStore.ts
interface ApiRequest {
  id: string
  url: string
  method: string
  timestamp: number
  status: 'pending' | 'success' | 'error'
  response?: any
  error?: string
}

// Reactive state management
const requests = ref<ApiRequest[]>([])
const cache = ref<Map<string, any>>(new Map())

// Universal request method z caching i history
const makeRequest = async (url: string, options?: RequestInit) => {
  // Implementation z full error handling, caching, history tracking
}
```

## 🧪 Testing Strategy

### Coverage Requirements
- **Business Logic**: 100% coverage wymagane dla wszystkich plików .ts
- **Components**: Integration tests z @testing-library/vue
- **API Functions**: Unit tests dla Netlify Functions
- **E2E**: Planned z Playwright dla critical user journeys

### Test Structure
```typescript
// stores/apiStore.test.ts example
describe('API Store', () => {
  describe('makeRequest', () => {
    it('should cache successful responses', async () => {
      // Test implementation z mocked fetch
    })
    
    it('should handle network errors gracefully', async () => {
      // Error handling test
    })
  })
})
```

## 🎨 Design System

### Theme System
- **Modes**: Light, Dark, System (follows OS preference)
- **Selectors**: Normal (dropdown), Icons (icon buttons), Toggle (single button)
- **Implementation**: CSS classes z Tailwind custom variants
- **Persistence**: localStorage z reactive updates

### Component Architecture
- **Separation of Concerns**: UI components (.vue) vs business logic (.ts)
- **Functional Components**: SVG icons using h() render function
- **Props Interface**: Strict TypeScript interfaces
- **Accessibility**: ARIA attributes, semantic HTML, keyboard navigation

## 🚀 Deployment Configuration

### Netlify Settings
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "*.js"
  [headers.values]
    Content-Type = "application/javascript; charset=utf-8"

[[headers]]
  for = "*.mjs"
  [headers.values]
    Content-Type = "application/javascript; charset=utf-8"
```

### Environment Variables
```bash
# Production (set in Netlify dashboard)
NETLIFY_SITE_ID=your-site-id
NETLIFY_AUTH_TOKEN=your-auth-token

# Development (optional for local blob access)
NETLIFY_LOCAL_BLOB_STORE=true
```

## 📚 Development Workflows

### Development Server
```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run Vitest tests
npm run test:ui      # Vitest UI mode
npm run docs         # Generate TypeDoc documentation
```

### Netlify CLI Commands
```bash
netlify dev          # Local development z functions
netlify deploy       # Deploy preview
netlify deploy --prod # Production deployment
netlify functions:list # List deployed functions
netlify blobs:list   # List blob stores
```

### Code Quality
```bash
npm run lint         # ESLint checking
npm run format       # Prettier formatting
npm run type-check   # TypeScript compilation check
```

## 🔐 Security Considerations

### Netlify Blobs Security
- **Encryption**: At rest i in transit
- **Access Control**: Site-specific, no cross-site access
- **Input Validation**: Treat user input as unsafe, scope keys properly
- **Build Plugin Review**: Check third-party plugins for malicious blob access

### Best Practices
- Never expose arbitrary key access to users
- Validate all input data before blob storage
- Use metadata for access control logic
- Implement proper error handling bez information leakage

## 📈 Performance Optimizations

### Frontend
- **Lazy Loading**: Router pages loaded on demand
- **Component Splitting**: Separate UI i business logic
- **Caching Strategy**: Pinia store z intelligent cache invalidation
- **Build Optimization**: Vite tree-shaking i code splitting

### Backend
- **Function Cold Starts**: Minimize przez keeping functions warm
- **Blob Consistency**: Use `eventual` dla fast reads, `strong` when needed
- **Caching**: Implement response caching z TTL metadata
- **Error Handling**: Graceful degradation z retry logic

## 🔮 Future Enhancements

### Planned Features
1. **Netlify Blobs Integration**: User data persistence, file uploads
2. **Real-time Features**: WebSocket communication
3. **PWA Capabilities**: Service worker, offline support
4. **Advanced Analytics**: User behavior tracking
5. **i18n Support**: Multi-language application
6. **Advanced Testing**: E2E z Playwright, visual regression tests

### Scalability Considerations
- **Database Migration**: From Blobs to proper database when needed
- **CDN Optimization**: Asset delivery optimization
- **Function Optimization**: Cold start reduction strategies
- **Monitoring**: Application performance monitoring

---

## 📞 Support i Contributing

### Development Guidelines
- Follow separation of concerns (UI vs business logic)
- Maintain 100% test coverage dla business logic
- Use conventional commits
- Document all public APIs z TSDoc
- Follow Tailwind utility-first approach

### Resources
- [Netlify Blobs Documentation](https://docs.netlify.com/build/data-and-storage/netlify-blobs/)
- [Netlify API Framework Guide](./NETLIFY_API_FRAMEWORK_GUIDE.md) - Kompletny przewodnik integracji
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [Headless UI Vue](https://headlessui.com/vue/)
- [Pinia State Management](https://pinia.vuejs.org/)
