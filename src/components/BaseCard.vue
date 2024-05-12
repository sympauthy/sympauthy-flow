<script lang='ts' setup>

import { computed } from 'vue'

interface Props {
  size?: 'default' | 'large'
  noPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
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
       class='w-full bg-white rounded-xl shadow-lg'>
    <h1 v-if='$slots["title"]'
        class='w-full text-2xl text-center mb-5'>
      <slot name='title'></slot>
    </h1>
    <div class='w-full text-base'>
      <slot name='default'></slot>
    </div>
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
