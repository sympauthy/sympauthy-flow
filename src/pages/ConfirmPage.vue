<script lang="ts" setup>
import BasePage from '@/components/BasePage.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { ShieldCheckIcon } from '@heroicons/vue/20/solid'
import { SaAlert, SaButton } from '@sympauthy/design'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { confirmApiKey } from '@/client/api/ConfirmApi'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { getErrorMessage } from '@/client/ErrorApiResponse'

const { t } = useI18n()
const router = useRouter()
const confirmApi = injectRequired(confirmApiKey)

const fetchErrorMessage = ref<string | undefined>(undefined)
const action = ref<string | undefined>(undefined)
const requiresReauthentication = ref(false)
const initiatingClientId = ref<string | undefined>(undefined)
const cancelUrl = ref<string | undefined>(undefined)

const submitErrorMessage = ref<string | undefined>(undefined)
const isConfirming = ref(false)
const isCancelling = ref(false)

// The action code is machine-readable (e.g. enroll_mfa); resolve a human label, falling back to the raw code.
const actionLabel = computed(() =>
  action.value === undefined ? '' : t(`pages.confirm.actions.${action.value}`, action.value)
)

onMounted(async () => {
  const response = await confirmApi.fetchConfirmation()
  if (response instanceof SuccessApiResponse) {
    if (response.content.redirect_url !== undefined) {
      // The end-user is not expected on the confirmation step (already confirmed or no confirmation).
      await redirectOrPush(router, response.content.redirect_url)
    } else {
      action.value = response.content.action
      requiresReauthentication.value = response.content.requires_reauthentication ?? false
      initiatingClientId.value = response.content.initiating_client_id
      cancelUrl.value = response.content.cancel_url
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

// The server ends the session and redirects the browser itself, so the link is always followed as a
// full navigation: redirectOrPush would hand it to the router when the API shares the app's base URL.
const onCancel = () => {
  if (cancelUrl.value === undefined) return
  isCancelling.value = true
  document.location.assign(cancelUrl.value)
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
          <sa-alert v-if="submitErrorMessage">
            {{ submitErrorMessage }}
          </sa-alert>

          <div
            class="flex items-start gap-3 rounded-md bg-primary-subtle p-3 text-on-primary-subtle"
          >
            <ShieldCheckIcon class="mt-0.5 size-5 shrink-0" />
            <i18n-t v-if="initiatingClientId" keypath="pages.confirm.request" tag="p">
              <template v-slot:client>
                <strong class="font-semibold">{{ initiatingClientId }}</strong>
              </template>
              <template v-slot:action>{{ actionLabel }}</template>
            </i18n-t>
            <p v-else>{{ t('pages.confirm.request_no_client', { action: actionLabel }) }}</p>
          </div>

          <p v-if="requiresReauthentication" class="flow-small text-gray-700">
            {{ t('pages.confirm.reauthentication_notice') }}
          </p>

          <p class="flow-small font-semibold! text-gray-900">
            {{ t('pages.confirm.warning') }}
          </p>

          <sa-button
            :disabled="isCancelling"
            :submitting="isConfirming"
            size="large"
            type="button"
            @click="onConfirm"
          >
            <template v-slot:default>
              {{ t('pages.confirm.confirm') }}
            </template>
            <template v-slot:submitting>
              {{ t('pages.confirm.confirming') }}
            </template>
          </sa-button>

          <sa-button
            v-if="cancelUrl"
            variant="outline"
            :disabled="isConfirming"
            :submitting="isCancelling"
            size="large"
            type="button"
            @click="onCancel"
          >
            <template v-slot:default>
              {{ t('pages.confirm.cancel') }}
            </template>
            <template v-slot:submitting>
              {{ t('pages.confirm.cancelling') }}
            </template>
          </sa-button>
        </template>
      </title-content-card>

      <title-content-card v-else :loading="!fetchErrorMessage" :error="fetchErrorMessage">
        <template v-slot:title>{{ t('pages.confirm.title') }}</template>
      </title-content-card>
    </div>
  </base-page>
</template>

<style scoped></style>
