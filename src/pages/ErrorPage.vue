<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BasePage from '@/components/BasePage.vue'
import { CommonAlert } from '@sympauthy/design'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { errorApiKey } from '@/client/api/ErrorApi'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { getErrorMessage } from '@/client/ErrorApiResponse'

const { t } = useI18n()
const router = useRouter()
const errorApi = injectRequired(errorApiKey)

const isLoading = ref(true)
const errorCode = ref<string | undefined>(undefined)
const details = ref<string | undefined>(undefined)
const description = ref<string | undefined>(undefined)
const fetchErrorMessage = ref<string | undefined>(undefined)

onMounted(async () => {
  const response = await errorApi.getError()

  if (response instanceof SuccessApiResponse) {
    if (response.content.redirect_url !== undefined) {
      await redirectOrPush(router, response.content.redirect_url)
    } else {
      errorCode.value = response.content.error_code
      details.value = response.content.details
      description.value = response.content.description
    }
  } else {
    fetchErrorMessage.value = getErrorMessage(response)
  }

  isLoading.value = false
})
</script>

<template>
  <base-page>
    <div class="flex justify-center w-full">
      <title-content-card :error="fetchErrorMessage" :loading="isLoading">
        <template v-slot:title>
          {{ t('pages.error.title') }}
        </template>

        <common-alert>
          {{ description }}
        </common-alert>
        <p class="flow-small text-gray-500">{{ errorCode }} - {{ details }}</p>
      </title-content-card>
    </div>
  </base-page>
</template>
