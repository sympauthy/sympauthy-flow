<script lang='ts' setup>

import type { ValidationCodeResource } from '@/client/model/ValidationCodeResource'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { getErrorMessageOrThrow } from '@/exception/ApiException'

interface Props {
  code: ValidationCodeResource | undefined,
  loading: boolean | undefined
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const { t } = useI18n()

const isValidating = ref(false)
const validationErrorMessage = ref<string | undefined>()

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

const mediaName = computed(() => {
  return t(`media.${props.code?.media}`)
})

const codeLength = computed(() => {
  return 6
})

const validateCode = async () => {
  if (!isValidating.value) {
    return
  }
  isValidating.value = true
  validationErrorMessage.value = undefined

  try {

  } catch (e) {
    validationErrorMessage.value = getErrorMessageOrThrow(e)
  } finally {
    isValidating.value = false
  }

  if (validationErrorMessage.value !== undefined) {
    findInputFieldAtIndex(0)?.select()
  }
}

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
    await validateCode()
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

</script>

<template>
  <div class='w-full px-5'>
    <div class='w-full text-justify'>
      <p>{{ t('components.validation_code_field.description', [mediaName]) }}</p>
    </div>

    <div class='w-full text-3xl py-3 flex flex-row justify-center'>
      <template v-for='inputFieldName of inputFieldNames' :key='inputFieldName'>
        <input :disabled='isValidating'
               :name='inputFieldName'
               autocomplete='off'
               class='w-0 flex-auto text-center p-1 md:p-3 mx-1 border-2 rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2'
               maxlength='1'
               type='text'
               v-on:keyup='onKeyUp'>
      </template>
    </div>

    <div class='w-full text-sm text-end'>
      <a>{{ t('components.validation_code_field.resend.description') }}</a>
    </div>
  </div>
</template>

<style scoped>

</style>
