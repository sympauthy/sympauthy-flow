<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { signInApiKey } from '@/client/api/SignInApi'
import { injectRequired, redirectOrReplace } from '@/utils/VueUtils'
import { object, string } from 'yup'
import { Form } from 'vee-validate'
import { computed, ref } from 'vue'
import { getErrorMessageOrThrow } from '@/exception/ApiException'
import { useRouter } from 'vue-router'
import CommonButton from '@/components/CommonButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import CommonAlert from '@/components/CommonAlert.vue'
import CommonInput from '@/components/CommonField.vue'
import { configurationKey } from '@/utils/ConfigurationUtils'
import { or } from '@/utils/StringUtils'
import { i18n } from '@/i18n'

const signInApi = injectRequired(signInApiKey)
const { t } = useI18n()

const isSubmitting = ref<boolean>(false)
const submitError = ref<String>()

const router = useRouter()
const configuration = injectRequired(configurationKey)

const loginLabel = computed(() => {
  const claims = configuration.claims || []
  const loginClaims = (configuration.password?.login_claims || [])
    .map((claim) => {
      return claims.find(it => it.id == claim)?.name
    })
    .filter((it): it is string => !!it)
  return or(i18n, loginClaims)
})

const validationSchema = object({
  login: string().required(),
  password: string().required()
})

const onSubmit = async (values: any) => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  submitError.value = undefined

  try {
    const result = await signInApi.signIn(values.login, values.password)
    await redirectOrReplace(router, result.redirect_url)
  } catch (e) {
    submitError.value = getErrorMessageOrThrow(e)
    return
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <base-card>
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

      <Form @submit='onSubmit' :validation-schema='validationSchema'>
        <label for='login' class='form-label'></label>
        <common-input name='login'
                      type='text'
                      class='mb-3'
                      :label='loginLabel'
                      :disabled='isSubmitting' />

        <common-input name='password'
                      class='mb-3'
                      type='password'
                      :label="t('common.password')" />

        <div class='w-100 text-end text-primary underline'>
          <a>{{ t('components.by_password_card.forgotten_password') }}</a>
        </div>

        <common-button type='submit' class='btn-primary w-full mt-5'>
          {{ t('common.sign_in') }}
        </common-button>
      </Form>
    </template>
  </base-card>
</template>
