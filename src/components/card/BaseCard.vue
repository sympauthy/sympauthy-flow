<script lang='ts' setup>

import { computed } from 'vue'

export interface BaseCardProps {
  size?: 'default' | 'large'
  noPadding?: boolean
}

const props = withDefaults(defineProps<BaseCardProps>(), {
  size: 'default',
  noPadding: false
})

const cardClasses = computed(() => {
  const classes = []
  switch (props.size) {
    case 'large':
      classes.push('card-large')
      break
    default:
      classes.push('card')
  }
  if (!props.noPadding) {
    classes.push('p-3', 'md:p-5')
  }
  return classes
})

</script>

<template>
  <div :class='cardClasses'
       class='flex-auto bg-white rounded-xl shadow-lg'>
    <slot></slot>
  </div>
</template>

<style scoped>

.card {
  max-width: var(--max-width-card);
}

.card-large {
  max-width: var(--max-width-large-card);
}

</style>
