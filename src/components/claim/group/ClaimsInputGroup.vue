<script lang='ts' setup>
import { ClaimFormService, ClaimInputFieldOptions, ClaimInputGroupOptions } from '@/services/ClaimFormService'
import { injectRequired } from '@/utils/VueUtils'
import { configurationKey } from '@/utils/ConfigurationUtils'
import IdentityClaimsInputGroup from '@/components/claim/group/IdentityClaimsInputGroup.vue'
import ClaimInputField from '@/components/claim/field/ClaimInputField.vue'

interface Props {
  claims: Array<string>
  errorMessages?: Record<string, string>
  disabled?: boolean
}

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const configuration = injectRequired(configurationKey)
const claimFormService = new ClaimFormService()

const optionsArray = claimFormService.getOptionsForClaims(configuration, props.claims)
</script>

<template>
  <template v-for='options of optionsArray' :key='options.getId()'>
    <template v-if='options instanceof ClaimInputFieldOptions'>
      <claim-input-field :disabled='disabled'
                         :error-message='errorMessages?.[options.claim.id]'
                         :options='options'
                         v-bind='$attrs' />
    </template>
    <template v-if="options instanceof ClaimInputGroupOptions && options.group === 'identity'">
      <identity-claims-input-group :disabled='disabled'
                                   :error-messages='errorMessages'
                                   :options='options'
                                   v-bind='$attrs' />
    </template>
  </template>
</template>
