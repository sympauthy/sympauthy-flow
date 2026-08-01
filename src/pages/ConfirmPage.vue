<script lang="ts" setup>
import BasePage from '@/components/BasePage.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import CommonAlert from '@/components/CommonAlert.vue'
import CommonButton from '@/components/CommonButton.vue'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { confirmApiKey } from '@/client/api/ConfirmApi'
import { cancelApiKey } from '@/client/api/CancelApi'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { getErrorMessage } from '@/client/ErrorApiResponse'
import { secondaryButton } from '@/styles/ButtonStyle'

const { t } = useI18n()
const router = useRouter()
const confirmApi = injectRequired(confirmApiKey)
const cancelApi = injectRequired(cancelApiKey)

const fetchErrorMessage = ref<string | undefined>(undefined)
const action = ref<string | undefined>(undefined)
const initiatingClientId = ref<string | undefined>(undefined)

const submitErrorMessage = ref<string | undefined>(undefined)
const isConfirming = ref(false)
const isCancelling = ref(false)

// The action code is machine-readable (e.g. ENROLL_MFA); resolve a human label, falling back to the raw code.
const request = computed(() => {
  if (action.value === undefined) {
    return ''
  }
  const actionLabel = t(`pages.confirm.actions.${action.value}`, action.value)
  return initiatingClientId.value !== undefined
    ? t('pages.confirm.request', { client: initiatingClientId.value, action: actionLabel })
    : t('pages.confirm.request_no_client', { action: actionLabel })
})

onMounted(async () => {
  const response = await confirmApi.fetchConfirmation()
  if (response instanceof SuccessApiResponse) {
    if (response.content.redirect_url !== undefined) {
      // The end-user is not expected on the confirmation step (already confirmed or no confirmation).
      await redirectOrPush(router, response.content.redirect_url)
    } else {
      action.value = response.content.action
      initiatingClientId.value = response.content.initiating_client_id
    }
  } else {
    fetchErrorMessage.value = getErrorMessage(response)
  }
})

const onConfirm = async () => {
  submitErrorMessage.value = undefined
  isConfirming.value = true

  const response = await confirmApi.confirm()
  if (response instanceof SuccessApiResponse) {
    await redirectOrPush(router, response.content.redirect_url)
  } else {
    submitErrorMessage.value = getErrorMessage(response)
    isConfirming.value = false
  }
}

const onCancel = async () => {
  submitErrorMessage.value = undefined
  isCancelling.value = true

  const response = await cancelApi.cancel()
  if (response instanceof SuccessApiResponse) {
    await redirectOrPush(router, response.content.redirect_url)
  } else {
    submitErrorMessage.value = getErrorMessage(response)
    isCancelling.value = false
  }
}
</script>

<template>
  <base-page>
    <div class="flex justify-center w-full">
      <title-content-card v-if="action" size="default">
        <template v-slot:title>
          {{ t('pages.confirm.title') }}
        </template>

        <template v-slot:default>
          <common-alert v-if="submitErrorMessage" class="mb-3">
            {{ submitErrorMessage }}
          </common-alert>

          <p class="w-full mb-3 text-justify">
            {{ request }}
          </p>

          <p class="w-full mb-7 text-justify font-semibold">
            {{ t('pages.confirm.warning') }}
          </p>

          <div class="flex flex-col gap-3 w-full">
            <common-button
              :submitting="isConfirming"
              :disabled="isCancelling"
              class="w-full"
              type="button"
              @click="onConfirm"
            >
              <template v-slot:default>
                {{ t('pages.confirm.confirm') }}
              </template>
              <template v-slot:submitting>
                {{ t('pages.confirm.confirming') }}
              </template>
            </common-button>

            <common-button
              :button-style="secondaryButton"
              :submitting="isCancelling"
              :disabled="isConfirming"
              class="w-full"
              type="button"
              @click="onCancel"
            >
              <template v-slot:default>
                {{ t('pages.confirm.cancel') }}
              </template>
              <template v-slot:submitting>
                {{ t('pages.confirm.cancelling') }}
              </template>
            </common-button>
          </div>
        </template>
      </title-content-card>

      <title-content-card v-else :loading="!fetchErrorMessage" :error="fetchErrorMessage">
        <template v-slot:title>{{ t('pages.confirm.title') }}</template>
      </title-content-card>
    </div>
  </base-page>
</template>

<style scoped></style>
