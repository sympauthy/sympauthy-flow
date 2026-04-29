<script lang="ts" setup>
import BasePage from '@/components/BasePage.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { claimFormServiceKey } from '@/services/ClaimFormService'
import { object } from 'yup'
import { useForm } from 'vee-validate'
import ClaimsInputGroup from '@/components/claim/group/ClaimsInputGroup.vue'
import { computed, onMounted, ref } from 'vue'
import { getErrorMessage, getErrorMessageForProperties } from '@/client/ErrorApiResponse'
import { claimApiKey } from '@/client/api/ClaimApi'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import CommonButton from '@/components/CommonButton.vue'
import CommonAlert from '@/components/CommonAlert.vue'
import { primaryColoredButton } from '@/styles/ButtonStyle'
import type { ClaimConfiguration } from '@/client/model/ClaimConfiguration'

const { t } = useI18n()
const router = useRouter()
const claimApi = injectRequired(claimApiKey)
const claimFormService = injectRequired(claimFormServiceKey)

const isLoadingClaims = ref<boolean>(false)

const fetchErrorMessage = ref<string | undefined>(undefined)
const submitErrorMessage = ref<string | undefined>(undefined)
const fieldErrorMessages = ref<Record<string, string> | undefined>(undefined)

const claimConfigs = ref<Array<ClaimConfiguration>>([])

const validationSchema = computed(() => {
  return object({
    ...claimFormService.getSchemasForClaimConfigs(claimConfigs.value)
  })
})

const { setValues, handleSubmit, isSubmitting } = useForm({
  validationSchema
})

const loadClaims = async () => {
  if (isLoadingClaims.value) return
  isLoadingClaims.value = true

  fetchErrorMessage.value = undefined

  const response = await claimApi.fetchClaims()
  if (response instanceof SuccessApiResponse) {
    if (response.content.claims !== undefined) {
      const claims = response.content.claims
      claimConfigs.value = claims

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
    await redirectOrPush(router, response.content.redirect_url)
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
  <base-page>
    <div class="flex justify-center w-full">
      <title-content-card size="large" :loading="isLoadingClaims" :error="fetchErrorMessage">
        <template v-slot:title>
          {{ t('pages.collect_claims.title') }}
        </template>

        <common-alert v-if="submitErrorMessage" class="mb-3">
          {{ submitErrorMessage }}
        </common-alert>

        <form @submit="onSubmit">
          <claims-input-group
            :claims="claimConfigs"
            :disabled="isSubmitting"
            :error-messages="fieldErrorMessages"
            class="mb-3"
          />

          <common-button
            :buttonStyle="primaryColoredButton"
            :loading="isSubmitting"
            class="w-full mt-5"
            type="submit"
          >
            <template v-slot:default>
              {{ t('common.continue') }}
            </template>
            <template v-slot:loading>
              {{ t('pages.collect_claims.updating') }}
            </template>
          </common-button>
        </form>
      </title-content-card>
    </div>
  </base-page>
</template>
