<script lang="ts" setup>
import { SaAlert, SaButton, SaLink } from '@sympauthy/design'
import { useI18n } from 'vue-i18n'
import { signInApiKey } from '@/client/api/SignInApi'
import { injectRequired, redirectOrPush, useSubmission } from '@/utils/VueUtils'
import { object, string } from 'yup'
import { useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { getErrorMessage } from '@/client/ErrorApiResponse'
import { useRouter } from 'vue-router'
import CommonInput from '@/components/CommonInputField.vue'
import ProviderButton from '@/components/signin/ProviderButton.vue'
import { or } from '@/utils/StringUtils'
import { i18n } from '@/i18n'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import type { PasswordResource } from '@/client/model/PasswordResource'
import type { ProviderResource } from '@/client/model/ProviderResource'
import type { ClientReferenceResource } from '@/client/model/ClientReferenceResource'
import { useResetPassword } from '@/stores/ResetPasswordStore'

const props = defineProps<{
  providers: Array<ProviderResource>
  password?: PasswordResource
  resetPasswordRedirectUrl?: string
  client?: ClientReferenceResource
}>()

// Told to the page, for the controls it draws outside the card.
const signingIn = defineModel<boolean>('signingIn', { default: false })

const signInApi = injectRequired(signInApiKey)
const { t } = useI18n()
const resetPassword = useResetPassword()

const submitError = ref<string>()

const router = useRouter()

const loginLabel = computed(() =>
  or(
    i18n,
    (props.password?.identifier_claims ?? []).map((claim) => claim.name)
  )
)

const validationSchema = object({
  login: string().required().label(loginLabel.value),
  password: string().required().label(t('common.password'))
})

const { handleSubmit, isSubmitting, values } = useForm({
  validationSchema: validationSchema
})
const { busy, moveOn } = useSubmission(router, isSubmitting)
watch(busy, (value) => {
  signingIn.value = value
})

const onSubmit = handleSubmit(async (values: any) => {
  submitError.value = undefined

  const result = await signInApi.signIn(values.login, values.password)
  if (result instanceof SuccessApiResponse) {
    await moveOn(result.content.redirect_url)
  } else {
    submitError.value = getErrorMessage(result)
  }
})

async function onForgottenPasswordClick(event: MouseEvent) {
  // A link opened in another tab or window is a full page load, which carries no identifier.
  if (
    !props.resetPasswordRedirectUrl ||
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  ) {
    return
  }
  event.preventDefault()
  // A sign-in in flight would still move the person on once it answers, away from the reset page.
  if (busy.value) {
    return
  }
  // Held by the app, never put in the address, so that the first reset page opens with it.
  resetPassword.login = values.login
  await redirectOrPush(router, props.resetPasswordRedirectUrl)
}
</script>

<template>
  <title-content-card>
    <template v-slot:title>
      {{ t('components.sign_in_card.title') }}
    </template>
    <!-- Named only by its display name: its identifier is not a name a person recognises. -->
    <template v-if="client?.display_name" v-slot:subtitle>
      <i18n-t keypath="components.sign_in_card.client">
        <template v-slot:client>
          <strong class="font-semibold text-gray-900">{{ client.display_name }}</strong>
        </template>
      </i18n-t>
    </template>
    <template v-slot:default>
      <sa-alert v-if="submitError">
        {{ submitError }}
      </sa-alert>

      <!-- A provider pressed while a sign-in is on its way would race it. -->
      <provider-button
        v-for="provider of providers"
        :key="provider.id"
        :disabled="busy"
        :provider="provider"
      />

      <div
        v-if="providers.length > 0 && password"
        class="flow-small flex items-center gap-3 text-gray-500"
      >
        <span class="h-px flex-1 bg-gray-200"></span>
        {{ t('components.sign_in_card.or') }}
        <span class="h-px flex-1 bg-gray-200"></span>
      </div>

      <form v-if="password" class="flex flex-col gap-4" @submit="onSubmit">
        <common-input
          :disabled="busy"
          :label="loginLabel"
          autocomplete="username"
          name="login"
          type="text"
        />

        <common-input
          :disabled="busy"
          :label="t('common.password')"
          autocomplete="current-password"
          name="password"
          revealable
          type="password"
        />

        <sa-button :loading="busy" size="large" type="submit">
          <template v-slot:default>
            {{ t('common.continue') }}
          </template>
          <template v-slot:loading>
            {{ t('components.sign_in_card.signing_in') }}
          </template>
        </sa-button>
      </form>

      <div v-if="password && resetPasswordRedirectUrl" class="flex justify-center">
        <sa-link
          :label="t('components.sign_in_card.forgotten_password')"
          :link="{
            href: resetPasswordRedirectUrl,
            'aria-disabled': busy,
            onClick: onForgottenPasswordClick
          }"
        />
      </div>
    </template>
  </title-content-card>
</template>
