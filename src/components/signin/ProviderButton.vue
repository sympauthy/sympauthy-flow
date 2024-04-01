<script lang="ts" setup>
import type { ProviderConfigurationResource } from '@/client/model/config/ProviderConfigurationResource'
import { useState } from '@/stores/StateStore'

const stateStore = useState()
const { redirectToAuthenticatedUrl } = stateStore

const props = defineProps<{
  size: 'small' | 'default'
  provider: ProviderConfigurationResource
}>()

function onClick() {
  redirectToAuthenticatedUrl(props.provider.authorize_url)
}
</script>

<template>
  <button @click="onClick" class="btn btn-primary w-full">
    {{ provider.name }}
  </button>
</template>

<style scoped></style>
