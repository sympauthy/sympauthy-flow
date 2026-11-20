<script lang="ts" setup>
import { SaAlert, SaButton, SaLink } from '@sympauthy/design'
import { useI18n } from 'vue-i18n'
import { signInApiKey } from '@/client/api/SignInApi'
import { injectRequired, isClickInPlace, redirectOrPush, useSubmission } from '@/utils/VueUtils'
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
import { type ClientReferenceResource, getClientName } from '@/client/model/ClientReferenceResource'
import { useResetPassword } from '@/stores/ResetPasswordStore'

const props = defineProps<{
  providers: Array<ProviderResource>
  password?: PasswordResource
  resetPasswordRedirectUrl?: string
  client?: ClientReferenceResource
}>()

const emit = defineEmits<{
  // Whether a sign-in is on its way or has moved the person on, for the controls the page draws
  // outside the card.
  busy: [busy: boolean]
}>()

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
const clientName = computed(() => getClientName(props.client))

const { busy, moveOn } = useSubmission(router, isSubmitting)
watch(busy, (value) => emit('busy', value))

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
  if (!props.resetPasswordRedirectUrl || !isClickInPlace(event)) {
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
    <template v-if="clientName" v-slot:subtitle>
      <i18n-t keypath="components.sign_in_card.client">
        <template v-slot:client>
          <strong class="font-semibold text-gray-900">{{ clientName }}</strong>
        </template>
      </i18n-t>
    </template>
    <template v-slot:default>
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
        <!-- With the form it is about, rather than above the providers it does not concern. -->
        <sa-alert v-if="submitError">
          {{ submitError }}
        </sa-alert>

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
