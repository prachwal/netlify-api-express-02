<template>
  <MainLayout>
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Database Management
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Browse and manage your Netlify Neon database with real-time data exploration.
          </p>
        </div>

        <!-- Database Browser Component -->
        <DatabaseBrowser />
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../layouts/MainLayout.vue'
import DatabaseBrowser from '../components/DatabaseBrowser.vue'
</script>
