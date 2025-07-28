<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()
defineOptions({ name: 'HelloWorld' })

const count = ref(0)
</script>

<template>
  <div class="text-center max-w-2xl mx-auto">
    <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-white">{{ msg }}</h1>

    <div class="card mb-8 p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
      <button type="button" @click="count++"
        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
        count is {{ count }}
      </button>
      <p class="mt-4 text-gray-600 dark:text-gray-300">
        Edit
        <code
          class="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded font-mono text-sm">components/HelloWorld.vue</code>
        to test HMR
      </p>
    </div>

    <div class="space-y-4 text-gray-600 dark:text-gray-300">
      <p>
        Check out
        <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
          class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium">
          create-vue
        </a>,
        the official Vue + Vite starter
      </p>
      <p>
        Learn more about IDE Support for Vue in the
        <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank"
          class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium">
          Vue Docs Scaling up Guide
        </a>.
      </p>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Click on the Vite and Vue logos to learn more
      </p>
    </div>
  </div>
</template>
