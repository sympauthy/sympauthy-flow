<script lang='ts' setup>

import { ref } from 'vue'

const open = ref(false)

const openModel = () => {
  open.value = true
}

const closeModal = () => {
  open.value = false
}

defineExpose({
  openModal: openModel,
  closeModal: closeModal
})

</script>

<template>
  <!-- Background backdrop, show/hide based on modal state. -->
  <div v-if='open' class='fixed inset-0 bg-gray-500 bg-opacity-60'></div>

  <!-- Modal -->
  <div v-if='open' class='fixed inset-0 z-10 w-screen h-screen'>
    <div class='relative w-full h-full flex items-center justify-center'>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>
