<script setup lang='ts'>
import type { ClaimInputFieldOptions } from '@/services/ClaimFormService'
import CommonField from '@/components/CommonField.vue'

interface Props {
  options: ClaimInputFieldOptions
  errorMessage?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})
</script>

<template>
  <common-field :name='props.options.claim.id'
                :label='props.options.claim.name'
                :disabled='props.disabled'
                :error-message='errorMessage'
                type='text' />
</template>

<style scoped></style>
