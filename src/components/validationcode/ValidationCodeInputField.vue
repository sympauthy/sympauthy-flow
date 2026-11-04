<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue'
import { useField } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { isStringNotEmpty } from '@/utils/StringUtils.ts'

interface Props {
  name: string
  codeLength?: number
  disabled?: boolean
  autofocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  codeLength: 6,
  disabled: false,
  autofocus: false
})

const { t } = useI18n()

const { value, errorMessage, setTouched, setValue } = useField<string>(() => props.name)

onMounted(() => {
  if (props.autofocus) {
    findInputFieldAtIndex(0)?.focus()
  }
})

const inputFieldNames = computed(() => {
  const names: Array<string> = []
  for (let i = 0; i < codeLength.value; i++) {
    names.push(`${i}`)
  }
  return names
})

const inputFieldClasses =
  'flow-code h-16 w-0 min-w-0 flex-auto appearance-none rounded-md border-2 border-gray-400 bg-white text-center text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-50'

const hasErrorMessage = computed(() => {
  return !props.disabled && errorMessage.value !== undefined
})

const codeLength = computed(() => props.codeLength)

const onKeyDown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    // Let Enter propagate to the form for submission
    return
  }

  if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
    // Let Ctrl+V / Cmd+V propagate so the paste event fires
    return
  }

  event.preventDefault()
  event.stopPropagation()

  const targetInputField = event.target
  if (!(targetInputField instanceof HTMLInputElement)) {
    return
  }

  const index = inputFieldNames.value.indexOf(targetInputField.name)
  if (index < 0) {
    return
  }

  if (isAlphaKey(event)) {
    // When user enters a number, override the input if there is already a number
    targetInputField.value = event.key

    // Then select the next field
    selectInputFieldAtIndex(index + 1)
  } else if (event.key == 'Backspace') {
    // Clean the value of the selected field
    targetInputField.value = ''

    // Then select the previous field
    selectInputFieldAtIndex(index - 1)
  } else if (event.key == 'ArrowLeft') {
    selectInputFieldAtIndex(index - 1)
  } else if (event.key == 'ArrowRight') {
    selectInputFieldAtIndex(index + 1)
  }

  updateTouchedAndValue()
}

const isAlphaKey = (event: KeyboardEvent) => {
  if (event.key.length > 1) {
    return false
  }
  const char = event.key.charAt(0)
  return char >= '0' && char <= '9'
}

const selectInputFieldAtIndex = (index: number) => {
  const nextField = findInputFieldAtIndex(index)
  if (nextField !== undefined) {
    nextField.select()
  }
}

const findInputFieldAtIndex = (index: number): HTMLInputElement | undefined => {
  if (index < 0 || index >= inputFieldNames.value.length) {
    return undefined
  }
  const inputFieldName = inputFieldNames.value[index]
  if (inputFieldName === undefined) {
    return undefined
  }
  const elements = document.getElementsByName(inputFieldName)
  if (elements.length > 0 && elements[0] instanceof HTMLInputElement) {
    return elements[0]
  } else {
    return undefined
  }
}

/**
 * Update the value of sub-input fields to match the provided value.
 * @param newValue
 */
const updateAllInputFieldsForValue = (newValue: string | undefined) => {
  if (isStringNotEmpty(newValue)) {
    clearAllInputFields()
    for (let i = 0; i < newValue.length; i++) {
      const input = findInputFieldAtIndex(i)
      if (input instanceof HTMLInputElement) {
        input.value = newValue.charAt(i)
      }
    }
  }
}

/**
 * Clear the value of all sub-input fields.
 */
const clearAllInputFields = () => {
  for (let i = 0; i < codeLength.value; i++) {
    const input = findInputFieldAtIndex(i)
    if (input instanceof HTMLInputElement) {
      input.value = ''
    }
  }
}

const updateTouchedAndValue = () => {
  const newValue = computeValue()
  if (newValue !== value.value) {
    setTouched(true)
    if (newValue !== undefined) {
      // Validate on submission only: a code being typed is not missing, and an error must stay
      setValue(newValue, false)
    }
  }
}

/**
 * Return the current value of the validation code input field
 * if all sub-inputs have been filed by the user.
 * Otherwise, return an empty string.
 */
const computeValue = (): string | undefined => {
  let value = ''
  for (let i = 0; i < codeLength.value; i++) {
    const input = findInputFieldAtIndex(i)
    if (input instanceof HTMLInputElement) {
      value += input.value
    }
  }
  if (value.length != codeLength.value) {
    return ''
  }
  return value
}

const onPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  fillInputFields(event.clipboardData?.getData('text') ?? '')
}

/**
 * Handle what no key press announces: a whole code filled in by the keyboard (one-time-code),
 * or a digit from a virtual keyboard that does not name its keys.
 */
const onInput = (event: Event) => {
  const targetInputField = event.target
  if (!(targetInputField instanceof HTMLInputElement)) {
    return
  }

  const digits = targetInputField.value.replace(/\D/g, '')
  if (digits.length > 1) {
    fillInputFields(digits)
    return
  }

  targetInputField.value = digits
  if (digits.length === 1) {
    selectInputFieldAtIndex(inputFieldNames.value.indexOf(targetInputField.name) + 1)
  }
  updateTouchedAndValue()
}

const fillInputFields = (text: string) => {
  const digits = text.replace(/\D/g, '')
  if (digits.length === 0) {
    return
  }

  clearAllInputFields()
  const length = Math.min(digits.length, codeLength.value)
  for (let i = 0; i < length; i++) {
    const input = findInputFieldAtIndex(i)
    if (input instanceof HTMLInputElement) {
      input.value = digits.charAt(i)
    }
  }
  selectInputFieldAtIndex(Math.min(length, codeLength.value - 1))
  updateTouchedAndValue()
}

watch(value, (newValue: string, oldValue: string) => {
  if (newValue === undefined) {
    // The form was reset. An empty string is different: the code is still being typed.
    clearAllInputFields()
  } else if (newValue !== oldValue) {
    updateAllInputFieldsForValue(newValue)
  }
})
</script>

<template>
  <div class="w-full">
    <div
      :aria-label="t('components.validation_code_input_field.label')"
      class="flex w-full flex-row justify-center gap-2"
      role="group"
      v-on:paste="onPaste"
    >
      <template v-for="(inputFieldName, index) of inputFieldNames" :key="inputFieldName">
        <input
          :aria-label="t('components.validation_code_input_field.digit', [index + 1])"
          :autocomplete="index === 0 ? 'one-time-code' : 'off'"
          :class="[inputFieldClasses, index === Math.floor(codeLength / 2) - 1 ? 'me-2' : '']"
          :disabled="disabled"
          :name="inputFieldName"
          inputmode="numeric"
          type="text"
          v-on:input="onInput"
          v-on:keydown="onKeyDown"
        />
      </template>
    </div>
    <div v-if="hasErrorMessage" class="flow-small w-full pt-1 text-danger">
      {{ errorMessage }}
    </div>
  </div>
</template>
