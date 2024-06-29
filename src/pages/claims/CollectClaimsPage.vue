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

const isLoading = ref<boolean>(false)

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
  if (isLoading.value) return
  isLoading.value = true

  errorMessage.value = undefined
  fieldErrorMessages.value = undefined

  const response = await claimApi.fetchClaims()
  if (response instanceof SuccessApiResponse) {
    response.content.claims
      .filter(it => it.collected)
      .forEach(it => setFieldValue(it.claim, it.value))
  } else {
    errorMessage.value = getErrorMessage(response)
  }

  isLoading.value = false
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
          <claims-input-group :claims='collectableClaims'
                              :disabled='isLoading || isSubmitting'
                              :error-messages='fieldErrorMessages'
                              class='mb-3' />

          <common-button :loading='isLoading'
                         :buttonStyle='primaryColoredButton'
                         class='w-full mt-5'
                         type='submit'>
            {{ t('common.continue') }}
          </common-button>
        </form>
      </title-content-card>
    </div>
  </base-page>
</template>
