<script lang='ts' setup>

import type { ValidationCodeResource } from '@/client/model/ValidationCodeResource'
import { computed } from 'vue'
import { useField } from 'vee-validate'

interface Props {
  name: string,
  code: ValidationCodeResource | undefined,
  loading: boolean | undefined
  disabled: boolean | undefined
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false
})

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

const codeLength = computed(() => {
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

</script>

<template>
  <div class='w-full'>
    <div class='w-full text-3xl flex flex-row justify-center'>
      <template v-for='inputFieldName of inputFieldNames' :key='inputFieldName'>
        <input :disabled='disabled'
               :name='inputFieldName'
               autocomplete='off'
               class='w-0 flex-auto text-center p-1 md:p-3 mx-1 border-2 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2'
               :class="{'border-danger': errorMessage!== undefined, 'border-gray-300': errorMessage === undefined}"
               maxlength='1'
               type='text'
               v-on:keyup='onKeyUp'>
      </template>
    </div>
    <div v-if='errorMessage' class='w-full pt-1 text-sm text-danger'>
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>

</style>
