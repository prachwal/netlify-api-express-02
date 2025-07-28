import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

export interface ApiResponse {
    message: string
    timestamp: string
    path: string
    method: string
}

export interface ApiError {
    message: string
    status?: number
    timestamp: string
}

export const useApiStore = defineStore('api', () => {
    // State
    const loading = ref(false)
    const responses = ref<Record<string, ApiResponse>>({})
    const errors = ref<Record<string, ApiError>>({})
    const requestHistory = ref<Array<{ endpoint: string, timestamp: string, success: boolean }>>([])

    // Getters
    const isLoading = computed(() => loading.value)
    const getResponse = computed(() => (endpoint: string) => responses.value[endpoint])
    const getError = computed(() => (endpoint: string) => errors.value[endpoint])
    const lastRequest = computed(() => requestHistory.value[requestHistory.value.length - 1])
    const successfulRequests = computed(() => requestHistory.value.filter(req => req.success))
    const failedRequests = computed(() => requestHistory.value.filter(req => !req.success))

    // Actions
    const makeRequest = async (endpoint: string, options?: RequestInit): Promise<ApiResponse> => {
        loading.value = true

        // Clear previous error for this endpoint
        delete errors.value[endpoint]

        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data: ApiResponse = await response.json()

            // Store successful response
            responses.value[endpoint] = data

            // Add to history
            requestHistory.value.push({
                endpoint,
                timestamp: new Date().toISOString(),
                success: true,
            })

            return data
        } catch (error) {
            const apiError: ApiError = {
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                status: error instanceof Response ? error.status : undefined,
                timestamp: new Date().toISOString(),
            }

            // Store error
            errors.value[endpoint] = apiError

            // Add to history
            requestHistory.value.push({
                endpoint,
                timestamp: new Date().toISOString(),
                success: false,
            })

            throw apiError
        } finally {
            loading.value = false
        }
    }

    // Specific API methods
    const callHelloApi = () => makeRequest('/api/hello')

    const callApiWithMethod = (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any) => {
        return makeRequest(endpoint, {
            method,
            body: body ? JSON.stringify(body) : undefined,
        })
    }

    // Utility actions
    const clearResponse = (endpoint: string) => {
        delete responses.value[endpoint]
        delete errors.value[endpoint]
    }

    const clearAllResponses = () => {
        responses.value = {}
        errors.value = {}
    }

    const clearHistory = () => {
        requestHistory.value = []
    }

    return {
        // State
        loading: readonly(loading),
        responses: readonly(responses),
        errors: readonly(errors),
        requestHistory: readonly(requestHistory),

        // Getters
        isLoading,
        getResponse,
        getError,
        lastRequest,
        successfulRequests,
        failedRequests,

        // Actions
        makeRequest,
        callHelloApi,
        callApiWithMethod,
        clearResponse,
        clearAllResponses,
        clearHistory,
    }
})
