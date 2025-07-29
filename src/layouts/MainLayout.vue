<template>
    <div class="min-h-screen bg-white dark:bg-gray-900">
        <!-- Fixed Navigation with transparency -->
        <Disclosure as="nav"
            class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50"
            v-slot="{ open }">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <!-- Logo -->
                        <div class="flex-shrink-0 flex items-center">
                            <img class="h-8 w-auto" src="/vite.svg" alt="Logo" />
                            <span class="ml-2 text-xl font-bold text-gray-900 dark:text-white">Vue App</span>
                        </div>

                        <!-- Desktop Navigation -->
                        <div class="hidden md:ml-6 md:flex md:space-x-8">
                            <router-link v-for="item in navigation" :key="item.name" :to="item.href"
                                class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                :class="{ 'text-blue-600 dark:text-blue-400': $route.path === item.href }">
                                {{ item.name }}
                            </router-link>
                        </div>
                    </div>

                    <!-- Theme Selector -->
                    <div class="flex items-center space-x-4">
                        <ThemeSelector mode="toggle" />

                        <!-- Mobile menu button -->
                        <div class="md:hidden">
                            <DisclosureButton
                                class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                                <span class="sr-only">Open main menu</span>
                                <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                                <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                            </DisclosureButton>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mobile Navigation with transparency -->
            <DisclosurePanel class="md:hidden">
                <div
                    class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
                    <router-link v-for="item in navigation" :key="item.name" :to="item.href"
                        class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        :class="{ 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20': $route.path === item.href }">
                        {{ item.name }}
                    </router-link>
                </div>
            </DisclosurePanel>
        </Disclosure>

        <!-- Main Content with top padding for fixed header -->
        <main class="flex-1 pt-16">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <slot />
            </div>
        </main>

        <!-- Footer -->
        <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        © {{ new Date().getFullYear() }} Vue + Headless UI App. Built with Vite + TypeScript + Tailwind.
                    </p>
                    <div class="flex space-x-4">
                        <a href="https://github.com" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <span class="sr-only">GitHub</span>
                            <!-- GitHub icon -->
                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import ThemeSelector from '../components/ThemeSelector.vue'

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'API Demo', href: '/api-demo' },
    { name: 'Components', href: '/components' },
    { name: 'Database', href: '/database' },
    { name: 'About', href: '/about' },
]
</script>
