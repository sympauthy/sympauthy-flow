<script lang="ts" setup>
import { DevicePhoneMobileIcon } from '@heroicons/vue/20/solid'
import { CommonButton, outlineColoredButton } from '@sympauthy/design'
import type { Component } from 'vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { redirectOrPush } from '@/utils/VueUtils'
import type { MfaMethodResource } from '@/client/model/MfaFlowResource'

interface Props {
  methods: MfaMethodResource[]
  titleKey: string
  descriptionKey: string
  skipRedirectUrl?: string
}

const props = defineProps<Props>()

const { t } = useI18n()
const router = useRouter()

const methodIcons: Record<string, Component> = {
  totp: DevicePhoneMobileIcon
}

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
      {{ t(titleKey) }}
    </template>

    <template v-slot:default>
      <p>
        {{ t(descriptionKey) }}
      </p>

      <common-button
        v-for="method in methods"
        :key="method.method"
        :button-style="outlineColoredButton"
        :icon="methodIcons[method.method]"
        size="large"
        type="button"
        @click="onSelectMethod(method)"
      >
        <template v-slot:default>
          {{ t(`pages.mfa.methods.${method.method}`, method.method) }}
        </template>
      </common-button>

      <div v-if="skipRedirectUrl" class="text-center">
        <a class="link" @click="onSkip">{{ t('pages.mfa.skip') }}</a>
      </div>
    </template>
  </title-content-card>
</template>

<style scoped></style>
