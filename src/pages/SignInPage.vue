<script setup lang='ts'>
import ByPasswordCard from '@/components/signin/ByPasswordCard.vue'
import ByProviderCard from '@/components/signin/ByProviderCard.vue'
import { useConfiguration } from '@/stores/ConfigurationStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import BasePage from '@/components/BasePage.vue'

const configurationStore = useConfiguration()
const { configuration } = storeToRefs(configurationStore)

const hasProvider = computed(() => {
  return (configuration?.value?.providers ?? []).length > 0
})
</script>

<template>
  <base-page>
    <div class='w-full flex justify-center items-center flex-col-reverse lg:flex-row lg:items-start'>
      <by-provider-card v-if='hasProvider'></by-provider-card>
      <by-password-card></by-password-card>
    </div>
  </base-page>
</template>
