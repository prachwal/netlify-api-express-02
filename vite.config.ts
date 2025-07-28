import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: [fileURLToPath(new URL('./src/test/setup.ts', import.meta.url))],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/main.ts',
        'src/vite-env.d.ts',
        'node_modules/',
        'dist/',
        '**/*.config.*',
        '**/*.stories.*',
        '**/stories/**',
        'coverage/',
        'src/test/setup.ts',
      ],
    },
  },
})
