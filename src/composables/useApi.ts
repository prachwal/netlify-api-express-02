import { ref, readonly } from 'vue'

export interface ApiResponse {
    message: string
    timestamp: string
    path: string
    method: string
}

export const useApi = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const data = ref<ApiResponse | null>(null)

    const callHelloApi = async () => {
        loading.value = true
        error.value = null

        try {
            const response = await fetch('/api/hello')

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result: ApiResponse = await response.json()
            data.value = result
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Unknown error occurred'
        } finally {
            loading.value = false
        }
    }

    return {
        loading: readonly(loading),
        error: readonly(error),
        data: readonly(data),
        callHelloApi
    }
}
