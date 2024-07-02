<script lang='ts' setup>
import type { ClaimInputGroupOptions } from '@/services/ClaimFormService'
import ClaimInputField from '@/components/claim/field/ClaimInputField.vue'
import { OpenIdClaim } from '@/utils/OpenIdClaim'
import { computed } from 'vue'

interface Props {
  options: ClaimInputGroupOptions,
  errorMessages?: Record<string, string>,
  disabled?: boolean
  loading?: boolean
}

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false
})

const nameOptions = computed(() => props.options.getClaimOptions(OpenIdClaim.NAME))
const givenNameOptions = computed(() => props.options.getClaimOptions(OpenIdClaim.GIVEN_NAME))
const middleNameOptions = computed(() => props.options.getClaimOptions(OpenIdClaim.MIDDLE_NAME))
const familyNameOptions = computed(() => props.options.getClaimOptions(OpenIdClaim.FAMILY_NAME))
const splitOptions = computed(() => [givenNameOptions.value, middleNameOptions.value, familyNameOptions.value])

/**
 * True if the name claim is required.
 */
const isNameRequired = computed(() => nameOptions.value?.claim?.required === true)

/**
 * True if one of given_name, middle_name and family_name claims is collectable.
 */
const isSplitCollectable = computed(() => splitOptions.value.some(it => it !== undefined))

/**
 * True if one of given_name, middle_name and family_name claims is required.
 */
const isSplitRequired = computed(() => splitOptions.value.some(it => it?.claim?.required === true))


const shouldDisplayName = computed(() => {
  if (nameOptions.value === undefined) {
    return false
  }
  if (isNameRequired.value) {
    return true
  }
  return !isSplitCollectable.value
})

/**
 * Display the given_name, middle_name and family_name claims if:
 * - one of them is collectable.
 * - one of them is required.
 * - the name should not be displayed.
 */
const shouldDisplaySplitName = computed(() => {
  if (!isSplitCollectable.value) {
    return false
  }
  if (isSplitRequired.value) {
    return true
  }
  return !shouldDisplayName.value
})

</script>

<template>
  <template v-if='shouldDisplayName'>
    <claim-input-field v-if='nameOptions'
                       :disabled='disabled'
                       :error-message='errorMessages?.[OpenIdClaim.NAME]'
                       :loading='loading'
                       :options='nameOptions'
                       v-bind='$attrs' />
  </template>
  <div v-if='shouldDisplaySplitName' class='md:flex md:flex-row'>
    <claim-input-field v-if='givenNameOptions'
                       :disabled='disabled'
                       :error-message='errorMessages?.[OpenIdClaim.GIVEN_NAME]'
                       :loading='loading'
                       :options='givenNameOptions'
                       class='md:me-3'
                       v-bind='$attrs' />
    <claim-input-field v-if='middleNameOptions'
                       :disabled='disabled'
                       :error-message='errorMessages?.[OpenIdClaim.MIDDLE_NAME]'
                       :loading='loading'
                       :options='middleNameOptions'
                       class='md:me-3'
                       v-bind='$attrs' />
    <claim-input-field v-if='familyNameOptions'
                       :disabled='disabled'
                       :error-message='errorMessages?.[OpenIdClaim.FAMILY_NAME]'
                       :loading='loading'
                       :options='familyNameOptions'
                       v-bind='$attrs' />
  </div>
</template>

<style scoped></style>
