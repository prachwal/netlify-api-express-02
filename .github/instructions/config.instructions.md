---
applyTo: '**'
---

# Vue + Netlify Blobs API Express 02 - Wytyczne Projektowe

## Kontekst Projektu

**Typ Projektu**: Nowoczesna aplikacja Vue.js 3 z Netlify Functions backend i Netlify Blobs storage
**Stack Technologiczny**: Vue 3.5.18 + TypeScript 5.8.3 + Vite 7.0.6 + Tailwind CSS 4.1.11 + Headless UI + Pinia 3.0.3
**Deployment**: Netlify z serverless functions i blob storage
**Dokumentacja**: [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) - kompletna dokumentacja projektu

## Podejście do Kodowania

### Separacja Odpowiedzialności (KLUCZOWE)
1. **Komponenty UI (.vue)**: TYLKO prezentacja i obsługa interakcji
2. **Logika Biznesowa (.ts)**: services/, stores/, composables/, utils/
3. **Żadna logika biznesowa nie może być bezpośrednio w komponentach Vue**
4. **Komponenty importują i używają gotowej logiki z plików .ts**

### Architektura Vue 3 Composition API
- Używaj funkcyjnych komponentów z `<script setup lang="ts">`
- Pinia stores dla state management z proper encapsulation
- Composables dla reusable reactive logic
- TypeScript strict mode z comprehensive interfaces

## Stack-Specific Guidelines

### Vue 3 + TypeScript
```typescript
// Komponenty Vue - TYLKO prezentacja
<script setup lang="ts">
import { computed } from 'vue'
import { useApiStore } from '../stores/apiStore'  // Import logiki

interface Props {
  title: string
  // Strict typing
}

const props = defineProps<Props>()
const { makeRequest, isLoading } = useApiStore()  // Use business logic
</script>
```

### Tailwind CSS 4 Configuration
- **Custom Dark Mode**: `@custom-variant dark (&:where(.dark, .dark *))`
- **Glassmorphism**: `bg-white/80 backdrop-blur-md` for transparent effects
- **Utility-First**: Preferuj utility classes nad custom CSS
- **Responsive Design**: Mobile-first approach z Tailwind breakpoints

### Headless UI Vue Patterns
```vue
<template>
  <!-- Use Headless UI components for accessibility -->
  <Disclosure as="nav" v-slot="{ open }">
    <DisclosureButton>Menu</DisclosureButton>
    <DisclosurePanel>
      <!-- Content -->
    </DisclosurePanel>
  </Disclosure>
</template>
```

### Pinia Store Architecture
```typescript
// stores/exampleStore.ts - Business Logic TYLKO tutaj
import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'

export const useExampleStore = defineStore('example', () => {
  // State
  const data = ref<DataType[]>([])
  
  // Getters
  const processedData = computed(() => {
    // Complex business logic HERE, not in components
    return data.value.filter(/* logic */)
  })
  
  // Actions
  const fetchData = async () => {
    // API calls i business logic
  }
  
  // Return readonly refs dla encapsulation
  return {
    data: readonly(data),
    processedData,
    fetchData
  }
})
```

## Netlify Blobs Integration

### Podstawowe Patterns
```typescript
// services/blobService.ts - Business logic dla blob operations
import { getStore, getDeployStore } from '@netlify/blobs'

export class BlobService {
  private store = getStore('app-data')
  
  async saveUserData(userId: string, data: any) {
    await this.store.setJSON(`user:${userId}`, data, {
      metadata: { lastUpdated: Date.now() }
    })
  }
  
  async getUserData(userId: string) {
    return await this.store.get(`user:${userId}`, { type: 'json' })
  }
}
```

### Use Cases dla Blobs
- **User Preferences**: Theme settings, layout preferences
- **Cache Storage**: API responses z TTL metadata  
- **File Uploads**: User-generated content z validation
- **Session Data**: Temporary user state
- **Analytics**: User interaction data

## Testing Requirements

### Coverage Mandates
- **100% Business Logic Coverage**: Wszystkie pliki .ts MUSZĄ mieć testy
- **Integration Tests**: Komponenty Vue z @testing-library/vue
- **API Tests**: Netlify Functions z comprehensive error scenarios

