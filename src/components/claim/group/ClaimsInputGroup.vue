<script lang='ts' setup>
import { ClaimFormService, ClaimInputFieldOptions, ClaimInputGroupOptions } from '@/services/ClaimFormService'
import IdentityClaimsInputGroup from '@/components/claim/group/IdentityClaimsInputGroup.vue'
import AddressClaimsInputGroup from '@/components/claim/group/AddressClaimsInputGroup.vue'
import ClaimInputField from '@/components/claim/field/ClaimInputField.vue'
import type { ClaimConfiguration } from '@/client/model/ClaimConfiguration'

interface Props {
  claims: Array<ClaimConfiguration>
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

const claimFormService = new ClaimFormService()

const optionsArray = claimFormService.getOptionsForClaimConfigs(props.claims)
</script>

<template>
  <template v-for='options of optionsArray' :key='options.getId()'>
    <template v-if='options instanceof ClaimInputFieldOptions'>
      <claim-input-field :disabled='disabled'
                         :error-message='errorMessages?.[options.claim.id]'
                         :loading='loading'
                         :options='options'
                         v-bind='$attrs' />
    </template>
    <template v-if="options instanceof ClaimInputGroupOptions && options.group === 'identity'">
      <identity-claims-input-group :disabled='disabled'
                                   :error-messages='errorMessages'
                                   :loading='loading'
                                   :options='options'
                                   v-bind='$attrs' />
    </template>
    <template v-if="options instanceof ClaimInputGroupOptions && options.group === 'address'">
      <address-claims-input-group :disabled='disabled'
                                  :error-messages='errorMessages'
                                  :loading='loading'
                                  :options='options'
                                  v-bind='$attrs' />
    </template>
  </template>
</template>
