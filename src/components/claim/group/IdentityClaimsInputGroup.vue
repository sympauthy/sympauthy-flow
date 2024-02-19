<script setup lang='ts'>
import type { ClaimInputGroupOptions } from '@/services/ClaimFormService'
import ClaimInputField from '@/components/claim/field/ClaimInputField.vue'

const props = defineProps<{
  options: ClaimInputGroupOptions
}>()

const nameOptions = props.options.options.find(it => it.claim.id === 'name')

</script>

<template>
  <claim-input-field v-if='nameOptions' :options='nameOptions' />

</template>

<style scoped>

</style>
