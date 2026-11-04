<script lang="ts" setup>
import { SaButton } from '@sympauthy/design'
import type { ProviderResource } from '@/client/model/ProviderResource'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { redirectOrPush } from '@/utils/VueUtils'

const props = defineProps<{
  provider: ProviderResource
}>()

const { t } = useI18n()
const router = useRouter()

async function onClick() {
  // The server already appended the flow state to the authorize URL.
  await redirectOrPush(router, props.provider.authorize_url)
}
</script>

<template>
  <sa-button variant="outline" size="large" type="button" @click="onClick">
    {{ t('components.provider_button.continue_with', [provider.name]) }}
  </sa-button>
</template>

<style scoped></style>
