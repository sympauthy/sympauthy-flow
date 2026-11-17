<script lang="ts" setup>
import BasePage from '@/components/BasePage.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import CommonInput from '@/components/CommonInputField.vue'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { object } from 'yup'
import { SaAlert, SaButton } from '@sympauthy/design'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { resetPasswordApiKey } from '@/client/api/ResetPasswordApi'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { getErrorMessage } from '@/client/ErrorApiResponse'
import { notBlankString } from '@/utils/ValidationUtils'

const { t } = useI18n()
const router = useRouter()
const resetPasswordApi = injectRequired(resetPasswordApiKey)

const login = ref<string>()
const fetchErrorMessage = ref<string>()
const submitErrorMessage = ref<string>()

const validationSchema = object({
  password: notBlankString(t('pages.reset_password.choose.label'))
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: validationSchema
})

const onSubmit = handleSubmit(async (values) => {
  submitErrorMessage.value = undefined

  // The reset takes effect when the authorization completes, so the server leads on to the next step.
  const response = await resetPasswordApi.choosePassword(values.password)
  if (response instanceof SuccessApiResponse) {
    await redirectOrPush(router, response.content.redirect_url)
  } else {
    submitErrorMessage.value = getErrorMessage(response)
  }
})

onMounted(async () => {
  const response = await resetPasswordApi.fetchChoice()
  if (response instanceof SuccessApiResponse) {
    // The step does not apply, before the code was accepted or once a password was chosen.
    if (response.content.redirect_url !== undefined) {
      await redirectOrPush(router, response.content.redirect_url)
      return
    }
    login.value = response.content.login
  } else {
    fetchErrorMessage.value = getErrorMessage(response)
  }
})
</script>

<template>
  <base-page>
    <div class="flex w-full justify-center">
      <title-content-card :loading="login === undefined" :error="fetchErrorMessage">
        <template v-slot:title>
          {{ t('pages.reset_password.choose.title') }}
        </template>

        <template v-slot:default>
          <sa-alert v-if="submitErrorMessage">
            {{ submitErrorMessage }}
          </sa-alert>

          <p>
            {{ t('pages.reset_password.choose.description') }}
          </p>

          <form class="flex flex-col gap-4" @submit="onSubmit">
            <!-- Offered to a password manager, so that the password it saves is filed under the account. -->
            <input :value="login" autocomplete="username" hidden type="text" />

            <common-input
              :disabled="isSubmitting"
              :label="t('pages.reset_password.choose.label')"
              autocomplete="new-password"
              name="password"
              revealable
              type="password"
            />

            <sa-button :submitting="isSubmitting" size="large" type="submit">
              <template v-slot:default>
                {{ t('common.continue') }}
              </template>
              <template v-slot:submitting>
                {{ t('pages.reset_password.choose.submitting') }}
              </template>
            </sa-button>
          </form>
        </template>
      </title-content-card>
    </div>
  </base-page>
</template>
