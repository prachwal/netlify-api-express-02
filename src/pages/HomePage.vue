<template>
    <MainLayout>
        <div class="text-center">
            <div class="mb-8">
                <div class="flex justify-center space-x-6 mb-8">
                    <a href="https://vite.dev" target="_blank" class="transition-transform hover:scale-105">
                        <img src="/vite.svg" alt="Vite logo"
                            class="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] dark:hover:drop-shadow-[0_0_2em_#747bffaa]" />
                    </a>
                    <a href="https://vuejs.org/" target="_blank" class="transition-transform hover:scale-105">
                        <img src="/vue.svg" alt="Vue logo"
                            class="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#42b883aa] dark:hover:drop-shadow-[0_0_2em_#4ade80aa]" />
                    </a>
                </div>

                <HelloWorld msg="Vue 3 + Vite + TypeScript + Headless UI" />
            </div>

            <!-- Feature Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                <FeatureCard title="🎨 Headless UI"
                    description="Unstyled, fully accessible UI components, designed to integrate with Tailwind CSS." />
                <FeatureCard title="🏪 Pinia Store"
                    description="Type-safe state management with API integration and reactive updates." />
                <FeatureCard title="🌙 Dark Mode"
                    description="Built-in theme system with light, dark, and system preferences." />
                <FeatureCard title="⚡ Vite" description="Lightning fast development with Hot Module Replacement." />
                <FeatureCard title="📦 TypeScript"
                    description="Full type safety across the entire application stack." />
                <FeatureCard title="🔗 Netlify Functions"
                    description="Serverless API endpoints with automatic deployment." />
            </div>

            <!-- Quick Actions -->
            <div class="mt-12 flex flex-wrap justify-center gap-4">
                <router-link to="/api-demo"
                    class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                    Try API Demo
                </router-link>
                <router-link to="/components"
                    class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors">
                    View Components
                </router-link>
                <a href="https://github.com" target="_blank"
                    class="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors">
                    View Source
                </a>
            </div>
        </div>
    </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../layouts/MainLayout.vue'
import HelloWorld from '../components/HelloWorld.vue'
import FeatureCard from '../components/FeatureCard.vue'
</script>
