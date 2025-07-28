<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import ThemeSelector from './components/ThemeSelector.vue'
import ApiDemo from './components/ApiDemo.vue'
import PiniaApiDemo from './components/PiniaApiDemo.vue'
import { useTheme } from './composables/useTheme'
import { onMounted, watchEffect } from 'vue'

// Initialize theme system
const { initializeTheme, actualTheme } = useTheme()

onMounted(() => {
  initializeTheme()
  console.log('App mounted - Current theme:', actualTheme.value)
})

// Watch for theme changes and log them
watchEffect(() => {
  console.log('App watchEffect - theme changed to:', actualTheme.value)
})
</script>

<template>
  <div
    :class="`min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 theme-${actualTheme}`">

    <!-- Debug info -->
    <div class="fixed top-2 left-2 text-xs bg-black/20 px-2 py-1 rounded">
      Current theme: {{ actualTheme }}
    </div>

    <!-- Theme selector examples -->
    <div class="fixed top-4 right-4 z-10 flex flex-col gap-4">
      <!-- Toggle mode - single button -->
      <div class="text-xs text-gray-600 dark:text-gray-400">Toggle mode:</div>
      <ThemeSelector mode="toggle" />

      <!-- Normal mode with labels -->
      <div class="text-xs text-gray-600 dark:text-gray-400">Normal:</div>
      <ThemeSelector mode="normal" />

      <!-- Icons only mode -->
      <div class="text-xs text-gray-600 dark:text-gray-400">Icons only:</div>
      <ThemeSelector mode="icons" />
    </div>

    <div class="flex space-x-6 mb-8">
      <a href="https://vite.dev" target="_blank" class="transition-transform hover:scale-105">
        <img src="/vite.svg" alt="Vite logo"
          class="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] dark:hover:drop-shadow-[0_0_2em_#747bffaa]" />
      </a>
      <a href="https://vuejs.org/" target="_blank" class="transition-transform hover:scale-105">
        <img src="./assets/vue.svg" alt="Vue logo"
          class="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#42b883aa] dark:hover:drop-shadow-[0_0_2em_#4ade80aa]" />
      </a>
    </div>

    <HelloWorld msg="Vite + Vue" />

    <div class="mt-8 max-w-2xl space-y-6">
      <ApiDemo />
      <PiniaApiDemo />
    </div>
  </div>
</template>
