<script setup lang="ts">
import { useConfiguration } from '@/stores/ConfigurationStore'
import { storeToRefs } from 'pinia'
import ProviderButton from '@/components/signin/ProviderButton.vue'
import BaseCard from '@/components/BaseCard.vue'

const configurationStore = useConfiguration()
const { configuration } = storeToRefs(configurationStore)
</script>

<template>
  <base-card>
    <template v-slot:title>
      Login using social account to get quick access.
    </template>
    <template v-slot:default>
      <provider-button
        v-for="provider of configuration?.providers"
        v-bind:key="provider.id"
        v-bind:provider="provider"
        size="default"
      />
    </template>
  </base-card>
</template>
