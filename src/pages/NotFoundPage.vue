<template>
    <MainLayout>
        <div class="text-center py-16">
            <div class="max-w-md mx-auto">
                <div
                    class="w-24 h-24 mx-auto mb-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <span class="text-4xl">🔍</span>
                </div>

                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Page Not Found</h2>

                <p class="text-gray-600 dark:text-gray-400 mb-8">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>

                <div class="space-y-4">
                    <router-link to="/"
                        class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                        Go Home
                    </router-link>

                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        <button @click="$router.go(-1)"
                            class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            ← Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../layouts/MainLayout.vue'
</script>
