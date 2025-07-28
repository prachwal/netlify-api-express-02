<template>
    <MainLayout>
        <div>
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">API Demo</h1>
                <p class="text-gray-600 dark:text-gray-400">
                    Test the integration between Vue components, Pinia store, and Netlify Functions.
                </p>
            </div>

            <div class="space-y-8">
                <ApiDemo />
                <PiniaApiDemo />
            </div>
        </div>
    </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../layouts/MainLayout.vue'
import ApiDemo from '../components/ApiDemo.vue'
import PiniaApiDemo from '../components/PiniaApiDemo.vue'
</script>
