<script lang='ts' setup>
import { Field } from 'vee-validate'

interface Props {
  name: string,
  label: string | undefined,
  type: 'text' | 'password',
  errorMessage?: string,
  disabled?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

</script>

<template>
  <div>
    <label v-if='label'
           :for='props.name'
           class='text-gray-700 text-sm font-bold mb-2'>
      {{ label }}
    </label>
    <Field v-slot='{field, errorMessage}' :name='props.name'>
      <input :disabled='props.disabled'
             :type='props.type'
             class='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-1 disabled:outline-none disabled:pointer-events-none disabled:cursor-not-allowed'
             v-bind='field' />
      <span v-if='props.errorMessage ?? errorMessage'
            class='text-sm'
            style='color: var(--color-danger)'>
        {{ props.errorMessage ?? errorMessage }}
      </span>
    </Field>
  </div>
</template>

<style scoped>

</style>
