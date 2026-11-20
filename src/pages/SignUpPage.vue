<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { object, ref as schemaRef, string, type Schema } from 'yup'
import {
  injectRequired,
  isClickInPlace,
  linkAttributes,
  redirectOrPush,
  useSubmission
} from '@/utils/VueUtils'
import { signUpApiKey } from '@/client/api/SignUpApi'
import ClaimsInputGroup from '@/components/claim/group/ClaimsInputGroup.vue'
import { claimFormServiceKey } from '@/services/ClaimFormService'
import { getErrorMessage, getErrorMessageForProperties } from '@/client/ErrorApiResponse'
import { useRouter } from 'vue-router'
import { SaAlert, SaButton } from '@sympauthy/design'
import CommonField from '@/components/CommonInputField.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import BasePage from '@/components/BasePage.vue'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { useForm } from 'vee-validate'
import { omit, pipe } from 'rambda'
import type { ClaimConfiguration } from '@/client/model/ClaimConfiguration'
import type { ClientReferenceResource } from '@/client/model/ClientReferenceResource'
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
const client = ref<ClientReferenceResource>()
const cancelUrl = ref<string>()

const validationSchema = computed(() => {
  const schema: Record<string, Schema> = {
    ...claimFormService.getSchemasForClaimConfigs(signUpClaims.value)
  }
  if (passwordEnabled.value) {
    schema.password = string().required().label(t('common.password'))
    schema.confirm_password = string()
      .required()
      .oneOf([schemaRef('password')], t('pages.sign_up.passwords_do_not_match'))
      .label(t('common.confirm_password'))
  }
  return object(schema)
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: validationSchema
})
const { busy, moveOn } = useSubmission(router, isSubmitting)

const onSubmit = handleSubmit(async (values: any) => {
  errorMessage.value = undefined
  fieldErrorMessages.value = undefined

  const body = pipe(values, omit(['confirm_password']))

  const result = await signUpApi.signUp(body)
  if (result instanceof SuccessApiResponse) {
    await moveOn(result.content.redirect_url)
  } else {
    fieldErrorMessages.value = getErrorMessageForProperties(result)
    errorMessage.value = getErrorMessage(result)
  }
})

async function onSignInClick(event: MouseEvent) {
  if (!isClickInPlace(event)) {
    return
  }
  event.preventDefault()
  // A sign-up in flight would still move the person on once it answers, away from the sign-in page.
  if (busy.value || !signInRedirectUrl.value) {
    return
  }
  await redirectOrPush(router, signInRedirectUrl.value)
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
    client.value = response.content.client
    cancelUrl.value = response.content.cancel_url
    isLoading.value = false
  } else {
    await router.replace(makeErrorRoute(response.errorCode, response.details, response.description))
  }
})
</script>

<template>
  <base-page :cancel-disabled="busy" :cancel-url="cancelUrl" :client="client">
    <div class="flex justify-center w-full">
      <title-content-card :loading="isLoading">
        <template v-slot:title>
          {{ t('pages.sign_up.title') }}
        </template>
        <template v-slot:default>
          <sa-alert v-if="errorMessage">
            {{ errorMessage }}
          </sa-alert>

          <form class="flex flex-col gap-4" @submit="onSubmit">
            <claims-input-group
              :claims="signUpClaims"
              :disabled="busy"
              :error-messages="fieldErrorMessages"
            />

            <template v-if="passwordEnabled">
              <common-field
                :disabled="busy"
                :error-message="fieldErrorMessages?.['password']"
                :label="t('common.password')"
                autocomplete="new-password"
                name="password"
                type="password"
              />

              <common-field
                :disabled="busy"
                :error-message="fieldErrorMessages?.['confirm_password']"
                :label="t('common.confirm_password')"
                autocomplete="new-password"
                name="confirm_password"
                type="password"
              />
            </template>

            <sa-button :loading="busy" size="large" type="submit">
              <template v-slot:default>
                {{ t('common.continue') }}
              </template>
              <template v-slot:loading>
                {{ t('pages.sign_up.signing_up') }}
              </template>
            </sa-button>
          </form>

          <div v-if="signInRedirectUrl" class="text-center">
            <i18n-t keypath="pages.sign_up.already_have_account">
              <a
                v-bind="linkAttributes(signInRedirectUrl, busy)"
                class="sa-link"
                @click="onSignInClick"
              >
                {{ t('pages.sign_up.sign_in_action') }}
              </a>
            </i18n-t>
          </div>
        </template>
      </title-content-card>
    </div>
  </base-page>
</template>
