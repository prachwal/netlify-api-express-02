<template>
  <div class="database-browser bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Database Browser
      </h2>
      <button
        @click="refreshData"
        :disabled="loading"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>

    <!-- Database Health Status -->
    <div v-if="healthStatus" class="mb-6 p-4 rounded-lg" 
         :class="healthStatus.status === 'healthy' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full"
             :class="healthStatus.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'">
        </div>
        <span class="font-medium" 
              :class="healthStatus.status === 'healthy' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'">
          Database {{ healthStatus.status === 'healthy' ? 'Connected' : 'Disconnected' }}
        </span>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ healthStatus.timestamp }}
        </span>
      </div>
    </div>

    <!-- Tables List -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Tables Sidebar -->
      <div class="lg:col-span-1">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tables</h3>
        <div v-if="loading" class="animate-pulse space-y-2">
          <div v-for="i in 3" :key="i" class="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div v-else class="space-y-2">
          <button
            v-for="table in tables"
            :key="table"
            @click="selectTable(table)"
            :class="[
              'w-full text-left px-4 py-2 rounded-lg transition-colors',
              selectedTable === table
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            ]"
          >
            {{ table }}
          </button>
        </div>
      </div>

      <!-- Table Data -->
      <div class="lg:col-span-2">
        <div v-if="selectedTable" class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ selectedTable }}
            </h3>
            <div class="flex gap-2">
              <button
                @click="showSchema = !showSchema"
                class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                {{ showSchema ? 'Hide Schema' : 'Show Schema' }}
              </button>
              <button
                @click="loadTableData"
                :disabled="loadingTableData"
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Reload Data
              </button>
            </div>
          </div>

          <!-- Schema View -->
          <div v-if="showSchema && tableSchema" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">Schema</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Column</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nullable</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Default</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="column in tableSchema" :key="column.column_name">
                    <td class="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
                      {{ column.column_name }}
                    </td>
                    <td class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                      {{ column.data_type }}
                    </td>
                    <td class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                      {{ column.is_nullable }}
                    </td>
                    <td class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                      {{ column.column_default || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Data View -->
          <div v-if="loadingTableData" class="animate-pulse">
            <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          
          <div v-else-if="tableData" class="space-y-4">
            <!-- Pagination Controls -->
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Showing {{ pagination.offset + 1 }} to 
                {{ Math.min(pagination.offset + pagination.limit, pagination.total) }} 
                of {{ pagination.total }} records
              </div>
              <div class="flex gap-2">
                <button
                  @click="previousPage"
                  :disabled="pagination.offset === 0"
                  class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  @click="nextPage"
                  :disabled="pagination.offset + pagination.limit >= pagination.total"
                  class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            <!-- Data Table -->
            <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th v-for="column in Object.keys(tableData[0] || {})" :key="column"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {{ column }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(row, index) in tableData" :key="index">
                    <td v-for="(value, column) in row" :key="column"
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div class="max-w-xs truncate" :title="String(value)">
                        {{ formatValue(value) }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
          Select a table to view its data
        </div>
      </div>
    </div>

    <!-- Custom Query Section -->
    <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Custom Query</h3>
      <div class="space-y-4">
        <textarea
          v-model="customQuery"
          placeholder="SELECT * FROM table_name LIMIT 10;"
          class="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
        ></textarea>
        <div class="flex gap-2">
          <button
            @click="executeCustomQuery"
            :disabled="!customQuery.trim() || executingQuery"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {{ executingQuery ? 'Executing...' : 'Execute Query' }}
          </button>
          <button
            @click="customQuery = ''"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Query Results -->
      <div v-if="queryResults" class="mt-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-2">
          Query Results ({{ queryResults.count }} records)
        </h4>
        <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow max-h-64 overflow-y-auto">
          <pre class="p-4 text-sm font-mono text-gray-900 dark:text-white">{{ JSON.stringify(queryResults.results, null, 2) }}</pre>
        </div>
      </div>

      <div v-if="queryError" class="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded-lg">
        <p class="text-red-800 dark:text-red-200 font-medium">Query Error:</p>
        <p class="text-red-600 dark:text-red-400 text-sm mt-1">{{ queryError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Reactive state
const loading = ref(true)
const healthStatus = ref<any>(null)
const tables = ref<string[]>([])
const selectedTable = ref<string>('')
const showSchema = ref(false)
const tableSchema = ref<any[]>([])
const tableData = ref<any[]>([])
const loadingTableData = ref(false)
const pagination = ref({
  limit: 50,
  offset: 0,
  total: 0
})

// Custom query state
const customQuery = ref('')
const queryResults = ref<any>(null)
const queryError = ref('')
const executingQuery = ref(false)

// Methods
const refreshData = async () => {
  loading.value = true
  await Promise.all([
    loadHealthStatus(),
    loadTables()
  ])
  loading.value = false
}

const loadHealthStatus = async () => {
  try {
    const response = await fetch('/api/database/health')
    healthStatus.value = await response.json()
  } catch (error) {
    console.error('Failed to load health status:', error)
  }
}

const loadTables = async () => {
  try {
    const response = await fetch('/api/database/tables')
    const data = await response.json()
    tables.value = data.tables || []
  } catch (error) {
    console.error('Failed to load tables:', error)
    tables.value = []
  }
}

const selectTable = async (tableName: string) => {
  selectedTable.value = tableName
  showSchema.value = false
  pagination.value.offset = 0
  await Promise.all([
    loadTableSchema(),
    loadTableData()
  ])
}

const loadTableSchema = async () => {
  if (!selectedTable.value) return
  
  try {
    const response = await fetch(`/api/database/tables/${selectedTable.value}/schema`)
    const data = await response.json()
    tableSchema.value = data.schema || []
  } catch (error) {
    console.error('Failed to load table schema:', error)
  }
}

const loadTableData = async () => {
  if (!selectedTable.value) return
  
  loadingTableData.value = true
  try {
    const params = new URLSearchParams({
      limit: pagination.value.limit.toString(),
      offset: pagination.value.offset.toString()
    })
    
    const response = await fetch(`/api/database/tables/${selectedTable.value}/data?${params}`)
    const data = await response.json()
    
    tableData.value = data.data || []
    pagination.value = { ...pagination.value, ...data.pagination }
  } catch (error) {
    console.error('Failed to load table data:', error)
  } finally {
    loadingTableData.value = false
  }
}

const previousPage = () => {
  if (pagination.value.offset > 0) {
    pagination.value.offset = Math.max(0, pagination.value.offset - pagination.value.limit)
    loadTableData()
  }
}

const nextPage = () => {
  if (pagination.value.offset + pagination.value.limit < pagination.value.total) {
    pagination.value.offset += pagination.value.limit
    loadTableData()
  }
}

const executeCustomQuery = async () => {
  if (!customQuery.value.trim()) return
  
  executingQuery.value = true
  queryError.value = ''
  queryResults.value = null
  
  try {
    const response = await fetch('/api/database/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: customQuery.value
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      queryResults.value = data
    } else {
      queryError.value = data.error || 'Query execution failed'
    }
  } catch (error) {
    queryError.value = error instanceof Error ? error.message : 'Network error'
  } finally {
    executingQuery.value = false
  }
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

// Initialize
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.database-browser {
  min-height: 600px;
}
</style>
