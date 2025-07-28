# Vue + Netlify Blobs API Express 02

🚀 **Nowoczesna aplikacja Vue.js 3** z kompleksowym stackiem technologicznym i integracją z Netlify Functions + Blobs storage.

## ✨ Kluczowe Funkcjonalności

- 🎨 **Advanced Theme System** - Light/Dark/System z trzema trybami UI
- 🧩 **Headless UI Components** - Accessible, responsive design
- 📱 **Glassmorphism Header** - Fixed transparent navigation
- 🏪 **Pinia State Management** - Comprehensive API store z cachingiem
- 🧪 **100% Test Coverage** - Business logic fully tested
- ⚡ **Netlify Functions** - Serverless API endpoints
- 💾 **Netlify Blobs Integration** - Ready-to-use storage service
- 🔧 **TypeScript Strict Mode** - Full type safety

## 🛠️ Tech Stack

### Frontend
- **Vue 3.5.18** + Composition API + `<script setup>`
- **TypeScript 5.8.3** z strict configuration
- **Vite 7.0.6** z HMR i optimizations
- **Tailwind CSS 4.1.11** z custom dark mode variant
- **Headless UI Vue** + Heroicons dla accessibility
- **Vue Router 4** z lazy loading
- **Pinia 3.0.3** dla state management

### Backend & Deployment
- **Netlify Functions** z router framework
- **Netlify Blobs** dla data persistence
- **Vitest 3.2.4** dla comprehensive testing

## 📚 Dokumentacja

### Kompletne Przewodniki
- **[PROJECT_DOCUMENTATION.md](./.github/instructions/PROJECT_DOCUMENTATION.md)** - Kompletna dokumentacja projektu, architektura, stack technologiczny
- **[NETLIFY_API_FRAMEWORK_GUIDE.md](./.github/instructions/NETLIFY_API_FRAMEWORK_GUIDE.md)** - Przewodnik integracji netlify-api-framework z TypeScript
- **[config.instructions.md](./.github/instructions/config.instructions.md)** - Wytyczne kodowania i najlepsze praktyki dla AI assistants

## 🚀 Quick Start

```bash
# Instalacja dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Run tests
npm run test

# Generate documentation
npm run docs
```

## 🌐 Live Demo

**Production**: [https://netlify-api-express-02.netlify.app](https://netlify-api-express-02.netlify.app)

## 🏗️ Struktura Projektu

```
src/
├── components/         # UI Components (.vue) - TYLKO prezentacja
├── layouts/           # Layout components z MainLayout
├── pages/             # Page components z routing
├── stores/            # Pinia stores (.ts) - business logic
├── composables/       # Vue composables (.ts) - reactive logic
├── services/          # API i Netlify Blobs services (.ts)
└── router/            # Vue Router configuration
```

## 🎯 Kluczowe Zasady

### Separacja Odpowiedzialności
- **UI Components (.vue)**: TYLKO prezentacja i obsługa interakcji
- **Business Logic (.ts)**: stores/, services/, composables/, utils/
- **Komponenty importują gotową logikę** z plików TypeScript

### Architektura
- **Vue 3 Composition API** z `<script setup lang="ts">`
- **Pinia stores** z proper encapsulation i readonly exports
- **TypeScript strict mode** z comprehensive interfaces
- **100% test coverage** dla business logic

## 🧪 Testing

```bash
npm run test         # Unit tests z Vitest
npm run test:ui      # Vitest UI mode
npm run test:coverage # Coverage report
```

### Coverage Requirements
- ✅ **100% Business Logic Coverage** - wszystkie pliki .ts
- ✅ **Integration Tests** - komponenty Vue z @testing-library/vue
- ✅ **API Tests** - Netlify Functions z error scenarios

## 📱 Features Demo

### Theme System
- **3 tryby**: Light, Dark, System (follows OS)
- **3 UI variants**: Normal dropdown, Icons, Toggle button
- **localStorage persistence** z reactive updates

### API Management
- **Pinia store** z universal request method
- **Response caching** z intelligent invalidation
- **Request history** i statistics
- **Error handling** z user-friendly messages

### Netlify Blobs Integration
- **BlobService class** z typed operations
- **User preferences storage**
- **API response caching** z TTL
- **File uploads** z metadata
- **Deploy-specific stores** dla build data

## 🔧 Development Commands

```bash
# Netlify CLI
netlify dev          # Local development z functions
netlify deploy       # Deploy preview
netlify deploy --prod # Production deployment

# Code Quality
npm run lint         # ESLint checking
npm run format       # Prettier formatting
npm run type-check   # TypeScript compilation
```

## 📈 Performance

- ⚡ **Lazy Loading** - Router pages loaded on demand
- 🗜️ **Code Splitting** - Optimal bundle sizes
- 💨 **HMR** - Hot Module Replacement w development
- 🎯 **Tree Shaking** - Dead code elimination

## 🔐 Security

- 🔒 **Input Validation** - All user data sanitized
- 🛡️ **XSS Prevention** - Secure content rendering
- 🔑 **Environment Variables** - Sensitive data w Netlify dashboard
- 🚫 **No Technical Errors** - User-friendly error messages

## 📞 Support

### Resources
- [Netlify Blobs Documentation](https://docs.netlify.com/build/data-and-storage/netlify-blobs/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [Headless UI Vue](https://headlessui.com/vue/)

### Contributing
1. Follow separation of concerns (UI vs business logic)
2. Maintain 100% test coverage dla business logic
3. Use conventional commits
4. Document all public APIs z TSDoc

---

**Projekt zbudowany z ❤️ wykorzystując najlepsze praktyki Vue.js 3 i nowoczesnego web developmentu.**
