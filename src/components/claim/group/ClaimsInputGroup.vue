<script lang="ts" setup>
import {
  ClaimFormService,
  ClaimInputFieldOptions,
  ClaimInputGroupOptions
} from '@/services/ClaimFormService'
import IdentityClaimsInputGroup from '@/components/claim/group/IdentityClaimsInputGroup.vue'
import AddressClaimsInputGroup from '@/components/claim/group/AddressClaimsInputGroup.vue'
import ClaimInputField from '@/components/claim/field/ClaimInputField.vue'
import type { ClaimConfiguration } from '@/client/model/ClaimConfiguration'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()

const claimFormService = new ClaimFormService()

const optionsArray = claimFormService.getOptionsForClaimConfigs(props.claims)
</script>

<template>
  <template v-for="options of optionsArray" :key="options.getId()">
    <template v-if="options instanceof ClaimInputFieldOptions">
      <claim-input-field
        :disabled="disabled"
        :error-message="errorMessages?.[options.claim.id]"
        :loading="loading"
        :options="options"
        v-bind="$attrs"
      />
    </template>
    <fieldset v-if="options instanceof ClaimInputGroupOptions" class="min-w-0">
      <legend class="flow-label mb-2 text-gray-900">
        {{ t(`components.claims_input_group.${options.group}`) }}
      </legend>
      <div class="flex flex-col gap-4">
        <identity-claims-input-group
          v-if="options.group === 'identity'"
          :disabled="disabled"
          :error-messages="errorMessages"
          :loading="loading"
          :options="options"
          v-bind="$attrs"
        />
        <address-claims-input-group
          v-if="options.group === 'address'"
          :disabled="disabled"
          :error-messages="errorMessages"
          :loading="loading"
          :options="options"
          v-bind="$attrs"
        />
      </div>
    </fieldset>
  </template>
</template>
