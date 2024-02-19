<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { useConfiguration } from '@/stores/ConfigurationStore'
import { storeToRefs } from 'pinia'
import { signInApiKey } from '@/client/api/SignInApi'
import { injectRequired } from '@/utils/VueUtils'
import { object, string } from 'yup'
import { useForm } from 'vee-validate'
import { useState } from '@/stores/StateStore'
import { ref } from 'vue'
import { getErrorMessageOrThrow } from '@/exception/ApiException'

const signInApi = injectRequired(signInApiKey)
const { t } = useI18n()
const configStore = useConfiguration()
const stateStore = useState()
const { configuration } = storeToRefs(configStore)

const isSubmitting = ref<Boolean>(false)
const submitError = ref<String>()

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
    console.log(result)
  } catch (e) {
    submitError.value = getErrorMessageOrThrow(e)
  } finally {
    isSubmitting.value = false
  }
})

</script>

<template>
  <div class='card'>
    <div class='card-body'>
      <h5 class='card-title w-100 text-center mb-3'>
        {{ t('components.by_password_card.title') }}
      </h5>

      <div v-if='submitError' class='alert alert-danger mb-3' role='alert'>
        {{ submitError }}
      </div>

      <div class='mb-3 w-100 text-center'>
        <i18n-t keypath='components.by_password_card.no_account'>
          <router-link :to='{name: "SignUp"}'>
            {{ t('components.by_password_card.sign_up_action') }}
          </router-link>
        </i18n-t>
      </div>

      <form @submit='onSubmit' novalidate>
        <div class='mb-3'>
          <label for='login' class='form-label'></label>
          <input id='login'
                 type='text'
                 class='form-control'
                 :class='{"is-invalid": errors.login}'
                 v-model='login'
                 v-bind='loginAttrs'>
          <div class='invalid-feedback' :class='{"d-block": errors.login}'>
            {{ errors.login }}
          </div>
        </div>

        <div class='mb-1'>
          <label for='password' class='form-label'>
            {{ t('common.password') }}
          </label>
          <input id='password'
                 type='text'
                 class='form-control'
                 :class='{"is-invalid": errors.password}'
                 v-model='password'
                 v-bind='passwordAttrs'>
          <div class='invalid-feedback' :class='{"d-block": errors.password}'>
            {{ errors.password }}
          </div>
        </div>
        <div class='w-100 text-end'>
          <a>{{ t('components.by_password_card.forgotten_password') }}</a>
        </div>

        <button type='submit'
                class='btn btn-primary w-100 mt-5'>
          {{ t('common.sign_in') }}
        </button>
      </form>

    </div>
  </div>
</template>

<style scoped>

</style>
