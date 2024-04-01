<script setup lang='ts'>
import BasePage from '@/components/BasePage.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { object, string } from 'yup'
import { injectRequired, redirectOrReplace } from '@/utils/VueUtils'
import { signUpApiKey } from '@/client/api/SignUpApi'
import ClaimsInputGroup from '@/components/claim/group/ClaimsInputGroup.vue'
import { configurationKey } from '@/utils/ConfigurationUtils'
import { claimFormServiceKey } from '@/services/ClaimFormService'
import type { SignUpResultResource } from '@/client/model/SignUpResultResource'
import { getErrorMessageOrThrow } from '@/exception/ApiException'
import { useRouter } from 'vue-router'
import { filter } from 'rambda/immutable'
import BaseCard from '@/components/BaseCard.vue'
import CommonAlert from '@/components/CommonAlert.vue'
import CommonField from '@/components/CommonField.vue'

const { t } = useI18n()
const router = useRouter()
const claimFormService = injectRequired(claimFormServiceKey)
const configuration = injectRequired(configurationKey)
const signUpApi = injectRequired(signUpApiKey)

const isSubmitting = ref<Boolean>(false)
const submitError = ref<String>()

const claimSchemas = claimFormService.getSchemasForClaims(
  configuration,
  configuration.password?.sign_up_claims || []
)

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

</script>

<template>
  <base-page>
    <div class='flex justify-center w-100'>
      <base-card>
        <template v-slot:title>
          {{ t('pages.sign_up.title') }}
        </template>
        <template v-slot:default>
          <div class='mb-3 w-100 text-center'>
            <i18n-t keypath='pages.sign_up.already_have_account'>
              <router-link :to="{ name: 'SignIn' }" class='text-primary underline'>
                {{ t('pages.sign_up.sign_in_action') }}
              </router-link>
            </i18n-t>
          </div>

          <common-alert v-if='submitError' class='mb-3'>
            {{ submitError }}
          </common-alert>
          <div v-if='submitError' class='alert alert-danger mb-3' role='alert'>

          </div>

          <Form @submit='onSubmit' :validation-schema='validationSchema'>
            <claims-input-group
              v-if='configuration.password?.sign_up_claims'
              :configs='configuration.password.sign_up_claims'
              class='mb-3'
            />

            <common-field name='password'
                          type='password'
                          class='mb-3'
                          :label="t('common.password')" />

            <common-field name='confirm_password'
                          type='password'
                          class='mb-3'
                          :label="t('common.confirm_password')" />

            <button type='submit' class='btn btn-primary w-full mt-5'>
              {{ t('common.sign_up') }}
            </button>
          </Form>
        </template>
      </base-card>
    </div>
  </base-page>
</template>

<style scoped></style>
