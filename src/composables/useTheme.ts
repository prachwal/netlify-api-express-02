import { ref, computed, watchEffect, readonly, nextTick } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme-preference'

// Reactive theme state
const theme = ref<Theme>('system')
let isWatcherInitialized = false

// Get system preference
const getSystemTheme = () => {
    if (typeof window === 'undefined') return 'light'
    const matches = window.matchMedia('(prefers-color-scheme: dark)').matches
    console.log('getSystemTheme: matches =', matches, 'returning:', matches ? 'dark' : 'light')
    return matches ? 'dark' : 'light'
}

// Computed actual theme (resolves 'system' to actual preference)
const actualTheme = computed(() => {
    const result = theme.value === 'system' ? getSystemTheme() : theme.value
    console.log('actualTheme computed: theme.value =', theme.value, 'result =', result)
    return result
})

// Initialize theme from localStorage or default to system
const initializeTheme = () => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
        theme.value = stored
    }
}

// Apply theme to document
const applyTheme = (themeName: string) => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    console.log('Applying theme:', themeName, 'to document root')
    console.log('Before change - classList contains dark:', root.classList.contains('dark'))

    // For Tailwind CSS 4 - only use 'dark' class, remove for light mode
    if (themeName === 'dark') {
        root.classList.add('dark')
        console.log('Added dark class to root')
    } else {
        root.classList.remove('dark')
        console.log('Removed dark class from root')
    }

    console.log('After change - classList contains dark:', root.classList.contains('dark'))
    console.log('Full className:', root.className)
}

// Set theme and persist to localStorage
const setTheme = (newTheme: Theme) => {
    console.log('setTheme called with:', newTheme)
    theme.value = newTheme
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newTheme)
    }
    // Use nextTick to ensure reactivity has updated
    nextTick(() => {
        console.log('nextTick: applying theme', actualTheme.value)
        applyTheme(actualTheme.value)
    })
}

export const useTheme = () => {
    // Initialize watch effect only once
    if (typeof window !== 'undefined' && !isWatcherInitialized) {
        isWatcherInitialized = true
        console.log('Initializing theme watcher for the first time')

        // Watch for theme changes and apply them
        watchEffect(() => {
            console.log('useTheme watchEffect triggered with actualTheme:', actualTheme.value)
            applyTheme(actualTheme.value)
        })
    }

    return {
        theme: readonly(theme),
        actualTheme: readonly(actualTheme),
        setTheme,
        initializeTheme
    }
}

// Listen for system theme changes (only once)
if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
        console.log('System theme changed, current theme.value:', theme.value)
        if (theme.value === 'system') {
            applyTheme(actualTheme.value)
        }
    })

    // Auto-initialize when module loads
    console.log('Auto-initializing theme system...')
    initializeTheme()
    applyTheme(actualTheme.value)
}
