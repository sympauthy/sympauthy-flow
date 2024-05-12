<script lang='ts' setup>

import BaseCard from '@/components/BaseCard.vue'

interface Props {
  open?: boolean
}

withDefaults(defineProps<Props>(), {
  open: false
})

</script>

<template>
  <!-- Background backdrop, show/hide based on modal state. -->
  <div v-if='open' class='fixed inset-0 bg-gray-500 bg-opacity-60'></div>

  <!-- Modal -->
  <div v-if='open' class='fixed inset-0 z-10 w-full pt-3 px-3 overflow-y-auto'>
    <slot></slot>
  </div>
</template>

<style scoped>

</style>
