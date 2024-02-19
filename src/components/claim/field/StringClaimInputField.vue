<script setup lang='ts'>
import type { ClaimInputFieldOptions } from '@/services/ClaimFormService'
import { ErrorMessage, Field } from 'vee-validate'

const props = defineProps<{
  options: ClaimInputFieldOptions
}>()

</script>

<template>
  <div class='form-field'>
    <label :for='props.options.claim.id' class='form-label'>
      {{ props.options.claim.name }}
    </label>
    <Field class='form-control'
           :name='props.options.claim.id' />
    <ErrorMessage class='invalid-feedback'
                  :name='props.options.claim.id' />
  </div>
</template>

<style scoped>

</style>
