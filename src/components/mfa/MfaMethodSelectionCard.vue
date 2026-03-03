<script lang="ts" setup>
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import CommonButton from '@/components/CommonButton.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { redirectOrPush } from '@/utils/VueUtils'
import type { MfaMethodResource } from '@/client/model/MfaFlowResource'

interface Props {
  methods: MfaMethodResource[]
  skipRedirectUrl?: string
}

const props = defineProps<Props>()

const { t } = useI18n()
const router = useRouter()

const onSelectMethod = async (method: MfaMethodResource) => {
  await redirectOrPush(router, method.redirect_url)
}

const onSkip = async () => {
  if (props.skipRedirectUrl !== undefined) {
    await redirectOrPush(router, props.skipRedirectUrl)
  }
}
</script>

<template>
  <title-content-card size="default">
    <template v-slot:title>
      {{ t('pages.mfa.title') }}
    </template>

    <template v-slot:default>
      <p class="w-full mb-7 text-justify">
        {{ t('pages.mfa.description') }}
      </p>

      <div class="flex flex-col gap-3 w-full">
        <common-button
          v-for="method in methods"
          :key="method.method"
          class="w-full"
          type="button"
          @click="onSelectMethod(method)"
        >
          <template v-slot:default>
            {{ t(`pages.mfa.methods.${method.method}`, method.method) }}
          </template>
        </common-button>

        <common-button
          v-if="skipRedirectUrl"
          class="w-full"
          type="button"
          @click="onSkip"
        >
          <template v-slot:default>
            {{ t('pages.mfa.skip') }}
          </template>
        </common-button>
      </div>
    </template>
  </title-content-card>
</template>

<style scoped></style>
