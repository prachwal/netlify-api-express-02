<template>
    <div
        class="api-demo p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Pinia API Store Demo
        </h3>

        <!-- API Controls -->
        <div class="flex flex-wrap gap-2 mb-4">
            <button @click="apiStore.callHelloApi()" :disabled="apiStore.isLoading"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-md transition-colors duration-200">
                {{ apiStore.isLoading ? 'Loading...' : 'Call /api/hello' }}
            </button>

            <button @click="apiStore.clearAllResponses()"
                class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors duration-200">
                Clear Responses
            </button>

            <button @click="apiStore.clearHistory()"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200">
                Clear History
            </button>
        </div>

        <!-- Current Response -->
        <div v-if="currentError"
            class="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-4">
            <p class="text-red-700 dark:text-red-400 text-sm">
                <strong>Error:</strong> {{ currentError.message }}
                <span v-if="currentError.status"> ({{ currentError.status }})</span>
            </p>
            <p class="text-red-600 dark:text-red-300 text-xs mt-1">
                {{ new Date(currentError.timestamp).toLocaleString() }}
            </p>
        </div>

        <div v-if="currentResponse"
            class="p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md mb-4">
            <h4 class="text-green-800 dark:text-green-400 font-medium mb-2">API Response:</h4>
            <pre
                class="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">{{ JSON.stringify(currentResponse, null, 2) }}</pre>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div class="text-blue-800 dark:text-blue-400 font-medium">Total Requests</div>
                <div class="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    {{ apiStore.requestHistory.length }}
                </div>
            </div>

            <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                <div class="text-green-800 dark:text-green-400 font-medium">Successful</div>
                <div class="text-2xl font-bold text-green-900 dark:text-green-300">
                    {{ apiStore.successfulRequests.length }}
                </div>
            </div>

            <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                <div class="text-red-800 dark:text-red-400 font-medium">Failed</div>
                <div class="text-2xl font-bold text-red-900 dark:text-red-300">
                    {{ apiStore.failedRequests.length }}
                </div>
            </div>
        </div>

        <!-- Request History -->
        <div v-if="apiStore.requestHistory.length > 0" class="mt-6">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Request History</h4>
            <div class="space-y-2 max-h-40 overflow-y-auto">
                <div v-for="(request, index) in apiStore.requestHistory.slice().reverse()" :key="index"
                    class="flex items-center justify-between p-2 rounded text-sm" :class="request.success
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'">
                    <span class="font-mono">{{ request.endpoint }}</span>
                    <div class="flex items-center gap-2">
                        <span
                            :class="request.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                            {{ request.success ? '✓' : '✗' }}
                        </span>
                        <span class="text-xs opacity-75">
                            {{ new Date(request.timestamp).toLocaleTimeString() }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Store State Debug -->
        <details class="mt-6">
            <summary class="cursor-pointer text-gray-700 dark:text-gray-300 font-medium">
                Debug: Store State
            </summary>
            <div class="mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded text-xs">
                <pre class="whitespace-pre-wrap text-gray-600 dark:text-gray-400">{{ JSON.stringify({
                    loading: apiStore.loading,
                    responsesCount: Object.keys(apiStore.responses).length,
                    errorsCount: Object.keys(apiStore.errors).length,
                    historyLength: apiStore.requestHistory.length
                }, null, 2) }}</pre>
            </div>
        </details>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useApiStore } from '../stores/apiStore'

const apiStore = useApiStore()

// Computed properties for current response/error
const currentResponse = computed(() => apiStore.getResponse('/api/hello'))
const currentError = computed(() => apiStore.getError('/api/hello'))
</script>
