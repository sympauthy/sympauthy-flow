<script setup lang='ts'>
import BasePage from '@/components/BasePage.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { object, string } from 'yup'
import { injectRequired, redirectOrReplace } from '@/utils/VueUtils'
import { signUpApiKey, type SignUpInputResource } from '@/client/api/SignUpApi'
import ClaimsInputGroup from '@/components/claim/group/ClaimsInputGroup.vue'
import { configurationKey } from '@/utils/ConfigurationUtils'
import { claimFormServiceKey } from '@/services/ClaimFormService'
import type { SignUpResultResource } from '@/client/model/SignUpResultResource'
import { getErrorMessageOrThrow } from '@/exception/ApiException'
import { useRouter } from 'vue-router'
import { filter } from 'rambda/immutable'

const { t } = useI18n()
const router = useRouter()
const claimFormService = injectRequired(claimFormServiceKey)
const configuration = injectRequired(configurationKey)
const signUpApi = injectRequired(signUpApiKey)

const isSubmitting = ref<Boolean>(false)
const submitError = ref<String>()

const claimSchemas = claimFormService.getSchemasForClaims(configuration, configuration.password?.sign_up_claims || [])

const validationSchema = object({
  ...claimSchemas,
  password: string().required(),
  confirm_password: string().required()
})

const onSubmit = async (values: any) => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  const body = {
    ...filter((_: any, prop: string) => prop != 'confirm_password', values)
  }

  let result: SignUpResultResource
  try {
    result = await signUpApi.signUp(body)
  } catch (e) {
    submitError.value = getErrorMessageOrThrow(e)
    return
  } finally {
    isSubmitting.value = false
  }

  await redirectOrReplace(router, result.redirect_url)
}

/*
const onSubmit = handleSubmit(async (values) => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  submitError.value = undefined
  try {
    const result = await signUpApi.signUp(values.login, values.password)
    console.log(result)
  } catch (e) {
    submitError.value = getErrorMessageOrThrow(e)
  } finally {
    isSubmitting.value = false
  }
})
 */
</script>

<template>
  <base-page>
    <div class='card'>
      <div class='card-body'>
        <h5 class='card-title w-100 text-center mb-3'>
          {{ t('pages.sign_up.title') }}
        </h5>

        <div class='mb-3 w-100 text-center'>
          <i18n-t keypath='pages.sign_up.already_have_account'>
            <router-link :to='{name: "SignIn"}'>
              {{ t('pages.sign_up.sign_in_action') }}
            </router-link>
          </i18n-t>
        </div>

        <div v-if='submitError' class='alert alert-danger mb-3' role='alert'>
          {{ submitError }}
        </div>

        <Form @submit='onSubmit' :validation-schema='validationSchema' v-slot='{errors}'>
          <claims-input-group v-if='configuration.password?.sign_up_claims'
                              :configs='configuration.password.sign_up_claims' />

          <div class='form-field'>
            <label for='password' class='form-label'>
              {{ t('common.password') }}
            </label>
            <Field name='password'
                   type='password'
                   class='form-control'
                   :class='{"is-invalid": errors.password}' />
            <ErrorMessage name='password' class='invalid-feedback' />
          </div>

          <div class='form-field'>
            <label for='confirm_password' class='form-label'>
              {{ t('common.confirm_password') }}
            </label>
            <Field name='confirm_password'
                   type='password'
                   class='form-control'
                   :class='{"is-invalid": errors.confirm_password}' />
            <ErrorMessage name='password' class='invalid-feedback' />
          </div>

          <button type='submit'
                  class='btn btn-primary w-100 mt-5'>
            {{ t('common.sign_up') }}
          </button>
        </Form>
      </div>
    </div>
  </base-page>
</template>

<style scoped>

</style>
