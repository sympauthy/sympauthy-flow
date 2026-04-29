<script lang="ts" setup>
import BasePage from '@/components/BasePage.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { totpApiKey } from '@/client/api/TotpApi'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { getErrorMessage } from '@/client/ErrorApiResponse'
import type { TotpEnrollFlowResource } from '@/client/model/TotpEnrollFlowResource'
import CommonAlert from '@/components/CommonAlert.vue'
import CommonButton from '@/components/CommonButton.vue'
import ValidationCodeField from '@/components/validationcode/ValidationCodeInputField.vue'
import TotpQrCodeCard from '@/components/mfa/TotpQrCodeCard.vue'

const { t } = useI18n()
const router = useRouter()
const totpApi = injectRequired(totpApiKey)

const isLoading = ref(true)
const fetchErrorMessage = ref<string | undefined>(undefined)
const submitErrorMessage = ref<string | undefined>(undefined)
const enrollData = ref<TotpEnrollFlowResource | undefined>(undefined)

const validationSchema = object({
  code: string().required()
})

const { handleSubmit, defineField, isSubmitting } = useForm({
  validationSchema
})
defineField('code', {
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false
})

onMounted(async () => {
  const response = await totpApi.fetchEnrollmentData()
  if (response instanceof SuccessApiResponse) {
    enrollData.value = response.content
  } else {
    fetchErrorMessage.value = getErrorMessage(response)
  }
  isLoading.value = false
})

const onSubmit = handleSubmit(async (values, ctx) => {
  submitErrorMessage.value = undefined

  const response = await totpApi.confirmEnrollment(values['code'])
  if (response instanceof SuccessApiResponse) {
    await redirectOrPush(router, response.content.redirect_url)
  } else if (response.errorCode === 'flow.mfa.totp.invalid_code') {
    ctx.setFieldError('code', getErrorMessage(response))
  } else {
    submitErrorMessage.value = getErrorMessage(response)
  }
})
</script>

<template>
  <base-page>
    <div class="flex justify-center w-full">
      <form @submit="onSubmit">
        <title-content-card size="default" :loading="isLoading" :error="fetchErrorMessage">
          <template v-slot:title>
            {{ t('pages.totp_enroll.title') }}
          </template>

          <template v-slot:default>
            <common-alert v-if="submitErrorMessage" class="mb-3">
              {{ submitErrorMessage }}
            </common-alert>

            <totp-qr-code-card
              v-if="enrollData"
              :uri="enrollData.uri"
              :secret="enrollData.secret"
              :loading="false"
            />

            <p class="w-full mt-5 mb-5 text-justify">
              {{ t('pages.totp_enroll.confirm_instructions') }}
            </p>

            <validation-code-field autofocus :code-length="6" class="mb-7" name="code" />

            <common-button :submitting="isSubmitting" class="w-full mt-5" type="submit">
              <template v-slot:default>
                {{ t('pages.totp_enroll.submit') }}
              </template>
              <template v-slot:submitting>
                {{ t('pages.totp_enroll.submitting') }}
              </template>
            </common-button>
          </template>
        </title-content-card>
      </form>
    </div>
  </base-page>
</template>

<style scoped></style>
