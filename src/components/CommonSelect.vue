<script lang='ts' setup>
import { useField } from 'vee-validate'
import { ref, toRef } from 'vue'
import CommonModal from '@/components/CommonModal.vue'

interface Props {
  name: string,
  label?: string,
  value?: string,
  errorMessage?: string,
  disabled?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

// use `toRef` to create reactive references to `name` prop which is passed to `useField`
// this is important because vee-validte needs to know if the field name changes
// https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
const name = toRef(props, 'name')

// we don't provide any rules here because we are using form-level validation
// https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta
} = useField(name, undefined, {
  initialValue: props.value
})

const modal = ref<InstanceType<typeof CommonModal> | undefined>(undefined)

const openModal = () => {
  modal.value?.openModal()
}

const select = (value: string) => {
  handleChange(value)
  modal.value?.closeModal()
}

const cancel = () => {
  modal.value?.closeModal()
}

</script>

<template>
  <label
    v-if='label'
    :for='props.name'
    class='text-gray-700 text-sm font-bold mb-2'>
    {{ label }}
  </label>
  <input :value='inputValue'
         class='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none'
         type='text'
         v-on:click='openModal' />
  <span v-if='props.errorMessage ?? errorMessage'
        class='text-sm'
        style='color: var(--color-danger)'>
      {{ props.errorMessage ?? errorMessage }}
  </span>

  <common-modal ref='modal'>
    <slot :cancel='cancel'
          :select='select'></slot>
  </common-modal>
</template>

<style scoped>

</style>
