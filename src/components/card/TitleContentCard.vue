<script lang="ts" setup>
import { CommonAlert, CommonCard, LoadingState } from '@sympauthy/design'
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
      <loading-state v-else-if="loading" :label="t('common.loading_from_server')" size="lg" />
      <slot v-else name="default"></slot>
    </div>
  </common-card>
</template>
