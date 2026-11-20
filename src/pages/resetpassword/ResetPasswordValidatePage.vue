<script lang="ts" setup>
import BasePage from '@/components/BasePage.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import ValidationCodeField from '@/components/validationcode/ValidationCodeInputField.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'
import { SaAlert, SaButton } from '@sympauthy/design'
import { Temporal } from '@js-temporal/polyfill'
import { injectRequired, redirectOrPush, useSubmission } from '@/utils/VueUtils'
import { resetPasswordApiKey } from '@/client/api/ResetPasswordApi'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { getErrorMessage } from '@/client/ErrorApiResponse'
import type { CollectableClaimResource } from '@/client/model/CollectableClaimResource'
import type { ClientReferenceResource } from '@/client/model/ClientReferenceResource'
import { useResetPassword } from '@/stores/ResetPasswordStore'
import { getStateQueryParam } from '@/router'
import { formatToHumanReadable, getDurationUntil } from '@/utils/DurationUtils'
import { or } from '@/utils/StringUtils'
import { i18n } from '@/i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const resetPasswordApi = injectRequired(resetPasswordApiKey)
const resetPassword = useResetPassword()

const isResending = ref(false)

const login = ref<string>()
const identifierClaims = ref<Array<CollectableClaimResource>>()
const client = ref<ClientReferenceResource>()
const cancelUrl = ref<string>()
const resendDate = ref<string>()
const durationToWaitBeforeResend = ref<Temporal.Duration>()
let refreshInterval: number | undefined = undefined
// Set once the person has left the page, so that a response arriving later starts nothing.
let unmounted = false

const fetchErrorMessage = ref<string>()
const submitErrorMessage = ref<string>()

const isLoaded = computed(() => login.value !== undefined && identifierClaims.value !== undefined)

const loginLabel = computed(() =>
  or(
    i18n,
    (identifierClaims.value ?? []).map((claim) => claim.name)
  )
)

const validationSchema = object({
  code: string().required().label(t('components.validation_code_input_field.label'))
})

const { handleSubmit, defineField, isSubmitting, resetForm } = useForm({
  validationSchema: validationSchema
})
const { busy, moveOn } = useSubmission(router, isSubmitting)
defineField('code', {
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false
})

const updateDurationToWaitBeforeResend = () => {
  durationToWaitBeforeResend.value = getDurationUntil(resendDate.value)

  // Start interval if duration is not undefined and interval is not already running
  if (
    !unmounted &&
    durationToWaitBeforeResend.value !== undefined &&
    refreshInterval === undefined
  ) {
    refreshInterval = window.setInterval(() => {
      updateDurationToWaitBeforeResend()
      if (durationToWaitBeforeResend.value === undefined && refreshInterval !== undefined) {
        clearInterval(refreshInterval)
        refreshInterval = undefined
      }
    }, 1000)
  }
}

const onResend = async () => {
  if (isResending.value) {
    return
  }
  isResending.value = true
  submitErrorMessage.value = undefined

  try {
    const response = await resetPasswordApi.resendCode()
    if (response instanceof SuccessApiResponse) {
      // A resend the server did not make changes nothing: the boxes keep what was typed.
      if (response.content.resent) {
        resendDate.value = response.content.resend_date
        updateDurationToWaitBeforeResend()
        resetForm()
      }
    } else {
      submitErrorMessage.value = getErrorMessage(response)
    }
  } finally {
    isResending.value = false
  }
}

const onUseDifferentLogin = async () => {
  resetPassword.login = login.value
  await router.push({ name: 'ResetPassword', query: { state: getStateQueryParam(route) } })
}

const onSubmit = handleSubmit(async (values, ctx) => {
  submitErrorMessage.value = undefined

  const response = await resetPasswordApi.validateCode(values['code'])
  if (response instanceof SuccessApiResponse) {
    await moveOn(response.content.redirect_url)
  } else if (response.errorCode === 'flow.password.reset.invalid_code') {
    ctx.setFieldError('code', getErrorMessage(response))
  } else {
    submitErrorMessage.value = getErrorMessage(response)
  }
})

