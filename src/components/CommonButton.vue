<script lang='ts' setup>

import { computed } from 'vue'
import type { Theme } from '@/styles/theme'

interface Props {
  theme?: Theme
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false
})

const computedDisabled = computed(() => props.loading || props.disabled)

const computedClasses = computed(() => {
  let classes = ''
  if (computedDisabled.value) {
    classes = `${classes} ${props.theme?.disabledButtonClasses}`
  } else {
    classes = `${classes} ${props.theme?.activeButtonClasses}`
  }
  return classes
})

</script>

<template>
  <button :class='computedClasses'
          :disabled='computedDisabled'
          class='btn'>
    <slot />
  </button>
</template>

<style scoped></style>
