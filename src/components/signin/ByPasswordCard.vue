<script lang='ts' setup>
import { useI18n } from 'vue-i18n'
import { signInApiKey } from '@/client/api/SignInApi'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { object, string } from 'yup'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { getErrorMessage } from '@/client/ErrorApiResponse'
import { useRouter } from 'vue-router'
import CommonButton from '@/components/CommonButton.vue'
import CommonAlert from '@/components/CommonAlert.vue'
import CommonInput from '@/components/CommonInputField.vue'
import { configurationKey } from '@/utils/ConfigurationUtils'
import { or } from '@/utils/StringUtils'
import { i18n } from '@/i18n'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'

const signInApi = injectRequired(signInApiKey)
const { t } = useI18n()

const submitError = ref<String>()

const router = useRouter()
const configuration = injectRequired(configurationKey)

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

const loginLabel = computed(() => {
  const claims = configuration.claims || []
  const loginClaims = (configuration.password?.login_claims || [])
    .map((claim) => {
      return claims.find(it => it.id == claim)?.name
    })
    .filter((it): it is string => !!it)
  return or(i18n, loginClaims)
})

</script>

<template>
  <title-content-card>
    <template v-slot:title>
      {{ t('components.by_password_card.title') }}
    </template>
    <template v-slot:default>
      <div class='mb-3 w-100 text-center'>
        <i18n-t keypath='components.by_password_card.no_account'>
          <router-link :to="{ name: 'SignUp' }" class='text-primary underline'>
            {{ t('components.by_password_card.sign_up_action') }}
          </router-link>
        </i18n-t>
      </div>

      <common-alert v-if='submitError' class='mb-5'>
        {{ submitError }}
      </common-alert>

      <form @submit='onSubmit'>
        <label class='form-label' for='login'></label>
        <common-input :disabled='isSubmitting'
                      :label='loginLabel'
                      class='mb-3'
                      name='login'
                      type='text' />

        <common-input :disabled='isSubmitting'
                      :label="t('common.password')"
                      class='mb-3'
                      name='password'
                      type='password' />

        <div class='w-100 text-end text-primary underline'>
          <a>{{ t('components.by_password_card.forgotten_password') }}</a>
        </div>

        <common-button :loading='isSubmitting'
                       class='w-full mt-5'
                       type='submit'>
          <template v-slot:default>
            {{ t('common.sign_in') }}
          </template>
          <template v-slot:loading>
            {{ t('components.by_password_card.signing_in') }}
          </template>
        </common-button>
      </form>
    </template>
  </title-content-card>
</template>
