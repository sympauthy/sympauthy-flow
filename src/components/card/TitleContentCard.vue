<script lang="ts" setup>
import { SaAlert, SaCard, SaLoadingState } from '@sympauthy/design'
import { useI18n } from 'vue-i18n'

interface Props {
  size?: 'default' | 'large'
  loading?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  size: 'default',
  loading: false
})

const { t } = useI18n()
</script>

<template>
  <sa-card class="flow-body w-full" :class="size === 'large' ? 'max-w-card-large' : 'max-w-card'">
    <div class="flex flex-col gap-4">
      <h1 v-if="$slots['title']" class="flow-title text-center text-gray-900">
        <slot name="title"></slot>
      </h1>
      <sa-alert v-if="error">{{ error }}</sa-alert>
      <sa-loading-state v-else-if="loading" :label="t('common.loading_from_server')" size="lg" />
      <slot v-else name="default"></slot>
    </div>
  </sa-card>
</template>
