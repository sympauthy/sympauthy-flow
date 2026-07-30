<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { object, string, type Schema } from 'yup'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { signUpApiKey } from '@/client/api/SignUpApi'
import ClaimsInputGroup from '@/components/claim/group/ClaimsInputGroup.vue'
import { claimFormServiceKey } from '@/services/ClaimFormService'
import { getErrorMessage, getErrorMessageForProperties } from '@/client/ErrorApiResponse'
import { useRouter } from 'vue-router'
import CommonAlert from '@/components/CommonAlert.vue'
import CommonField from '@/components/CommonInputField.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import BasePage from '@/components/BasePage.vue'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import CommonButton from '@/components/CommonButton.vue'
import { useForm } from 'vee-validate'
import { omit, pipe } from 'rambda'
import type { ClaimConfiguration } from '@/client/model/ClaimConfiguration'
import { makeErrorRoute } from '@/router'

const { t } = useI18n()
const router = useRouter()
const claimFormService = injectRequired(claimFormServiceKey)
const signUpApi = injectRequired(signUpApiKey)

const isLoading = ref(true)
const errorMessage = ref<string>()
const fieldErrorMessages = ref<Record<string, string>>()

const signUpClaims = ref<Array<ClaimConfiguration>>([])
const passwordEnabled = ref(false)
const signInRedirectUrl = ref<string>()

const validationSchema = computed(() => {
  const schema: Record<string, Schema> = {
    ...claimFormService.getSchemasForClaimConfigs(signUpClaims.value)
  }
  if (passwordEnabled.value) {
    schema.password = string().required()
    schema.confirm_password = string().required()
  }
  return object(schema)
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: validationSchema
})

const onSubmit = handleSubmit(async (values: any) => {
  errorMessage.value = undefined
  fieldErrorMessages.value = undefined

  const body = pipe(values, omit(['confirm_password']))

  const result = await signUpApi.signUp(body)
  if (result instanceof SuccessApiResponse) {
    await redirectOrPush(router, result.content.redirect_url)
  } else {
    fieldErrorMessages.value = getErrorMessageForProperties(result)
    errorMessage.value = getErrorMessage(result)
  }
})

async function onSignInClick() {
  if (signInRedirectUrl.value) {
    await redirectOrPush(router, signInRedirectUrl.value)
  }
}

onMounted(async () => {
  const response = await signUpApi.fetchSignUp()
  if (response instanceof SuccessApiResponse) {
    // The sign-up step does not apply: the server tells us where to go instead.
    if (response.content.redirect_url) {
      await redirectOrPush(router, response.content.redirect_url)
      return
    }
    signUpClaims.value = response.content.password?.identifier_claims ?? []
    passwordEnabled.value = response.content.password != null
    signInRedirectUrl.value = response.content.sign_in_redirect_url
    isLoading.value = false
  } else {
    await router.replace(makeErrorRoute(response.errorCode, response.details, response.description))
  }
})
</script>

<template>
  <base-page>
    <div class="flex justify-center w-full">
      <title-content-card :loading="isLoading">
        <template v-slot:title>
          {{ t('pages.sign_up.title') }}
        </template>
        <template v-slot:default>
          <div v-if="signInRedirectUrl" class="mb-3 w-full text-center">
            <i18n-t keypath="pages.sign_up.already_have_account">
              <a class="text-primary underline cursor-pointer" @click="onSignInClick">
                {{ t('pages.sign_up.sign_in_action') }}
              </a>
            </i18n-t>
          </div>

          <common-alert v-if="errorMessage" class="mb-3">
            {{ errorMessage }}
          </common-alert>

          <form @submit="onSubmit">
            <claims-input-group
              :claims="signUpClaims"
              :disabled="isSubmitting"
              :error-messages="fieldErrorMessages"
              class="mb-3"
            />

            <template v-if="passwordEnabled">
              <common-field
                :disabled="isSubmitting"
                :error-message="fieldErrorMessages?.['password']"
                :label="t('common.password')"
                autocomplete="new-password"
                class="mb-3"
                name="password"
                type="password"
              />

              <common-field
                :disabled="isSubmitting"
                :error-message="fieldErrorMessages?.['confirm_password']"
                :label="t('common.confirm_password')"
                autocomplete="new-password"
                class="mb-3"
                name="confirm_password"
                type="password"
              />
            </template>

            <common-button :loading="isSubmitting" class="w-full mt-5" type="submit">
              <template v-slot:default>
                {{ t('common.sign_up') }}
              </template>
              <template v-slot:loading>
                {{ t('pages.sign_up.signing_up') }}
              </template>
            </common-button>
          </form>
        </template>
      </title-content-card>
    </div>
  </base-page>
</template>
