<script setup lang="ts">
import { useConfiguration } from '@/stores/ConfigurationStore'
import { storeToRefs } from 'pinia'
import ProviderButton from '@/components/signin/ProviderButton.vue'

const configurationStore = useConfiguration()
const { configuration } = storeToRefs(configurationStore)
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title w-100 text-center">Login using social account to get quick access.</h5>
      <div class="provider-buttons-container p-5">
        <provider-button
          v-for="provider of configuration?.providers"
          v-bind:key="provider.id"
          v-bind:provider="provider"
          size="default"
        />
      </div>
    </div>
  </div>
</template>
