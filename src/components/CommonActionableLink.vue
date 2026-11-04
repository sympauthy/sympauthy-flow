<script lang="ts" setup>
import { CommonSkeleton } from '@sympauthy/design'

interface Props {
  label?: string
  text?: string
  loading?: boolean
  submitting?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  submitting: false,
  disabled: false
})

const slots = defineSlots<{
  default?: () => any
}>()

const emit = defineEmits<{
  click: []
}>()

const onClick = () => {
  emit('click')
}
</script>

<template>
  <div class="flex items-baseline justify-center">
    <template v-if="label">
      <p class="me-3">{{ props.label }}</p>
    </template>
    <template v-if="loading">
      <common-skeleton class="h-2 w-20" />
    </template>
    <slot v-else-if="slots.default"></slot>
    <a v-else @click="onClick" class="link">{{ props.text }}</a>
  </div>
</template>

<style scoped></style>
