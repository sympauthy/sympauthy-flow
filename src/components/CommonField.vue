<script setup lang='ts'>
import { Field } from 'vee-validate'

interface Props {
  name: string,
  label: string | undefined,
  type: 'text' | 'password',
  disabled?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

</script>

<template>
  <div>
    <label
      v-if='label'
      :for='props.name'
      class='text-gray-700 text-sm font-bold mb-2'>
      {{ label }}
    </label>
    <Field :name='props.name' v-slot='{field, errorMessage}'>
      <input v-bind='field'
             :type='props.type'
             :disabled='props.disabled'
             class='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none' />
      <span v-if='errorMessage'
            style='color: var(--color-danger)'
            class='text-sm'>
        {{ errorMessage }}
      </span>
    </Field>
  </div>
</template>

<style scoped>

</style>
