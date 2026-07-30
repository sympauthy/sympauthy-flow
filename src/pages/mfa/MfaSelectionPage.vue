<script lang="ts" setup>
import BasePage from '@/components/BasePage.vue'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { mfaApiKey } from '@/client/api/MfaApi'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { getErrorMessage } from '@/client/ErrorApiResponse'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import MfaMethodSelectionCard from '@/components/mfa/MfaMethodSelectionCard.vue'
import type { MfaMethodResource } from '@/client/model/MfaFlowResource'

type MfaKind = 'enrollment' | 'challenge'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const mfaApi = injectRequired(mfaApiKey)

// Whether this page selects a method to enroll or an enrolled method to challenge is set by the route meta.
const mfaKind = route.meta.mfaKind as MfaKind
const titleKey = `pages.mfa.${mfaKind}.title`
const descriptionKey = `pages.mfa.${mfaKind}.description`

const fetchErrorMessage = ref<string | undefined>(undefined)
const methods = ref<MfaMethodResource[] | undefined>(undefined)
const skipRedirectUrl = ref<string | undefined>(undefined)

onMounted(async () => {
  const response =
    mfaKind === 'enrollment'
      ? await mfaApi.fetchEnrollmentSelection()
      : await mfaApi.fetchChallengeSelection()
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
      <mfa-method-selection-card
        v-if="methods"
        :methods="methods"
        :title-key="titleKey"
        :description-key="descriptionKey"
        :skip-redirect-url="skipRedirectUrl"
      />
      <title-content-card v-else :loading="!fetchErrorMessage" :error="fetchErrorMessage">
        <template v-slot:title>{{ t(titleKey) }}</template>
      </title-content-card>
    </div>
  </base-page>
</template>

<style scoped></style>
