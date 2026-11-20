<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import BasePage from '@/components/BasePage.vue'
import { SaAlert } from '@sympauthy/design'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import CancelButton from '@/components/CancelButton.vue'
import { errorApiKey } from '@/client/api/ErrorApi'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import type { FlowStepResource } from '@/client/model/FlowStepResource'
import {
  type ErrorReason,
  getErrorReason,
  getStateQueryParam,
  makeErrorReason,
  makeMissingStateErrorReason
} from '@/router'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const errorApi = injectRequired(errorApiKey)

const isLoading = ref(true)
// Only a step loaded from the server carries the way back: a reason sent by a page comes without.
const reason = ref<(ErrorReason & FlowStepResource) | undefined>(undefined)

async function fetchErrorReason(): Promise<(ErrorReason & FlowStepResource) | undefined> {
  const response = await errorApi.getError()
  if (response instanceof SuccessApiResponse) {
    if (response.content.redirect_url !== undefined) {
      await redirectOrPush(router, response.content.redirect_url)
      return undefined
    }
    // The server leaves the code out only beside a redirect.
    return { ...response.content, error_code: response.content.error_code ?? 'api.unknown' }
  } else {
    return makeErrorReason(response.errorCode, response.details, response.description)
  }
}

onMounted(async () => {
  // The page that sent the end-user here knows why, and there may be no state left to ask the server.
  const sentReason = getErrorReason(router.options.history.state)
  if (sentReason !== undefined) {
    reason.value = sentReason
  } else if (getStateQueryParam(route) === undefined) {
    reason.value = makeMissingStateErrorReason()
  } else {
    reason.value = await fetchErrorReason()
  }
  isLoading.value = false
})
</script>

<template>
  <base-page>
    <div class="flex justify-center w-full">
      <title-content-card :loading="isLoading">
        <template v-slot:title>
          {{ t('pages.error.title') }}
        </template>

        <template v-if="reason">
          <sa-alert>
            {{ reason.description ?? t('errors.unknown.description') }}
          </sa-alert>
          <cancel-button
            :cancel-url="reason.cancel_url"
            :client="reason.client"
            ended
            size="large"
            variant="outline"
          />
          <p class="flow-small text-gray-500">
            <span>{{ reason.error_code }}</span>
            <span v-if="reason.details"> - {{ reason.details }}</span>
          </p>
        </template>
      </title-content-card>
    </div>
  </base-page>
</template>
