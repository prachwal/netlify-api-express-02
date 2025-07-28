<template>
    <MainLayout>
        <div>
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Components Showcase</h1>
                <p class="text-gray-600 dark:text-gray-400">
                    Explore the various components and theme system implementations.
                </p>
            </div>

            <div class="space-y-8">
                <!-- Theme Selectors Section -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Theme Selectors</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="text-center">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Normal Mode</h3>
                            <ThemeSelector mode="normal" />
                        </div>
                        <div class="text-center">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Icons Mode</h3>
                            <ThemeSelector mode="icons" />
                        </div>
                        <div class="text-center">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Toggle Mode</h3>
                            <ThemeSelector mode="toggle" />
                        </div>
                    </div>
                </div>

                <!-- Debug Information -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Theme Debug Info</h2>
                    <div class="bg-gray-50 dark:bg-gray-900 rounded p-4 font-mono text-sm">
                        <div class="text-gray-700 dark:text-gray-300">
                            <div>System Theme: {{ themeInfo.systemTheme }}</div>
                            <div>Selected Theme: {{ themeInfo.selectedTheme }}</div>
                            <div>Effective Theme: {{ themeInfo.effectiveTheme }}</div>
                            <div>Is Dark: {{ themeInfo.isDark }}</div>
                            <div>HTML Class: {{ themeInfo.htmlClass }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../layouts/MainLayout.vue'
import ThemeSelector from '../components/ThemeSelector.vue'
import { useTheme } from '../composables/useTheme'

const { themeInfo } = useTheme()
</script>
