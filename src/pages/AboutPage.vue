<template>
    <MainLayout>
        <div>
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">About This Project</h1>
                <p class="text-gray-600 dark:text-gray-400">
                    Learn about the technologies and architecture behind this Vue application.
                </p>
            </div>

            <div class="space-y-8">
                <!-- Technologies Section -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Technologies Used</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="text-center">
                            <div
                                class="w-16 h-16 mx-auto mb-3 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <span class="text-2xl font-bold text-green-600 dark:text-green-400">V</span>
                            </div>
                            <h3 class="font-semibold text-gray-900 dark:text-white">Vue 3.5.18</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Progressive JavaScript Framework</p>
                        </div>

                        <div class="text-center">
                            <div
                                class="w-16 h-16 mx-auto mb-3 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">T</span>
                            </div>
                            <h3 class="font-semibold text-gray-900 dark:text-white">Tailwind CSS 4.1.11</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Utility-first CSS Framework</p>
                        </div>

                        <div class="text-center">
                            <div
                                class="w-16 h-16 mx-auto mb-3 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                <span class="text-2xl font-bold text-purple-600 dark:text-purple-400">P</span>
                            </div>
                            <h3 class="font-semibold text-gray-900 dark:text-white">Pinia 3.0.3</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Vue State Management</p>
                        </div>

                        <div class="text-center">
                            <div
                                class="w-16 h-16 mx-auto mb-3 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                                <span class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">⚡</span>
                            </div>
                            <h3 class="font-semibold text-gray-900 dark:text-white">Vite 7.0.6</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Next Generation Frontend Tooling</p>
                        </div>

                        <div class="text-center">
                            <div
                                class="w-16 h-16 mx-auto mb-3 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                <span class="text-2xl font-bold text-red-600 dark:text-red-400">H</span>
                            </div>
                            <h3 class="font-semibold text-gray-900 dark:text-white">Headless UI</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Unstyled Accessible Components</p>
                        </div>

                        <div class="text-center">
                            <div
                                class="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <span class="text-2xl font-bold text-gray-600 dark:text-gray-400">N</span>
                            </div>
                            <h3 class="font-semibold text-gray-900 dark:text-white">Netlify Functions</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Serverless API Endpoints</p>
                        </div>
                    </div>
                </div>

                <!-- Features Section -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Key Features</h2>
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                                <span class="text-white text-sm">✓</span>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">Advanced Theme System</h3>
                                <p class="text-gray-600 dark:text-gray-400">Light, dark, and system theme support with
                                    multiple UI modes</p>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3">
                            <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                                <span class="text-white text-sm">✓</span>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">Comprehensive API Management
                                </h3>
                                <p class="text-gray-600 dark:text-gray-400">Pinia store with caching, history, and error
                                    handling</p>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3">
                            <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                                <span class="text-white text-sm">✓</span>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">100% Test Coverage</h3>
                                <p class="text-gray-600 dark:text-gray-400">Vitest framework with comprehensive unit
                                    tests</p>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3">
                            <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                                <span class="text-white text-sm">✓</span>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">Responsive Design</h3>
                                <p class="text-gray-600 dark:text-gray-400">Mobile-first approach with Headless UI
                                    components</p>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3">
                            <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                                <span class="text-white text-sm">✓</span>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">Production Ready</h3>
                                <p class="text-gray-600 dark:text-gray-400">Deployed on Netlify with serverless
                                    functions</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Architecture Section -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Project Architecture</h2>
                    <div class="prose dark:prose-invert max-w-none">
                        <p class="text-gray-600 dark:text-gray-400">
                            This project demonstrates modern Vue.js development practices with a focus on:
                        </p>
                        <ul class="text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong>Separation of Concerns:</strong> UI components in .vue files, business logic in
                                .ts files</li>
                            <li><strong>State Management:</strong> Centralized Pinia stores with proper encapsulation
                            </li>
                            <li><strong>Type Safety:</strong> Full TypeScript integration with strict configuration</li>
                            <li><strong>Testing Strategy:</strong> Unit tests for business logic, integration tests for
                                components</li>
                            <li><strong>Modern CSS:</strong> Tailwind CSS v4 with custom variant configuration</li>
                            <li><strong>Accessibility:</strong> ARIA attributes and semantic HTML with Headless UI</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../layouts/MainLayout.vue'
</script>
