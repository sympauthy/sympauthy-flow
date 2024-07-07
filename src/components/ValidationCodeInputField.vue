<script lang='ts' setup>

import type { ValidationCodeResource } from '@/client/model/ValidationCodeResource'
import { computed, watch } from 'vue'
import { useField } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { isNotEmpty } from '@/utils/StringUtils'
import CommonSpinner from '@/components/CommonSpinner.vue'

interface Props {
  name: string,
  code?: ValidationCodeResource,
  loading?: boolean,
  loadingCodeLength?: number,
  submitting?: boolean,
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  submitting: false,
  disabled: false,
  loadingCodeLength: 6
})

const { t } = useI18n()
const { value, errorMessage, setTouched } = useField<string>(() => props.name)

const inputFieldNames = computed(() => {
  if (props.code) {
    const names: Array<string> = []
    for (let i = 0; i < codeLength.value; i++) {
      names.push(`${i}`)
    }
    return names
  } else {
    return []
  }
})

const inputFieldClasses = computed(() => {
  let classes = 'w-0 h-[64px] p-1 md:p-3 mx-1 appearance-none rounded flex-auto text-center border-2 text-gray-700 border-gray-300 focus:outline-1 disabled:outline-none disabled:pointer-events-none disabled:cursor-not-allowed'
  if (hasErrorMessage.value) {
    classes += ' border-[color:var(--color-danger)]'
  }
  return classes
})

const hasErrorMessage = computed(() => {
  return !props.disabled && !props.loading && !props.submitting && errorMessage.value !== undefined
})

const codeLength = computed(() => {
  if (props.loading) {
    return props.loadingCodeLength ?? 6
  }
  return 6 // FIXME Get code length from API.
})

const onKeyUp = async (event: KeyboardEvent) => {
  event.stopPropagation()

  const targetInputField = event.target
  if (!isAlphaKey(event) || !(targetInputField instanceof HTMLInputElement)) {
    return
  }

  const index = inputFieldNames.value.indexOf(targetInputField.name)
  if (index < 0) {
    return
  }

  const nextField = findInputFieldAtIndex(index + 1)
  if (nextField !== undefined) {
    nextField.select()
  } else {
    setTouched(true)
    value.value = computeValue()
  }
}

const findInputFieldAtIndex = (index: number): HTMLInputElement | undefined => {
  if (index < 0 || index >= inputFieldNames.value.length) {
    return undefined
  }
  const elements = document.getElementsByName(inputFieldNames.value[index])
  if (elements.length > 0 && elements[0] instanceof HTMLInputElement) {
    return elements[0]
  } else {
    return undefined
  }
}

const isAlphaKey = (event: KeyboardEvent) => {
  if (event.key.length > 1) {
    return false
  }
  const char = event.key.charAt(0)
  return char >= '0' || char <= '9'
}

const setValue = (newValue: string | undefined) => {
  clearValue()
  if (isNotEmpty(newValue)) {
    for (let i = 0; i < newValue.length; i++) {
      const input = findInputFieldAtIndex(i)
      if (input instanceof HTMLInputElement) {
        input.value = newValue.charAt(i)
      }
    }
  }
}

const clearValue = () => {
  for (let i = 0; i < codeLength.value; i++) {
    const input = findInputFieldAtIndex(i)
    if (input instanceof HTMLInputElement) {
      input.value = ''
    }
  }
}

const computeValue = (): string => {
  let value = ''
  for (let i = 0; i < codeLength.value; i++) {
    const input = findInputFieldAtIndex(i)
    if (input instanceof HTMLInputElement) {
      value += input.value
    }
  }
  return value
}

watch(value, (newValue: string, oldValue: string) => {
  console.log(`watch ${newValue} ${oldValue}`)
  if (newValue !== oldValue) {
    setValue(newValue)
  }
})

</script>

<template>
  <div class='w-full'>
    <div class='w-full text-3xl flex flex-row justify-center'>
      <template v-for='inputFieldName of inputFieldNames' :key='inputFieldName'>
        <input v-if='!loading'
               :class='inputFieldClasses'
               :disabled='loading || submitting || disabled'
               :name='inputFieldName'
               autocomplete='off'
               maxlength='1'
               type='text'
               v-on:keyup='onKeyUp'>
        <div v-else :class='inputFieldClasses' class='flex flex-col justify-center'>
          <div class='animate-pulse h-4 bg-slate-200 rounded cursor-progress'></div>
        </div>
      </template>
    </div>
    <div v-if='submitting' class='w-full flex flex-row items-baseline pt-1 text-sm text-[color:var(--color-disabled)]'>
      <common-spinner class='h-2 w-2 border-2' />
      <span class='ms-1'>{{ t('components.validation_code_input_field.submitting') }}</span>
    </div>
    <div v-if='hasErrorMessage'
         class='w-full pt-1 text-sm text-[color:var(--color-danger)]'>
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>

</style>
