<script setup lang='ts'>

interface Props {
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})
</script>

<template>
  <button class='btn'>
    <slot />
  </button>
</template>

<style scoped></style>
