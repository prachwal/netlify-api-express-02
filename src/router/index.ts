import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../pages/HomePage.vue'),
    },
    {
        path: '/api-demo',
        name: 'ApiDemo',
        component: () => import('../pages/ApiDemoPage.vue'),
    },
    {
        path: '/components',
        name: 'Components',
        component: () => import('../pages/ComponentsPage.vue'),
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../pages/AboutPage.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../pages/NotFoundPage.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
