<script lang='ts' setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { Form } from 'vee-validate'
import { object, string } from 'yup'
import { injectRequired, redirectOrReplace } from '@/utils/VueUtils'
import { signUpApiKey } from '@/client/api/SignUpApi'
import ClaimsInputGroup from '@/components/claim/group/ClaimsInputGroup.vue'
import { configurationKey } from '@/utils/ConfigurationUtils'
import { claimFormServiceKey } from '@/services/ClaimFormService'
import { getErrorMessageForProperties, getErrorMessageOrThrow } from '@/exception/ApiException'
import { useRouter } from 'vue-router'
import { filter } from 'rambda/immutable'
import BaseCard from '@/components/card/BaseCard.vue'
import CommonAlert from '@/components/CommonAlert.vue'
import CommonField from '@/components/CommonField.vue'
import { claimServiceKey } from '@/services/ClaimsService'
import type { FlowResultResource } from '@/client/model/FlowResultResource'
import TitleContentCard from '@/components/card/TitleContentCard.vue'

const { t } = useI18n()
const router = useRouter()
const claimService = injectRequired(claimServiceKey)
const claimFormService = injectRequired(claimFormServiceKey)
const configuration = injectRequired(configurationKey)
const signUpApi = injectRequired(signUpApiKey)

const isSubmitting = ref<Boolean>(false)

const errorMessage = ref<String>()
const fieldErrorMessages = ref<Record<string, string>>()

const signUpClaims = claimService.getSignUpClaims(configuration)

const claimSchemas = claimFormService.getSchemasForClaims(configuration, signUpClaims)
const validationSchema = object({
  ...claimSchemas,
  password: string().required(),
  confirm_password: string().required()
})

const onSubmit = async (values: any) => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  errorMessage.value = undefined
  fieldErrorMessages.value = undefined

  const body = {
    ...filter((_: any, prop: string) => prop != 'confirm_password', values)
  }

  let result: FlowResultResource
  try {
    result = await signUpApi.signUp(body)
  } catch (e) {
    fieldErrorMessages.value = getErrorMessageForProperties(e)
    errorMessage.value = getErrorMessageOrThrow(e)
    return
  } finally {
    isSubmitting.value = false
  }

  await redirectOrReplace(router, result.redirect_url)
}

</script>

<template>
  <title-content-card>
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

          <common-alert v-if='errorMessage' class='mb-3'>
            {{ errorMessage }}
          </common-alert>

          <Form :validation-schema='validationSchema' @submit='onSubmit'>
            <claims-input-group :claims='signUpClaims'
                                :error-messages='fieldErrorMessages'
                                class='mb-3' />

            <common-field :error-message='fieldErrorMessages?.["password"]'
                          :label="t('common.password')"
                          class='mb-3'
                          name='password'
                          type='password' />

            <common-field :error-message='fieldErrorMessages?.["confirm_password"]'
                          :label="t('common.confirm_password')"
                          class='mb-3'
                          name='confirm_password'
                          type='password' />

            <button class='btn btn-primary w-full mt-5' type='submit'>
              {{ t('common.sign_up') }}
            </button>
          </Form>
        </template>
      </base-card>
    </div>
  </title-content-card>
</template>
