import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
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
            expect(button.classes()).toContain('px-3')
            expect(button.classes()).toContain('py-2')
            expect(button.classes()).toContain('rounded-md')
        })
    })
})
