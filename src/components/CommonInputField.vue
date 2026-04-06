<script lang='ts' setup>
import { Field } from 'vee-validate'

interface Props {
  name: string
  label: string | undefined
  type: 'text' | 'password' | 'date' | 'tel'
  autocomplete?: string
  errorMessage?: string
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false
})

const inputClasses = 'shadow-sm appearance-none border rounded-sm w-full h-11 py-2 px-3 text-gray-700 leading-tight focus:outline-1 disabled:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed'

</script>

<template>
  <div>
    <label v-if='label'
           :for='name'
           class='text-gray-700 text-sm font-bold mb-2'>
      {{ label }}
    </label>
    <Field v-slot='{field, errorMessage}' :name='name'>
      <template v-if='!loading'>
        <input :autocomplete='autocomplete'
               :class='inputClasses'
               :disabled='disabled'
               :type='type'
               v-bind='field' />
      </template>
      <template v-else>
        <div :class='inputClasses' class='flex flex-col justify-center'>
          <div class='animate-pulse max-w-[40%] h-4 bg-slate-300 rounded-sm cursor-progress'></div>
        </div>
      </template>

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
