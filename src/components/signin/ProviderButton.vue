<script lang="ts" setup>
import type { ProviderResource } from '@/client/model/ProviderResource'
import { useRouter } from 'vue-router'
import { redirectOrPush } from '@/utils/VueUtils'

const props = defineProps<{
  size: 'small' | 'default'
  provider: ProviderResource
}>()

const router = useRouter()

async function onClick() {
  // The server already appended the flow state to the authorize URL.
  await redirectOrPush(router, props.provider.authorize_url)
}
</script>

<template>
  <button @click="onClick" class="btn btn-primary w-full">
    {{ provider.name }}
  </button>
</template>

<style scoped></style>
