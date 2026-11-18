<script lang="ts" setup>
import BasePage from '@/components/BasePage.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import CommonInput from '@/components/CommonInputField.vue'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { object } from 'yup'
import { SaAlert, SaButton } from '@sympauthy/design'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { resetPasswordApiKey } from '@/client/api/ResetPasswordApi'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { getErrorMessage } from '@/client/ErrorApiResponse'
import type { CollectableClaimResource } from '@/client/model/CollectableClaimResource'
import { useResetPassword } from '@/stores/ResetPasswordStore'
import { getStateQueryParam } from '@/router'
import { or } from '@/utils/StringUtils'
import { notBlankString } from '@/utils/ValidationUtils'
import { i18n } from '@/i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const resetPasswordApi = injectRequired(resetPasswordApiKey)
const resetPassword = useResetPassword()

const identifierClaims = ref<Array<CollectableClaimResource>>()
const fetchErrorMessage = ref<string>()
const submitErrorMessage = ref<string>()

const loginLabel = computed(() =>
  or(
    i18n,
    (identifierClaims.value ?? []).map((claim) => claim.name)
  )
)

const validationSchema = computed(() =>
  object({
    login: notBlankString(loginLabel.value)
  })
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: validationSchema,
  // What the person typed on sign-in, or on this page before the code page, still editable.
  initialValues: { login: resetPassword.login }
})

const signInRoute = computed(() => ({
  name: 'SignIn',
  query: { state: getStateQueryParam(route) }
}))

const onSubmit = handleSubmit(async (values: any) => {
  submitErrorMessage.value = undefined
  // Kept so that coming back to this page, with Back or from the code page, shows it again.
  resetPassword.login = values.login

  // Whatever is typed leads to the code page, which says nothing about whether an account holds it.
  const response = await resetPasswordApi.requestCode(values.login)
  if (response instanceof SuccessApiResponse) {
    await redirectOrPush(router, response.content.redirect_url)
  } else {
    submitErrorMessage.value = getErrorMessage(response)
  }
})

onMounted(async () => {
  const response = await resetPasswordApi.fetchResetPassword()
  if (response instanceof SuccessApiResponse) {
    // The step does not apply, once the person is signed in.
    if (response.content.redirect_url !== undefined) {
      await redirectOrPush(router, response.content.redirect_url)
      return
    }
    identifierClaims.value = response.content.identifier_claims
  } else {
    fetchErrorMessage.value = getErrorMessage(response)
  }
})
</script>

<template>
  <base-page>
    <div class="flex w-full flex-col items-center gap-6">
      <title-content-card :loading="!identifierClaims" :error="fetchErrorMessage">
        <template v-slot:title>
          {{ t('pages.reset_password.request.title') }}
        </template>

        <template v-slot:default>
          <sa-alert v-if="submitErrorMessage">
            {{ submitErrorMessage }}
          </sa-alert>

          <p>
            {{ t('pages.reset_password.request.description', [loginLabel]) }}
          </p>

          <form class="flex flex-col gap-4" @submit="onSubmit">
            <common-input
              :disabled="isSubmitting"
              :label="loginLabel"
              autocomplete="username"
              name="login"
              type="text"
            />

            <sa-button :submitting="isSubmitting" size="large" type="submit">
              <template v-slot:default>
                {{ t('pages.reset_password.request.submit') }}
              </template>
              <template v-slot:submitting>
                {{ t('pages.reset_password.request.submitting') }}
              </template>
            </sa-button>
          </form>
        </template>
      </title-content-card>

      <i18n-t
        v-if="identifierClaims"
        keypath="pages.reset_password.request.remembered"
        tag="p"
        class="text-center"
      >
        <router-link :to="signInRoute" class="sa-link">
          {{ t('pages.reset_password.request.back_to_sign_in') }}
        </router-link>
      </i18n-t>
    </div>
  </base-page>
</template>
