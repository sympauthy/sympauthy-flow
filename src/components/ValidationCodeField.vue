<script lang='ts' setup>

import type { ValidationCodeResource } from '@/client/model/ValidationCodeResource'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

interface Props {
  code: ValidationCodeResource | undefined,
  loading: boolean | undefined
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const { t } = useI18n()

const inputFieldNames = computed(() => {
  if (props.code) {
    const codeLength = 6 // FIXME Get code lenght from server.
    const names: Array<string> = []
    for (let i = 0; i < codeLength; i++) {
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

const findNextInputField = (inputFieldName: string) => {
  const index = inputFieldNames.value.indexOf(inputFieldName)
  console.log(`${index}`)
  if (index < 0 || index >= inputFieldNames.value.length - 1) {
    return undefined
  }
  return document.getElementsByName(inputFieldNames.value[index + 1])[0]
}

const isAlphaKey = (event: KeyboardEvent) => {
  if (event.key.length > 1) {
    return false
  }
  const char = event.key.charAt(0)
  return char >= '0' || char <= '9'
}

const onKeyUp = async (event: KeyboardEvent) => {
  event.stopPropagation()

  const targetInputField = event.target
  if (!isAlphaKey(event) || !(targetInputField instanceof HTMLInputElement)) {
    return
  }

  const nextField = findNextInputField(targetInputField.name)
  console.log(`${nextField?.name}`)
  if (nextField !== undefined) {
    nextField.focus()
  } else {
    // FIXME
  }
}

</script>

<template>
  <div class='w-full px-5'>
    <div class='w-full text-justify'>
      <p>{{ t('components.validation_code_field.description', [mediaName]) }}</p>
    </div>

    <div class='w-full text-3xl py-3 flex flex-row justify-center'>
      <template v-for='inputFieldName of inputFieldNames' :key='inputFieldName'>
        <input :name='inputFieldName'
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
