<script lang='ts' setup>

import { computed } from 'vue'
import { type ButtonStyle, primaryColoredButton } from '@/styles/ButtonStyle'
import CommonSpinner from '@/components/CommonSpinner.vue'

interface Props {
  buttonStyle?: ButtonStyle
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  buttonStyle: () => primaryColoredButton,
  loading: false,
  disabled: false
})

const computedDisabled = computed(() => props.loading || props.disabled)

const computedClasses = computed(() => {
  let classes = ''
  if (props.disabled) {
    classes = `${classes} ${props.buttonStyle?.disabledClasses}`
  } else if (props.loading) {
    classes = `${classes} ${props.buttonStyle?.loadingClasses}`
  } else {
    classes = `${classes} ${props.buttonStyle?.activeClasses}`
  }
  return classes
})

</script>

<template>
  <button :class='computedClasses'
          :disabled='computedDisabled'
          class='btn'>
    <template v-if='!loading'>
      <slot name='default' />
    </template>
    <template v-else>
      <div class='w-full flex flex-row justify-center align-items-center'>
        <div class='me-2'>
          <common-spinner class='h-4 w-4 border-2'/>
        </div>
        <slot name='loading' />
      </div>
    </template>
  </button>
</template>

<style scoped></style>
