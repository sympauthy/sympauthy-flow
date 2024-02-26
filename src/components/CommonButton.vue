<script setup lang='ts'>

const props = withDefaults(
  defineProps<{
    loading: boolean | undefined
  }>(),
  {
    loading: false
  }
)

</script>

<template>
  <button class='btn'>
    <slot />

  </button>
</template>

<style scoped>

</style>
