import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// Mock component for router-view
const MockComponent = {
    template: '<div>Mock Route Component</div>'
}

// Create a test router
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: MockComponent }
    ]
})

describe('App', () => {
    it('renders without crashing', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(App, {
            global: {
                plugins: [router]
            }
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('contains router-view component', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(App, {
            global: {
                plugins: [router]
            }
        })

        // Check that router-view is rendered
        const routerView = wrapper.findComponent({ name: 'RouterView' })
        expect(routerView.exists()).toBe(true)
    })

    it('has proper app structure', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(App, {
            global: {
                plugins: [router]
            }
        })

        // Check the main app container
        const appDiv = wrapper.find('#app')
        expect(appDiv.exists()).toBe(true)
    })

    it('renders mock route component', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(App, {
            global: {
                plugins: [router]
            }
        })

        // Should render the mock component content
        expect(wrapper.text()).toContain('Mock Route Component')
    })
})
