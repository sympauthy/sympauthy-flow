<script lang='ts' setup>
import BasePage from '@/components/BasePage.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { claimFormServiceKey } from '@/services/ClaimFormService'
import { configurationKey } from '@/utils/ConfigurationUtils'
import { object } from 'yup'
import { useForm } from 'vee-validate'
import ClaimsInputGroup from '@/components/claim/group/ClaimsInputGroup.vue'
import { claimServiceKey } from '@/services/ClaimsService'
import { onMounted, ref } from 'vue'
import { getErrorMessage, getErrorMessageForProperties } from '@/client/ErrorApiResponse'
import { claimApiKey } from '@/client/api/ClaimApi'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import CommonButton from '@/components/CommonButton.vue'
import { primaryColoredButton } from '@/styles/ButtonStyle'

const { t } = useI18n()
const router = useRouter()
const claimApi = injectRequired(claimApiKey)
const claimService = injectRequired(claimServiceKey)
const claimFormService = injectRequired(claimFormServiceKey)
const configuration = injectRequired(configurationKey)

const isLoadingClaims = ref<boolean>(false)

const errorMessage = ref<string | undefined>(undefined)
const fieldErrorMessages = ref<Record<string, string> | undefined>(undefined)

const collectableClaims = claimService.getCollectableClaims(configuration)
const claimSchemas = claimFormService.getSchemasForClaims(configuration, collectableClaims)
const validationSchema = object({
  ...claimSchemas
})

const { setFieldValue, handleSubmit, isSubmitting } = useForm({
  validationSchema: validationSchema
})

const loadClaims = async () => {
  if (isLoadingClaims.value) return
  isLoadingClaims.value = true

  errorMessage.value = undefined
  fieldErrorMessages.value = undefined

  const response = await claimApi.fetchClaims()
  if (response instanceof SuccessApiResponse) {
    if (response.content.claims !== undefined) {
      response.content.claims
        .filter((it) => it.collected)
        .forEach((it) => setFieldValue(it.claim, it.value))
    } else if (response.content.redirect_url !== undefined) {
      await redirectOrPush(router, response.content.redirect_url)
    }
  } else {
    errorMessage.value = getErrorMessage(response)
  }

  isLoadingClaims.value = false
}

const onSubmit = handleSubmit(async (values: any) => {
  errorMessage.value = undefined
  fieldErrorMessages.value = undefined

  let response = await claimApi.collectClaims(values)
  if (response instanceof SuccessApiResponse) {
    await redirectOrPush(router, response.content.redirect_url)
  } else {
    fieldErrorMessages.value = getErrorMessageForProperties(response)
    errorMessage.value = getErrorMessage(response)
  }
})

onMounted(async () => {
  await loadClaims()
})
</script>

<template>
  <base-page>
    <div class='flex justify-center w-100'>
      <title-content-card size='large'>
        <template v-slot:title>
          {{ t('pages.collect_claims.title') }}
        </template>

        <form @submit='onSubmit'>
          <claims-input-group
            :claims='collectableClaims'
            :disabled='isSubmitting'
            :error-messages='fieldErrorMessages'
            :loading='isLoadingClaims'
            class='mb-3'
          />

          <common-button
            :buttonStyle='primaryColoredButton'
            :disabled='isLoadingClaims'
            :loading='isSubmitting'
            class='w-full mt-5'
            type='submit'
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
