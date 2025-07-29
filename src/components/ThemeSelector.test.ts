import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ThemeSelector from './ThemeSelector.vue'

// Mock useTheme composable
vi.mock('../composables/useTheme', () => ({
    useTheme: () => ({
        theme: { value: 'system' },
        setTheme: vi.fn()
    })
}))

describe('ThemeSelector', () => {
    let wrapper: any

    beforeEach(() => {
        wrapper = mount(ThemeSelector)
    })

    it('renderuje się bez błędów', () => {
        expect(wrapper.exists()).toBe(true)
    })

    it('renderuje trzy przyciski motywu', () => {
        const buttons = wrapper.findAll('button')
        expect(buttons).toHaveLength(3)

        const buttonTexts = buttons.map((button: any) => button.text())
        expect(buttonTexts).toContain('Light')
        expect(buttonTexts).toContain('Dark')
        expect(buttonTexts).toContain('System')
    })

    it('posiada odpowiednie klasy stylów', () => {
        const container = wrapper.find('.theme-selector')
        expect(container.exists()).toBe(true)
    })

    it('każdy przycisk ma etykietę', () => {
        const buttons = wrapper.findAll('button')
        buttons.forEach((btn: import('@vue/test-utils').DOMWrapper<Element>) => {
            expect(btn.text().length).toBeGreaterThan(0)
        })
    })

    it('przyciski mają odpowiednią strukturę', () => {
        const buttons = wrapper.findAll('button')
        buttons.forEach((button: any) => {
            // Sprawdź podstawowe klasy komponentu
            expect(button.classes()).toContain('theme-button')
            expect(button.classes()).toContain('transition-all')
            expect(button.classes()).toContain('duration-200')
            expect(button.classes()).toContain('ease-in-out')

            // Sprawdź że ma jeden z trybów: normal lub icon-only
            const hasMode = button.classes().includes('normal') || button.classes().includes('icon-only')
            expect(hasMode).toBe(true)

            // Sprawdź że ma jeden ze stanów: active lub inactive
            const hasState = button.classes().includes('active') || button.classes().includes('inactive')
            expect(hasState).toBe(true)
        })
    })

    it('każdy przycisk zawiera ikonę', () => {
        const buttons = wrapper.findAll('button')
        buttons.forEach((button: any) => {
            const icon = button.find('.icon')
            expect(icon.exists()).toBe(true)
            // Sprawdź że ikona to element SVG
            expect(icon.element.tagName.toLowerCase()).toBe('svg')
        })
    })

    it('w trybie normal przyciski zawierają etykiety', () => {
        // Component domyślnie jest w trybie 'normal'
        const buttons = wrapper.findAll('button')
        buttons.forEach((button: any) => {
            const label = button.find('.label')
            expect(label.exists()).toBe(true)
            expect(label.text().length).toBeGreaterThan(0)
        })
    })
})
