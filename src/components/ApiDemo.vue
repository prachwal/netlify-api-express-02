<template>
    <div
        class="api-demo p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Netlify Functions Demo
        </h3>

        <button @click="callHelloApi" :disabled="loading"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-md transition-colors duration-200 mb-4">
            {{ loading ? 'Loading...' : 'Call /api/hello' }}
        </button>

        <div v-if="error"
            class="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-4">
            <p class="text-red-700 dark:text-red-400 text-sm">
                <strong>Error:</strong> {{ error }}
            </p>
        </div>

        <div v-if="data"
            class="p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <h4 class="text-green-800 dark:text-green-400 font-medium mb-2">API Response:</h4>
            <pre
                class="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">{{ JSON.stringify(data, null, 2) }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useApi } from '../composables/useApi'

const { loading, error, data, callHelloApi } = useApi()
</script>
