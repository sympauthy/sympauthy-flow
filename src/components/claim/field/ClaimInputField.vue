<script setup lang="ts">
import type { ClaimInputFieldOptions } from '@/services/ClaimFormService'
import StringClaimInputField from '@/components/claim/field/StringClaimInputField.vue'

const props = defineProps<{
  options: ClaimInputFieldOptions
}>()

const type = props.options.claim.type
</script>

<template>
  <template v-if="type === 'string' || type === 'email'">
    <string-claim-input-field :options="options" />
  </template>
</template>

<style scoped></style>
