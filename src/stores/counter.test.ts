import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from './counter'

describe('useCounterStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('has initial count 0', () => {
        const store = useCounterStore()
        expect(store.count).toBe(0)
    })

    it('increments count', () => {
        const store = useCounterStore()
        store.increment()
        expect(store.count).toBe(1)
    })

    it('decrements count', () => {
        const store = useCounterStore()
        store.decrement()
        expect(store.count).toBe(-1)
    })

    it('increments and decrements multiple times', () => {
        const store = useCounterStore()
        store.increment()
        store.increment()
        store.decrement()
        expect(store.count).toBe(1)
    })
})
