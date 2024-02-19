<script setup lang='ts'>
import type { ClaimConfigurationResource } from '@/client/model/config/ClaimConfigurationResource'
import type { YupSchema } from 'vee-validate'

const props = defineProps<{
  claim: ClaimConfigurationResource,
  schema: YupSchema
}>()

</script>

<template>

</template>

<style scoped>

</style>
