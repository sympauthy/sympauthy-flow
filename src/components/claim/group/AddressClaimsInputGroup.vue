<script lang="ts" setup>
import type { ClaimInputGroupOptions } from '@/services/ClaimFormService'
import ClaimInputField from '@/components/claim/field/ClaimInputField.vue'
import { OpenIdClaim } from '@/utils/OpenIdClaim'
import { computed } from 'vue'

interface Props {
  options: ClaimInputGroupOptions
  errorMessages?: Record<string, string>
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

const formattedOptions = computed(() => props.options.getClaimOptions(OpenIdClaim.FORMATTED))
const streetAddressOptions = computed(() =>
  props.options.getClaimOptions(OpenIdClaim.STREET_ADDRESS)
)
const localityOptions = computed(() => props.options.getClaimOptions(OpenIdClaim.LOCALITY))
const regionOptions = computed(() => props.options.getClaimOptions(OpenIdClaim.REGION))
const postalCodeOptions = computed(() => props.options.getClaimOptions(OpenIdClaim.POSTAL_CODE))
const countryOptions = computed(() => props.options.getClaimOptions(OpenIdClaim.COUNTRY))

const splitOptions = computed(() => [
  streetAddressOptions.value,
  localityOptions.value,
  regionOptions.value,
  postalCodeOptions.value,
  countryOptions.value
])

/**
 * True if the formatted claim is required.
 */
const isFormattedRequired = computed(() => formattedOptions.value?.claim?.required === true)

/**
 * True if one of the split address claims is collectable.
 */
const isSplitCollectable = computed(() => splitOptions.value.some((it) => it !== undefined))

/**
 * True if one of the split address claims is required.
 */
const isSplitRequired = computed(() =>
  splitOptions.value.some((it) => it?.claim?.required === true)
)

const shouldDisplayFormatted = computed(() => {
  if (formattedOptions.value === undefined) {
    return false
  }
  if (isFormattedRequired.value) {
    return true
  }
  return !isSplitCollectable.value
})

/**
 * Display the split address claims if:
 * - one of them is collectable.
 * - one of them is required.
 * - the formatted address should not be displayed.
 */
const shouldDisplaySplitAddress = computed(() => {
  if (!isSplitCollectable.value) {
    return false
  }
  if (isSplitRequired.value) {
    return true
  }
  return !shouldDisplayFormatted.value
})
</script>

<template>
  <template v-if="shouldDisplayFormatted">
    <claim-input-field
      v-if="formattedOptions"
      :disabled="disabled"
      :error-message="errorMessages?.[OpenIdClaim.FORMATTED]"
      :loading="loading"
      :options="formattedOptions"
      v-bind="$attrs"
    />
  </template>
  <template v-if="shouldDisplaySplitAddress">
    <claim-input-field
      v-if="streetAddressOptions"
      :disabled="disabled"
      :error-message="errorMessages?.[OpenIdClaim.STREET_ADDRESS]"
      :loading="loading"
      :options="streetAddressOptions"
      v-bind="$attrs"
    />
    <div class="md:flex md:flex-row">
      <claim-input-field
        v-if="localityOptions"
        :disabled="disabled"
        :error-message="errorMessages?.[OpenIdClaim.LOCALITY]"
        :loading="loading"
        :options="localityOptions"
        class="md:basis-1/2 md:me-3"
        v-bind="$attrs"
      />
      <claim-input-field
        v-if="regionOptions"
        :disabled="disabled"
        :error-message="errorMessages?.[OpenIdClaim.REGION]"
        :loading="loading"
        :options="regionOptions"
        class="md:basis-1/2"
        v-bind="$attrs"
      />
    </div>
    <div class="md:flex md:flex-row">
      <claim-input-field
        v-if="postalCodeOptions"
        :disabled="disabled"
        :error-message="errorMessages?.[OpenIdClaim.POSTAL_CODE]"
        :loading="loading"
        :options="postalCodeOptions"
        class="md:basis-1/2 md:me-3"
        v-bind="$attrs"
      />
      <claim-input-field
        v-if="countryOptions"
        :disabled="disabled"
        :error-message="errorMessages?.[OpenIdClaim.COUNTRY]"
        :loading="loading"
        :options="countryOptions"
        class="md:basis-1/2"
        v-bind="$attrs"
      />
    </div>
  </template>
</template>

<style scoped></style>
