import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatCurrency, isValidEmail, debounce } from './index'

describe('Utils', () => {
    describe('formatCurrency', () => {
        it('formats USD currency by default', () => {
            expect(formatCurrency(1234.56)).toBe('$1,234.56')
        })

        it('formats different currencies', () => {
            expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56')
            expect(formatCurrency(1234.56, 'GBP')).toBe('£1,234.56')
        })

        it('handles zero amount', () => {
            expect(formatCurrency(0)).toBe('$0.00')
        })

        it('handles negative amounts', () => {
            expect(formatCurrency(-123.45)).toBe('-$123.45')
        })
    })

    describe('isValidEmail', () => {
        it('validates correct email addresses', () => {
            expect(isValidEmail('test@example.com')).toBe(true)
            expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
            expect(isValidEmail('user+tag@example.org')).toBe(true)
        })

        it('rejects invalid email addresses', () => {
            expect(isValidEmail('invalid-email')).toBe(false)
            expect(isValidEmail('@domain.com')).toBe(false)
            expect(isValidEmail('user@')).toBe(false)
            expect(isValidEmail('user@domain')).toBe(false)
            expect(isValidEmail('')).toBe(false)
            expect(isValidEmail('user name@domain.com')).toBe(false)
        })
    })

    describe('debounce', () => {
        beforeEach(() => {
            vi.useFakeTimers()
        })

        afterEach(() => {
            vi.useRealTimers()
        })

        it('delays function execution', () => {
            const mockFn = vi.fn()
            const debouncedFn = debounce(mockFn, 100)

            debouncedFn('test')
            expect(mockFn).not.toHaveBeenCalled()

            vi.advanceTimersByTime(100)
            expect(mockFn).toHaveBeenCalledWith('test')
        })

        it('cancels previous calls when called multiple times', () => {
            const mockFn = vi.fn()
            const debouncedFn = debounce(mockFn, 100)

            debouncedFn('first')
            debouncedFn('second')
            debouncedFn('third')

            vi.advanceTimersByTime(100)
            expect(mockFn).toHaveBeenCalledTimes(1)
            expect(mockFn).toHaveBeenCalledWith('third')
        })

        it('calls function multiple times if delay passes between calls', () => {
            const mockFn = vi.fn()
            const debouncedFn = debounce(mockFn, 100)

            debouncedFn('first')
            vi.advanceTimersByTime(100)
            expect(mockFn).toHaveBeenCalledWith('first')

            debouncedFn('second')
            vi.advanceTimersByTime(100)
            expect(mockFn).toHaveBeenCalledWith('second')
            expect(mockFn).toHaveBeenCalledTimes(2)
        })
    })
})
