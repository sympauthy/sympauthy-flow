<script lang="ts" setup>
import BasePage from '@/components/BasePage.vue'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { claimsValidationApiKey } from '@/client/api/ClaimsValidationApi'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { useI18n } from 'vue-i18n'
import { getErrorMessage } from '@/client/ErrorApiResponse'
import ValidationCodeField from '@/components/validationcode/ValidationCodeInputField.vue'
import {
  getDurationToWaitBeforeResend,
  type ValidationCodeResource
} from '@/client/model/ValidationCodeResource'
import { type SubmissionContext, useForm } from 'vee-validate'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { object, string } from 'yup'
import { SaAlert, SaButton, SaSpinner } from '@sympauthy/design'
import { useRoute, useRouter } from 'vue-router'
import type { ClaimsValidationFlowResource } from '@/client/model/ClaimsValidationFlowResource.ts'
import { makeUnknownErrorRoute } from '@/router'
import CommonActionableLink from '@/components/CommonActionableLink.vue'
import { Temporal } from '@js-temporal/polyfill'
import { formatToHumanReadable } from '@/utils/DurationUtils.ts'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const claimsValidationApi = injectRequired(claimsValidationApiKey)

const isLoading = ref(false)
const isResending = ref(false)

const media = ref<string | undefined>(undefined)
const validationCode = ref<ValidationCodeResource | undefined>(undefined)
const durationToWaitBeforeResend = ref<Temporal.Duration | undefined>(undefined)
let refreshInterval: number | undefined = undefined

const fetchErrorMessage = ref<string | undefined>(undefined)
const submitErrorMessage = ref<string | undefined>(undefined)

const validationSchema = object({
  code: string().required().label(t('components.validation_code_input_field.label'))
})

const { handleSubmit, defineField, isSubmitting, resetForm } = useForm({
  validationSchema: validationSchema
})
defineField('code', {
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false
})

const mediaName = computed(() => {
  if (media.value === undefined) {
    return undefined
  }
  return t(`media.${media.value}`)
})

const updateDurationToWaitBeforeResend = () => {
  durationToWaitBeforeResend.value = getDurationToWaitBeforeResend(validationCode.value)

  // Start interval if duration is not undefined and interval is not already running
  if (durationToWaitBeforeResend.value !== undefined && refreshInterval === undefined) {
    refreshInterval = window.setInterval(() => {
      updateDurationToWaitBeforeResend()
      if (durationToWaitBeforeResend.value === undefined && refreshInterval !== undefined) {
        clearInterval(refreshInterval)
        refreshInterval = undefined
      }
    }, 1000)
  }
}

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
  response: SuccessApiResponse<ClaimsValidationFlowResource>,
  ctx?: SubmissionContext
) => {
  if (response.content.redirect_url !== undefined) {
    await redirectOrPush(router, response.content.redirect_url)
  } else {
    validationCode.value = response.content.code
    updateDurationToWaitBeforeResend()
    ctx?.resetForm()
  }
}

const onResend = async () => {
  if (validationCode.value === undefined) {
    return
  }
  if (isResending.value) {
    return
  }
  isResending.value = true
  submitErrorMessage.value = undefined

  const response = await claimsValidationApi.resendValidationCode({
    media: validationCode.value.media
  })
  if (response instanceof SuccessApiResponse) {
    if (response.content.resent && response.content.code !== undefined) {
      validationCode.value = response.content.code
      updateDurationToWaitBeforeResend()
      resetForm()
    }
  } else {
    submitErrorMessage.value = getErrorMessage(response)
  }

  isResending.value = false
}

const onSubmit = handleSubmit(async (values, ctx) => {
  if (validationCode.value === undefined) {
    console.error(
      'Cannot submit validation code: validationCode is undefined. The server may have returned a redirect_url that was not handled.'
    )
    submitErrorMessage.value = t('common.unreachable_state')
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
    ctx.setFieldError('code', getErrorMessage(response))
  } else {
    submitErrorMessage.value = getErrorMessage(response)
  }
})

onMounted(async () => {
  const mediaQueryParam = route.query.media?.toString()
  if (mediaQueryParam === undefined) {
    await router.replace(makeUnknownErrorRoute())
    return
  }
  media.value = mediaQueryParam

  await fetchValidationFlowResult(mediaQueryParam)
})

onUnmounted(() => {
  if (refreshInterval !== undefined) {
    clearInterval(refreshInterval)
  }
})
</script>

<template>
  <base-page>
    <div class="flex justify-center w-full">
      <title-content-card size="default" :loading="isLoading" :error="fetchErrorMessage">
        <template v-slot:title>
          {{ t('pages.validate_claims.title') }}
        </template>

        <template v-slot:default>
          <sa-alert v-if="submitErrorMessage">
            {{ submitErrorMessage }}
          </sa-alert>

          <p>
            {{ t('pages.validate_claims.description.1', [mediaName]) }}
          </p>

          <p>
            {{ t('pages.validate_claims.description.2', [mediaName]) }}
          </p>

          <form class="flex flex-col gap-4" @submit="onSubmit">
            <validation-code-field autofocus name="code" @complete="onSubmit()" />

            <common-actionable-link
              :disabled="isSubmitting"
              :label="t('pages.validate_claims.resend.description')"
              :text="t('pages.validate_claims.resend.action')"
              class="flow-small"
            >
              <p v-if="durationToWaitBeforeResend">
                {{
                  t('pages.validate_claims.resend.waiting', [
                    formatToHumanReadable(durationToWaitBeforeResend)
                  ])
                }}
              </p>
              <a v-else-if="!isResending" class="sa-link" @click="onResend">
                {{ t('pages.validate_claims.resend.action') }}
              </a>
              <template v-else>
                <p class="me-2">{{ t('pages.validate_claims.resend.resending') }}</p>
                <sa-spinner class="text-primary" size="sm" />
              </template>
            </common-actionable-link>

            <sa-button :loading="isResending" :submitting="isSubmitting" size="large" type="submit">
              <template v-slot:default>
                {{ t('pages.validate_claims.submit') }}
              </template>
              <template v-slot:loading>
                {{ t('common.loading') }}
              </template>
              <template v-slot:submitting>
                {{ t('pages.validate_claims.submitting') }}
              </template>
            </sa-button>
          </form>
        </template>
      </title-content-card>
    </div>
  </base-page>
</template>

<style scoped></style>
