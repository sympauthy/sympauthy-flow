<script lang='ts' setup>
import type { ClaimInputFieldOptions } from '@/services/ClaimFormService'
import CommonField from '@/components/CommonInputField.vue'

interface Props {
  options: ClaimInputFieldOptions
  errorMessage?: string
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false
})
</script>

<template>
  <common-field :disabled='disabled'
                :error-message='errorMessage'
                :label='options.claim.name'
                :loading='loading'
                :name='options.claim.id'
                type='text' />
</template>

<style scoped></style>
