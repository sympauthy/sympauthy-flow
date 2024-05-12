<script lang='ts' setup>
import { useConfiguration } from '@/stores/ConfigurationStore'
import { storeToRefs } from 'pinia'
import ProviderButton from '@/components/signin/ProviderButton.vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'

const configurationStore = useConfiguration()
const { configuration } = storeToRefs(configurationStore)
</script>

<template>
  <title-content-card>
    <template v-slot:title>
      Login using social account to get quick access.
    </template>
    <template v-slot:default>
      <provider-button
        v-for='provider of configuration?.providers'
        v-bind:key='provider.id'
        size='default'
        v-bind:provider='provider'
      />
    </template>
  </title-content-card>
</template>
