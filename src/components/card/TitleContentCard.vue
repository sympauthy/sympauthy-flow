<script lang="ts" setup>
import { CommonAlert, CommonCard, CommonSpinner } from '@sympauthy/design'
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
  <common-card
    class="flow-body w-full"
    :class="size === 'large' ? 'max-w-card-large' : 'max-w-card'"
  >
    <div class="flex flex-col gap-4">
      <h1 v-if="$slots['title']" class="flow-title text-center text-gray-900">
        <slot name="title"></slot>
      </h1>
      <common-alert v-if="error">{{ error }}</common-alert>
      <div v-else-if="loading" class="flex flex-col items-center gap-3 py-10">
        <common-spinner class="text-primary" size="lg" />
        <p class="flow-small text-gray-500">{{ t('common.loading_from_server') }}</p>
      </div>
      <slot v-else name="default"></slot>
    </div>
  </common-card>
</template>
