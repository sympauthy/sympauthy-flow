<script lang='ts' setup>
import BasePage from '@/components/BasePage.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { injectRequired, redirectOrReplace } from '@/utils/VueUtils'
import { claimFormServiceKey } from '@/services/ClaimFormService'
import { configurationKey } from '@/utils/ConfigurationUtils'
import { object } from 'yup'
import { Form } from 'vee-validate'
import ClaimsInputGroup from '@/components/claim/group/ClaimsInputGroup.vue'
import { claimServiceKey } from '@/services/ClaimsService'
import { onMounted, ref } from 'vue'
import { getErrorMessageForProperties, getErrorMessageOrThrow } from '@/exception/ApiException'
import { claimApiKey } from '@/client/api/ClaimApi'
import type { FlowResultResource } from '@/client/model/FlowResultResource'
import TitleContentCard from '@/components/card/TitleContentCard.vue'

const { t } = useI18n()
const router = useRouter()
const claimApi = injectRequired(claimApiKey)
const claimService = injectRequired(claimServiceKey)
const claimFormService = injectRequired(claimFormServiceKey)
const configuration = injectRequired(configurationKey)

const isLoading = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)

const errorMessage = ref<string | undefined>(undefined)
const fieldErrorMessages = ref<Record<string, string> | undefined>(undefined)

const collectableClaims = claimService.getCollectableClaims(configuration)
const claimSchemas = claimFormService.getSchemasForClaims(configuration, collectableClaims)
const validationSchema = object({
  ...claimSchemas
})

const loadClaims = async () => {
  if (isLoading.value) return
  isLoading.value = true

  errorMessage.value = undefined
  fieldErrorMessages.value = undefined

  try {
    const claims = claimApi.fetchClaims()
    console.log(JSON.stringify(claims))
  } catch (e) {
    errorMessage.value = getErrorMessageOrThrow(e)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadClaims()
})

const onSubmit = async (values: any) => {
  if (isLoading.value || isSubmitting.value) return
  isSubmitting.value = true

  errorMessage.value = undefined
  fieldErrorMessages.value = undefined

  let result: FlowResultResource
  try {
    result = await claimApi.collectClaims(values)
  } catch (e) {
    fieldErrorMessages.value = getErrorMessageForProperties(e)
    errorMessage.value = getErrorMessageOrThrow(e)
    return
  } finally {
    isSubmitting.value = false
  }

  await redirectOrReplace(router, result.redirect_url)
}

</script>

<template>
  <base-page>
    <div class='flex justify-center w-100'>
      <title-content-card size='large'>
        <template v-slot:title>
          {{ t('pages.collect_claims.title') }}
        </template>

        <Form :validation-schema='validationSchema' @submit='onSubmit'>
          <claims-input-group :claims='collectableClaims'
                              :disabled='isLoading'
                              :error-messages='fieldErrorMessages'
                              class='mb-3' />

          <button class='btn btn-primary w-full mt-5' type='submit'>
            {{ t('common.continue') }}
          </button>
        </Form>
      </title-content-card>
    </div>
  </base-page>
</template>
