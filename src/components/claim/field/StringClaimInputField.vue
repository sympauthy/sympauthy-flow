<script setup lang='ts'>
import type { ClaimInputFieldOptions } from '@/services/ClaimFormService'
import CommonField from '@/components/CommonField.vue'

const props = defineProps<{
  options: ClaimInputFieldOptions
}>()
</script>

<template>
  <common-field :name='props.options.claim.id'
                :label='props.options.claim.name'
                type='input' />
</template>

<style scoped></style>
