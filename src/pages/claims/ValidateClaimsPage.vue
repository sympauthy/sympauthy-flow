<script lang='ts' setup>
import BasePage from '@/components/BasePage.vue'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { claimsValidationApiKey } from '@/client/api/ClaimsValidationApi'
import { computed, onMounted, ref, watch } from 'vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { useI18n } from 'vue-i18n'
import { getErrorMessage } from '@/client/ErrorApiResponse'
import ValidationCodeField from '@/components/ValidationCodeInputField.vue'
import type { ValidationCodeResource } from '@/client/model/ValidationCodeResource'
import { type SubmissionContext, useForm } from 'vee-validate'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { object, string } from 'yup'
import CommonAlert from '@/components/CommonAlert.vue'
import { useRoute, useRouter } from 'vue-router'
import type { ClaimsValidationFlowResultResource } from '@/client/model/ClaimsValidationFlowResultResource'
import SkeletonText from '@/components/SkeletonText.vue'
import { makeUnknownErrorRoute } from '@/router'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const claimsValidationApi = injectRequired(claimsValidationApiKey)

const media = ref<string | undefined>(undefined)
const isLoading = ref(false)
const fetchErrorMessage = ref<string | undefined>(undefined)
const validationCode = ref<ValidationCodeResource | undefined>(undefined)
const submitErrorMessage = ref<string | undefined>(undefined)

const validationSchema = object({
  code: string().required()
})

const { meta, handleSubmit, isSubmitting } = useForm({
  validationSchema: validationSchema
})

const mediaName = computed(() => {
  if (media.value === undefined) {
    return undefined
  }
  return t(`media.${media.value}`)
})

const fetchValidationFlowResult = async (media: string) => {
  if (isLoading.value) {
    return
  }
  isLoading.value = true

  const response = await claimsValidationApi.fetchValidationFlowResult(media)
  if (response instanceof SuccessApiResponse) {
    await handleValidationFlowResult(response)
  } else {
    fetchErrorMessage.value = getErrorMessage(response)
  }

  isLoading.value = false
}

const handleValidationFlowResult = async (
  response: SuccessApiResponse<ClaimsValidationFlowResultResource>,
  ctx?: SubmissionContext
) => {
  if (response.content.redirect_url !== undefined) {
    await redirectOrPush(router, response.content.redirect_url)
  } else {
    validationCode.value = response.content.code
    ctx?.resetForm()
  }
}


const onSubmit = handleSubmit(async (values, ctx) => {
  if (validationCode.value === undefined) {
    return
  }
  submitErrorMessage.value = undefined

  const response = await claimsValidationApi.validateClaim({
    media: validationCode.value.media,
    code: values['code']
  })
  if (response instanceof SuccessApiResponse) {
    await handleValidationFlowResult(response, ctx)
  } else if (response.errorCode === 'flow.claim_validation.invalid_code') {
    ctx.resetForm()
    ctx.setFieldError('code', getErrorMessage(response))
  } else {
    submitErrorMessage.value = getErrorMessage(response)
  }
})

onMounted(async () => {
  let mediaQueryParam = route.query.media?.toString()
  if (mediaQueryParam === undefined) {
    await router.replace(makeUnknownErrorRoute())
    return
  }
  media.value = mediaQueryParam

  await fetchValidationFlowResult(mediaQueryParam)
})

/**
 * Automagically submit the form once the user has entered the code.
 */
watch(
  () => meta.value.valid,
  (value, oldValue) => {
    if (value != oldValue && value && !isSubmitting.value) {
      onSubmit()
    }
  }
)

</script>

<template>
  <base-page>
    <form @submit='onSubmit'>
      <div class='flex justify-center w-100'>
        <title-content-card size='default'>
          <template v-slot:title>
            {{ t('pages.validate_claims.title') }}
          </template>

          <template v-slot:default>
            <common-alert v-if='fetchErrorMessage' class='mb-3'>
              {{ fetchErrorMessage }}
            </common-alert>

            <p class='w-full mb-3 text-justify'>
              {{ t('pages.validate_claims.description_1', [mediaName]) }}
            </p>

            <p v-if='!isLoading' class='w-full text-justify mb-7'>
              {{ t('pages.validate_claims.description_2', [mediaName]) }}
            </p>
            <skeleton-text v-else class='mb-7'></skeleton-text>

            <validation-code-field :code='validationCode'
                                   :loading='isLoading'
                                   :loading-code-length='6'
                                   :submitting='isSubmitting'
                                   class='mb-7'
                                   name='code' />

            <div class='w-full text-sm text-center'>
              <a>{{ t('pages.validate_claims.resend.description') }}</a>
            </div>
          </template>
        </title-content-card>
      </div>
    </form>
  </base-page>
</template>

<style scoped>

</style>
