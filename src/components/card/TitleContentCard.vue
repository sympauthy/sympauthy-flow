<script lang='ts' setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/card/BaseCard.vue'
import type { BaseCardProps } from '@/components/card/BaseCard.vue'
import CommonAlert from '@/components/CommonAlert.vue'
import CommonSpinner from '@/components/CommonSpinner.vue'

interface Props extends BaseCardProps {
  loading?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const cardProps = computed(() => ({
  size: props.size,
  noPadding: props.noPadding
}))

const { t } = useI18n()

</script>

<template>
  <base-card class='w-full' v-bind='cardProps'>
    <h1 v-if='$slots["title"]'
        class='w-full text-2xl text-center mb-5'>
      <slot name='title'></slot>
    </h1>
    <div v-if='error' class='w-full text-base'>
      <common-alert>{{ error }}</common-alert>
    </div>
    <div v-else-if='loading' class='w-full flex flex-col items-center py-10 gap-3'>
      <common-spinner class='h-8 w-8 border-4 text-(--color-primary)' />
      <p class='text-sm text-gray-500'>{{ t('common.loading_from_server') }}</p>
    </div>
    <div v-else class='w-full text-base'>
      <slot name='default'></slot>
    </div>
  </base-card>
</template>

<style scoped>

</style>
