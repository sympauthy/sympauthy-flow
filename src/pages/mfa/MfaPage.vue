<script lang="ts" setup>
import BasePage from '@/components/BasePage.vue'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { mfaApiKey } from '@/client/api/MfaApi'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { getErrorMessage } from '@/client/ErrorApiResponse'
import CommonAlert from '@/components/CommonAlert.vue'
import MfaMethodSelectionCard from '@/components/mfa/MfaMethodSelectionCard.vue'
import type { MfaMethodResource } from '@/client/model/MfaFlowResource'

const router = useRouter()
const mfaApi = injectRequired(mfaApiKey)

const fetchErrorMessage = ref<string | undefined>(undefined)
const methods = ref<MfaMethodResource[] | undefined>(undefined)
const skipRedirectUrl = ref<string | undefined>(undefined)

onMounted(async () => {
  const response = await mfaApi.fetchMfaStep()
  if (response instanceof SuccessApiResponse) {
    if (response.content.redirect_url !== undefined) {
      await redirectOrPush(router, response.content.redirect_url)
    } else {
      methods.value = response.content.methods
      skipRedirectUrl.value = response.content.skip_redirect_url
    }
  } else {
    fetchErrorMessage.value = getErrorMessage(response)
  }
})
</script>

<template>
  <base-page>
    <div class="flex justify-center w-full">
      <common-alert v-if="fetchErrorMessage">
        {{ fetchErrorMessage }}
      </common-alert>

      <mfa-method-selection-card
        v-else-if="methods"
        :methods="methods"
        :skip-redirect-url="skipRedirectUrl"
      />
    </div>
  </base-page>
</template>

<style scoped></style>
