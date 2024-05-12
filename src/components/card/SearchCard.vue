<script lang='ts' setup>
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import BaseCard from '@/components/card/BaseCard.vue'

interface Props {
  placeholder?: string
}

const props = defineProps<Props>()
const model = defineModel<string>()

const emit = defineEmits<{
  select: [item: any],
  close: []
}>()

</script>

<template>
  <base-card class='flex flex-col' no-padding>
    <!-- Search -->
    <div class='w-full flex flex-row items-center shadow-sm text-gray-700 p-3'>
      <MagnifyingGlassIcon class='size-6' />
      <input v-model='model'
             :placeholder='props.placeholder'
             class='flex-auto py-2 px-3 appearance-none leading-tight outline-none'
             name='search'
             type='text' />
      <XMarkIcon class='size-6 cursor-pointer'
                 @click='emit("close")' />
    </div>

    <!-- Selector -->
    <div class='flex-auto overflow-x-scroll'>
      <slot></slot>
    </div>

  </base-card>
</template>

<style scoped>

</style>
