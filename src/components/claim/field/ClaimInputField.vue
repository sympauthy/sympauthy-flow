<script setup lang='ts'>
import type { ClaimInputFieldOptions } from '@/services/ClaimFormService'
import StringClaimInputField from '@/components/claim/field/StringClaimInputField.vue'

interface Props {
  options: ClaimInputFieldOptions
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const type = props.options.claim.type
</script>

<template>
  <template v-if="type === 'string' || type === 'email'">
    <string-claim-input-field :options='options' :disabled='disabled' />
  </template>
</template>

<style scoped></style>
