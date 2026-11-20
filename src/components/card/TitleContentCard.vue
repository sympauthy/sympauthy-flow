<script lang="ts" setup>
import { SaAlert, SaCard, SaLoadingState } from '@sympauthy/design'

interface Props {
  size?: 'default' | 'large'
  loading?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  size: 'default',
  loading: false
})
</script>

<template>
  <sa-card class="flow-body w-full" :class="size === 'large' ? 'max-w-card-large' : 'max-w-card'">
    <div class="flex flex-col gap-4">
      <div v-if="$slots['title']" class="flex flex-col gap-1 text-center">
        <h1 class="flow-title text-gray-900">
          <slot name="title"></slot>
        </h1>
        <p v-if="$slots['subtitle'] && !loading && !error" class="text-gray-500">
          <slot name="subtitle"></slot>
        </p>
      </div>
      <sa-alert v-if="error">{{ error }}</sa-alert>
      <sa-loading-state v-else-if="loading" size="lg" />
      <slot v-else name="default"></slot>
    </div>
  </sa-card>
</template>
