import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App', () => {
    it('renders without crashing', () => {
        const wrapper = mount(App)
        expect(wrapper.exists()).toBe(true)
    })

    it('contains Vite and Vue logos', () => {
        const wrapper = mount(App)
        const images = wrapper.findAll('img')
        expect(images).toHaveLength(2)

        const viteImg = images.find(img => img.attributes('alt') === 'Vite logo')
        const vueImg = images.find(img => img.attributes('alt') === 'Vue logo')

        expect(viteImg?.exists()).toBe(true)
        expect(vueImg?.exists()).toBe(true)
    })

    it('renders HelloWorld component with correct props', () => {
        const wrapper = mount(App)
        const helloWorld = wrapper.findComponent({ name: 'HelloWorld' })
        expect(helloWorld.exists()).toBe(true)
        expect(helloWorld.props('msg')).toBe('Vite + Vue')
    })

    it('renders ThemeSelector component', () => {
        const wrapper = mount(App)
        const themeSelector = wrapper.findComponent({ name: 'ThemeSelector' })
        expect(themeSelector.exists()).toBe(true)
    })

    it('has proper dark mode classes', () => {
        const wrapper = mount(App)
        const mainDiv = wrapper.find('.min-h-screen')
        expect(mainDiv.classes()).toContain('dark:bg-gray-900')
        expect(mainDiv.classes()).toContain('dark:text-white')
    })
})