### Test Structure
```typescript
// example.test.ts
import { describe, it, expect, vi } from 'vitest'

describe('ExampleStore', () => {
  describe('fetchData', () => {
    it('should handle successful API calls', async () => {
      // Test implementation
    })
    
    it('should handle network errors gracefully', async () => {
      // Error handling test
    })
  })
})
```

## Component Guidelines

### Theme System Implementation
- **Three Modes**: Light, Dark, System z OS detection
- **Selector Variants**: Normal (dropdown), Icons (buttons), Toggle (single)
- **Persistence**: localStorage z reactive DOM updates
- **Implementation**: CSS classes przez Tailwind custom variants

### Layout Patterns
- **Fixed Header**: `fixed top-0 z-50` z glassmorphism effects
- **Responsive Navigation**: Headless UI Disclosure dla mobile menu
- **Content Spacing**: `pt-16` dla fixed header compensation

## File Organization

### Folder Structure
```
src/
├── components/         # UI Components (.vue) - TYLKO prezentacja
├── layouts/           # Layout components
├── pages/             # Page components z routing
├── stores/            # Pinia stores (.ts) - business logic
├── composables/       # Vue composables (.ts) - reactive logic  
├── services/          # API i business services (.ts)
├── utils/             # Pure functions (.ts)
└── router/            # Vue Router configuration
```

### Naming Conventions
- **Components**: PascalCase (FeatureCard.vue, ThemeSelector.vue)
- **Stores**: camelCase z Store suffix (apiStore.ts, userStore.ts)
- **Composables**: camelCase z use prefix (useTheme.ts, useApi.ts)
- **Services**: camelCase z Service suffix (blobService.ts, apiService.ts)

## Error Handling Patterns

### API Error Management
```typescript
// services/apiService.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error
  // Convert other errors to ApiError
  return new ApiError('Unknown error', 500)
}
```

### Component Error Boundaries
- Use Vue ErrorBoundary components dla graceful degradation
- Fallback UI states dla loading i error scenarios
- User-friendly error messages, no technical details exposed

## Performance Guidelines

### Frontend Optimization
- **Lazy Loading**: Router pages loaded on demand
- **Component Splitting**: Separate large components do smaller units
- **Computed Caching**: Use computed() dla expensive operations
- **Event Debouncing**: User input handling z debounce

### Backend Optimization  
- **Function Cold Starts**: Minimize function size
- **Blob Consistency**: Use `eventual` dla reads, `strong` when needed
- **Response Caching**: Cache external API calls in blobs
- **Error Handling**: Fail fast z proper HTTP status codes

## Security Best Practices

### Netlify Blobs Security
- **Input Validation**: Sanitize all user input before blob storage
- **Key Scoping**: Never expose arbitrary key access to users
- **Access Patterns**: Use user-specific prefixes (`user:${userId}:data`)
- **Metadata Validation**: Validate metadata structure i content

### General Security
- **XSS Prevention**: Sanitize user-generated content
- **CSRF Protection**: Use proper request validation
- **Environment Variables**: Sensitive data tylko w Netlify dashboard
- **Error Messages**: No technical details in user-facing errors

## Documentation Requirements

### Code Documentation
- **TSDoc Comments**: All public APIs MUSZĄ mieć documentation
- **Interface Documentation**: Comprehensive type definitions
- **Component Props**: Document all props z examples
- **Store Methods**: Document all public store methods

### Auto-generated Docs
- **TypeDoc**: Generate API documentation z TSDoc comments
- **Storybook**: KAŻDY komponent MUSI mieć .stories.tsx file
- **README Updates**: Keep project README current z major changes

## Git Workflow

### Commit Conventions
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- **Scope**: Include affected area (`feat(theme):`, `fix(api):`)
- **Polish Language**: Commit messages mogą być po polsku dla clarity

### Branch Strategy
- **main**: Production-ready code
- **feature/***: New features
- **fix/***: Bug fixes
- **docs/***: Documentation updates

---

**Uwaga**: To są wytyczne specyficzne dla tego projektu Vue + Netlify Blobs. Zawsze priorytetowo traktuj separację logiki biznesowej od komponentów UI oraz maintain 100% test coverage dla business logic.