onMounted(async () => {
  // The identifier claims word the page, as on the first page, however this page was opened.
  const [validation, configuration] = await Promise.all([
    resetPasswordApi.fetchValidation(),
    resetPasswordApi.fetchResetPassword()
  ])
  if (unmounted) {
    return
  }
  for (const response of [validation, configuration]) {
    if (!(response instanceof SuccessApiResponse)) {
      fetchErrorMessage.value = getErrorMessage(response)
      return
    }
    // The step does not apply, before a code was asked for or once it was accepted.
    if (response.content.redirect_url !== undefined) {
      await redirectOrPush(router, response.content.redirect_url)
      return
    }
  }
  if (validation instanceof SuccessApiResponse && configuration instanceof SuccessApiResponse) {
    login.value = validation.content.login
    resendDate.value = validation.content.resend_date
    client.value = validation.content.client
    cancelUrl.value = validation.content.cancel_url
    identifierClaims.value = configuration.content.identifier_claims
    updateDurationToWaitBeforeResend()
  }
})

onUnmounted(() => {
  unmounted = true
  if (refreshInterval !== undefined) {
    clearInterval(refreshInterval)
  }
})
</script>

<template>
  <!-- A resend cannot complete the session: leaving stays available meanwhile. -->
  <base-page :cancel-disabled="busy" :cancel-url="cancelUrl" :client="client">
    <div class="flex w-full justify-center">
      <title-content-card :loading="!isLoaded" :error="fetchErrorMessage">
        <template v-slot:title>
          {{ t('pages.reset_password.validate.title') }}
        </template>

        <template v-slot:default>
          <sa-alert v-if="submitErrorMessage">
            {{ submitErrorMessage }}
          </sa-alert>

          <!-- The same sentence whoever the identifier belongs to: it says nothing of which accounts exist. -->
          <i18n-t keypath="pages.reset_password.validate.description" tag="p">
            <template v-slot:login>
              <strong>{{ login }}</strong>
            </template>
            <template v-slot:identifier>{{ loginLabel }}</template>
          </i18n-t>

          <form class="flex flex-col gap-4" @submit="onSubmit">
            <validation-code-field autofocus name="code" />

            <!-- Not while a resend is in flight: a resend that went through clears the boxes. -->
            <sa-button :disabled="isResending" :submitting="busy" size="large" type="submit">
              <template v-slot:default>
                {{ t('pages.reset_password.validate.submit') }}
              </template>
              <template v-slot:submitting>
                {{ t('pages.reset_password.validate.submitting') }}
              </template>
            </sa-button>
          </form>

          <div class="flow-small flex flex-col items-center">
            <div class="flex items-center justify-center gap-3">
              <p>{{ t('pages.reset_password.validate.resend.description') }}</p>
              <p v-if="durationToWaitBeforeResend" class="text-gray-500">
                {{
                  t('pages.reset_password.validate.resend.waiting', [
                    formatToHumanReadable(durationToWaitBeforeResend)
                  ])
                }}
              </p>
              <sa-button
                v-else
                :disabled="busy"
                :submitting="isResending"
                type="button"
                variant="text"
                @click="onResend"
              >
                <template v-slot:default>
                  {{ t('pages.reset_password.validate.resend.action') }}
                </template>
                <template v-slot:submitting>
                  {{ t('pages.reset_password.validate.resend.resending') }}
                </template>
              </sa-button>
            </div>

            <sa-button :disabled="busy" type="button" variant="text" @click="onUseDifferentLogin">
              {{ t('pages.reset_password.validate.different_login', [loginLabel]) }}
            </sa-button>
          </div>
        </template>
      </title-content-card>
    </div>
  </base-page>
</template>
