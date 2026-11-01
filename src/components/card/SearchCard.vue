<script lang="ts" setup>
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { CommonCard } from '@sympauthy/design'

interface Props {
  placeholder?: string
}

const props = defineProps<Props>()
const model = defineModel<string>()

const emit = defineEmits<{
  select: [item: any]
  close: []
}>()
</script>

<template>
  <common-card class="flex w-full max-w-card flex-col" :padded="false">
    <!-- Search -->
    <div class="flex w-full flex-row items-center border-b border-gray-200 p-3 text-gray-700">
      <MagnifyingGlassIcon class="size-5" />
      <input
        v-model="model"
        :placeholder="props.placeholder"
        class="flex-auto appearance-none bg-transparent px-3 py-2 text-base leading-tight text-gray-900 outline-hidden placeholder:text-gray-500"
        name="search"
        type="text"
      />
      <XMarkIcon class="size-5 cursor-pointer" @click="emit('close')" />
    </div>

    <!-- Selector -->
    <div class="flex-auto overflow-x-scroll">
      <slot></slot>
    </div>
  </common-card>
</template>

<style scoped></style>
