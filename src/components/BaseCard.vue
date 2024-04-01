<script setup lang='ts'>

</script>

<template>
  <div class='card w-full bg-white rounded-xl shadow-lg p-5 m-3'>
    <h1 class='w-full text-2xl text-center mb-5'>
      <slot name='title'></slot>
    </h1>
    <div class='w-full text-base'>
      <slot name='default'></slot>
    </div>
  </div>
</template>

<style scoped>

@media (min-width: 480px) {
  .card {
    max-width: var(--max-width-card);
  }
}

</style>
