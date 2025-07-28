# Testowanie w projekcie

## Konfiguracja

Projekt używa **Vitest** jako framework do testowania, skonfigurowany z:
- **@vue/test-utils** - dla testowania komponentów Vue
- **happy-dom** - jako środowisko testowe (szybka alternatywa dla jsdom)
- **@vitest/coverage-v8** - dla raportów pokrycia kodu

## Dostępne komendy

```bash
# Uruchom testy w trybie watch (monitorowanie zmian)
npm run test

# Uruchom testy z interfejsem UI w przeglądarce
npm run test:ui

# Uruchom testy jednorazowo (CI/CD)
npm run test:run

# Uruchom testy z raportem pokrycia kodu
npm run test:coverage
```

## Struktura testów

- Pliki testowe powinny mieć rozszerzenie `.test.ts` lub `.spec.ts`
- Testy komponentów Vue: `.test.ts` w tym samym katalogu co komponent
- Testy logiki biznesowej: `.test.ts` obok plików źródłowych w `/src`
- Setup testów: `/src/test/setup.ts`

## Konwencje

### Testowanie komponentów Vue
```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test' }
    })
    expect(wrapper.text()).toContain('Test')
  })
})
```

### Testowanie funkcji pomocniczych
```typescript
import { describe, it, expect } from 'vitest'
import { myUtilFunction } from './utils'

describe('myUtilFunction', () => {
  it('returns expected result', () => {
    expect(myUtilFunction('input')).toBe('expected output')
  })
})
```

### Mockowanie
```typescript
import { vi } from 'vitest'

// Mock funkcji
const mockFn = vi.fn()

// Mock modułu
vi.mock('./module', () => ({
  default: vi.fn(() => 'mocked')
}))

// Mock timerów
vi.useFakeTimers()
vi.advanceTimersByTime(1000)
vi.restoreAllTimers()
```

## Pokrycie kodu

Raporty pokrycia generują się w katalogu `/coverage/` i zawierają:
- Raport tekstowy w terminalu
- Raport HTML (`coverage/index.html`)
- Raport JSON dla integracji z CI/CD

## Pliki wykluczzone z pokrycia

- `node_modules/`
- `dist/`
- Pliki konfiguracyjne (`*.config.*`)
- Pliki Storybook (`*.stories.*`)
- Setup testów (`src/test/setup.ts`)
