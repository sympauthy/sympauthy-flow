<script lang='ts' setup>
import type { ProviderConfigurationResource } from '@/client/model/ProviderConfigurationResource'

defineProps<{
  size: 'small' | 'default',
  provider: ProviderConfigurationResource
}>()
</script>

<template>
  <template v-if='size === "small"'>

  </template>
  <template v-if='size === "default"'>
    <button class='btn btn-primary w-100'>
      {{ provider.name }}
    </button>
  </template>
</template>

<style scoped>

</style>
