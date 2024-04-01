<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { signInApiKey } from '@/client/api/SignInApi'
import { injectRequired, redirectOrReplace } from '@/utils/VueUtils'
import { object, string } from 'yup'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { getErrorMessageOrThrow } from '@/exception/ApiException'
import { useRouter } from 'vue-router'
import CommonButton from '@/components/CommonButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import CommonAlert from '@/components/CommonAlert.vue'

const signInApi = injectRequired(signInApiKey)
const { t } = useI18n()

const isSubmitting = ref<boolean>(false)
const submitError = ref<String>()

const router = useRouter()

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: object({
    login: string().required(),
    password: string().required()
  })
})
const [login, loginAttrs] = defineField('login')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
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
})
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

      <form @submit="onSubmit" novalidate>
        <label for='login' class='form-label'></label>
        <input
          id='login'
          type='text'
          class='form-input'
          :disabled='isSubmitting'
          :class="{ 'is-invalid': errors.login }"
          v-model='login'
          v-bind='loginAttrs'
        />
        <div class='invalid-feedback' :class="{ 'd-block': errors.login }">
          {{ errors.login }}
        </div>

        <div class="mb-1">
          <label for="password" class="form-label">
            {{ t('common.password') }}
          </label>
          <input
            id="password"
            type="password"
            class="form-input"
            :disabled="isSubmitting"
            :class="{ 'is-invalid': errors.password }"
            v-model="password"
            v-bind="passwordAttrs"
          />
          <div class="invalid-feedback" :class="{ 'd-block': errors.password }">
            {{ errors.password }}
          </div>
        </div>
        <div class="w-100 text-end text-primary underline">
          <a>{{ t('components.by_password_card.forgotten_password') }}</a>
        </div>

        <common-button type="submit" class="btn-primary w-full mt-5">
          {{ t('common.sign_in') }}
        </common-button>
      </form>
    </template>
  </base-card>
</template>
