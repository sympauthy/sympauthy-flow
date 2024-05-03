<script setup lang='ts'>

interface Props {
  size?: 'default' | 'large'
}

withDefaults(defineProps<Props>(), {
  size: 'default'
})

</script>

<template>
  <div class='w-full bg-white rounded-xl shadow-lg p-5 m-3'
       :class='{"card": size === "default", "card-large": size === "large" }'>
    <h1 class='w-full text-2xl text-center mb-5'>
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
