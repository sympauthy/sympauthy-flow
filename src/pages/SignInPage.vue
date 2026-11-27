<script setup lang="ts">
import SignInCard from '@/components/signin/SignInCard.vue'
import BasePage from '@/components/BasePage.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { injectRequired, isClickInPlace, linkAttributes, redirectOrPush } from '@/utils/VueUtils'
import { signInApiKey } from '@/client/api/SignInApi'
import type { SignInFlowResource } from '@/client/model/SignInFlowResource'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { getStateQueryParam, makeApiErrorRoute } from '@/router'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const signInApi = injectRequired(signInApiKey)

const signIn = ref<SignInFlowResource>()
// Whether a sign-in is on its way, or has moved the person on.
const isSigningIn = ref(false)

async function onSignUpClick(event: MouseEvent) {
  if (!isClickInPlace(event)) {
    return
  }
  event.preventDefault()
  // A sign-in in flight would still move the person on once it answers, away from the sign-up page.
  if (isSigningIn.value || !signIn.value?.sign_up_redirect_url) {
    return
  }
  await redirectOrPush(router, signIn.value.sign_up_redirect_url)
}

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
    await router.replace(makeApiErrorRoute(getStateQueryParam(route), response))
  }
})
</script>

<template>
  <base-page
    :cancel-disabled="isSigningIn"
    :cancel-url="signIn?.cancel_url"
    :client="signIn?.client"
  >
    <div class="flex w-full flex-col items-center gap-6">
      <sign-in-card
        v-if="signIn"
        @busy="isSigningIn = $event"
        :client="signIn.client"
        :password="signIn.password"
        :providers="signIn.providers ?? []"
        :reset-password-redirect-url="signIn.reset_password_redirect_url"
      />
      <title-content-card v-else loading>
        <template v-slot:title>{{ t('components.sign_in_card.title') }}</template>
      </title-content-card>

      <i18n-t
        v-if="signIn?.sign_up_redirect_url"
        keypath="components.sign_in_card.no_account"
        tag="p"
        class="text-center"
      >
        <a
          v-bind="linkAttributes(signIn.sign_up_redirect_url, isSigningIn)"
          class="sa-link"
          @click="onSignUpClick"
        >
          {{ t('components.sign_in_card.sign_up_action') }}
        </a>
      </i18n-t>
    </div>
  </base-page>
</template>
