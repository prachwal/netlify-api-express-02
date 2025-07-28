import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '../components/HelloWorld.vue'

describe('HelloWorld', () => {
    it('renders proper msg when passed', () => {
        const msg = 'Test message'
        const wrapper = mount(HelloWorld, { props: { msg } })
        expect(wrapper.text()).toContain(msg)
    })

    it('has the correct structure', () => {
        const wrapper = mount(HelloWorld, {
            props: { msg: 'Test' }
        })
        expect(wrapper.find('h1').exists()).toBe(true)
    })
})
