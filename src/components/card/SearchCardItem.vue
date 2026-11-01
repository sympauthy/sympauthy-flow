<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
</script>

<template>
  <div class="flex flex-row border-b border-gray-100 p-3 hover:bg-gray-100 cursor-pointer">
    <div class="flex-auto">
      <slot></slot>
    </div>
    <ChevronRightIcon class="size-5 text-gray-400" />
  </div>
</template>
