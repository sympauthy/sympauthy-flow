<script lang="ts" setup>
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { SaInput } from '@sympauthy/design'

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
  <div class="flex w-full flex-col gap-3">
    <!-- Search -->
    <div class="flex w-full flex-row items-center gap-3 text-gray-700">
      <sa-input
        v-model="model"
        :icon="MagnifyingGlassIcon"
        :placeholder="props.placeholder"
        class="flex-auto"
        name="search"
        type="text"
      />
      <XMarkIcon class="size-5 cursor-pointer" @click="emit('close')" />
    </div>

    <!-- Selector. Its own scroll keeps the search in sight, and its height keeps it still. -->
    <div class="h-[50vh] overflow-y-auto">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
