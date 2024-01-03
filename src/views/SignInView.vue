<script setup lang='ts'>
import ByPasswordCard from '@/components/signin/ByPasswordCard.vue'
import ByProviderCard from '@/components/signin/ByProviderCard.vue'
</script>

<template>
  <div class='card-group'>
    <ByProviderCard></ByProviderCard>
    <ByPasswordCard></ByPasswordCard>
  </div>
</template>
