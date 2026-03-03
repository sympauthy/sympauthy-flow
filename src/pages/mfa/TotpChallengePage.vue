<script lang="ts" setup>
import BasePage from '@/components/BasePage.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { totpApiKey } from '@/client/api/TotpApi'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { getErrorMessage } from '@/client/ErrorApiResponse'
import CommonAlert from '@/components/CommonAlert.vue'
import CommonButton from '@/components/CommonButton.vue'
import ValidationCodeField from '@/components/validationcode/ValidationCodeInputField.vue'

const { t } = useI18n()
const router = useRouter()
const totpApi = injectRequired(totpApiKey)

const submitErrorMessage = ref<string | undefined>(undefined)

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

const onSubmit = handleSubmit(async (values, ctx) => {
  submitErrorMessage.value = undefined

  const response = await totpApi.submitChallenge(values['code'])
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
    <form @submit="onSubmit">
      <div class="flex justify-center w-100">
        <title-content-card size="default">
          <template v-slot:title>
            {{ t('pages.totp_challenge.title') }}
          </template>

          <template v-slot:default>
            <common-alert v-if="submitErrorMessage" class="mb-3">
              {{ submitErrorMessage }}
            </common-alert>

            <p class="w-full mb-7 text-justify">
              {{ t('pages.totp_challenge.description') }}
            </p>

            <validation-code-field
              class="mb-7"
              name="code"
            />

            <common-button
              :submitting="isSubmitting"
              class="w-full mt-5"
              type="submit"
            >
              <template v-slot:default>
                {{ t('pages.totp_challenge.submit') }}
              </template>
              <template v-slot:submitting>
                {{ t('pages.totp_challenge.submitting') }}
              </template>
            </common-button>
          </template>
        </title-content-card>
      </div>
    </form>
  </base-page>
</template>

<style scoped></style>
