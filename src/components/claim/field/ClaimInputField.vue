<script lang='ts' setup>
import type { ClaimInputFieldOptions } from '@/services/ClaimFormService'
import StringClaimInputField from '@/components/claim/field/StringClaimInputField.vue'
import TimeZoneClaimInputField from '@/components/claim/field/TimeZoneClaimInputField.vue'
import DateClaimInputField from '@/components/claim/field/DateClaimInputField.vue'

interface Props {
  options: ClaimInputFieldOptions,
  errorMessage?: string,
  disabled?: boolean,
  loading?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false
})

const type = props.options.claim.type
</script>

<template>
  <template v-if="type === 'string' || type === 'email'">
    <string-claim-input-field :disabled='disabled'
                              :error-message='errorMessage'
                              :loading='loading'
                              :options='options'
                              v-bind='$attrs' />
  </template>
  <template v-if="type === 'timezone'">
    <time-zone-claim-input-field :disabled='disabled'
                                 :error-message='errorMessage'
                                 :loading='loading'
                                 :options='options'
                                 v-bind='$attrs' />
  </template>
  <template v-if="type === 'date'">
    <date-claim-input-field :disabled='disabled'
                            :error-message='errorMessage'
                            :loading='loading'
                            :options='options'
                            v-bind='$attrs' />
  </template>
</template>

<style scoped></style>
