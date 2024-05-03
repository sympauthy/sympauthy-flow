<script setup lang='ts'>
import type { ClaimInputFieldOptions } from '@/services/ClaimFormService'
import CommonField from '@/components/CommonField.vue'

interface Props {
  options: ClaimInputFieldOptions
  disabled: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})
</script>

<template>
  <common-field :name='props.options.claim.id'
                :label='props.options.claim.name'
                :disabled='props.disabled'
                type='input' />
</template>

<style scoped></style>
