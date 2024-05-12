<script lang='ts' setup>
import BaseCard from '@/components/card/BaseCard.vue'
import type { BaseCardProps } from '@/components/card/BaseCard.vue'

const props = defineProps<BaseCardProps>()

</script>

<template>
  <base-card class='w-full' v-bind='props'>
    <h1 v-if='$slots["title"]'
        class='w-full text-2xl text-center mb-5'>
      <slot name='title'></slot>
    </h1>
    <div class='w-full text-base'>
      <slot name='default'></slot>
    </div>
  </base-card>
</template>

<style scoped>

</style>
