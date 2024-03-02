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
  <template v-if="size === 'small'"> </template>
  <template v-if="size === 'default'">
    <button @click="onClick" class="btn btn-primary w-100">
      {{ provider.name }}
    </button>
  </template>
</template>

<style scoped></style>
