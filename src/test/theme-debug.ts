// Test file to debug theme mechanism
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock DOM environment
const mockDocumentElement = {
    classList: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(),
        className: ''
    }
}

const mockDocument = {
    documentElement: mockDocumentElement
}

const mockWindow = {
    matchMedia: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
    })),
    localStorage: {
        getItem: vi.fn(),
        setItem: vi.fn()
    }
}

// Setup global mocks
beforeEach(() => {
    vi.stubGlobal('document', mockDocument)
    vi.stubGlobal('window', mockWindow)
    vi.clearAllMocks()
})

describe('Theme System Debug', () => {
    it('should test document.documentElement access', () => {
        console.log('Testing document access...')
        console.log('document:', typeof document)
        console.log('document.documentElement:', typeof document?.documentElement)

        if (typeof document !== 'undefined' && document.documentElement) {
            document.documentElement.classList.add('test-class')
            expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('test-class')
        }
    })

    it('should test media query access', () => {
        console.log('Testing window.matchMedia...')
        console.log('window:', typeof window)

        if (typeof window !== 'undefined') {
            const result = window.matchMedia('(prefers-color-scheme: dark)')
            expect(mockWindow.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
            console.log('matchMedia result:', result)
        }
    })
})
