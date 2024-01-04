<script setup lang='ts'>
import ByPasswordCard from '@/components/signin/ByPasswordCard.vue'
import ByProviderCard from '@/components/signin/ByProviderCard.vue'
import BasePage from '@/components/BasePage.vue'
</script>

<template>
  <base-page>
    <div class='card-group'>
      <by-provider-card></by-provider-card>
      <by-password-card></by-password-card>
    </div>
  </base-page>
</template>
