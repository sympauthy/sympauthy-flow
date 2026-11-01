<script setup lang="ts">
import SignInCard from '@/components/signin/SignInCard.vue'
import BasePage from '@/components/BasePage.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { signInApiKey } from '@/client/api/SignInApi'
import type { SignInFlowResource } from '@/client/model/SignInFlowResource'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { makeErrorRoute } from '@/router'

const { t } = useI18n()
const router = useRouter()
const signInApi = injectRequired(signInApiKey)

const signIn = ref<SignInFlowResource>()

onMounted(async () => {
  const response = await signInApi.fetchSignIn()
  if (response instanceof SuccessApiResponse) {
    // The sign-in step does not apply: the server tells us where to go instead.
    if (response.content.redirect_url) {
      await redirectOrPush(router, response.content.redirect_url)
      return
    }
    signIn.value = response.content
  } else {
    await router.replace(makeErrorRoute(response.errorCode, response.details, response.description))
  }
})
</script>

<template>
  <base-page>
    <div class="flex justify-center w-full">
      <sign-in-card
        v-if="signIn"
        :password="signIn.password"
        :providers="signIn.providers ?? []"
        :sign-up-redirect-url="signIn.sign_up_redirect_url"
      />
      <title-content-card v-else loading>
        <template v-slot:title>{{ t('components.sign_in_card.title') }}</template>
      </title-content-card>
    </div>
  </base-page>
</template>
