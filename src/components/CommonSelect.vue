<script lang='ts' setup>
import { Field } from 'vee-validate'
import { ref } from 'vue'
import CommonModal from '@/components/CommonModal.vue'

interface Props {
  name: string,
  label: string | undefined,
  errorMessage?: string,
  disabled?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const open = ref(false)

const openOrCloseModal = () => {
  open.value = !open.value
}

</script>

<template>
  <label
    v-if='label'
    :for='props.name'
    class='text-gray-700 text-sm font-bold mb-2'>
    {{ label }}
  </label>
  <Field v-slot='{field, errorMessage}' :name='props.name'>
    <div class='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none'
         v-on:click='openOrCloseModal'>
      {{ field.value }}
    </div>
    <span v-if='props.errorMessage ?? errorMessage'
          class='text-sm'
          style='color: var(--color-danger)'>
        {{ props.errorMessage ?? errorMessage }}
    </span>

    <common-modal :open='open'>
      <slot></slot>
    </common-modal>
  </Field>
</template>

<style scoped>

</style>
