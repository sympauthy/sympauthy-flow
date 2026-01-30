<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BasePage from '@/components/BasePage.vue'
import BaseCard from '@/components/card/BaseCard.vue'
import SkeletonText from '@/components/SkeletonText.vue'
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
    <div class='flex justify-center w-100'>
      <base-card>
        <template v-slot:title>
          {{ t('pages.error.title') }}
        </template>

        <p v-if="fetchErrorMessage" class='mb-3 text-red-600'>
          {{ fetchErrorMessage }}
        </p>

        <template v-if="isLoading">
          <skeleton-text :count="3" class='mb-3'></skeleton-text>
          <hr class='m-3'>
          <skeleton-text class='text-sm'></skeleton-text>
        </template>

        <template v-else>
          <p class='mb-3'>
            {{ description }}
          </p>
          <hr class='m-3'>
          <p class='text-sm' style='color: var(--color-on-body);'>
            {{ errorCode }} - {{ details }}
          </p>
        </template>
      </base-card>
    </div>
  </base-page>
</template>
