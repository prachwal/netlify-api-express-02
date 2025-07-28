# Vue + Pinia jako pośrednik do API requestów

## Przegląd

Ten projekt demonstruje, jak Vue.js może używać Pinia store jako centralnego pośrednika do zarządzania wszystkimi API requestami. Pinia oferuje wiele korzyści jako warstwa pośrednia między komponentami Vue a API.

## Architektura

```
Vue Components → Pinia API Store → Netlify Functions API
```

## Korzyści używania Pinia jako pośrednika API

### 1. **Centralizowane zarządzanie stanem**
- Wszystkie odpowiedzi API są przechowywane w jednym miejscu
- Łatwy dostęp do danych z dowolnego komponentu
- Spójna obsługa błędów w całej aplikacji

### 2. **Cache i optymalizacja**
- Automatyczne cache'owanie odpowiedzi API
- Unikanie dublowania requestów
- Historia wszystkich wywołań API

### 3. **Reactive state management**
- Automatyczne aktualizacje UI przy zmianie danych
- Reactive loading states
- Real-time synchronizacja między komponentami

### 4. **Debugging i monitoring**
- Pełna historia requestów (sukces/porażka)
- Statystyki API calls
- Łatwe debugowanie błędów

## Implementacja

### API Store (`src/stores/apiStore.ts`)

```typescript
export const useApiStore = defineStore('api', () => {
  // State
  const loading = ref(false)
  const responses = ref<Record<string, ApiResponse>>({})
  const errors = ref<Record<string, ApiError>>({})
  const requestHistory = ref<Array<RequestHistoryItem>>([])

  // Actions
  const makeRequest = async (endpoint: string, options?: RequestInit) => {
    // Automatyczne zarządzanie loading state
    // Obsługa błędów
    // Cache'owanie odpowiedzi
    // Dodawanie do historii
  }

  // Getters
  const isLoading = computed(() => loading.value)
  const getResponse = computed(() => (endpoint: string) => responses.value[endpoint])
  
  return { loading, responses, errors, makeRequest, isLoading, getResponse }
})
```

### Użycie w komponentach Vue

```vue
<script setup lang="ts">
import { useApiStore } from '../stores/apiStore'

const apiStore = useApiStore()

// Wywołanie API
const handleApiCall = () => {
  apiStore.callHelloApi()
}

// Reactive dostęp do danych
const currentResponse = computed(() => apiStore.getResponse('/api/hello'))
const currentError = computed(() => apiStore.getError('/api/hello'))
</script>

<template>
  <div>
    <button @click="handleApiCall" :disabled="apiStore.isLoading">
      {{ apiStore.isLoading ? 'Loading...' : 'Call API' }}
    </button>
    
    <div v-if="currentResponse">
      {{ currentResponse.message }}
    </div>
    
    <div v-if="currentError">
      Error: {{ currentError.message }}
    </div>
  </div>
</template>
```

## Funkcjonalności API Store

### 1. **Podstawowe metody**
- \`makeRequest(endpoint, options)\` - Uniwersalna metoda do API calls
- \`callHelloApi()\` - Dedykowana metoda dla /api/hello
- \`callApiWithMethod(endpoint, method, body)\` - Metoda z custom HTTP method

### 2. **Zarządzanie stanem**
- \`loading\` - Stan ładowania
- \`responses\` - Cache wszystkich odpowiedzi
- \`errors\` - Historia błędów
- \`requestHistory\` - Pełna historia requestów

### 3. **Gettery**
- \`isLoading\` - Reactive loading state
- \`getResponse(endpoint)\` - Pobieranie konkretnej odpowiedzi
- \`getError(endpoint)\` - Pobieranie błędu dla endpointu
- \`successfulRequests\` - Lista udanych requestów
- \`failedRequests\` - Lista nieudanych requestów

### 4. **Utility**
- \`clearResponse(endpoint)\` - Czyszczenie konkretnej odpowiedzi
- \`clearAllResponses()\` - Czyszczenie wszystkich odpowiedzi
- \`clearHistory()\` - Czyszczenie historii requestów

## Przykłady użycia

### Podstawowe wywołanie API
```typescript
const apiStore = useApiStore()
await apiStore.callHelloApi()
```

### POST request z body
```typescript
await apiStore.callApiWithMethod('/api/users', 'POST', { name: 'John' })
```

### Dostęp do cache'owanych danych
```typescript
const response = apiStore.getResponse('/api/hello')
const error = apiStore.getError('/api/hello')
```

### Monitoring i statystyki
```typescript
console.log('Total requests:', apiStore.requestHistory.length)
console.log('Successful:', apiStore.successfulRequests.length)
console.log('Failed:', apiStore.failedRequests.length)
```

## Testowanie

Store jest w pełni przetestowany z 100% coverage:
- 12 testów jednostkowych
- Mockowanie fetch API
- Testowanie stanów loading
- Testowanie obsługi błędów
- Testowanie cache'owania

```bash
npm test src/stores/apiStore.test.ts
```

## Netlify Functions Integration

API Store jest skonfigurowany do pracy z Netlify Functions przez przekierowania:
- \`/api/*\` → \`/.netlify/functions/*\`
- Automatyczne nagłówki CORS
- Proper MIME types dla JavaScript modules

## Demo

Aplikacja zawiera dwa komponenty demonstracyjne:
1. \`ApiDemo\` - Podstawowe użycie composables
2. \`PiniaApiDemo\` - Pełne wykorzystanie Pinia store z statystykami i historią

Oba komponenty pokazują różne podejścia do zarządzania API calls w Vue.js.
