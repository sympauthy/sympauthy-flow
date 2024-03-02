<script setup lang="ts">
import type { CollectedClaimConfigurationResource } from '@/client/model/config/CollectedClaimConfigurationResource'
import {
  ClaimFormService,
  ClaimInputFieldOptions,
  ClaimInputGroupOptions
} from '@/services/ClaimFormService'
import { injectRequired } from '@/utils/VueUtils'
import { configurationKey } from '@/utils/ConfigurationUtils'
import IdentityClaimsInputGroup from '@/components/claim/group/IdentityClaimsInputGroup.vue'
import ClaimInputField from '@/components/claim/field/ClaimInputField.vue'

const props = defineProps<{
  configs: Array<CollectedClaimConfigurationResource>
}>()

const configuration = injectRequired(configurationKey)
const claimFormService = new ClaimFormService()

const optionsArray = claimFormService.getOptionsForClaims(configuration, props.configs)
</script>

<template>
  <template v-for="options of optionsArray" :key="options.claim.id">
    <template v-if="options instanceof ClaimInputFieldOptions">
      <claim-input-field :options="options" />
    </template>
    <template v-if="options instanceof ClaimInputGroupOptions && options.group === 'identity'">
      <identity-claims-input-group :options="options" />
    </template>
  </template>
</template>
