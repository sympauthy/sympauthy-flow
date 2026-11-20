<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import BasePage from '@/components/BasePage.vue'
import { SaAlert } from '@sympauthy/design'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { errorApiKey } from '@/client/api/ErrorApi'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
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
const reason = ref<ErrorReason | undefined>(undefined)

async function fetchErrorReason(): Promise<ErrorReason | undefined> {
  const response = await errorApi.getError()
  if (response instanceof SuccessApiResponse) {
    if (response.content.redirect_url !== undefined) {
      await redirectOrPush(router, response.content.redirect_url)
      return undefined
    }
    return response.content
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
          <p class="flow-small text-gray-500">
            <span>{{ reason.error_code }}</span>
            <span v-if="reason.details"> - {{ reason.details }}</span>
          </p>
        </template>
      </title-content-card>
    </div>
  </base-page>
</template>
