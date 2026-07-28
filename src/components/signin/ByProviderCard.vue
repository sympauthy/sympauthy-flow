<script lang="ts" setup>
import ProviderButton from '@/components/signin/ProviderButton.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import type { ProviderResource } from '@/client/model/ProviderResource'

defineProps<{
  providers: Array<ProviderResource>
}>()
</script>

<template>
  <title-content-card>
    <template v-slot:title> Login using social account to get quick access. </template>
    <template v-slot:default>
      <provider-button
        v-for="provider of providers"
        v-bind:key="provider.id"
        size="default"
        v-bind:provider="provider"
      />
    </template>
  </title-content-card>
</template>
