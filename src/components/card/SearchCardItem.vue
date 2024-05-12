<script setup lang='ts'>
import { ChevronRightIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <div class='flex flex-row border-b border-gray-100 p-3 hover:bg-gray-100 cursor-pointer'>
    <div class='flex-auto'>
      <slot></slot>
    </div>
    <ChevronRightIcon class='size-6 text-gray-300' />
  </div>
</template>
