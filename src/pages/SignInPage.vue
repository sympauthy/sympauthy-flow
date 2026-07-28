<script setup lang="ts">
import ByPasswordCard from '@/components/signin/ByPasswordCard.vue'
import ByProviderCard from '@/components/signin/ByProviderCard.vue'
import BasePage from '@/components/BasePage.vue'
import CommonSpinner from '@/components/CommonSpinner.vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { signInApiKey } from '@/client/api/SignInApi'
import type { SignInFlowResource } from '@/client/model/SignInFlowResource'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { makeErrorRoute } from '@/router'

const router = useRouter()
const signInApi = injectRequired(signInApiKey)

const isLoading = ref(true)
const signIn = ref<SignInFlowResource>()

const providers = computed(() => signIn.value?.providers ?? [])
const hasProvider = computed(() => providers.value.length > 0)

onMounted(async () => {
  const response = await signInApi.fetchSignIn()
  if (response instanceof SuccessApiResponse) {
    // The sign-in step does not apply: the server tells us where to go instead.
    if (response.content.redirect_url) {
      await redirectOrPush(router, response.content.redirect_url)
      return
    }
    signIn.value = response.content
    isLoading.value = false
  } else {
    await router.replace(makeErrorRoute(response.errorCode, response.details, response.description))
  }
})
</script>

<template>
  <base-page>
    <div v-if="isLoading" class="w-full flex justify-center py-10">
      <common-spinner class="h-8 w-8 border-4 text-(--color-primary)" />
    </div>
    <div
      v-else
      class="w-full flex justify-center items-center flex-col-reverse lg:flex-row lg:items-start"
    >
      <by-provider-card v-if="hasProvider" :providers="providers" class="me-3" />
      <by-password-card
        v-if="signIn?.password"
        :password="signIn.password"
        :sign-up-redirect-url="signIn.sign_up_redirect_url"
      />
    </div>
  </base-page>
</template>
