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
      <h1 v-if="$slots['title']" class="flow-title text-center text-gray-900">
        <slot name="title"></slot>
      </h1>
      <sa-alert v-if="error">{{ error }}</sa-alert>
      <sa-loading-state v-else-if="loading" size="lg" />
      <slot v-else name="default"></slot>
    </div>
  </sa-card>
</template>
