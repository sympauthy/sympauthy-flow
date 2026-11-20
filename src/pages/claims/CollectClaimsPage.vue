<script lang="ts" setup>
import BasePage from '@/components/BasePage.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { injectRequired, redirectOrPush, useSubmission } from '@/utils/VueUtils'
import { claimFormServiceKey } from '@/services/ClaimFormService'
import { object } from 'yup'
import { useForm } from 'vee-validate'
import ClaimsInputGroup from '@/components/claim/group/ClaimsInputGroup.vue'
import { computed, onMounted, ref } from 'vue'
import { getErrorMessage, getErrorMessageForProperties } from '@/client/ErrorApiResponse'
import { claimApiKey } from '@/client/api/ClaimApi'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { SaAlert, SaButton } from '@sympauthy/design'
import type { ClaimConfiguration } from '@/client/model/ClaimConfiguration'
import type { ClientReferenceResource } from '@/client/model/ClientReferenceResource'

const { t } = useI18n()
const router = useRouter()
const claimApi = injectRequired(claimApiKey)
const claimFormService = injectRequired(claimFormServiceKey)

const isLoadingClaims = ref<boolean>(false)

const fetchErrorMessage = ref<string | undefined>(undefined)
const submitErrorMessage = ref<string | undefined>(undefined)
const fieldErrorMessages = ref<Record<string, string> | undefined>(undefined)

const claimConfigs = ref<Array<ClaimConfiguration>>([])
const client = ref<ClientReferenceResource>()
const cancelUrl = ref<string>()

const validationSchema = computed(() => {
  return object({
    ...claimFormService.getSchemasForClaimConfigs(claimConfigs.value)
  })
})

const { setValues, handleSubmit, isSubmitting } = useForm({
  validationSchema
})
const { busy, moveOn } = useSubmission(router, isSubmitting)

const loadClaims = async () => {
  if (isLoadingClaims.value) return
  isLoadingClaims.value = true

  fetchErrorMessage.value = undefined

  const response = await claimApi.fetchClaims()
  if (response instanceof SuccessApiResponse) {
    if (response.content.claims !== undefined) {
      const claims = response.content.claims
      claimConfigs.value = claims
      client.value = response.content.client
      cancelUrl.value = response.content.cancel_url

      const initialValues: Record<string, string | undefined> = {}
      for (const claim of claims) {
        if (claim.collected && claim.value !== undefined) {
          initialValues[claim.id] = claim.value
        } else if (claim.suggested_value !== undefined) {
          initialValues[claim.id] = claim.suggested_value
        }
      }
      setValues(initialValues)
    } else if (response.content.redirect_url !== undefined) {
      await redirectOrPush(router, response.content.redirect_url)
    }
  } else {
    fetchErrorMessage.value = getErrorMessage(response)
  }

  isLoadingClaims.value = false
}

const onSubmit = handleSubmit(async (values: any) => {
  submitErrorMessage.value = undefined
  fieldErrorMessages.value = undefined

  const response = await claimApi.collectClaims(values)
  if (response instanceof SuccessApiResponse) {
    await moveOn(response.content.redirect_url)
  } else {
    fieldErrorMessages.value = getErrorMessageForProperties(response)
    submitErrorMessage.value = getErrorMessage(response)
  }
})

onMounted(async () => {
  await loadClaims()
})
</script>

<template>
  <base-page :cancel-disabled="busy" :cancel-url="cancelUrl" :client="client">
    <div class="flex justify-center w-full">
      <title-content-card size="large" :loading="isLoadingClaims" :error="fetchErrorMessage">
        <template v-slot:title>
          {{ t('pages.collect_claims.title') }}
        </template>

        <sa-alert v-if="submitErrorMessage">
          {{ submitErrorMessage }}
        </sa-alert>

        <form class="flex flex-col gap-4" @submit="onSubmit">
          <claims-input-group
            :claims="claimConfigs"
            :disabled="busy"
            :error-messages="fieldErrorMessages"
          />

          <sa-button :loading="busy" size="large" type="submit">
            <template v-slot:default>
              {{ t('common.continue') }}
            </template>
            <template v-slot:loading>
              {{ t('pages.collect_claims.updating') }}
            </template>
          </sa-button>
        </form>
      </title-content-card>
    </div>
  </base-page>
</template>
