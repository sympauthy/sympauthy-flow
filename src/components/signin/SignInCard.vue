<script lang="ts" setup>
import { CommonAlert, CommonButton } from '@sympauthy/design'
import { useI18n } from 'vue-i18n'
import { signInApiKey } from '@/client/api/SignInApi'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { object, string } from 'yup'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
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

const props = defineProps<{
  providers: Array<ProviderResource>
  password?: PasswordResource
  signUpRedirectUrl?: string
}>()

const signInApi = injectRequired(signInApiKey)
const { t } = useI18n()

const submitError = ref<string>()

const router = useRouter()

const validationSchema = object({
  login: string().required(),
  password: string().required()
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: validationSchema
})

const onSubmit = handleSubmit(async (values: any) => {
  submitError.value = undefined

  const result = await signInApi.signIn(values.login, values.password)
  if (result instanceof SuccessApiResponse) {
    await redirectOrPush(router, result.content.redirect_url)
  } else {
    submitError.value = getErrorMessage(result)
  }
})

const loginLabel = computed(() =>
  or(
    i18n,
    (props.password?.identifier_claims ?? []).map((claim) => claim.name)
  )
)

async function onSignUpClick() {
  if (props.signUpRedirectUrl) {
    await redirectOrPush(router, props.signUpRedirectUrl)
  }
}
</script>

<template>
  <title-content-card>
    <template v-slot:title>
      {{ t('components.sign_in_card.title') }}
    </template>
    <template v-slot:default>
      <common-alert v-if="submitError">
        {{ submitError }}
      </common-alert>

      <provider-button v-for="provider of providers" :key="provider.id" :provider="provider" />

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
          :disabled="isSubmitting"
          :label="loginLabel"
          autocomplete="username"
          name="login"
          type="text"
        />

        <div class="flex flex-col gap-1.5">
          <common-input
            :disabled="isSubmitting"
            :label="t('common.password')"
            autocomplete="current-password"
            name="password"
            type="password"
          />
          <div class="flow-small text-end">
            <a class="link">{{ t('components.sign_in_card.forgotten_password') }}</a>
          </div>
        </div>

        <common-button :loading="isSubmitting" size="large" type="submit">
          <template v-slot:default>
            {{ t('common.continue') }}
          </template>
          <template v-slot:loading>
            {{ t('components.sign_in_card.signing_in') }}
          </template>
        </common-button>
      </form>

      <div v-if="signUpRedirectUrl" class="text-center">
        <i18n-t keypath="components.sign_in_card.no_account">
          <a class="link" @click="onSignUpClick">
            {{ t('components.sign_in_card.sign_up_action') }}
          </a>
        </i18n-t>
      </div>
    </template>
  </title-content-card>
</template>
