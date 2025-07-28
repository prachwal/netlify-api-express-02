<template>
    <div class="theme-selector" :class="{
        'compact': props.mode === 'icons',
        'toggle-mode': props.mode === 'toggle'
    }">
        <!-- Toggle mode - single button that changes icon -->
        <button v-if="props.mode === 'toggle'" @click="toggleTheme" @contextmenu.prevent="setSystemTheme" :class="[
            'theme-button transition-all duration-200 ease-in-out icon-only',
            'active' // Always show as active in toggle mode
        ]" :title="getToggleTooltip()">
            <component :is="getCurrentToggleIcon()" class="icon" />
        </button>

        <!-- Normal and icons mode - multiple buttons -->
        <template v-else>
            <button v-for="themeOption in themes" :key="themeOption.value" @click="handleThemeChange(themeOption.value)"
                :class="[
                    'theme-button transition-all duration-200 ease-in-out',
                    props.mode === 'icons' ? 'icon-only' : 'normal',
                    theme === themeOption.value
                        ? 'active'
                        : 'inactive'
                ]" :title="`Switch to ${themeOption.label.toLowerCase()} theme`">
                <component :is="themeOption.iconComponent" class="icon" />
                <span v-if="props.mode !== 'icons'" class="label">{{ themeOption.label }}</span>
            </button>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

// Props for component configuration
const props = withDefaults(defineProps<{
    mode?: 'normal' | 'icons' | 'toggle'
}>(), {
    mode: 'normal'
})

// Simple SVG icons as functional components
import { h } from 'vue'

const SunIcon = () => h('svg', {
    viewBox: "0 0 24 24",
    fill: "currentColor"
}, h('path', {
    d: "M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
}))

const MoonIcon = () => h('svg', {
    viewBox: "0 0 24 24",
    fill: "currentColor"
}, h('path', {
    'fill-rule': "evenodd",
    d: "M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z",
    'clip-rule': "evenodd"
}))

const ComputerDesktopIcon = () => h('svg', {
    viewBox: "0 0 24 24",
    fill: "currentColor"
}, h('path', {
    'fill-rule': "evenodd",
    d: "M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3.844l.902 3.908a.75.75 0 01-.728.892H7.875a.75.75 0 01-.728-.892L8.049 18H5.25a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z",
    'clip-rule': "evenodd"
}))

// Theme options with icons
const themes = [
    {
        value: 'light' as const,
        label: 'Light',
        iconComponent: SunIcon
    },
    {
        value: 'dark' as const,
        label: 'Dark',
        iconComponent: MoonIcon
    },
    {
        value: 'system' as const,
        label: 'System',
        iconComponent: ComputerDesktopIcon
    }
]

const { theme, setTheme } = useTheme()

// Debug function for theme changes
const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    console.log('ThemeSelector: Changing theme to:', newTheme)
    setTheme(newTheme)
    console.log('ThemeSelector: Current theme after change:', theme.value)
}

// Toggle mode functions - cycles through all three themes
const toggleTheme = () => {
    console.log('Toggle theme - current:', theme.value)
    if (theme.value === 'light') {
        setTheme('dark')
    } else if (theme.value === 'dark') {
        setTheme('system')
    } else {
        setTheme('light')
    }
}

const setSystemTheme = () => {
    console.log('Setting system theme via right-click')
    setTheme('system')
}

const getCurrentToggleIcon = () => {
    return themes.find(t => t.value === theme.value)?.iconComponent || SunIcon
}

const getToggleTooltip = () => {
    const currentTheme = themes.find(t => t.value === theme.value)
    let nextTheme: string
    if (theme.value === 'light') {
        nextTheme = 'dark'
    } else if (theme.value === 'dark') {
        nextTheme = 'system'
    } else {
        nextTheme = 'light'
    }
    return `${currentTheme?.label || 'Light'} theme. Click to switch to ${nextTheme}, right-click for system theme.`
}
</script>

<style scoped>
.theme-selector {
    display: flex;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 0.75rem;
    padding: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    width: fit-content;
}

.theme-selector.compact {
    gap: 0.125rem;
    padding: 0.25rem;
    width: fit-content;
    display: inline-flex;
}

.theme-selector.toggle-mode {
    padding: 0.25rem;
    width: fit-content;
    display: inline-flex;
    border-radius: 0.75rem;
    /* Keep same rectangular shape with rounded corners as other modes */
}

.theme-button {
    display: flex;
    align-items: center;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    outline: none;
    position: relative;
}

.theme-button.normal {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
}

.theme-button.icon-only {
    padding: 0.375rem;
    width: 2rem;
    height: 2rem;
    justify-content: center;
    min-width: 2rem;
}

.theme-button .icon {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s ease-in-out;
    flex-shrink: 0;
}

.theme-button.icon-only .icon {
    width: 1rem;
    height: 1rem;
}

.theme-button .label {
    margin-left: 0.5rem;
}

/* Active state */
.theme-button.active {
    background: rgb(37, 99, 235);
    color: white;
    box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);
}

.theme-button.active .icon {
    transform: scale(1.1);
}

/* Inactive state */
.theme-button.inactive {
    background: rgba(156, 163, 175, 0.2);
    color: rgb(75, 85, 99);
}

.theme-button.inactive:hover {
    background: rgba(156, 163, 175, 0.3);
    transform: translateY(-1px);
}

/* Dark mode adjustments */
.dark .theme-selector {
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
}

.dark .theme-button.active {
    background: rgb(59, 130, 246);
    box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.dark .theme-button.inactive {
    background: rgba(75, 85, 99, 0.3);
    color: rgb(209, 213, 219);
}

.dark .theme-button.inactive:hover {
    background: rgba(75, 85, 99, 0.5);
}

/* Focus states for accessibility */
.theme-button:focus-visible {
    outline: 2px solid rgb(37, 99, 235);
    outline-offset: 2px;
}

.dark .theme-button:focus-visible {
    outline-color: rgb(59, 130, 246);
}
</style>
