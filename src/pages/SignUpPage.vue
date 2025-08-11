<script lang='ts' setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { object, string } from 'yup'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { signUpApiKey } from '@/client/api/SignUpApi'
import ClaimsInputGroup from '@/components/claim/group/ClaimsInputGroup.vue'
import { configurationKey } from '@/utils/ConfigurationUtils'
import { claimFormServiceKey } from '@/services/ClaimFormService'
import { getErrorMessage, getErrorMessageForProperties } from '@/client/ErrorApiResponse'
import { useRouter } from 'vue-router'
import CommonAlert from '@/components/CommonAlert.vue'
import CommonField from '@/components/CommonInputField.vue'
import { claimServiceKey } from '@/services/ClaimsService'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import BasePage from '@/components/BasePage.vue'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import CommonButton from '@/components/CommonButton.vue'
import { useForm } from 'vee-validate'
import { filter, pipe } from 'rambda'

const { t } = useI18n()
const router = useRouter()
const claimService = injectRequired(claimServiceKey)
const claimFormService = injectRequired(claimFormServiceKey)
const configuration = injectRequired(configurationKey)
const signUpApi = injectRequired(signUpApiKey)

const errorMessage = ref<String>()
const fieldErrorMessages = ref<Record<string, string>>()

const signUpClaims = claimService.getSignUpClaims(configuration)

const claimSchemas = claimFormService.getSchemasForClaims(configuration, signUpClaims)
const validationSchema = object({
  ...claimSchemas,
  password: string().required(),
  confirm_password: string().required()
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: validationSchema
})

const onSubmit = handleSubmit(async (values: any) => {
  errorMessage.value = undefined
  fieldErrorMessages.value = undefined

  const signUpClaimValue = pipe(
    values,
    filter((it: any) => {
      return it != 'confirm_password'
    })
  )

  const body = {
    ...signUpClaimValue
  }

  const result = await signUpApi.signUp(body)
  if (result instanceof SuccessApiResponse) {
    await redirectOrPush(router, result.content.redirect_url)
  } else {
    fieldErrorMessages.value = getErrorMessageForProperties(result)
    errorMessage.value = getErrorMessage(result)
  }
})

</script>

<template>
  <base-page>
    <div class='flex justify-center w-100'>
      <title-content-card>
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
                                :disabled='isSubmitting'
                                :error-messages='fieldErrorMessages'
                                class='mb-3' />

            <common-field :disabled='isSubmitting'
                          :error-message='fieldErrorMessages?.["password"]'
                          :label="t('common.password')"
                          class='mb-3'
                          name='password'
                          type='password' />

            <common-field :disabled='isSubmitting'
                          :error-message='fieldErrorMessages?.["confirm_password"]'
                          :label="t('common.confirm_password')"
                          class='mb-3'
                          name='confirm_password'
                          type='password' />

            <common-button :loading='isSubmitting'
                           class='w-full mt-5'
                           type='submit'>
              <template v-slot:default>
                {{ t('common.sign_up') }}
              </template>
              <template v-slot:loading>
                {{ t('pages.sign_up.signing_up') }}
              </template>
            </common-button>
          </Form>
        </template>
      </title-content-card>
    </div>
  </base-page>
</template>
