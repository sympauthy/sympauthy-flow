<script lang="ts" setup>
import type { ProviderResource } from '@/client/model/ProviderResource'

const props = defineProps<{
  size: 'small' | 'default'
  provider: ProviderResource
}>()

function onClick() {
  // The server already appended the flow state to the authorize URL.
  document.location.href = props.provider.authorize_url
}
</script>

<template>
  <button @click="onClick" class="btn btn-primary w-full">
    {{ provider.name }}
  </button>
</template>

<style scoped></style>
