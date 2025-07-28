<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
            <component :is="iconComponent" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>

        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ title }}
        </h3>

        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {{ description }}
        </p>

        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    CodeBracketIcon,
    CpuChipIcon,
    PaintBrushIcon,
    SparklesIcon,
    DocumentTextIcon
} from '@heroicons/vue/24/outline'

interface Props {
    title: string
    description: string
    icon?: 'code' | 'api' | 'theme' | 'components' | 'docs'
}

const props = withDefaults(defineProps<Props>(), {
    icon: 'code'
})

const iconMap = {
    code: CodeBracketIcon,
    api: CpuChipIcon,
    theme: PaintBrushIcon,
    components: SparklesIcon,
    docs: DocumentTextIcon
}

const iconComponent = computed(() => iconMap[props.icon])
</script>
